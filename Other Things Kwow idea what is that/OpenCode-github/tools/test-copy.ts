// Live check of the copy / restore logic against the real Ollama on this PC, with a small model and a temp folder
// on C: (never the cloud drive). Run:  bun run test-copy.ts
// Steps: copy all-minilm to the flat folder -> delete it from Ollama -> restore it -> Ollama lists it again.
import { mkdtemp, readdir, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import {
  engineFetch,
  hasStored,
  listStored,
  modelsDirectory,
  restoreModel,
  storeModel,
} from "../opencode/packages/gui-plugins/src/local-models/engine"
import { folderShelf } from "../opencode/packages/gui-plugins/src/local-models/shelf"

const name = "all-minilm:latest"
const models = modelsDirectory()
const folder = await mkdtemp(path.join(tmpdir(), "ollama-copy-test-"))
const shelf = folderShelf(folder)
const signal = new AbortController().signal
const results: string[] = []
const check = (label: string, ok: boolean) => results.push(`${ok ? "PASS" : "FAIL"}  ${label}`)

const installed = async () => {
  const response = await engineFetch("/api/tags", { timeoutMs: 10_000 })
  const body = (await response.json()) as { models: { name: string }[] }

  return body.models.map((model) => model.name)
}

try {
  check("model is installed before the test", (await installed()).includes(name))
  check("copy folder starts without the model", !(await hasStored(name, models, shelf)))

  const seen = { last: 0, total: 0 }

  await storeModel(name, models, shelf, (completed, total) => Object.assign(seen, { last: completed, total }), signal)
  const files = await readdir(folder)

  check(`copy wrote ${files.length} files into one flat folder (no sub-folders)`, files.length >= 2)
  check("progress reached the full size", seen.total > 0 && seen.last === seen.total)
  check("hasStored says the copy is complete", await hasStored(name, models, shelf))
  check("no .part files are left", !files.some((file) => file.endsWith(".part")))
  check("listStored finds the model name", (await listStored(shelf)).includes(name))

  const removed = await engineFetch("/api/delete", { method: "DELETE", body: { model: name }, timeoutMs: 30_000 })

  check("Ollama deleted the model", removed.ok && !(await installed()).includes(name))

  await restoreModel(name, models, shelf, () => undefined, signal)
  check("Ollama lists the model again after restore", (await installed()).includes(name))

  const embed = await engineFetch("/api/embed", { method: "POST", body: { model: name, input: "namaste" }, timeoutMs: 120_000 })
  const vector = (await embed.json()) as { embeddings?: number[][] }

  check("the restored model really runs (returns an embedding)", (vector.embeddings?.[0]?.length ?? 0) > 0)
} finally {
  await rm(folder, { recursive: true, force: true })
}

console.log(results.join("\n"))
process.exit(results.some((line) => line.startsWith("FAIL")) ? 1 : 0)
