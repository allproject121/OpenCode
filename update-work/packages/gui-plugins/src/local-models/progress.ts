/** One line of the engine's pull stream. */
export type PullEvent = {
  readonly status?: string
  readonly digest?: string
  readonly total?: number
  readonly completed?: number
  readonly error?: string
}

/** Bytes per layer; the engine reports each layer (file) of a model separately. */
export type PullProgress = {
  readonly layers: Readonly<Record<string, { readonly total: number; readonly completed: number }>>
  readonly status: string
}

export const emptyProgress: PullProgress = { layers: {}, status: "" }

/** Adds one stream line. A layer never moves backwards: a retry reports the bytes on disk again from a lower count. */
export function foldPull(progress: PullProgress, event: PullEvent): PullProgress {
  const status = event.status ?? progress.status

  if (!event.digest || typeof event.total !== "number") return { layers: progress.layers, status }
  const previous = progress.layers[event.digest]

  return {
    status,
    layers: {
      ...progress.layers,
      [event.digest]: {
        total: event.total,
        completed: Math.max(previous?.completed ?? 0, Math.min(event.completed ?? 0, event.total)),
      },
    },
  }
}

/** The whole model's bytes so far. `total` grows while the engine is still announcing layers. */
export function pullTotals(progress: PullProgress) {
  return Object.values(progress.layers).reduce(
    (sum, layer) => ({ completed: sum.completed + layer.completed, total: sum.total + layer.total }),
    { completed: 0, total: 0 },
  )
}

/** Splits streamed text into complete lines and the unfinished rest. */
export function splitLines(buffer: string) {
  const parts = buffer.split("\n")

  return { lines: parts.slice(0, -1).filter((line) => line.trim() !== ""), rest: parts.at(-1) ?? "" }
}

const text = (value: unknown) => (typeof value === "string" ? value : undefined)
const count = (value: unknown) => (typeof value === "number" ? value : undefined)

/** Reads the fields of a parsed JSON object; undefined for anything else. */
function fields(value: unknown): Readonly<Record<string, unknown>> | undefined {
  return typeof value === "object" && value !== null ? Object.fromEntries(Object.entries(value)) : undefined
}

/** Parses one stream line; a line that is not a JSON object is skipped. */
export function parsePullLine(line: string): PullEvent | undefined {
  try {
    const record = fields(JSON.parse(line))

    if (!record) return undefined

    return {
      status: text(record.status),
      digest: text(record.digest),
      total: count(record.total),
      completed: count(record.completed),
      error: text(record.error),
    }
  } catch {
    return undefined
  }
}

const defaultHost = "registry.ollama.ai"

/**
 * Where the engine keeps a model's manifest, relative to its `manifests` folder: host, namespace, model, tag.
 * "qwen2.5:7b" is registry.ollama.ai/library/qwen2.5/7b; "hf.co/user/repo:Q4" is hf.co/user/repo/Q4.
 * Undefined for a name that would leave that folder.
 */
export function manifestSegments(name: string): readonly string[] | undefined {
  const slash = name.lastIndexOf("/")
  const colon = name.indexOf(":", slash + 1)
  const tag = colon < 0 ? "latest" : name.slice(colon + 1)
  const parts = (colon < 0 ? name : name.slice(0, colon)).split("/")
  const unsafe = (part: string) => part === "" || part === "." || part === ".." || /[\\/:*?"<>|+]/.test(part)

  if (unsafe(tag) || parts.some(unsafe) || parts.length > 3) return undefined
  if (parts.length === 1) return [defaultHost, "library", parts[0] ?? "", tag]
  if (parts.length === 2) return [defaultHost, parts[0] ?? "", parts[1] ?? "", tag]

  return [parts[0] ?? "", parts[1] ?? "", parts[2] ?? "", tag]
}

/** The model name for a manifest path, the reverse of `manifestSegments`. */
export function modelName(segments: readonly string[]) {
  const [host, namespace, model, tag] = segments

  if (host === defaultHost && namespace === "library") return `${model}:${tag}`
  if (host === defaultHost) return `${namespace}/${model}:${tag}`

  return `${host}/${namespace}/${model}:${tag}`
}

/**
 * A model's manifest in the copy folder. That folder is flat (one folder, no tree), because every new folder on a
 * cloud drive is a slow remote call: "qwen2.5:7b" is stored as "manifest+registry.ollama.ai+library+qwen2.5+7b.json".
 */
export function storedManifestFile(segments: readonly string[]) {
  return `manifest+${segments.join("+")}.json`
}

/** The model name of a copy-folder manifest file; undefined for any other file. */
export function storedModelName(file: string) {
  const segments = /^manifest\+(.+)\.json$/.exec(file)?.[1]?.split("+") ?? []

  return segments.length === 4 && segments.every((part) => part !== "") ? modelName(segments) : undefined
}

/** The blob file name of a digest: "sha256:abc…" is stored as "sha256-abc…". Undefined for anything else. */
export function blobFile(digest: string) {
  return /^sha256:[0-9a-f]{64}$/.test(digest) ? digest.replace(":", "-") : undefined
}

/** The files a manifest needs: its config and every layer. */
export function manifestDigests(manifest: unknown): readonly { digest: string; size: number }[] {
  const record = fields(manifest)

  if (!record) return []

  return [record.config, ...(Array.isArray(record.layers) ? record.layers : [])].flatMap((entry) => {
    const item = fields(entry)
    const digest = text(item?.digest)
    const size = count(item?.size)

    return digest !== undefined && size !== undefined ? [{ digest, size }] : []
  })
}

/** Bytes per second between the oldest and newest sample; 0 with fewer than two. */
export function speedOf(samples: readonly { readonly at: number; readonly bytes: number }[]) {
  const first = samples[0]
  const last = samples.at(-1)

  if (!first || !last || last.at <= first.at) return 0

  return Math.max(0, ((last.bytes - first.bytes) * 1000) / (last.at - first.at))
}
