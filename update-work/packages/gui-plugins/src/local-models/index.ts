import { Plugin } from "@opencode/plugin/gui"
import { builtinCatalog } from "@opencode/plugin/gui/builtin"
import en from "./i18n/en"

// apna-opencode: offline (Ollama) models inside the app: engine start, model list, downloads with progress,
// and an optional copy of every model in a second folder such as a cloud drive.
// English is the default copy; Hindi shows this build's Hinglish copy.
export default Plugin.define({ i18n: builtinCatalog({ en, hi: () => import("./i18n/hi") }) })
