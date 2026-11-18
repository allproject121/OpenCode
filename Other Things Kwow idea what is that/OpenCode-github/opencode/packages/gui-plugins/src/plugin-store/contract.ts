import { Schema } from "effect"
import { Ipc } from "@opencode/plugin/gui"

export const PluginStoreState = Schema.Struct({
  /** The settings file the page changes. */
  file: Schema.String,
  /** Catalog ids that the settings file holds now. */
  installed: Schema.Array(Schema.String),
  /** The id being added or removed; null while idle. */
  busy: Schema.NullOr(Schema.String),
  /** Why the settings file could not be read; null when it reads fine. */
  problem: Schema.NullOr(Schema.String),
  /** For each catalog id that works with a token: whether one is saved (`ready`) or not (`missing`). */
  tokens: Schema.Record(Schema.String, Schema.Literals(["missing", "ready"])),
})

export type PluginStoreState = typeof PluginStoreState.Type

/** The Plugins page's work in the main process: reading and changing this app's settings file. */
export const PluginStore = Ipc.define({
  id: "plugin-store",
  state: PluginStoreState,
  methods: {
    /** Reads the settings file again. */
    refresh: {},
    /** Adds a catalog item to the settings file, fetching a skills pack first. Rejects with the reason on failure. */
    add: { input: Schema.String },
    /** Takes a catalog item out of the settings file. A fetched skills pack stays on disk. */
    remove: { input: Schema.String },
    /**
     * Saves an item's token as the user's environment variable, or clears it when `value` is empty. Never written
     * to a file. Rejects with the reason on failure.
     */
    setToken: { input: Schema.Struct({ id: Schema.String, value: Schema.String }) },
  },
})
