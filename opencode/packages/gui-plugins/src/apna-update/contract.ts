import { Schema } from "effect"
import { Ipc } from "@opencode/plugin/gui"

export const UpdateSource = Schema.Struct({
  /** Shown name; for a connected tool also its id. */
  name: Schema.String,
  /** Where it comes from (a GitHub address, or npm). */
  from: Schema.String,
  /**
   * - `opencode`: this app's own code (upstream releases).
   * - `npm`: a program installed with npm (the router).
   * - `skills`, `plugin`, `tool`: a GitHub project the user connected; skills and plugins are added to the settings.
   */
  kind: Schema.Literals(["opencode", "npm", "skills", "plugin", "tool"]),
  /** Version, release or commit now in use. */
  version: Schema.NullOr(Schema.String),
  /** When it last changed by an update. */
  updated: Schema.NullOr(Schema.String),
  /** A problem seen at the last check. */
  message: Schema.NullOr(Schema.String),
  /** A tool the user connected, which they can remove again. */
  removable: Schema.Boolean,
})

export type UpdateSource = typeof UpdateSource.Type

export const UpdateState = Schema.Struct({
  /** The updater (Programming\tools\auto-update) is on this machine. */
  available: Schema.Boolean,
  /** A check runs now. */
  checking: Schema.Boolean,
  /** The GitHub address being connected now. */
  adding: Schema.NullOr(Schema.String),
  /** The updater's status: `up-to-date`, `ready`, `done`, `conflict`, `test-failed`, `rolled-back`, `new`. */
  status: Schema.String,
  /** The release it is about (vX.Y.Z). */
  target: Schema.NullOr(Schema.String),
  /** The updater's own words about the last step. */
  message: Schema.NullOr(Schema.String),
  /** When the updater last wrote its status. */
  time: Schema.NullOr(Schema.String),
  /** Why updates are held (ROKO.txt), if they are. */
  hold: Schema.NullOr(Schema.String),
  sources: Schema.Array(UpdateSource),
})

export type UpdateState = typeof UpdateState.Type

/** Updates of the app and of everything connected to it. */
export const ApnaUpdate = Ipc.define({
  id: "apna-update",
  state: UpdateState,
  methods: {
    /** Reads the updater's files again. */
    refresh: {},
    /** Runs a full check now: new release (tested in a separate copy), router, skill packs and connected tools. */
    check: {},
    /** Connects a GitHub project: downloads it, adds its skills or plugin to the settings, keeps it updated. */
    add: { input: Schema.String },
    /** Disconnects a connected tool: takes it out of the settings and deletes its folder. */
    remove: { input: Schema.String },
  },
})
