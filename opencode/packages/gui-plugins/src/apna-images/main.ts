import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises"
import { homedir } from "node:os"
import path from "node:path"
import type { Plugin } from "@opencode/plugin/gui/main"
import { Images, type ImagesState, type Picture } from "./contract"
import { extensionOf, mimeOf, rankModels } from "./pictures"

const messageOf = (error: unknown) => (error instanceof Error ? error.message : String(error))

const router = "http://127.0.0.1:20128"

const setup: Plugin.MainSetup = (ctx) => {
  const log = ctx.log
  const folder = path.join(homedir(), "Pictures", "Apna-OpenCode")
  const index = path.join(folder, "pictures.json")
  const current: { models: string[]; pictures: Picture[]; making: ImagesState["making"]; problem: string | null } = {
    models: [],
    pictures: [],
    making: null,
    problem: null,
  }

  const state = (): ImagesState => ({
    folder,
    models: [...current.models],
    making: current.making,
    pictures: [...current.pictures],
    problem: current.problem,
  })

  const provider = ctx.provide(Images, {
    state,
    refresh: () => refresh(),
    make: (input) => make(input),
    photo: (file) => photoURL(file),
    read: (file) => read(file),
    remove: (file) => remove(file),
  })

  // The router's client key: the same environment variable the app's provider uses.
  const headers = () => {
    const key = process.env.OMNIROUTE_API_KEY

    if (!key) throw new Error("The router key (OMNIROUTE_API_KEY) is not set. Open Settings > Router.")

    return { authorization: `Bearer ${key}`, "content-type": "application/json" }
  }

  const readIndex = async () => {
    const text = await readFile(index, "utf8").catch(() => "[]")

    try {
      const list = JSON.parse(text) as Picture[]

      return Array.isArray(list) ? list : []
    } catch {
      return []
    }
  }

  const refresh = async (): Promise<void> => {
    current.pictures = (await readIndex()).sort((a, b) => b.time - a.time)

    try {
      const response = await fetch(`${router}/v1/models`, { headers: headers(), signal: AbortSignal.timeout(10_000) })

      if (!response.ok) throw new Error(`The router answered ${response.status}.`)
      const json = (await response.json()) as { data?: { id: string; owned_by?: string }[] }

      current.models = rankModels(json.data ?? [])
      current.problem = null
    } catch (error) {
      current.problem = messageOf(error)
    }

    provider.changed()
  }

  // A photo the user picked in the system dialog: only picture files, and not huge ones.
  const photoURL = async (file: string): Promise<string> => {
    if (!/\.(png|jpe?g|webp|gif)$/i.test(file)) throw new Error("Pick a PNG, JPG, WEBP or GIF picture.")
    const info = await stat(file)

    if (info.size > 15 * 1024 * 1024) throw new Error("The photo is bigger than 15 MB.")
    const bytes = await readFile(file)

    return `data:${mimeOf(bytes)};base64,${bytes.toString("base64")}`
  }

  const make = async (input: { prompt: string; model: string; size: string; photo: string | null }): Promise<string> => {
    const prompt = input.prompt.trim()

    if (!prompt) throw new Error("Write what the picture should show.")
    if (current.making) throw new Error("A picture is already being made.")
    current.making = { prompt, model: input.model, since: Date.now() }
    provider.changed()

    try {
      // Free AI Horde pictures wait in a queue, so this can take a few minutes.
      const response = await fetch(`${router}/v1/images/generations`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({
          model: input.model,
          prompt,
          n: 1,
          size: input.size,
          // AI Horde changes the given photo (img2img) when one is sent.
          ...(input.photo ? { image: await photoURL(input.photo) } : {}),
        }),
        signal: AbortSignal.timeout(600_000),
      })
      const text = await response.text()
      const json = (() => {
        try {
          return JSON.parse(text) as { data?: { b64_json?: string; url?: string }[]; error?: { message?: string } }
        } catch {
          return undefined
        }
      })()

      if (!response.ok || !json?.data?.[0])
        throw new Error(json?.error?.message ?? `The router answered ${response.status}: ${text.slice(0, 200)}`)
      const first = json.data[0]
      const bytes = first.b64_json
        ? Buffer.from(first.b64_json, "base64")
        : first.url
          ? Buffer.from(await (await fetch(first.url, { signal: AbortSignal.timeout(120_000) })).arrayBuffer())
          : undefined

      if (!bytes || bytes.length === 0) throw new Error("The router sent no picture.")
      const time = Date.now()
      const name = `${new Date(time).toISOString().replace(/[:.]/g, "-")}${extensionOf(bytes)}`
      const file = path.join(folder, name)

      await mkdir(folder, { recursive: true })
      await writeFile(file, bytes)
      const pictures = [{ file, prompt, model: input.model, time }, ...(await readIndex())]

      await writeFile(index, JSON.stringify(pictures, null, 2), "utf8")
      current.pictures = pictures.sort((a, b) => b.time - a.time)

      return file
    } catch (error) {
      log.write("error", "images: make failed", { model: input.model, error: messageOf(error) })
      throw error
    } finally {
      current.making = null
      provider.changed()
    }
  }

  const known = (file: string) => current.pictures.some((picture) => picture.file === file)

  const read = async (file: string): Promise<string> => {
    // Only pictures this page made are read, so the window cannot ask for any other file.
    if (!known(file)) throw new Error("Unknown picture.")
    const bytes = await readFile(file)

    return `data:${mimeOf(bytes)};base64,${bytes.toString("base64")}`
  }

  const remove = async (file: string): Promise<void> => {
    if (!known(file)) throw new Error("Unknown picture.")
    await rm(file, { force: true })
    const pictures = (await readIndex()).filter((picture) => picture.file !== file)

    await writeFile(index, JSON.stringify(pictures, null, 2), "utf8")
    current.pictures = pictures.sort((a, b) => b.time - a.time)
    provider.changed()
  }

  void refresh()
}

export default setup
