import { describe, expect, test } from "bun:test"
import path from "node:path"
import { catalog } from "./catalog"
import {
  addEntry,
  formatConfig,
  hasEntry,
  localStartupMs,
  parseConfig,
  removeEntry,
  serverOf,
  stripComments,
  type Entry,
} from "./config"

const mcp: Entry = { kind: "mcp", key: "context7", server: { type: "remote", url: "https://mcp.context7.com/mcp" } }
const plugin: Entry = { kind: "plugin", spec: "C:\\Apps\\opencode\\packages\\plugins\\figma" }
const skills: Entry = { kind: "skills", path: "C:/Apps/config/packs/superpowers/skills" }

describe("reading the settings file", () => {
  test("drops comments and trailing commas but keeps slashes inside strings", () => {
    const text = `{
      // a note
      "url": "https://example.com/a//b", /* inline */
      "list": [1, 2,],
    }`

    expect(parseConfig(text)).toEqual({ url: "https://example.com/a//b", list: [1, 2] })
    expect(stripComments('"a \\" // b"')).toBe('"a \\" // b"')
  })

  test("treats an empty file as empty settings and rejects a file that is not an object", () => {
    expect(parseConfig("  \n")).toEqual({})
    expect(() => parseConfig("[1]")).toThrow()
  })
})

describe("adding and removing", () => {
  test("adds each kind where OpenCode reads it and keeps what was there", () => {
    const start = {
      model: "a/b",
      plugins: ["../workflow"],
      mcp: { timeout: 5, servers: { mine: { type: "remote", url: "x" } } },
    }
    const result = addEntry(addEntry(addEntry(start, mcp), plugin), skills)

    expect(result).toEqual({
      model: "a/b",
      plugins: ["../workflow", "C:\\Apps\\opencode\\packages\\plugins\\figma"],
      mcp: {
        timeout: 5,
        servers: {
          mine: { type: "remote", url: "x" },
          context7: { type: "remote", url: "https://mcp.context7.com/mcp" },
        },
      },
      skills: ["C:/Apps/config/packs/superpowers/skills"],
    })
  })

  test("adding twice changes nothing", () => {
    const once = addEntry({}, mcp)

    expect(addEntry(once, mcp)).toBe(once)
  })

  test("finds a plugin or skills path written with other slashes or letter case, also as an object entry", () => {
    expect(hasEntry({ plugins: ["c:/apps/opencode/packages/plugins/figma/"] }, plugin)).toBe(true)
    expect(hasEntry({ plugins: [{ package: "C:/Apps/opencode/packages/plugins/figma", options: {} }] }, plugin)).toBe(
      true,
    )
    expect(hasEntry({ skills: ["C:\\Apps\\config\\packs\\superpowers\\skills"] }, skills)).toBe(true)
    expect(hasEntry({ plugins: ["../workflow"] }, plugin)).toBe(false)
  })

  test("removes only the entry and leaves the user's own servers and plugins", () => {
    const full = addEntry(
      addEntry({ plugins: ["../workflow"], mcp: { servers: { mine: { type: "remote", url: "x" } } } }, mcp),
      plugin,
    )
    const result = removeEntry(removeEntry(full, mcp), plugin)

    expect(result).toEqual({ plugins: ["../workflow"], mcp: { servers: { mine: { type: "remote", url: "x" } } } })
    expect(removeEntry(result, skills)).toBe(result)
  })

  test("writes text that reads back to the same settings", () => {
    const config = addEntry({ model: "a/b" }, mcp)

    expect(parseConfig(formatConfig(config))).toEqual(config)
  })
})

describe("what a tool server writes", () => {
  const item = (id: string) => {
    const found = catalog.find((entry) => entry.id === id)

    if (found?.kind !== "mcp") throw new Error(`${id} is not a tool server`)

    return found
  }

  test("a token server names the variable in its header and never holds the token", () => {
    expect(serverOf(item("github"), "C:/cfg", "win32")).toEqual({
      type: "remote",
      url: "https://api.githubcopilot.com/mcp/",
      oauth: false,
      headers: { Authorization: "Bearer {user-env:GITHUB_PERSONAL_ACCESS_TOKEN}" },
    })
    expect(serverOf(item("context7"), "C:/cfg", "win32")).toEqual({
      type: "remote",
      url: "https://mcp.context7.com/mcp",
    })
  })

  test("a local server runs through the shell on Windows and keeps its file in the settings folder", () => {
    expect(serverOf(item("memory"), "C:/cfg", "win32")).toEqual({
      type: "local",
      command: ["cmd", "/c", "npx", "-y", "@modelcontextprotocol/server-memory"],
      environment: { MEMORY_FILE_PATH: path.join("C:/cfg", "memory.jsonl") },
      timeout: { startup: localStartupMs, catalog: localStartupMs },
    })
    expect(serverOf(item("playwright"), "/cfg", "linux")).toEqual({
      type: "local",
      command: ["npx", "-y", "@playwright/mcp@latest"],
      timeout: { startup: localStartupMs, catalog: localStartupMs },
    })
  })
})
