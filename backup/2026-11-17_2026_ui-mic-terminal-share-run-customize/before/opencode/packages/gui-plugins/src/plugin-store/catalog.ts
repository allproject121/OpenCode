/** Something the Plugins page can add to this app with one press. What it gives the user is copy: `item.<id>`. */
export type StoreItem = {
  readonly id: string
  readonly name: string
  /** The page of the thing itself, for "more". */
  readonly link: string
  /** The user must sign in or give a key after adding it; the page says where. */
  readonly needsSignIn?: boolean
} & (
  | {
      /** A tool server (MCP): the agent gets new tools. */
      readonly kind: "mcp"
      /**
       * A program started on this machine, or a web address. In `environment`, `{config}` stands for this app's
       * settings folder.
       */
      readonly server:
        | {
            readonly type: "local"
            readonly command: readonly string[]
            readonly environment?: Readonly<Record<string, string>>
          }
        | { readonly type: "remote"; readonly url: string }
      /**
       * The server takes an access token and offers no sign-in this app can use. The token lives in the user's
       * environment variable `variable` and is sent as a Bearer header; `page` is where the user makes one. Until
       * a token is saved the server is left out of the app's server, so it neither fails nor shows a switch.
       */
      readonly token?: { readonly variable: string; readonly page: string }
    }
  | {
      /** An OpenCode plugin. */
      readonly kind: "plugin"
      /** Its folder inside this app's source, used when it is there. */
      readonly local: string
      /** Where OpenCode fetches it from otherwise. */
      readonly spec: string
    }
  | {
      /** A pack of skills, fetched once with git. */
      readonly kind: "skills"
      readonly repository: string
      /** The folder of skills inside the repository. */
      readonly folder: string
    }
)

/**
 * The list offered on the page. Tool servers come first: in a coding agent most useful "plugins" are tool servers.
 * Every entry is a public, widely used project; nothing here is fetched until the user presses Add.
 */
export const catalog: readonly StoreItem[] = [
  {
    id: "context7",
    kind: "mcp",
    name: "Context7",
    link: "https://github.com/upstash/context7",
    server: { type: "remote", url: "https://mcp.context7.com/mcp" },
  },
  {
    id: "playwright",
    kind: "mcp",
    name: "Playwright",
    link: "https://github.com/microsoft/playwright-mcp",
    server: { type: "local", command: ["npx", "-y", "@playwright/mcp@latest"] },
  },
  {
    id: "chrome-devtools",
    kind: "mcp",
    name: "Chrome DevTools",
    link: "https://github.com/ChromeDevTools/chrome-devtools-mcp",
    server: { type: "local", command: ["npx", "-y", "chrome-devtools-mcp@latest"] },
  },
  {
    id: "github",
    kind: "mcp",
    name: "GitHub",
    link: "https://github.com/github/github-mcp-server",
    // GitHub's sign-in refuses apps that are not registered with it, so this one works with a token.
    token: {
      variable: "GITHUB_PERSONAL_ACCESS_TOKEN",
      page: "https://github.com/settings/tokens/new?description=Apna%20OpenCode&scopes=repo,read:org,read:user",
    },
    server: { type: "remote", url: "https://api.githubcopilot.com/mcp/" },
  },
  {
    id: "figma",
    kind: "mcp",
    name: "Figma",
    link: "https://github.com/figma/mcp-server-guide",
    needsSignIn: true,
    server: { type: "remote", url: "https://mcp.figma.com/mcp" },
  },
  {
    id: "sequential-thinking",
    kind: "mcp",
    name: "Sequential Thinking",
    link: "https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking",
    server: { type: "local", command: ["npx", "-y", "@modelcontextprotocol/server-sequential-thinking"] },
  },
  {
    id: "memory",
    kind: "mcp",
    name: "Memory",
    link: "https://github.com/modelcontextprotocol/servers/tree/main/src/memory",
    server: {
      type: "local",
      command: ["npx", "-y", "@modelcontextprotocol/server-memory"],
      // Without this the file sits inside npx's cache, where an update of the package loses it.
      environment: { MEMORY_FILE_PATH: "{config}/memory.jsonl" },
    },
  },
  {
    id: "figma-plugin",
    kind: "plugin",
    name: "Figma skills (OpenCode ka plugin)",
    link: "https://github.com/anomalyco/opencode/tree/dev/packages/plugins/figma",
    needsSignIn: true,
    local: "packages/plugins/figma",
    spec: "git+https://github.com/anomalyco/opencode.git#path:packages/plugins/figma",
  },
  {
    id: "superpowers",
    kind: "skills",
    name: "Superpowers (skills)",
    link: "https://github.com/obra/superpowers",
    repository: "https://github.com/obra/superpowers.git",
    folder: "skills",
  },
]
