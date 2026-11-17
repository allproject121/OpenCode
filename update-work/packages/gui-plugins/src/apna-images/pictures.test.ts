import { expect, test } from "bun:test"
import { extensionOf, mimeOf, rankModels } from "./pictures"

test("picture format from its first bytes", () => {
  const webp = Buffer.from("RIFF0000WEBPVP8 ", "latin1")

  expect(extensionOf(webp)).toBe(".webp")
  expect(mimeOf(Buffer.from([0x89, 0x50, 0x4e, 0x47]))).toBe("image/png")
  expect(extensionOf(Buffer.from([0xff, 0xd8, 0xff]))).toBe(".jpg")
})

test("image models: free preferred first, then other image models, no chat or video models", () => {
  const ranked = rankModels([
    { id: "auto/coding", owned_by: "combo" },
    { id: "aihorde/Zeipher", owned_by: "aihorde" },
    { id: "gemini/gemini-3.1-flash-image-preview", owned_by: "gemini" },
    { id: "aihorde/Dreamshaper", owned_by: "aihorde" },
    { id: "veo-free/veo", owned_by: "veoaifree-web" },
  ])

  expect(ranked).toEqual(["aihorde/Dreamshaper", "gemini/gemini-3.1-flash-image-preview", "aihorde/Zeipher"])
})
