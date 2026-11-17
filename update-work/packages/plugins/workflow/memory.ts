// The user's saved memories: one short fact per line in `memory.md` in this app's settings folder. The same format is
// read and written by the Customize page (gui-plugins/src/customize/memory.ts); keep the two in step.

const header = "# Memory\n\nThings the user asked the AI to remember. One per line.\n\n"

/** The memories in a memory file, in order. Lines that are not "- ..." bullets are ignored. */
export function parseMemories(text: string | undefined): string[] {
  return (text ?? "")
    .split(/\r?\n/)
    .flatMap((line) => {
      const match = line.match(/^\s*[-*]\s+(.*\S)\s*$/)

      return match ? [match[1]!] : []
    })
}

/** The memory file for a list of memories. */
export function formatMemories(memories: readonly string[]): string {
  return header + memories.map((memory) => `- ${memory.replace(/\s+/g, " ").trim()}`).join("\n") + "\n"
}

/** The list with one more memory; unchanged when it is empty or already there (ignoring case). */
export function addMemory(memories: readonly string[], text: string): string[] {
  const clean = text.replace(/\s+/g, " ").trim()

  if (clean === "" || memories.some((memory) => memory.toLowerCase() === clean.toLowerCase())) return [...memories]

  return [...memories, clean]
}

/** The list without the memories that contain `text` (ignoring case); with how many went. */
export function forgetMemories(memories: readonly string[], text: string): { left: string[]; removed: number } {
  const needle = text.trim().toLowerCase()

  if (needle === "") return { left: [...memories], removed: 0 }
  const left = memories.filter((memory) => !memory.toLowerCase().includes(needle))

  return { left, removed: memories.length - left.length }
}

/** What every request carries about the memories; undefined when there are none. */
export function memoryPrompt(memories: readonly string[]): string | undefined {
  if (memories.length === 0) return undefined

  return [
    "Saved memories about the user (they asked you to remember these; use them when they matter, do not repeat them back unprompted):",
    ...memories.map((memory) => `- ${memory}`),
  ].join("\n")
}
