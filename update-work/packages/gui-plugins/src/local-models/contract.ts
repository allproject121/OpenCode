import { Schema } from "effect"
import { Ipc } from "@opencode/plugin/gui"

/** A model the local engine holds. */
export const InstalledModel = Schema.Struct({
  name: Schema.String,
  size: Schema.Number,
  /** Parameter count as the engine reports it, such as "7.6B". */
  params: Schema.NullOr(Schema.String),
  /** Quantization as the engine reports it, such as "Q4_K_M". */
  quant: Schema.NullOr(Schema.String),
  /** A complete copy of this model is in the copy folder. */
  copied: Schema.Boolean,
})

export type InstalledModel = typeof InstalledModel.Type

/**
 * One download. `queued` waits for the one before it; `retrying` waits before it asks the engine again, which
 * resumes from the bytes already on disk; `paused` waits for the user and keeps those bytes.
 */
export const Download = Schema.Struct({
  name: Schema.String,
  phase: Schema.Literals(["queued", "downloading", "retrying", "paused", "finishing", "done", "failed", "cancelled"]),
  completed: Schema.Number,
  total: Schema.Number,
  /** Bytes per second over the last few seconds. */
  speed: Schema.Number,
  /** 1 for the first try. */
  attempt: Schema.Number,
  error: Schema.NullOr(Schema.String),
})

export type Download = typeof Download.Type

/** Bytes moved by a long copy or by the engine download. */
export const Transfer = Schema.Struct({ name: Schema.String, completed: Schema.Number, total: Schema.Number })

export type Transfer = typeof Transfer.Type

export const LocalModelsState = Schema.Struct({
  /**
   * - `checking`: not asked yet.
   * - `missing`: no engine program on this machine.
   * - `stopped`: the program exists and is not running.
   * - `starting`, `running`, `installing`.
   * - `failed`: starting or installing failed; `message` says why.
   */
  engine: Schema.Literals(["checking", "missing", "stopped", "starting", "running", "installing", "failed"]),
  version: Schema.NullOr(Schema.String),
  message: Schema.NullOr(Schema.String),
  /** Whether this system can install the engine from inside the app. */
  canInstall: Schema.Boolean,
  install: Schema.NullOr(Transfer),
  modelsDir: Schema.String,
  freeBytes: Schema.NullOr(Schema.Number),
  ramBytes: Schema.Number,
  installed: Schema.Array(InstalledModel),
  downloads: Schema.Array(Download),
  copy: Schema.Struct({
    /** Copy every finished download to `folder` by itself. */
    auto: Schema.Boolean,
    /** Where copies go: the chosen folder, or the Cloud-SSD folder while `cloud` is on. Empty when there is none. */
    folder: Schema.String,
    /** Cloud-SSD is connected: models are kept on its cloud drive, found by itself on every use. */
    cloud: Schema.Boolean,
    /** With `cloud`: a model is taken off this machine once its full copy is on Cloud-SSD. */
    free: Schema.Boolean,
    busy: Schema.NullOr(Transfer),
    error: Schema.NullOr(Schema.String),
    /** Models that are in the copy folder and not on this machine. */
    restorable: Schema.Array(Schema.String),
  }),
})

export type LocalModelsState = typeof LocalModelsState.Type

/** Offline models: the engine on this machine, its models, downloads, and the second copy. */
export const LocalModels = Ipc.define({
  id: "local-models",
  state: LocalModelsState,
  methods: {
    /** Asks the engine again for its version and models. */
    refresh: {},
    /** Starts the engine program when it is installed and not running. */
    start: {},
    /** Downloads the engine into the app's own folder, then starts it. Resumes a partial download. */
    install: {},
    /** Queues a model download; a name already queued or downloading is left alone. */
    pull: { input: Schema.String },
    /** Stops a download for now. Its row and the bytes already on disk stay, so Resume continues from them. */
    pause: { input: Schema.String },
    /** Continues a paused or failed download from the bytes on disk. */
    resume: { input: Schema.String },
    /** Stops a download, removes its row and deletes its unfinished files, so their space comes back. */
    cancel: { input: Schema.String },
    /** Removes a finished, failed or cancelled download from the list. */
    dismiss: { input: Schema.String },
    /** Deletes a model from this machine. Its copy in the copy folder stays. */
    remove: { input: Schema.String },
    /** Saves the copy folder and whether finished downloads are copied by themselves. */
    setCopy: {
      input: Schema.Struct({
        auto: Schema.Boolean,
        folder: Schema.String,
        cloud: Schema.Boolean,
        free: Schema.Boolean,
      }),
    },
    /**
     * Copies one model, or every model with "*", to the copy folder now. With Cloud-SSD connected and `free` on,
     * each model is then taken off this machine.
     */
    copyNow: { input: Schema.String },
    /** Copies a model from the copy folder back to this machine. */
    restore: { input: Schema.String },
  },
})
