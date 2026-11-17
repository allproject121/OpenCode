import { Plugin } from "@opencode/plugin/gui"
import { builtinCatalog } from "@opencode/plugin/gui/builtin"
import en from "./i18n/en"

// apna-opencode: Settings > About shows the app's updates (it follows upstream OpenCode releases by itself through
// Programming\tools\auto-update) with a button to check now, and connects any GitHub project the same way: its
// skills or plugin are added to the settings and it is kept updated.
// English is the default copy; Hindi shows this build's Hinglish copy.
export default Plugin.define({ i18n: builtinCatalog({ en, hi: () => import("./i18n/hi") }) })
