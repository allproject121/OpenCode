import { Schema } from "effect"
import { Ipc } from "@opencode/plugin/gui"

const DocKind = Schema.Literals(["skill", "command", "agent"])

/** A skill, a slash command or an agent the user wrote. See `docs.ts`. */
export const Doc = Schema.Struct({
  kind: DocKind,
  name: Schema.String,
  description: Schema.String,
  body: Schema.String,
  /** Skill only: the AI may pick it up by itself. */
  auto: Schema.Boolean,
  /** Agent only: who starts it. */
  mode: Schema.Literals(["subagent", "primary", "all"]),
})

export type Doc = typeof Doc.Type

/** A tool server in the settings file. */
export const Connector = Schema.Struct({
  name: Schema.String,
  type: Schema.Literals(["remote", "local"]),
  /** The web address, or the command line. */
  target: Schema.String,
  /** It signs in with a token saved on the Plugins page; without one the app's server leaves it out. */
  token: Schema.Boolean,
})

export type Connector = typeof Connector.Type

/** A command that runs by itself at a moment in the AI's work. See `settings.ts`. */
export const Hook = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  event: Schema.Literals(["before-tool", "after-tool", "finished"]),
  tools: Schema.String,
  command: Schema.String,
  enabled: Schema.Boolean,
})

export type Hook = typeof Hook.Type

export const CustomizeState = Schema.Struct({
  /** The settings folder everything here is stored in. */
  directory: Schema.String,
  /** The user's own skills, commands and agents, as read from their files. */
  docs: Schema.Array(Doc),
  /** The always-on instructions: the text of `AGENTS.md` in the settings folder. Empty when there is none. */
  instructions: Schema.String,
  /** The saved memories (`memory.md`), one short fact each; every chat sees them. */
  memories: Schema.Array(Schema.String),
  /** The response style in use: `normal`, `short`, `explain`, `learn`, `hinglish` or `custom`. */
  style: Schema.String,
  /** The user's own style text; empty unless `style` is `custom`. */
  styleText: Schema.String,
  connectors: Schema.Array(Connector),
  hooks: Schema.Array(Hook),
  /** Why something could not be read; null when all of it reads fine. */
  problem: Schema.NullOr(Schema.String),
})

export type CustomizeState = typeof CustomizeState.Type

/** The Customize page's work in the main process: the files and settings behind what the user makes. */
export const Customize = Ipc.define({
  id: "customize",
  state: CustomizeState,
  methods: {
    /** Reads everything again from disk. */
    refresh: {},
    /**
     * Writes a skill, command or agent. `previous` is the name it was opened under: null for a new one, which is
     * rejected when the name is taken; a different name moves it. Rejects with the reason on a bad name.
     */
    saveDoc: { input: Schema.Struct({ doc: Doc, previous: Schema.NullOr(Schema.String) }) },
    /** Deletes a skill (its whole folder), command or agent. */
    deleteDoc: { input: Schema.Struct({ kind: DocKind, name: Schema.String }) },
    /** Replaces the always-on instructions; empty text removes the file. */
    saveInstructions: { input: Schema.String },
    /** Replaces the saved memories; an empty list removes the file. */
    saveMemories: { input: Schema.Array(Schema.String) },
    /** Sets the response style; `text` is used only by `custom`. */
    setStyle: { input: Schema.Struct({ id: Schema.String, text: Schema.String }) },
    /** Adds a tool server to the settings file, or replaces the one with that name. Rejects with the reason. */
    saveConnector: { input: Connector },
    /** Takes a tool server out of the settings file. */
    deleteConnector: { input: Schema.String },
    /** Adds a hook (empty `id`) or replaces the one with that id. */
    saveHook: { input: Hook },
    deleteHook: { input: Schema.String },
  },
})
