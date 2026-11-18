// Gives the running app a job the way its own window does: a new chat in a folder, one request, then waits until
// the chat goes idle (or the time runs out) and prints what happened, step by step. The chat shows in the app.
// Every permission in that one chat is allowed, so the AI never stops to ask.
// Usage: node ask-app.mjs <folder> <model provider/id> <title> <file with the request text> [maxMinutes]
import { readFileSync } from "node:fs"

const root = "C:\\Users\\Roshan\\Downloads\\Programming"
const [folder, modelArg, title, requestFile, minutes = "40"] = process.argv.slice(2)
const port = [...readFileSync(`${root}\\logs\\app.log`, "latin1").matchAll(/url: 'http:\/\/127\.0\.0\.1:(\d+)'/g)].at(-1)?.[1]
const password = JSON.parse(readFileSync(`${root}\\config\\service-local.json`, "utf8")).password
const auth = "Basic " + Buffer.from(`opencode:${password}`).toString("base64")
const location = `location%5Bdirectory%5D=${encodeURIComponent(folder)}`
const call = async (method, path, body) => {
  const separator = path.includes("?") ? "&" : "?"
  const response = await fetch(`http://127.0.0.1:${port}${path}${separator}${location}`, {
    method,
    headers: { authorization: auth, "content-type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await response.text()

  if (!response.ok) throw new Error(`${method} ${path} -> ${response.status}: ${text.slice(0, 400)}`)

  return text === "" ? undefined : JSON.parse(text).data
}
const [providerID, ...rest] = modelArg.split("/")
const session = await call("POST", "/api/session", {
  title,
  model: { providerID, id: rest.join("/") },
  location: { directory: folder },
  permissions: [{ action: "*", resource: "*", effect: "allow" }],
})

console.log(`chat ${session.id} made at ${new Date().toTimeString().slice(0, 8)}`)
await call("POST", `/api/session/${session.id}/prompt`, { text: readFileSync(requestFile, "utf8") })

const started = Date.now()
const seen = new Set()
const show = (message) => {
  for (const part of message.content ?? []) {
    const key = `${message.id}:${part.id ?? part.type}:${part.state?.status ?? ""}`

    if (seen.has(key)) continue
    seen.add(key)
    if (part.type === "tool" && part.state?.status && part.state.status !== "running" && part.state.status !== "pending")
      console.log(
        `  [${part.name}] ${part.state.status}: ${JSON.stringify(part.state.input ?? {}).slice(0, 140)}${part.state.status === "error" ? " -> " + String(part.state.error ?? "").slice(0, 160) : ""}`,
      )
    if (part.type === "text" && message.completed !== false) console.log(`  [text] ${String(part.text).replace(/\s+/g, " ").slice(0, 400)}`)
  }
}

while (Date.now() - started < Number(minutes) * 60_000) {
  await new Promise((resolve) => setTimeout(resolve, 10_000))
  const info = await call("GET", `/api/session/${session.id}`).catch(() => undefined)
  const messages = await call("GET", `/api/session/${session.id}/message?limit=200`).catch(() => undefined)
  const list = Array.isArray(messages) ? messages : (messages?.items ?? [])

  for (const message of list) if (message.type === "assistant") show(message)
  if (info?.time?.idle && info.time.idle > (info.time.busy ?? 0) && Date.now() - started > 30_000) {
    console.log(`idle at ${new Date().toTimeString().slice(0, 8)}: ${info.idleOutcome ?? info.idle_outcome ?? ""}`)
    process.exit(0)
  }
}

console.log(`still working after ${minutes} minutes; left running in the app`)
