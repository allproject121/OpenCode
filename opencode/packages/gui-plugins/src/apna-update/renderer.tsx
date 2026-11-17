import { lazy, Suspense } from "solid-js"
import { Command, SettingsPage, type Plugin } from "@opencode/plugin/gui"
import { ApnaUpdate } from "./contract"
import type definition from "./index"

const setup: Plugin.Setup<typeof definition> = (ctx) => {
  const layout = ctx.layout
  const servers = ctx.servers
  // The updater runs from the main process, so the section has nothing to show on the web.
  const update = ctx.use(ApnaUpdate)
  const Section = lazy(() => import("./section"))

  // Asks the app's own server to read its settings again, so a connected tool's skills or plugin load at once.
  const reload = async () => {
    const local = servers
      .list()
      .map((id) => servers.get(id))
      .find((server) => server?.builtin)

    if (!local) throw new Error("The app's server is not ready.")
    await local.client.location.reload()
  }

  ctx.add(SettingsPage, {
    id: "apna-update",
    page: "about",
    get title() {
      return ctx.t("title")
    },
    get entries() {
      return [
        { id: "apna-update", title: ctx.t("check"), keywords: "update upgrade new version release opencode" },
        { id: "apna-update-add", title: ctx.t("add.title"), keywords: "github connect tool skill plugin jodo" },
      ]
    },
    render: () => (
      <Suspense>
        <Section update={update} reload={reload} />
      </Suspense>
    ),
  })

  ctx.add(Command, () => ({
    id: "open",
    title: ctx.t("command.title"),
    group: ctx.t("command.group"),
    run: () => layout.settings("about"),
  }))
}

export default setup
