import { spawnSync } from "node:child_process"
import { existsSync } from "node:fs"
import { join } from "node:path"

export const DEFAULT_GATEWAY = "http://localhost:20128"
export const DEFAULT_OLLAMA = "http://localhost:11434"

/** GET a JSON endpoint; never throws. */
export async function getJson(url, headers = {}, timeoutMs = 3000) {
  try {
    const res = await fetch(url, { headers, signal: AbortSignal.timeout(timeoutMs) })
    let body = null
    try {
      body = await res.json()
    } catch {
      // not JSON
    }
    return { reachable: true, status: res.status, body }
  } catch (error) {
    return { reachable: false, error: error.cause?.code ?? error.name }
  }
}

/** OmniRoute gateway: { up, status, ok, models, error } (ok = authorized 200). */
export async function checkGateway(gateway = DEFAULT_GATEWAY, apiKey = process.env.OMNIROUTE_API_KEY) {
  const headers = apiKey ? { Authorization: `Bearer ${apiKey}` } : {}
  const res = await getJson(new URL("/v1/models", gateway), headers)
  if (!res.reachable) return { up: false, ok: false, error: res.error, url: gateway }
  const models = res.status === 200 ? (res.body?.data ?? []).map((m) => m.id) : []
  return { up: true, ok: res.status === 200, status: res.status, models, url: gateway }
}

/** Ollama: { up, models, error }. */
export async function checkOllama(ollama = DEFAULT_OLLAMA) {
  const res = await getJson(new URL("/api/tags", ollama))
  if (!res.reachable) return { up: false, models: [], error: res.error, url: ollama }
  return { up: true, models: (res.body?.models ?? []).map((m) => m.name), url: ollama }
}

/** Path of the OpenCode executable (npm global install on Windows, else PATH). */
export function findOpencode(env = process.env) {
  if (env.OPENCODE_BIN) return env.OPENCODE_BIN
  if (process.platform === "win32" && env.APPDATA) {
    const exe = join(env.APPDATA, "npm", "node_modules", "opencode-ai", "bin", "opencode.exe")
    if (existsSync(exe)) return exe
  }
  return "opencode"
}

/** OpenCode version string or null; runs the binary without a shell. */
export function opencodeVersion(bin = findOpencode()) {
  const res = spawnSync(bin, ["--version"], { encoding: "utf8", timeout: 15000, windowsHide: true })
  if (res.status !== 0) return null
  return (res.stdout || res.stderr).trim().split("\n")[0]
}
