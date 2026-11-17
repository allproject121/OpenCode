import { createSmartRouterPlugin } from "./router-plugin.mjs"

/**
 * OpenCode entry point.
 *
 * OpenCode calls every export of a plugin module as a plugin function
 * (`(input, options) => hooks`) and refuses the module when any export is not
 * a function ("Plugin export is not a function"). So this file exports exactly
 * one function; the library API (factory, defaults, helpers) lives in
 * `./router-plugin.mjs` and is available as `opencode-omniroute-router/router`.
 *
 * `options` is the second element of the opencode.json plugin tuple:
 *   "plugin": [["opencode-omniroute-router", { "workers": {...}, "models": {...} }]]
 */
export const OmniRouteRouterPlugin = async (input, options) =>
  createSmartRouterPlugin(options ?? {})(input)
