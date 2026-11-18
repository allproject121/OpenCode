import { Plugin } from "@opencode/plugin/gui"
import { builtinCatalog } from "@opencode/plugin/gui/builtin"
import en from "./i18n/en"

// apna-opencode: the Plugins page. A short list of well-known tool servers, plugins and skill packs, each added to
// or removed from this app's settings file with one press.
// English is the default copy; Hindi shows this build's Hinglish copy.
export default Plugin.define({ i18n: builtinCatalog({ en, hi: () => import("./i18n/hi") }) })
