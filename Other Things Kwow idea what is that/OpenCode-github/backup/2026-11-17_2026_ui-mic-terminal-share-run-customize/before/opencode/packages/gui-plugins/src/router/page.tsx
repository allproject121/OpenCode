import { createMemo, createSignal, For, Match, Show, Switch, type Accessor } from "solid-js"
import { createStore } from "solid-js/store"
import { usePlugin, type IpcClient, type Live } from "@opencode/plugin/gui"
import type { Router } from "./contract"
import type definition from "./index"
import { providers, routerUrl, type RouterProvider } from "./providers"

type Client = IpcClient<typeof Router.spec>

const messageOf = (error: unknown) => (error instanceof Error ? error.message : String(error))

export default function RouterPage(props: {
  router: Accessor<Live<Client>>
  /** Gives the app's own server the router's client key, so the router's models load. */
  giveKey: (key: string) => Promise<void>
}) {
  const ctx = usePlugin<typeof definition>()
  const ui = ctx.ui
  const toast = ctx.toast
  const dialogs = ctx.dialogs
  const system = ctx.system

  // The main side answers only in the desktop app; everything below renders from its pushed state.
  const client = () => {
    const live = props.router()

    return live.status === "active" ? live.value : undefined
  }

  const state = () => client()?.state()
  const [routerKey, setRouterKey] = createSignal("")
  // The key typed for each provider; cleared once it is sent, so it never stays on the page.
  const [keys, setKeys] = createStore<Record<string, string>>({})

  // Every button answers: a call that main rejects shows why instead of doing nothing.
  const act = (call: (router: Client) => Promise<unknown>) => {
    const router = client()

    if (!router) return
    void call(router).catch((error: unknown) =>
      toast.show({ variant: "error", title: ctx.t("error.action", { message: messageOf(error) }) }),
    )
  }

  const connected = createMemo(() => new Set(state()?.connections.map((item) => item.provider) ?? []))

  const blocked = () => {
    const current = state()

    if (current?.status !== "running") return ctx.t("add.needRouter")
    if (!current.hasKey) return ctx.t("add.needKey")

    return undefined
  }

  const saveKey = () => {
    const router = client()
    const key = routerKey().trim()

    if (!router || key === "") return
    setRouterKey("")
    void router.setKey(key).then(
      () =>
        props.giveKey(key).then(
          () => toast.show({ variant: "success", title: ctx.t("key.opencode") }),
          (error: unknown) =>
            toast.show({ variant: "error", title: ctx.t("key.opencodeFailed", { message: messageOf(error) }) }),
        ),
      (error: unknown) => toast.show({ variant: "error", title: ctx.t("error.action", { message: messageOf(error) }) }),
    )
  }

  const connect = (item: RouterProvider) => {
    const router = client()
    const key = (keys[item.id] ?? "").trim()

    if (!router || key === "") return
    setKeys(item.id, "")
    void router.connect({ provider: item.id, key }).then(
      () => toast.show({ variant: "success", title: ctx.t("add.done", { name: item.name }) }),
      (error: unknown) =>
        toast.show({
          variant: "error",
          title: ctx.t("add.failed", { name: item.name, message: messageOf(error) }),
          persistent: true,
        }),
    )
  }

  const remove = async (connection: { id: string; provider: string; name: string }) => {
    const confirmed = await dialogs.confirm({
      title: ctx.t("connections.removeConfirm", { name: `${connection.provider} / ${connection.name}` }),
      confirm: ctx.t("connections.remove"),
      danger: true,
    })

    if (confirmed) act((router) => router.disconnect(connection.id))
  }

  const statusText = () => {
    const current = state()

    if (!current) return ctx.t("status.checking")
    if (current.status === "failed") return ctx.t("status.failed", { message: current.message ?? "" })

    return ctx.t(`status.${current.status}`)
  }

  return (
    <ui.SettingsLayout title={ctx.t("title")} description={ctx.t("description")}>
      <Show
        when={client()}
        fallback={
          <ui.SettingsSection>
            <ui.SettingsRow title={ctx.t("status.unavailable")} />
          </ui.SettingsSection>
        }
      >
        <ui.SettingsSection title={ctx.t("status.title")}>
          <ui.SettingsRow id="router" title={statusText()} description={ctx.t("status.address", { url: routerUrl })}>
            <div class="flex items-center gap-2">
              <Switch>
                <Match when={state()?.status === "stopped" || state()?.status === "failed"}>
                  <ui.Button onClick={() => act((router) => router.start())}>{ctx.t("status.start")}</ui.Button>
                </Match>
                <Match when={state()?.status === "missing"}>
                  <ui.Button onClick={() => act((router) => router.install())}>{ctx.t("status.install")}</ui.Button>
                </Match>
                <Match when={state()?.status === "starting" || state()?.status === "installing"}>
                  <ui.Loader size="small" />
                </Match>
                <Match when={state()?.status === "running"}>
                  <ui.Button variant="ghost" onClick={() => void system.openExternal("http://localhost:20128")}>
                    {ctx.t("status.dashboard")}
                  </ui.Button>
                </Match>
              </Switch>
              <ui.Button variant="ghost" onClick={() => act((router) => router.refresh())}>
                {ctx.t("status.refresh")}
              </ui.Button>
            </div>
          </ui.SettingsRow>
          <Show
            when={state()?.hasKey}
            fallback={
              <ui.SettingsRow title={ctx.t("key.title")} description={ctx.t("key.description")}>
                <div class="flex items-center gap-2">
                  <ui.TextInput
                    class="w-44!"
                    type="password"
                    label={ctx.t("key.label")}
                    placeholder={ctx.t("add.placeholder")}
                    value={routerKey()}
                    onInput={setRouterKey}
                    onSubmit={saveKey}
                  />
                  <ui.Button disabled={routerKey().trim() === ""} onClick={saveKey}>
                    {ctx.t("key.save")}
                  </ui.Button>
                </div>
              </ui.SettingsRow>
            }
          >
            <ui.SettingsRow
              title={ctx.t("key.title")}
              description={state()?.keyFromEnv ? ctx.t("key.env") : ctx.t("key.saved")}
            >
              <Show when={!state()?.keyFromEnv}>
                <ui.Button variant="ghost" onClick={() => act((router) => router.setKey(""))}>
                  {ctx.t("key.forget")}
                </ui.Button>
              </Show>
            </ui.SettingsRow>
          </Show>
        </ui.SettingsSection>

        <ui.SettingsSection
          title={ctx.t("add.title")}
          footer={
            <p class="text-12-regular text-v2-text-text-muted">
              {ctx.t("add.hint")}
              <Show when={blocked()}>
                {(reason) => (
                  <>
                    {"  "}
                    {reason()}
                  </>
                )}
              </Show>
            </p>
          }
        >
          <For each={providers}>
            {(item) => (
              <ui.SettingsRow
                id={item.id === "gemini" ? "router-add" : undefined}
                title={item.name}
                description={
                  <>
                    {ctx.t(`note.${item.id}`)}
                    <Show when={connected().has(item.id)}>
                      {"  ·  "}
                      {ctx.t("add.connected")}
                    </Show>
                  </>
                }
              >
                <div class="flex items-center gap-2">
                  <ui.Button variant="neutral" class="shrink-0 whitespace-nowrap" onClick={() => void system.openExternal(item.keyUrl)}>
                    {ctx.t("add.getKey")}
                  </ui.Button>
                  <ui.TextInput
                    class="w-40!"
                    type="password"
                    label={ctx.t("add.label", { name: item.name })}
                    placeholder={ctx.t("add.placeholder")}
                    value={keys[item.id] ?? ""}
                    onInput={(value) => setKeys(item.id, value)}
                    onSubmit={() => connect(item)}
                    disabled={blocked() !== undefined}
                  />
                  <ui.Button
                    busy={state()?.connecting === item.id}
                    disabled={
                      blocked() !== undefined || (keys[item.id] ?? "").trim() === "" || !!state()?.connecting
                    }
                    onClick={() => connect(item)}
                  >
                    {ctx.t("add.connect")}
                  </ui.Button>
                </div>
              </ui.SettingsRow>
            )}
          </For>
        </ui.SettingsSection>

        <ui.SettingsSection title={ctx.t("connections.title")}>
          <For each={state()?.connections} fallback={<ui.SettingsRow title={ctx.t("connections.empty")} />}>
            {(connection) => (
              <ui.SettingsRow
                title={`${connection.provider} / ${connection.name}`}
                description={[
                  connection.active ? ctx.t("connections.ok") : ctx.t("connections.off"),
                  connection.status,
                ]
                  .filter(Boolean)
                  .join("  ·  ")}
              >
                <ui.Button variant="ghost" onClick={() => void remove(connection)}>
                  {ctx.t("connections.remove")}
                </ui.Button>
              </ui.SettingsRow>
            )}
          </For>
        </ui.SettingsSection>
      </Show>
    </ui.SettingsLayout>
  )
}
