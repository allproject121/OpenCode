import { cp, mkdir, readdir, readFile, stat } from "node:fs/promises"
import { homedir } from "node:os"
import path from "node:path"
import type { Plugin } from "@opencode/plugin/gui/main"
import { CloudProjects, type CloudProject, type CloudProjectsState } from "./contract"
import { carried, fastFolder, nameProblem, projectsFolderName } from "./folders"

const problems = {
  empty: "Give the project a name.",
  characters: "Use letters, digits, spaces, dots, dashes and underscores only, starting with a letter or digit.",
  reserved: "Windows keeps that name for itself. Pick another one.",
}

const setup: Plugin.MainSetup = (ctx) => {
  // The Cloud-SSD app's own files. They are only read here, never written.
  const cloudSsd = path.join(process.env.LOCALAPPDATA ?? "", "Cloud-SSD")
  const current: {
    folder: string | null
    projects: CloudProject[]
    uploadedAt: number | null
    bringing: string | null
  } = { folder: null, projects: [], uploadedAt: null, bringing: null }

  const state = (): CloudProjectsState => ({ ...current })

  const provider = ctx.provide(CloudProjects, {
    state,
    refresh: () => refresh(),
    create: (name) => create(name),
    bring: (source) => bring(source),
  })

  // When the Cloud-SSD app last finished uploading the projects folder. It writes the time once an upload ends.
  const readUploadedAt = async () => {
    try {
      const parsed: unknown = JSON.parse(
        (await readFile(path.join(cloudSsd, "hybrid-state.json"), "utf8")).replace(/^\uFEFF/, ""),
      )
      const uploaded: unknown = typeof parsed === "object" && parsed !== null ? Reflect.get(parsed, "Uploaded") : null
      const time: unknown =
        typeof uploaded === "object" && uploaded !== null ? Reflect.get(uploaded, projectsFolderName) : null
      const value = typeof time === "string" ? Date.parse(time) : Number.NaN

      return Number.isNaN(value) ? null : value
    } catch {
      return null
    }
  }

  const refresh = async (): Promise<void> => {
    const fast = fastFolder(await readFile(path.join(cloudSsd, "settings.json"), "utf8").catch(() => ""), homedir())
    const there = fast
      ? await stat(fast).then(
          (item) => item.isDirectory(),
          () => false,
        )
      : false

    current.folder = fast && there ? path.join(fast, projectsFolderName) : null
    const entries = current.folder ? await readdir(current.folder, { withFileTypes: true }).catch(() => []) : []
    const folder = current.folder ?? ""

    current.projects = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => ({ name: entry.name, directory: path.join(folder, entry.name) }))
      .toSorted((a, b) => a.name.localeCompare(b.name))
    current.uploadedAt = await readUploadedAt()
    provider.changed()
  }

  /** The path a new project gets. Rejects for a bad name, a taken name, or while the fast drive is not there. */
  const target = async (name: string) => {
    await refresh()
    const problem = nameProblem(name)

    if (problem) throw new Error(problems[problem])
    if (!current.folder)
      throw new Error("Cloud-SSD's fast drive was not found. Open the Cloud-SSD app and switch it on.")
    const directory = path.join(current.folder, name.trim())

    if (
      await stat(directory).then(
        () => true,
        () => false,
      )
    )
      throw new Error(`A project named "${name.trim()}" is already there.`)

    return directory
  }

  const create = async (name: string): Promise<string> => {
    const directory = await target(name)

    await mkdir(directory, { recursive: true })
    await refresh()

    return directory
  }

  const bring = async (source: string): Promise<string> => {
    if (current.bringing) throw new Error("Another folder is being brought in.")
    const directory = await target(path.basename(source))

    current.bringing = path.basename(source)
    provider.changed()

    try {
      await cp(source, directory, { recursive: true, filter: (entry) => carried(source, entry) })
    } finally {
      current.bringing = null
      await refresh()
    }

    return directory
  }

  void refresh()
}

export default setup
