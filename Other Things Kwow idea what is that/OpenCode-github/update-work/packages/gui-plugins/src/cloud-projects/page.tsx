import { createSignal, For, Show, type Accessor } from "solid-js"
import { usePlugin, type IpcClient, type Live } from "@opencode/plugin/gui"
import type { CloudProjects } from "./contract"
import type definition from "./index"

type Client = IpcClient<typeof CloudProjects.spec>

const messageOf = (error: unknown) => (error instanceof Error ? error.message : String(error))

export default function CloudProjectsPage(props: {
  projects: Accessor<Live<Client>>
  /** Opens a new chat in a project folder. */
  open: (directory: string) => void
}) {
  const ctx = usePlugin<typeof definition>()
  const ui = ctx.ui
  const toast = ctx.toast
  const desktop = ctx.desktop

  // The main side answers only in the desktop app; everything below renders from its pushed state.
  const client = () => {
    const live = props.projects()

    return live.status === "active" ? live.value : undefined
  }

  const state = () => client()?.state()
  const [name, setName] = createSignal("")
  const [working, setWorking] = createSignal(false)

  // Runs one change, opens the folder it made, and says why when it did not work.
  const make = (call: (projects: Client) => Promise<string>) => {
    const projects = client()

    if (!projects || working()) return
    setWorking(true)
    void call(projects)
      .then(
        (directory) => {
          setName("")
          props.open(directory)
        },
        (error: unknown) =>
          toast.show({ variant: "error", title: ctx.t("failed", { message: messageOf(error) }), persistent: true }),
      )
      .finally(() => setWorking(false))
  }

  const create = () => make((projects) => projects.create(name()))

  const bring = async () => {
    const [folder] = (await desktop?.pick({ directory: true, title: ctx.t("bring.title") })) ?? []

    if (folder) make((projects) => projects.bring(folder))
  }

  const place = () => {
    const current = state()

    if (!current?.folder) return ctx.t("place.missing")

    return current.uploadedAt === null
      ? ctx.t("place.never", { folder: current.folder })
      : ctx.t("place.uploaded", { folder: current.folder, time: new Date(current.uploadedAt).toLocaleString() })
  }

  return (
    <ui.SettingsLayout title={ctx.t("title")} description={ctx.t("description")}>
      <Show
        when={client()}
        fallback={
          <ui.SettingsSection>
            <ui.SettingsRow title={ctx.t("unavailable")} />
          </ui.SettingsSection>
        }
      >
        {(projects) => (
          <>
            <ui.SettingsSection footer={<p class="text-12-regular text-v2-text-text-muted">{ctx.t("place.note")}</p>}>
              <ui.SettingsRow id="cloud-projects" title={ctx.t("place.title")} description={place()}>
                <ui.Button variant="ghost" onClick={() => void projects().refresh()}>
                  {ctx.t("place.refresh")}
                </ui.Button>
              </ui.SettingsRow>
            </ui.SettingsSection>

            <Show when={state()?.folder}>
              <ui.SettingsSection title={ctx.t("new.title")}>
                <ui.SettingsRow title={ctx.t("new.label")} description={ctx.t("new.description")}>
                  <div class="flex items-center gap-2">
                    <ui.TextInput
                      class="w-44!"
                      label={ctx.t("new.label")}
                      placeholder={ctx.t("new.placeholder")}
                      value={name()}
                      onInput={setName}
                      onSubmit={create}
                    />
                    <ui.Button icon="plus" disabled={name().trim() === "" || working()} onClick={create}>
                      {ctx.t("new.create")}
                    </ui.Button>
                  </div>
                </ui.SettingsRow>
              </ui.SettingsSection>

              <ui.SettingsSection title={ctx.t("list.title")}>
                <Show
                  when={(state()?.projects.length ?? 0) > 0}
                  fallback={<ui.SettingsRow title={ctx.t("list.empty")} />}
                >
                  <For each={state()?.projects}>
                    {(project) => (
                      <ui.SettingsRow title={project.name} description={project.directory}>
                        <ui.Button variant="neutral" onClick={() => props.open(project.directory)}>
                          {ctx.t("list.open")}
                        </ui.Button>
                      </ui.SettingsRow>
                    )}
                  </For>
                </Show>
              </ui.SettingsSection>

              <ui.SettingsSection>
                <ui.SettingsRow
                  title={ctx.t("bring.title")}
                  description={
                    <Show when={state()?.bringing} fallback={ctx.t("bring.description")}>
                      {(folder) => <>{ctx.t("bring.busy", { name: folder() })}</>}
                    </Show>
                  }
                >
                  <ui.Button icon="folder" busy={!!state()?.bringing} disabled={working()} onClick={() => void bring()}>
                    {ctx.t("bring.choose")}
                  </ui.Button>
                </ui.SettingsRow>
              </ui.SettingsSection>
            </Show>
          </>
        )}
      </Show>
    </ui.SettingsLayout>
  )
}
