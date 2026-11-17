import { Popover } from "@kobalte/core/popover"
import { useLocation } from "@solidjs/router"
import { createEffect, createMemo, on, Show } from "solid-js"
import { createStore } from "solid-js/store"
import { useLanguage } from "@/runtime/i18n/language"
import { SidebarInbox } from "./inbox"
import { createSessionInbox, inboxArchived } from "./inbox-model"

// apna-opencode: the bell beside the app's name. It opens the app's own inbox (Needs attention, Unread, Working,
// Recent) in a small panel, and its dot counts the chats that wait for the user: a question or permission, or a
// finished / failed run not yet read.
export function ApnaBell() {
  const language = useLanguage()
  const location = useLocation()
  const inbox = createSessionInbox()
  const [state, setState] = createStore({ open: false })

  const waiting = createMemo(
    () =>
      inbox
        .entries()
        .filter((entry) => !inboxArchived(entry) && ["approval", "input", "done", "failed"].includes(entry.status))
        .length,
  )

  const label = () => {
    const title = language.t("settings.tab.notifications")
    return waiting() ? `${title} (${waiting()})` : title
  }

  // Opening a chat from the panel moves the app there; the panel closes with it.
  createEffect(on(() => location.pathname + location.search, () => setState("open", false), { defer: true }))

  return (
    <Popover open={state.open} onOpenChange={(open) => setState("open", open)} placement="bottom-start" gutter={6}>
      <Popover.Trigger
        data-action="apna-bell"
        aria-label={label()}
        title={label()}
        class="relative flex size-9 shrink-0 items-center justify-center rounded-[6px] text-v2-icon-icon-muted outline-none hover:bg-v2-background-bg-layer-01 hover:text-v2-icon-icon-base focus-visible:ring-2 focus-visible:ring-v2-border-border-focus data-[expanded]:bg-v2-background-bg-layer-01"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M4 10.5V7a4 4 0 0 1 8 0v3.5l1 1.5H3z" />
          <path d="M6.6 13.5a1.5 1.5 0 0 0 2.8 0" />
        </svg>
        <Show when={waiting()}>
          <span
            aria-hidden="true"
            class="absolute end-[1px] top-[2px] flex h-[13px] min-w-[13px] items-center justify-center rounded-full bg-v2-state-fg-danger px-[3px] text-[9px] font-medium leading-none text-white"
          >
            {waiting() > 9 ? "9+" : waiting()}
          </span>
        </Show>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          aria-label={language.t("settings.tab.notifications")}
          dir={language.direction()}
          class="z-50 flex h-[min(70dvh,560px,var(--kb-popper-content-available-height))] w-[340px] flex-col overflow-hidden rounded-[10px] bg-v2-background-bg-base p-2 shadow-[var(--v2-elevation-floating)] outline-none data-[expanded]:animate-in data-[expanded]:fade-in data-[expanded]:slide-in-from-top-2 duration-150 ease-out motion-reduce:animate-none"
        >
          <div class="px-2 pb-2 pt-1 text-[13px] font-medium text-v2-text-text-base">
            {language.t("settings.tab.notifications")}
          </div>
          <div class="flex min-h-0 flex-1 flex-col">
            <SidebarInbox />
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover>
  )
}
