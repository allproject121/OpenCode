import { Show } from "solid-js"
import { Icon } from "@opencode/ui/icon"
import { useLanguage } from "@/runtime/i18n/language"

// apna-opencode: the centre of a new chat, in the Codex app's arrangement: a mark, then one question that names
// the project. The mark is this build's own (a plain terminal glyph in a ring), not another product's logo.

/**
 * The mark and the question. With a project, its name is part of the question and opens the project picker; without
 * one, the question stands alone.
 */
export function ApnaHomeHeading(props: { project: string | undefined; onProject: () => void }) {
  const language = useLanguage()

  return (
    <div data-component="apna-home-heading" class="flex flex-col items-center gap-7 px-4 text-center">
      <span
        aria-hidden="true"
        class="flex size-14 items-center justify-center rounded-full border-2 border-v2-icon-icon-muted text-v2-icon-icon-muted"
      >
        <Icon name="terminal" size="large" />
      </span>
      <h1 class="text-[32px] font-[440] leading-[40px] tracking-[-0.4px] text-v2-text-text-base">
        <Show when={props.project} fallback={language.t("apna.home.question.plain")}>
          {(project) => (
            <>
              {language.t("apna.home.question.before")}{" "}
              <button
                type="button"
                data-action="apna-home-project"
                class="underline decoration-v2-text-text-faint decoration-dotted decoration-[1.5px] underline-offset-[6px] hover:decoration-v2-text-text-base"
                onClick={props.onProject}
              >
                {project()}
              </button>
              {language.t("apna.home.question.after")}
            </>
          )}
        </Show>
      </h1>
    </div>
  )
}
