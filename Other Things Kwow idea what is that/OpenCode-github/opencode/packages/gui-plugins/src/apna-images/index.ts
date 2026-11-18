import { Plugin } from "@opencode/plugin/gui"
import { builtinCatalog } from "@opencode/plugin/gui/builtin"
import en from "./i18n/en"

// apna-opencode: an Images page, like the ChatGPT app's: write what to draw, pick a model, get a picture. Pictures come
// through the router (free AI Horde models work without any key) and are kept in Pictures\Apna-OpenCode.
export default Plugin.define({ i18n: builtinCatalog({ en, hi: () => import("./i18n/hi") }) })
