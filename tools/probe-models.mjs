// Starts the source OpenCode server on a private port, asks for the model list a few times, prints what
// OmniRoute / Ollama models it sees, then stops the server.
// Usage: node probe-models.mjs [port] [seconds]
import { spawn } from "node:child_process"

const repo = "C:\\Users\\Roshan\\Downloads\\Programming\\opencode"
const bun = "C:\\Users\\Roshan\\AppData\\Roaming\\npm\\node_modules\\bun\\bin\\bun.exe"
const port = process.argv[2] ?? "4199"
const seconds = Number(process.argv[3] ?? "70")
const location = "C:/Users/Roshan/Downloads/ecosystem-test-project"

const server = spawn(bun, ["run", "--cwd", "packages/cli", "src/index.ts", "serve", "--port", port], {
  cwd: repo,
  env: { ...process.env, OPENCODE_CHANNEL: "local", PATH: `${bun.replace(/\\bun\.exe$/, "")};${process.env.PATH}` },
  windowsHide: true,
})

const out = { text: "" }
server.stdout.on("data", (chunk) => (out.text += chunk))
server.stderr.on("data", (chunk) => (out.text += chunk))

const stop = (code) => {
  spawn("taskkill", ["/pid", String(server.pid), "/t", "/f"], { windowsHide: true }).on("exit", () => process.exit(code))
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const started = Date.now()
while (!/server password (\S+)/.test(out.text)) {
  if (Date.now() - started > 150_000) {
    console.log("server did not start:\n" + out.text.slice(-1500))
    stop(1)
    await sleep(5000)
  }
  await sleep(500)
}
const password = /server password (\S+)/.exec(out.text)[1]
console.log(`server up after ${((Date.now() - started) / 1000).toFixed(0)} s`)

const auth = "Basic " + Buffer.from(`opencode:${password}`).toString("base64")
const ask = async (path) => {
  const response = await fetch(`http://127.0.0.1:${port}${path}`, { headers: { authorization: auth } })
  const text = await response.text()
  try {
    return { status: response.status, body: JSON.parse(text) }
  } catch {
    return { status: response.status, body: text.slice(0, 300) }
  }
}

const end = Date.now() + seconds * 1000
while (Date.now() < end) {
  const result = await ask(`/api/model?location%5Bdirectory%5D=${encodeURIComponent(location)}`).catch((error) => ({
    status: 0,
    body: String(error),
  }))
  const list = Array.isArray(result.body) ? result.body : (result.body?.data ?? result.body?.items ?? [])
  if (!Array.isArray(list) || list.length === 0) {
    console.log(`t=${((Date.now() - started) / 1000).toFixed(0)}s status=${result.status}`, JSON.stringify(result.body).slice(0, 300))
  } else {
    const of = (provider) => list.filter((model) => (model.providerID ?? model.provider) === provider)
    const omni = of("omniroute")
    console.log(
      `t=${((Date.now() - started) / 1000).toFixed(0)}s total=${list.length} ollama=${of("ollama").length} omniroute=${omni.length}`,
    )
    if (omni.length > 0) console.log("  " + omni.map((model) => model.id ?? model.modelID).join(" | ").slice(0, 1500))
    if (process.argv.includes("--sample")) console.log(JSON.stringify(list[0]).slice(0, 600))
  }
  await sleep(15_000)
}
stop(0)
