import { compose } from "@opencode/plugin/gui/host"
import context from "./context"
import btw from "./btw"
import debug from "./debug"
import terminal from "./terminal"
import file from "./file"
import review from "./review"
import details from "./details"
import browser from "./browser"
import pairing from "./pairing"
import updater from "./updater"
import ssh from "./ssh"
import wsl from "./wsl"
import microsoftOffice from "./microsoft-office"
import sources from "./sources"
import goal from "./goal"
import localModels from "./local-models"
import router from "./router"
import pluginStore from "./plugin-store"
import customize from "./customize"
import cloudProjects from "./cloud-projects"
import apnaTools from "./apna-tools"
import apnaImages from "./apna-images"
import apnaUpdate from "./apna-update"

/** Built-in plugins with their main entries, by id. Lists every built-in so their ids stay reserved. */
export const builtins = compose({
  context,
  btw,
  debug: { ...debug, mainEntry: () => import("./debug/main") },
  terminal,
  file,
  review,
  details,
  browser: { ...browser, mainEntry: () => import("./browser/main") },
  pairing: { ...pairing, mainEntry: () => import("./pairing/main") },
  updater: { ...updater, mainEntry: () => import("./updater/main") },
  ssh: { ...ssh, mainEntry: () => import("./ssh/main") },
  wsl: { ...wsl, mainEntry: () => import("./wsl/main") },
  "microsoft-office": microsoftOffice,
  sources,
  goal,
  "local-models": { ...localModels, mainEntry: () => import("./local-models/main") },
  router: { ...router, mainEntry: () => import("./router/main") },
  "plugin-store": { ...pluginStore, mainEntry: () => import("./plugin-store/main") },
  customize: { ...customize, mainEntry: () => import("./customize/main") },
  "cloud-projects": { ...cloudProjects, mainEntry: () => import("./cloud-projects/main") },
  "apna-tools": { ...apnaTools, mainEntry: () => import("./apna-tools/main") },
  "apna-images": { ...apnaImages, mainEntry: () => import("./apna-images/main") },
  "apna-update": { ...apnaUpdate, mainEntry: () => import("./apna-update/main") },
})
