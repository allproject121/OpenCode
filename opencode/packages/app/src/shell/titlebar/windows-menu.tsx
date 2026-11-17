import { makeEventListener } from "@solid-primitives/event-listener"
import { For, onMount } from "solid-js"
import { Menu } from "@opencode/ui/menu"

import { matchKeybind, parseKeybind, useCommand } from "@/shell/commands/command"
import {
  DESKTOP_MENU,
  desktopMenuKey,
  desktopMenuVisible,
  desktopMenuWithPlugins,
  type DesktopMenu,
  type DesktopMenuAction,
  type DesktopMenuEntry,
} from "@/shell/commands/desktop-menu"
import { usePlatform } from "@/runtime/platform/platform"
import { useLanguage } from "@/runtime/i18n/language"
import { useMenubarItems } from "@/runtime/plugin/menubar-items"

const accelerators = DESKTOP_MENU.flatMap((menu) => menu.items ?? []).flatMap((entry) => {
  if (entry.type === "separator" || !entry.action || !entry.accelerator?.windows) return []

  // Let the focused editor handle editing shortcuts without restoring stale menu focus.
  if (entry.action.startsWith("edit.")) return []

  return [{ action: entry.action, keybind: parseKeybind(entry.accelerator.windows) }]
})

// The menus shown as words. Go and Window stay reachable by their shortcuts and the arrows beside the bar.
const barMenus = new Set<string>(["file", "edit", "view", "help"])

export function windowsMenuAccelerator(event: KeyboardEvent) {
  return accelerators.find((entry) => matchKeybind(entry.keybind, event))?.action
}

export function WindowsAppMenu(props: {
  command: ReturnType<typeof useCommand>
  platform: ReturnType<typeof usePlatform>
}) {
  let lastFocused: HTMLElement | undefined
  const language = useLanguage()
  const menubar = useMenubarItems()

  const entries = (menu: DesktopMenu) =>
    desktopMenuWithPlugins(
      (menu.items ?? [])
        .filter((entry) => desktopMenuVisible(entry, "windows"))
        .map((entry) => ({ key: desktopMenuKey(entry), entry })),
      menubar?.items().filter((item) => item.menu === menu.id) ?? [],
    )

  const rememberFocus = () => {
    const active = document.activeElement
    lastFocused = active instanceof HTMLElement ? active : undefined
  }

  const commandDisabled = (id: string) => {
    const option = props.command.options.find((option) => option.id === id)

    if (!option) return true

    return option.disabled ?? false
  }

  const runCommand = (id: string) => {
    if (commandDisabled(id)) return
    props.command.trigger(id)
  }

  const runAction = (action: DesktopMenuAction) => {
    if (action.startsWith("edit.") && lastFocused?.isConnected) lastFocused.focus({ preventScroll: true })
    void props.platform.runDesktopMenuAction?.(action)
  }

  const runEntry = (entry: DesktopMenuEntry) => {
    if (entry.type === "separator") return

    if (entry.command) {
      runCommand(entry.command)

      return
    }

    if (entry.action) {
      runAction(entry.action)

      return
    }

    if (entry.href) props.platform.openExternal(entry.href)
  }

  onMount(() => {
    makeEventListener(
      document,
      "keydown",
      (event) => {
        if (event.defaultPrevented) return
        const action = windowsMenuAccelerator(event)

        if (!action) return
        event.preventDefault()
        event.stopPropagation()
        runAction(action)
      },
      { capture: true },
    )
  })

  return (
    // apna-opencode: each menu is its own word in the titlebar, as the Codex app shows File, Edit, View and Help,
    // in place of one button that holds them all.
    <div data-component="desktop-menu-bar" class="flex shrink-0 items-center gap-0.5 [app-region:no-drag]">
      <For each={DESKTOP_MENU.filter((menu) => desktopMenuVisible(menu, "windows") && barMenus.has(menu.id))}>
        {(menu) => (
          <Menu appearance="standard" gutter={4} modal={false} placement="bottom-start">
            <Menu.Trigger
              class="flex h-7 shrink-0 items-center rounded-[6px] px-2.5 text-[14px] font-[440] leading-[var(--line-height-base)] text-v2-text-text-muted transition-colors hover:bg-v2-overlay-simple-overlay-hover hover:text-v2-text-text-base data-[expanded]:bg-v2-overlay-simple-overlay-hover data-[expanded]:text-v2-text-text-base focus-visible:outline-none"
              onPointerDown={rememberFocus}
              onKeyDown={rememberFocus}
            >
              {language.t(menu.labelKey)}
            </Menu.Trigger>
            <Menu.Portal>
              <Menu.Content class="desktop-app-menu desktop-app-menu-sub">
                <For each={entries(menu)}>
                  {(item) => {
                    const entry = item.entry

                    // Static menu data: an early return keeps the union narrowing a Show fallback would lose.
                    if ("menu" in entry)
                      return (
                        <DesktopMenuItem
                          label={entry.label}
                          disabled={!entry.enabled}
                          onSelect={() => menubar?.run(entry.id)}
                        />
                      )

                    if (entry.type === "separator") return <Menu.Separator />

                    // Plain accessors rather than conditional JSX expressions, which compile to memos created
                    // where the menu reads the prop, possibly outside this owner.
                    const label = () => (entry.labelKey ? language.t(entry.labelKey) : "")

                    const keybind = () =>
                      entry.command ? props.command.keybind(entry.command) : entry.accelerator?.windows

                    const disabled = () => (entry.command ? commandDisabled(entry.command) : false)

                    return (
                      <DesktopMenuItem
                        label={label()}
                        keybind={keybind()}
                        disabled={disabled()}
                        onSelect={() => runEntry(entry)}
                      />
                    )
                  }}
                </For>
              </Menu.Content>
            </Menu.Portal>
          </Menu>
        )}
      </For>
    </div>
  )
}

function DesktopMenuItem(props: { label: string; keybind?: string; disabled?: boolean; onSelect: () => void }) {
  return (
    <Menu.Item disabled={props.disabled} onSelect={props.onSelect} shortcut={props.keybind}>
      {props.label}
    </Menu.Item>
  )
}
