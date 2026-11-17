import { totalmem } from "node:os"
import path from "node:path"
import { app } from "electron"
import { Schema } from "effect"
import type { Plugin } from "@opencode/plugin/gui/main"
import { LocalModels, type Download, type LocalModelsState, type Transfer } from "./contract"
import {
  downloadFile,
  engineDownloadUrl,
  engineFetch,
  engineVersion,
  findProgram,
  freeBytes,
  hasStored,
  listStored,
  modelsDirectory,
  removeFile,
  removePartials,
  restoreModel,
  startProgram,
  storeModel,
  unpack,
} from "./engine"
import { folderShelf, linkReady, linkShelf, type Shelf } from "./shelf"
import {
  emptyProgress,
  foldPull,
  manifestSegments,
  parsePullLine,
  pullTotals,
  speedOf,
  splitLines,
  type PullProgress,
} from "./progress"

// `cloud` and `free` came later, so settings saved before them hold neither.
/** The folder in the user's cloud that holds the models while Cloud-SSD is connected. */
const cloudModelsFolder = "Ollama-Models"

const CopySettings = Schema.Struct({
  auto: Schema.Boolean,
  folder: Schema.String,
  cloud: Schema.optionalKey(Schema.Boolean),
  free: Schema.optionalKey(Schema.Boolean),
})

/** A slow link stalls single parts of a download; asking again resumes, so a pull is retried this many times. */
const pullAttempts = 12
/** No bytes and no status for this long counts as stalled. */
const stallMs = 120_000
const publishMs = 250

type Job = {
  name: string
  phase: Download["phase"]
  completed: number
  total: number
  attempt: number
  error: string | null
  samples: { at: number; bytes: number }[]
  /** Bytes per layer so far. Kept across a pause, so the bar does not jump back when the download resumes. */
  progress: PullProgress
  controller?: AbortController
}

type EngineModel = { name: string; size: number; params: string | null; quant: string | null }

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

/** Errors the engine reports for a model that will never download, so a retry would only repeat them. */
const permanent = (message: string) =>
  /not found|does not exist|unauthorized|invalid model|manifest unknown/i.test(message)

const Tags = Schema.Struct({
  models: Schema.Array(
    Schema.Struct({
      name: Schema.String,
      size: Schema.Number,
      details: Schema.Struct({
        parameter_size: Schema.String.pipe(Schema.optional),
        quantization_level: Schema.String.pipe(Schema.optional),
      }).pipe(Schema.optional),
    }),
  ),
})

const setup: Plugin.MainSetup = (ctx) => {
  const log = ctx.log
  const signal = ctx.signal
  const settings = ctx.storage.store("copy", { schema: CopySettings, initial: { auto: false, folder: "" } })
  // The app's own copy of the engine, for a machine that has none installed.
  const privateDirectory = path.join(app.getPath("userData"), "engine")
  const canInstall = process.platform === "win32" && process.arch === "x64"

  const current: {
    engine: LocalModelsState["engine"]
    version: string | null
    message: string | null
    install: Transfer | null
    freeBytes: number | null
    models: EngineModel[]
    jobs: Job[]
    pulling: boolean
    copied: Set<string>
    restorable: string[]
    copyBusy: Transfer | null
    copyError: string | null
    copyQueue: { name: string; restore: boolean; free: boolean }[]
    copying: boolean
    /** The copy folder as last worked out; empty when none is chosen or the Cloud-SSD drive is not there. */
    folder: string
    publishTimer?: ReturnType<typeof setTimeout>
  } = {
    engine: "checking",
    version: null,
    message: null,
    install: null,
    freeBytes: null,
    models: [],
    jobs: [],
    pulling: false,
    copied: new Set(),
    restorable: [],
    copyBusy: null,
    copyError: null,
    copyQueue: [],
    copying: false,
    folder: "",
  }

  const state = (): LocalModelsState => ({
    engine: current.engine,
    version: current.version,
    message: current.message,
    canInstall,
    install: current.install,
    modelsDir: modelsDirectory(),
    freeBytes: current.freeBytes,
    ramBytes: totalmem(),
    installed: current.models.map((model) => ({ ...model, copied: current.copied.has(model.name) })),
    downloads: current.jobs.map((job) => ({
      name: job.name,
      phase: job.phase,
      completed: job.completed,
      total: job.total,
      speed: job.phase === "downloading" ? speedOf(job.samples) : 0,
      attempt: job.attempt,
      error: job.error,
    })),
    copy: {
      auto: settings.value.auto,
      folder: current.folder,
      cloud: settings.value.cloud ?? false,
      free: settings.value.free ?? false,
      busy: current.copyBusy,
      error: current.copyError,
      restorable: current.restorable,
    },
  })

  const provider = ctx.provide(LocalModels, {
    state,
    refresh: () => refresh(),
    start: () => start(),
    install: () => install(),
    pull: (name) => pull(name),
    pause: (name) => pause(name),
    resume: (name) => resume(name),
    cancel: (name) => cancel(name),
    dismiss: (name) => {
      current.jobs = current.jobs.filter(
        (job) => job.name !== name || !["done", "failed", "cancelled"].includes(job.phase),
      )
      provider.changed()
    },
    remove: (name) => remove(name),
    setCopy: (next) => {
      const connecting = next.cloud && !settings.value.cloud

      settings.set({ auto: next.auto, folder: next.folder.trim(), cloud: next.cloud, free: next.free })
      current.copyError = null
      provider.changed()
      void scanCopies()
      // Copies written through the cloud drive's letter before the link existed left a second copy in Cloud-SSD's
      // cache on this machine; Cloud-SSD drops the ones that are safely in the cloud.
      if (connecting) void settle()
    },
    copyNow: (name) => {
      const names = name === "*" ? current.models.map((model) => model.name) : [name]

      // A model whose copy is already complete only has to leave this machine, when that is wanted.
      names.forEach((item) => {
        if (!current.copied.has(item)) return queueCopy(item, false)
        if (freeing())
          void resolveShelf()
            .then((shelf) => (shelf ? freeLocal(item, shelf) : undefined))
            .catch(() => undefined)
      })
    },
    restore: (name) => queueCopy(name, true),
  })

  // Progress arrives many times a second; windows get at most one snapshot per `publishMs`.
  const publish = () => {
    if (current.publishTimer) return
    current.publishTimer = setTimeout(() => {
      current.publishTimer = undefined
      provider.changed()
    }, publishMs)
  }

  const readModels = async (): Promise<EngineModel[]> => {
    const response = await engineFetch("/api/tags", { timeoutMs: 10_000, signal })
    const tags = Schema.decodeUnknownSync(Tags)(await response.json())

    return tags.models
      .map((model) => ({
        name: model.name,
        size: model.size,
        params: model.details?.parameter_size || null,
        quant: model.details?.quantization_level || null,
      }))
      .toSorted((a, b) => a.name.localeCompare(b.name))
  }

  // Which installed models have a full copy in the copy folder, and which copies are not on this machine. The copy
  // folder can be a slow cloud drive, so this never holds up the engine's own state.
  // Where copies go: the cloud through the Cloud-SSD app while connected (never through its drive letter, which
  // would leave a second copy in that app's cache on this machine), else the folder the user chose. Undefined while
  // there is none: Cloud-SSD not running, or no folder chosen. Looked up on every use: Cloud-SSD may start or stop.
  const resolveShelf = async (): Promise<Shelf | undefined> => {
    const shelf = settings.value.cloud
      ? (await linkReady())
        ? linkShelf(cloudModelsFolder)
        : undefined
      : settings.value.folder === ""
        ? undefined
        : folderShelf(settings.value.folder)

    current.folder = shelf?.label ?? ""

    return shelf
  }

  const settle = async () => {
    const shelf = await resolveShelf()

    await shelf
      ?.settle?.()
      .catch((error: unknown) =>
        log.write("warn", "local models: Cloud-SSD could not free its cache", { error: messageOf(error) }),
      )
  }

  const freeing = () => !!settings.value.cloud && !!settings.value.free

  // Takes a model off this machine once its full copy is in the copy folder. A model the engine holds in memory
  // is in use right now and stays.
  const freeLocal = async (name: string, shelf: Shelf): Promise<void> => {
    if (!(await hasStored(name, modelsDirectory(), shelf))) return
    const response = await engineFetch("/api/ps", { timeoutMs: 10_000, signal })
    const loaded = Schema.decodeUnknownSync(Tags)(await response.json()).models

    if (loaded.some((model) => model.name === name)) return
    await remove(name)
  }

  const scanCopies = async (): Promise<void> => {
    const shelf = await resolveShelf()
    const label = current.folder

    if (!shelf) {
      current.copied = new Set()
      current.restorable = []

      return provider.changed()
    }

    const installed = current.models.map((model) => model.name)
    const copied = new Set<string>()

    const read = await (async () => {
      for (const name of installed) if (await hasStored(name, modelsDirectory(), shelf)) copied.add(name)

      return listStored(shelf)
    })().catch((error: unknown) => {
      log.write("warn", "local models: could not read the copies", { error: messageOf(error) })

      return undefined
    })

    if (signal.aborted || label !== current.folder || read === undefined) return
    const stored = read
    current.copied = copied
    current.restorable = stored.filter((name) => !installed.includes(name)).toSorted()
    provider.changed()
  }

  const refresh = async (): Promise<void> => {
    const version = await engineVersion()

    if (signal.aborted) return
    current.freeBytes = (await freeBytes(modelsDirectory())) ?? null

    if (version === undefined) {
      current.version = null
      current.models = []
      // A start or install in flight owns the status until it settles.
      if (current.engine !== "starting" && current.engine !== "installing" && current.engine !== "failed")
        current.engine = (await findProgram(privateDirectory)) ? "stopped" : "missing"

      return provider.changed()
    }

    current.version = version
    current.engine = "running"
    current.message = null
    current.models = await readModels().catch((error: unknown) => {
      log.write("warn", "local models: listing failed", { error: messageOf(error) })

      return current.models
    })
    provider.changed()
    void scanCopies()
  }

  const start = async (): Promise<void> => {
    if (current.engine === "running" || current.engine === "starting" || current.engine === "installing") return
    const program = await findProgram(privateDirectory)

    if (!program) {
      current.engine = "missing"

      return provider.changed()
    }

    current.engine = "starting"
    current.message = null
    provider.changed()
    startProgram(program)

    // A cold start loads GPU libraries; give it half a minute before calling it failed.
    for (const _ of Array.from({ length: 30 })) {
      await sleep(1000, signal)
      if (signal.aborted) return
      if ((await engineVersion()) !== undefined) return refresh()
    }

    current.engine = "failed"
    current.message = "The engine did not answer after it was started."
    provider.changed()
  }

  const install = async (): Promise<void> => {
    if (!canInstall || current.engine === "installing" || current.engine === "running") return
    const archive = path.join(privateDirectory, "engine.zip")

    current.engine = "installing"
    current.message = null
    current.install = { name: "engine", completed: 0, total: 0 }
    provider.changed()

    try {
      // The archive is large; a dropped connection continues from the bytes already on disk.
      for (const attempt of Array.from({ length: pullAttempts }, (_, index) => index + 1)) {
        const failure = await downloadFile(
          engineDownloadUrl,
          archive,
          (completed, total) => {
            current.install = { name: "engine", completed, total }
            publish()
          },
          signal,
        ).then(
          () => undefined,
          (error: unknown) => error,
        )

        if (failure === undefined) break
        if (signal.aborted) return
        if (attempt === pullAttempts) throw failure
        await sleep(Math.min(30_000, attempt * 3000), signal)
      }

      await unpack(archive, privateDirectory)
      await removeFile(archive)
      current.install = null
      current.engine = "stopped"
      await start()
    } catch (error) {
      if (signal.aborted) return
      log.write("error", "local models: engine install failed", { error: messageOf(error) })
      current.install = null
      current.engine = "failed"
      current.message = messageOf(error)
      provider.changed()
    }
  }

  const pull = (input: string): void => {
    const name = input.trim()

    if (name === "" || !manifestSegments(name)) throw new Error("That is not a model name.")
    const active = current.jobs.find((job) => job.name === name)

    if (active && working(active)) return
    // A paused or failed download continues in its own row, from its own bytes.
    if (active && (active.phase === "paused" || active.phase === "failed")) return resume(name)
    current.jobs = [
      ...current.jobs.filter((job) => job.name !== name),
      { name, phase: "queued", completed: 0, total: 0, attempt: 0, error: null, samples: [], progress: emptyProgress },
    ]
    provider.changed()
    void drainPulls()
  }

  const working = (job: Job) => ["queued", "downloading", "retrying", "finishing"].includes(job.phase)

  // Stops asking the engine but keeps the row and the bytes on disk; Resume continues from them.
  const pause = (name: string): void => {
    const job = current.jobs.find((item) => item.name === name)

    if (!job || !working(job)) return
    job.phase = "paused"
    job.samples = []
    job.controller?.abort()
    provider.changed()
  }

  const resume = (name: string): void => {
    const job = current.jobs.find((item) => item.name === name)

    if (!job || working(job) || job.phase === "done") return
    job.phase = "queued"
    job.error = null
    provider.changed()
    void drainPulls()
  }

  // Stops the download, takes its row away and deletes its unfinished files, so their space comes back.
  const cancel = (name: string): void => {
    const job = current.jobs.find((item) => item.name === name)

    if (!job || job.phase === "done") return
    const unfinished = Object.entries(job.progress.layers).flatMap(([digest, layer]) =>
      layer.completed < layer.total ? [digest] : [],
    )

    job.phase = "cancelled"
    job.controller?.abort()
    current.jobs = current.jobs.filter((item) => item !== job)
    provider.changed()
    // The engine lets go of the files a moment after the request ends.
    void sleep(1500, signal)
      .then(() => removePartials(modelsDirectory(), unfinished))
      .then(() => refresh())
  }

  // One download at a time: on a slow link several at once only share the same speed and stall each other.
  const drainPulls = async (): Promise<void> => {
    if (current.pulling) return
    current.pulling = true

    try {
      while (!signal.aborted) {
        const job = current.jobs.find((item) => item.phase === "queued")

        if (!job) return
        await runPull(job)
      }
    } finally {
      current.pulling = false
    }
  }

  const runPull = async (job: Job): Promise<void> => {
    if (current.engine !== "running") await start()
    // A pause or a cancel sets the phase itself; the abort it causes is not a failure.
    const stopped = () => job.phase === "cancelled" || job.phase === "paused" || signal.aborted

    for (const attempt of Array.from({ length: pullAttempts }, (_, index) => index + 1)) {
      if (stopped()) return
      job.attempt = attempt
      job.phase = "downloading"
      job.error = null
      provider.changed()
      const failure = await pullOnce(job).then(
        () => undefined,
        (error: unknown) => messageOf(error),
      )

      if (stopped()) return

      if (failure === undefined) {
        job.phase = "done"
        job.completed = job.total
        provider.changed()
        await refresh()
        if (settings.value.cloud || (settings.value.auto && settings.value.folder !== "")) queueCopy(job.name, false)

        return
      }

      log.write("warn", "local models: pull attempt failed", { model: job.name, attempt, error: failure })
      job.error = failure

      if (permanent(failure) || attempt === pullAttempts) {
        job.phase = "failed"

        return provider.changed()
      }

      job.phase = "retrying"
      provider.changed()
      job.controller = new AbortController()
      await sleep(Math.min(30_000, attempt * 3000), AbortSignal.any([signal, job.controller.signal]))
    }
  }

  // One request to the engine. It resolves on the engine's "success" line and rejects on an error line, a dropped
  // connection, or a stall.
  const pullOnce = async (job: Job) => {
    const controller = new AbortController()
    const watch: { timer?: ReturnType<typeof setTimeout>; stalled: boolean } = { stalled: false }

    const touch = () => {
      clearTimeout(watch.timer)
      watch.timer = setTimeout(() => {
        watch.stalled = true
        controller.abort()
      }, stallMs)
    }

    job.controller = controller
    touch()

    try {
      const response = await engineFetch("/api/pull", {
        method: "POST",
        body: { model: job.name, stream: true },
        signal: AbortSignal.any([signal, controller.signal]),
      })

      if (!response.ok || !response.body) throw new Error((await response.text()) || `HTTP ${response.status}`)
      const decoder = new TextDecoder()
      const pending = { text: "", success: false }

      for await (const chunk of response.body) {
        touch()
        const split = splitLines(pending.text + decoder.decode(chunk, { stream: true }))

        pending.text = split.rest

        for (const line of split.lines) {
          const event = parsePullLine(line)

          if (!event) continue
          if (event.error) throw new Error(event.error)
          if (event.status === "success") pending.success = true
          job.progress = foldPull(job.progress, event)
        }

        const totals = pullTotals(job.progress)

        job.completed = totals.completed
        job.total = totals.total
        // A line that arrives after a pause or a cancel must not put the row back to downloading.
        if (job.phase === "downloading" || job.phase === "finishing")
          job.phase = totals.total > 0 && totals.completed >= totals.total ? "finishing" : "downloading"
        job.samples = [
          ...job.samples.filter((sample) => Date.now() - sample.at < 8000),
          { at: Date.now(), bytes: totals.completed },
        ]
        publish()
      }

      if (!pending.success) throw new Error("The download stopped before it finished.")
    } catch (error) {
      throw watch.stalled ? new Error("No data for two minutes; trying again.") : error
    } finally {
      clearTimeout(watch.timer)
    }
  }

  const remove = async (name: string): Promise<void> => {
    const response = await engineFetch("/api/delete", {
      method: "DELETE",
      body: { model: name },
      timeoutMs: 30_000,
      signal,
    })

    if (!response.ok) throw new Error((await response.text()) || `HTTP ${response.status}`)
    await refresh()
  }

  const queueCopy = (name: string, restore: boolean): void => {
    if (!settings.value.cloud && settings.value.folder === "") return
    if (current.copyQueue.some((item) => item.name === name && item.restore === restore)) return
    current.copyQueue = [...current.copyQueue, { name, restore, free: !restore && freeing() }]
    void drainCopies()
  }

  const drainCopies = async (): Promise<void> => {
    if (current.copying) return
    current.copying = true

    try {
      while (!signal.aborted) {
        if (current.copyQueue.length === 0) return
        // Found before the queue is read: more models can join the queue while this waits.
        const shelf = await resolveShelf()
        const local = modelsDirectory()
        const [next, ...rest] = current.copyQueue

        if (!next) return

        // Without the drive nothing can be copied; what waited is dropped and the page says why.
        if (!shelf) {
          current.copyQueue = []
          current.copyError = settings.value.cloud
            ? "Cloud-SSD is not running. Open the Cloud-SSD app, then try again."
            : "No copy folder is chosen."

          return provider.changed()
        }

        current.copyQueue = rest

        current.copyBusy = { name: next.name, completed: 0, total: 0 }
        current.copyError = null
        provider.changed()

        const failure = await (next.restore ? restoreModel : storeModel)(
          next.name,
          local,
          shelf,
          (completed, total) => {
            current.copyBusy = { name: next.name, completed, total }
            publish()
          },
          signal,
        ).then(
          () => undefined,
          (error: unknown) => messageOf(error),
        )

        if (signal.aborted) return
        current.copyBusy = null

        if (failure !== undefined) {
          log.write("error", "local models: copy failed", { model: next.name, restore: next.restore, error: failure })
          current.copyError = `${next.name}: ${failure}`
        }

        if (failure === undefined && next.free)
          await freeLocal(next.name, shelf).catch((error: unknown) =>
            log.write("warn", "local models: could not free the local copy", {
              model: next.name,
              error: messageOf(error),
            }),
          )

        // The engine reads its models folder on every list, so a restored model shows up with the next refresh.
        await refresh()
      }
    } finally {
      current.copying = false
    }
  }

  ctx.onCleanup(() => {
    clearTimeout(current.publishTimer)
    current.jobs.forEach((job) => job.controller?.abort())
  })

  // Find the engine as the app starts, and start it when it is installed, so the user never opens it by hand.
  void refresh().then(() => (current.engine === "stopped" ? start() : undefined))
}

export default setup
