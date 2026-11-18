import { spawn } from "node:child_process"
import { once } from "node:events"
import { access } from "node:fs/promises"
import path from "node:path"
import { safeStorage } from "electron"
import { Schema } from "effect"
import type { Plugin } from "@opencode/plugin/gui/main"
import { Router, type RouterState } from "./contract"
import {
  freeName,
  providers,
  readConnections,
  readError,
  readTestFailure,
  routerUrl,
  type RouterConnection,
} from "./providers"

const programName = process.platform === "win32" ? "omniroute.cmd" : "omniroute"

const exists = (file: string) =>
  access(file).then(
    () => true,
    () => false,
  )

const sleep = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, ms)

    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer)
        resolve()
      },
      { once: true },
    )
  })

const messageOf = (error: unknown) => (error instanceof Error ? error.message : String(error))

/** The router's command on this machine: npm's global folder first, then `PATH`. Undefined when there is none. */
async function findProgram() {
  const candidates = [
    ...(process.env.APPDATA ? [path.join(process.env.APPDATA, "npm", programName)] : []),
    ...(process.env.PATH ?? "")
      .split(path.delimiter)
      .filter((directory) => directory !== "")
      .map((directory) => path.join(directory, programName)),
  ]

  for (const candidate of candidates) if (await exists(candidate)) return candidate

  return undefined
}

const setup: Plugin.MainSetup = (ctx) => {
  const log = ctx.log
  const signal = ctx.signal
  // The router's client key, encrypted by the system keychain (DPAPI on Windows). Empty when none was saved here.
  const savedKey = ctx.storage.store("client-key", { schema: Schema.String, initial: "" })

  const current: {
    status: RouterState["status"]
    message: string | null
    connections: readonly RouterConnection[]
    connecting: string | null
  } = { status: "checking", message: null, connections: [], connecting: null }

  const clientKey = () => {
    if (process.env.OMNIROUTE_API_KEY) return process.env.OMNIROUTE_API_KEY
    if (savedKey.value === "" || !safeStorage.isEncryptionAvailable()) return undefined

    try {
      return safeStorage.decryptString(Buffer.from(savedKey.value, "base64"))
    } catch {
      return undefined
    }
  }

  const state = (): RouterState => ({
    status: current.status,
    message: current.message,
    hasKey: clientKey() !== undefined,
    keyFromEnv: !!process.env.OMNIROUTE_API_KEY,
    connections: [...current.connections],
    connecting: current.connecting,
  })

  const provider = ctx.provide(Router, {
    state,
    refresh: () => refresh(),
    start: () => start(),
    install: () => install(),
    setKey: (key) => {
      const trimmed = key.trim()

      if (trimmed !== "" && !safeStorage.isEncryptionAvailable())
        throw new Error("This system cannot store the key safely.")
      savedKey.set(trimmed === "" ? "" : safeStorage.encryptString(trimmed).toString("base64"))

      return refresh()
    },
    connect: (input) => connect(input.provider, input.key),
    disconnect: (id) => disconnect(id),
  })

  /** Calls the router with its client key. Rejects on a network failure or at the timeout. */
  const call = (route: string, init: { method?: string; body?: unknown; timeoutMs?: number } = {}) => {
    const key = clientKey()

    return fetch(`${routerUrl}${route}`, {
      method: init.method ?? "GET",
      headers: {
        ...(key ? { authorization: `Bearer ${key}` } : {}),
        ...(init.body === undefined ? {} : { "content-type": "application/json" }),
      },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      signal: AbortSignal.any([signal, AbortSignal.timeout(init.timeoutMs ?? 10_000)]),
    })
  }

  // Any HTTP answer means the router runs; without a key it answers 401.
  const running = () =>
    call("/v1/models", { timeoutMs: 3000 }).then(
      () => true,
      () => false,
    )

  const refresh = async (): Promise<void> => {
    const up = await running()

    if (signal.aborted) return

    if (!up) {
      current.connections = []
      // A start or install in flight owns the status until it settles.
      if (current.status !== "starting" && current.status !== "installing" && current.status !== "failed")
        current.status = (await findProgram()) ? "stopped" : "missing"

      return provider.changed()
    }

    current.status = "running"
    current.message = null
    current.connections =
      clientKey() === undefined
        ? []
        : await call("/api/providers")
            .then(async (response) => (response.ok ? readConnections(await response.json()) : []))
            .catch(() => current.connections)
    provider.changed()
  }

  const start = async (): Promise<void> => {
    if (current.status === "running" || current.status === "starting" || current.status === "installing") return
    const program = await findProgram()

    if (!program) {
      current.status = "missing"

      return provider.changed()
    }

    current.status = "starting"
    current.message = null
    provider.changed()

    // Only this machine may reach the router, and every request needs its key.
    const child = spawn(`"${program}"`, ["serve", "--daemon", "--no-open"], {
      shell: true,
      detached: true,
      stdio: "ignore",
      windowsHide: true,
      env: { ...process.env, OMNIROUTE_SERVER_HOST: "127.0.0.1", REQUIRE_API_KEY: "true" },
    })

    child.on("error", () => undefined)
    child.unref()

    for (const _ of Array.from({ length: 45 })) {
      await sleep(1000, signal)
      if (signal.aborted) return
      if (await running()) return refresh()
    }

    current.status = "failed"
    current.message = "The router did not answer after it was started."
    provider.changed()
  }

  const install = async (): Promise<void> => {
    if (current.status !== "missing" && current.status !== "failed") return
    current.status = "installing"
    current.message = null
    provider.changed()

    try {
      const child = spawn(process.platform === "win32" ? "npm.cmd" : "npm", ["install", "-g", "omniroute"], {
        shell: true,
        stdio: "ignore",
        windowsHide: true,
        signal,
      })
      const [code] = await once(child, "exit")

      if (code !== 0) throw new Error(`npm install ended with code ${String(code)}. Node.js must be installed.`)
      current.status = "stopped"
      await start()
    } catch (error) {
      if (signal.aborted) return
      log.write("error", "router: install failed", { error: messageOf(error) })
      current.status = "failed"
      current.message = messageOf(error)
      provider.changed()
    }
  }

  const connect = async (providerID: string, key: string): Promise<void> => {
    // Only the listed ids reach the router, so a page can never add an arbitrary endpoint through this method.
    if (!providers.some((item) => item.id === providerID)) throw new Error("Unknown provider.")
    if (key.trim() === "") throw new Error("The key is empty.")
    if (clientKey() === undefined) throw new Error("The router's own key is missing.")
    current.connecting = providerID
    provider.changed()

    try {
      const taken = current.connections.filter((item) => item.provider === providerID).map((item) => item.name)
      const created = await call("/api/providers", {
        method: "POST",
        body: { provider: providerID, name: freeName(taken), apiKey: key.trim() },
        timeoutMs: 30_000,
      })
      const body: unknown = await created.json().catch(() => undefined)

      if (!created.ok) throw new Error(readError(body) ?? `The router answered ${created.status}.`)
      await refresh()
      const added = current.connections.find(
        (item) => item.provider === providerID && !taken.includes(item.name),
      )

      if (!added) return
      // The router checks the key against the provider. A refused key is removed again, so no dead connection stays.
      const tested = await call(`/api/providers/${encodeURIComponent(added.id)}/test`, {
        method: "POST",
        timeoutMs: 60_000,
      })
      const failure = readTestFailure(tested.ok, tested.status, await tested.json().catch(() => undefined))

      if (failure === undefined) return
      await call(`/api/providers/${encodeURIComponent(added.id)}`, { method: "DELETE" }).catch(() => undefined)
      throw new Error(failure)
    } finally {
      current.connecting = null
      await refresh()
    }
  }

  const disconnect = async (id: string): Promise<void> => {
    const response = await call(`/api/providers/${encodeURIComponent(id)}`, { method: "DELETE", timeoutMs: 30_000 })

    if (!response.ok)
      throw new Error(readError(await response.json().catch(() => undefined)) ?? `The router answered ${response.status}.`)
    await refresh()
  }

  // Find the router as the app starts and start it when it is installed, so the user never opens it by hand.
  void refresh().then(() => (current.status === "stopped" ? start() : undefined))
}

export default setup
