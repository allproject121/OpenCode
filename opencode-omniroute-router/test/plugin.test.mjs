import test from "node:test"
import assert from "node:assert/strict"
import { readFile, mkdtemp } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"

import { createSmartRouterPlugin } from "../src/router-plugin.mjs"
import * as entry from "../src/plugin.mjs"

const makeHooks = async () =>
  createSmartRouterPlugin()({
    client: { app: { log: async () => {} } },
    historyDir: await mkdtemp(join(tmpdir(), "oor-plugin-")),
  })

const exploreArgs = () => ({
  args: {
    subagent_type: "explore",
    description: "Investigate symptom",
    prompt: "Locate the modules involved in the notification flow.",
  },
})

test("logs initialization and deterministically rewrites a worker Task", async () => {
  const entries = []
  const hooks = await createSmartRouterPlugin()({
    client: { app: { log: async (entry) => entries.push(entry) } },
    historyDir: await mkdtemp(join(tmpdir(), "oor-plugin-")),
  })
  const output = {
    args: {
      subagent_type: "smart-fast",
      description: "Delegated task",
      prompt: "Propón una prueba unitaria para validar un endpoint.",
    },
  }

  await hooks["chat.message"](
    { sessionID: "session-1" },
    { message: {}, parts: [{ type: "text", text: "Propón una prueba unitaria para validar un endpoint." }] },
  )

  await hooks["tool.execute.before"](
    { tool: "task", sessionID: "session-1", callID: "call-1" },
    output,
  )

  assert.equal(output.args.subagent_type, "smart-standard")
  const routingLog = entries.find((e) => e.body.message === "deterministic task routing")
  assert.equal(routingLog.body.extra.requestedWorker, "smart-fast")
  assert.equal(routingLog.body.extra.selectedWorker, "smart-standard")
})

test("routes from the original user request instead of Task template vocabulary", async () => {
  const hooks = await makeHooks()
  const output = {
    args: {
      subagent_type: "smart-strong",
      description: "Classify rename task",
      prompt: "Classify migrations and architecture before returning a routing decision.",
    },
  }

  await hooks["chat.message"](
    { sessionID: "session-rename" },
    { message: {}, parts: [{ type: "text", text: "Renombra user_name a username en 42 archivos sin cambiar comportamiento." }] },
  )

  await hooks["tool.execute.before"](
    { tool: "task", sessionID: "session-rename", callID: "call-1" },
    output,
  )

  assert.equal(output.args.subagent_type, "smart-fast")
  assert.equal(output.args.prompt, "Classify migrations and architecture before returning a routing decision.")
})

test("rejects a second worker Task in the same user turn", async () => {
  const hooks = await makeHooks()
  const input = { tool: "task", sessionID: "session-1", callID: "call-1" }

  await hooks["chat.message"](
    { sessionID: "session-1" },
    { message: {}, parts: [{ type: "text", text: "Corrige un typo en el README." }] },
  )

  await hooks["tool.execute.before"](input, {
    args: { subagent_type: "smart-fast", description: "First task", prompt: "Corrige un typo en el README." },
  })

  await assert.rejects(
    hooks["tool.execute.before"]({ ...input, callID: "call-2" }, {
      args: { subagent_type: "smart-standard", description: "Second task", prompt: "Propón una prueba unitaria para validar un endpoint." },
    }),
    /only one worker Task is allowed per user turn/,
  )
})

test("allows one exploration Task before the worker and logs it", async () => {
  const hooks = await makeHooks()
  const input = { tool: "task", sessionID: "session-explore", callID: "call-e1" }

  await hooks["chat.message"](
    { sessionID: "session-explore" },
    { message: {}, parts: [{ type: "text", text: "A veces falla el login y no tengo un error reproducible." }] },
  )

  await hooks["tool.execute.before"](input, exploreArgs())
  const worker = {
    args: {
      subagent_type: "smart-strong",
      description: "Delegated task",
      prompt: "A veces falla el login y no tengo un error reproducible.",
    },
  }
  await hooks["tool.execute.before"]({ ...input, callID: "call-w1" }, worker)

  assert.equal(worker.args.subagent_type, "smart-strong")
})

test("rejects a second exploration Task in the same turn", async () => {
  const hooks = await makeHooks()
  const input = { tool: "task", sessionID: "session-explore-2", callID: "call-e1" }

  await hooks["tool.execute.before"](input, exploreArgs())

  await assert.rejects(
    hooks["tool.execute.before"]({ ...input, callID: "call-e2" }, exploreArgs()),
    /only one exploration Task is allowed per session/,
  )
})

test("rejects exploration after the worker Task has been dispatched", async () => {
  const hooks = await makeHooks()
  const input = { tool: "task", sessionID: "session-explore-3", callID: "call-w1" }

  await hooks["chat.message"](
    { sessionID: "session-explore-3" },
    { message: {}, parts: [{ type: "text", text: "Propón una prueba unitaria para validar un endpoint." }] },
  )
  await hooks["tool.execute.before"](input, {
    args: { subagent_type: "smart-standard", description: "Delegated task", prompt: "Propón una prueba unitaria para validar un endpoint." },
  })

  await assert.rejects(
    hooks["tool.execute.before"]({ ...input, callID: "call-e1" }, exploreArgs()),
    /exploration is not allowed after the worker Task has been dispatched/,
  )
})

test("allows a new dispatch cycle on the next user turn", async () => {
  const hooks = await makeHooks()
  const input = { tool: "task", sessionID: "session-multiturn", callID: "call-w1" }

  await hooks["chat.message"](
    { sessionID: "session-multiturn" },
    { message: {}, parts: [{ type: "text", text: "Corrige un typo en el README." }] },
  )
  await hooks["tool.execute.before"](input, {
    args: { subagent_type: "smart-fast", description: "First task", prompt: "Corrige un typo en el README." },
  })

  await hooks["chat.message"](
    { sessionID: "session-multiturn" },
    { message: {}, parts: [{ type: "text", text: "Propón una prueba unitaria para validar un endpoint." }] },
  )
  const second = {
    args: { subagent_type: "smart-fast", description: "Second task", prompt: "Propón una prueba unitaria para validar un endpoint." },
  }
  await hooks["tool.execute.before"]({ ...input, callID: "call-w2" }, second)

  assert.equal(second.args.subagent_type, "smart-standard")
})

test("honors custom worker names and models", async () => {
  const hooks = await createSmartRouterPlugin({
    workers: { free: "barato", fast: "rapido", standard: "normal", strong: "fuerte", expert: "experto" },
    models: { barato: "m1", rapido: "m2", normal: "m3", fuerte: "m4", experto: "m5" },
  })({
    client: { app: { log: async () => {} } },
    historyDir: await mkdtemp(join(tmpdir(), "oor-plugin-")),
  })
  const output = {
    args: {
      subagent_type: "normal",
      description: "Delegated task",
      prompt: "Propón una prueba unitaria para validar un endpoint.",
    },
  }

  await hooks["chat.message"](
    { sessionID: "session-custom" },
    { message: {}, parts: [{ type: "text", text: "Propón una prueba unitaria para validar un endpoint." }] },
  )
  await hooks["tool.execute.before"](
    { tool: "task", sessionID: "session-custom", callID: "call-1" },
    output,
  )

  assert.equal(output.args.subagent_type, "normal")
})

test("ignores Task calls for unmanaged workers", async () => {
  const hooks = await makeHooks()
  const output = {
    args: { subagent_type: "general", description: "Other task", prompt: "anything" },
  }

  await hooks["chat.message"](
    { sessionID: "session-ign" },
    { message: {}, parts: [{ type: "text", text: "Corrige un typo en el README." }] },
  )
  await hooks["tool.execute.before"](
    { tool: "task", sessionID: "session-ign", callID: "call-1" },
    output,
  )

  assert.equal(output.args.subagent_type, "general")
})

test("records dispatch and outcome entries in the history log", async () => {
  const dir = await mkdtemp(join(tmpdir(), "oor-history-"))
  const hooks = await createSmartRouterPlugin()({
    client: { app: { log: async () => {} } },
    historyDir: dir,
  })
  const input = { tool: "task", sessionID: "session-history", callID: "call-h1" }

  await hooks["chat.message"](
    { sessionID: "session-history" },
    { message: {}, parts: [{ type: "text", text: "A veces falla el login y no tengo un error reproducible." }] },
  )
  await hooks["tool.execute.before"](input, {
    args: {
      subagent_type: "smart-strong",
      description: "Delegated task",
      prompt: "Investigate the intermittent login failure.",
    },
  })
  await hooks["tool.execute.after"](input, {
    output: "Diagnosis complete. Tests: 40 pass, fail 0. Root cause hypothesis documented.",
  })
  await hooks["tool.execute.after"]({ ...input, callID: "call-unknown" }, { output: "ignored" })

  const lines = (await readFile(join(dir, "history.jsonl"), "utf8")).trim().split("\n")
  assert.equal(lines.length, 2)

  const dispatch = JSON.parse(lines[0])
  assert.equal(dispatch.type, "dispatch")
  assert.equal(dispatch.selectedWorker, "smart-strong")
  assert.equal(dispatch.model, "omniroute/auto/smart")
  assert.equal(dispatch.requestedWorker, "smart-strong")
  assert.match(dispatch.request, /login/)

  const outcome = JSON.parse(lines[1])
  assert.equal(outcome.type, "outcome")
  assert.equal(outcome.selectedWorker, "smart-strong")
  assert.equal(outcome.verificationEvidence, true)
  assert.match(outcome.preview, /Diagnosis complete/)
})

// --- local / offline worker --------------------------------------------------

const withLocal = (extra = {}) =>
  createSmartRouterPlugin({
    workers: { free: "free-worker", fast: "smart-fast", standard: "smart-standard", strong: "smart-strong", expert: "expert", local: "local-worker" },
    ...extra,
  })

const dispatch = async (hooks, sessionID, text, requested = "smart-standard") => {
  await hooks["chat.message"]({ sessionID }, { message: {}, parts: [{ type: "text", text }] })
  const output = { args: { subagent_type: requested, description: "Delegated task", prompt: text } }
  await hooks["tool.execute.before"]({ tool: "task", sessionID, callID: `${sessionID}-call` }, output)
  return output
}

test("an explicit offline request goes to the local worker without probing the gateway", async () => {
  let probes = 0
  const dir = await mkdtemp(join(tmpdir(), "oor-local-"))
  const hooks = await withLocal({ healthCheck: async () => { probes += 1; return true } })({
    client: { app: { log: async () => {} } },
    historyDir: dir,
  })

  const output = await dispatch(hooks, "s-offline", "Offline model se ye function samjhao", "free-worker")

  assert.equal(output.args.subagent_type, "local-worker")
  assert.equal(probes, 0)
  const entry = JSON.parse((await readFile(join(dir, "history.jsonl"), "utf8")).trim())
  assert.equal(entry.local, true)
  assert.equal(entry.tier, "free")
  assert.equal(entry.model, "ollama/qwen2.5")
  assert.equal(entry.fallback, undefined)
})

test("falls back to the local worker when the gateway is unreachable", async () => {
  const dir = await mkdtemp(join(tmpdir(), "oor-local-"))
  const hooks = await withLocal({ healthCheck: async () => false })({
    client: { app: { log: async () => {} } },
    historyDir: dir,
  })

  const output = await dispatch(hooks, "s-down", "Fix the crash when the cart is empty.")

  assert.equal(output.args.subagent_type, "local-worker")
  const entry = JSON.parse((await readFile(join(dir, "history.jsonl"), "utf8")).trim())
  assert.equal(entry.fallback, "gateway-unreachable")
  assert.equal(entry.tier, "standard")
})

test("keeps cloud routing when the gateway is up", async () => {
  const hooks = await withLocal({ healthCheck: async () => true })({
    client: { app: { log: async () => {} } },
    historyDir: await mkdtemp(join(tmpdir(), "oor-local-")),
  })

  const output = await dispatch(hooks, "s-up", "Fix the crash when the cart is empty.", "smart-fast")
  assert.equal(output.args.subagent_type, "smart-standard")
})

test("never probes the gateway when no local worker is configured", async () => {
  let probes = 0
  const hooks = await createSmartRouterPlugin({ healthCheck: async () => { probes += 1; return false } })({
    client: { app: { log: async () => {} } },
    historyDir: await mkdtemp(join(tmpdir(), "oor-local-")),
  })

  const output = await dispatch(hooks, "s-nolocal", "Offline me README ka typo theek karo", "smart-standard")
  assert.equal(output.args.subagent_type, "smart-fast")
  assert.equal(probes, 0)
})

test("prefixes the worker result with the real route for the orchestrator", async () => {
  const hooks = await withLocal({ healthCheck: async () => false })({
    client: { app: { log: async () => {} } },
    historyDir: await mkdtemp(join(tmpdir(), "oor-local-")),
  })
  await dispatch(hooks, "s-line", "Fix the crash when the cart is empty.")
  const result = { output: "Done. 3 pass, fail 0." }
  await hooks["tool.execute.after"]({ tool: "task", sessionID: "s-line", callID: "s-line-call" }, result)

  assert.equal(
    result.output.split("\n")[0],
    "ROUTED: local-worker | MODEL: ollama/qwen2.5 | TIER: standard | LOCAL | FALLBACK: OmniRoute unreachable",
  )
  assert.match(result.output, /Done\. 3 pass/)
})

// --- OpenCode entry module ---------------------------------------------------

test("the OpenCode entry module exports only plugin functions", () => {
  const exports = Object.entries(entry)
  assert.ok(exports.length >= 1)
  for (const [name, value] of exports) {
    assert.equal(typeof value, "function", `export ${name} must be a function`)
  }
})

test("the entry plugin passes opencode.json options to the router", async () => {
  const dir = await mkdtemp(join(tmpdir(), "oor-entry-"))
  const hooks = await entry.OmniRouteRouterPlugin(
    { client: { app: { log: async () => {} } } },
    { historyDir: dir, workers: { free: "barato", standard: "normal" }, models: { barato: "m1", normal: "m2" } },
  )
  await hooks["chat.message"]({ sessionID: "s-entry" }, { message: {}, parts: [{ type: "text", text: "Explain what a closure is." }] })
  const output = { args: { subagent_type: "normal", description: "d", prompt: "p" } }
  await hooks["tool.execute.before"]({ tool: "task", sessionID: "s-entry", callID: "c1" }, output)
  assert.equal(output.args.subagent_type, "barato")
  const entryLine = JSON.parse((await readFile(join(dir, "history.jsonl"), "utf8")).trim())
  assert.equal(entryLine.model, "m1")
})