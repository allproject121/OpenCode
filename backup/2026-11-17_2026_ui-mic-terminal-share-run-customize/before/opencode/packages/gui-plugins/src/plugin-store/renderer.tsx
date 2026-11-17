import { lazy, Suspense } from "solid-js"
import { Command, SettingsPage, type Plugin } from "@opencode/plugin/gui"
import { PluginStore } from "./contract"
import type definition from "./index"

const setup: Plugin.Setup<typeof definition> = (ctx) => {
  const layout = ctx.layout
  const servers = ctx.servers
  // The settings file is read and written by the main process, so the page has nothing to show on the web.
  const store = ctx.use(PluginStore)
  const Page = lazy(() => import("./page"))

  // Asks the app's own server to read its settings again, so what was just added loads without a restart. The ref is
  // read on every call, so it follows a restarted server.
  const local = () =>
    servers
      .list()
      .map((id) => servers.get(id))
      .find((server) => server?.builtin)

  const reload = async () => {
    const server = local()

    if (!server) throw new Error("The app's server is not ready.")
    await server.client.location.reload()
  }

  // What the server says about each tool server right now: connected, waiting for sign-in, failed and why.
  const status = async () => {
    const server = local()

    if (!server) return []
    const result = await server.client.mcp.list({})

    return result.data.map((item) => ({
      name: item.name,
      status: item.status.status,
      error: "error" in item.status ? item.status.error : undefined,
    }))
  }

  ctx.add(SettingsPage, {
    id: "plugin-store",
    icon: "grid-plus",
    get title() {
      return ctx.t("title")
    },
    get entries() {
      return [{ id: "plugin-store", title: ctx.t("title"), keywords: "plugin mcp skill extension store add jodo" }]
    },
    render: () => (
      <Suspense>
        <Page store={store} reload={reload} status={status} onSignIn={() => layout.settings("extensions")} />
      </Suspense>
    ),
  })

  ctx.add(Command, () => ({
    id: "open",
    title: ctx.t("command.title"),
    group: ctx.t("command.group"),
    run: () => layout.settings("plugin-store"),
  }))
}

export default setup
