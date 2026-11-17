import path from "node:path"
import type { StoreItem } from "./catalog"

/** A parsed settings file: plain JSON values. */
export type ConfigObject = { [key: string]: unknown }

/** What an item puts into the settings file once its paths are known. */
export type Entry =
  | { readonly kind: "mcp"; readonly key: string; readonly server: ConfigObject }
  | { readonly kind: "plugin"; readonly spec: string }
  | { readonly kind: "skills"; readonly path: string }

/**
 * What a tool server item writes under `mcp.servers`. `directory` is this app's settings folder. A token is never
 * written: the header names the user's environment variable as `{user-env:NAME}`, and this build's workflow plugin
 * fills it in each time the settings load (OpenCode's own `{env:NAME}` would need the app reopened).
 */
export function serverOf(
  item: Extract<StoreItem, { kind: "mcp" }>,
  directory: string,
  platform: NodeJS.Platform,
): ConfigObject {
  if (item.server.type === "remote")
    return item.token
      ? {
          type: "remote",
          url: item.server.url,
          oauth: false,
          headers: { Authorization: `Bearer {user-env:${item.token.variable}}` },
        }
      : { type: "remote", url: item.server.url }

  const environment = Object.fromEntries(
    Object.entries(item.server.environment ?? {}).map(([name, value]) => [
      name,
      value.startsWith("{config}/") ? path.join(directory, value.slice("{config}/".length)) : value,
    ]),
  )

  return {
    type: "local",
    // `npx` is a script on Windows, so it runs through the command shell.
    command: platform === "win32" ? ["cmd", "/c", ...item.server.command] : [...item.server.command],
    ...(Object.keys(environment).length > 0 ? { environment } : {}),
  }
}

function isObject(value: unknown): value is ConfigObject {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

/**
 * Removes `//` and block comments and trailing commas from a settings file, leaving strings as they are, so the
 * rest parses as JSON.
 */
export function stripComments(text: string) {
  const out: string[] = []
  const state = { index: 0, string: false }

  while (state.index < text.length) {
    const char = text[state.index] ?? ""
    const next = text[state.index + 1] ?? ""

    if (state.string) {
      out.push(char)
      if (char === "\\") {
        out.push(next)
        state.index += 2
        continue
      }
      if (char === '"') state.string = false
      state.index += 1
      continue
    }

    if (char === '"') {
      state.string = true
      out.push(char)
      state.index += 1
      continue
    }

    if (char === "/" && next === "/") {
      const end = text.indexOf("\n", state.index)

      state.index = end < 0 ? text.length : end
      continue
    }

    if (char === "/" && next === "*") {
      const end = text.indexOf("*/", state.index + 2)

      state.index = end < 0 ? text.length : end + 2
      continue
    }

    out.push(char)
    state.index += 1
  }

  return out.join("").replace(/,(\s*[}\]])/g, "$1")
}

/** Reads a settings file's text. Empty text is an empty object; anything that is not an object is rejected. */
export function parseConfig(text: string): ConfigObject {
  const stripped = stripComments(text).trim()

  if (stripped === "") return {}
  const value: unknown = JSON.parse(stripped)

  if (!isObject(value)) throw new Error("The settings file does not hold an object.")

  return value
}

/** Two file paths that name the same place on Windows: either slash, any letter case, no trailing slash. */
function samePath(a: string, b: string) {
  const normal = (value: string) => value.replaceAll("\\", "/").replace(/\/+$/, "").toLowerCase()

  return normal(a) === normal(b)
}

const strings = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []

/** The `plugins` entries as their package strings; an entry may be a string or `{ package, options }`. */
function pluginSpecs(config: ConfigObject) {
  return Array.isArray(config.plugins)
    ? config.plugins.flatMap((item) =>
        typeof item === "string" ? [item] : isObject(item) && typeof item.package === "string" ? [item.package] : [],
      )
    : []
}

const servers = (config: ConfigObject) =>
  isObject(config.mcp) && isObject(config.mcp.servers) ? config.mcp.servers : {}

/** Whether the settings already hold this entry. */
export function hasEntry(config: ConfigObject, entry: Entry) {
  if (entry.kind === "mcp") return entry.key in servers(config)
  if (entry.kind === "plugin") return pluginSpecs(config).some((spec) => samePath(spec, entry.spec))

  return strings(config.skills).some((item) => samePath(item, entry.path))
}

/** The settings with the entry added. Settings that already hold it are returned unchanged. */
export function addEntry(config: ConfigObject, entry: Entry): ConfigObject {
  if (hasEntry(config, entry)) return config
  if (entry.kind === "mcp")
    return {
      ...config,
      mcp: { ...(isObject(config.mcp) ? config.mcp : {}), servers: { ...servers(config), [entry.key]: entry.server } },
    }
  if (entry.kind === "plugin")
    return { ...config, plugins: [...(Array.isArray(config.plugins) ? config.plugins : []), entry.spec] }

  return { ...config, skills: [...strings(config.skills), entry.path] }
}

/** The settings with the entry taken out; everything else, and the order of what stays, is kept. */
export function removeEntry(config: ConfigObject, entry: Entry): ConfigObject {
  if (!hasEntry(config, entry)) return config

  if (entry.kind === "mcp") {
    const rest = Object.fromEntries(Object.entries(servers(config)).filter(([key]) => key !== entry.key))

    return { ...config, mcp: { ...(isObject(config.mcp) ? config.mcp : {}), servers: rest } }
  }

  if (entry.kind === "plugin")
    return {
      ...config,
      plugins: (Array.isArray(config.plugins) ? config.plugins : []).filter((item) => {
        const spec =
          typeof item === "string" ? item : isObject(item) && typeof item.package === "string" ? item.package : ""

        return !samePath(spec, entry.spec)
      }),
    }

  return { ...config, skills: strings(config.skills).filter((item) => !samePath(item, entry.path)) }
}

/** The text written back: a one-line note, then plain JSON. Comments that were in the file are not kept. */
export function formatConfig(config: ConfigObject) {
  return `// Apna OpenCode ki settings. Plugins wala panna is file ko khud badalta hai.\n${JSON.stringify(config, null, 2)}\n`
}
