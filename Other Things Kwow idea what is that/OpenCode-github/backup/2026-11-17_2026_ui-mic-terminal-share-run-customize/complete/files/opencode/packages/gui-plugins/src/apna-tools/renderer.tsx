import { For, Show } from "solid-js"
import { Command, Slot, type MountedSession, type Plugin } from "@opencode/plugin/gui"
import { Icon } from "@opencode/ui/icon"
import { IconButton } from "@opencode/ui/icon-button"
import { Menu } from "@opencode/ui/menu"
import { Tooltip } from "@opencode/ui/tooltip"
import { ApnaTools, type RunState } from "./contract"
import { chatMarkdown } from "./chat-text"
import type definition from "./index"

const messageOf = (error: unknown) => (error instanceof Error ? error.message : String(error))

const PlayIcon = () => (
  <svg data-slot="icon-svg" width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M6 4.5v11l9-5.5-9-5.5Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" />
  </svg>
)

const RunningIcon = () => (
  <svg data-slot="icon-svg" width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M6 4.5v11l9-5.5-9-5.5Z" fill="currentColor" />
    <circle cx="16" cy="4" r="2.5" fill="#22c55e" />
  </svg>
)

const setup: Plugin.Setup<typeof definition> = (ctx) => {
  const tools = ctx.use(ApnaTools)
  const toast = ctx.toast
  const system = ctx.system
  const commands = ctx.commands
  const links = ctx.links

  const client = () => {
    const live = tools()

    return live.status === "active" ? live.value : undefined
  }
  const runOf = (folder: string): RunState | undefined => client()?.state()?.runs[folder]
  const busy = (run: RunState | undefined) => !!run && ["installing", "starting", "running"].includes(run.status)

  const fail = (title: string) => (error: unknown) =>
    toast.show({ variant: "error", title, description: messageOf(error) })

  const startRun = (session: MountedSession) => {
    const tool = client()

    if (!tool) return fail(ctx.t("run.title"))(new Error(ctx.t("desktop.only")))
    void tool.run(session.directory).then(
      () => toast.show({ variant: "success", title: ctx.t("run.started"), description: session.directory }),
      fail(ctx.t("run.failed")),
    )
  }

  const openInApp = (session: MountedSession, url: string) => {
    if (!links.open({ href: url, origin: "apna-run", session })) system.openExternal(url)
  }

  const chat = async (session: MountedSession) => {
    const pages = [await session.server.client.message.list({ sessionID: session.id, limit: 200, order: "asc" })]

    while (pages.at(-1)?.cursor.next)
      pages.push(
        await session.server.client.message.list({
          sessionID: session.id,
          limit: 200,
          cursor: pages.at(-1)!.cursor.next ?? undefined,
        }),
      )
    const info = await session.server.client.session.get({ sessionID: session.id })

    return chatMarkdown(info.title ?? ctx.t("share.untitled"), pages.flatMap((page) => page.data as unknown[]))
  }

  const copyChat = (session: MountedSession) =>
    void chat(session)
      .then((text) => system.copy(text.markdown))
      .then(() => toast.show({ variant: "success", title: ctx.t("share.copied") }), fail(ctx.t("share.failed")))

  const saveChat = (session: MountedSession) => {
    const tool = client()

    if (!tool) return fail(ctx.t("share.failed"))(new Error(ctx.t("desktop.only")))
    void chat(session)
      .then((text) => tool.saveChat({ directory: session.directory, name: text.title, content: text.markdown }))
      .then((file) => {
        toast.show({ variant: "success", title: ctx.t("share.saved"), description: file })
        void ctx.desktop?.reveal(file)
      }, fail(ctx.t("share.failed")))
  }

  const headerButton = (label: string, icon: () => any, onClick: () => void) => (
    <Tooltip value={label} placement="bottom" class="shrink-0">
      <IconButton
        type="button"
        variant="ghost-muted"
        size="large"
        class="shrink-0"
        onMouseDown={(event) => event.preventDefault()}
        onClick={onClick}
        aria-label={label}
        icon={icon()}
      />
    </Tooltip>
  )

  ctx.add(Slot, {
    at: "session.header",
    order: 5,
    render: (input) => (
      <div class="flex items-center gap-0.5" data-component="apna-header-tools">
        {headerButton(ctx.t("terminal.toggle"), () => <Icon name="terminal" />, () => {
          commands.run("terminal.toggle")
        })}

        <Menu placement="bottom-end" gutter={4} modal={false}>
          <Tooltip value={ctx.t("run.title")} placement="bottom" class="shrink-0">
            <Menu.Trigger
              as={IconButton}
              type="button"
              variant="ghost-muted"
              size="large"
              class="shrink-0"
              aria-label={ctx.t("run.title")}
              icon={busy(runOf(input.session.directory)) ? <RunningIcon /> : <PlayIcon />}
            />
          </Tooltip>
          <Menu.Portal>
            <Menu.Content class="w-[340px] max-w-[calc(100vw-16px)]" aria-label={ctx.t("run.title")}>
              <RunMenu
                run={runOf(input.session.directory)}
                onStart={() => startRun(input.session)}
                onStop={() => void client()?.stop(input.session.directory)}
                onOpen={(url) => openInApp(input.session, url)}
                onOpenExternal={(url) => system.openExternal(url)}
                t={ctx.t}
              />
            </Menu.Content>
          </Menu.Portal>
        </Menu>

        <Show when={input.session.id}>
          <Menu placement="bottom-end" gutter={4} modal={false}>
            <Tooltip value={ctx.t("share.title")} placement="bottom" class="shrink-0">
              <Menu.Trigger
                as={IconButton}
                type="button"
                variant="ghost-muted"
                size="large"
                class="shrink-0"
                aria-label={ctx.t("share.title")}
                icon={<Icon name="outline-share" />}
              />
            </Tooltip>
            <Menu.Portal>
              <Menu.Content class="w-max" aria-label={ctx.t("share.title")}>
                <Menu.Item onSelect={() => copyChat(input.session)}>{ctx.t("share.copy")}</Menu.Item>
                <Menu.Item onSelect={() => saveChat(input.session)}>{ctx.t("share.save")}</Menu.Item>
                <Menu.Item onSelect={() => commands.run("session.export")}>{ctx.t("share.json")}</Menu.Item>
                <Menu.Separator />
                <Menu.Item onSelect={() => void ctx.desktop?.reveal(input.session.directory)}>
                  {ctx.t("share.folder")}
                </Menu.Item>
              </Menu.Content>
            </Menu.Portal>
          </Menu>
        </Show>
      </div>
    ),
  })

  // Voice typing: the composer's mic button runs this after focusing the text box.
  ctx.add(Command, () => ({
    id: "dictate",
    title: ctx.t("dictate.title"),
    group: ctx.t("group"),
    bind: "ctrl+shift+m",
    run: () => {
      const tool = client()

      if (!tool) {
        fail(ctx.t("dictate.title"))(new Error(ctx.t("desktop.only")))
        return
      }
      void tool.dictate().catch(fail(ctx.t("dictate.title")))
    },
  }))
}

function RunMenu(props: {
  run: RunState | undefined
  onStart: () => void
  onStop: () => void
  onOpen: (url: string) => void
  onOpenExternal: (url: string) => void
  t: (key: any, params?: Record<string, string>) => string
}) {
  const active = () => !!props.run && ["installing", "starting", "running"].includes(props.run.status)

  return (
    <>
      <div class="px-3 pt-2 pb-1 text-[13px] font-[500] text-v2-text-text-base">
        {props.run ? props.t(`run.status.${props.run.status}`) : props.t("run.idle")}
        <Show when={props.run?.command}>
          <span class="text-v2-text-text-muted"> · {props.run?.command}</span>
        </Show>
      </div>
      <Show when={props.run?.message}>
        <div class="px-3 pb-1 text-[12px] text-v2-text-text-muted">{props.run?.message}</div>
      </Show>
      <Show when={props.run?.url}>
        {(url) => (
          <>
            <Menu.Item onSelect={() => props.onOpen(url())}>{props.t("run.open", { url: url() })}</Menu.Item>
            <Menu.Item onSelect={() => props.onOpenExternal(url())}>{props.t("run.external")}</Menu.Item>
          </>
        )}
      </Show>
      <Show
        when={active()}
        fallback={<Menu.Item onSelect={props.onStart}>{props.t(props.run ? "run.again" : "run.start")}</Menu.Item>}
      >
        <Menu.Item onSelect={props.onStop}>{props.t("run.stop")}</Menu.Item>
      </Show>
      <Show when={(props.run?.log.length ?? 0) > 0}>
        <Menu.Separator />
        <pre class="mx-3 mb-2 max-h-[180px] overflow-auto whitespace-pre-wrap break-all text-[11px] leading-[1.35] text-v2-text-text-muted">
          <For each={props.run?.log.slice(-12)}>{(line) => <div>{line}</div>}</For>
        </pre>
      </Show>
    </>
  )
}

export default setup
