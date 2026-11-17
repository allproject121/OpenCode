import { useLanguage } from "@/runtime/i18n/language"
import { useCommand } from "@/shell/commands/command"

// apna-opencode: the mic beside Send, as the Codex app has it. It puts the cursor in the composer, then opens
// Windows voice typing (the apna-tools plugin presses Win+H), which writes what the user says into the box.

export function ComposerMicButton(props: { onFocus: () => void }) {
  const language = useLanguage()
  const command = useCommand()

  return (
    <button
      type="button"
      data-action="composer-mic"
      title={language.t("apna.composer.mic")}
      aria-label={language.t("apna.composer.mic")}
      class="me-1.5 flex size-8 shrink-0 items-center justify-center rounded-full text-v2-text-text-muted transition-colors hover:bg-v2-overlay-simple-overlay-hover hover:text-v2-text-text-base focus-visible:outline-none focus-visible:bg-v2-overlay-simple-overlay-hover"
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => {
        props.onFocus()
        // Give the box the focus before the voice typing bar opens over it.
        setTimeout(() => command.trigger("apna-tools.dictate"), 80)
      }}
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
        <rect x="5.5" y="1.75" width="5" height="8" rx="2.5" />
        <path d="M3.25 7.5a4.75 4.75 0 0 0 9.5 0M8 12.25v2" />
      </svg>
    </button>
  )
}
