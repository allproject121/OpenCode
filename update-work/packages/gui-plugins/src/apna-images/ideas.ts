/**
 * The cards of the Images page, as the Codex app shows "Trending" and "Templates". The ideas and their pictures are
 * this app's own: each picture in `ideas/<id>.webp` was made once from `sample` (or `prompt`) with a free AI Horde
 * model (tools/make-idea-pictures.ts).
 *
 * - An idea is a whole prompt: pressing it puts the prompt in the composer.
 * - A template is a style: pressing it sets the style, which is added to what the user writes (or to their photo).
 */
export type Idea = {
  readonly id: string
  readonly title: string
  readonly prompt: string
}

export type Template = {
  readonly id: string
  readonly title: string
  /** Added after the user's own words. */
  readonly style: string
  /** What the card's picture shows in this style. */
  readonly sample: string
}

export const ideas: readonly Idea[] = [
  {
    id: "chai-stall",
    title: "Chai stall at night",
    prompt: "A cozy roadside chai stall in India at night, warm string lights, steam rising from cups, cinematic illustration",
  },
  {
    id: "monsoon-street",
    title: "Monsoon street",
    prompt: "A rainy Mumbai street in the monsoon, reflections on the road, people with colourful umbrellas, watercolor",
  },
  {
    id: "dev-avatar",
    title: "Cartoon avatar",
    prompt: "A friendly 3D cartoon avatar of a young developer wearing headphones, soft light, pastel background",
  },
  {
    id: "retro-poster",
    title: "Retro movie poster",
    prompt: "A retro 1970s Indian movie poster, dramatic hero and heroine, bold colours, space for a title at the top",
  },
  {
    id: "pixel-hero",
    title: "Pixel game hero",
    prompt: "A pixel art game hero holding a glowing sword, 16-bit style, simple dark background",
  },
  {
    id: "app-icon",
    title: "App icon",
    prompt: "A modern rounded app icon for a notes app, minimal, soft gradient, one clean symbol in the centre",
  },
  {
    id: "festival-card",
    title: "Festival card",
    prompt: "A Diwali greeting card with glowing diyas and a rangoli, warm golden light, elegant",
  },
  {
    id: "space-city",
    title: "Future city",
    prompt: "A futuristic city floating in space, neon lights, wide shot, detailed digital art",
  },
  {
    id: "product-photo",
    title: "Product photo",
    prompt: "A clean studio product photo of a ceramic coffee mug on a white table, soft shadows, high detail",
  },
  {
    id: "mountain-sunrise",
    title: "Mountain sunrise",
    prompt: "Himalayan mountains at sunrise with colourful prayer flags in front, photorealistic, golden hour",
  },
]

export const templates: readonly Template[] = [
  {
    id: "anime",
    title: "Anime",
    style: "in anime style, clean line art, vibrant colours",
    sample: "A girl holding a cat in a garden, in anime style, clean line art, vibrant colours",
  },
  {
    id: "watercolor",
    title: "Watercolor",
    style: "as a soft watercolor painting on textured paper",
    sample: "A girl holding a cat in a garden, as a soft watercolor painting on textured paper",
  },
  {
    id: "pencil",
    title: "Pencil sketch",
    style: "as a detailed pencil sketch, black and white",
    sample: "A girl holding a cat in a garden, as a detailed pencil sketch, black and white",
  },
  {
    id: "cartoon-3d",
    title: "3D cartoon",
    style: "as a cute 3D cartoon render, soft lighting",
    sample: "A girl holding a cat in a garden, as a cute 3D cartoon render, soft lighting",
  },
  {
    id: "comic",
    title: "Comic book",
    style: "as a comic book panel, bold ink outlines, halftone dots",
    sample: "A girl holding a cat in a garden, as a comic book panel, bold ink outlines, halftone dots",
  },
  {
    id: "oil",
    title: "Oil painting",
    style: "as a classic oil painting, rich brush strokes",
    sample: "A girl holding a cat in a garden, as a classic oil painting, rich brush strokes",
  },
  {
    id: "sticker",
    title: "Sticker",
    style: "as a die-cut sticker with a thick white border, flat colours",
    sample: "A girl holding a cat, as a die-cut sticker with a thick white border, flat colours",
  },
  {
    id: "vintage",
    title: "Vintage photo",
    style: "as a 1980s vintage film photo, grain, faded colours",
    sample: "A girl holding a cat in a garden, as a 1980s vintage film photo, grain, faded colours",
  },
]

/** The picture size for each aspect choice, as AI Horde takes it (multiples of 64). */
export const aspects = [
  { id: "auto", label: "Auto", size: "512x512" },
  { id: "square", label: "1:1", size: "768x768" },
  { id: "portrait", label: "3:4", size: "576x768" },
  { id: "landscape", label: "4:3", size: "768x576" },
  { id: "wide", label: "16:9", size: "896x512" },
  { id: "tall", label: "9:16", size: "512x896" },
] as const

/** What is sent: the user's words with the chosen style after them. */
export function fullPrompt(words: string, template: Template | undefined) {
  const text = words.trim()

  if (!template) return text
  if (text === "") return `A picture, ${template.style}`

  return `${text}, ${template.style}`
}

/** A saved prompt without the template style this page added to it, so an edit keeps the subject, not the style. */
export function withoutStyle(prompt: string) {
  const found = templates.find((item) => prompt.endsWith(`, ${item.style}`))

  return found ? prompt.slice(0, -`, ${found.style}`.length) : prompt
}
