import { describe, expect, test } from "bun:test"
import {
  blobFile,
  emptyProgress,
  foldPull,
  manifestDigests,
  manifestSegments,
  modelName,
  parsePullLine,
  pullTotals,
  speedOf,
  splitLines,
  storedManifestFile,
  storedModelName,
} from "./progress"

describe("pull progress", () => {
  test("adds layers and never moves a layer backwards", () => {
    const first = foldPull(emptyProgress, { status: "pulling a", digest: "sha256:a", total: 100, completed: 40 })
    const second = foldPull(first, { status: "pulling b", digest: "sha256:b", total: 50, completed: 10 })
    const retried = foldPull(second, { status: "pulling a", digest: "sha256:a", total: 100, completed: 5 })

    expect(pullTotals(second)).toEqual({ completed: 50, total: 150 })
    expect(pullTotals(retried)).toEqual({ completed: 50, total: 150 })
    expect(retried.status).toBe("pulling a")
  })

  test("keeps the status of lines without a layer", () => {
    expect(foldPull(emptyProgress, { status: "verifying sha256 digest" })).toEqual({
      layers: {},
      status: "verifying sha256 digest",
    })
  })

  test("splits streamed text at line ends", () => {
    expect(splitLines('{"a":1}\n{"b":2}\n{"c"')).toEqual({ lines: ['{"a":1}', '{"b":2}'], rest: '{"c"' })
  })

  test("skips lines that are not JSON objects", () => {
    expect(parsePullLine("not json")).toBeUndefined()
    expect(parsePullLine("42")).toBeUndefined()
    expect(parsePullLine('{"status":"success"}')?.status).toBe("success")
    expect(parsePullLine('{"error":"pull model manifest: file does not exist"}')?.error).toContain("manifest")
  })

  test("measures speed across samples", () => {
    expect(speedOf([{ at: 0, bytes: 0 }])).toBe(0)
    expect(
      speedOf([
        { at: 1000, bytes: 100 },
        { at: 3000, bytes: 2100 },
      ]),
    ).toBe(1000)
  })
})

describe("model files", () => {
  test("maps names to manifest paths and back", () => {
    expect(manifestSegments("qwen2.5:7b")).toEqual(["registry.ollama.ai", "library", "qwen2.5", "7b"])
    expect(manifestSegments("llama3.2")).toEqual(["registry.ollama.ai", "library", "llama3.2", "latest"])
    expect(manifestSegments("someone/model:q4")).toEqual(["registry.ollama.ai", "someone", "model", "q4"])
    expect(manifestSegments("hf.co/user/repo:Q4_K_M")).toEqual(["hf.co", "user", "repo", "Q4_K_M"])
    expect(modelName(["registry.ollama.ai", "library", "qwen2.5", "7b"])).toBe("qwen2.5:7b")
    expect(modelName(["registry.ollama.ai", "someone", "model", "q4"])).toBe("someone/model:q4")
    expect(modelName(["hf.co", "user", "repo", "Q4_K_M"])).toBe("hf.co/user/repo:Q4_K_M")
  })

  test("rejects names that would leave the manifests folder", () => {
    expect(manifestSegments("../x:1")).toBeUndefined()
    expect(manifestSegments("a/b/c/d:1")).toBeUndefined()
    expect(manifestSegments("model:")).toBeUndefined()
    expect(manifestSegments("a\\b:1")).toBeUndefined()
  })

  test("names blob files and rejects other digests", () => {
    const hex = "a".repeat(64)

    expect(blobFile(`sha256:${hex}`)).toBe(`sha256-${hex}`)
    expect(blobFile("sha256:../../x")).toBeUndefined()
  })

  test("lists the files of a manifest", () => {
    expect(
      manifestDigests({
        config: { digest: "sha256:c", size: 5 },
        layers: [{ digest: "sha256:l", size: 9 }, { nope: true }],
      }),
    ).toEqual([
      { digest: "sha256:c", size: 5 },
      { digest: "sha256:l", size: 9 },
    ])
    expect(manifestDigests("x")).toEqual([])
  })

  test("names copy-folder manifests flat and reads them back", () => {
    const file = storedManifestFile(["registry.ollama.ai", "library", "qwen2.5", "7b"])

    expect(file).toBe("manifest+registry.ollama.ai+library+qwen2.5+7b.json")
    expect(storedModelName(file)).toBe("qwen2.5:7b")
    expect(storedModelName("sha256-abc")).toBeUndefined()
    expect(storedModelName("manifest+a+b.json")).toBeUndefined()
    expect(manifestSegments("a+b:1")).toBeUndefined()
  })
})
