import { spawn } from "node:child_process"
import { once } from "node:events"
import { access, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises"
import { homedir } from "node:os"
import path from "node:path"
import type { Plugin } from "@opencode/plugin/gui/main"
import { addEntry, formatConfig, parseConfig, removeEntry, type Entry } from "../plugin-store/config"
import { ApnaUpdate, type UpdateState } from "./contract"
import { isPlugin, parseGithub, skillRoots } from "./sources"

/** A tool the user connected; `sources.json` holds the list, `update.ps1` keeps each folder current. */
type Connected = {
  readonly name: string
  readonly url: string
  readonly folder: string
  readonly kind: "skills" | "plugin" | "tool"
  /** What was added to the settings for it, so Remove takes out exactly that. */
  readonly entries: readonly Entry[]
  readonly added: string
}

const exists = (file: string) =>
  access(file).then(
    () => true,
    () => false,
  )

const readJson = async <T>(file: string): Promise<T | undefined> => {
  const text = await readFile(file, "utf8").catch(() => undefined)

  if (text === undefined) return undefined
  try {
    // PowerShell writes UTF-8 with a byte order mark.
    return JSON.parse(text.replace(/^﻿/, "")) as T
  } catch {
    return undefined
  }
}

const messageOf = (error: unknown) => (error instanceof Error ? error.message : String(error))

const setup: Plugin.MainSetup = (ctx) => {
  const log = ctx.log
  const signal = ctx.signal
  // The launcher sets the settings folder to Programming\config; the updater sits beside it.
  const config = process.env.OPENCODE_CONFIG_DIR || path.join(homedir(), ".config", "opencode")
  const root = path.dirname(config)
  const here = path.join(root, "tools", "auto-update")
  const script = path.join(here, "update.ps1")
  const listFile = path.join(here, "sources.json")

  const current: { -readonly [K in keyof UpdateState]: UpdateState[K] } = {
    available: false,
    checking: false,
    adding: null,
    status: "new",
    target: null,
    message: null,
    time: null,
    hold: null,
    sources: [],
  }

  const provider = ctx.provide(ApnaUpdate, {
    state: () => ({ ...current, sources: [...current.sources] }),
    refresh: () => refresh(),
    check: () => check(),
    add: (text) => add(text),
    remove: (name) => remove(name),
  })

  const run = async (command: string, args: string[], cwd: string) => {
    const child = spawn(command, args, { cwd, stdio: "ignore", windowsHide: true, signal })
    const [code] = await once(child, "exit")

    return code as number | null
  }

  const output = (command: string, args: string[], cwd: string) =>
    new Promise<string | undefined>((resolve) => {
      const child = spawn(command, args, { cwd, windowsHide: true, signal })
      let text = ""

      child.stdout.on("data", (chunk: Buffer) => (text += chunk.toString()))
      child.on("error", () => resolve(undefined))
      child.on("exit", (code) => resolve(code === 0 ? text.trim() : undefined))
    })

  const list = async () => (await readJson<Connected[]>(listFile)) ?? []

  const saveList = async (items: readonly Connected[]) => {
    await writeFile(`${listFile}.tmp`, JSON.stringify(items, null, 2), "utf8")
    await rename(`${listFile}.tmp`, listFile)
  }

  const settingsFile = async () => {
    const jsonc = path.join(config, "opencode.jsonc")
    const json = path.join(config, "opencode.json")

    return (await exists(jsonc)) || !(await exists(json)) ? jsonc : json
  }

  /** Changes the settings file the way the Plugins page does: read right before, written beside, moved in place. */
  const changeSettings = async (entries: readonly Entry[], add: boolean) => {
    const file = await settingsFile()
    const before = parseConfig(await readFile(file, "utf8").catch(() => ""))
    const next = entries.reduce((value, entry) => (add ? addEntry(value, entry) : removeEntry(value, entry)), before)

    if (next === before) return
    await mkdir(config, { recursive: true })
    await writeFile(`${file}.tmp`, formatConfig(next), "utf8")
    await rename(`${file}.tmp`, file)
  }

  const refresh = async (): Promise<void> => {
    current.available = await exists(script)
    const state = await readJson<{ status?: string; target?: string; message?: string; time?: string }>(
      path.join(here, "state.json"),
    )

    current.status = state?.status ?? "new"
    current.target = state?.target ?? null
    current.message = state?.message ?? null
    current.time = state?.time ?? null
    current.hold = await readFile(path.join(here, "ROKO.txt"), "utf8").then(
      (text) => text.trim() || null,
      () => null,
    )

    const npm = process.env.APPDATA ? path.join(process.env.APPDATA, "npm", "node_modules", "omniroute", "package.json") : ""
    const router = npm ? await readJson<{ version?: string }>(npm) : undefined
    const pack = path.join(config, "packs", "superpowers")
    const packCommit = (await exists(path.join(pack, ".git")))
      ? await output("git", ["rev-parse", "--short", "HEAD"], pack)
      : undefined
    const states = (await readJson<Record<string, { commit?: string; updated?: string; message?: string }>>(
      path.join(here, "sources-state.json"),
    )) ?? {}

    current.sources = [
      {
        name: "OpenCode",
        from: "github.com/anomalyco/opencode",
        kind: "opencode",
        version: current.target,
        updated: current.status === "done" ? current.time : null,
        message: null,
        removable: false,
      },
      ...(router?.version
        ? [{ name: "OmniRoute", from: "npm: omniroute", kind: "npm" as const, version: router.version, updated: null, message: null, removable: false }]
        : []),
      ...(packCommit
        ? [{ name: "Superpowers", from: "github.com/obra/superpowers", kind: "skills" as const, version: packCommit, updated: null, message: null, removable: false }]
        : []),
      ...(await list()).map((item) => ({
        name: item.name,
        from: item.url.replace(/^https:\/\//, "").replace(/\.git$/, ""),
        kind: item.kind,
        version: states[item.name]?.commit ?? null,
        updated: states[item.name]?.updated ?? null,
        message: states[item.name]?.message ?? null,
        removable: true,
      })),
    ]
    provider.changed()
  }

  const check = async (): Promise<void> => {
    if (current.checking) return
    if (!(await exists(script))) throw new Error("The updater is not on this machine (tools\\auto-update\\update.ps1).")
    current.checking = true
    provider.changed()
    try {
      const code = await run("powershell.exe", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", script, "check"], root)

      if (code !== 0) log.write("error", "apna-update: check ended", { code })
    } finally {
      current.checking = false
      await refresh()
    }
  }

  const add = async (text: string): Promise<void> => {
    const project = parseGithub(text)

    if (!project) throw new Error("Paste a GitHub project address, like https://github.com/owner/project")
    if (current.adding) throw new Error("Another tool is being connected.")
    const items = await list()

    if (items.some((item) => item.name === project.name)) throw new Error(`${project.name} is already connected.`)
    const folder = path.join(root, "connected", project.name)

    if (await exists(folder)) throw new Error(`The folder ${folder} already exists.`)
    current.adding = project.url
    provider.changed()

    try {
      await mkdir(path.dirname(folder), { recursive: true })
      const cloned = await run("git", ["clone", "--depth", "1", project.url, folder], root)

      if (cloned !== 0) throw new Error("Download failed. Check the address and the internet (git is needed).")

      const plugin = await isPlugin(folder)
      const skills = plugin ? [] : await skillRoots(folder)
      const kind = plugin ? "plugin" : skills.length ? "skills" : "tool"
      const entries: Entry[] = plugin ? [{ kind: "plugin", spec: folder }] : skills.map((item) => ({ kind: "skills", path: item }))

      if (plugin && (await run("bun", ["install"], folder)) !== 0)
        log.write("error", "apna-update: bun install failed for a plugin", { folder })
      await changeSettings(entries, true)
      await saveList([...items, { name: project.name, url: project.url, folder, kind, entries, added: new Date().toISOString() }])
      log.write("info", "apna-update: connected", { name: project.name, kind })
    } catch (error) {
      // Nothing half-connected stays: the downloaded folder goes again.
      await rm(folder, { recursive: true, force: true }).catch(() => undefined)
      log.write("error", "apna-update: connect failed", { url: project.url, error: messageOf(error) })
      throw error
    } finally {
      current.adding = null
      await refresh()
    }
  }

  const remove = async (name: string): Promise<void> => {
    const items = await list()
    const item = items.find((entry) => entry.name === name)

    if (!item) throw new Error(`${name} is not connected.`)
    await changeSettings(item.entries, false)
    await saveList(items.filter((entry) => entry.name !== name))
    // Only a folder this page made under Programming\connected is deleted.
    if (path.dirname(item.folder) === path.join(root, "connected")) await rm(item.folder, { recursive: true, force: true })
    await refresh()
  }

  void refresh()
}

export default setup
