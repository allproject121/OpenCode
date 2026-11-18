import { once } from "node:events"
import { createReadStream, createWriteStream } from "node:fs"
import { copyFile as copyWhole, mkdir, mkdtemp, readdir, readFile, rename, rm, stat } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

/** One file on a shelf. */
export type ShelfFile = { readonly name: string; readonly size: number }

/**
 * A flat place that keeps model files: a folder on this machine, or the cloud reached through the Cloud-SSD app.
 * Every file is addressed by its plain name.
 */
export type Shelf = {
  /** Shown to the user as where the models are kept. */
  readonly label: string
  /** The files there now. */
  list(): Promise<readonly ShelfFile[]>
  /** Puts the local file `from` on the shelf as `name`. The local file stays. */
  put(from: string, name: string, moved: (bytes: number) => void, signal: AbortSignal): Promise<void>
  /** Brings the file `name` to the local path `to`. */
  get(name: string, to: string, moved: (bytes: number) => void, signal: AbortSignal): Promise<void>
  /** Lets the shelf drop what it keeps on this machine for files that are safely away. Optional. */
  settle?(): Promise<void>
}

const sizeOf = (file: string) =>
  stat(file).then(
    (info) => info.size,
    () => undefined,
  )

/** Copies one file through `to.part`, reporting each chunk's bytes. A target of the same size is left alone. */
export async function copyFile(from: string, to: string, moved: (bytes: number) => void, signal: AbortSignal) {
  const size = await sizeOf(from)

  if (size === undefined) throw new Error(`Missing file: ${from}`)
  if ((await sizeOf(to)) === size) return moved(size)
  await mkdir(path.dirname(to), { recursive: true })
  const output = createWriteStream(`${to}.part`)

  try {
    for await (const chunk of createReadStream(from, { signal, highWaterMark: 4 * 1024 * 1024 })) {
      if (!output.write(chunk)) await once(output, "drain")
      moved(chunk.byteLength)
    }
  } finally {
    output.end()
    await once(output, "close")
  }

  await rename(`${to}.part`, to)
}

/** Moves a file; across disks, where a rename cannot, by copying it and deleting the source. */
async function moveFile(from: string, to: string) {
  await rename(from, to).catch(async (error: unknown) => {
    if (!(error instanceof Error && "code" in error && error.code === "EXDEV")) throw error
    await copyWhole(from, to)
    await rm(from, { force: true })
  })
}

/** A plain folder: a disk, a USB stick, or any folder the user picked. */
export function folderShelf(folder: string): Shelf {
  return {
    label: folder,
    list: async () => {
      const names = await readdir(folder).catch((): string[] => [])
      const sizes = await Promise.all(names.map((name) => sizeOf(path.join(folder, name))))

      return names.flatMap((name, index) => {
        const size = sizes[index]

        return size === undefined || name.endsWith(".part") ? [] : [{ name, size }]
      })
    },
    put: (from, name, moved, signal) => copyFile(from, path.join(folder, name), moved, signal),
    get: (name, to, moved, signal) => copyFile(path.join(folder, name), to, moved, signal),
  }
}

/** Where the Cloud-SSD app answers on this machine, from its link file. */
export type Link = { readonly url: string; readonly key: string; readonly pid: number }

/** Reads the Cloud-SSD app's link file. Only a loopback address is accepted, so the key never leaves this machine. */
export function parseLink(text: string): Link | undefined {
  try {
    const value: unknown = JSON.parse(text.replace(/^﻿/, ""))

    if (typeof value !== "object" || value === null) return undefined
    const url: unknown = Reflect.get(value, "url")
    const key: unknown = Reflect.get(value, "key")
    const pid: unknown = Reflect.get(value, "pid")

    if (typeof url !== "string" || typeof key !== "string" || key === "" || typeof pid !== "number") return undefined
    const address = new URL(url)

    if (address.protocol !== "http:" || address.hostname !== "127.0.0.1") return undefined

    return { url: address.origin, key, pid }
  } catch {
    return undefined
  }
}

/** The Cloud-SSD app's link file. */
export const linkFile = () => path.join(process.env.LOCALAPPDATA ?? "", "Cloud-SSD", "app-link.json")

const readLink = async () => parseLink(await readFile(linkFile(), "utf8").catch(() => ""))

const errorOf = async (response: Response) => {
  const body: unknown = await response.json().catch(() => undefined)
  const error = typeof body === "object" && body !== null ? Reflect.get(body, "error") : undefined

  return typeof error === "string" && error !== "" ? error : `Cloud-SSD answered HTTP ${response.status}`
}

/**
 * Calls the Cloud-SSD app. The key changes at every start of that app, so a refused key reads the link file once
 * more and tries again.
 */
async function call(route: string, init: { method?: string; signal?: AbortSignal } = {}): Promise<unknown> {
  for (const attempt of [1, 2]) {
    const link = await readLink()

    if (!link) throw new Error("Cloud-SSD is not running. Open the Cloud-SSD app, then try again.")
    const response = await fetch(`${link.url}${route}`, {
      method: init.method ?? "GET",
      // The Cloud-SSD app shows which app used its link.
      headers: { authorization: `Bearer ${link.key}`, "x-app": "OpenCode" },
      signal: AbortSignal.any([AbortSignal.timeout(30_000), ...(init.signal ? [init.signal] : [])]),
    }).catch((error: unknown) => {
      if (init.signal?.aborted) throw error

      throw new Error("Cloud-SSD is not answering. Open the Cloud-SSD app, then try again.")
    })

    if (response.status === 401 && attempt === 1) continue
    if (!response.ok) throw new Error(await errorOf(response))

    return response.json()
  }

  throw new Error("Cloud-SSD refused the key.")
}

const field = (value: unknown, key: string) =>
  typeof value === "object" && value !== null ? Reflect.get(value, key) : undefined

/** Waits for a Cloud-SSD job, reporting the bytes it moved since the last look. */
async function follow(job: string, moved: (bytes: number) => void, signal: AbortSignal) {
  const seen = { bytes: 0 }

  while (!signal.aborted) {
    const state = await call(`/api/link/job?id=${encodeURIComponent(job)}`, { signal })
    const bytes = Number(field(state, "bytes") ?? 0)

    if (bytes > seen.bytes) moved(bytes - seen.bytes)
    seen.bytes = Math.max(seen.bytes, bytes)

    if (field(state, "done") === true) {
      if (field(state, "ok") === true) return
      const error = field(state, "error")

      throw new Error(typeof error === "string" && error !== "" ? error : "Cloud-SSD could not finish the transfer.")
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  throw new Error("Stopped.")
}

/** Whether the Cloud-SSD app answers now. */
export async function linkReady() {
  return call("/api/link/info").then(
    () => true,
    () => false,
  )
}

/**
 * The cloud reached through the Cloud-SSD app. Files go straight to the cloud and come straight back; nothing is
 * written through the cloud drive's letter, so no second copy is left in its cache on this machine.
 */
export function linkShelf(folder: string): Shelf {
  const query = (input: Record<string, string>) => new URLSearchParams(input).toString()

  return {
    label: `Cloud-SSD › ${folder}`,
    list: async () => {
      const result = await call(`/api/link/list?${query({ dir: folder })}`)
      const items: unknown = field(result, "items")

      return (Array.isArray(items) ? items : []).flatMap((item) => {
        const name = field(item, "name")
        const size = field(item, "size")

        return typeof name === "string" && typeof size === "number" && field(item, "isDir") !== true
          ? [{ name, size }]
          : []
      })
    },
    put: async (from, name, moved, signal) => {
      // The cloud keeps a file under its own name, so a file named otherwise goes up from a temporary copy.
      const temp = path.basename(from) === name ? undefined : await mkdtemp(path.join(tmpdir(), "apna-shelf-"))
      const source = temp ? path.join(temp, name) : from

      try {
        if (temp) await copyWhole(from, source)
        const started = await call(`/api/link/store?${query({ path: source, to: folder, move: temp ? "1" : "0" })}`, {
          method: "POST",
          signal,
        })

        await follow(String(field(started, "job")), moved, signal)
      } finally {
        if (temp) await rm(temp, { recursive: true, force: true })
      }
    },
    get: async (name, to, moved, signal) => {
      // The file lands under its own name in a temporary folder, then moves into place, so a transfer that stops
      // never leaves half a file under the real name. The engine's own folders get nothing but finished files.
      const temp = await mkdtemp(path.join(tmpdir(), "apna-fetch-"))

      try {
        const started = await call(`/api/link/fetch?${query({ from: `${folder}/${name}`, to: temp })}`, {
          method: "POST",
          signal,
        })

        await follow(String(field(started, "job")), moved, signal)
        await mkdir(path.dirname(to), { recursive: true })
        await moveFile(path.join(temp, name), to)
      } finally {
        await rm(temp, { recursive: true, force: true })
      }
    },
    settle: async () => {
      await call(`/api/link/free?${query({ dir: folder })}`, { method: "POST" })
    },
  }
}
