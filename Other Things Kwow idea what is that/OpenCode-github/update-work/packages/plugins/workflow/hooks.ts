// apna-opencode: the user's hooks, made on the Customize page and stored in `hooks.json` in the settings folder.
// A hook is a command line that runs by itself at a set moment, without the AI deciding:
// - `before-tool`: before a tool runs. A command that fails (exit code not 0) stops the tool; the AI is told why.
// - `after-tool`: after a tool ran. What the command prints is added to what the AI sees of the tool's result.
// - `finished`: when the AI finishes its answer.
import { spawn } from "node:child_process"

export type HookEvent = "before-tool" | "after-tool" | "finished"

export type Hook = {
  readonly id: string
  readonly name: string
  readonly event: HookEvent
  /** Tool names separated by commas, or `*` for every tool. Not used by `finished`. */
  readonly tools: string
  readonly command: string
  readonly enabled: boolean
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

/** Reads `hooks.json`. A missing, empty or broken file has no hooks; an entry that is not a hook is left out. */
export function readHooks(text: string | undefined): Hook[] {
  if (text === undefined || text.trim() === "") return []
  const parsed = ((): unknown => {
    try {
      return JSON.parse(text)
    } catch {
      return undefined
    }
  })()
  const list = isObject(parsed) && Array.isArray(parsed.hooks) ? parsed.hooks : []

  return list.flatMap((item): Hook[] => {
    if (!isObject(item)) return []
    const event = item.event

    if (event !== "before-tool" && event !== "after-tool" && event !== "finished") return []
    if (typeof item.id !== "string" || typeof item.command !== "string" || item.command.trim() === "") return []

    return [
      {
        id: item.id,
        name: typeof item.name === "string" && item.name !== "" ? item.name : item.id,
        event,
        tools: typeof item.tools === "string" ? item.tools : "*",
        command: item.command,
        enabled: item.enabled !== false,
      },
    ]
  })
}

/** The hooks that are on, for this moment and this tool. */
export function hooksFor(hooks: readonly Hook[], event: HookEvent, tool: string | undefined) {
  return hooks.filter((hook) => {
    if (!hook.enabled || hook.event !== event) return false
    if (event === "finished" || tool === undefined) return true
    const names = hook.tools
      .split(",")
      .map((name) => name.trim().toLowerCase())
      .filter((name) => name !== "")

    return names.length === 0 || names.includes("*") || names.includes(tool.toLowerCase())
  })
}

/** The file a tool's input names, when it names one. */
export function inputFile(input: unknown) {
  if (!isObject(input)) return ""

  for (const key of ["path", "filePath", "file_path", "file"]) {
    const value = input[key]

    if (typeof value === "string") return value
  }

  return ""
}

/** What a hook's command can read from its environment. */
export function hookEnvironment(event: HookEvent, tool: string | undefined, input: unknown, session: string) {
  return {
    APNA_EVENT: event,
    APNA_TOOL: tool ?? "",
    APNA_FILE: inputFile(input),
    // A command line cannot take more than a few thousand characters of environment per variable on Windows.
    APNA_INPUT: (JSON.stringify(input ?? null) ?? "null").slice(0, 8000),
    APNA_SESSION: session,
  }
}

const outputLimit = 4000

/** Runs a hook's command through the shell in `cwd`. Resolves with its exit code and what it printed; never rejects. */
export function runHook(command: string, cwd: string, environment: Record<string, string>, timeoutMs = 60_000) {
  return new Promise<{ code: number; output: string }>((resolve) => {
    const printed: string[] = []
    const child = spawn(command, { cwd, shell: true, windowsHide: true, env: { ...process.env, ...environment } })
    const timer = setTimeout(() => {
      printed.push(`\n(stopped after ${Math.round(timeoutMs / 1000)} seconds)`)
      child.kill()
    }, timeoutMs)
    const done = (code: number) => {
      clearTimeout(timer)
      resolve({ code, output: printed.join("").trim().slice(0, outputLimit) })
    }

    child.stdout.on("data", (chunk: Buffer) => printed.push(chunk.toString("utf8")))
    child.stderr.on("data", (chunk: Buffer) => printed.push(chunk.toString("utf8")))
    child.on("error", (error) => {
      printed.push(error.message)
      done(1)
    })
    child.on("close", (code) => done(code ?? 1))
  })
}
