import { Agent, Plugin, Skill } from "@opencode/plugin"
import { Schema } from "effect"
import { execFile } from "node:child_process"
import { mkdir, readdir, readFile, rename, writeFile } from "node:fs/promises"
import { homedir } from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { describeDetection, detectProject } from "./detect"
import { hookEnvironment, hooksFor, readHooks, runHook } from "./hooks"
import { addMemory, forgetMemories, formatMemories, memoryPrompt, parseMemories } from "./memory"
import {
  askPrompt,
  buildPrompt,
  debugPrompt,
  houseRules,
  orchestratorPrompt,
  securityPrompt,
  verifyPrompt,
} from "./prompts"
import { parseUserVariables, resolveHeaders } from "./tokens"

// apna-opencode: the "system" that works out what is being built and works in stages.
// - `project_detect` reads the project folder and names its kind, commands and skills.
// - The skill pack (addyosmani/agent-skills, MIT, copied unchanged into ./skills) carries each stage's method.
// - /banao, /jaanch and /suraksha start the staged flow, the test-and-fix loop and the security review.
// - A project that opens in a browser also gets the browser-testing MCP server its skill expects.
// - The user's hooks (Customize page, `hooks.json`) run before and after tools and when the AI finishes.

const skillsDirectory = fileURLToPath(new URL("./skills/", import.meta.url))

const readText = (file: string) => readFile(file, "utf8").catch(() => undefined)

// The user's hooks live in the settings folder, beside the settings file.
const hooksFile = path.join(
  process.env.OPENCODE_CONFIG_DIR || path.join(homedir(), ".config", "opencode"),
  "hooks.json",
)

// Read on every use: the file is small, and a hook saved on the Customize page then works at once.
const loadHooks = async () => readHooks(await readText(hooksFile))

// The user's saved memories (Customize > Memory), beside the settings file; read on every request so an edit on the
// page or a memory_save in another chat counts at once.
const memoryFile = path.join(path.dirname(hooksFile), "memory.md")
const loadMemories = async () => parseMemories(await readText(memoryFile))
const saveMemories = async (memories: readonly string[]) => {
  await mkdir(path.dirname(memoryFile), { recursive: true })
  await writeFile(`${memoryFile}.tmp`, formatMemories(memories), "utf8")
  await rename(`${memoryFile}.tmp`, memoryFile)
}

// This plugin is set up again each time a project's settings load, in the same process. Each setup starts a listener
// for "the AI finished"; the registry lets the listener of an earlier setup see that it was replaced and stop, and
// keeps one finished session from running the hooks twice.
const finishedRegistry = ((globalThis as Record<symbol, unknown>)[Symbol.for("apna.workflow.finished")] ??= {
  generations: new Map<string, number>(),
  fired: new Map<string, number>(),
}) as { generations: Map<string, number>; fired: Map<string, number> }

/** The `name` and `description` of a skill file's front matter, and the text after it. */
function parseSkill(text: string) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text)

  if (!match) return undefined
  const field = (name: string) =>
    new RegExp(`^${name}:\\s*(.+)$`, "m")
      .exec(match[1] ?? "")?.[1]
      ?.trim()
      .replace(/^["'](.*)["']$/, "$1")
  const name = field("name")

  return name ? { name, description: field("description"), content: match[2] ?? "" } : undefined
}

async function loadSkills() {
  const folders = await readdir(skillsDirectory, { withFileTypes: true }).catch(() => [])
  const loaded = await Promise.all(
    folders
      .filter((entry) => entry.isDirectory())
      .map(async (entry) => {
        const file = path.join(skillsDirectory, entry.name, "SKILL.md")
        const text = await readText(file)
        const skill = text === undefined ? undefined : parseSkill(text)

        return skill
          ? Skill.Info.make({
              id: Skill.ID.make(entry.name),
              name: Skill.Name.make(skill.name),
              description: skill.description,
              autoinvoke: true,
              path: Skill.Info.fields.path.make(file),
              content: skill.content,
            })
          : undefined
      }),
  )

  return loaded.filter((skill) => skill !== undefined)
}

/** The user's environment variables as they are now; on Windows read fresh, since this process holds old ones. */
async function readUserVariables(): Promise<Record<string, string>> {
  const own = Object.fromEntries(Object.entries(process.env).flatMap(([name, value]) => (value ? [[name, value]] : [])))

  if (process.platform !== "win32") return own
  const output = await new Promise<string>((resolve) =>
    execFile("reg", ["query", "HKCU\\Environment"], { windowsHide: true }, (error, stdout) =>
      resolve(error ? "" : stdout),
    ),
  )

  return { ...own, ...parseUserVariables(output) }
}

/** Reads what the detector needs from a project folder; a file that is missing is simply left out. */
async function readProject(directory: string) {
  const names = await readdir(directory).catch((): string[] => [])
  const python = (
    await Promise.all(["requirements.txt", "pyproject.toml"].map((name) => readText(path.join(directory, name))))
  )
    .filter((text) => text !== undefined)
    .join("\n")

  return detectProject({
    names,
    packageJson: await readText(path.join(directory, "package.json")),
    python: python === "" ? undefined : python,
  })
}

export default Plugin.define({
  id: "apna.workflow",
  async setup(ctx) {
    const directory = ctx.location.directory
    const skills = await loadSkills()
    const detected = await readProject(directory)
    const variables = await readUserVariables()

    // A skill the user already has under the same id is kept.
    await ctx.skill.transform((editor) => {
      skills.forEach((skill) => {
        if (!editor.get(skill.id)) editor.add(skill)
      })
    })

    // The browser-testing skill drives a real browser through this MCP server, so only a project that opens in a
    // browser gets it, and never over a server the user configured under the same name.
    await ctx.mcp.transform((editor) => {
      if (!detected.web || editor.get("chrome-devtools")) return
      editor.set("chrome-devtools", {
        type: "local",
        command:
          process.platform === "win32"
            ? ["cmd", "/c", "npx", "-y", "chrome-devtools-mcp@latest"]
            : ["npx", "-y", "chrome-devtools-mcp@latest"],
      })
    })

    // A tool server whose header names a token variable ("{user-env:NAME}") gets the token as it is now. Without
    // one the server could only fail, so it is left out until the user saves a token on the Plugins page. Left out,
    // not turned off: a server that is only off shows a switch, and switching it on brings the failure back.
    await ctx.mcp.transform((editor) => {
      for (const [name, config] of editor.list()) {
        const resolved =
          config.type === "remote" && config.headers ? resolveHeaders(config.headers, variables) : undefined

        if (!resolved) continue
        if (resolved.missing) {
          editor.remove(name)
          continue
        }
        editor.update(name, (server) => {
          if (server.type === "remote") server.headers = resolved.headers
        })
      }
    })

    // Before a tool: a hook whose command fails stops the tool, and the AI reads why as the tool's error.
    await ctx.tool.hook("execute.before", async (event) => {
      for (const hook of hooksFor(await loadHooks(), "before-tool", event.tool)) {
        const result = await runHook(
          hook.command,
          directory,
          hookEnvironment("before-tool", event.tool, event.input, event.sessionID),
        )

        if (result.code !== 0)
          throw new Error(
            `Stopped by the user's hook "${hook.name}": ${result.output === "" ? `exit code ${result.code}` : result.output}`,
          )
      }
    })

    // After a tool: what a hook's command prints (or that it failed) is added to what the AI sees of the result.
    await ctx.tool.hook("execute.after", async (event) => {
      if (event.status !== "completed") return
      const notes: string[] = []

      for (const hook of hooksFor(await loadHooks(), "after-tool", event.tool)) {
        const result = await runHook(
          hook.command,
          directory,
          hookEnvironment("after-tool", event.tool, event.input, event.sessionID),
        )

        if (result.output !== "" || result.code !== 0)
          notes.push(
            `[hook "${hook.name}"${result.code === 0 ? "" : ` failed with exit code ${result.code}`}]\n${result.output}`.trim(),
          )
      }

      if (notes.length === 0) return
      const note = notes.join("\n\n")
      const content = event.result.content
      const output = event.result.output
      // A result without its own text shows its output; keep that, then add the note.
      const before =
        content === undefined
          ? [
              {
                type: "text" as const,
                text: typeof output === "string" ? output : (JSON.stringify(output ?? null) ?? ""),
              },
            ]
          : content

      event.result = {
        ...event.result,
        content:
          typeof before === "string" ? `${before}\n\n${note}` : [...before, { type: "text" as const, text: note }],
      }
    })

    // When the AI finishes its answer in this project. The listener runs beside the plugin; it never blocks setup.
    const generation = (finishedRegistry.generations.get(directory) ?? 0) + 1

    finishedRegistry.generations.set(directory, generation)
    void (async () => {
      // "Execution succeeded" is what the server sends when a run of the AI ends with its answer.
      for await (const event of ctx.event.subscribe({ types: ["session.execution.succeeded"] })) {
        if (finishedRegistry.generations.get(directory) !== generation) return
        if (event.type !== "session.execution.succeeded") continue
        if (event.location && event.location.directory !== directory) continue
        const session = event.data.sessionID
        const last = finishedRegistry.fired.get(session) ?? 0

        if (Date.now() - last < 2000) continue
        finishedRegistry.fired.set(session, Date.now())
        for (const hook of hooksFor(await loadHooks(), "finished", undefined))
          await runHook(hook.command, directory, hookEnvironment("finished", undefined, undefined, session))
      }
    })().catch(() => undefined)

    // Every request of the app's own agents carries this build's working rules: what "this" means, the user's
    // language, and (for the build agent) to do a direct request at once. An agent the user wrote keeps its own
    // instructions untouched.
    const guided = new Set(["build", "plan", "ask", "debug", "orchestrator"])

    await ctx.session.hook("context", async (event) => {
      if (guided.has(event.agent)) event.system.push({ type: "text", text: houseRules(directory, event.agent) })
      // Memory reaches every agent, the user's own ones too.
      const memory = memoryPrompt(await loadMemories())

      if (memory) event.system.push({ type: "text", text: memory })
    })

    await ctx.tool.transform((tools) => {
      // The user's memory (Customize > Memory): saved when they ask the AI to remember something.
      tools.add({
        name: "memory_save",
        options: { codemode: false },
        description:
          'Saves one short fact to the user\'s permanent memory, which every future chat sees. Use it only when the user asks you to remember something ("yaad rakho", "remember that ...") or states a lasting preference. One fact per call, written as a short sentence about the user.',
        input: Schema.Struct({ text: Schema.String }),
        output: Schema.Struct({ saved: Schema.Boolean, count: Schema.Number }),
        execute: async ({ text }) => {
          const before = await loadMemories()
          const after = addMemory(before, text)

          if (after.length !== before.length) await saveMemories(after)

          return {
            output: { saved: after.length !== before.length, count: after.length },
            content:
              after.length !== before.length
                ? `Saved to memory (${after.length} memories now).`
                : "Nothing new to save: it is empty or already in memory.",
          }
        },
      })
      tools.add({
        name: "memory_forget",
        options: { codemode: false },
        description:
          "Removes facts from the user's permanent memory: every saved memory that contains the given words. Use it when the user asks you to forget something.",
        input: Schema.Struct({ text: Schema.String }),
        output: Schema.Struct({ removed: Schema.Number }),
        execute: async ({ text }) => {
          const { left, removed } = forgetMemories(await loadMemories(), text)

          if (removed > 0) await saveMemories(left)

          return { output: { removed }, content: removed > 0 ? `Removed ${removed} memories.` : "No memory matched." }
        },
      })
      tools.add({
        name: "project_detect",
        options: { codemode: false },
        description:
          "Works out what this project is (website frontend / backend / full website, mobile app, desktop app, Python, static site, or an empty folder), which dev/build/test/lint commands it defines, and which skills to load for it, in order. Call this first, before planning or building anything.",
        input: Schema.Struct({}),
        output: Schema.Struct({
          kind: Schema.String,
          stack: Schema.Array(Schema.String),
          web: Schema.Boolean,
          skills: Schema.Array(Schema.String),
          commands: Schema.Record(Schema.String, Schema.String),
        }),
        // Read again on every call: the project changes while it is being built.
        execute: async () => {
          const detection = await readProject(directory)

          return {
            output: {
              kind: detection.kind,
              stack: [...detection.stack],
              web: detection.web,
              skills: [...detection.skills],
              commands: Object.fromEntries(
                Object.entries(detection.commands).flatMap(([name, command]) => (command ? [[name, command]] : [])),
              ),
            },
            content: describeDetection(detection),
          }
        },
      })
    })

    // Three more modes beside Build and Plan, as Kilo Code offers them: Ask only reads and answers, Debug finds the
    // root cause before it changes anything, Orchestrator splits a big job and hands the parts to subagents.
    // An agent the user already configured under the same id is left as it is.
    await ctx.agent.transform((editor) => {
      if (!editor.get("ask"))
        editor.update("ask", (agent) => {
          agent.name = Agent.Name.make("Ask")
          agent.description = "Answers questions only: reads and explains code, changes nothing."
          agent.mode = "primary"
          agent.system = askPrompt
          agent.permissions.push(
            { action: "*", resource: "*", effect: "deny" },
            { action: "read", resource: "*", effect: "allow" },
            { action: "read", resource: "*.env", effect: "ask" },
            { action: "read", resource: "*.env.*", effect: "ask" },
            { action: "grep", resource: "*", effect: "allow" },
            { action: "glob", resource: "*", effect: "allow" },
            { action: "webfetch", resource: "*", effect: "allow" },
            { action: "websearch", resource: "*", effect: "allow" },
            { action: "skill", resource: "*", effect: "allow" },
            { action: "question", resource: "*", effect: "allow" },
          )
        })
      if (!editor.get("debug"))
        editor.update("debug", (agent) => {
          agent.name = Agent.Name.make("Debug")
          agent.description = "Finds the root cause of a bug, then fixes it and adds a test."
          agent.mode = "primary"
          agent.system = debugPrompt
          agent.permissions.push({ action: "question", resource: "*", effect: "allow" })
        })
      if (!editor.get("orchestrator"))
        editor.update("orchestrator", (agent) => {
          agent.name = Agent.Name.make("Orchestrator")
          agent.description = "Splits a big job into parts, hands them to subagents and joins the results."
          agent.mode = "primary"
          agent.system = orchestratorPrompt
          agent.permissions.push({ action: "question", resource: "*", effect: "allow" })
        })
    })

    await ctx.command.transform((editor) => {
      const command = (name: string, description: string, prompt: string) =>
        editor.add({
          name,
          description,
          execute: async (input) => {
            await ctx.session.prompt({
              ...input.prompt,
              sessionID: input.sessionID,
              text: `${prompt}${input.prompt.text ?? ""}`,
              delivery: input.delivery,
            })
          },
        })

      command("banao", "Build something new: define -> plan -> build -> verify -> security -> ship", buildPrompt)
      command("jaanch", "Run the tests, find the bugs, fix them, check again", verifyPrompt)
      command("suraksha", "Security review (OWASP) and fix what it finds", securityPrompt)
    })
  },
})
