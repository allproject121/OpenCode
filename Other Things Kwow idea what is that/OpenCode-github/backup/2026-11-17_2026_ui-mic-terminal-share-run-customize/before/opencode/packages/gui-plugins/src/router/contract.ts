import { Schema } from "effect"
import { Ipc } from "@opencode/plugin/gui"

export const RouterState = Schema.Struct({
  /**
   * - `checking`: not asked yet.
   * - `missing`: the router program is not on this machine.
   * - `stopped`: it is installed and not running.
   * - `starting`, `installing`, `running`.
   * - `failed`: starting or installing failed; `message` says why.
   */
  status: Schema.Literals(["checking", "missing", "stopped", "starting", "installing", "running", "failed"]),
  message: Schema.NullOr(Schema.String),
  /** The app knows the router's client key, so it can list and add connections. */
  hasKey: Schema.Boolean,
  /** The key came from the OMNIROUTE_API_KEY environment variable rather than from this page. */
  keyFromEnv: Schema.Boolean,
  connections: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      provider: Schema.String,
      name: Schema.String,
      active: Schema.Boolean,
      status: Schema.NullOr(Schema.String),
    }),
  ),
  /** The provider id a connect is running for. */
  connecting: Schema.NullOr(Schema.String),
})

export type RouterState = typeof RouterState.Type

/** The local AI router (OmniRoute): its process, its client key, and the provider connections it holds. */
export const Router = Ipc.define({
  id: "router",
  state: RouterState,
  methods: {
    /** Asks the router again whether it runs and which connections it has. */
    refresh: {},
    /** Starts the router in the background when it is installed and not running. */
    start: {},
    /** Installs the router with npm, then starts it. */
    install: {},
    /** Saves the router's own client key, encrypted with the system's keychain. An empty key forgets it. */
    setKey: { input: Schema.String },
    /**
     * Adds a provider connection with the pasted API key, then asks the router to test it. Rejects with the router's
     * message when the key is refused.
     */
    connect: { input: Schema.Struct({ provider: Schema.String, key: Schema.String }) },
    /** Removes a connection from the router. */
    disconnect: { input: Schema.String },
  },
})
