import { spawn } from "node:child_process"
import { once } from "node:events"
import { createWriteStream } from "node:fs"
import { access, mkdir, mkdtemp, readdir, readFile, rename, rm, stat, statfs } from "node:fs/promises"
import { homedir, tmpdir } from "node:os"
import path from "node:path"
import { blobFile, manifestDigests, manifestSegments, storedManifestFile, storedModelName } from "./progress"
import { copyFile, type Shelf } from "./shelf"

/** The engine's local address. The app only ever talks to this machine. */
export const engineUrl = "http://127.0.0.1:11434"

/** The engine's release for 64-bit Windows: the program without an installer, made to run inside another app. */
export const engineDownloadUrl = "https://github.com/ollama/ollama/releases/latest/download/ollama-windows-amd64.zip"

const programName = process.platform === "win32" ? "ollama.exe" : "ollama"

const exists = (file: string) =>
  access(file).then(
    () => true,
    () => false,
  )

const sizeOf = (file: string) =>
  stat(file).then(
    (info) => info.size,
    () => undefined,
  )

/** Calls the engine. Rejects on a network failure, at the timeout, or when `signal` aborts. */
export function engineFetch(
  route: string,
  init: { method?: string; body?: unknown; signal?: AbortSignal; timeoutMs?: number },
) {
  const signals = [init.signal, init.timeoutMs ? AbortSignal.timeout(init.timeoutMs) : undefined].filter(
    (signal) => signal !== undefined,
  )

  return fetch(`${engineUrl}${route}`, {
    method: init.method ?? "GET",
    headers: init.body === undefined ? undefined : { "content-type": "application/json" },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    signal: signals.length > 0 ? AbortSignal.any(signals) : undefined,
  })
}

/** The running engine's version; undefined while nothing answers. */
export async function engineVersion() {
  try {
    const response = await engineFetch("/api/version", { timeoutMs: 2500 })
    const body: unknown = await response.json()

    return response.ok &&
      typeof body === "object" &&
      body !== null &&
      "version" in body &&
      typeof body.version === "string"
      ? body.version
      : undefined
  } catch {
    return undefined
  }
}

/** Where the engine keeps its models: `OLLAMA_MODELS`, else `.ollama/models` in the home folder. */
export function modelsDirectory() {
  return process.env.OLLAMA_MODELS || path.join(homedir(), ".ollama", "models")
}

/** Free bytes on the drive that holds `directory`; undefined when it cannot be read. */
export function freeBytes(directory: string) {
  return statfs(directory).then(
    (info) => info.bavail * info.bsize,
    () => undefined,
  )
}

/**
 * The engine program on this machine: the app's own copy first, then the usual install folder, then `PATH`.
 * Undefined when there is none.
 */
export async function findProgram(privateDirectory: string) {
  const candidates = [
    path.join(privateDirectory, programName),
    ...(process.env.LOCALAPPDATA ? [path.join(process.env.LOCALAPPDATA, "Programs", "Ollama", programName)] : []),
    ...(process.env.PATH ?? "")
      .split(path.delimiter)
      .filter((directory) => directory !== "")
      .map((directory) => path.join(directory, programName)),
  ]

  for (const candidate of candidates) if (await exists(candidate)) return candidate

  return undefined
}

/**
 * Starts the engine in the background, listening on this machine only. It keeps running after the app closes, so
 * the terminal and other tools can use the same models.
 */
export function startProgram(program: string) {
  const child = spawn(program, ["serve"], {
    detached: true,
    stdio: "ignore",
    windowsHide: true,
    env: { ...process.env, OLLAMA_HOST: "127.0.0.1:11434" },
  })

  child.on("error", () => undefined)
  child.unref()
}

/**
 * Downloads `url` to `file` through `file.part`, continuing a partial file from where it stopped. `progress` gets
 * the bytes on disk and the full size (0 while unknown).
 */
export async function downloadFile(
  url: string,
  file: string,
  progress: (completed: number, total: number) => void,
  signal: AbortSignal,
) {
  const partial = `${file}.part`

  await mkdir(path.dirname(file), { recursive: true })
  const have = (await sizeOf(partial)) ?? 0
  const response = await fetch(url, { signal, headers: have > 0 ? { range: `bytes=${have}-` } : undefined })

  // 416: the partial file already holds every byte.
  if (response.status === 416) return rename(partial, file)
  if (!response.ok || !response.body) throw new Error(`Download failed: HTTP ${response.status}`)
  const resumed = response.status === 206
  const offset = resumed ? have : 0
  const total = offset + Number(response.headers.get("content-length") ?? 0)
  const output = createWriteStream(partial, { flags: resumed ? "a" : "w" })
  const counted = { bytes: offset }

  try {
    for await (const chunk of response.body) {
      if (!output.write(chunk)) await once(output, "drain")
      counted.bytes += chunk.byteLength
      progress(counted.bytes, total)
    }
  } finally {
    output.end()
    await once(output, "close")
  }

  if (total > 0 && counted.bytes < total) throw new Error("Download stopped early")
  await rename(partial, file)
}

/** Unpacks a zip into `directory` with the system's `tar`, which reads zip files on Windows 10 and later. */
export async function unpack(archive: string, directory: string) {
  const child = spawn("tar", ["-xf", archive, "-C", directory], { stdio: "ignore", windowsHide: true })
  const [code] = await once(child, "exit")

  if (code !== 0) throw new Error(`Unpacking failed with code ${String(code)}`)
}

/** The blob files a manifest's text names; undefined when it is not a usable manifest. */
function manifestBlobs(content: string | undefined) {
  if (content === undefined) return undefined

  try {
    return manifestDigests(JSON.parse(content)).flatMap((item) => {
      const file = blobFile(item.digest)

      return file ? [{ file, size: item.size }] : []
    })
  } catch {
    return undefined
  }
}

const readText = (file: string) => readFile(file, "utf8").catch(() => undefined)

/**
 * Whether the shelf holds this installed model in full: its manifest and every blob at full size. The blob list
 * comes from the engine's own manifest, so only the shelf's file list is read.
 */
export async function hasStored(name: string, models: string, shelf: Shelf) {
  const segments = manifestSegments(name)

  if (!segments) return false
  const blobs = manifestBlobs(await readText(path.join(models, "manifests", ...segments)))

  if (!blobs || blobs.length === 0) return false
  const there = new Map((await shelf.list()).map((file) => [file.name, file.size]))

  return there.has(storedManifestFile(segments)) && blobs.every((blob) => there.get(blob.file) === blob.size)
}

/** Counts the bytes of a model's blobs as they move, for one progress line. */
const counter = (blobs: readonly { size: number }[], progress: (completed: number, total: number) => void) => {
  const total = blobs.reduce((sum, blob) => sum + blob.size, 0)
  const counted = { bytes: 0 }

  return (bytes: number) => {
    counted.bytes += bytes
    progress(counted.bytes, total)
  }
}

/**
 * Puts an installed model on the shelf, one file at a time: its blobs, then its manifest last, so a copy that stops
 * half way never looks complete. Blobs already there at full size are skipped, so pressing copy again continues.
 */
export async function storeModel(
  name: string,
  models: string,
  shelf: Shelf,
  progress: (completed: number, total: number) => void,
  signal: AbortSignal,
) {
  const segments = manifestSegments(name)
  const manifest = segments ? path.join(models, "manifests", ...segments) : undefined
  const blobs = manifest ? manifestBlobs(await readText(manifest)) : undefined

  if (!segments || !manifest || !blobs) throw new Error(`Model files not found: ${name}`)
  const there = new Map((await shelf.list()).map((file) => [file.name, file.size]))
  const moved = counter(blobs, progress)

  for (const blob of blobs) {
    if (there.get(blob.file) === blob.size) moved(blob.size)
    else await shelf.put(path.join(models, "blobs", blob.file), blob.file, moved, signal)
  }

  await shelf.put(manifest, storedManifestFile(segments), () => undefined, signal)
}

/** Brings a model from the shelf back into the engine's models folder. Blobs already here are kept as they are. */
export async function restoreModel(
  name: string,
  models: string,
  shelf: Shelf,
  progress: (completed: number, total: number) => void,
  signal: AbortSignal,
) {
  const segments = manifestSegments(name)

  if (!segments) throw new Error(`Copy not found: ${name}`)
  // The manifest comes first, to a temporary place: it says which blobs to bring, and it goes into the engine's
  // folder last, so the engine never lists a model whose files are not all there.
  const temp = await mkdtemp(path.join(tmpdir(), "apna-manifest-"))
  const staged = path.join(temp, "manifest")

  try {
    await shelf.get(storedManifestFile(segments), staged, () => undefined, signal)
    const blobs = manifestBlobs(await readText(staged))

    if (!blobs) throw new Error(`Copy not found: ${name}`)
    const moved = counter(blobs, progress)

    for (const blob of blobs) {
      const target = path.join(models, "blobs", blob.file)

      if ((await sizeOf(target)) === blob.size) moved(blob.size)
      else await shelf.get(blob.file, target, moved, signal)
    }

    await mkdir(path.dirname(path.join(models, "manifests", ...segments)), { recursive: true })
    await copyFile(staged, path.join(models, "manifests", ...segments), () => undefined, signal)
  } finally {
    await rm(temp, { recursive: true, force: true })
  }
}

/** The names of the models the shelf holds a manifest for. */
export async function listStored(shelf: Shelf): Promise<readonly string[]> {
  return (await shelf.list()).flatMap((file) => storedModelName(file.name) ?? [])
}

/**
 * Deletes the unfinished files of the given layers from a models folder. The engine keeps a layer it is still
 * downloading as "sha256-<hash>-partial" plus numbered parts beside it; finished layers are never touched.
 */
export async function removePartials(models: string, digests: readonly string[]) {
  const folder = path.join(models, "blobs")
  const prefixes = digests.flatMap((digest) => {
    const file = blobFile(digest)

    return file ? [`${file}-partial`] : []
  })

  if (prefixes.length === 0) return
  const files = await readdir(folder).catch((): string[] => [])

  await Promise.all(
    files
      .filter((file) => prefixes.some((prefix) => file.startsWith(prefix)))
      .map((file) => rm(path.join(folder, file), { force: true }).catch(() => undefined)),
  )
}

/** Deletes a file, ignoring one that is not there. */
export function removeFile(file: string) {
  return rm(file, { force: true })
}
