import { spawn, type ChildProcess } from "node:child_process"
import { once } from "node:events"
import { createReadStream } from "node:fs"
import { access, mkdir, readFile, stat, writeFile } from "node:fs/promises"
import { createServer, type Server } from "node:http"
import path from "node:path"
import type { Plugin } from "@opencode/plugin/gui/main"
import { ApnaTools, type ApnaToolsState, type RunState } from "./contract"
import { describe, detect, findUrl, type RunPlan } from "./detect"

const exists = (file: string) =>
  access(file).then(
    () => true,
    () => false,
  )

const messageOf = (error: unknown) => (error instanceof Error ? error.message : String(error))

/** Lines of server output kept per project. */
const keepLines = 60

const types: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".htm": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
  ".mp3": "audio/mpeg",
}

/** One running project: its process or its built-in web server. */
type Running = { state: RunState; child?: ChildProcess; server?: Server }

const setup: Plugin.MainSetup = (ctx) => {
  const log = ctx.log
  const signal = ctx.signal
  const runs = new Map<string, Running>()

  const state = (): ApnaToolsState => ({
    runs: Object.fromEntries([...runs].map(([folder, run]) => [folder, { ...run.state, log: [...run.state.log] }])),
  })

  const provider = ctx.provide(ApnaTools, {
    state,
    run: (folder) => run(folder),
    stop: (folder) => stop(folder),
    dictate: () => dictate(),
    saveChat: (input) => saveChat(input),
  })

  const update = (folder: string, change: Partial<RunState>) => {
    const current = runs.get(folder)

    if (!current) return
    current.state = { ...current.state, ...change }
    provider.changed()
  }

  const addLines = (folder: string, text: string) => {
    const current = runs.get(folder)

    if (!current) return
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.replace(/\u001b\[[0-9;?]*[A-Za-z]/g, "").trimEnd())
      .filter((line) => line.trim() !== "")

    if (lines.length === 0) return
    const url = current.state.url ?? lines.map(findUrl).find((found) => found !== undefined)

    current.state = {
      ...current.state,
      log: [...current.state.log, ...lines].slice(-keepLines),
      url: url ?? null,
      status: url && current.state.status === "starting" ? "running" : current.state.status,
    }
    provider.changed()
  }

  /** Runs a command line in the project and resolves with its exit code; output goes to the project's log. */
  const exec = (folder: string, line: string, keep: (child: ChildProcess) => void) => {
    const child = spawn("cmd.exe", ["/d", "/s", "/c", line], {
      cwd: folder,
      windowsHide: true,
      // BROWSER=none keeps create-react-app and friends from opening a second browser window.
      env: { ...process.env, BROWSER: "none", FORCE_COLOR: "0", NO_COLOR: "1" },
    })

    keep(child)
    child.stdout?.on("data", (chunk: Buffer) => addLines(folder, chunk.toString()))
    child.stderr?.on("data", (chunk: Buffer) => addLines(folder, chunk.toString()))

    return new Promise<number | null>((resolve) => {
      child.on("error", (error) => {
        addLines(folder, messageOf(error))
        resolve(-1)
      })
      child.on("exit", (code) => resolve(code))
    })
  }

  /** Serves a folder of web files on the first free port from 5500. */
  const serveStatic = async (folder: string, root: string) => {
    const base = path.resolve(folder, root)
    const server = createServer((request, response) => {
      const url = new URL(request.url ?? "/", "http://localhost")
      const wanted = path.resolve(base, `.${decodeURIComponent(url.pathname)}`)

      // Nothing outside the project's folder is served.
      if (wanted !== base && !wanted.startsWith(base + path.sep)) {
        response.writeHead(403).end()
        return
      }

      void stat(wanted)
        .then((info) => (info.isDirectory() ? path.join(wanted, "index.html") : wanted))
        .then((file) =>
          stat(file).then(() => {
            response.writeHead(200, {
              "content-type": types[path.extname(file).toLowerCase()] ?? "application/octet-stream",
              "cache-control": "no-store",
            })
            createReadStream(file).pipe(response)
            addLines(folder, `GET ${url.pathname} 200`)
          }),
        )
        .catch(() => {
          response.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("Not found")
          addLines(folder, `GET ${url.pathname} 404`)
        })
    })

    for (let port = 5500; port < 5600; port++) {
      const ok = await new Promise<boolean>((resolve) => {
        server.once("error", () => resolve(false))
        server.listen(port, "127.0.0.1", () => resolve(true))
      })

      if (ok) return { server, url: `http://localhost:${port}/` }
    }

    throw new Error("No free port between 5500 and 5599.")
  }

  const start = async (folder: string, plan: RunPlan) => {
    if (plan.kind === "static") {
      const { server, url } = await serveStatic(folder, plan.root)
      const current = runs.get(folder)

      if (!current) return server.close()
      current.server = server
      update(folder, { status: "running", url })
      addLines(folder, `Serving ${path.resolve(folder, plan.root)} at ${url}`)

      return
    }

    if (plan.kind === "npm" && plan.install) {
      update(folder, { status: "installing" })
      addLines(folder, "> npm install")
      const code = await exec(folder, "npm install", (child) => {
        const current = runs.get(folder)

        if (current) current.child = child
      })

      if (runs.get(folder)?.state.status !== "installing") return
      if (code !== 0) {
        update(folder, { status: "failed", message: `npm install ended with code ${String(code)}.` })
        return
      }
    }

    update(folder, { status: "starting" })
    const line = plan.kind === "npm" ? describe(plan) : `python ${plan.args.join(" ")}`
    addLines(folder, `> ${line}`)
    const code = await exec(folder, line, (child) => {
      const current = runs.get(folder)

      if (current) current.child = child
    })
    const current = runs.get(folder)

    // A stop by the user already set the state.
    if (!current || current.state.status === "stopped") return
    update(folder, {
      status: code === 0 ? "stopped" : "failed",
      message: code === 0 ? "The server ended." : `It ended with code ${String(code)}. See the lines below.`,
    })
  }

  const run = async (folder: string): Promise<void> => {
    const active = runs.get(folder)

    if (active && ["installing", "starting", "running"].includes(active.state.status)) return
    const plan = await detect({
      read: (file) => readFile(path.join(folder, file), "utf8").catch(() => undefined),
      has: (file) => exists(path.join(folder, file)),
    })

    if (!plan) throw new Error("No package.json script, Python app or index.html found in this folder.")
    runs.set(folder, {
      state: { status: "starting", command: describe(plan), url: null, message: null, log: [] },
    })
    provider.changed()
    void start(folder, plan).catch((error) => {
      log.write("error", "apna-tools: run failed", { folder, error: messageOf(error) })
      update(folder, { status: "failed", message: messageOf(error) })
    })
  }

  /** Ends a process with everything it started (npm starts node, which may start more). */
  const kill = async (child: ChildProcess) => {
    if (child.exitCode !== null || child.pid === undefined) return
    const killer = spawn("taskkill", ["/pid", String(child.pid), "/t", "/f"], { stdio: "ignore", windowsHide: true })

    await once(killer, "exit").catch(() => undefined)
  }

  const stop = async (folder: string): Promise<void> => {
    const current = runs.get(folder)

    if (!current) return
    current.state = { ...current.state, status: "stopped", message: "Stopped." }
    provider.changed()
    current.server?.close()
    current.server = undefined
    if (current.child) await kill(current.child)
    current.child = undefined
  }

  // Win+H opens Windows voice typing, which types what is said into the focused box.
  const dictate = async (): Promise<void> => {
    if (process.platform !== "win32") throw new Error("Voice typing needs Windows.")
    const script = [
      "Add-Type -Namespace Apna -Name Keys -MemberDefinition '[DllImport(\"user32.dll\")] public static extern void keybd_event(byte k, byte s, uint f, System.UIntPtr e);'",
      "[Apna.Keys]::keybd_event(0x5B, 0, 0, [UIntPtr]::Zero)",
      "[Apna.Keys]::keybd_event(0x48, 0, 0, [UIntPtr]::Zero)",
      "[Apna.Keys]::keybd_event(0x48, 0, 2, [UIntPtr]::Zero)",
      "[Apna.Keys]::keybd_event(0x5B, 0, 2, [UIntPtr]::Zero)",
    ].join("; ")
    const child = spawn("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", script], {
      stdio: "ignore",
      windowsHide: true,
    })
    const [code] = await once(child, "exit")

    if (code !== 0) throw new Error(`Voice typing could not be opened (code ${String(code)}).`)
  }

  const saveChat = async (input: { directory: string; name: string; content: string }): Promise<string> => {
    const clean = input.name.replace(/[<>:"/\\|?*\u0000-\u001f]+/g, " ").trim().slice(0, 80) || "chat"
    const folder = path.join(input.directory, "chats")
    const file = path.join(folder, `${clean}.md`)

    await mkdir(folder, { recursive: true })
    await writeFile(file, input.content, "utf8")

    return file
  }

  // Closing the app ends every server Run started.
  signal.addEventListener("abort", () => {
    for (const current of runs.values()) {
      current.server?.close()
      if (current.child) void kill(current.child)
    }
  })
}

export default setup
