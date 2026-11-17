import {
  createEffect,
  createMemo,
  createSignal,
  For,
  Match,
  on,
  onCleanup,
  Show,
  Switch,
  type Accessor,
} from "solid-js"
import { Textarea } from "@opencode/ui/textarea"
import { usePlugin, type IpcClient, type Live } from "@opencode/plugin/gui"
import type { Connector, Customize, Doc, Hook } from "./contract"
import { toName, validName, type DocKind } from "./docs"
import type definition from "./index"
import type { Loaded } from "./renderer"
import { styles } from "./settings"

type Client = IpcClient<typeof Customize.spec>

const messageOf = (error: unknown) => (error instanceof Error ? error.message : String(error))

const tabs = ["skill", "connector", "agent", "command", "instructions", "hook", "plugins"] as const

type Tab = (typeof tabs)[number]

const styleIds = [...Object.keys(styles), "custom"] as (keyof typeof styles | "custom")[]

const modes = ["subagent", "primary", "all"] as const

const events = ["before-tool", "after-tool", "finished"] as const

/** How often the page asks the app's server what it has loaded, while it is open. */
const loadedEveryMs = 4000

const nothingLoaded: Loaded = { known: false, skills: [], commands: [], agents: [], connectors: [] }

const emptyDoc = (kind: DocKind): Doc => ({ kind, name: "", description: "", body: "", auto: true, mode: "subagent" })

const emptyHook: Hook = { id: "", name: "", event: "after-tool", tools: "edit,write", command: "", enabled: true }

// The app's text box is 280px wide by itself; here it fills its row.
const boxClass = "w-full! [&_textarea]:font-mono [&_textarea]:text-12-regular"

export default function CustomizePage(props: {
  store: Accessor<Live<Client>>
  /** What the app's server has loaded right now. */
  loaded: () => Promise<Loaded>
  /** Opens the page where a tool server is signed in. */
  onSignIn: () => void
  /** Opens the Plugins page. */
  onPlugins: () => void
}) {
  const ctx = usePlugin<typeof definition>()
  const ui = ctx.ui
  const toast = ctx.toast
  const dialogs = ctx.dialogs
  const [tab, setTab] = createSignal<Tab>("skill")

  // The main side answers only in the desktop app; everything below renders from its pushed state.
  const client = () => {
    const live = props.store()

    return live.status === "active" ? live.value : undefined
  }

  const state = () => client()?.state()

  // What the app's server really loaded, asked from the server: a file on disk alone does not mean it works. A failed
  // read keeps the last answer.
  const [loaded, setLoaded] = createSignal<Loaded>(nothingLoaded)
  const check = () => void props.loaded().then(setLoaded, () => undefined)
  const timer = setInterval(check, loadedEveryMs)

  check()
  onCleanup(() => clearInterval(timer))

  /** Runs a change in the main process. Resolves to why it failed, or undefined when it worked. */
  const run = async (work: (store: Client) => Promise<unknown>, done?: string): Promise<string | undefined> => {
    const store = client()

    if (!store) return ctx.t("unavailable")

    return work(store).then(
      () => {
        if (done) toast.show({ variant: "success", title: done })
        // The server notices a new file a moment after it is written.
        setTimeout(check, 700)

        return undefined
      },
      (error: unknown) => messageOf(error),
    )
  }

  /** For a button outside a dialog: a failure shows as a toast. */
  const act = (work: (store: Client) => Promise<unknown>, done?: string) =>
    void run(work, done).then((problem) => {
      if (problem) toast.show({ variant: "error", title: ctx.t("failed", { message: problem }), persistent: true })
    })

  const docsOf = (kind: DocKind) => (state()?.docs ?? []).filter((doc) => doc.kind === kind)

  const loadedNames = (kind: DocKind) =>
    kind === "skill" ? loaded().skills : kind === "command" ? loaded().commands : loaded().agents

  // Whether the app's server has this one of the user's: the proof that it is in use, not only saved.
  const docStatus = (doc: Doc) => {
    if (!loaded().known) return ctx.t("status.unknown")

    return loadedNames(doc.kind).includes(doc.name) ? ctx.t("status.active") : ctx.t("status.waiting")
  }

  /** The ones the server has that the user did not write here: from packs, plugins and the app itself. */
  const others = (kind: DocKind) => {
    const mine = new Set(docsOf(kind).map((doc) => doc.name))

    return loadedNames(kind).filter((name) => !mine.has(name))
  }

  const openDoc = (kind: DocKind, doc: Doc | undefined) =>
    dialogs.open((dialog) => {
      const [draft, setDraft] = createSignal<Doc>(doc ?? emptyDoc(kind))
      const [problem, setProblem] = createSignal<string>()
      const [busy, setBusy] = createSignal(false)
      const name = () => toName(draft().name)

      const save = () => {
        setBusy(true)
        void run(
          (store) => store.saveDoc({ doc: { ...draft(), name: name() }, previous: doc?.name ?? null }),
          ctx.t("saved", { name: name() }),
        ).then((failure) => {
          setBusy(false)
          setProblem(failure)
          if (!failure) dialog.close()
        })
      }

      return (
        <ui.Dialog
          size="large"
          title={ctx.t(doc ? `${kind}.edit` : `${kind}.new`)}
          description={ctx.t(`${kind}.help`)}
          footer={
            <div class="flex items-center gap-2">
              <ui.Button variant="ghost" onClick={dialog.close}>
                {ctx.t("cancel")}
              </ui.Button>
              <ui.Button
                variant="contrast"
                busy={busy()}
                disabled={!validName(name()) || draft().body.trim() === ""}
                onClick={save}
              >
                {ctx.t("save")}
              </ui.Button>
            </div>
          }
        >
          <div class="flex flex-col gap-3">
            <label class="flex flex-col gap-1">
              <span class="text-12-medium text-v2-text-text-base">{ctx.t("field.name")}</span>
              <ui.TextInput
                class="w-full!"
                size="large"
                label={ctx.t("field.name")}
                placeholder={ctx.t(`${kind}.namePlaceholder`)}
                value={draft().name}
                onInput={(value) => setDraft({ ...draft(), name: value })}
              />
              <span class="text-12-regular text-v2-text-text-muted">
                {name() === ""
                  ? ctx.t("field.nameHint")
                  : ctx.t(kind === "command" ? "field.nameCommand" : "field.nameSaved", { name: name() })}
              </span>
            </label>
            <label class="flex flex-col gap-1">
              <span class="text-12-medium text-v2-text-text-base">{ctx.t(`${kind}.description`)}</span>
              <ui.TextInput
                class="w-full!"
                size="large"
                label={ctx.t(`${kind}.description`)}
                placeholder={ctx.t(`${kind}.descriptionPlaceholder`)}
                value={draft().description}
                onInput={(value) => setDraft({ ...draft(), description: value })}
              />
            </label>
            <label class="flex flex-col gap-1">
              <span class="text-12-medium text-v2-text-text-base">{ctx.t(`${kind}.body`)}</span>
              <Textarea
                class={boxClass}
                rows={10}
                aria-label={ctx.t(`${kind}.body`)}
                placeholder={ctx.t(`${kind}.bodyPlaceholder`)}
                value={draft().body}
                onInput={(event) => setDraft({ ...draft(), body: event.currentTarget.value })}
              />
            </label>
            <Show when={kind === "skill"}>
              <ui.Switch
                label={ctx.t("skill.auto")}
                description={ctx.t("skill.autoHelp")}
                checked={draft().auto}
                onChange={(checked) => setDraft({ ...draft(), auto: checked })}
              />
            </Show>
            <Show when={kind === "agent"}>
              <div class="flex items-center justify-between gap-3">
                <span class="text-12-regular text-v2-text-text-muted">{ctx.t(`agent.mode.${draft().mode}.help`)}</span>
                <ui.Select
                  label={ctx.t("agent.mode")}
                  options={modes.map((mode) => ({ value: mode, label: ctx.t(`agent.mode.${mode}`) }))}
                  value={draft().mode}
                  onChange={(mode) => setDraft({ ...draft(), mode })}
                />
              </div>
            </Show>
            <Show when={problem()}>
              {(message) => <p class="text-12-regular text-v2-text-text-danger">{message()}</p>}
            </Show>
          </div>
        </ui.Dialog>
      )
    })

  const removeDoc = async (doc: Doc) => {
    const confirmed = await dialogs.confirm({
      title: ctx.t("deleteConfirm", { name: doc.name }),
      confirm: ctx.t("delete"),
      danger: true,
    })

    if (confirmed)
      act((store) => store.deleteDoc({ kind: doc.kind, name: doc.name }), ctx.t("deleted", { name: doc.name }))
  }

  /** One of the three file kinds: the user's own with their real state, then what else the server has. */
  const docSections = (kind: DocKind) => (
    <>
      <ui.SettingsSection title={ctx.t(`${kind}.mine`)}>
        <ui.SettingsRow title={ctx.t(`${kind}.new`)} description={ctx.t(`${kind}.help`)}>
          <ui.Button variant="neutral" icon="plus" onClick={() => openDoc(kind, undefined)}>
            {ctx.t("new")}
          </ui.Button>
        </ui.SettingsRow>
        <For each={docsOf(kind)}>
          {(doc) => (
            <ui.SettingsRow
              title={kind === "command" ? `/${doc.name}` : doc.name}
              description={doc.description === "" ? ctx.t("noDescription") : doc.description}
            >
              <div class="flex items-center gap-2">
                <span class="text-12-regular text-v2-text-text-muted">{docStatus(doc)}</span>
                <ui.Button variant="neutral" onClick={() => openDoc(kind, doc)}>
                  {ctx.t("edit")}
                </ui.Button>
                <ui.Button variant="ghost" onClick={() => void removeDoc(doc)}>
                  {ctx.t("delete")}
                </ui.Button>
              </div>
            </ui.SettingsRow>
          )}
        </For>
      </ui.SettingsSection>
      <Show when={others(kind).length > 0}>
        <ui.SettingsSection title={ctx.t(`${kind}.others`, { count: others(kind).length })}>
          <ui.SettingsRow title={ctx.t("othersTitle")} description={others(kind).join(", ")} />
        </ui.SettingsSection>
      </Show>
    </>
  )

  // The always-on instructions. The box follows the file until the user types in it.
  const [rules, setRules] = createSignal("")
  const [rulesDirty, setRulesDirty] = createSignal(false)

  createEffect(
    on(
      () => state()?.instructions,
      (text) => {
        if (text !== undefined && !rulesDirty()) setRules(text)
      },
    ),
  )

  const saveRules = () =>
    act(
      (store) => store.saveInstructions(rules()).then(() => setRulesDirty(false)),
      ctx.t(rules().trim() === "" ? "instructions.cleared" : "instructions.saved"),
    )

  // The response style. The pick follows the file until the user changes it.
  const [style, setStyle] = createSignal<(typeof styleIds)[number]>("normal")
  const [styleText, setStyleText] = createSignal("")
  const [styleDirty, setStyleDirty] = createSignal(false)
  const savedStyle = createMemo(() => styleIds.find((id) => id === state()?.style) ?? "normal")

  createEffect(
    on(
      () => [savedStyle(), state()?.styleText] as const,
      ([id, text]) => {
        if (styleDirty()) return
        setStyle(id)
        setStyleText(text ?? "")
      },
    ),
  )

  const applyStyle = () =>
    act(
      (store) => store.setStyle({ id: style(), text: styleText() }).then(() => setStyleDirty(false)),
      ctx.t("style.saved", { name: ctx.t(`style.${style()}`) }),
    )

  const connectorText = (connector: Connector) => {
    const found = loaded().connectors.find((item) => item.name === connector.name)

    if (!loaded().known) return ctx.t("status.unknown")
    // A token server without its token is not started at all, so "starting" would never end.
    if (!found) return ctx.t(connector.token ? "connector.status.token" : "connector.status.missing")
    if (found.status === "failed") return ctx.t("connector.status.failed", { error: found.error ?? "" })

    return ctx.t(`connector.status.${found.status}`)
  }

  const needsSignIn = (connector: Connector) =>
    loaded().connectors.find((item) => item.name === connector.name)?.status === "needs_auth"

  const openConnector = () =>
    dialogs.open((dialog) => {
      const [draft, setDraft] = createSignal<Connector>({ name: "", type: "remote", target: "", token: false })
      const [problem, setProblem] = createSignal<string>()
      const [busy, setBusy] = createSignal(false)
      const name = () => toName(draft().name)

      const save = () => {
        setBusy(true)
        void run(
          (store) => store.saveConnector({ ...draft(), name: name() }),
          ctx.t("connector.saved", { name: name() }),
        ).then((failure) => {
          setBusy(false)
          setProblem(failure)
          if (!failure) dialog.close()
        })
      }

      return (
        <ui.Dialog
          title={ctx.t("connector.new")}
          description={ctx.t("connector.help")}
          footer={
            <div class="flex items-center gap-2">
              <ui.Button variant="ghost" onClick={dialog.close}>
                {ctx.t("cancel")}
              </ui.Button>
              <ui.Button
                variant="contrast"
                busy={busy()}
                disabled={name() === "" || draft().target.trim() === ""}
                onClick={save}
              >
                {ctx.t("connector.add")}
              </ui.Button>
            </div>
          }
        >
          <div class="flex flex-col gap-3">
            <label class="flex flex-col gap-1">
              <span class="text-12-medium text-v2-text-text-base">{ctx.t("field.name")}</span>
              <ui.TextInput
                class="w-full!"
                size="large"
                label={ctx.t("field.name")}
                placeholder={ctx.t("connector.namePlaceholder")}
                value={draft().name}
                onInput={(value) => setDraft({ ...draft(), name: value })}
              />
              <span class="text-12-regular text-v2-text-text-muted">
                {name() === "" ? ctx.t("field.nameHint") : ctx.t("field.nameSaved", { name: name() })}
              </span>
            </label>
            <div class="flex items-center justify-between gap-3">
              <span class="text-12-regular text-v2-text-text-muted">
                {ctx.t(`connector.type.${draft().type}.help`)}
              </span>
              <ui.Select
                label={ctx.t("connector.type")}
                options={(["remote", "local"] as const).map((type) => ({
                  value: type,
                  label: ctx.t(`connector.type.${type}`),
                }))}
                value={draft().type}
                onChange={(type) => setDraft({ ...draft(), type })}
              />
            </div>
            <label class="flex flex-col gap-1">
              <span class="text-12-medium text-v2-text-text-base">{ctx.t(`connector.target.${draft().type}`)}</span>
              <ui.TextInput
                class="w-full!"
                size="large"
                type={draft().type === "remote" ? "url" : "text"}
                label={ctx.t(`connector.target.${draft().type}`)}
                placeholder={ctx.t(`connector.target.${draft().type}.placeholder`)}
                value={draft().target}
                onInput={(value) => setDraft({ ...draft(), target: value })}
                onSubmit={save}
              />
            </label>
            <Show when={problem()}>
              {(message) => <p class="text-12-regular text-v2-text-text-danger">{message()}</p>}
            </Show>
          </div>
        </ui.Dialog>
      )
    })

  const removeConnector = async (connector: Connector) => {
    const confirmed = await dialogs.confirm({
      title: ctx.t("connector.deleteConfirm", { name: connector.name }),
      confirm: ctx.t("delete"),
      danger: true,
    })

    if (confirmed) act((store) => store.deleteConnector(connector.name), ctx.t("deleted", { name: connector.name }))
  }

  const hookText = (hook: Hook) =>
    hook.event === "finished"
      ? `${ctx.t("hook.event.finished")}  ·  ${hook.command}`
      : `${ctx.t(`hook.event.${hook.event}`)} (${hook.tools})  ·  ${hook.command}`

  const openHook = (hook: Hook | undefined) =>
    dialogs.open((dialog) => {
      const [draft, setDraft] = createSignal<Hook>(hook ?? emptyHook)
      const [problem, setProblem] = createSignal<string>()
      const [busy, setBusy] = createSignal(false)

      const save = () => {
        setBusy(true)
        void run((store) => store.saveHook(draft()), ctx.t("saved", { name: draft().name.trim() })).then((failure) => {
          setBusy(false)
          setProblem(failure)
          if (!failure) dialog.close()
        })
      }

      return (
        <ui.Dialog
          size="large"
          title={ctx.t(hook ? "hook.edit" : "hook.new")}
          description={ctx.t("hook.help")}
          footer={
            <div class="flex items-center gap-2">
              <ui.Button variant="ghost" onClick={dialog.close}>
                {ctx.t("cancel")}
              </ui.Button>
              <ui.Button
                variant="contrast"
                busy={busy()}
                disabled={draft().name.trim() === "" || draft().command.trim() === ""}
                onClick={save}
              >
                {ctx.t("save")}
              </ui.Button>
            </div>
          }
        >
          <div class="flex flex-col gap-3">
            <label class="flex flex-col gap-1">
              <span class="text-12-medium text-v2-text-text-base">{ctx.t("field.name")}</span>
              <ui.TextInput
                class="w-full!"
                size="large"
                label={ctx.t("field.name")}
                placeholder={ctx.t("hook.namePlaceholder")}
                value={draft().name}
                onInput={(value) => setDraft({ ...draft(), name: value })}
              />
            </label>
            <div class="flex items-center justify-between gap-3">
              <span class="text-12-regular text-v2-text-text-muted">{ctx.t(`hook.event.${draft().event}.help`)}</span>
              <ui.Select
                label={ctx.t("hook.event")}
                options={events.map((event) => ({ value: event, label: ctx.t(`hook.event.${event}`) }))}
                value={draft().event}
                onChange={(event) => setDraft({ ...draft(), event })}
              />
            </div>
            <Show when={draft().event !== "finished"}>
              <label class="flex flex-col gap-1">
                <span class="text-12-medium text-v2-text-text-base">{ctx.t("hook.tools")}</span>
                <ui.TextInput
                  class="w-full!"
                  size="large"
                  label={ctx.t("hook.tools")}
                  placeholder="edit,write"
                  value={draft().tools}
                  onInput={(value) => setDraft({ ...draft(), tools: value })}
                />
                <span class="text-12-regular text-v2-text-text-muted">{ctx.t("hook.toolsHint")}</span>
              </label>
            </Show>
            <label class="flex flex-col gap-1">
              <span class="text-12-medium text-v2-text-text-base">{ctx.t("hook.command")}</span>
              <ui.TextInput
                class="w-full!"
                size="large"
                label={ctx.t("hook.command")}
                placeholder={ctx.t("hook.commandPlaceholder")}
                value={draft().command}
                onInput={(value) => setDraft({ ...draft(), command: value })}
              />
              <span class="text-12-regular text-v2-text-text-muted">{ctx.t("hook.commandHint")}</span>
            </label>
            <Show when={problem()}>
              {(message) => <p class="text-12-regular text-v2-text-text-danger">{message()}</p>}
            </Show>
          </div>
        </ui.Dialog>
      )
    })

  const removeHook = async (hook: Hook) => {
    const confirmed = await dialogs.confirm({
      title: ctx.t("deleteConfirm", { name: hook.name }),
      confirm: ctx.t("delete"),
      danger: true,
    })

    if (confirmed) act((store) => store.deleteHook(hook.id), ctx.t("deleted", { name: hook.name }))
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
        <div class="flex flex-wrap items-center gap-1" role="tablist" aria-label={ctx.t("title")}>
          <For each={tabs}>
            {(id) => (
              <ui.Button variant={tab() === id ? "neutral" : "ghost"} onClick={() => setTab(id)}>
                {ctx.t(`tab.${id}`)}
              </ui.Button>
            )}
          </For>
        </div>
        <Show when={state()?.problem}>
          {(message) => (
            <ui.SettingsSection>
              <ui.SettingsRow title={ctx.t("problem", { message: message() })} />
            </ui.SettingsSection>
          )}
        </Show>
        <Switch>
          <Match when={tab() === "skill"}>{docSections("skill")}</Match>
          <Match when={tab() === "agent"}>{docSections("agent")}</Match>
          <Match when={tab() === "command"}>{docSections("command")}</Match>
          <Match when={tab() === "connector"}>
            <ui.SettingsSection title={ctx.t("connector.mine")}>
              <ui.SettingsRow title={ctx.t("connector.new")} description={ctx.t("connector.help")}>
                <div class="flex items-center gap-2">
                  <ui.Button variant="ghost" onClick={props.onPlugins}>
                    {ctx.t("connector.ready")}
                  </ui.Button>
                  <ui.Button variant="neutral" icon="plus" onClick={openConnector}>
                    {ctx.t("new")}
                  </ui.Button>
                </div>
              </ui.SettingsRow>
              <For each={state()?.connectors ?? []}>
                {(connector) => (
                  <ui.SettingsRow title={connector.name} description={connector.target}>
                    <div class="flex items-center gap-2">
                      <span class="text-12-regular text-v2-text-text-muted">{connectorText(connector)}</span>
                      <Show when={needsSignIn(connector)}>
                        <ui.Button variant="neutral" onClick={props.onSignIn}>
                          {ctx.t("connector.signIn")}
                        </ui.Button>
                      </Show>
                      <ui.Button variant="ghost" onClick={() => void removeConnector(connector)}>
                        {ctx.t("delete")}
                      </ui.Button>
                    </div>
                  </ui.SettingsRow>
                )}
              </For>
            </ui.SettingsSection>
          </Match>
          <Match when={tab() === "instructions"}>
            <ui.SettingsSection
              title={ctx.t("instructions.title")}
              footer={
                <p class="text-12-regular text-v2-text-text-muted">
                  {ctx.t("instructions.file", { file: `${state()?.directory ?? ""}\\AGENTS.md` })}
                </p>
              }
            >
              <ui.SettingsRow title={ctx.t("instructions.row")} description={ctx.t("instructions.help")}>
                <ui.Button variant="contrast" disabled={!rulesDirty()} onClick={saveRules}>
                  {ctx.t("save")}
                </ui.Button>
              </ui.SettingsRow>
              <div class="px-4 pb-4">
                <Textarea
                  class={boxClass}
                  rows={12}
                  aria-label={ctx.t("instructions.row")}
                  placeholder={ctx.t("instructions.placeholder")}
                  value={rules()}
                  onInput={(event) => {
                    setRules(event.currentTarget.value)
                    setRulesDirty(true)
                  }}
                />
              </div>
            </ui.SettingsSection>
            <ui.SettingsSection title={ctx.t("style.title")}>
              <ui.SettingsRow title={ctx.t("style.row")} description={ctx.t(`style.${style()}.help`)}>
                <div class="flex items-center gap-2">
                  <ui.Select
                    label={ctx.t("style.row")}
                    options={styleIds.map((id) => ({ value: id, label: ctx.t(`style.${id}`) }))}
                    value={style()}
                    onChange={(id) => {
                      setStyle(id)
                      setStyleDirty(true)
                    }}
                  />
                  <ui.Button variant="contrast" disabled={!styleDirty()} onClick={applyStyle}>
                    {ctx.t("style.apply")}
                  </ui.Button>
                </div>
              </ui.SettingsRow>
              <Show when={style() === "custom"}>
                <div class="px-4 pb-4">
                  <Textarea
                    class={boxClass}
                    rows={5}
                    aria-label={ctx.t("style.custom")}
                    placeholder={ctx.t("style.customPlaceholder")}
                    value={styleText()}
                    onInput={(event) => {
                      setStyleText(event.currentTarget.value)
                      setStyleDirty(true)
                    }}
                  />
                </div>
              </Show>
            </ui.SettingsSection>
          </Match>
          <Match when={tab() === "hook"}>
            <ui.SettingsSection title={ctx.t("hook.mine")}>
              <ui.SettingsRow title={ctx.t("hook.new")} description={ctx.t("hook.help")}>
                <ui.Button variant="neutral" icon="plus" onClick={() => openHook(undefined)}>
                  {ctx.t("new")}
                </ui.Button>
              </ui.SettingsRow>
              <For each={state()?.hooks ?? []}>
                {(hook) => (
                  <ui.SettingsRow title={hook.name} description={hookText(hook)}>
                    <div class="flex items-center gap-2">
                      <ui.Switch
                        label={ctx.t("hook.enabled", { name: hook.name })}
                        hideLabel
                        checked={hook.enabled}
                        onChange={(enabled) => act((store) => store.saveHook({ ...hook, enabled }))}
                      />
                      <ui.Button variant="neutral" onClick={() => openHook(hook)}>
                        {ctx.t("edit")}
                      </ui.Button>
                      <ui.Button variant="ghost" onClick={() => void removeHook(hook)}>
                        {ctx.t("delete")}
                      </ui.Button>
                    </div>
                  </ui.SettingsRow>
                )}
              </For>
            </ui.SettingsSection>
          </Match>
          <Match when={tab() === "plugins"}>
            <ui.SettingsSection title={ctx.t("plugins.title")}>
              <ui.SettingsRow title={ctx.t("plugins.row")} description={ctx.t("plugins.help")}>
                <ui.Button variant="neutral" onClick={props.onPlugins}>
                  {ctx.t("plugins.open")}
                </ui.Button>
              </ui.SettingsRow>
            </ui.SettingsSection>
          </Match>
        </Switch>
        <p class="text-12-regular text-v2-text-text-muted">{ctx.t("folder", { folder: state()?.directory ?? "" })}</p>
      </Show>
    </ui.SettingsLayout>
  )
}
