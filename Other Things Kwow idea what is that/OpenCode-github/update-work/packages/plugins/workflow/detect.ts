/** What a project folder is, worked out from its files rather than guessed by the model. */
export type ProjectKind =
  | "empty"
  | "static-site"
  | "web-frontend"
  | "web-backend"
  | "web-fullstack"
  | "mobile-app"
  | "desktop-app"
  | "python"
  | "other"

export type Detection = {
  readonly kind: ProjectKind
  /** The frameworks and tools found, such as "next", "react", "express", "flutter". */
  readonly stack: readonly string[]
  /** Commands the project itself defines; only the ones that exist. */
  readonly commands: { readonly dev?: string; readonly build?: string; readonly test?: string; readonly lint?: string }
  /** Has a web page a browser can open, so browser testing applies. */
  readonly web: boolean
  /** The skills to load for this kind of project, in lifecycle order. */
  readonly skills: readonly string[]
}

/** What the detector reads: the names in the project's top folder and the text of a few known files. */
export type ProjectFiles = {
  readonly names: readonly string[]
  readonly packageJson?: string
  /** requirements.txt and pyproject.toml, joined. */
  readonly python?: string
}

// The lifecycle and its skills come from addyosmani/agent-skills (Define, Plan, Build, Verify, Review, Ship); the
// security step follows the OWASP Developer Guide: security belongs to every phase and is verified before shipping.
const lifecycle = [
  "spec-driven-development",
  "planning-and-task-breakdown",
  "incremental-implementation",
  "test-driven-development",
  "debugging-and-error-recovery",
  "code-review-and-quality",
  "security-and-hardening",
] as const

const frontendSkills = ["frontend-ui-engineering", "browser-testing-with-devtools", "performance-optimization"] as const
const backendSkills = ["api-and-interface-design"] as const

const fullstackFrameworks = ["next", "nuxt", "@sveltejs/kit", "@remix-run/react", "astro", "@tanstack/react-start"]
const frontendLibraries = ["react", "vue", "svelte", "solid-js", "@angular/core", "preact", "lit"]
const backendLibraries = ["express", "fastify", "hono", "koa", "@nestjs/core", "elysia"]
const mobileLibraries = ["react-native", "expo", "@capacitor/core", "@ionic/react", "@ionic/vue"]
const desktopLibraries = ["electron", "@tauri-apps/api"]
const pythonWeb = ["django", "flask", "fastapi", "starlette"]

function parsePackage(text: string | undefined) {
  if (text === undefined) return undefined

  try {
    const value: unknown = JSON.parse(text)

    if (typeof value !== "object" || value === null) return undefined
    const record = Object.fromEntries(Object.entries(value))
    const section = (name: string) => {
      const part: unknown = record[name]

      return typeof part === "object" && part !== null ? Object.fromEntries(Object.entries(part)) : {}
    }

    return {
      dependencies: Object.keys({ ...section("dependencies"), ...section("devDependencies") }),
      scripts: section("scripts"),
    }
  } catch {
    return undefined
  }
}

const withSkills = (
  detection: Omit<Detection, "skills">,
  parts: { frontend: boolean; backend: boolean },
): Detection => ({
  ...detection,
  skills: [
    ...lifecycle.slice(0, 4),
    ...(parts.frontend ? frontendSkills.slice(0, 1) : []),
    ...(parts.backend ? backendSkills : []),
    ...(detection.web ? frontendSkills.slice(1, 2) : []),
    ...lifecycle.slice(4),
    ...(detection.web ? frontendSkills.slice(2) : []),
  ],
})

/** Works out the kind of project from its files. A folder with nothing recognisable is `empty` or `other`. */
export function detectProject(files: ProjectFiles): Detection {
  const names = new Set(files.names.map((name) => name.toLowerCase()))
  const visible = files.names.filter((name) => !name.startsWith(".") && name.toLowerCase() !== "node_modules")
  const pkg = parsePackage(files.packageJson)
  const python = (files.python ?? "").toLowerCase()

  if (names.has("pubspec.yaml"))
    return withSkills({ kind: "mobile-app", stack: ["flutter"], commands: { test: "flutter test" }, web: false }, {
      frontend: true,
      backend: false,
    })

  if (pkg) {
    const has = (list: readonly string[]) => list.filter((name) => pkg.dependencies.includes(name))
    const script = (name: string) => (typeof pkg.scripts[name] === "string" ? `npm run ${name}` : undefined)
    const commands = {
      dev: script("dev") ?? script("start"),
      build: script("build"),
      test: script("test"),
      lint: script("lint"),
    }
    const fullstack = has(fullstackFrameworks)
    const frontend = has(frontendLibraries)
    const backend = has(backendLibraries)
    const mobile = has(mobileLibraries)
    const desktop = has(desktopLibraries)
    const stack = [...fullstack, ...frontend, ...backend, ...mobile, ...desktop]

    if (mobile.length > 0)
      return withSkills({ kind: "mobile-app", stack, commands, web: false }, { frontend: true, backend: false })
    if (desktop.length > 0)
      return withSkills({ kind: "desktop-app", stack, commands, web: false }, { frontend: true, backend: false })
    if (fullstack.length > 0 || (frontend.length > 0 && backend.length > 0))
      return withSkills({ kind: "web-fullstack", stack, commands, web: true }, { frontend: true, backend: true })
    if (frontend.length > 0)
      return withSkills({ kind: "web-frontend", stack, commands, web: true }, { frontend: true, backend: false })
    if (backend.length > 0)
      return withSkills({ kind: "web-backend", stack, commands, web: false }, { frontend: false, backend: true })
    if (names.has("index.html"))
      return withSkills({ kind: "web-frontend", stack, commands, web: true }, { frontend: true, backend: false })

    return withSkills({ kind: "other", stack: ["node"], commands, web: false }, { frontend: false, backend: false })
  }

  if (python !== "" || names.has("manage.py")) {
    const web = pythonWeb.filter((name) => python.includes(name))
    const commands = { test: "pytest" }

    return web.length > 0 || names.has("manage.py")
      ? withSkills(
          { kind: "web-backend", stack: web.length > 0 ? web : ["django"], commands, web: false },
          { frontend: false, backend: true },
        )
      : withSkills({ kind: "python", stack: ["python"], commands, web: false }, { frontend: false, backend: false })
  }

  if (names.has("index.html"))
    return withSkills({ kind: "static-site", stack: ["html"], commands: {}, web: true }, { frontend: true, backend: false })
  if (names.has("build.gradle") || names.has("build.gradle.kts") || names.has("settings.gradle"))
    return withSkills({ kind: "mobile-app", stack: ["android"], commands: {}, web: false }, {
      frontend: true,
      backend: false,
    })
  if (visible.length === 0)
    return withSkills({ kind: "empty", stack: [], commands: {}, web: false }, { frontend: false, backend: false })

  return withSkills({ kind: "other", stack: [], commands: {}, web: false }, { frontend: false, backend: false })
}

/** The detection as short text for the model, in the user's language. */
export function describeDetection(detection: Detection) {
  const kinds: Record<ProjectKind, string> = {
    empty: "Khaali folder (naya project). Kya banana hai ye user ke sandesh se tay karo.",
    "static-site": "Seedhi HTML website (bina framework).",
    "web-frontend": "Website ka frontend.",
    "web-backend": "Website / API ka backend.",
    "web-fullstack": "Poori website (frontend + backend).",
    "mobile-app": "Mobile app.",
    "desktop-app": "Desktop app.",
    python: "Python project.",
    other: "Pehchaan nahi hui; files padh ke tay karo.",
  }
  const commands = Object.entries(detection.commands).flatMap(([name, command]) =>
    command ? [`${name}: ${command}`] : [],
  )

  return [
    `Project: ${kinds[detection.kind]}`,
    `Stack: ${detection.stack.length > 0 ? detection.stack.join(", ") : "abhi kuch nahi"}`,
    `Commands: ${commands.length > 0 ? commands.join("; ") : "project me koi command tay nahi"}`,
    `Browser me khulta hai: ${detection.web ? "haan" : "nahi"}`,
    `Is kaam ke skills (isi kram me): ${detection.skills.join(", ")}`,
  ].join("\n")
}
