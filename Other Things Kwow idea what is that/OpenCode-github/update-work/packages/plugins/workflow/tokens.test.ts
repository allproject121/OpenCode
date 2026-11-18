import { describe, expect, test } from "bun:test"
import { parseUserVariables, resolveHeaders } from "./tokens"

describe("user variables", () => {
  test("reads names and values, with spaces in a value, and skips other lines", () => {
    const output = [
      "",
      "HKEY_CURRENT_USER\\Environment",
      "    Path    REG_EXPAND_SZ    C:\\Users\\A B\\bin;%USERPROFILE%\\x",
      "    GITHUB_PERSONAL_ACCESS_TOKEN    REG_SZ    ghp_abc",
      "    COUNT    REG_DWORD    0x1",
      "",
    ].join("\r\n")

    expect(parseUserVariables(output)).toEqual({
      Path: "C:\\Users\\A B\\bin;%USERPROFILE%\\x",
      GITHUB_PERSONAL_ACCESS_TOKEN: "ghp_abc",
    })
  })
})

describe("token headers", () => {
  test("fills the token in and leaves other headers alone", () => {
    expect(
      resolveHeaders({ Authorization: "Bearer {user-env:TOKEN}", Accept: "text/plain" }, { TOKEN: " ghp_abc " }),
    ).toEqual({ headers: { Authorization: "Bearer ghp_abc", Accept: "text/plain" }, missing: false })
  })

  test("says when the token is not set, and ignores headers without a marker", () => {
    expect(resolveHeaders({ Authorization: "Bearer {user-env:TOKEN}" }, {})).toEqual({
      headers: { Authorization: "Bearer " },
      missing: true,
    })
    expect(resolveHeaders({ Authorization: "Bearer fixed" }, {})).toBeUndefined()
  })
})
