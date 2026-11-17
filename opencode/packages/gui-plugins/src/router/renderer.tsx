import { lazy, Suspense } from "solid-js"
import { Command, SettingsPage, type Plugin } from "@opencode/plugin/gui"
import { Router } from "./contract"
import type definition from "./index"

const setup: Plugin.Setup<typeof definition> = (ctx) => {
  const layout = ctx.layout
  const servers = ctx.servers
  // The router is started and reached from the main process, so the page has nothing to show on the web.
  const router = ctx.use(Router)
  const Page = lazy(() => import("./page"))

  // Gives the app's own server the router's client key, as the Connect dialog does for any provider key. The ref is
  // read on every call, so it follows a restarted server.
  const giveKey = (key: string) => {
    const local = servers
      .list()
      .map((id) => servers.get(id))
      .find((server) => server?.builtin)

    if (!local) return Promise.reject(new Error("The app's server is not ready."))

    return local.client.integration.connect.key({ integrationID: "omniroute", key }).then(() => undefined)
  }

  ctx.add(SettingsPage, {
    id: "router",
    icon: "server",
    get title() {
      return ctx.t("title")
    },
    get entries() {
      return [
        { id: "router", title: ctx.t("title"), keywords: "omniroute router gateway provider api key connect" },
        { id: "router-add", title: ctx.t("add.title"), keywords: "gemini groq openrouter key jodo connect" },
      ]
    },
    render: () => (
      <Suspense>
        <Page router={router} giveKey={giveKey} />
      </Suspense>
    ),
  })

  ctx.add(Command, () => ({
    id: "open",
    title: ctx.t("command.title"),
    group: ctx.t("command.group"),
    run: () => layout.settings("router"),
  }))
}

export default setup
