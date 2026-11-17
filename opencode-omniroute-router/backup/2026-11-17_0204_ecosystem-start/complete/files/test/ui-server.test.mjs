import test from "node:test"
import assert from "node:assert/strict"
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises"
import { request as httpRequest } from "node:http"
import { tmpdir } from "node:os"
import { join } from "node:path"

import { startUiServer, previewRoute, routeMap, loadProjectOptions } from "../src/ui-server.mjs"

const CLOSED = "http://127.0.0.1:9" // nothing listens here: gateway/ollama "down"

async function makeProject({ local = true } = {}) {
  const dir = await mkdtemp(join(tmpdir(), "sangam-proj-"))
  await mkdir(join(dir, ".opencode"))
  const workers = { free: "free-worker", fast: "smart-fast", standard: "smart-standard", strong: "smart-strong", expert: "expert" }
  if (local) workers.local = "local-worker"
  await writeFile(join(dir, ".opencode", "opencode.json"), JSON.stringify({
    default_agent: "smart-orchestrator",
    plugin: [["file:///x/opencode-omniroute-router/src/plugin.mjs", {
      workers,
      models: { "smart-standard": "omniroute/combo/eco-heavy", "local-worker": "ollama/qwen2.5:7b" },
      gatewayUrl: CLOSED,
    }]],
  }))
  return dir
}

async function start(extra = {}) {
  const project = extra.project ?? await makeProject()
  const historyFile = join(await mkdtemp(join(tmpdir(), "sangam-hist-")), "history.jsonl")
  const ui = await startUiServer({
    port: 0,
    project,
    historyFile,
    gateway: CLOSED,
    ollama: CLOSED,
    opencodeBin: process.execPath,
    // Fake "opencode run": prints a route line and echoes the request.
    runArgs: (request, { agent } = {}) => ["-e", "console.log('agent: ' + process.argv[2]); console.log('got: ' + process.argv[1]); console.log('tests 2 pass')", request, String(agent)],
    ...extra,
  })
  return { ui, project, historyFile }
}

function call(ui, path, { method = "GET", body, token = ui.token, host } = {}) {
  return new Promise((resolve, reject) => {
    const req = httpRequest({
      host: "127.0.0.1",
      port: ui.port,
      path,
      method,
      headers: {
        "content-type": "application/json",
        ...(token ? { "x-sangam-token": token } : {}),
        ...(host ? { host } : {}),
      },
    }, (res) => {
      let data = ""
      res.on("data", (c) => (data += c))
      res.on("end", () => {
        let json = null
        try { json = JSON.parse(data) } catch {}
        resolve({ status: res.statusCode, text: data, json })
      })
    })
    req.on("error", reject)
    if (body !== undefined) req.write(typeof body === "string" ? body : JSON.stringify(body))
    req.end()
  })
}

test("serves the page with the boot token and security headers", async () => {
  const { ui, project } = await start()
  try {
    const res = await call(ui, "/", { token: null })
    assert.equal(res.status, 200)
    assert.ok(res.text.includes(ui.token))
    assert.ok(res.text.includes(JSON.stringify(project).slice(1, -1)))
    assert.ok(!res.text.includes("__SANGAM_BOOT__"))
  } finally {
    await ui.close()
  }
})

test("rejects API calls without the token or from a foreign host", async () => {
  const { ui } = await start()
  try {
    assert.equal((await call(ui, "/api/status", { token: null })).status, 403)
    assert.equal((await call(ui, "/api/status", { token: "wrong" })).status, 403)
    assert.equal((await call(ui, "/api/status", { host: `evil.example:${ui.port}` })).status, 403)
    assert.equal((await call(ui, "/", { token: null, host: "evil.example" })).status, 403)
  } finally {
    await ui.close()
  }
})

test("status reports down services without throwing", async () => {
  const { ui } = await start()
  try {
    const res = await call(ui, "/api/status")
    assert.equal(res.status, 200)
    assert.equal(res.json.app, "Sangam")
    assert.equal(res.json.gateway.up, false)
    assert.equal(res.json.ollama.up, false)
    assert.equal(res.json.opencode.installed, true)
  } finally {
    await ui.close()
  }
})

test("project endpoint returns the route map including the local worker", async () => {
  const { ui, project } = await start()
  try {
    const res = await call(ui, "/api/project")
    assert.equal(res.json.path, project)
    assert.equal(res.json.configured, true)
    const local = res.json.routes.find((r) => r.tier === "local")
    assert.deepEqual(local, { tier: "local", worker: "local-worker", model: "ollama/qwen2.5:7b" })
    assert.equal(res.json.routes.find((r) => r.tier === "standard").model, "omniroute/combo/eco-heavy")
    assert.equal(res.json.routes.find((r) => r.tier === "free").model, "omniroute/auto/fast", "unlisted models fall back to defaults")

    assert.equal((await call(ui, "/api/project?path=" + encodeURIComponent("Z:/no/such/dir/xyz"))).status, 400)
    assert.equal((await call(ui, "/api/project?path=relative/dir")).status, 400)
  } finally {
    await ui.close()
  }
})

test("classify previews the route and the gateway-down fallback", async () => {
  const { ui } = await start()
  try {
    const res = await call(ui, "/api/classify", { method: "POST", body: { request: "Fix the crash when the cart is empty." } })
    assert.equal(res.json.tier, "standard")
    assert.equal(res.json.worker, "local-worker", "gateway (CLOSED) is down, so the local worker takes over")
    assert.equal(res.json.fallback, "gateway-unreachable")
    assert.equal(res.json.model, "ollama/qwen2.5:7b")
    assert.deepEqual((await call(ui, "/api/classify", { method: "POST", body: { request: "  " } })).json, { empty: true })
    assert.equal((await call(ui, "/api/classify", { method: "POST", body: "{not json" })).status, 400)
  } finally {
    await ui.close()
  }
})

test("previewRoute without a local worker keeps cloud routing", () => {
  const d = previewRoute("Offline me README ka typo theek karo", {}, { gatewayDown: true })
  assert.equal(d.worker, "smart-fast")
  assert.equal(d.fallback, undefined)
  assert.equal(routeMap({}).length, 5)
})

test("loadProjectOptions returns null for folders without the plugin", async () => {
  const dir = await mkdtemp(join(tmpdir(), "sangam-empty-"))
  assert.equal(await loadProjectOptions(dir), null)
})

test("history returns stats and newest entries first", async () => {
  const { ui, historyFile } = await start()
  try {
    await writeFile(historyFile, [
      { timestamp: "2026-01-01T00:00:00Z", type: "dispatch", sessionId: "a", tier: "free", model: "m", reason: { taskType: "auxiliary" } },
      { timestamp: "2026-01-01T00:01:00Z", type: "outcome", sessionId: "a", verificationEvidence: true },
      { timestamp: "2026-01-01T00:02:00Z", type: "dispatch", sessionId: "b", tier: "standard", local: true, fallback: "gateway-unreachable", model: "o" },
    ].map((e) => JSON.stringify(e)).join("\n") + "\n")
    const res = await call(ui, "/api/history?limit=2")
    assert.equal(res.json.recent.length, 2)
    assert.equal(res.json.recent[0].sessionId, "b")
    assert.deepEqual(res.json.stats.routing, { cloud: 1, local: 1, fallback: 1 })
    assert.equal(res.json.stats.overall.success, 1)
  } finally {
    await ui.close()
  }
})

test("direct mode runs the routed worker, streams output and records history", async () => {
  const { ui, historyFile } = await start()
  try {
    const tricky = `Explain "quotes" & pipes | ; $(echo nope)`
    const res = await call(ui, "/api/run", { method: "POST", body: { request: tricky } })
    assert.equal(res.status, 200)
    assert.match(res.text, /seedha worker/)
    // gateway is CLOSED, so the configured local worker takes over
    assert.match(res.text, /ROUTED: local-worker \| MODEL: ollama\/qwen2\.5:7b \| TIER: free \| LOCAL \| FALLBACK: OmniRoute unreachable/)
    assert.match(res.text, /agent: local-worker/)
    assert.ok(res.text.includes("got: " + tricky), "request reaches the process verbatim, no shell")

    const lines = (await readFile(historyFile, "utf8")).trim().split("\n").map((l) => JSON.parse(l))
    assert.deepEqual(lines.map((l) => l.type), ["dispatch", "outcome"])
    assert.equal(lines[0].source, "sangam")
    assert.equal(lines[0].selectedWorker, "local-worker")
    assert.equal(lines[0].fallback, "gateway-unreachable")
    assert.equal(lines[1].sessionId, lines[0].sessionId)
    assert.equal(lines[1].exitCode, 0)
    assert.equal(lines[1].verificationEvidence, true)
    assert.match(res.text, /khatam \(exit 0\)/)
    assert.equal((await call(ui, "/api/run", { method: "POST", body: { request: "" } })).status, 400)
    assert.equal((await call(ui, "/api/run", { method: "POST", body: { request: "x".repeat(9000) } })).status, 400)
  } finally {
    await ui.close()
  }
})

test("only one run at a time, and stop ends it", async () => {
  const { ui } = await start({ runArgs: () => ["-e", "console.log('start'); setTimeout(() => {}, 60000)"] })
  try {
    const first = call(ui, "/api/run", { method: "POST", body: { request: "long task" } })
    let status
    for (let i = 0; i < 50; i++) {
      status = await call(ui, "/api/status")
      if (status.json.running) break
      await new Promise((r) => setTimeout(r, 50))
    }
    assert.ok(status.json.running, "run is reported as running")
    assert.equal((await call(ui, "/api/run", { method: "POST", body: { request: "second" } })).status, 409)
    assert.equal((await call(ui, "/api/stop", { method: "POST", body: {} })).json.stopped, true)
    const done = await first
    assert.match(done.text, /khatam/)
    assert.equal((await call(ui, "/api/status")).json.running, null)
  } finally {
    await ui.close()
  }
})

test("orchestrator mode runs the default agent and leaves history to the plugin", async () => {
  const { ui, historyFile } = await start()
  try {
    const res = await call(ui, "/api/run", { method: "POST", body: { request: "Fix the typo in the README.", mode: "orchestrator" } })
    assert.match(res.text, /\(orchestrator\)/)
    assert.match(res.text, /agent: undefined/)
    assert.doesNotMatch(res.text, /ROUTED:/)
    await assert.rejects(readFile(historyFile, "utf8"))
  } finally {
    await ui.close()
  }
})

test("projects without the router fall back to orchestrator mode", async () => {
  const dir = await mkdtemp(join(tmpdir(), "sangam-plain-"))
  const { ui } = await start({ project: dir })
  try {
    const res = await call(ui, "/api/run", { method: "POST", body: { request: "Explain this." } })
    assert.match(res.text, /\(orchestrator\)/)
  } finally {
    await ui.close()
  }
})