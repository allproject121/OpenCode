// Starts the source OpenCode server (with the build's own settings folder), waits, GETs the given API paths for a
// project folder, prints short answers, and stops the server.
// Usage: node api.mjs <projectDir> <waitSeconds> <path> [<path> ...]      e.g.  node api.mjs C:/x 20 /api/plugin /api/skill
import { spawn } from "node:child_process"

const repo = "C:\\Users\\Roshan\\Downloads\\Programming\\opencode"
const bunDir = "C:\\Users\\Roshan\\AppData\\Roaming\\npm\\node_modules\\bun\\bin"
const [project, wait, ...paths] = process.argv.slice(2)
const port = "4198"

const server = spawn(`${bunDir}\\bun.exe`, ["run", "--cwd", "packages/cli", "src/index.ts", "serve", "--port", port], {
  cwd: repo,
  env: {
    ...process.env,
    OPENCODE_CHANNEL: "local",
    // APNA_CONFIG_DIR points the test server at another settings folder; APNA_RAW=1 prints the raw answers.
    OPENCODE_CONFIG_DIR: process.env.APNA_CONFIG_DIR ?? "C:\\Users\\Roshan\\Downloads\\Programming\\config",
    PATH: `${bunDir};${process.env.PATH}`,
  },
  windowsHide: true,
})

const out = { text: "" }
server.stdout.on("data", (chunk) => (out.text += chunk))
server.stderr.on("data", (chunk) => (out.text += chunk))

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const stop = (code) =>
  spawn("taskkill", ["/pid", String(server.pid), "/t", "/f"], { windowsHide: true }).on("exit", () => process.exit(code))

const started = Date.now()
while (!/server password (\S+)/.test(out.text)) {
  if (Date.now() - started > 150_000) {
    console.log("server did not start:\n" + out.text.slice(-1200))
    stop(1)
    await sleep(5000)
  }
  await sleep(400)
}

const auth = "Basic " + Buffer.from(`opencode:${/server password (\S+)/.exec(out.text)[1]}`).toString("base64")
const get = async (path) => {
  const separator = path.includes("?") ? "&" : "?"
  const response = await fetch(
    `http://127.0.0.1:${port}${path}${separator}location%5Bdirectory%5D=${encodeURIComponent(project)}`,
    { headers: { authorization: auth } },
  )

  return { status: response.status, text: await response.text() }
}

// Touch the project once so its plugins start loading, then give them time.
await get(paths[0]).catch(() => undefined)
await sleep(Number(wait) * 1000)

for (const path of paths) {
  const result = await get(path).catch((error) => ({ status: 0, text: String(error) }))
  const parsed = (() => {
    try {
      return JSON.parse(result.text)
    } catch {
      return undefined
    }
  })()
  // APNA_OUT=<folder> also saves each full answer there, one file per path.
  if (process.env.APNA_OUT)
    (await import("node:fs")).writeFileSync(`${process.env.APNA_OUT}/${path.replace(/[^a-z0-9]+/gi, "_")}.json`, result.text)
  const data = parsed?.data ?? parsed
  const summary = Array.isArray(data)
    ? `${data.length} items: ` + data.map((item) => item.id ?? item.name ?? JSON.stringify(item).slice(0, 60)).join(", ")
    : result.text
  console.log(`\n== ${path} -> ${result.status}\n${process.env.APNA_RAW ? result.text.slice(0, 5000) : summary.slice(0, 1800)}`)
}

stop(0)
