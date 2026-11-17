import test from "node:test"
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { mkdtemp, readFile, readdir } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

import { parseArgs, buildConfig, splitModelId } from "../src/cli.mjs"

const CLI = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "cli.mjs")

test("parses commands and flags", () => {
  assert.equal(parseArgs([]).command, "init")
  assert.equal(parseArgs(["doctor", "--gateway", "http://x:1"]).gateway, "http://x:1")
  const init = parseArgs(["init", "--local", "ollama/qwen2.5:7b", "--fast", "omniroute/combo/free-fast"])
  assert.equal(init.local, true)
  assert.equal(init.models.LOCAL_MODEL, "ollama/qwen2.5:7b")
  assert.equal(init.models.FAST_MODEL, "omniroute/combo/free-fast")
  assert.equal(parseArgs(["stats", "h.jsonl", "--json"]).file, "h.jsonl")
  assert.throws(() => parseArgs(["--local"]), /requires a value/)
  assert.throws(() => parseArgs(["--bogus"]), /unknown argument/)
})

test("splits provider/model ids", () => {
  assert.deepEqual(splitModelId("ollama/qwen2.5:7b"), { provider: "ollama", model: "qwen2.5:7b" })
  assert.deepEqual(splitModelId("omniroute/auto/coding:pro"), { provider: "omniroute", model: "auto/coding:pro" })
})

test("buildConfig without --local keeps the original five-worker shape", () => {
  const models = parseArgs([]).models
  const config = buildConfig({ provider: { omniroute: {} } }, { models })
  assert.equal(config.default_agent, "smart-orchestrator")
  const [name, options] = config.plugin[0]
  assert.equal(name, "opencode-omniroute-router")
  assert.equal(options.workers, undefined)
  assert.equal(options.models["local-worker"], undefined)
  assert.deepEqual(Object.keys(config.provider), ["omniroute"])
})

test("buildConfig with --local adds the local worker and an ollama provider", () => {
  const { models } = parseArgs(["--local", "ollama/qwen2.5"])
  const before = { plugin: ["other-plugin", ["opencode-omniroute-router", { models: {} }]] }
  const config = buildConfig(before, { models, local: true, gateway: "http://gw:20128" })

  assert.equal(config.plugin.length, 2)
  const [, options] = config.plugin[1]
  assert.equal(options.workers.local, "local-worker")
  assert.equal(options.models["local-worker"], "ollama/qwen2.5")
  assert.equal(options.gatewayUrl, "http://gw:20128")
  assert.equal(config.provider.ollama.options.baseURL, "http://localhost:11434/v1")
  assert.ok(config.provider.ollama.models["qwen2.5"])
  assert.deepEqual(before.plugin[1][1], { models: {} }, "input config is not mutated")
})

test("buildConfig updates a local-path plugin entry instead of adding a second one", () => {
  const { models } = parseArgs(["--local", "ollama/qwen2.5:7b"])
  const local = "file:///C:/dev/opencode-omniroute-router/src/plugin.mjs"
  const config = buildConfig({ plugin: [[local, { models: {} }]] }, { models, local: true })
  assert.equal(config.plugin.length, 1)
  assert.equal(config.plugin[0][0], local)
  assert.equal(config.plugin[0][1].workers.local, "local-worker")
})

test("buildConfig keeps an existing ollama provider and adds the model", () => {
  const { models } = parseArgs(["--local", "ollama/llama3.2"])
  const existing = { provider: { ollama: { npm: "x", options: { baseURL: "http://other:1/v1" }, models: { "qwen2.5": {} } } } }
  const config = buildConfig(existing, { models, local: true })
  assert.equal(config.provider.ollama.options.baseURL, "http://other:1/v1")
  assert.deepEqual(Object.keys(config.provider.ollama.models), ["qwen2.5", "llama3.2"])
})

test("init --local scaffolds agents and config in the current directory", async () => {
  const cwd = await mkdtemp(join(tmpdir(), "oor-cli-"))
  const res = spawnSync(process.execPath, [CLI, "init", "--local", "ollama/qwen2.5"], { cwd, encoding: "utf8" })
  assert.equal(res.status, 0, res.stderr)

  const agents = await readdir(join(cwd, ".opencode", "agents"))
  assert.ok(agents.includes("local-worker.md"))
  assert.equal(agents.length, 7)

  const local = await readFile(join(cwd, ".opencode", "agents", "local-worker.md"), "utf8")
  assert.match(local, /^model: ollama\/qwen2\.5$/m)
  const orchestrator = await readFile(join(cwd, ".opencode", "agents", "smart-orchestrator.md"), "utf8")
  assert.doesNotMatch(orchestrator, /\{\{/)

  const config = JSON.parse(await readFile(join(cwd, ".opencode", "opencode.json"), "utf8"))
  assert.equal(config.provider.ollama.models["qwen2.5"].name, "qwen2.5 (local)")
})

test("init without --local does not write the local worker", async () => {
  const cwd = await mkdtemp(join(tmpdir(), "oor-cli-"))
  const res = spawnSync(process.execPath, [CLI, "init"], { cwd, encoding: "utf8" })
  assert.equal(res.status, 0, res.stderr)
  const agents = await readdir(join(cwd, ".opencode", "agents"))
  assert.equal(agents.includes("local-worker.md"), false)
  const orchestrator = await readFile(join(cwd, ".opencode", "agents", "smart-orchestrator.md"), "utf8")
  assert.doesNotMatch(orchestrator, /\{\{/)
})

test("stats command runs on an empty history", async () => {
  const cwd = await mkdtemp(join(tmpdir(), "oor-cli-"))
  const res = spawnSync(process.execPath, [CLI, "stats", join(cwd, "none.jsonl"), "--json"], { cwd, encoding: "utf8" })
  assert.equal(res.status, 0, res.stderr)
  assert.equal(JSON.parse(res.stdout).overall.total, 0)
})
