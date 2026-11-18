import { expect, test } from "bun:test"
import { aspects, fullPrompt, ideas, templates } from "./ideas"

test("style is added after the user's words", () => {
  const watercolor = templates.find((item) => item.id === "watercolor")!

  expect(fullPrompt("  a red fort  ", undefined)).toBe("a red fort")
  expect(fullPrompt("a red fort", watercolor)).toBe("a red fort, as a soft watercolor painting on textured paper")
  expect(fullPrompt("", watercolor)).toBe("A picture, as a soft watercolor painting on textured paper")
})

test("ids are unique and sizes are multiples of 64", () => {
  const ids = [...ideas.map((item) => item.id), ...templates.map((item) => `template-${item.id}`)]

  expect(new Set(ids).size).toBe(ids.length)
  for (const aspect of aspects)
    for (const side of aspect.size.split("x").map(Number)) expect(side % 64).toBe(0)
})

test("an edit keeps the subject and drops the old style", async () => {
  const { withoutStyle } = await import("./ideas")

  expect(withoutStyle("a red fort, as a soft watercolor painting on textured paper")).toBe("a red fort")
  expect(withoutStyle("a red fort at night")).toBe("a red fort at night")
})
