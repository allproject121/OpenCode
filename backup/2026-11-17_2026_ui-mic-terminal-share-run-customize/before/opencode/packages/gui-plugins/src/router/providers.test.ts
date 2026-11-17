import { describe, expect, test } from "bun:test"
import { freeName, providers, readConnections, readError, readTestFailure } from "./providers"

describe("router replies", () => {
  test("keeps the shown fields of a connection and drops its secrets", () => {
    const connections = readConnections({
      connections: [
        { id: "a1", provider: "gemini", name: "main", isActive: true, testStatus: "active", apiKey: "secret" },
        { id: "b2", provider: "ollama-local", isActive: false },
        { provider: "no-id" },
        "junk",
      ],
    })

    expect(connections).toEqual([
      { id: "a1", provider: "gemini", name: "main", active: true, status: "active" },
      { id: "b2", provider: "ollama-local", name: "ollama-local", active: false, status: null },
    ])
    expect(JSON.stringify(connections)).not.toContain("secret")
  })

  test("reads nothing from an unexpected body", () => {
    expect(readConnections(null)).toEqual([])
    expect(readConnections({ connections: "x" })).toEqual([])
  })

  test("finds the message of an error reply", () => {
    expect(readError({ error: "bad key" })).toBe("bad key")
    expect(readError({ error: { message: "quota" } })).toBe("quota")
    expect(readError({ message: "nope" })).toBe("nope")
    expect(readError({})).toBeUndefined()
  })
})

describe("key test", () => {
  test("a refused key fails even though the router answers 200", () => {
    expect(readTestFailure(true, 200, { valid: false, error: "Invalid API key" })).toBe("Invalid API key")
    expect(readTestFailure(true, 200, { valid: false })).toBe("The provider refused this key.")
  })

  test("a working key passes", () => {
    expect(readTestFailure(true, 200, { valid: true, error: null })).toBeUndefined()
  })

  test("an error status fails with the router's message or the status", () => {
    expect(readTestFailure(false, 500, { error: { message: "boom" } })).toBe("boom")
    expect(readTestFailure(false, 502, undefined)).toBe("The key test answered 502.")
  })
})

describe("connection names", () => {
  test("picks the first free name", () => {
    expect(freeName([])).toBe("main")
    expect(freeName(["main"])).toBe("main-2")
    expect(freeName(["main", "main-2", "other"])).toBe("main-3")
  })
})

describe("provider list", () => {
  test("has unique ids and https key pages", () => {
    expect(new Set(providers.map((provider) => provider.id)).size).toBe(providers.length)
    expect(providers.every((provider) => provider.keyUrl.startsWith("https://"))).toBe(true)
  })
})
