import { lazy, Suspense } from "solid-js"
import { Command, SettingsPage, TitlebarItem, type Plugin } from "@opencode/plugin/gui"
import { LocalModels } from "./contract"
import type definition from "./index"

const setup: Plugin.Setup<typeof definition> = (ctx) => {
  const layout = ctx.layout
  // The engine and its files are reached from the main process, so the page has nothing to show on the web.
  const models = ctx.use(LocalModels)
  const Page = lazy(() => import("./page"))

  ctx.add(SettingsPage, {
    id: "local-models",
    icon: "models",
    get title() {
      return ctx.t("title")
    },
    get entries() {
      return [
        { id: "local-models", title: ctx.t("title"), keywords: "ollama offline local model download cloud copy" },
        { id: "local-models-get", title: ctx.t("get.title"), keywords: "pull install model" },
        { id: "local-models-copy", title: ctx.t("copy.title"), keywords: "cloud ssd backup mirror" },
      ]
    },
    render: () => (
      <Suspense>
        <Page models={models} />
      </Suspense>
    ),
  })

  // A download keeps going when Settings is closed, so the title bar shows it from anywhere in the app: the model,
  // how far it is, and a press that opens the page with Pause and Cancel.
  ctx.add(TitlebarItem, (): TitlebarItem | undefined => {
    const live = models()
    const downloads = live.status === "active" ? (live.value.state()?.downloads ?? []) : []
    const running = downloads.find((item) => ["downloading", "retrying", "finishing"].includes(item.phase))
    const shown = running ?? downloads.find((item) => item.phase === "paused" || item.phase === "queued")

    if (!shown) return undefined
    const percent = shown.total > 0 ? Math.floor((shown.completed / shown.total) * 100) : 0

    return {
      id: "download",
      label: ctx.t(shown.phase === "paused" ? "pill.paused" : "pill.downloading", { name: shown.name, percent }),
      title: ctx.t("pill.title"),
      icon: "download",
      open: true,
      run: () => layout.settings("local-models"),
    }
  })

  ctx.add(Command, () => ({
    id: "open",
    title: ctx.t("command.title"),
    group: ctx.t("command.group"),
    run: () => layout.settings("local-models"),
  }))
}

export default setup
