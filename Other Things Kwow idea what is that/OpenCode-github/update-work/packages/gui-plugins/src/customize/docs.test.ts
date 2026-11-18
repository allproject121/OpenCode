import { describe, expect, test } from "bun:test"
import path from "node:path"
import { docFile, formatDoc, parseDoc, splitCommand, toName, validName, type Doc } from "./docs"

const skill: Doc = {
  kind: "skill",
  name: "release-notes",
  description: 'Use when the user asks for "release notes": short, one line each.',
  body: "1. Read the commits.\n2. Write one line per change.",
  auto: true,
  mode: "subagent",
}

describe("names", () => {
  test("accepts small letters, digits and dashes only", () => {
    expect(validName("release-notes")).toBe(true)
    expect(validName("Release Notes")).toBe(false)
    expect(validName("-x")).toBe(false)
    expect(validName("../x")).toBe(false)
    expect(validName("")).toBe(false)
  })

  test("makes a name from a typed title", () => {
    expect(toName("  My Deploy Steps! ")).toBe("my-deploy-steps")
    expect(validName(toName("Kaam: jaanch (2)"))).toBe(true)
    expect(toName("!!!")).toBe("")
  })
})

describe("files", () => {
  test("puts each kind where OpenCode reads it", () => {
    expect(docFile("skill", "C:/cfg", "a")).toBe(path.join("C:/cfg", "skills", "a", "SKILL.md"))
    expect(docFile("command", "C:/cfg", "a")).toBe(path.join("C:/cfg", "commands", "a.md"))
    expect(docFile("agent", "C:/cfg", "a")).toBe(path.join("C:/cfg", "agents", "a.md"))
  })

  test("a skill survives writing and reading, quotes and colons included", () => {
    expect(parseDoc("skill", skill.name, formatDoc(skill))).toEqual(skill)
    expect(formatDoc(skill)).not.toContain("disable-model-invocation")
    expect(formatDoc({ ...skill, auto: false })).toContain("disable-model-invocation: true")
    expect(parseDoc("skill", skill.name, formatDoc({ ...skill, auto: false })).auto).toBe(false)
  })

  test("a command keeps its prompt and an agent its mode", () => {
    const command: Doc = { ...skill, kind: "command", name: "jaanch", body: "Check $ARGUMENTS and report." }
    const agent: Doc = { ...skill, kind: "agent", name: "reviewer", mode: "all", body: "You review code." }

    expect(parseDoc("command", "jaanch", formatDoc(command))).toEqual(command)
    expect(parseDoc("agent", "reviewer", formatDoc(agent))).toEqual(agent)
    expect(formatDoc(command)).not.toContain("name:")
  })

  test("reads a file a person wrote by hand", () => {
    expect(parseDoc("skill", "x", "---\r\nname: x\r\ndescription: Plain words: here\r\n---\r\nDo it.\r\n")).toEqual({
      kind: "skill",
      name: "x",
      description: "Plain words: here",
      body: "Do it.",
      auto: true,
      mode: "subagent",
    })
    expect(parseDoc("command", "y", "Just a prompt").body).toBe("Just a prompt")
  })
})

describe("command lines", () => {
  test("splits on spaces and keeps quoted parts whole", () => {
    expect(splitCommand('npx -y some-server "C:\\My Files\\data" --flag')).toEqual([
      "npx",
      "-y",
      "some-server",
      "C:\\My Files\\data",
      "--flag",
    ])
    expect(splitCommand("   ")).toEqual([])
  })
})
