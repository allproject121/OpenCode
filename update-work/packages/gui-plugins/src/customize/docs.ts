import path from "node:path"

/**
 * The three things the user writes as a markdown file that OpenCode reads from its settings folder:
 * - `skill`: `<settings>/skills/<name>/SKILL.md`. Instructions the AI loads when the task fits, or when asked.
 * - `command`: `<settings>/commands/<name>.md`. A prompt the user sends by typing `/<name>`.
 * - `agent`: `<settings>/agents/<name>.md`. A helper with its own instructions that the AI hands work to.
 */
export type DocKind = "skill" | "command" | "agent"

export type Doc = {
  readonly kind: DocKind
  /** What OpenCode knows it by: the skill's folder, or the file name without ".md". */
  readonly name: string
  readonly description: string
  /** Skill: what to do. Command: the prompt that is sent. Agent: its instructions (its whole system prompt). */
  readonly body: string
  /** Skill only: the AI may pick it up by itself. False keeps it for when the user names it. */
  readonly auto: boolean
  /**
   * Agent only.
   * - `subagent`: the AI hands work to it.
   * - `primary`: the user picks it in the chat box.
   * - `all`: both.
   */
  readonly mode: "subagent" | "primary" | "all"
}

/** Names are folder and file names and slash-command words: small letters, digits and dashes. */
export function validName(name: string) {
  return /^[a-z0-9][a-z0-9-]{0,47}$/.test(name)
}

/** A typed title made into a name: "My Deploy Steps!" becomes "my-deploy-steps". */
export function toName(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48)
    .replace(/-+$/, "")
}

/** The folder of one kind inside the settings folder. */
export function kindFolder(kind: DocKind, directory: string) {
  return path.join(directory, kind === "skill" ? "skills" : kind === "command" ? "commands" : "agents")
}

/** The file a doc is stored in. */
export function docFile(kind: DocKind, directory: string, name: string) {
  const folder = kindFolder(kind, directory)

  return kind === "skill" ? path.join(folder, name, "SKILL.md") : path.join(folder, `${name}.md`)
}

// A JSON string is also a YAML double-quoted string, so any text is safe as a front matter value.
const quote = (value: string) => JSON.stringify(value)

/** The file's text: front matter, then the body. */
export function formatDoc(doc: Doc) {
  const fields =
    doc.kind === "skill"
      ? [
          `name: ${quote(doc.name)}`,
          `description: ${quote(doc.description)}`,
          ...(doc.auto ? [] : ["disable-model-invocation: true"]),
        ]
      : doc.kind === "command"
        ? [`description: ${quote(doc.description)}`]
        : [`description: ${quote(doc.description)}`, `mode: ${doc.mode}`]

  return `---\n${fields.join("\n")}\n---\n\n${doc.body.trim()}\n`
}

/** One front matter value: a quoted string as written by `formatDoc`, or plain text as a person writes it. */
function readValue(raw: string) {
  const value = raw.trim()

  if (value.startsWith('"') && value.endsWith('"') && value.length >= 2) {
    try {
      const parsed: unknown = JSON.parse(value)

      if (typeof parsed === "string") return parsed
    } catch {
      return value.slice(1, -1)
    }
  }

  return value.replace(/^'(.*)'$/, "$1")
}

/** Reads a file's text back. A file without front matter is all body. */
export function parseDoc(kind: DocKind, name: string, text: string): Doc {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text)
  const fields = new Map(
    (match?.[1] ?? "").split(/\r?\n/).flatMap((line) => {
      const at = line.indexOf(":")

      return at > 0 ? [[line.slice(0, at).trim(), readValue(line.slice(at + 1))] as const] : []
    }),
  )
  const mode = fields.get("mode")

  return {
    kind,
    name,
    description: fields.get("description") ?? "",
    body: (match ? (match[2] ?? "") : text).trim(),
    auto: fields.get("disable-model-invocation") !== "true",
    mode: mode === "primary" || mode === "all" ? mode : "subagent",
  }
}

/** A command line split into its words; double quotes keep spaces together. */
export function splitCommand(text: string) {
  return [...text.matchAll(/"([^"]*)"|(\S+)/g)].map((match) => match[1] ?? match[2] ?? "")
}
