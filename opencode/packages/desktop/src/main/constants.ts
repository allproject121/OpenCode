import { app } from "electron"

type Channel = "local" | "dev" | "beta" | "prod"

const raw = import.meta.env.OPENCODE_CHANNEL

export const CHANNEL: Channel = raw === "local" || raw === "dev" || raw === "beta" || raw === "prod" ? raw : "dev"

export const VERSION = app.isPackaged ? app.getVersion() : (process.env.OPENCODE_VERSION ?? app.getVersion())

// Local renderer/server mode keeps the dev application identity.
// apna-opencode: this build runs from source under its own name.
// The installed build (installer from tools\installer) has its own name and id, so it never shares
// data or an install folder with the official OpenCode apps.
export const APP_NAME = "Apna OpenCode"

export const APP_ID = app.isPackaged ? "ai.apna.opencode" : "ai.opencode.desktop.dev"
