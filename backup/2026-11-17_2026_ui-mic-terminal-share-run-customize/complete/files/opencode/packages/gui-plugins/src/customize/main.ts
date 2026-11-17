import { randomUUID } from "node:crypto"
import { access, mkdir, readdir, readFile, rename, rm, writeFile } from "node:fs/promises"
import { homedir } from "node:os"
import path from "node:path"
import type { Plugin } from "@opencode/plugin/gui/main"
import { formatConfig, parseConfig, type ConfigObject } from "../plugin-store/config"
import { Customize, type CustomizeState, type Doc, type Hook } from "./contract"
import { docFile, formatDoc, kindFolder, parseDoc, validName, type DocKind } from "./docs"
import { addMemory, formatMemories, parseMemories } from "./memory"
import {
  connectorServer,
  formatHooks,
  formatStyle,
  listConnectors,
  parseHooks,
  parseStyle,
  styles,
  validConnectorName,
  withConnector,
  withInstructionFile,
  withoutConnector,
  type Connector,
  type StyleId,
} from "./settings"

const exists = (file: string) =>
  access(file).then(
    () => true,
    () => false,
  )

const readText = (file: string) => readFile(file, "utf8").catch(() => undefined)

const messageOf = (error: unknown) => (error instanceof Error ? error.message : String(error))

const kinds: readonly DocKind[] = ["skill", "command", "agent"]

const setup: Plugin.MainSetup = (ctx) => {
  const log = ctx.log
  // The folder OpenCode reads its global settings from; the launcher points it at this app's own folder.
  const directory = process.env.OPENCODE_CONFIG_DIR || path.join(homedir(), ".config", "opencode")
  const instructionsFile = path.join(directory, "AGENTS.md")
  const styleFile = path.join(directory, "response-style.md")
  const hooksFile = path.join(directory, "hooks.json")
  const memoryFile = path.join(directory, "memory.md")
  const shown: { value: CustomizeState } = {
    value: {
      directory,
      docs: [],
      instructions: "",
      memories: [],
      style: "normal",
      styleText: "",
      connectors: [],
      hooks: [],
      problem: null,
    },
  }

  /** Written beside the file and moved into place, so a crash never leaves half a file. */
  const write = async (file: string, text: string) => {
    await mkdir(path.dirname(file), { recursive: true })
    await writeFile(`${file}.tmp`, text, "utf8")
    await rename(`${file}.tmp`, file)
  }

  /** The settings file: an existing `opencode.json` keeps its name, else `opencode.jsonc`. */
  const configFile = async () => {
    const jsonc = path.join(directory, "opencode.jsonc")
    const json = path.join(directory, "opencode.json")

    return (await exists(jsonc)) || !(await exists(json)) ? jsonc : json
  }

  const readConfig = async () => parseConfig((await readText(await configFile())) ?? "")

  /** Reads the settings right before changing them, so a change made elsewhere since is kept. */
  const changeConfig = async (change: (config: ConfigObject) => ConfigObject) => {
    const config = await readConfig()
    const next = change(config)

    if (next !== config) await write(await configFile(), formatConfig(next))
  }

  const readDocs = async (kind: DocKind): Promise<Doc[]> => {
    const entries = await readdir(kindFolder(kind, directory), { withFileTypes: true }).catch(() => [])
    const names =
      kind === "skill"
        ? entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name)
        : entries
            .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
            .map((entry) => entry.name.slice(0, -3))
    const docs = await Promise.all(
      names.map(async (name) => {
        const text = await readText(docFile(kind, directory, name))

        return text === undefined ? undefined : parseDoc(kind, name, text)
      }),
    )

    return docs.filter((doc) => doc !== undefined).toSorted((a, b) => a.name.localeCompare(b.name))
  }

  const refresh = async (): Promise<void> => {
    try {
      const style = parseStyle(await readText(styleFile))

      shown.value = {
        directory,
        docs: (await Promise.all(kinds.map(readDocs))).flat(),
        instructions: (await readText(instructionsFile)) ?? "",
        memories: parseMemories(await readText(memoryFile)),
        style: style.id,
        styleText: style.custom,
        connectors: listConnectors(await readConfig()),
        hooks: parseHooks(await readText(hooksFile)),
        problem: null,
      }
    } catch (error) {
      shown.value = { ...shown.value, problem: messageOf(error) }
    }

    provider.changed()
  }

  /** Runs a change, then shows what is on disk; a failure is logged and passed on to the page. */
  const act = async (name: string, change: () => Promise<void>): Promise<void> => {
    try {
      await change()
    } catch (error) {
      log.write("error", `customize: ${name} failed`, { error: messageOf(error) })
      throw error
    } finally {
      await refresh()
    }
  }

  const saveDoc = (input: { doc: Doc; previous: string | null }) =>
    act("save", async () => {
      const doc = input.doc
      const kind = doc.kind

      if (!validName(doc.name)) throw new Error("Use small letters, digits and dashes for the name, such as my-skill.")
      if (doc.body.trim() === "") throw new Error("Write what it should do.")
      const file = docFile(kind, directory, doc.name)
      const moved = input.previous !== null && input.previous !== doc.name

      if ((input.previous === null || moved) && (await exists(file))) throw new Error(`"${doc.name}" already exists.`)
      // A renamed skill keeps the other files in its folder, so the folder moves; a command or agent is one file.
      if (moved && validName(input.previous ?? "")) {
        const from =
          kind === "skill"
            ? path.dirname(docFile(kind, directory, input.previous ?? ""))
            : docFile(kind, directory, input.previous ?? "")
        const to = kind === "skill" ? path.dirname(file) : file

        await mkdir(path.dirname(to), { recursive: true })
        await rename(from, to)
      }

      await write(file, formatDoc(doc))
    })

  const deleteDoc = (input: { kind: DocKind; name: string }) =>
    act("delete", async () => {
      if (!validName(input.name)) throw new Error("That is not a name from this page.")
      const file = docFile(input.kind, directory, input.name)

      await rm(input.kind === "skill" ? path.dirname(file) : file, { recursive: true, force: true })
    })

  const saveInstructions = (text: string) =>
    act("instructions", async () => {
      if (text.trim() === "") return rm(instructionsFile, { force: true })
      await write(instructionsFile, `${text.trim()}\n`)
    })

  const saveMemories = (list: readonly string[]) =>
    act("memory", async () => {
      // Cleaned the same way as the AI's memory_save: no empty or repeated lines.
      const clean = list.reduce<string[]>((kept, memory) => addMemory(kept, memory), [])

      if (clean.length === 0) return rm(memoryFile, { force: true })
      await write(memoryFile, formatMemories(clean))
    })

  const setStyle = (input: { id: string; text: string }) =>
    act("style", async () => {
      const id = (input.id === "custom" || input.id in styles ? input.id : "normal") as StyleId
      const on = id !== "normal" && (id !== "custom" || input.text.trim() !== "")

      if (id === "custom" && !on) throw new Error("Write how the AI should answer.")
      // The file first, then the settings that point at it; taken out in the other order.
      if (on) await write(styleFile, formatStyle(id, input.text))
      await changeConfig((config) => withInstructionFile(config, styleFile, on))
      if (!on) await rm(styleFile, { force: true })
    })

  const saveConnector = (input: Connector) =>
    act("connector", async () => {
      if (!validConnectorName(input.name))
        throw new Error("Use small letters, digits, dashes and underscores for the name, such as my-tools.")
      const server = connectorServer(input, process.platform)

      await changeConfig((config) => withConnector(config, input.name, server))
    })

  const deleteConnector = (name: string) =>
    act("connector", () => changeConfig((config) => withoutConnector(config, name)))

  const saveHook = (input: Hook) =>
    act("hook", async () => {
      if (input.command.trim() === "") throw new Error("Type the command to run.")
      if (input.name.trim() === "") throw new Error("Give it a name.")
      const hooks = parseHooks(await readText(hooksFile))
      const hook = {
        ...input,
        id: input.id === "" ? randomUUID() : input.id,
        name: input.name.trim(),
        command: input.command.trim(),
        tools: input.tools.trim() === "" ? "*" : input.tools.trim(),
      }

      await write(
        hooksFile,
        formatHooks(
          hooks.some((item) => item.id === hook.id)
            ? hooks.map((item) => (item.id === hook.id ? hook : item))
            : [...hooks, hook],
        ),
      )
    })

  const deleteHook = (id: string) =>
    act("hook", async () => {
      const hooks = parseHooks(await readText(hooksFile))

      await write(hooksFile, formatHooks(hooks.filter((item) => item.id !== id)))
    })

  const provider = ctx.provide(Customize, {
    state: () => shown.value,
    refresh,
    saveDoc,
    deleteDoc,
    saveInstructions,
    saveMemories,
    setStyle,
    saveConnector,
    deleteConnector,
    saveHook,
    deleteHook,
  })

  void refresh()
}

export default setup
