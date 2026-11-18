import { describe, expect, test } from "bun:test"
import { houseRules } from "./prompts"

describe("the working rules added to every chat", () => {
  test("name the open project and what 'this' means, for every agent", () => {
    for (const agent of ["build", "plan", "ask"]) {
      const rules = houseRules("C:\\Work\\shop", agent)

      expect(rules).toContain("C:\\Work\\shop")
      expect(rules).toContain("THIS PROJECT FOLDER")
      expect(rules).toContain("Hinglish")
    }
  })

  test("tell only the build agent to do the work at once", () => {
    expect(houseRules("C:\\Work\\shop", "build")).toContain("do it in this turn")
    expect(houseRules("C:\\Work\\shop", "plan")).not.toContain("do it in this turn")
    expect(houseRules("C:\\Work\\shop", "ask")).not.toContain("write the files")
  })
})
