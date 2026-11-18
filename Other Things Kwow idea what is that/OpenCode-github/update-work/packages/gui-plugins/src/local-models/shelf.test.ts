import { describe, expect, test } from "bun:test"
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { folderShelf, parseLink } from "./shelf"

describe("the Cloud-SSD link file", () => {
  test("reads the address, key and process of the Cloud-SSD app", () => {
    const text = JSON.stringify({ version: 1, url: "http://127.0.0.1:8090/", key: "k", pid: 7, writtenAt: "x" })

    expect(parseLink(text)).toEqual({ url: "http://127.0.0.1:8090", key: "k", pid: 7 })
    expect(parseLink("\uFEFF" + text)).toEqual({ url: "http://127.0.0.1:8090", key: "k", pid: 7 })
  })

  test("refuses any address off this machine, and broken or empty files", () => {
    const at = (url: string) => JSON.stringify({ url, key: "k", pid: 7 })

    expect(parseLink(at("http://192.168.1.5:8090"))).toBeUndefined()
    expect(parseLink(at("http://localhost.evil.com:8090"))).toBeUndefined()
    expect(parseLink(at("https://127.0.0.1:8090"))).toBeUndefined()
    expect(parseLink(JSON.stringify({ url: "http://127.0.0.1:8090", key: "", pid: 7 }))).toBeUndefined()
    expect(parseLink("")).toBeUndefined()
    expect(parseLink("{")).toBeUndefined()
  })
})

describe("a folder shelf", () => {
  test("puts, lists and gets files by name, and leaves out unfinished ones", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "shelf-test-"))
    const signal = new AbortController().signal

    try {
      const shelf = folderShelf(path.join(root, "shelf"))
      const source = path.join(root, "a.bin")

      await writeFile(source, "hello")
      await shelf.put(source, "sha256-aa", () => undefined, signal)
      await writeFile(path.join(root, "shelf", "sha256-bb.part"), "x")
      expect(await shelf.list()).toEqual([{ name: "sha256-aa", size: 5 }])

      await shelf.get("sha256-aa", path.join(root, "back", "b.bin"), () => undefined, signal)
      expect(await readFile(path.join(root, "back", "b.bin"), "utf8")).toBe("hello")
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })
})
