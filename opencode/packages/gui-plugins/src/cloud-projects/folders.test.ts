import { describe, expect, test } from "bun:test"
import path from "node:path"
import { carried, fastFolder, nameProblem } from "./folders"

describe("finding Cloud-SSD's fast drive folder", () => {
  const home = path.join("C:", "Users", "Me")

  test("uses the folder under the home folder unless the settings name another", () => {
    expect(fastFolder(JSON.stringify({ Hybrid: { Enabled: true, Root: null } }), home)).toBe(
      path.join(home, "Cloud-SSD", "All Accounts"),
    )
    expect(fastFolder("\uFEFF" + JSON.stringify({ Hybrid: { Enabled: true, Root: "D:\\Fast" } }), home)).toBe(
      "D:\\Fast",
    )
  })

  test("gives nothing when the fast drive is off or the file is broken", () => {
    expect(fastFolder(JSON.stringify({ Hybrid: { Enabled: false } }), home)).toBeUndefined()
    expect(fastFolder(JSON.stringify({}), home)).toBeUndefined()
    expect(fastFolder("", home)).toBeUndefined()
    expect(fastFolder("[1]", home)).toBeUndefined()
  })
})

describe("project names", () => {
  test("accepts one plain folder name", () => {
    expect(nameProblem("meri-website")).toBeUndefined()
    expect(nameProblem("  Shop App 2  ")).toBeUndefined()
    expect(nameProblem("दुकान")).toBeUndefined()
  })

  test("says what is wrong with the others", () => {
    expect(nameProblem("   ")).toBe("empty")
    expect(nameProblem("a/b")).toBe("characters")
    expect(nameProblem("..")).toBe("characters")
    expect(nameProblem("name.")).toBe("characters")
    expect(nameProblem("con")).toBe("reserved")
  })
})

describe("bringing a folder", () => {
  const source = path.join("C:", "work", "site")

  test("leaves behind what the project can build again", () => {
    expect(carried(source, path.join(source, "src", "index.ts"))).toBe(true)
    expect(carried(source, path.join(source, ".git", "config"))).toBe(true)
    expect(carried(source, path.join(source, "node_modules"))).toBe(false)
    expect(carried(source, path.join(source, "packages", "web", "node_modules", "x", "index.js"))).toBe(false)
    expect(carried(source, path.join(source, "dist", "app.js"))).toBe(false)
  })

  test("keeps a folder whose own path happens to hold such a name above the source", () => {
    const inside = path.join("C:", "build", "site")

    expect(carried(inside, path.join(inside, "main.py"))).toBe(true)
  })
})
