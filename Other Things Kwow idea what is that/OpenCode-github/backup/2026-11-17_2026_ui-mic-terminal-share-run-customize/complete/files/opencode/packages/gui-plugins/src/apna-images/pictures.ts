/** Picture formats by their first bytes. */
const kinds = [
  { test: (b: Uint8Array) => b[0] === 0x89 && b[1] === 0x50, ext: ".png", mime: "image/png" },
  { test: (b: Uint8Array) => b[0] === 0xff && b[1] === 0xd8, ext: ".jpg", mime: "image/jpeg" },
  {
    test: (b: Uint8Array) => b[0] === 0x52 && b[1] === 0x49 && b[8] === 0x57 && b[9] === 0x45,
    ext: ".webp",
    mime: "image/webp",
  },
  { test: (b: Uint8Array) => b[0] === 0x47 && b[1] === 0x49, ext: ".gif", mime: "image/gif" },
]

export const extensionOf = (bytes: Uint8Array) => kinds.find((kind) => kind.test(bytes))?.ext ?? ".png"
export const mimeOf = (bytes: Uint8Array) => kinds.find((kind) => kind.test(bytes))?.mime ?? "image/png"

/** Free, quick, general-purpose AI Horde models that make good first picks, best first. */
const preferred = ["aihorde/Dreamshaper", "aihorde/Deliberate", "aihorde/AlbedoBase XL (SDXL)", "aihorde/Juggernaut XL"]

/**
 * The router's image models, best first: the preferred free ones, then other picture models from paid providers
 * (Gemini image models), then the rest of AI Horde in their order. Video models are left out.
 */
export function rankModels(models: readonly { id: string; owned_by?: string }[]): string[] {
  const ids = models.map((model) => model.id)
  const horde = models.filter((model) => model.owned_by === "aihorde").map((model) => model.id)
  const other = ids.filter((id) => /image/i.test(id) && !id.startsWith("aihorde/"))
  const first = preferred.filter((id) => horde.includes(id))

  return [...first, ...other, ...horde.filter((id) => !first.includes(id))]
}
