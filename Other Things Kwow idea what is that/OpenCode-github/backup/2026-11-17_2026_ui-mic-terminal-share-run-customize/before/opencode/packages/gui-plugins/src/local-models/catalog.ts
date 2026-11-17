/**
 * A model offered on the page before the user types a name. Sizes are approximate download sizes. What each one is
 * for is copy, under the key `use.<name>`.
 */
export type Suggestion = {
  readonly name: string
  readonly gigabytes: number
}

/**
 * A short starting list of well-known models from the public library. Any other library name can be typed on the
 * page; this list only saves typing.
 */
export const suggestions: readonly Suggestion[] = [
  { name: "qwen2.5:7b", gigabytes: 4.7 },
  { name: "qwen2.5-coder:7b", gigabytes: 4.7 },
  { name: "qwen2.5-coder:1.5b", gigabytes: 1.0 },
  { name: "qwen3:8b", gigabytes: 5.2 },
  { name: "llama3.2:3b", gigabytes: 2.0 },
  { name: "gemma3:4b", gigabytes: 3.3 },
  { name: "deepseek-r1:8b", gigabytes: 5.2 },
  { name: "phi4-mini", gigabytes: 2.5 },
  { name: "mistral:7b", gigabytes: 4.4 },
  { name: "nomic-embed-text", gigabytes: 0.3 },
  { name: "qwen2.5-coder:14b", gigabytes: 9.0 },
  { name: "gpt-oss:20b", gigabytes: 14 },
]

/**
 * Whether a model of this size is likely to run acceptably: it must fit in about half of the machine's memory,
 * leaving room for the app, the browser and the model's working context.
 */
export function fits(gigabytes: number, ramBytes: number) {
  return gigabytes * 1024 ** 3 <= ramBytes * 0.5
}

/** Bytes as a short size: "4.7 GB", "320 MB". */
export function formatBytes(bytes: number) {
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(bytes >= 10 * 1024 ** 3 ? 0 : 1)} GB`
  if (bytes >= 1024 ** 2) return `${Math.round(bytes / 1024 ** 2)} MB`

  return `${Math.max(0, Math.round(bytes / 1024))} KB`
}

/**
 * The remaining time as a copy key and its values, so each language words it its own way: hours and minutes, whole
 * minutes, or seconds; unknown while the speed is.
 */
export function timeLeft(
  remainingBytes: number,
  bytesPerSecond: number,
): { readonly key: string; readonly params: Readonly<Record<string, number>> } {
  if (bytesPerSecond <= 0) return { key: "left.unknown", params: {} }
  const seconds = Math.ceil(remainingBytes / bytesPerSecond)

  if (seconds >= 3600)
    return {
      key: "left.hours",
      params: { hours: Math.floor(seconds / 3600), minutes: Math.round((seconds % 3600) / 60) },
    }
  if (seconds >= 60) return { key: "left.minutes", params: { minutes: Math.round(seconds / 60) } }

  return { key: "left.seconds", params: { seconds } }
}
