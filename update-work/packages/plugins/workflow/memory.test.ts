import { expect, test } from "bun:test"
import { addMemory, forgetMemories, formatMemories, memoryPrompt, parseMemories } from "./memory"

test("memory file round trip", () => {
  const text = formatMemories(["Likes short answers", "Main project: hostel-life"])

  expect(parseMemories(text)).toEqual(["Likes short answers", "Main project: hostel-life"])
  expect(parseMemories(undefined)).toEqual([])
  expect(parseMemories("# Memory\r\n\r\n- one\r\nnot a bullet\r\n* two  \r\n")).toEqual(["one", "two"])
})

test("add skips empty and repeated memories", () => {
  expect(addMemory(["Uses Windows"], "  uses   windows ")).toEqual(["Uses Windows"])
  expect(addMemory(["Uses Windows"], "")).toEqual(["Uses Windows"])
  expect(addMemory(["Uses Windows"], "Talks in\nHinglish")).toEqual(["Uses Windows", "Talks in Hinglish"])
})

test("forget removes matching memories", () => {
  expect(forgetMemories(["Uses Windows", "Likes tea", "Windows 11"], "windows")).toEqual({
    left: ["Likes tea"],
    removed: 2,
  })
  expect(forgetMemories(["a"], " ")).toEqual({ left: ["a"], removed: 0 })
})

test("prompt only when there are memories", () => {
  expect(memoryPrompt([])).toBeUndefined()
  expect(memoryPrompt(["Likes tea"])).toContain("- Likes tea")
})
