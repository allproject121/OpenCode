// Starts "Sign in with ChatGPT" for OpenAI, opens the OpenAI page in the default browser, and waits (up to 10
// minutes) until the user has approved it there. The sign-in is kept by OpenCode itself (the same store the app
// uses); this script never sees or prints a password, code or token.
// It runs its own short-lived server from this source tree, so a fix to the sign-in code applies without
// restarting the app.
// Usage: node signin-openai.mjs [chatgpt-token-sharing | chatgpt-browser]
import { execFile, spawn } from "node:child_process"

const repo = "C:\\Users\\Roshan\\Downloads\\Programming\\opencode"
const bunDir = "C:\\Users\\Roshan\\AppData\\Roaming\\npm\\node_modules\\bun\\bin"
const port = "4199"
// The sign-in method: chatgpt-token-sharing ("Sign in with ChatGPT", default) or chatgpt-browser ("Codex browser").
const methodWanted = process.argv[2] ?? "chatgpt-token-sharing"
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const server = spawn(`${bunDir}\\bun.exe`, ["run", "--cwd", "packages/cli", "src/index.ts", "serve", "--port", port, "--print-logs", "--log-level", "warn"], {
  cwd: repo,
  env: {
    ...process.env,
    OPENCODE_CHANNEL: "local",
    OPENCODE_CONFIG_DIR: "C:\\Users\\Roshan\\Downloads\\Programming\\config",
    PATH: `${bunDir};${process.env.PATH}`,
  },
  windowsHide: true,
})
const out = { text: "" }

server.stdout.on("data", (chunk) => (out.text += chunk))
server.stderr.on("data", (chunk) => (out.text += chunk))
const stop = (code) =>
  spawn("taskkill", ["/pid", String(server.pid), "/t", "/f"], { windowsHide: true }).on("exit", () => process.exit(code))

const started = Date.now()

while (!/server password (\S+)/.test(out.text)) {
  if (Date.now() - started > 150_000) {
    console.log("server did not start")
    stop(1)
  }
  await sleep(400)
}

const auth = "Basic " + Buffer.from(`opencode:${/server password (\S+)/.exec(out.text)[1]}`).toString("base64")
const location = `location%5Bdirectory%5D=${encodeURIComponent("C:\\Users\\Roshan\\Documents\\Default Project")}`
const call = async (method, path, body) => {
  const response = await fetch(`http://127.0.0.1:${port}${path}?${location}`, {
    method,
    headers: { authorization: auth, "content-type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await response.text()

  if (!response.ok) throw new Error(`${method} ${path} -> ${response.status}: ${text.slice(0, 300)}`)

  return JSON.parse(text).data
}

try {
  // The sign-in methods appear once the server has loaded its plugins for this folder.
  for (const _ of Array.from({ length: 40 })) {
    const integration = await call("GET", "/api/integration/openai").catch(() => undefined)

    if (integration?.methods?.some((method) => method.id === methodWanted)) break
    await sleep(1500)
  }

  const attempt = await call("POST", "/api/integration/openai/connect/oauth", { methodID: methodWanted })

  // Only an OpenAI sign-in page is opened.
  if (new URL(attempt.url).hostname !== "auth.openai.com") throw new Error("Unexpected sign-in address")
  // Not through `cmd start`: it cuts the address at its first "&".
  execFile("rundll32", ["url.dll,FileProtocolHandler", attempt.url], { windowsHide: true })
  console.log("Opened the OpenAI sign-in page in the browser. Waiting for approval…")

  const waiting = Date.now()

  while (Date.now() - waiting < 10 * 60_000) {
    await sleep(3000)
    const status = await call("GET", `/api/integration/openai/connect/oauth/${attempt.attemptID}`)

    if (status.status !== "pending") {
      console.log("Sign-in result:", status.status, status.error ?? status.message ?? "")
      stop(status.status === "failed" ? 1 : 0)
      await sleep(10_000)
    }
  }

  console.log("No approval within 10 minutes; the attempt expires by itself.")
  stop(1)
} catch (error) {
  console.log("Sign-in could not start:", error instanceof Error ? error.message : String(error))
  // The server log names the cause; tokens and codes are never in it.
  console.log(
    out.text
      .split(/\r?\n/)
      .filter((line) => /error|fail|cause|reason/i.test(line))
      .slice(-12)
      .join("\n")
      .slice(0, 3000),
  )
  stop(1)
}
