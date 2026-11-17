import { Plugin } from "@opencode/plugin/gui"
import { builtinCatalog } from "@opencode/plugin/gui/builtin"
import en from "./i18n/en"

// apna-opencode: the Customize page. The user writes their own skills, slash commands, agents, always-on
// instructions, response style, tool servers ("connectors") and hooks here; each is a file or a settings entry that
// OpenCode reads, and the page shows what the app's server really loaded.
// English is the default copy; Hindi shows this build's Hinglish copy.
export default Plugin.define({ i18n: builtinCatalog({ en, hi: () => import("./i18n/hi") }) })
