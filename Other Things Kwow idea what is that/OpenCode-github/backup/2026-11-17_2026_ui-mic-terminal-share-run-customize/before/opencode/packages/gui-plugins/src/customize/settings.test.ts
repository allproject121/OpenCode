import { describe, expect, test } from "bun:test"
import {
  connectorServer,
  formatHooks,
  formatStyle,
  listConnectors,
  parseHooks,
  parseStyle,
  styles,
  validConnectorName,
  withConnector,
  withInstructionFile,
  withoutConnector,
  type Hook,
} from "./settings"

describe("connectors", () => {
  test("a web address is checked and written as a remote server", () => {
    expect(connectorServer({ type: "remote", target: " https://example.com/mcp " }, "win32")).toEqual({
      type: "remote",
      url: "https://example.com/mcp",
    })
    expect(() => connectorServer({ type: "remote", target: "example.com/mcp" }, "win32")).toThrow()
    expect(() => connectorServer({ type: "remote", target: "file:///c:/x" }, "win32")).toThrow()
  })

  test("a command runs through the shell on Windows and is shown as it was typed", () => {
    const server = connectorServer({ type: "local", target: 'npx -y some-server "C:\\My Files"' }, "win32")

    expect(server).toEqual({ type: "local", command: ["cmd", "/c", "npx", "-y", "some-server", "C:\\My Files"] })
    expect(
      listConnectors({ mcp: { servers: { files: server, bad: 5, web: { type: "remote", url: "https://a.b/c" } } } }),
    ).toEqual([
      { name: "files", type: "local", target: 'npx -y some-server "C:\\My Files"', token: false },
      { name: "web", type: "remote", target: "https://a.b/c", token: false },
    ])
    // A header that names a token variable marks the server as one that needs a token.
    expect(
      listConnectors({
        mcp: {
          servers: { gh: { type: "remote", url: "https://a.b/gh", headers: { Authorization: "Bearer {user-env:T}" } } },
        },
      }),
    ).toEqual([{ name: "gh", type: "remote", target: "https://a.b/gh", token: true }])
    expect(connectorServer({ type: "local", target: "uvx tool" }, "linux")).toEqual({
      type: "local",
      command: ["uvx", "tool"],
    })
    expect(() => connectorServer({ type: "local", target: "  " }, "win32")).toThrow()
  })

  test("adding replaces the same name, removing keeps the others and the rest of the settings", () => {
    const start = { model: "a/b", mcp: { timeout: 5, servers: { one: { type: "remote", url: "https://a.b/1" } } } }
    const added = withConnector(withConnector(start, "two", { type: "remote", url: "https://a.b/2" }), "one", {
      type: "remote",
      url: "https://a.b/new",
    })

    expect(added).toEqual({
      model: "a/b",
      mcp: {
        timeout: 5,
        servers: { one: { type: "remote", url: "https://a.b/new" }, two: { type: "remote", url: "https://a.b/2" } },
      },
    })
    expect(withoutConnector(added, "one")).toEqual({
      model: "a/b",
      mcp: { timeout: 5, servers: { two: { type: "remote", url: "https://a.b/2" } } },
    })
    expect(withoutConnector(start, "missing")).toBe(start)
    expect(withConnector({}, "x", { type: "remote", url: "https://a.b/x" })).toEqual({
      mcp: { servers: { x: { type: "remote", url: "https://a.b/x" } } },
    })
  })

  test("names are small letters, digits, dashes and underscores", () => {
    expect(validConnectorName("my_db-2")).toBe(true)
    expect(validConnectorName("My DB")).toBe(false)
    expect(validConnectorName("")).toBe(false)
  })
})

describe("the response style", () => {
  test("its file is added to and taken out of the instruction files without touching the others", () => {
    const added = withInstructionFile(
      { model: "a/b", instructions: ["docs/rules.md"] },
      "C:\\cfg\\response-style.md",
      true,
    )

    expect(added).toEqual({ model: "a/b", instructions: ["docs/rules.md", "C:\\cfg\\response-style.md"] })
    expect(withInstructionFile(added, "c:/cfg/response-style.md", true).instructions).toHaveLength(2)
    expect(withInstructionFile(added, "c:/cfg/response-style.md", false)).toEqual({
      model: "a/b",
      instructions: ["docs/rules.md"],
    })
    expect(withInstructionFile({ model: "a/b", instructions: ["x.md"] }, "x.md", false)).toEqual({ model: "a/b" })
  })

  test("a style survives writing and reading", () => {
    expect(parseStyle(formatStyle("short", ""))).toEqual({ id: "short", custom: "" })
    expect(formatStyle("short", "")).toContain(styles.short)
    expect(parseStyle(formatStyle("custom", "  Answer as a pirate.\nAlways. "))).toEqual({
      id: "custom",
      custom: "Answer as a pirate.\nAlways.",
    })
    expect(parseStyle(undefined)).toEqual({ id: "normal", custom: "" })
    expect(parseStyle("some other file")).toEqual({ id: "normal", custom: "" })
  })
})

describe("hooks", () => {
  const hook: Hook = {
    id: "h1",
    name: "Format",
    event: "after-tool",
    tools: "edit,write",
    command: "npx prettier --write .",
    enabled: true,
  }

  test("survive writing and reading", () => {
    expect(parseHooks(formatHooks([hook]))).toEqual([hook])
    expect(parseHooks(undefined)).toEqual([])
    expect(parseHooks("")).toEqual([])
  })

  test("leave out entries that are not hooks and fill in what is optional", () => {
    const text = JSON.stringify({
      hooks: [{ id: "a", event: "finished", command: "echo done" }, { id: "b", event: "nope", command: "x" }, 7],
    })

    expect(parseHooks(text)).toEqual([
      { id: "a", name: "a", event: "finished", tools: "*", command: "echo done", enabled: true },
    ])
  })
})
