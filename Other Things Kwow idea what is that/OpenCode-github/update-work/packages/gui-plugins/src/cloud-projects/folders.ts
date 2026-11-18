import path from "node:path"

/** The folder inside Cloud-SSD's fast drive that holds the coding projects. */
export const projectsFolderName = "Coding-Projects"

/**
 * Folders a project can build again by itself. They are left behind when a folder is brought to Cloud-SSD: they hold
 * tens of thousands of files and would keep the upload busy for hours.
 */
export const skipped: readonly string[] = [
  "node_modules",
  "dist",
  "build",
  "out",
  "target",
  ".next",
  ".nuxt",
  ".turbo",
  ".cache",
  ".venv",
  "venv",
  "__pycache__",
]

/**
 * The real folder behind Cloud-SSD's fast drive, read from the text of the Cloud-SSD app's settings file. New things
 * in it are plain local folders that the Cloud-SSD app uploads by itself. Undefined when the fast drive is off or the
 * file cannot be read.
 *
 * @param home - The user's home folder; the fast drive sits under it unless the settings name another place.
 */
export function fastFolder(settings: string, home: string): string | undefined {
  try {
    const parsed: unknown = JSON.parse(settings.replace(/^\uFEFF/, ""))
    const hybrid: unknown = typeof parsed === "object" && parsed !== null ? Reflect.get(parsed, "Hybrid") : undefined

    if (typeof hybrid !== "object" || hybrid === null || Reflect.get(hybrid, "Enabled") !== true) return undefined
    const root: unknown = Reflect.get(hybrid, "Root")

    return typeof root === "string" && root.trim() !== "" ? root : path.join(home, "Cloud-SSD", "All Accounts")
  } catch {
    return undefined
  }
}

/** Names Windows keeps for devices; a folder cannot have one. */
const reserved = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i

/**
 * Why a project name cannot be used, or undefined when it can. A name is one folder name: letters, digits, spaces,
 * dots, dashes and underscores, starting with a letter or digit.
 */
export function nameProblem(name: string): "empty" | "characters" | "reserved" | undefined {
  const trimmed = name.trim()

  if (trimmed === "") return "empty"
  // Letters of any script count, with the marks that sit on them.
  if (!/^[\p{L}\p{N}][\p{L}\p{M}\p{N} ._-]{0,59}$/u.test(trimmed) || /[ .]$/.test(trimmed)) return "characters"

  return reserved.test(trimmed) ? "reserved" : undefined
}

/** Whether a file or folder is brought along when a folder is copied to Cloud-SSD. */
export function carried(source: string, entry: string) {
  const parts = path.relative(source, entry).split(/[\\/]/)

  return !parts.some((part) => skipped.includes(part))
}
