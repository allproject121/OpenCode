import { lazy, Suspense } from "solid-js"
import { Command, SettingsPage, type Plugin } from "@opencode/plugin/gui"
import { Customize } from "./contract"
import type definition from "./index"

/** What the app's server has loaded right now; the page shows an item as active only when it is in here. */
export type Loaded = {
  /** False when the server could not be asked; the lists are then empty and say nothing. */
  readonly known: boolean
  readonly skills: readonly string[]
  readonly commands: readonly string[]
  readonly agents: readonly string[]
  readonly connectors: readonly { readonly name: string; readonly status: string; readonly error: string | undefined }[]
}

const setup: Plugin.Setup<typeof definition> = (ctx) => {
  const layout = ctx.layout
  const servers = ctx.servers
  // The files and the settings are read and written by the main process, so the page has nothing to show on the web.
  const store = ctx.use(Customize)
  const Page = lazy(() => import("./page"))

  // The app's own server. Read on every call, so it follows a restarted server.
  const local = () =>
    servers
      .list()
      .map((id) => servers.get(id))
      .find((server) => server?.builtin)

  const loaded = async (): Promise<Loaded> => {
    const server = local()

    if (!server) return { known: false, skills: [], commands: [], agents: [], connectors: [] }
    const client = server.client
    const [skills, commands, agents, connectors] = await Promise.all([
      client.skill.list({}),
      client.command.list({}),
      client.agent.list({}),
      client.mcp.list({}),
    ])

    return {
      known: true,
      skills: skills.data.map((item) => item.id),
      commands: commands.data.map((item) => item.name),
      agents: agents.data.map((item) => item.id),
      connectors: connectors.data.map((item) => ({
        name: item.name,
        status: item.status.status,
        error: "error" in item.status ? item.status.error : undefined,
      })),
    }
  }

  ctx.add(SettingsPage, {
    id: "customize",
    icon: "sliders",
    get title() {
      return ctx.t("title")
    },
    get entries() {
      return [
        {
          id: "customize",
          title: ctx.t("title"),
          keywords: "customize skill command agent connector mcp hook instructions style apna banao",
        },
      ]
    },
    render: () => (
      <Suspense>
        <Page
          store={store}
          loaded={loaded}
          onSignIn={() => layout.settings("extensions")}
          onPlugins={() => layout.settings("plugin-store")}
        />
      </Suspense>
    ),
  })

  ctx.add(Command, () => ({
    id: "open",
    title: ctx.t("command.title"),
    group: ctx.t("command.group"),
    run: () => layout.settings("customize"),
  }))
}

export default setup
