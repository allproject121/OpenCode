import { describe, expect, test } from "bun:test"
import { hookEnvironment, hooksFor, inputFile, readHooks, runHook, type Hook } from "./hooks"

const hook = (over: Partial<Hook>): Hook => ({
  id: "h",
  name: "h",
  event: "after-tool",
  tools: "edit,write",
  command: "echo hi",
  enabled: true,
  ...over,
})

describe("reading hooks.json", () => {
  test("a missing, empty or broken file has no hooks", () => {
    expect(readHooks(undefined)).toEqual([])
    expect(readHooks("  ")).toEqual([])
    expect(readHooks("{ not json")).toEqual([])
  })

  test("keeps well-formed hooks and fills in what is optional", () => {
    const text = JSON.stringify({
      hooks: [
        { id: "a", event: "finished", command: "echo done" },
        { id: "b", event: "sometime", command: "x" },
        { id: "c", event: "before-tool", command: "  " },
        { id: "d", name: "D", event: "before-tool", tools: "shell", command: "check", enabled: false },
      ],
    })

    expect(readHooks(text)).toEqual([
      { id: "a", name: "a", event: "finished", tools: "*", command: "echo done", enabled: true },
      { id: "d", name: "D", event: "before-tool", tools: "shell", command: "check", enabled: false },
    ])
  })
})

describe("choosing hooks", () => {
  const hooks = [
    hook({ id: "edits" }),
    hook({ id: "all", tools: "*" }),
    hook({ id: "off", tools: "*", enabled: false }),
    hook({ id: "before", event: "before-tool", tools: " Shell , patch " }),
    hook({ id: "end", event: "finished", tools: "edit" }),
  ]

  test("by moment, tool name and the on switch", () => {
    expect(hooksFor(hooks, "after-tool", "edit").map((item) => item.id)).toEqual(["edits", "all"])
    expect(hooksFor(hooks, "after-tool", "read").map((item) => item.id)).toEqual(["all"])
    expect(hooksFor(hooks, "before-tool", "shell").map((item) => item.id)).toEqual(["before"])
    expect(hooksFor(hooks, "before-tool", "edit")).toEqual([])
  })

  test("a finished hook does not look at tools", () => {
    expect(hooksFor(hooks, "finished", undefined).map((item) => item.id)).toEqual(["end"])
  })
})

describe("what a command can read", () => {
  test("the file of a tool that names one, and the input as JSON", () => {
    expect(inputFile({ path: "src/a.ts", text: "x" })).toBe("src/a.ts")
    expect(inputFile({ command: "ls" })).toBe("")
    expect(inputFile("text")).toBe("")
    expect(hookEnvironment("after-tool", "edit", { path: "a.ts" }, "ses_1")).toEqual({
      APNA_EVENT: "after-tool",
      APNA_TOOL: "edit",
      APNA_FILE: "a.ts",
      APNA_INPUT: '{"path":"a.ts"}',
      APNA_SESSION: "ses_1",
    })
  })
})

describe("running a command", () => {
  test("gives the exit code and what was printed, and passes the environment", async () => {
    const shown = process.platform === "win32" ? "echo tool=%APNA_TOOL%" : "echo tool=$APNA_TOOL"

    expect(await runHook(shown, process.cwd(), { APNA_TOOL: "edit" })).toEqual({ code: 0, output: "tool=edit" })
    expect((await runHook("exit 3", process.cwd(), {})).code).toBe(3)
  })

  test("a command that does not exist fails instead of throwing", async () => {
    const result = await runHook("apna-no-such-command-xyz", process.cwd(), {})

    expect(result.code).not.toBe(0)
  })
})
