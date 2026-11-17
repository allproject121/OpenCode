import { spawn } from "node:child_process"
import { once } from "node:events"
import { access, mkdir, readFile, rename, writeFile } from "node:fs/promises"
import { homedir } from "node:os"
import path from "node:path"
import type { Plugin } from "@opencode/plugin/gui/main"
import { catalog, type StoreItem } from "./catalog"
import {
  addEntry,
  formatConfig,
  hasEntry,
  parseConfig,
  removeEntry,
  serverOf,
  type ConfigObject,
  type Entry,
} from "./config"
import { PluginStore, type PluginStoreState } from "./contract"

const exists = (file: string) =>
  access(file).then(
    () => true,
    () => false,
  )

const messageOf = (error: unknown) => (error instanceof Error ? error.message : String(error))

const setup: Plugin.MainSetup = (ctx) => {
  const log = ctx.log
  const cli = ctx.cli
  const signal = ctx.signal
  // The folder OpenCode reads its global settings from; the launcher points it at this app's own folder.
  const directory = process.env.OPENCODE_CONFIG_DIR || path.join(homedir(), ".config", "opencode")
  const current: { file: string; config: ConfigObject; busy: string | null; problem: string | null } = {
    file: path.join(directory, "opencode.jsonc"),
    config: {},
    busy: null,
    problem: null,
  }

  // The app's source folder while it runs from source: the plugins that ship in it are used from there.
  const source = () => {
    const index = cli.command.indexOf("--cwd")
    const folder = cli.development && index >= 0 ? cli.command[index + 1] : undefined

    return folder ? path.resolve(folder, "..", "..") : undefined
  }

  /** What an item writes into the settings on this machine. */
  const entryOf = async (item: StoreItem): Promise<Entry> => {
    if (item.kind === "mcp") return { kind: "mcp", key: item.id, server: serverOf(item, directory, process.platform) }

    if (item.kind === "skills") return { kind: "skills", path: path.join(directory, "packs", item.id, item.folder) }
    const root = source()
    const local = root ? path.join(root, item.local) : undefined

    return { kind: "plugin", spec: local && (await exists(local)) ? local : item.spec }
  }

  const installed = async () => {
    const ids: string[] = []

    for (const item of catalog) if (hasEntry(current.config, await entryOf(item))) ids.push(item.id)

    return ids
  }

  const shown: { installed: readonly string[] } = { installed: [] }

  const withToken = catalog.flatMap((item) =>
    item.kind === "mcp" && item.token ? [{ id: item.id, ...item.token }] : [],
  )
  // The ids whose token variable is set now. Read from the user's variables, not from this process: a token saved
  // while the app is open is not in this process's own environment.
  const tokens = new Set<string>()

  /** Whether a user environment variable is set. Only the answer is read, never the value. */
  const hasUserVariable = async (name: string) => {
    if (process.platform !== "win32") return (process.env[name] ?? "") !== ""
    const child = spawn("reg", ["query", "HKCU\\Environment", "/v", name], {
      stdio: "ignore",
      windowsHide: true,
      signal,
    })
    const [code] = await once(child, "exit")

    return code === 0
  }

  const readTokens = async () => {
    const found = await Promise.all(withToken.map((item) => hasUserVariable(item.variable).catch(() => false)))

    tokens.clear()
    withToken.forEach((item, index) => {
      if (found[index]) tokens.add(item.id)
    })
  }

  const state = (): PluginStoreState => ({
    file: current.file,
    installed: [...shown.installed],
    busy: current.busy,
    problem: current.problem,
    tokens: Object.fromEntries(withToken.map((item) => [item.id, tokens.has(item.id) ? "ready" : "missing"])),
  })

  /** Sets or clears a user environment variable. The value travels in the child's environment, never on a command line. */
  const setUserVariable = async (name: string, value: string) => {
    if (process.platform !== "win32") throw new Error(`Set the environment variable ${name} yourself on this system.`)
    const child = spawn(
      "powershell.exe",
      [
        "-NoProfile",
        "-NonInteractive",
        "-Command",
        "[Environment]::SetEnvironmentVariable($env:APNA_NAME, $(if ($env:APNA_VALUE) { $env:APNA_VALUE } else { $null }), 'User')",
      ],
      { stdio: "ignore", windowsHide: true, signal, env: { ...process.env, APNA_NAME: name, APNA_VALUE: value } },
    )
    const [code] = await once(child, "exit")

    if (code !== 0) throw new Error(`Saving the variable ended with code ${String(code)}.`)
  }

  const setToken = async (input: { id: string; value: string }): Promise<void> => {
    const item = withToken.find((entry) => entry.id === input.id)

    if (!item) throw new Error("This item takes no token.")
    const value = input.value.trim()

    if (/\s/.test(value)) throw new Error("A token has no spaces in it.")
    await setUserVariable(item.variable, value)
    await readTokens()
    provider.changed()
  }

  const provider = ctx.provide(PluginStore, {
    state,
    refresh: () => refresh(),
    add: (id) => change(id, true),
    remove: (id) => change(id, false),
    setToken: (input) => setToken(input),
  })

  const read = async () => {
    const json = path.join(directory, "opencode.json")

    // An existing file keeps its name; a new one is written as .jsonc.
    current.file = (await exists(path.join(directory, "opencode.jsonc"))) || !(await exists(json)) ? current.file : json
    const text = await readFile(current.file, "utf8").catch(() => "")

    current.config = parseConfig(text)
  }

  const refresh = async (): Promise<void> => {
    try {
      await read()
      current.problem = null
      shown.installed = await installed()
    } catch (error) {
      current.problem = messageOf(error)
      shown.installed = []
    }

    await readTokens()

    provider.changed()
  }

  /** Fetches a skills pack once; a pack already on disk is used as it is. */
  const fetchPack = async (item: Extract<StoreItem, { kind: "skills" }>) => {
    const target = path.join(directory, "packs", item.id)

    if (await exists(path.join(target, item.folder))) return
    await mkdir(path.dirname(target), { recursive: true })
    const child = spawn("git", ["clone", "--depth", "1", item.repository, target], {
      stdio: "ignore",
      windowsHide: true,
      signal,
    })
    const [code] = await once(child, "exit")

    if (code !== 0) throw new Error(`git clone ended with code ${String(code)}. Git and the internet are needed.`)
  }

  const change = async (id: string, add: boolean): Promise<void> => {
    const item = catalog.find((entry) => entry.id === id)

    if (!item) throw new Error("Unknown item.")
    if (current.busy) throw new Error("Another change is running.")
    current.busy = id
    provider.changed()

    try {
      if (add && item.kind === "skills") await fetchPack(item)
      // Read again right before writing, so a change made by hand since the last read is kept.
      await read()
      const entry = await entryOf(item)
      const next = add ? addEntry(current.config, entry) : removeEntry(current.config, entry)

      if (next !== current.config) {
        await mkdir(directory, { recursive: true })
        // Written beside the file and moved into place, so a crash never leaves half a settings file.
        await writeFile(`${current.file}.tmp`, formatConfig(next), "utf8")
        await rename(`${current.file}.tmp`, current.file)
        current.config = next
      }

      current.problem = null
      shown.installed = await installed()
    } catch (error) {
      log.write("error", "plugin store: change failed", { id, add, error: messageOf(error) })
      throw error
    } finally {
      current.busy = null
      provider.changed()
    }
  }

  void refresh()
}

export default setup
