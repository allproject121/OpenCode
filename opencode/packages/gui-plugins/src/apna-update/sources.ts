import { readdir, readFile } from "node:fs/promises"
import path from "node:path"

/** A GitHub project as the user typed it, made exact. */
export type GithubProject = { readonly owner: string; readonly repo: string; readonly url: string; readonly name: string }

const part = /^[A-Za-z0-9_.-]+$/

/**
 * Reads `https://github.com/owner/repo` (also with `.git`, a trailing `/`, `/tree/...`, without `https://`, or just
 * `owner/repo`). Undefined for anything else, so nothing but a GitHub project is ever cloned.
 */
export function parseGithub(text: string): GithubProject | undefined {
  const trimmed = text.trim().replace(/^https?:\/\//i, "").replace(/^www\./i, "")
  const rest = trimmed.toLowerCase().startsWith("github.com/") ? trimmed.slice("github.com/".length) : trimmed
  const [owner, rawRepo] = rest.split("/")
  const repo = rawRepo?.replace(/\.git$/i, "")

  if (!owner || !repo || !part.test(owner) || !part.test(repo) || repo === "." || repo === "..") return undefined
  if (trimmed === rest && rest.split("/").filter(Boolean).length !== 2) return undefined

  return { owner, repo, url: `https://github.com/${owner}/${repo}.git`, name: `${owner}-${repo}`.toLowerCase() }
}

const skipped = new Set(["node_modules", ".git"])

/** The folders that hold a SKILL.md, at most 6 levels down. */
async function skillFolders(root: string) {
  const found: string[] = []
  const queue = [{ directory: root, depth: 0 }]

  for (const item of queue) {
    const entries = await readdir(item.directory, { withFileTypes: true }).catch(() => [])

    if (entries.some((entry) => entry.isFile() && entry.name === "SKILL.md")) {
      found.push(item.directory)
      continue
    }
    if (item.depth >= 6) continue
    queue.push(
      ...entries
        .filter((entry) => entry.isDirectory() && !entry.name.startsWith(".") && !skipped.has(entry.name))
        .map((entry) => ({ directory: path.join(item.directory, entry.name), depth: item.depth + 1 })),
    )
  }

  return found
}

const looseMarkdown = async (directory: string) =>
  (await readdir(directory, { withFileTypes: true }).catch(() => [])).some(
    (entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".md"),
  )

/**
 * The folders to list under the settings' `skills`. OpenCode reads every SKILL.md below such a folder, and also any
 * loose .md file right in it, so a folder with a README is never given: its skill folders are given one by one.
 */
export async function skillRoots(root: string): Promise<string[]> {
  const folders = await skillFolders(root)

  if (folders.length === 0) return []
  if (folders.includes(root)) return [root]

  const parents = [...new Set(folders.map((folder) => path.dirname(folder)))]
  const roots: string[] = []

  for (const parent of parents) {
    const own = folders.filter((folder) => path.dirname(folder) === parent)

    if (await looseMarkdown(parent)) roots.push(...own)
    else roots.push(parent)
  }

  return roots.toSorted()
}

/** An OpenCode plugin names the plugin package among its dependencies. */
export async function isPlugin(root: string) {
  const text = await readFile(path.join(root, "package.json"), "utf8").catch(() => undefined)

  if (!text) return false
  try {
    const json = JSON.parse(text) as Record<string, Record<string, string> | undefined>
    const names = ["dependencies", "devDependencies", "peerDependencies"].flatMap((key) => Object.keys(json[key] ?? {}))

    return names.some((name) => name === "@opencode-ai/plugin" || name === "@opencode/plugin")
  } catch {
    return false
  }
}
