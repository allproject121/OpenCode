import { createMemo, createSignal, For, Match, Show, Switch, type Accessor } from "solid-js"
import { usePlugin, type IpcClient, type Live } from "@opencode/plugin/gui"
import { fits, formatBytes, suggestions, timeLeft } from "./catalog"
import type { Download, LocalModels } from "./contract"
import type definition from "./index"

type Client = IpcClient<typeof LocalModels.spec>

const libraryUrl = "https://ollama.com/library"

export default function LocalModelsPage(props: { models: Accessor<Live<Client>> }) {
  const ctx = usePlugin<typeof definition>()
  const ui = ctx.ui
  const toast = ctx.toast
  const dialogs = ctx.dialogs
  const system = ctx.system
  const desktop = ctx.desktop

  // The main side answers only in the desktop app; everything below renders from its pushed state.
  const client = () => {
    const live = props.models()

    return live.status === "active" ? live.value : undefined
  }

  const state = () => client()?.state()
  const [name, setName] = createSignal("")

  // Every button answers: a call that main rejects shows why instead of doing nothing.
  const act = (call: (models: Client) => Promise<unknown>) => {
    const models = client()

    if (!models) return
    void call(models).catch((error: unknown) =>
      toast.show({
        variant: "error",
        title: ctx.t("error.action", { message: error instanceof Error ? error.message : String(error) }),
      }),
    )
  }

  const installedNames = createMemo(() => new Set(state()?.installed.map((model) => model.name) ?? []))

  const activeNames = createMemo(
    () =>
      new Set(
        (state()?.downloads ?? [])
          .filter((item) => ["queued", "downloading", "retrying", "paused", "finishing"].includes(item.phase))
          .map((item) => item.name),
      ),
  )

  const download = (model: string) => {
    if (model.trim() === "") return
    act((models) => models.pull(model.trim()))
    setName("")
  }

  const remove = async (model: { name: string; size: number }) => {
    const confirmed = await dialogs.confirm({
      title: ctx.t("installed.deleteConfirm", { name: model.name, size: formatBytes(model.size) }),
      confirm: ctx.t("installed.delete"),
      danger: true,
    })

    if (confirmed) act((models) => models.remove(model.name))
  }

  const chooseFolder = async () => {
    const current = state()
    const [folder] = (await desktop?.pick({ directory: true, title: ctx.t("copy.folder") })) ?? []

    if (folder && current)
      act((models) => models.setCopy({ auto: current.copy.auto, folder, cloud: false, free: false }))
  }

  // Connecting is one press: from then on every model is kept on Cloud-SSD and taken off this machine, starting
  // with the ones already here.
  const connectCloud = () =>
    act((models) => models.setCopy({ auto: true, folder: "", cloud: true, free: true }).then(() => models.copyNow("*")))

  const engineText = () => {
    const current = state()

    if (!current || current.engine === "checking") return ctx.t("engine.checking")
    if (current.engine === "running") return ctx.t("engine.running", { version: current.version ?? "?" })
    if (current.engine === "installing")
      return ctx.t("engine.installing", {
        done: formatBytes(current.install?.completed ?? 0),
        total: current.install?.total ? formatBytes(current.install.total) : "?",
      })
    if (current.engine === "failed") return ctx.t("engine.failed", { message: current.message ?? "" })

    return ctx.t(`engine.${current.engine}`)
  }

  // The time left, worded by the page's language.
  const left = (item: Download) => {
    const time = timeLeft(item.total - item.completed, item.speed)

    return ctx.t(time.key, time.params)
  }

  const percent = (item: Download) => (item.total > 0 ? Math.floor((item.completed / item.total) * 100) : 0)

  // Cancel deletes what was downloaded so far, so it asks first.
  const cancel = async (item: Download) => {
    const confirmed =
      item.completed === 0 ||
      (await dialogs.confirm({
        title: ctx.t("downloads.cancelConfirm", { name: item.name, done: formatBytes(item.completed) }),
        confirm: ctx.t("downloads.cancel"),
        cancel: ctx.t("downloads.keep"),
        danger: true,
      }))

    if (confirmed) act((models) => models.cancel(item.name))
  }

  const downloadText = (item: Download) => {
    if (item.phase === "paused")
      return ctx.t("downloads.paused", {
        percent: percent(item),
        done: formatBytes(item.completed),
        total: formatBytes(item.total),
      })
    if (item.phase === "downloading")
      return item.total > 0
        ? ctx.t("downloads.downloading", {
            percent: percent(item),
            done: formatBytes(item.completed),
            total: formatBytes(item.total),
            speed: formatBytes(item.speed),
            left: left(item),
          })
        : ctx.t("downloads.starting")
    if (item.phase === "retrying")
      return ctx.t("downloads.retrying", { attempt: item.attempt, error: item.error ?? "" })
    if (item.phase === "failed") return ctx.t("downloads.failed", { error: item.error ?? "" })

    return ctx.t(`downloads.${item.phase}`)
  }

  return (
    <ui.SettingsLayout title={ctx.t("title")} description={ctx.t("description")}>
      <Show
        when={client()}
        fallback={
          <ui.SettingsSection>
            <ui.SettingsRow title={ctx.t("engine.unavailable")} />
          </ui.SettingsSection>
        }
      >
        <ui.SettingsSection title={ctx.t("engine.title")}>
          <ui.SettingsRow
            id="local-models"
            title={engineText()}
            description={
              <Show when={state()}>
                {(current) => (
                  <>
                    {ctx.t("engine.folder", { folder: current().modelsDir })}
                    <Show when={current().freeBytes !== null}>
                      {"  ·  "}
                      {ctx.t("engine.free", { free: formatBytes(current().freeBytes ?? 0) })}
                    </Show>
                  </>
                )}
              </Show>
            }
          >
            <div class="flex items-center gap-2">
              <Switch>
                <Match when={state()?.engine === "stopped" || state()?.engine === "failed"}>
                  <ui.Button onClick={() => act((models) => models.start())}>{ctx.t("engine.start")}</ui.Button>
                </Match>
                <Match when={state()?.engine === "missing" && state()?.canInstall}>
                  <ui.Button onClick={() => act((models) => models.install())}>{ctx.t("engine.install")}</ui.Button>
                </Match>
                <Match when={state()?.engine === "starting" || state()?.engine === "installing"}>
                  <ui.Loader size="small" />
                </Match>
              </Switch>
              <ui.Button variant="ghost" onClick={() => act((models) => models.refresh())}>
                {ctx.t("engine.refresh")}
              </ui.Button>
            </div>
          </ui.SettingsRow>
          <Show when={state()?.engine === "installing" && state()?.install}>
            {(install) => <Bar completed={install().completed} total={install().total} />}
          </Show>
          <Show when={state()?.engine === "missing" && !state()?.canInstall}>
            <ui.SettingsRow title={ctx.t("engine.cannotInstall")}>
              <ui.Button variant="ghost" onClick={() => void system.openExternal("https://ollama.com/download")}>
                ollama.com
              </ui.Button>
            </ui.SettingsRow>
          </Show>
        </ui.SettingsSection>

        <Show when={(state()?.downloads.length ?? 0) > 0}>
          <ui.SettingsSection title={ctx.t("downloads.title")}>
            <For each={state()?.downloads}>
              {(item) => (
                <>
                  <ui.SettingsRow title={item.name} description={downloadText(item)}>
                    <div class="flex items-center gap-2">
                      <Switch>
                        <Match when={["queued", "downloading", "retrying", "finishing"].includes(item.phase)}>
                          <ui.Button variant="neutral" onClick={() => act((models) => models.pause(item.name))}>
                            {ctx.t("downloads.pause")}
                          </ui.Button>
                        </Match>
                        <Match when={item.phase === "paused"}>
                          <ui.Button
                            variant="neutral"
                            icon="download"
                            onClick={() => act((models) => models.resume(item.name))}
                          >
                            {ctx.t("downloads.resume")}
                          </ui.Button>
                        </Match>
                        <Match when={item.phase === "failed"}>
                          <ui.Button variant="neutral" onClick={() => act((models) => models.resume(item.name))}>
                            {ctx.t("downloads.retry")}
                          </ui.Button>
                        </Match>
                      </Switch>
                      <Show
                        when={item.phase !== "done"}
                        fallback={
                          <ui.Button variant="ghost" onClick={() => act((models) => models.dismiss(item.name))}>
                            {ctx.t("downloads.dismiss")}
                          </ui.Button>
                        }
                      >
                        <ui.Button variant="ghost" onClick={() => void cancel(item)}>
                          {ctx.t("downloads.cancel")}
                        </ui.Button>
                      </Show>
                    </div>
                  </ui.SettingsRow>
                  <Show when={item.total > 0 && item.phase !== "done"}>
                    <Bar completed={item.completed} total={item.total} />
                  </Show>
                </>
              )}
            </For>
          </ui.SettingsSection>
        </Show>

        <ui.SettingsSection
          title={ctx.t("get.title")}
          footer={
            <ui.Button variant="ghost" onClick={() => void system.openExternal(libraryUrl)}>
              {ctx.t("get.library")}
            </ui.Button>
          }
        >
          <ui.SettingsRow id="local-models-get" title={ctx.t("get.name")} description={ctx.t("get.hint")}>
            <div class="flex items-center gap-2">
              <ui.TextInput
                class="w-44!"
                label={ctx.t("get.name")}
                placeholder={ctx.t("get.placeholder")}
                value={name()}
                onInput={setName}
                onSubmit={download}
              />
              <ui.Button disabled={name().trim() === ""} onClick={() => download(name())}>
                {ctx.t("get.download")}
              </ui.Button>
            </div>
          </ui.SettingsRow>
          <For each={suggestions}>
            {(item) => (
              <ui.SettingsRow
                title={item.name}
                description={
                  <>
                    {ctx.t(`use.${item.name}`)}
                    {"  ·  "}
                    {ctx.t("get.size", { size: `${item.gigabytes} GB` })}
                    <Show when={!fits(item.gigabytes, state()?.ramBytes ?? 0)}>
                      {"  ·  "}
                      {ctx.t("get.heavy")}
                    </Show>
                  </>
                }
              >
                <Switch>
                  <Match when={installedNames().has(item.name)}>
                    <span class="text-12-regular text-v2-text-text-muted">{ctx.t("get.installed")}</span>
                  </Match>
                  <Match when={activeNames().has(item.name)}>
                    <span class="text-12-regular text-v2-text-text-muted">{ctx.t("get.queued")}</span>
                  </Match>
                  <Match when={true}>
                    <ui.Button variant="neutral" icon="download" onClick={() => download(item.name)}>
                      {ctx.t("get.download")}
                    </ui.Button>
                  </Match>
                </Switch>
              </ui.SettingsRow>
            )}
          </For>
        </ui.SettingsSection>

        <ui.SettingsSection title={ctx.t("installed.title")}>
          <For each={state()?.installed} fallback={<ui.SettingsRow title={ctx.t("installed.empty")} />}>
            {(model) => (
              <ui.SettingsRow
                title={model.name}
                description={[formatBytes(model.size), model.params, model.quant].filter(Boolean).join("  ·  ")}
              >
                <div class="flex items-center gap-2">
                  <Show when={state()?.copy.folder !== ""}>
                    <Show
                      when={!model.copied}
                      fallback={
                        <span class="text-12-regular text-v2-text-text-muted">{ctx.t("installed.copied")}</span>
                      }
                    >
                      <ui.Button
                        variant="ghost"
                        icon="cloud-upload"
                        onClick={() => act((models) => models.copyNow(model.name))}
                      >
                        {ctx.t("installed.copy")}
                      </ui.Button>
                    </Show>
                  </Show>
                  <ui.Button variant="ghost" onClick={() => void remove(model)}>
                    {ctx.t("installed.delete")}
                  </ui.Button>
                </div>
              </ui.SettingsRow>
            )}
          </For>
        </ui.SettingsSection>

        <ui.SettingsSection
          title={ctx.t("copy.title")}
          footer={
            <Show when={state()?.copy.error}>
              {(message) => (
                <p class="text-text-danger-base" role="alert">
                  {ctx.t("copy.error", { message: message() })}
                </p>
              )}
            </Show>
          }
        >
          <ui.SettingsRow
            id="local-models-copy"
            title={ctx.t(state()?.copy.cloud ? "cloud.on" : "cloud.title")}
            description={
              state()?.copy.cloud
                ? state()?.copy.folder
                  ? ctx.t("cloud.folder", { folder: state()?.copy.folder ?? "" })
                  : ctx.t("cloud.missing")
                : ctx.t("cloud.off")
            }
          >
            <Show
              when={state()?.copy.cloud}
              fallback={
                <ui.Button icon="cloud-upload" onClick={connectCloud}>
                  {ctx.t("cloud.connect")}
                </ui.Button>
              }
            >
              <ui.Button
                variant="ghost"
                onClick={() => act((models) => models.setCopy({ auto: false, folder: "", cloud: false, free: false }))}
              >
                {ctx.t("cloud.disconnect")}
              </ui.Button>
            </Show>
          </ui.SettingsRow>
          <Show when={state()?.copy.cloud}>
            <ui.SettingsRow title={ctx.t("cloud.free")} description={ctx.t("cloud.free.description")}>
              <ui.Switch
                label={ctx.t("cloud.free")}
                hideLabel
                checked={state()?.copy.free ?? false}
                onChange={(free) => act((models) => models.setCopy({ auto: true, folder: "", cloud: true, free }))}
              />
            </ui.SettingsRow>
          </Show>
          <Show when={!state()?.copy.cloud}>
            <ui.SettingsRow
              title={ctx.t("copy.folder")}
              description={state()?.copy.folder || ctx.t("copy.folder.none")}
            >
              <div class="flex items-center gap-2">
                <ui.Button icon="folder" onClick={() => void chooseFolder()}>
                  {ctx.t("copy.choose")}
                </ui.Button>
                <Show when={state()?.copy.folder !== ""}>
                  <ui.Button
                    variant="ghost"
                    onClick={() =>
                      act((models) => models.setCopy({ auto: false, folder: "", cloud: false, free: false }))
                    }
                  >
                    {ctx.t("copy.clear")}
                  </ui.Button>
                </Show>
              </div>
            </ui.SettingsRow>
          </Show>
          <Show when={state()?.copy.folder !== ""}>
            <Show when={!state()?.copy.cloud}>
              <ui.SettingsRow title={ctx.t("copy.auto")} description={ctx.t("copy.auto.description")}>
                <ui.Switch
                  label={ctx.t("copy.auto")}
                  hideLabel
                  checked={state()?.copy.auto ?? false}
                  onChange={(auto) =>
                    act((models) =>
                      models.setCopy({ auto, folder: state()?.copy.folder ?? "", cloud: false, free: false }),
                    )
                  }
                />
              </ui.SettingsRow>
            </Show>
            <ui.SettingsRow
              title={ctx.t(state()?.copy.cloud ? "cloud.all" : "copy.all")}
              description={
                <Show when={state()?.copy.busy}>
                  {(busy) => (
                    // Inside a fragment so the line follows the numbers; a bare string here is worked out only once.
                    <>
                      {ctx.t("copy.busy", {
                        name: busy().name,
                        done: formatBytes(busy().completed),
                        total: formatBytes(busy().total),
                      })}
                    </>
                  )}
                </Show>
              }
            >
              <ui.Button disabled={!!state()?.copy.busy} onClick={() => act((models) => models.copyNow("*"))}>
                {ctx.t(state()?.copy.cloud ? "cloud.all.button" : "copy.all")}
              </ui.Button>
            </ui.SettingsRow>
            <Show when={state()?.copy.busy}>{(busy) => <Bar completed={busy().completed} total={busy().total} />}</Show>
            <For each={state()?.copy.restorable}>
              {(model) => (
                <ui.SettingsRow
                  title={model}
                  description={ctx.t(state()?.copy.cloud ? "cloud.restorable" : "copy.restorable")}
                >
                  <ui.Button
                    disabled={!!state()?.copy.busy}
                    icon="download"
                    onClick={() => act((models) => models.restore(model))}
                  >
                    {ctx.t(state()?.copy.cloud ? "cloud.restore" : "copy.restore")}
                  </ui.Button>
                </ui.SettingsRow>
              )}
            </For>
          </Show>
        </ui.SettingsSection>
      </Show>
    </ui.SettingsLayout>
  )
}

/** A thin progress line under a row. */
function Bar(props: { completed: number; total: number }) {
  const percent = () => (props.total > 0 ? Math.min(100, (props.completed / props.total) * 100) : 0)

  return (
    <div
      class="mx-4 mb-3 h-1.5 overflow-hidden rounded-full bg-v2-background-bg-layer-01"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(percent())}
    >
      <div class="h-full rounded-full bg-current text-v2-text-text-base" style={{ width: `${percent()}%` }} />
    </div>
  )
}
