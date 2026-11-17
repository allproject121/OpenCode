import { createMemo, createSignal, For, onCleanup, Show, type Accessor } from "solid-js"
import { createStore } from "solid-js/store"
import { usePlugin, type IpcClient, type Live } from "@opencode/plugin/gui"
import { catalog, categories, type Category, type StoreItem } from "./catalog"
import type { PluginStore } from "./contract"
import type definition from "./index"

type Client = IpcClient<typeof PluginStore.spec>

const messageOf = (error: unknown) => (error instanceof Error ? error.message : String(error))

/** One tool server as the app's server reports it right now. */
export type ToolStatus = { readonly name: string; readonly status: string; readonly error: string | undefined }

/** How often the page asks for the tool servers' state while it is open. */
const statusEveryMs = 4000

export default function PluginStorePage(props: {
  store: Accessor<Live<Client>>
  /** Makes the app's server read its settings again. */
  reload: () => Promise<void>
  /** The state of every tool server the app's server knows. */
  status: () => Promise<readonly ToolStatus[]>
  /** Opens the page where a tool server is signed in. */
  onSignIn: () => void
}) {
  const ctx = usePlugin<typeof definition>()
  const ui = ctx.ui
  const toast = ctx.toast
  const system = ctx.system

  // The main side answers only in the desktop app; everything below renders from its pushed state.
  const client = () => {
    const live = props.store()

    return live.status === "active" ? live.value : undefined
  }

  const state = () => client()?.state()
  const installed = createMemo(() => new Set(state()?.installed ?? []))

  // Browsing like a marketplace: one category or all of them, narrowed by what the user types.
  const [filter, setFilter] = createSignal<"all" | Category>("all")
  const [query, setQuery] = createSignal("")
  const visible = (category: Category) => {
    const words = query().trim().toLowerCase()

    return catalog.filter(
      (item) =>
        item.category === category &&
        (words === "" || `${item.name} ${ctx.t(`item.${item.id}`)}`.toLowerCase().includes(words)),
    )
  }

  // The real state of the tool servers, asked from the app's server: "Added" alone only says the settings file
  // holds the item, not that it connected. A failed read keeps the last answer.
  const [tools, setTools] = createSignal<readonly ToolStatus[]>([])
  const check = () => void props.status().then(setTools, () => undefined)
  const timer = setInterval(check, statusEveryMs)

  check()
  onCleanup(() => clearInterval(timer))

  // The line under an added tool server: what the server says, in the page's words.
  const toolText = (item: StoreItem) => {
    const found = tools().find((tool) => tool.name === item.id)
    const token = tokenOf(item)

    // Without its token the server is left out of the app's server; say what to do instead of "starting".
    if (token === "missing") return ctx.t("status.token.missing")
    if (!found) return ctx.t("status.missing")
    // The server refused the saved token: say so in plain words instead of the raw answer.
    if (token && found.status === "failed" && /401|unauthori|authentication/i.test(found.error ?? ""))
      return ctx.t("status.token.rejected")
    if (found.status === "failed") return ctx.t("status.failed", { error: found.error ?? "" })

    return ctx.t(`status.${found.status}`)
  }

  const needsSignIn = (item: StoreItem) =>
    !tokenOf(item) && tools().find((tool) => tool.name === item.id)?.status === "needs_auth"

  /** The token state of an item that works with a token; undefined for every other item. */
  const tokenOf = (item: StoreItem) => (item.kind === "mcp" && item.token ? state()?.tokens[item.id] : undefined)
  const [typed, setTyped] = createStore<Record<string, string>>({})

  const saveToken = (item: StoreItem, value: string) => {
    const store = client()

    if (!store) return
    void store.setToken({ id: item.id, value }).then(
      () => {
        setTyped(item.id, "")
        toast.show({
          variant: "success",
          title: ctx.t(value === "" ? "token.cleared" : "token.saved", { name: item.name }),
        })
        // The server reads the token when it reads its settings, so ask it to read them again now.
        void props.reload().then(check, () => toast.show({ variant: "default", title: ctx.t("reloadFailed") }))
      },
      (error: unknown) =>
        toast.show({
          variant: "error",
          title: ctx.t("failed", { name: item.name, message: messageOf(error) }),
          persistent: true,
        }),
    )
  }

  // The settings file is changed first; the server is then asked to read it. A failed reload is reported on its own,
  // because the change itself is already saved and loads with the next start.
  const change = (item: StoreItem, add: boolean) => {
    const store = client()

    if (!store) return
    void (add ? store.add(item.id) : store.remove(item.id)).then(
      () =>
        props.reload().then(
          () => {
            check()
            const done = !add
              ? "done.remove"
              : tokenOf(item)
                ? "done.token"
                : item.needsSignIn
                  ? "done.signIn"
                  : "done.add"

            toast.show({ variant: "success", title: ctx.t(done, { name: item.name }) })
          },
          () => toast.show({ variant: "default", title: ctx.t("reloadFailed") }),
        ),
      (error: unknown) =>
        toast.show({
          variant: "error",
          title: ctx.t("failed", { name: item.name, message: messageOf(error) }),
          persistent: true,
        }),
    )
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
        <Show when={state()?.problem}>
          {(message) => (
            <ui.SettingsSection>
              <ui.SettingsRow title={ctx.t("problem", { message: message() })} />
            </ui.SettingsSection>
          )}
        </Show>
        <div class="flex flex-col gap-2">
          <ui.TextInput
            class="w-full!"
            size="large"
            label={ctx.t("search")}
            placeholder={ctx.t("search.placeholder")}
            value={query()}
            onInput={(value) => setQuery(value)}
          />
          <div class="flex flex-wrap items-center gap-1" role="tablist" aria-label={ctx.t("title")}>
            <For each={["all", ...categories] as const}>
              {(id) => (
                <ui.Button variant={filter() === id ? "neutral" : "ghost"} onClick={() => setFilter(id)}>
                  {ctx.t(`category.${id}`)}
                </ui.Button>
              )}
            </For>
          </div>
        </div>
        <For each={categories.filter((category) => (filter() === "all" || filter() === category) && visible(category).length > 0)}>
          {(category) => (
            <ui.SettingsSection
              title={ctx.t(`category.${category}`)}
              footer={
                <Show when={category === "skills" && state()}>
                  {(current) => (
                    <p class="text-12-regular text-v2-text-text-muted">{ctx.t("file", { file: current().file })}</p>
                  )}
                </Show>
              }
            >
              <For each={visible(category)}>
                {(item) => (
                  <>
                    <ui.SettingsRow
                      id={item.id === "context7" ? "plugin-store" : undefined}
                      title={item.name}
                      description={
                        <>
                          {ctx.t(`item.${item.id}`)}
                          <Show when={item.needsSignIn || (item.kind === "mcp" && item.token)}>
                            {"  ·  "}
                            {ctx.t(item.needsSignIn ? "signIn" : "needsToken")}
                          </Show>
                        </>
                      }
                    >
                      <div class="flex items-center gap-2">
                        <ui.Button variant="ghost" onClick={() => void system.openExternal(item.link)}>
                          {ctx.t("more")}
                        </ui.Button>
                        <Show
                          when={installed().has(item.id)}
                          fallback={
                            <ui.Button
                              variant="neutral"
                              icon="plus"
                              busy={state()?.busy === item.id}
                              disabled={!!state()?.busy || !!state()?.problem}
                              onClick={() => change(item, true)}
                            >
                              {ctx.t("add")}
                            </ui.Button>
                          }
                        >
                          <span class="text-12-regular text-v2-text-text-muted">
                            {item.kind === "mcp" ? toolText(item) : ctx.t("added")}
                          </span>
                          <Show when={item.kind === "mcp" && needsSignIn(item)}>
                            <ui.Button variant="neutral" onClick={props.onSignIn}>
                              {ctx.t("signInAction")}
                            </ui.Button>
                          </Show>
                          <ui.Button
                            variant="ghost"
                            busy={state()?.busy === item.id}
                            disabled={!!state()?.busy}
                            onClick={() => change(item, false)}
                          >
                            {ctx.t("remove")}
                          </ui.Button>
                        </Show>
                      </div>
                    </ui.SettingsRow>
                    <Show when={installed().has(item.id) && item.kind === "mcp" && item.token ? item.token : undefined}>
                      {(token) => (
                        <ui.SettingsRow
                          title={ctx.t("token.title", { name: item.name })}
                          description={ctx.t(`token.${tokenOf(item) ?? "missing"}`, { name: item.name })}
                        >
                          <div class="flex items-center gap-2">
                            <ui.Button variant="ghost" onClick={() => void system.openExternal(token().page)}>
                              {ctx.t("token.get")}
                            </ui.Button>
                            <ui.TextInput
                              class="w-40!"
                              type="password"
                              label={ctx.t("token.title", { name: item.name })}
                              placeholder={ctx.t("token.placeholder")}
                              value={typed[item.id] ?? ""}
                              onInput={(value) => setTyped(item.id, value)}
                              onSubmit={(value) => saveToken(item, value)}
                            />
                            <ui.Button
                              disabled={(typed[item.id] ?? "").trim() === ""}
                              onClick={() => saveToken(item, typed[item.id] ?? "")}
                            >
                              {ctx.t("token.save")}
                            </ui.Button>
                            <Show when={tokenOf(item) !== "missing"}>
                              <ui.Button variant="ghost" onClick={() => saveToken(item, "")}>
                                {ctx.t("token.clear")}
                              </ui.Button>
                            </Show>
                          </div>
                        </ui.SettingsRow>
                      )}
                    </Show>
                  </>
                )}
              </For>
            </ui.SettingsSection>
          )}
        </For>
      </Show>
    </ui.SettingsLayout>
  )
}
