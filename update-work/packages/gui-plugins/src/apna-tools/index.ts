import { Plugin } from "@opencode/plugin/gui"
import { builtinCatalog } from "@opencode/plugin/gui/builtin"
import en from "./i18n/en"

// apna-opencode: buttons over an open chat (Terminal, Run the project, Share) and voice typing for the composer's
// mic button. English is the default copy; Hindi shows this build's Hinglish copy.
export default Plugin.define({ i18n: builtinCatalog({ en, hi: () => import("./i18n/hi") }) })
