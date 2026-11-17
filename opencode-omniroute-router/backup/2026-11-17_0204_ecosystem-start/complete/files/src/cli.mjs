#!/usr/bin/env node
import { spawn } from "node:child_process"
import { realpathSync } from "node:fs"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { homedir } from "node:os"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

import { computeStats, loadEntries, printJson, printReport, DEFAULT_HISTORY } from "./stats.mjs"
import { checkGateway, checkOllama, opencodeVersion, DEFAULT_GATEWAY, DEFAULT_OLLAMA } from "./health.mjs"

const PKG_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const PLUGIN_NAME = "opencode-omniroute-router"

export { DEFAULT_GATEWAY, DEFAULT_OLLAMA }

const DEFAULT_MODELS = {
  ORCHESTRATOR_MODEL: "omniroute/auto/fast",
  FREE_MODEL: "omniroute/auto/fast",
  FAST_MODEL: "omniroute/auto/fast",
  STANDARD_MODEL: "omniroute/auto/coding",
  STRONG_MODEL: "omniroute/auto/smart",
  EXPERT_MODEL: "omniroute/auto/pro-coding",
  LOCAL_MODEL: "ollama/qwen2.5",
}

const FLAG_MAP = {
  "--orchestrator": "ORCHESTRATOR_MODEL",
  "--free": "FREE_MODEL",
  "--fast": "FAST_MODEL",
  "--standard": "STANDARD_MODEL",
  "--strong": "STRONG_MODEL",
  "--expert": "EXPERT_MODEL",
  "--local": "LOCAL_MODEL",
}

const VALUE_FLAGS = { "--gateway": "gateway", "--ollama": "ollama", "--project": "project", "--port": "port" }
const COMMANDS = new Set(["init", "doctor", "stats", "ui"])

const CLOUD_AGENTS = ["smart-orchestrator.md", "free-worker.md", "smart-fast.md", "smart-standard.md", "smart-strong.md", "expert.md"]

export function parseArgs(argv) {
  const options = { command: "init", global: false, local: false, json: false, models: { ...DEFAULT_MODELS } }
  let positionals = 0
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (COMMANDS.has(arg) && positionals === 0) {
      options.command = arg
      positionals += 1
      continue
    }
    if (arg === "--global") options.global = true
    else if (arg === "--json") options.json = true
    else if (arg === "--no-open") options.noOpen = true
    else if (arg === "--help" || arg === "-h") options.help = true
    else if (FLAG_MAP[arg] || VALUE_FLAGS[arg]) {
      const value = argv[++i]
      if (!value || value.startsWith("--")) throw new Error(`${arg} requires a value`)
      if (FLAG_MAP[arg]) options.models[FLAG_MAP[arg]] = value
      else options[VALUE_FLAGS[arg]] = value
      if (arg === "--local") options.local = true
    } else if (options.command === "stats" && !arg.startsWith("--") && !options.file) {
      options.file = arg
    } else {
      throw new Error(`unknown argument: ${arg} (see --help)`)
    }
  }
  return options
}

function render(template, models) {
  return Object.entries(models).reduce(
    (text, [key, value]) => text.replaceAll(`{{${key}}}`, value),
    template,
  )
}

async function writeAgents(targetDir, models, { local }) {
  const agentsDir = join(targetDir, "agents")
  await mkdir(agentsDir, { recursive: true })
  const templates = join(PKG_ROOT, "templates", "agents")
  const files = local ? [...CLOUD_AGENTS, "local-worker.md"] : CLOUD_AGENTS
  for (const file of files) {
    const template = await readFile(join(templates, file), "utf8")
    await writeFile(join(agentsDir, file), render(template, models), "utf8")
    console.log(`  agent: ${file}`)
  }
}

/** Splits "ollama/qwen2.5:7b" into { provider: "ollama", model: "qwen2.5:7b" }. */
export function splitModelId(id) {
  const slash = id.indexOf("/")
  return slash < 0 ? { provider: "", model: id } : { provider: id.slice(0, slash), model: id.slice(slash + 1) }
}

/** Pure config merge, exported for tests. */
export function buildConfig(config, { models, local = false, gateway, ollama = DEFAULT_OLLAMA }) {
  const next = structuredClone(config ?? {})
  next.default_agent = next.default_agent || "smart-orchestrator"
  next.plugin = Array.isArray(next.plugin) ? next.plugin : []

  const pluginOptions = {
    models: {
      "free-worker": models.FREE_MODEL,
      "smart-fast": models.FAST_MODEL,
      "smart-standard": models.STANDARD_MODEL,
      "smart-strong": models.STRONG_MODEL,
      "expert": models.EXPERT_MODEL,
    },
  }
  if (local) {
    pluginOptions.models["local-worker"] = models.LOCAL_MODEL
    pluginOptions.workers = {
      free: "free-worker",
      fast: "smart-fast",
      standard: "smart-standard",
      strong: "smart-strong",
      expert: "expert",
      local: "local-worker",
    }
  }
  if (gateway) pluginOptions.gatewayUrl = gateway

  // Match the npm name and local paths to this plugin (file:///…/opencode-omniroute-router/…);
  // keep the existing name so a local development path survives re-running init.
  const pluginName = (p) => (Array.isArray(p) ? p[0] : p)
  const existing = next.plugin.findIndex((p) => typeof pluginName(p) === "string" && pluginName(p).includes(PLUGIN_NAME))
  if (existing >= 0) next.plugin[existing] = [pluginName(next.plugin[existing]), pluginOptions]
  else next.plugin.push([PLUGIN_NAME, pluginOptions])

  // Local models are served by Ollama's OpenAI-compatible API.
  const { provider, model } = splitModelId(models.LOCAL_MODEL)
  if (local && provider === "ollama") {
    next.provider ??= {}
    next.provider.ollama ??= {
      npm: "@ai-sdk/openai-compatible",
      name: "Ollama (local)",
      options: { baseURL: `${ollama.replace(/\/$/, "")}/v1` },
      models: {},
    }
    next.provider.ollama.models ??= {}
    // Workers need tool calls; Ollama's context must be raised to match
    // (OLLAMA_CONTEXT_LENGTH=16384), its default is too small for agent prompts.
    next.provider.ollama.models[model] ??= {
      name: `${model} (local)`,
      tool_call: true,
      limit: { context: 16384, output: 4096 },
    }
  }
  return next
}

async function mergeConfig(targetDir, options) {
  const configPath = join(targetDir, "opencode.json")
  let config = {}
  try {
    config = JSON.parse(await readFile(configPath, "utf8"))
  } catch {
    // no config yet — create one
  }
  await mkdir(dirname(configPath), { recursive: true })
  await writeFile(configPath, JSON.stringify(buildConfig(config, options), null, 2) + "\n", "utf8")
  console.log(`  config: ${configPath}`)
}

// --- doctor ------------------------------------------------------------------

async function readConfig(path) {
  try {
    return JSON.parse(await readFile(path, "utf8"))
  } catch {
    return null
  }
}

async function doctor(options) {
  const gateway = options.gateway ?? DEFAULT_GATEWAY
  const ollama = options.ollama ?? DEFAULT_OLLAMA
  let problems = 0
  const ok = (msg) => console.log(`  [OK]  ${msg}`)
  const bad = (msg, hint) => {
    problems += 1
    console.log(`  [!!]  ${msg}`)
    if (hint) console.log(`        -> ${hint}`)
  }

  console.log("opencode-omniroute-router doctor\n")

  const nodeMajor = Number(process.versions.node.split(".")[0])
  if (nodeMajor >= 22) ok(`Node.js ${process.versions.node}`)
  else bad(`Node.js ${process.versions.node} (needs >= 22)`, "install a newer Node.js")

  const opencode = opencodeVersion()
  if (opencode) ok(`OpenCode installed (${opencode})`)
  else bad("OpenCode command not found", "npm i -g opencode-ai")

  const gw = await checkGateway(gateway)
  if (!gw.up) bad(`OmniRoute gateway not reachable at ${gateway} (${gw.error})`, "start it: omniroute serve")
  else if (gw.status === 401 || gw.status === 403) bad(`OmniRoute is running but rejected the key (HTTP ${gw.status})`, "set OMNIROUTE_API_KEY to a client key from the dashboard")
  else if (!gw.ok) bad(`OmniRoute answered HTTP ${gw.status}`)
  else ok(`OmniRoute gateway at ${gateway} (${gw.models.length} models)`)

  const ol = await checkOllama(ollama)
  const ollamaModels = ol.models
  if (!ol.up) bad(`Ollama not reachable at ${ollama} (${ol.error})`, "start the Ollama app, or run: ollama serve")
  else {
    if (ollamaModels.length) ok(`Ollama at ${ollama}: ${ollamaModels.join(", ")}`)
    else bad(`Ollama is running but has no models`, "ollama pull qwen2.5")
  }

  const configs = [
    join(process.cwd(), ".opencode", "opencode.json"),
    join(homedir(), ".config", "opencode", "opencode.json"),
  ]
  let found = false
  for (const path of configs) {
    const config = await readConfig(path)
    if (!config) continue
    const entry = (config.plugin ?? []).find((p) => {
      const name = Array.isArray(p) ? p[0] : p
      return typeof name === "string" && name.includes(PLUGIN_NAME)
    })
    if (!entry) continue
    found = true
    ok(`plugin configured in ${path}`)
    const localModel = Array.isArray(entry) ? entry[1]?.models?.["local-worker"] : undefined
    if (localModel) {
      const { provider, model } = splitModelId(localModel)
      const known = ollamaModels.some((name) => name === model || name === `${model}:latest`)
      if (provider === "ollama" && ol.up && !known) {
        bad(`local-worker model "${model}" is not pulled in Ollama`, `ollama pull ${model}`)
      } else {
        ok(`local-worker -> ${localModel}`)
      }
    }
  }
  if (!found) bad("plugin not configured here or globally", "npx opencode-omniroute-router init [--local ollama/<model>]")

  console.log(problems ? `\n${problems} problem(s) found.` : "\nAll good.")
  return problems
}

// --- main --------------------------------------------------------------------

function openBrowser(url) {
  // url is always http://127.0.0.1:<port>/ (no user input), so no injection.
  const [cmd, args] = process.platform === "win32" ? ["cmd", ["/c", "start", "", url]]
    : process.platform === "darwin" ? ["open", [url]] : ["xdg-open", [url]]
  try {
    spawn(cmd, args, { detached: true, stdio: "ignore", windowsHide: true }).unref()
  } catch {
    // opening the browser is best-effort
  }
}

const HELP = `opencode-omniroute-router <command> [options]

Commands:
  init     Scaffold the Smart Orchestrator agents and wire the plugin into an
           OpenCode config (default command).
  doctor   Check Node, OpenCode, the OmniRoute gateway, Ollama and the config.
  stats    Show success statistics from the execution history.
  ui       Open Sangam, the local web UI (status, task runner, route map,
           history) at http://127.0.0.1:4510.

init options:
  --global                Install into ~/.config/opencode instead of ./.opencode
  --orchestrator <model>  Orchestrator model     (default: ${DEFAULT_MODELS.ORCHESTRATOR_MODEL})
  --free <model>          Free tier model        (default: ${DEFAULT_MODELS.FREE_MODEL})
  --fast <model>          Fast tier model        (default: ${DEFAULT_MODELS.FAST_MODEL})
  --standard <model>      Standard tier model    (default: ${DEFAULT_MODELS.STANDARD_MODEL})
  --strong <model>        Strong tier model      (default: ${DEFAULT_MODELS.STRONG_MODEL})
  --expert <model>        Expert tier model      (default: ${DEFAULT_MODELS.EXPERT_MODEL})
  --local <model>         Enable the offline local-worker on this model
                          (e.g. ollama/qwen2.5); adds an "ollama" provider
  --gateway <url>         OmniRoute URL for the offline check (default: ${DEFAULT_GATEWAY})
  --ollama <url>          Ollama URL (default: ${DEFAULT_OLLAMA})

doctor options: --gateway <url>, --ollama <url> (uses OMNIROUTE_API_KEY if set)
stats options:  [history-file] [--json]   (default file: ${DEFAULT_HISTORY})
ui options:     --project <dir> (default: current folder), --port <n> (default: 4510),
                --gateway <url>, --ollama <url>, --no-open

Requires an OmniRoute gateway (https://github.com/diegosouzapw/OmniRoute).
Models follow the provider/model format used by OpenCode (e.g.
"omniroute/auto/coding" when using the omniroute provider generated by
"omniroute setup-opencode").`

async function main() {
  const options = parseArgs(process.argv.slice(2))

  if (options.help) {
    console.log(HELP)
    return
  }

  if (options.command === "doctor") {
    const problems = await doctor(options)
    process.exitCode = problems ? 1 : 0
    return
  }

  if (options.command === "ui") {
    const { startUiServer, APP_NAME } = await import("./ui-server.mjs")
    const ui = await startUiServer({
      port: options.port ? Number(options.port) : undefined,
      project: options.project,
      gateway: options.gateway,
      ollama: options.ollama,
    })
    console.log(`${APP_NAME} chal raha hai: ${ui.url}  (band karne ke liye Ctrl+C)`)
    if (!options.noOpen) openBrowser(ui.url)
    return
  }

  if (options.command === "stats") {
    const stats = computeStats(await loadEntries(options.file ?? DEFAULT_HISTORY))
    if (options.json) printJson(stats)
    else printReport(stats)
    return
  }

  const targetDir = options.global ? join(homedir(), ".config", "opencode") : join(process.cwd(), ".opencode")
  console.log(`Installing Smart Orchestrator into ${targetDir}`)

  await writeAgents(targetDir, options.models, options)
  await mergeConfig(targetDir, options)

  console.log(`
Done. Next steps:
  1. Make sure your OpenCode config has an "omniroute" provider pointing at
     your gateway. The official command:
       omniroute setup-opencode   (local)      or
       omniroute setup-opencode --remote http://<host>:20128 --api-key "$OMNIROUTE_API_KEY"${options.local ? `
  2. Local worker: ${options.models.LOCAL_MODEL}. Make sure Ollama is running
     and the model is pulled (ollama pull ${splitModelId(options.models.LOCAL_MODEL).model}).` : ""}
  ${options.local ? 3 : 2}. Check everything:  npx opencode-omniroute-router doctor
  ${options.local ? 4 : 3}. Start OpenCode in this directory and describe a task.
     The smart-orchestrator agent will route it automatically.`)
}

function isMain() {
  try {
    return realpathSync(fileURLToPath(import.meta.url)) === realpathSync(process.argv[1])
  } catch {
    return false
  }
}

if (isMain()) {
  main().catch((error) => {
    console.error(`error: ${error.message}`)
    process.exit(1)
  })
}
