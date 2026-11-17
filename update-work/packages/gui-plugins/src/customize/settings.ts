import type { ConfigObject } from "../plugin-store/config"
import { splitCommand } from "./docs"

function isObject(value: unknown): value is ConfigObject {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

/** A tool server ("connector") as the page shows it. */
export type Connector = {
  readonly name: string
  /** `remote`: a web address. `local`: a program started on this machine. */
  readonly type: "remote" | "local"
  /** The web address, or the command line. */
  readonly target: string
  /**
   * It signs in with a token kept in the user's environment (a "{user-env:NAME}" header, see the Plugins page). Until
   * a token is saved, the app's server leaves such a server out.
   */
  readonly token: boolean
}

/** Connector names are settings keys and the name the AI calls the tools by. */
export function validConnectorName(name: string) {
  return /^[a-z0-9][a-z0-9_-]{0,39}$/.test(name)
}

const serversOf = (config: ConfigObject) =>
  isObject(config.mcp) && isObject(config.mcp.servers) ? config.mcp.servers : {}

/** The settings with a tool server added under `name`, replacing one already there. */
export function withConnector(config: ConfigObject, name: string, server: ConfigObject): ConfigObject {
  return {
    ...config,
    mcp: { ...(isObject(config.mcp) ? config.mcp : {}), servers: { ...serversOf(config), [name]: server } },
  }
}

/** The settings with the tool server `name` taken out; unchanged when there is none. */
export function withoutConnector(config: ConfigObject, name: string): ConfigObject {
  if (!(name in serversOf(config))) return config
  const rest = Object.fromEntries(Object.entries(serversOf(config)).filter(([key]) => key !== name))

  return { ...config, mcp: { ...(isObject(config.mcp) ? config.mcp : {}), servers: rest } }
}

/** Every tool server in the settings, by name. */
export function listConnectors(config: ConfigObject): Connector[] {
  const servers = serversOf(config)

  return Object.entries(servers).flatMap(([name, server]): Connector[] => {
    if (!isObject(server)) return []
    if (server.type === "remote" && typeof server.url === "string") {
      const headers = isObject(server.headers) ? Object.values(server.headers) : []
      const token = headers.some((value) => typeof value === "string" && value.includes("{user-env:"))

      return [{ name, type: "remote", target: server.url, token }]
    }
    if (server.type !== "local" || !Array.isArray(server.command)) return []
    const words = server.command.filter((word): word is string => typeof word === "string")
    // The Windows shell wrapper is how it is started, not what the user typed.
    const shown = words[0] === "cmd" && words[1] === "/c" ? words.slice(2) : words
    const target = shown.map((word) => (/\s/.test(word) ? `"${word}"` : word)).join(" ")

    return [{ name, type: "local", target, token: false }]
  })
}

/**
 * What a connector writes under `mcp.servers`. Throws with the reason for a web address that is not http(s) or an
 * empty command.
 */
export function connectorServer(input: Pick<Connector, "type" | "target">, platform: NodeJS.Platform): ConfigObject {
  if (input.type === "remote") {
    const url = URL.parse(input.target.trim())

    if (!url || (url.protocol !== "https:" && url.protocol !== "http:"))
      throw new Error("The address must start with https:// or http://")

    return { type: "remote", url: url.href }
  }

  const words = splitCommand(input.target)

  if (words.length === 0) throw new Error("Type the command that starts the server.")

  // `npx` and friends are scripts on Windows, so the command runs through the command shell.
  return { type: "local", command: platform === "win32" ? ["cmd", "/c", ...words] : words }
}

const strings = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []

const samePath = (a: string, b: string) => {
  const normal = (value: string) => value.replaceAll("\\", "/").toLowerCase()

  return normal(a) === normal(b)
}

/** The settings with `file` in, or out of, the instruction files OpenCode loads into every chat. */
export function withInstructionFile(config: ConfigObject, file: string, present: boolean): ConfigObject {
  const rest = strings(config.instructions).filter((item) => !samePath(item, file))
  const next = present ? [...rest, file] : rest

  if (next.length === 0) {
    const { instructions: _dropped, ...others } = config

    return others
  }

  return { ...config, instructions: next }
}

/**
 * A response style: standing instructions about how the AI answers, as apart from what it knows.
 * `normal` adds nothing; `custom` is the user's own text.
 */
export const styles = {
  normal: "",
  short:
    "Keep every answer short. Lead with the result in one or two sentences. Do not narrate your steps or repeat what the user said. Use a list only when there are three or more separate items. Give detail only when the user asks for it.",
  explain:
    "While you work, explain your choices. After each meaningful step, add two or three plain sentences: what you did, why you chose this way over the obvious alternative, and what to watch out for. Keep the explanations separate from the code so they are easy to skip.",
  learn:
    "The user is learning to code. Do the work, and teach while you do it: name each concept the first time you use it and say in one plain sentence what it means, show the smallest example that works before the full version, and end with one small thing the user can try changing to see what happens.",
  hinglish:
    "Reply in simple Hinglish: Hindi written in Latin letters, mixed with the common English technical words. Use short sentences and everyday words. When you must use a technical term, say in a few words what it means. Keep code, file names and commands exactly as they are, in English.",
} as const

export type StyleId = keyof typeof styles | "custom"

const styleMark = /^<!-- apna-style: ([a-z]+) -->\r?\n?/

/** The response style file's text. */
export function formatStyle(id: StyleId, custom: string) {
  const text = id === "custom" ? custom.trim() : styles[id]

  return `<!-- apna-style: ${id} -->\n# Response style\n\n${text}\n`
}

/** Reads the response style file back; a missing or foreign file is `normal`. */
export function parseStyle(text: string | undefined): { id: StyleId; custom: string } {
  const id = text === undefined ? undefined : styleMark.exec(text)?.[1]

  if (id === "custom")
    return {
      id,
      custom: (text ?? "")
        .replace(styleMark, "")
        .replace(/^# Response style\r?\n/, "")
        .trim(),
    }

  return { id: id !== undefined && id in styles ? (id as keyof typeof styles) : "normal", custom: "" }
}

/** Something that runs by itself at a moment in the AI's work. Stored in `hooks.json`; the workflow plugin runs them. */
export type Hook = {
  readonly id: string
  readonly name: string
  /**
   * - `before-tool`: before a tool runs. A command that fails (exit code not 0) stops the tool, and the AI is told why.
   * - `after-tool`: after a tool ran. What the command prints is added to what the AI sees.
   * - `finished`: when the AI finishes its answer.
   */
  readonly event: "before-tool" | "after-tool" | "finished"
  /** Tool names separated by commas, or `*` for every tool. Not used by `finished`. */
  readonly tools: string
  /** The command line to run, in the project folder. */
  readonly command: string
  readonly enabled: boolean
}

/** Reads `hooks.json`; anything that is not a well-formed hook is left out. */
export function parseHooks(text: string | undefined): Hook[] {
  if (text === undefined || text.trim() === "") return []
  const parsed: unknown = JSON.parse(text)
  const list = isObject(parsed) && Array.isArray(parsed.hooks) ? parsed.hooks : []

  return list.flatMap((item): Hook[] => {
    if (!isObject(item)) return []
    const event = item.event

    if (event !== "before-tool" && event !== "after-tool" && event !== "finished") return []
    if (typeof item.id !== "string" || typeof item.command !== "string") return []

    return [
      {
        id: item.id,
        name: typeof item.name === "string" ? item.name : item.id,
        event,
        tools: typeof item.tools === "string" ? item.tools : "*",
        command: item.command,
        enabled: item.enabled !== false,
      },
    ]
  })
}

export function formatHooks(hooks: readonly Hook[]) {
  return `${JSON.stringify({ hooks }, null, 2)}\n`
}
