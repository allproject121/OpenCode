import { describe, expect, test } from "bun:test"
import { mkdir, mkdtemp, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { isPlugin, parseGithub, skillRoots } from "./sources"

describe("parseGithub", () => {
  test("reads the usual ways of writing a project", () => {
    for (const text of [
      "https://github.com/obra/superpowers",
      "https://github.com/obra/superpowers.git",
      "github.com/obra/superpowers/",
      "https://www.github.com/obra/superpowers/tree/main/skills",
      "  obra/superpowers ",
    ])
      expect(parseGithub(text)).toEqual({
        owner: "obra",
        repo: "superpowers",
        url: "https://github.com/obra/superpowers.git",
        name: "obra-superpowers",
      })
  })

  test("refuses anything that is not a GitHub project", () => {
    for (const text of ["", "superpowers", "https://gitlab.com/a/b", "a/b/c", "github.com/a", "a/..", "a;rm/b", "C:\\x\\y"])
      expect(parseGithub(text)).toBeUndefined()
  })
})

const tree = async (files: Record<string, string>) => {
  const root = await mkdtemp(path.join(tmpdir(), "apna-update-"))

  for (const [name, text] of Object.entries(files)) {
    await mkdir(path.dirname(path.join(root, name)), { recursive: true })
    await writeFile(path.join(root, name), text)
  }

  return root
}

describe("skillRoots", () => {
  test("a skills folder without loose notes is given whole", async () => {
    const root = await tree({ "README.md": "", "skills/a/SKILL.md": "", "skills/b/SKILL.md": "" })
    expect(await skillRoots(root)).toEqual([path.join(root, "skills")])
  })

  test("skill folders beside a README are given one by one", async () => {
    const root = await tree({ "README.md": "", "a/SKILL.md": "", "b/SKILL.md": "" })
    expect(await skillRoots(root)).toEqual([path.join(root, "a"), path.join(root, "b")])
  })

  test("a project that is one skill is given itself; one without skills gives none", async () => {
    expect(await skillRoots(await tree({ "SKILL.md": "", "README.md": "" }))).toHaveLength(1)
    expect(await skillRoots(await tree({ "README.md": "", "src/index.ts": "" }))).toEqual([])
  })

  test("node_modules is not searched", async () => {
    expect(await skillRoots(await tree({ "node_modules/x/SKILL.md": "" }))).toEqual([])
  })
})

describe("isPlugin", () => {
  test("a package that depends on the plugin package is a plugin", async () => {
    expect(await isPlugin(await tree({ "package.json": JSON.stringify({ dependencies: { "@opencode-ai/plugin": "1" } }) }))).toBe(true)
    expect(await isPlugin(await tree({ "package.json": JSON.stringify({ dependencies: { react: "1" } }) }))).toBe(false)
    expect(await isPlugin(await tree({ "package.json": "{ broken" }))).toBe(false)
    expect(await isPlugin(await tree({ "README.md": "" }))).toBe(false)
  })
})
