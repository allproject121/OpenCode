/** How the Run button starts a project folder. */
export type RunPlan =
  /** A Node project: `npm install` first when `install`, then `npm run <script>` (`npm start` for "start"). */
  | { readonly kind: "npm"; readonly script: string; readonly install: boolean }
  /** Plain web files: the app's own small web server shows `root` (relative to the project, "" for itself). */
  | { readonly kind: "static"; readonly root: string }
  /** A Python web app started with this command line. */
  | { readonly kind: "python"; readonly args: readonly string[] }

/** What the detector may look at; tests pass a fake. */
export type Look = {
  /** The text of a file in the project, or undefined when it is not there. */
  readonly read: (file: string) => Promise<string | undefined>
  /** Whether a file or folder is there. */
  readonly has: (file: string) => Promise<boolean>
}

/** npm scripts that start something to look at, best first. */
const scripts = ["dev", "start", "serve", "preview"]

/** Folders that may hold the site's index.html, best first. */
const roots = ["", "public", "dist", "build", "src", "site", "docs"]

/** Picks how to run a project folder, or undefined when nothing fits. */
export async function detect(look: Look): Promise<RunPlan | undefined> {
  const pkg = await look.read("package.json")

  if (pkg !== undefined) {
    const json = parse(pkg)
    const found = scripts.find((name) => typeof json?.scripts?.[name] === "string")

    if (found) {
      const deps = Object.keys({ ...(json?.dependencies ?? {}), ...(json?.devDependencies ?? {}) }).length

      return { kind: "npm", script: found, install: deps > 0 && !(await look.has("node_modules")) }
    }
  }

  if (await look.has("manage.py")) return { kind: "python", args: ["manage.py", "runserver"] }

  for (const file of ["app.py", "main.py"]) {
    const text = await look.read(file)

    if (text && /Flask\(|FastAPI\(|streamlit/.test(text)) {
      if (/streamlit/.test(text)) return { kind: "python", args: ["-m", "streamlit", "run", file] }
      if (/FastAPI\(/.test(text)) return { kind: "python", args: ["-m", "uvicorn", `${file.replace(/\.py$/, "")}:app`] }

      return { kind: "python", args: [file] }
    }
  }

  for (const root of roots) if (await look.has(root ? `${root}/index.html` : "index.html")) return { kind: "static", root }

  return undefined
}

const parse = (
  text: string,
): { scripts?: Record<string, unknown>; dependencies?: object; devDependencies?: object } | undefined => {
  try {
    return JSON.parse(text)
  } catch {
    return undefined
  }
}

/** The first local web address in a line a server printed, with 0.0.0.0 / [::] turned into localhost. */
export function findUrl(line: string): string | undefined {
  // Servers color their output; drop the color codes first.
  const plain = line.replace(/\u001b\[[0-9;]*m/g, "")
  const match = plain.match(/https?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1?\]):\d+[^\s'"<>)]*/)

  return match?.[0].replace(/0\.0\.0\.0|\[::1?\]/, "localhost").replace(/[.,;]+$/, "")
}

/** What the user reads as the command. */
export function describe(plan: RunPlan): string {
  if (plan.kind === "npm") return plan.script === "start" ? "npm start" : `npm run ${plan.script}`
  if (plan.kind === "python") return `python ${plan.args.join(" ")}`

  return plan.root ? `Web server (${plan.root}/)` : "Web server"
}
