import { For, Show, type JSX } from "solid-js"
import { Tooltip } from "@opencode/ui/tooltip"
import { useLanguage } from "@/runtime/i18n/language"
import { useCommand } from "@/shell/commands/command"

// apna-opencode: the narrow strip of icons at the window's left edge, placed and sized as the Codex app places its
// own. Every icon runs one of this app's commands. The glyphs are drawn here (plain line shapes); none is taken
// from another product.

type RailItem = {
  readonly key: "home" | "ask" | "history" | "models" | "router" | "customize" | "more" | "review"
  /** The command the icon runs. */
  readonly command: string
  /** Shows a thin rule above the icon, as before the last group. */
  readonly divided?: boolean
  readonly glyph: () => JSX.Element
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
} as const

const Glyph = (props: { children: JSX.Element }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
    {props.children}
  </svg>
)

const items: readonly RailItem[] = [
  {
    key: "home",
    command: "tab.new",
    glyph: () => (
      <Glyph>
        <path d="M4 11.2 12 4l8 7.2V19a1.5 1.5 0 0 1-1.5 1.5h-3.2v-5.8h-6.6v5.8H5.5A1.5 1.5 0 0 1 4 19z" />
      </Glyph>
    ),
  },
  {
    key: "ask",
    command: "sessions.search",
    glyph: () => (
      <Glyph>
        <path d="M9 8.5h8.5A2.5 2.5 0 0 1 20 11v4a2.5 2.5 0 0 1-2.5 2.5H16l-2.5 2.2v-2.2H9A2.5 2.5 0 0 1 6.5 15v-4A2.5 2.5 0 0 1 9 8.5z" />
        <path d="M6.5 13.5H6A2.5 2.5 0 0 1 3.5 11V7A2.5 2.5 0 0 1 6 4.5h7A2.5 2.5 0 0 1 15.5 7v1.5" />
      </Glyph>
    ),
  },
  {
    key: "history",
    command: "home.toggle",
    glyph: () => (
      <Glyph>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 7.5V12l3 2" />
      </Glyph>
    ),
  },
  {
    key: "models",
    command: "local-models.open",
    glyph: () => (
      <Glyph>
        <path d="M5 4.5h3v15H5zM10.5 4.5h3v15h-3z" />
        <path d="m15.6 6 2.9-.8 3.6 13.4-2.9.8z" />
      </Glyph>
    ),
  },
  {
    key: "router",
    command: "router.open",
    glyph: () => (
      <Glyph>
        <circle cx="12" cy="12" r="3.2" />
        <path d="M15.2 9v4.2a2.3 2.3 0 0 0 4.6 0V12a7.8 7.8 0 1 0-3.2 6.3" />
      </Glyph>
    ),
  },
  {
    key: "customize",
    command: "customize.open",
    glyph: () => (
      <Glyph>
        <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
        <circle cx="15" cy="7" r="2" />
        <circle cx="9" cy="17" r="2" />
      </Glyph>
    ),
  },
  {
    key: "more",
    command: "command.palette",
    glyph: () => (
      <Glyph>
        <circle cx="6" cy="12" r="0.9" fill="currentColor" />
        <circle cx="12" cy="12" r="0.9" fill="currentColor" />
        <circle cx="18" cy="12" r="0.9" fill="currentColor" />
      </Glyph>
    ),
  },
  {
    key: "review",
    command: "review.open",
    divided: true,
    glyph: () => (
      <Glyph>
        <circle cx="7" cy="6.5" r="2" />
        <circle cx="7" cy="17.5" r="2" />
        <circle cx="17" cy="17.5" r="2" />
        <path d="M7 8.5v7M17 15.5V11a3 3 0 0 0-3-3h-2.2" />
        <path d="m13.6 5.6-2.2 2.4 2.2 2.4" />
      </Glyph>
    ),
  },
]

const BUTTON =
  "flex size-10 items-center justify-center rounded-[10px] text-v2-icon-icon-muted transition-colors hover:bg-v2-overlay-simple-overlay-hover hover:text-v2-icon-icon-base focus-visible:outline-none focus-visible:bg-v2-overlay-simple-overlay-hover"

export function ApnaRail() {
  const language = useLanguage()
  const command = useCommand()

  // A command that is not registered (a plugin that is off, a page that is not open) leaves its icon dimmed
  // rather than doing nothing when pressed.
  const available = (id: string) => {
    const option = command.options.find((item) => item.id === id)

    return !!option && !option.disabled
  }

  return (
    <nav
      data-component="apna-rail"
      aria-label={language.t("apna.rail.label")}
      class="flex h-full w-14 shrink-0 flex-col items-center gap-1.5 pb-3 pt-1.5 [app-region:no-drag]"
    >
      <For each={items}>
        {(item) => (
          <>
            <Show when={item.divided}>
              <div role="separator" class="my-1.5 h-px w-7 shrink-0 bg-v2-border-border-base" />
            </Show>
            <Tooltip placement="right" value={language.t(`apna.rail.${item.key}`)}>
              <button
                type="button"
                data-action={`apna-rail-${item.key}`}
                class={BUTTON}
                classList={{ "opacity-40": !available(item.command) }}
                aria-label={language.t(`apna.rail.${item.key}`)}
                aria-disabled={!available(item.command)}
                onClick={() => available(item.command) && command.trigger(item.command)}
              >
                {item.glyph()}
              </button>
            </Tooltip>
          </>
        )}
      </For>
      <div class="flex-1" />
      <Tooltip placement="right" value={language.t("apna.rail.settings")}>
        <button
          type="button"
          data-action="apna-rail-settings"
          class="flex size-8 items-center justify-center rounded-full bg-v2-background-bg-layer-02 text-[11px] font-medium leading-[var(--line-height-compact)] text-v2-text-text-muted transition-colors hover:text-v2-text-text-base"
          aria-label={language.t("apna.rail.settings")}
          onClick={() => command.trigger("settings.open")}
        >
          {language.t("apna.rail.initials")}
        </button>
      </Tooltip>
    </nav>
  )
}
