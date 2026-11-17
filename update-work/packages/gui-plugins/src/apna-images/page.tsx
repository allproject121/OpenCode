import { createResource, createSignal, For, onCleanup, Show, type Accessor } from "solid-js"
import { Portal } from "solid-js/web"
import { usePlugin, type IpcClient, type Live } from "@opencode/plugin/gui"
import type { Images, Picture } from "./contract"
import { aspects, fullPrompt, ideas, templates, withoutStyle, type Template } from "./ideas"
import type definition from "./index"

type Client = IpcClient<typeof Images.spec>
type Tab = "trending" | "templates" | "mine"

const messageOf = (error: unknown) => (error instanceof Error ? error.message : String(error))

/** The bundled card picture of an idea or template. */
const cardPicture = (id: string) => new URL(`./ideas/${id}.webp`, import.meta.url).href

// apna-opencode: the Images page laid out as the Codex app's: a title, Trending / Templates / My images, a grid of
// picture cards, and a composer floating at the bottom ("+" photo, style, aspect, mic, send).
export default function ImagesPage(props: { images: Accessor<Live<Client>> }) {
  const ctx = usePlugin<typeof definition>()
  const toast = ctx.toast
  const desktop = ctx.desktop

  const client = () => {
    const live = props.images()

    return live.status === "active" ? live.value : undefined
  }
  const state = () => client()?.state()
  const pictures = () => state()?.pictures ?? []

  const [tab, setTab] = createSignal<Tab>("trending")
  const [words, setWords] = createSignal("")
  const [template, setTemplate] = createSignal<Template>()
  const [photo, setPhoto] = createSignal<{ file: string; url: string }>()
  const [aspect, setAspect] = createSignal<(typeof aspects)[number]["id"]>("auto")
  const [model, setModel] = createSignal<string>()
  const [open, setOpen] = createSignal<number>()
  const chosenModel = () => model() ?? state()?.models[0] ?? "aihorde/Dreamshaper"
  let input: HTMLTextAreaElement | undefined

  // Seconds since the picture started, for the waiting card.
  const [now, setNow] = createSignal(Date.now())
  const timer = setInterval(() => setNow(Date.now()), 1000)
  onCleanup(() => clearInterval(timer))

  const canSend = () => !state()?.making && (words().trim() !== "" || !!template() || !!photo())

  const send = () => {
    const tool = client()

    if (!tool || !canSend()) return
    const prompt = fullPrompt(words(), template()) || "the same picture, improved"
    setTab("mine")
    void tool
      .make({
        prompt,
        model: chosenModel(),
        size: aspects.find((item) => item.id === aspect())!.size,
        photo: photo()?.file ?? null,
      })
      .then(
        () => {
          setWords("")
          setPhoto(undefined)
          toast.show({ variant: "success", title: ctx.t("made") })
        },
        (error: unknown) =>
          toast.show({ variant: "error", title: ctx.t("failed"), description: messageOf(error), persistent: true }),
      )
  }

  const pickPhoto = async () => {
    const tool = client()
    const [file] = (await desktop?.pick({ title: ctx.t("photo.pick"), extensions: ["png", "jpg", "jpeg", "webp"] })) ?? []

    if (!tool || !file) return
    void tool.photo(file).then(
      (url) => setPhoto({ file, url }),
      (error: unknown) => toast.show({ variant: "error", title: ctx.t("photo.failed"), description: messageOf(error) }),
    )
  }

  const focusInput = () => input?.focus()

  const useIdea = (prompt: string) => {
    setWords(prompt)
    setTemplate(undefined)
    focusInput()
  }

  const useTemplate = (item: Template) => {
    setTemplate(item)
    focusInput()
  }

  return (
    <div class="apna-images" data-component="apna-images">
      <Show when={client()} fallback={<p class="apna-images-empty">{ctx.t("unavailable")}</p>}>
        <div class="apna-images-scroll">
          <h1 class="apna-images-title">{ctx.t("title")}</h1>
          <div class="apna-images-tabs" role="tablist" aria-label={ctx.t("title")}>
            <For each={["trending", "templates", "mine"] as const}>
              {(id) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab() === id}
                  class="apna-images-tab"
                  onClick={() => setTab(id)}
                >
                  {ctx.t(`tab.${id}`)}
                </button>
              )}
            </For>
          </div>

          <Show when={tab() === "trending"}>
            <div class="apna-images-grid">
              <For each={ideas}>
                {(idea) => (
                  <Card picture={cardPicture(idea.id)} title={idea.title} onClick={() => useIdea(idea.prompt)} />
                )}
              </For>
            </div>
          </Show>

          <Show when={tab() === "templates"}>
            <p class="apna-images-hint">{ctx.t("templates.hint")}</p>
            <div class="apna-images-grid">
              <For each={templates}>
                {(item) => (
                  <Card
                    picture={cardPicture(`template-${item.id}`)}
                    title={item.title}
                    selected={template()?.id === item.id}
                    onClick={() => useTemplate(item)}
                  />
                )}
              </For>
            </div>
          </Show>

          <Show when={tab() === "mine"}>
            <Show when={state()?.problem}>{(problem) => <p class="apna-images-problem">{problem()}</p>}</Show>
            <Show
              when={pictures().length > 0 || state()?.making}
              fallback={
                <div class="apna-images-empty">
                  <p class="apna-images-empty-title">{ctx.t("mine.empty")}</p>
                  <p>{ctx.t("mine.emptyHelp")}</p>
                </div>
              }
            >
              <div class="apna-images-grid">
                <Show when={state()?.making}>
                  {(making) => (
                    <div class="apna-images-card apna-images-making" aria-busy="true">
                      <div class="apna-images-shimmer" />
                      <span class="apna-images-card-title">
                        {ctx.t("making", {
                          seconds: String(Math.max(0, Math.round((now() - making().since) / 1000))),
                        })}
                      </span>
                    </div>
                  )}
                </Show>
                <For each={pictures()}>
                  {(picture, index) => (
                    <Saved picture={picture} read={(file) => client()!.read(file)} onClick={() => setOpen(index())} />
                  )}
                </For>
              </div>
            </Show>
            <p class="apna-images-hint">{ctx.t("folder", { folder: state()?.folder ?? "" })}</p>
          </Show>
          <div class="apna-images-spacer" aria-hidden="true" />
        </div>

        <div class="apna-images-composer-dock">
          <form
            class="apna-images-composer"
            onSubmit={(event) => {
              event.preventDefault()
              send()
            }}
          >
            <Show when={photo() || template()}>
              <div class="apna-images-chips">
                <Show when={photo()}>
                  {(current) => (
                    <span class="apna-images-chip">
                      <img src={current().url} alt="" />
                      {ctx.t("photo.chip")}
                      <button type="button" aria-label={ctx.t("remove")} onClick={() => setPhoto(undefined)}>
                        ✕
                      </button>
                    </span>
                  )}
                </Show>
                <Show when={template()}>
                  {(current) => (
                    <span class="apna-images-chip">
                      {ctx.t("style.chip", { name: current().title })}
                      <button type="button" aria-label={ctx.t("remove")} onClick={() => setTemplate(undefined)}>
                        ✕
                      </button>
                    </span>
                  )}
                </Show>
              </div>
            </Show>
            <div class="apna-images-composer-row">
              <button
                type="button"
                class="apna-images-icon"
                title={ctx.t("photo.add")}
                aria-label={ctx.t("photo.add")}
                onClick={() => void pickPhoto()}
              >
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4">
                  <path d="M8 3v10M3 8h10" stroke-linecap="round" />
                </svg>
              </button>
              <textarea
                ref={input}
                rows={1}
                class="apna-images-input"
                aria-label={ctx.t("composer.placeholder")}
                placeholder={ctx.t("composer.placeholder")}
                value={words()}
                onInput={(event) => setWords(event.currentTarget.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault()
                    send()
                  }
                }}
              />
              <select
                class="apna-images-select"
                aria-label={ctx.t("model")}
                title={ctx.t("model")}
                value={chosenModel()}
                onChange={(event) => setModel(event.currentTarget.value)}
              >
                <For each={state()?.models.length ? state()!.models : [chosenModel()]}>
                  {(id) => <option value={id}>{id.replace(/^aihorde\//, "")}</option>}
                </For>
              </select>
              <select
                class="apna-images-select"
                aria-label={ctx.t("aspect")}
                title={ctx.t("aspect")}
                value={aspect()}
                onChange={(event) => setAspect(event.currentTarget.value as (typeof aspects)[number]["id"])}
              >
                <For each={aspects}>{(item) => <option value={item.id}>{item.label}</option>}</For>
              </select>
              <button
                type="button"
                class="apna-images-icon"
                title={ctx.t("mic")}
                aria-label={ctx.t("mic")}
                onClick={() => {
                  focusInput()
                  setTimeout(() => ctx.commands.run("apna-tools.dictate"), 80)
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
                  <rect x="5.5" y="1.75" width="5" height="8" rx="2.5" />
                  <path d="M3.25 7.5a4.75 4.75 0 0 0 9.5 0M8 12.25v2" />
                </svg>
              </button>
              <button type="submit" class="apna-images-send" disabled={!canSend()} aria-label={ctx.t("make")} title={ctx.t("make")}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" />
                </svg>
              </button>
            </div>
          </form>
        </div>

        <Show when={open() !== undefined && pictures()[open()!]}>
          {(picture) => (
            <Portal>
              <Preview
                picture={picture()}
                read={(file) => client()!.read(file)}
                hasPrevious={open()! > 0}
                hasNext={open()! < pictures().length - 1}
                onPrevious={() => setOpen(open()! - 1)}
                onNext={() => setOpen(open()! + 1)}
                onClose={() => setOpen(undefined)}
                onRemix={() => {
                  setOpen(undefined)
                  useIdea(picture().prompt)
                }}
                onEdit={() => {
                  const current = picture()

                  setOpen(undefined)
                  void client()
                    ?.photo(current.file)
                    .then((url) => {
                      setPhoto({ file: current.file, url })
                      // The subject stays in the words, so the change keeps what the picture shows.
                      setWords(withoutStyle(current.prompt))
                      focusInput()
                    })
                }}
                onOpen={() => void desktop?.launch(picture().file)}
                onFolder={() => void desktop?.reveal(picture().file)}
                onDelete={() => {
                  const current = picture()

                  setOpen(undefined)
                  void client()?.remove(current.file)
                }}
              />
            </Portal>
          )}
        </Show>
      </Show>
    </div>
  )
}

function Card(props: { picture: string; title: string; selected?: boolean; onClick: () => void }) {
  // A card whose picture is not made yet shows a colour instead of a broken image.
  const [missing, setMissing] = createSignal(false)
  const hue = [...props.title].reduce((sum, letter) => sum + letter.charCodeAt(0), 0) % 360

  return (
    <button type="button" class="apna-images-card" data-selected={props.selected ? "" : undefined} onClick={props.onClick}>
      <Show
        when={!missing()}
        fallback={
          <div
            class="apna-images-placeholder"
            style={{ background: `linear-gradient(135deg, hsl(${hue} 55% 38%), hsl(${(hue + 60) % 360} 60% 22%))` }}
          />
        }
      >
        <img src={props.picture} alt="" loading="lazy" onError={() => setMissing(true)} />
      </Show>
      <span class="apna-images-card-title">{props.title}</span>
    </button>
  )
}

function Saved(props: { picture: Picture; read: (file: string) => Promise<string>; onClick: () => void }) {
  const [src] = createResource(() => props.picture.file, props.read)

  return (
    <button type="button" class="apna-images-card" title={props.picture.prompt} onClick={props.onClick}>
      <Show when={src()} fallback={<div class="apna-images-shimmer" />}>
        <img src={src()} alt={props.picture.prompt} />
      </Show>
    </button>
  )
}

function Preview(props: {
  picture: Picture
  read: (file: string) => Promise<string>
  hasPrevious: boolean
  hasNext: boolean
  onPrevious: () => void
  onNext: () => void
  onClose: () => void
  onRemix: () => void
  onEdit: () => void
  onOpen: () => void
  onFolder: () => void
  onDelete: () => void
}) {
  const ctx = usePlugin<typeof definition>()
  const [src] = createResource(() => props.picture.file, props.read)
  const keys = (event: KeyboardEvent) => {
    if (event.key === "Escape") props.onClose()
    if (event.key === "ArrowLeft" && props.hasPrevious) props.onPrevious()
    if (event.key === "ArrowRight" && props.hasNext) props.onNext()
  }

  document.addEventListener("keydown", keys)
  onCleanup(() => document.removeEventListener("keydown", keys))

  return (
    <div class="apna-images-preview" role="dialog" aria-modal="true" aria-label={ctx.t("preview")} onClick={props.onClose}>
      <div class="apna-images-preview-body" onClick={(event) => event.stopPropagation()}>
        <div class="apna-images-preview-picture">
          <Show when={props.hasPrevious}>
            <button type="button" class="apna-images-nav" data-side="left" aria-label={ctx.t("previous")} onClick={props.onPrevious}>
              ‹
            </button>
          </Show>
          <Show when={src()} fallback={<div class="apna-images-shimmer" />}>
            <img src={src()} alt={props.picture.prompt} />
          </Show>
          <Show when={props.hasNext}>
            <button type="button" class="apna-images-nav" data-side="right" aria-label={ctx.t("next")} onClick={props.onNext}>
              ›
            </button>
          </Show>
        </div>
        <aside class="apna-images-preview-side">
          <button type="button" class="apna-images-close" aria-label={ctx.t("close")} onClick={props.onClose}>
            ✕
          </button>
          <p class="apna-images-preview-label">{ctx.t("prompt")}</p>
          <p class="apna-images-preview-prompt">{props.picture.prompt}</p>
          <p class="apna-images-preview-meta">{props.picture.model}</p>
          <div class="apna-images-preview-actions">
            <button type="button" onClick={props.onRemix}>
              {ctx.t("remix")}
            </button>
            <button type="button" onClick={props.onEdit}>
              {ctx.t("edit")}
            </button>
            <button type="button" onClick={props.onOpen}>
              {ctx.t("open")}
            </button>
            <button type="button" onClick={props.onFolder}>
              {ctx.t("showFolder")}
            </button>
            <button type="button" data-danger onClick={props.onDelete}>
              {ctx.t("remove")}
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
