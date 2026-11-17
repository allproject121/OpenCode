import { spawn, spawnSync } from "node:child_process"
import { randomBytes } from "node:crypto"
import { statSync } from "node:fs"
import { readFile } from "node:fs/promises"
import { createServer } from "node:http"
import { isAbsolute, join, dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { createTaskRouter, DEFAULT_WORKERS, DEFAULT_MODELS } from "./task-router.mjs"
import { computeStats, loadEntries, DEFAULT_HISTORY } from "./stats.mjs"
import { createHistoryRecorder } from "./history-recorder.mjs"
import { routedLine, VERIFICATION_EVIDENCE } from "./router-plugin.mjs"
import { checkGateway, checkOllama, findOpencode, opencodeVersion, DEFAULT_GATEWAY, DEFAULT_OLLAMA } from "./health.mjs"

/**
 * Sangam — local web UI for the ecosystem (OpenCode + OmniRoute + Ollama).
 *
 * Safety:
 * - binds 127.0.0.1 only;
 * - every /api call needs the per-start random token embedded in the page
 *   (blocks other websites from driving it) and a localhost Host header
 *   (blocks DNS rebinding);
 * - OpenCode is spawned without a shell, with the request as one argument.
 *
 * Run modes:
 * - "direct" (default when the project has the router configured): the
 *   deterministic router picks the worker and Sangam starts it directly with
 *   `opencode run --agent <worker>` — no orchestrator LLM call (cheaper, and
 *   small local models are unreliable as orchestrators). Sangam writes the
 *   dispatch/outcome history itself.
 * - "orchestrator": plain `opencode run` through the project's default agent;
 *   the plugin records history.
 */

export const APP_NAME = "Sangam"
export const DEFAULT_UI_PORT = 4510
const PLUGIN_NAME = "opencode-omniroute-router"
const PKG_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const MAX_BODY = 64 * 1024
const MAX_REQUEST_CHARS = 8000
const ANSI = /\u001b\[[0-9;?]*[ -\/]*[@-~]/g

/** Plugin options from <project>/.opencode/opencode.json (or null). */
export async function loadProjectOptions(project) {
  let config
  try {
    config = JSON.parse(await readFile(join(project, ".opencode", "opencode.json"), "utf8"))
  } catch {
    return null
  }
  const entry = (config.plugin ?? []).find((p) => {
    const name = Array.isArray(p) ? p[0] : p
    return typeof name === "string" && (name === PLUGIN_NAME || name.includes(PLUGIN_NAME))
  })
  if (!entry) return null
  return { defaultAgent: config.default_agent, options: (Array.isArray(entry) ? entry[1] : null) ?? {} }
}

/** Routing preview: tier, reason, worker and model for a request. */
export function previewRoute(request, options = {}, { gatewayDown = false } = {}) {
  const router = createTaskRouter({ workers: options.workers ?? DEFAULT_WORKERS, models: options.models })
  const localFallback = Boolean(router.localWorker) && options.localFallback !== false
  const decision = router.decide(request, { gatewayDown: localFallback && gatewayDown })
  return { ...decision, model: router.models[decision.worker] ?? null }
}

/** Tier -> worker -> model table for the route map. */
export function routeMap(options = {}) {
  const router = createTaskRouter({ workers: options.workers ?? DEFAULT_WORKERS, models: options.models })
  return [...router.workerByTier].map(([tier, worker]) => ({ tier, worker, model: router.models[worker] ?? null }))
}

export function isDirectory(path) {
  try {
    return isAbsolute(path) && statSync(path).isDirectory()
  } catch {
    return false
  }
}

function readBody(req) {
  return new Promise((resolveBody, reject) => {
    let size = 0
    const chunks = []
    req.on("data", (chunk) => {
      size += chunk.length
      if (size > MAX_BODY) {
        reject(Object.assign(new Error("body too large"), { status: 413 }))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on("end", () => {
      try {
        resolveBody(chunks.length ? JSON.parse(Buffer.concat(chunks).toString("utf8")) : {})
      } catch {
        reject(Object.assign(new Error("invalid JSON"), { status: 400 }))
      }
    })
    req.on("error", reject)
  })
}

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" })
  res.end(JSON.stringify(body))
}

function killTree(child) {
  if (!child || child.exitCode !== null) return
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], { windowsHide: true })
  } else {
    child.kill("SIGTERM")
  }
}

/**
 * Starts the UI server. Returns { server, url, token, port, close() }.
 * `opencodeBin` / `runArgs` are injectable for tests.
 */
export async function startUiServer({
  port = DEFAULT_UI_PORT,
  host = "127.0.0.1",
  project = process.cwd(),
  historyFile = DEFAULT_HISTORY,
  gateway = DEFAULT_GATEWAY,
  ollama = DEFAULT_OLLAMA,
  opencodeBin = findOpencode(),
  runArgs = (request, { agent } = {}) => (agent ? ["run", "--agent", agent, request] : ["run", request]),
  token = randomBytes(24).toString("hex"),
} = {}) {
  const defaultProject = resolve(project)
  const recorder = createHistoryRecorder({ dir: dirname(historyFile) })
  const html = await readFile(join(PKG_ROOT, "ui", "index.html"), "utf8")
  let versionCache = null
  let current = null // { child, request, project, startedAt }

  const status = async () => {
    if (!versionCache || Date.now() - versionCache.at > 60_000) {
      versionCache = { at: Date.now(), value: opencodeVersion(opencodeBin) }
    }
    const [gw, ol] = await Promise.all([checkGateway(gateway), checkOllama(ollama)])
    return {
      app: APP_NAME,
      node: process.versions.node,
      opencode: { installed: Boolean(versionCache.value), version: versionCache.value },
      gateway: { up: gw.up, ok: gw.ok, status: gw.status ?? null, models: gw.models?.length ?? 0, url: gateway, error: gw.error ?? null },
      ollama: { up: ol.up, models: ol.models, url: ollama, error: ol.error ?? null },
      running: current ? { request: current.request, project: current.project, mode: current.mode, startedAt: current.startedAt } : null,
    }
  }

  const projectFrom = (value) => {
    const path = typeof value === "string" && value.trim() ? value.trim() : defaultProject
    if (!isDirectory(path)) throw Object.assign(new Error("project folder nahi mila (pura path likho)"), { status: 400 })
    return path
  }

  const handlers = {
    "GET /api/status": async () => status(),

    "GET /api/project": async (_req, url) => {
      const path = projectFrom(url.searchParams.get("path"))
      const loaded = await loadProjectOptions(path)
      return {
        path,
        configured: Boolean(loaded),
        defaultAgent: loaded?.defaultAgent ?? null,
        routes: routeMap(loaded?.options ?? {}),
      }
    },

    "POST /api/classify": async (req) => {
      const body = await readBody(req)
      const request = String(body.request ?? "").trim()
      if (!request) return { empty: true }
      const path = projectFrom(body.project)
      const loaded = await loadProjectOptions(path)
      const options = loaded?.options ?? {}
      const gatewayDown = options.workers?.local ? !(await checkGateway(options.gatewayUrl ?? gateway)).up : false
      return previewRoute(request, options, { gatewayDown })
    },

    "GET /api/history": async (_req, url) => {
      const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 30, 1), 500)
      const entries = await loadEntries(historyFile).catch(() => [])
      return { stats: computeStats(entries), recent: entries.slice(-limit).reverse() }
    },

    "POST /api/stop": async () => {
      if (!current) return { stopped: false }
      killTree(current.child)
      return { stopped: true }
    },
  }

  const run = async (req, res) => {
    const body = await readBody(req)
    const request = String(body.request ?? "").trim()
    if (!request) return sendJson(res, 400, { error: "request khaali hai" })
    if (request.length > MAX_REQUEST_CHARS) return sendJson(res, 400, { error: "request bahut lambi hai" })
    const path = projectFrom(body.project)
    if (current) return sendJson(res, 409, { error: "ek kaam pehle se chal raha hai" })

    // Direct mode needs the router config to know the workers.
    const loaded = await loadProjectOptions(path)
    const mode = body.mode === "orchestrator" || !loaded ? "orchestrator" : "direct"
    let routed = null
    if (mode === "direct") {
      const options = loaded.options
      const gatewayDown = options.workers?.local ? !(await checkGateway(options.gatewayUrl ?? gateway)).up : false
      const decision = previewRoute(request, options, { gatewayDown })
      routed = {
        sessionId: `sangam-${randomBytes(6).toString("hex")}`,
        selectedWorker: decision.worker,
        model: decision.model,
        tier: decision.tier,
        reason: decision.reason,
        local: decision.local,
        fallback: decision.fallback,
      }
    }

    const child = spawn(opencodeBin, runArgs(request, { agent: routed?.selectedWorker }), {
      cwd: path,
      env: process.env,
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    })
    current = { child, request, project: path, mode, startedAt: new Date().toISOString() }

    res.writeHead(200, {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    })
    res.write(`[${APP_NAME}] kaam shuru (${mode === "direct" ? "seedha worker" : "orchestrator"}): ${path}\n`)
    if (routed) {
      res.write(`${routedLine(routed)}\n`)
      await recorder
        .record({
          type: "dispatch",
          source: "sangam",
          sessionId: routed.sessionId,
          requestedWorker: routed.selectedWorker,
          selectedWorker: routed.selectedWorker,
          tier: routed.tier,
          reason: routed.reason,
          model: routed.model,
          local: routed.local,
          fallback: routed.fallback,
          request: request.slice(0, 2000),
        })
        .catch(() => {})
    }

    let output = ""
    const pipe = (chunk) => {
      const text = chunk.toString("utf8").replace(ANSI, "")
      if (output.length < 200_000) output += text
      res.write(text)
    }
    child.stdout.on("data", pipe)
    child.stderr.on("data", pipe)
    res.on("close", () => {
      if (current?.child === child && !res.writableFinished) killTree(child)
    })
    let finished = false
    const finish = async (line, code) => {
      if (finished) return
      finished = true
      if (current?.child === child) current = null
      if (routed) {
        await recorder
          .record({
            type: "outcome",
            source: "sangam",
            sessionId: routed.sessionId,
            selectedWorker: routed.selectedWorker,
            model: routed.model,
            exitCode: code,
            outputChars: output.length,
            verificationEvidence: (code === 0 && VERIFICATION_EVIDENCE.test(output)) || undefined,
            local: routed.local,
            fallback: routed.fallback,
            preview: output.slice(-500),
          })
          .catch(() => {})
      }
      if (!res.writableEnded) res.end(line)
    }
    child.on("error", (error) => finish(`\n[${APP_NAME}] OpenCode start nahi hua: ${error.message}\n`, null))
    child.on("close", (code, signal) => finish(`\n[${APP_NAME}] khatam (exit ${code ?? signal})\n`, code))
  }

  const server = createServer(async (req, res) => {
    const actualPort = server.address()?.port
    const url = new URL(req.url, `http://127.0.0.1:${actualPort}`)
    try {
      const hostOk = [`127.0.0.1:${actualPort}`, `localhost:${actualPort}`].includes(req.headers.host)
      if (!hostOk) return sendJson(res, 403, { error: "host not allowed" })

      if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/index.html")) {
        const boot = JSON.stringify({ token, project: defaultProject, app: APP_NAME }).replace(/</g, "\\u003c")
        res.writeHead(200, {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
          "Content-Security-Policy": "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data:",
          "X-Frame-Options": "DENY",
        })
        return res.end(html.replace('"__SANGAM_BOOT__"', boot))
      }

      if (!url.pathname.startsWith("/api/")) return sendJson(res, 404, { error: "not found" })
      if (req.headers["x-sangam-token"] !== token) return sendJson(res, 403, { error: "bad token" })

      if (req.method === "POST" && url.pathname === "/api/run") return await run(req, res)
      const handler = handlers[`${req.method} ${url.pathname}`]
      if (!handler) return sendJson(res, 404, { error: "not found" })
      return sendJson(res, 200, await handler(req, url))
    } catch (error) {
      if (!res.headersSent) sendJson(res, error.status ?? 500, { error: error.message })
      else res.end()
    }
  })

  await new Promise((resolveListen, reject) => {
    server.once("error", reject)
    server.listen(port, host, resolveListen)
  })
  const actual = server.address().port
  return {
    server,
    token,
    port: actual,
    url: `http://127.0.0.1:${actual}/`,
    close: () =>
      new Promise((done) => {
        if (current) killTree(current.child)
        server.close(() => done())
        server.closeAllConnections?.()
      }),
  }
}

export { DEFAULT_MODELS }
