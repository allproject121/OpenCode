import { Schema } from "effect"
import { Ipc } from "@opencode/plugin/gui"

export const RunState = Schema.Struct({
  /**
   * - `installing`: `npm install` runs first because the project has no `node_modules`.
   * - `starting`: the server was started and has not printed its address yet.
   * - `running`: it runs; `url` is set when it printed one (a static server always has one).
   * - `stopped`: the user stopped it, or it ended by itself (`message` then says how).
   * - `failed`: it could not start; `message` says why.
   */
  status: Schema.Literals(["installing", "starting", "running", "stopped", "failed"]),
  /** What runs, as the user would type it, e.g. `npm run dev` or "Built-in web server". */
  command: Schema.String,
  url: Schema.NullOr(Schema.String),
  message: Schema.NullOr(Schema.String),
  /** The last lines the server printed. */
  log: Schema.Array(Schema.String),
})

export type RunState = typeof RunState.Type

export const ApnaToolsState = Schema.Struct({
  /** Each project folder the Run button started, by folder path. */
  runs: Schema.Record(Schema.String, RunState),
})

export type ApnaToolsState = typeof ApnaToolsState.Type

/** Small helpers that need the main process: running the open project, voice typing, saving a chat. */
export const ApnaTools = Ipc.define({
  id: "apna-tools",
  state: ApnaToolsState,
  methods: {
    /** Starts the project in this folder (`npm run dev`, a static web server, ...). Rejects when it finds no way. */
    run: { input: Schema.String },
    /** Stops what Run started in this folder. */
    stop: { input: Schema.String },
    /** Opens Windows voice typing (Win+H) over the focused text box. */
    dictate: {},
    /** Writes a chat as a Markdown file into the project folder and shows it; returns the file's path. */
    saveChat: {
      input: Schema.Struct({ directory: Schema.String, name: Schema.String, content: Schema.String }),
      output: Schema.String,
    },
  },
})
