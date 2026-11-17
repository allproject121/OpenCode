import { describe as group, expect, test } from "bun:test"
import { describe, detect, findUrl, type Look } from "./detect"

const fake = (files: Record<string, string>): Look => ({
  read: async (file) => files[file],
  has: async (file) => file in files || Object.keys(files).some((name) => name.startsWith(`${file}/`)),
})

group("detect", () => {
  test("vite project without node_modules installs first, then runs dev", async () => {
    const plan = await detect(
      fake({ "package.json": JSON.stringify({ scripts: { dev: "vite", build: "vite build" }, dependencies: { react: "1" } }) }),
    )

    expect(plan).toEqual({ kind: "npm", script: "dev", install: true })
    expect(describe(plan!)).toBe("npm run dev")
  })

  test("installed project with only start skips install", async () => {
    const plan = await detect(
      fake({
        "package.json": JSON.stringify({ scripts: { start: "node server.js" }, dependencies: { express: "1" } }),
        "node_modules/x": "",
      }),
    )

    expect(plan).toEqual({ kind: "npm", script: "start", install: false })
    expect(describe(plan!)).toBe("npm start")
  })

  test("plain html is served by the built-in server", async () => {
    expect(await detect(fake({ "index.html": "<h1>hi</h1>" }))).toEqual({ kind: "static", root: "" })
    expect(await detect(fake({ "public/index.html": "" }))).toEqual({ kind: "static", root: "public" })
  })

  test("package.json without a run script falls back to html", async () => {
    expect(
      await detect(fake({ "package.json": JSON.stringify({ scripts: { test: "x" } }), "index.html": "" })),
    ).toEqual({ kind: "static", root: "" })
  })

  test("python apps", async () => {
    expect(await detect(fake({ "manage.py": "" }))).toEqual({ kind: "python", args: ["manage.py", "runserver"] })
    expect(await detect(fake({ "app.py": "app = Flask(__name__)" }))).toEqual({ kind: "python", args: ["app.py"] })
    expect(await detect(fake({ "main.py": "app = FastAPI()" }))).toEqual({
      kind: "python",
      args: ["-m", "uvicorn", "main:app"],
    })
  })

  test("nothing to run", async () => {
    expect(await detect(fake({ "notes.txt": "" }))).toBeUndefined()
  })
})

group("findUrl", () => {
  test("vite and next lines", () => {
    expect(findUrl("  \u001b[32m➜\u001b[39m  Local:   \u001b[36mhttp://localhost:\u001b[1m5173\u001b[22m/\u001b[39m")).toBe(
      "http://localhost:5173/",
    )
    expect(findUrl("- Local:        http://localhost:3000")).toBe("http://localhost:3000")
    expect(findUrl("Running on http://127.0.0.1:5000.")).toBe("http://127.0.0.1:5000")
    expect(findUrl("listening on http://0.0.0.0:8080")).toBe("http://localhost:8080")
    expect(findUrl("compiling...")).toBeUndefined()
  })
})
