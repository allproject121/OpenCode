import { describe, expect, test } from "bun:test"
import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { hasStored, listStored, restoreModel, storeModel } from "./engine"
import { folderShelf } from "./shelf"

// A small made-up model in the engine's layout: a manifest naming two blobs, one shared with another model.
const layers = { config: "c".repeat(64), weights: "a".repeat(64) }
const content = { config: '{"model_format":"gguf"}', weights: "weights-bytes" }

async function makeModels(root: string) {
  const models = path.join(root, "models")
  const manifest = {
    schemaVersion: 2,
    config: { digest: `sha256:${layers.config}`, size: content.config.length },
    layers: [{ digest: `sha256:${layers.weights}`, size: content.weights.length }],
  }

  await mkdir(path.join(models, "blobs"), { recursive: true })
  await mkdir(path.join(models, "manifests", "registry.ollama.ai", "library", "tiny"), { recursive: true })
  await writeFile(path.join(models, "blobs", `sha256-${layers.config}`), content.config)
  await writeFile(path.join(models, "blobs", `sha256-${layers.weights}`), content.weights)
  await writeFile(
    path.join(models, "manifests", "registry.ollama.ai", "library", "tiny", "latest"),
    JSON.stringify(manifest),
  )

  return models
}

describe("keeping a model on a shelf", () => {
  test("puts every file, sees the copy complete, and brings it back whole into an empty engine folder", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "engine-test-"))
    const signal = new AbortController().signal

    try {
      const models = await makeModels(root)
      const shelf = folderShelf(path.join(root, "shelf"))

      expect(await hasStored("tiny", models, shelf)).toBe(false)
      const seen = { bytes: 0, total: 0 }

      await storeModel("tiny", models, shelf, (bytes, total) => Object.assign(seen, { bytes, total }), signal)
      expect(seen).toEqual({ bytes: 36, total: 36 })
      expect(await hasStored("tiny", models, shelf)).toBe(true)
      expect(await listStored(shelf)).toEqual(["tiny:latest"])
      expect((await readdir(path.join(root, "shelf"))).toSorted()).toEqual(
        [
          `manifest+registry.ollama.ai+library+tiny+latest.json`,
          `sha256-${layers.config}`,
          `sha256-${layers.weights}`,
        ].toSorted(),
      )

      const fresh = path.join(root, "fresh")

      await restoreModel("tiny", fresh, shelf, () => undefined, signal)
      expect(await readFile(path.join(fresh, "blobs", `sha256-${layers.weights}`), "utf8")).toBe(content.weights)
      expect(
        await readFile(path.join(fresh, "manifests", "registry.ollama.ai", "library", "tiny", "latest"), "utf8"),
      ).toBe(await readFile(path.join(models, "manifests", "registry.ollama.ai", "library", "tiny", "latest"), "utf8"))
      // Nothing half-done is left behind in the engine's folder.
      expect((await readdir(path.join(fresh, "blobs"))).some((file) => file.endsWith(".part"))).toBe(false)
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test("a copy missing its manifest or a blob is not complete", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "engine-test-"))
    const signal = new AbortController().signal

    try {
      const models = await makeModels(root)
      const shelfFolder = path.join(root, "shelf")
      const shelf = folderShelf(shelfFolder)

      await storeModel("tiny", models, shelf, () => undefined, signal)
      await rm(path.join(shelfFolder, `sha256-${layers.weights}`))
      expect(await hasStored("tiny", models, shelf)).toBe(false)
      expect(restoreModel("tiny", path.join(root, "fresh"), shelf, () => undefined, signal)).rejects.toThrow()
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })
})
