import { lazy, Suspense } from "solid-js"
import { Command, SettingsPage, type Plugin } from "@opencode/plugin/gui"
import { CloudProjects } from "./contract"
import type definition from "./index"

const setup: Plugin.Setup<typeof definition> = (ctx) => {
  const layout = ctx.layout
  const servers = ctx.servers
  // The folders are made and read by the main process, so the page has nothing to show on the web.
  const projects = ctx.use(CloudProjects)
  const Page = lazy(() => import("./page"))

  // Opens a new chat in a project folder on the app's own server; the folder then shows under Projects. The server
  // is looked up on every call, so it follows a restarted server.
  const open = (directory: string) => {
    const server = servers.list().find((id) => servers.get(id)?.builtin)

    if (!server) throw new Error("The app's server is not ready.")
    layout.draft({ server, directory, prompt: "" })
  }

  ctx.add(SettingsPage, {
    id: "cloud-projects",
    icon: "folder",
    get title() {
      return ctx.t("title")
    },
    get entries() {
      return [{ id: "cloud-projects", title: ctx.t("title"), keywords: "cloud ssd project folder coding new backup" }]
    },
    render: () => (
      <Suspense>
        <Page projects={projects} open={open} />
      </Suspense>
    ),
  })

  ctx.add(Command, () => ({
    id: "open",
    title: ctx.t("command.title"),
    group: ctx.t("command.group"),
    run: () => layout.settings("cloud-projects"),
  }))

  ctx.add(Command, () => ({
    id: "new",
    title: ctx.t("command.new"),
    group: ctx.t("command.group"),
    run: () => layout.settings("cloud-projects"),
  }))
}

export default setup
