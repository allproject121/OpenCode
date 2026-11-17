import { describe, expect, test } from "bun:test"
import { describeDetection, detectProject } from "./detect"

const pkg = (dependencies: Record<string, string>, scripts: Record<string, string> = {}) =>
  JSON.stringify({ dependencies, scripts })

describe("detectProject", () => {
  test("an empty folder is a new project", () => {
    expect(detectProject({ names: [] }).kind).toBe("empty")
    expect(detectProject({ names: [".git", "node_modules"] }).kind).toBe("empty")
  })

  test("a framework that serves pages and data is a full website", () => {
    const result = detectProject({
      names: ["package.json", "app"],
      packageJson: pkg({ next: "15", react: "19" }, { dev: "next dev", build: "next build", test: "vitest" }),
    })

    expect(result.kind).toBe("web-fullstack")
    expect(result.web).toBe(true)
    expect(result.stack).toContain("next")
    expect(result.commands).toEqual({ dev: "npm run dev", build: "npm run build", test: "npm run test", lint: undefined })
    expect(result.skills).toContain("frontend-ui-engineering")
    expect(result.skills).toContain("api-and-interface-design")
    expect(result.skills).toContain("browser-testing-with-devtools")
  })

  test("a UI library alone is a frontend, a server library alone is a backend, both are a full website", () => {
    expect(detectProject({ names: ["package.json"], packageJson: pkg({ react: "19", vite: "7" }) }).kind).toBe(
      "web-frontend",
    )
    const backend = detectProject({ names: ["package.json"], packageJson: pkg({ express: "5" }) })

    expect(backend.kind).toBe("web-backend")
    expect(backend.skills).not.toContain("browser-testing-with-devtools")
    expect(detectProject({ names: ["package.json"], packageJson: pkg({ vue: "3", fastify: "5" }) }).kind).toBe(
      "web-fullstack",
    )
  })

  test("mobile and desktop apps win over the web library they are built with", () => {
    expect(detectProject({ names: ["package.json"], packageJson: pkg({ expo: "53", react: "19" }) }).kind).toBe(
      "mobile-app",
    )
    expect(detectProject({ names: ["package.json"], packageJson: pkg({ electron: "44", react: "19" }) }).kind).toBe(
      "desktop-app",
    )
    expect(detectProject({ names: ["pubspec.yaml", "lib"] }).stack).toEqual(["flutter"])
    expect(detectProject({ names: ["build.gradle.kts", "app"] }).kind).toBe("mobile-app")
  })

  test("python web frameworks are a backend, other python is python", () => {
    expect(detectProject({ names: ["requirements.txt"], python: "FastAPI==0.115\nuvicorn" }).kind).toBe("web-backend")
    expect(detectProject({ names: ["manage.py"] }).stack).toEqual(["django"])
    expect(detectProject({ names: ["pyproject.toml"], python: "[project]\nname='tool'" }).kind).toBe("python")
  })

  test("a page without a build is a static site, and unknown files are other", () => {
    expect(detectProject({ names: ["index.html", "style.css"] }).kind).toBe("static-site")
    expect(detectProject({ names: ["main.go", "go.mod"] }).kind).toBe("other")
    expect(detectProject({ names: ["package.json"], packageJson: "not json" }).kind).toBe("other")
  })

  test("every kind keeps the lifecycle order: define, plan, build, test, debug, review, security", () => {
    const skills = detectProject({ names: ["package.json"], packageJson: pkg({ next: "15" }) }).skills
    const order = [
      "spec-driven-development",
      "planning-and-task-breakdown",
      "incremental-implementation",
      "test-driven-development",
      "debugging-and-error-recovery",
      "code-review-and-quality",
      "security-and-hardening",
    ].map((name) => skills.indexOf(name))

    expect(order.every((index) => index >= 0)).toBe(true)
    expect(order).toEqual(order.toSorted((a, b) => a - b))
  })

  test("describes the result in the user's language with only the commands that exist", () => {
    const text = describeDetection(
      detectProject({ names: ["package.json"], packageJson: pkg({ react: "19" }, { test: "vitest" }) }),
    )

    expect(text).toContain("Website ka frontend.")
    expect(text).toContain("test: npm run test")
    expect(text).not.toContain("build:")
  })
})
