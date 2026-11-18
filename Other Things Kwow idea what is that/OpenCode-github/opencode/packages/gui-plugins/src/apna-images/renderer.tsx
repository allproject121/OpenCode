import { lazy, Suspense } from "solid-js"
import { Command, SettingsPage, Style, type Plugin } from "@opencode/plugin/gui"
import css from "./page.css?inline"
import { Images } from "./contract"
import type definition from "./index"

const setup: Plugin.Setup<typeof definition> = (ctx) => {
  const layout = ctx.layout
  // The router is called and the pictures are saved by the main process.
  const images = ctx.use(Images)
  const Page = lazy(() => import("./page"))

  ctx.add(Style, css)

  ctx.add(SettingsPage, {
    id: "apna-images",
    icon: "outline-photo",
    get title() {
      return ctx.t("title")
    },
    get entries() {
      return [{ id: "apna-images", title: ctx.t("title"), keywords: "image picture photo tasveer banao generate draw" }]
    },
    render: () => (
      <Suspense>
        <Page images={images} />
      </Suspense>
    ),
  })

  ctx.add(Command, () => ({
    id: "open",
    title: ctx.t("command.title"),
    group: ctx.t("title"),
    run: () => {
      const live = images()

      if (live.status === "active") void live.value.refresh()
      layout.settings("apna-images")
    },
  }))
}

export default setup
