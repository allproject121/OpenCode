import { createSignal, For, Show, type Accessor } from "solid-js"
import { usePlugin, type IpcClient, type Live } from "@opencode/plugin/gui"
import type { ApnaUpdate, UpdateSource } from "./contract"
import type definition from "./index"

type Client = IpcClient<typeof ApnaUpdate.spec>

const messageOf = (error: unknown) => (error instanceof Error ? error.message : String(error))

/** Settings > About: the update button and everything that updates by itself, with a box to connect a GitHub tool. */
export default function UpdateSection(props: { update: Accessor<Live<Client>>; reload: () => Promise<void> }) {
  const ctx = usePlugin<typeof definition>()
  const ui = ctx.ui
  const toast = ctx.toast
  const dialogs = ctx.dialogs
  const [address, setAddress] = createSignal("")

  const client = () => {
    const live = props.update()

    return live.status === "active" ? live.value : undefined
  }
  const state = () => client()?.state()

  const known = ["up-to-date", "ready", "done", "conflict", "test-failed", "rolled-back"]
  const said = (current: { status: string; target: string | null }) =>
    ctx.t(`status.${known.includes(current.status) ? current.status : "new"}`, { target: current.target ?? "" })

  const statusText = () => {
    const current = state()

    if (!current) return ctx.t("status.checking")
    if (current.checking) return ctx.t("status.running")

    return said(current)
  }

  const check = () => {
    const update = client()

    if (!update) return
    void update.check().then(
      () => {
        const current = update.state()

        if (!current) return
        toast.show({
          variant: current.status === "conflict" || current.status === "test-failed" ? "error" : "success",
          title: said(current),
        })
      },
      (error: unknown) => toast.show({ variant: "error", title: ctx.t("error", { message: messageOf(error) }) }),
    )
  }

  const connect = () => {
    const update = client()
    const text = address().trim()

    if (!update || text === "") return
    void update.add(text).then(
      async () => {
        setAddress("")
        const added = update.state()?.sources.at(-1)

        toast.show({ variant: "success", title: ctx.t(`add.done.${added?.kind ?? "tool"}`, { name: added?.name ?? "" }) })
        // The server reads the settings again, so new skills or a plugin load without a restart.
        await props.reload().catch(() => toast.show({ variant: "default", title: ctx.t("add.reloadFailed") }))
      },
      (error: unknown) => toast.show({ variant: "error", title: ctx.t("error", { message: messageOf(error) }), persistent: true }),
    )
  }

  const remove = async (item: UpdateSource) => {
    const update = client()

    if (!update) return
    const confirmed = await dialogs.confirm({
      title: ctx.t("remove.confirm", { name: item.name }),
      confirm: ctx.t("remove.button"),
      danger: true,
    })

    if (!confirmed) return
    void update.remove(item.name).then(
      () => props.reload().catch(() => undefined),
      (error: unknown) => toast.show({ variant: "error", title: ctx.t("error", { message: messageOf(error) }) }),
    )
  }

  const detail = (item: UpdateSource) =>
    [
      item.from,
      ctx.t(`kind.${item.kind}`),
      item.version ? ctx.t("version", { version: item.version }) : undefined,
      item.updated ? ctx.t("updated", { time: item.updated }) : undefined,
      item.message ?? undefined,
    ]
      .filter(Boolean)
      .join(" · ")

  return (
    <Show
      when={client()}
      fallback={
        <ui.SettingsSection title={ctx.t("title")}>
          <ui.SettingsRow title={ctx.t("unavailable")} />
        </ui.SettingsSection>
      }
    >
      <ui.SettingsSection title={ctx.t("title")}>
        <ui.SettingsRow
          id="apna-update"
          title={statusText()}
          description={
            <>
              {ctx.t("how")}
              <Show when={state()?.time}>{(time) => <> {ctx.t("last", { time: time() })}</>}</Show>
              <Show when={state()?.hold}>{(hold) => <> {ctx.t("hold", { why: hold() })}</>}</Show>
            </>
          }
        >
          <Show when={!state()?.checking} fallback={<ui.Loader size="small" />}>
            <ui.Button disabled={!state()?.available} onClick={check}>
              {ctx.t("check")}
            </ui.Button>
          </Show>
        </ui.SettingsRow>
      </ui.SettingsSection>

      <ui.SettingsSection title={ctx.t("sources.title")}>
        <For each={state()?.sources ?? []}>
          {(item) => (
            <ui.SettingsRow title={item.name} description={detail(item)}>
              <Show when={item.removable}>
                <ui.Button variant="ghost" onClick={() => void remove(item)}>
                  {ctx.t("remove.button")}
                </ui.Button>
              </Show>
            </ui.SettingsRow>
          )}
        </For>
        <ui.SettingsRow id="apna-update-add" title={ctx.t("add.title")} description={ctx.t("add.description")}>
          <div class="flex items-center gap-2">
            <ui.TextInput
              class="w-64!"
              label={ctx.t("add.label")}
              placeholder="https://github.com/owner/project"
              value={address()}
              onInput={setAddress}
              onSubmit={connect}
            />
            <Show when={!state()?.adding} fallback={<ui.Loader size="small" />}>
              <ui.Button disabled={address().trim() === ""} onClick={connect}>
                {ctx.t("add.button")}
              </ui.Button>
            </Show>
          </div>
        </ui.SettingsRow>
      </ui.SettingsSection>
    </Show>
  )
}
