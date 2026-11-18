import { useLanguage } from "@/runtime/i18n/language"
import { useSettings } from "@/settings/model"

// apna-opencode: the access control at the start of the composer's row, where the Codex app shows its own. It is
// this app's "Auto-accept permissions" setting: "Full access" while tools run without asking, "Ask first" otherwise.
// A press switches between the two.

export function ComposerAccessChip() {
  const language = useLanguage()
  const settings = useSettings()
  const full = () => settings.permissions.autoApproveDefault()

  return (
    <button
      type="button"
      data-action="composer-access"
      aria-pressed={full()}
      class="flex h-7 shrink-0 items-center gap-1.5 rounded-[6px] px-2 text-[13px] font-[440] leading-[var(--line-height-compact)] transition-colors hover:bg-v2-overlay-simple-overlay-hover focus-visible:outline-none focus-visible:bg-v2-overlay-simple-overlay-hover"
      classList={{ "text-[#f0883e]": full(), "text-v2-text-text-muted": !full() }}
      onClick={() => settings.permissions.setAutoApproveDefault(!full())}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        stroke-width="1.4"
        stroke-linecap="round"
        aria-hidden="true"
      >
        <circle cx="8" cy="8" r="6" />
        <path d="M8 5v3.4" />
        <circle cx="8" cy="10.9" r="0.5" fill="currentColor" />
      </svg>
      {language.t(full() ? "apna.composer.access.full" : "apna.composer.access.ask")}
    </button>
  )
}
