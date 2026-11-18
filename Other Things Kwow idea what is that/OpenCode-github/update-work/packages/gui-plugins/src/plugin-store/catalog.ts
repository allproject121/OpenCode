/** The groups the Plugins page shows, in order, like the categories of a plugin marketplace. */
export const categories = ["code", "browser", "design", "search", "data", "deploy", "work", "think", "skills"] as const

export type Category = (typeof categories)[number]

/** Something the Plugins page can add to this app with one press. What it gives the user is copy: `item.<id>`. */
export type StoreItem = {
  readonly id: string
  readonly category: Category
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
    category: "code",
    kind: "mcp",
    name: "Context7",
    link: "https://github.com/upstash/context7",
    server: { type: "remote", url: "https://mcp.context7.com/mcp" },
  },
  {
    id: "playwright",
    category: "browser",
    kind: "mcp",
    name: "Playwright",
    link: "https://github.com/microsoft/playwright-mcp",
    server: { type: "local", command: ["npx", "-y", "@playwright/mcp@latest"] },
  },
  {
    id: "chrome-devtools",
    category: "browser",
    kind: "mcp",
    name: "Chrome DevTools",
    link: "https://github.com/ChromeDevTools/chrome-devtools-mcp",
    server: { type: "local", command: ["npx", "-y", "chrome-devtools-mcp@latest"] },
  },
  {
    id: "github",
    category: "code",
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
    category: "design",
    kind: "mcp",
    name: "Figma",
    link: "https://github.com/figma/mcp-server-guide",
    needsSignIn: true,
    server: { type: "remote", url: "https://mcp.figma.com/mcp" },
  },
  {
    id: "sequential-thinking",
    category: "think",
    kind: "mcp",
    name: "Sequential Thinking",
    link: "https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking",
    server: { type: "local", command: ["npx", "-y", "@modelcontextprotocol/server-sequential-thinking"] },
  },
  {
    id: "memory",
    category: "think",
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
    category: "design",
    kind: "plugin",
    name: "Figma skills (OpenCode ka plugin)",
    link: "https://github.com/anomalyco/opencode/tree/dev/packages/plugins/figma",
    needsSignIn: true,
    local: "packages/plugins/figma",
    spec: "git+https://github.com/anomalyco/opencode.git#path:packages/plugins/figma",
  },
  {
    id: "superpowers",
    category: "skills",
    kind: "skills",
    name: "Superpowers (skills)",
    link: "https://github.com/obra/superpowers",
    repository: "https://github.com/obra/superpowers.git",
    folder: "skills",
  },
  // apna-opencode, 2026-11-17: more tool servers. Each was asked "initialize" first: the ones without needsSignIn
  // answered without any account; the needsSignIn ones answered 401 and offer sign-in that registers this app by
  // itself (an OAuth "registration_endpoint"), which GitHub does not, so they work with the Sign in button.
  {
    id: "anthropic-skills",
    category: "skills",
    kind: "skills",
    name: "Anthropic skills (docs, PDF, Excel, PowerPoint, design)",
    link: "https://github.com/anthropics/skills",
    repository: "https://github.com/anthropics/skills.git",
    folder: "skills",
  },
  {
    id: "deepwiki",
    category: "code",
    kind: "mcp",
    name: "DeepWiki",
    link: "https://docs.devin.ai/work-with-devin/deepwiki-mcp",
    server: { type: "remote", url: "https://mcp.deepwiki.com/mcp" },
  },
  {
    id: "svelte",
    category: "code",
    kind: "mcp",
    name: "Svelte docs",
    link: "https://svelte.dev/docs/mcp/overview",
    server: { type: "remote", url: "https://mcp.svelte.dev/mcp" },
  },
  {
    id: "sentry",
    category: "code",
    kind: "mcp",
    name: "Sentry",
    link: "https://docs.sentry.io/product/sentry-mcp/",
    needsSignIn: true,
    server: { type: "remote", url: "https://mcp.sentry.dev/mcp" },
  },
  {
    id: "semgrep",
    category: "code",
    kind: "mcp",
    name: "Semgrep (security scan)",
    link: "https://github.com/semgrep/mcp",
    needsSignIn: true,
    server: { type: "remote", url: "https://mcp.semgrep.ai/mcp" },
  },
  {
    id: "canva",
    category: "design",
    kind: "mcp",
    name: "Canva",
    link: "https://www.canva.dev/docs/connect/canva-mcp-server-setup/",
    needsSignIn: true,
    server: { type: "remote", url: "https://mcp.canva.com/mcp" },
  },
  {
    id: "exa",
    category: "search",
    kind: "mcp",
    name: "Exa web search",
    link: "https://docs.exa.ai/reference/exa-mcp",
    server: { type: "remote", url: "https://mcp.exa.ai/mcp" },
  },
  {
    id: "microsoft-learn",
    category: "search",
    kind: "mcp",
    name: "Microsoft Learn docs",
    link: "https://github.com/MicrosoftDocs/mcp",
    server: { type: "remote", url: "https://learn.microsoft.com/api/mcp" },
  },
  {
    id: "huggingface",
    category: "search",
    kind: "mcp",
    name: "Hugging Face",
    link: "https://huggingface.co/settings/mcp",
    server: { type: "remote", url: "https://huggingface.co/mcp" },
  },
  {
    id: "supabase",
    category: "data",
    kind: "mcp",
    name: "Supabase",
    link: "https://supabase.com/docs/guides/getting-started/mcp",
    needsSignIn: true,
    server: { type: "remote", url: "https://mcp.supabase.com/mcp" },
  },
  {
    id: "neon",
    category: "data",
    kind: "mcp",
    name: "Neon (Postgres)",
    link: "https://neon.com/docs/ai/neon-mcp-server",
    needsSignIn: true,
    server: { type: "remote", url: "https://mcp.neon.tech/mcp" },
  },
  {
    id: "vercel",
    category: "deploy",
    kind: "mcp",
    name: "Vercel",
    link: "https://vercel.com/docs/mcp/vercel-mcp",
    needsSignIn: true,
    server: { type: "remote", url: "https://mcp.vercel.com" },
  },
  {
    id: "netlify",
    category: "deploy",
    kind: "mcp",
    name: "Netlify",
    link: "https://docs.netlify.com/build/build-with-ai/netlify-mcp-server/",
    needsSignIn: true,
    server: { type: "remote", url: "https://netlify-mcp.netlify.app/mcp" },
  },
  {
    id: "cloudflare",
    category: "deploy",
    kind: "mcp",
    name: "Cloudflare (Workers, KV, D1)",
    link: "https://github.com/cloudflare/mcp-server-cloudflare",
    needsSignIn: true,
    server: { type: "remote", url: "https://bindings.mcp.cloudflare.com/mcp" },
  },
  {
    id: "cloudflare-docs",
    category: "deploy",
    kind: "mcp",
    name: "Cloudflare docs",
    link: "https://github.com/cloudflare/mcp-server-cloudflare",
    server: { type: "remote", url: "https://docs.mcp.cloudflare.com/mcp" },
  },
  {
    id: "aws-knowledge",
    category: "deploy",
    kind: "mcp",
    name: "AWS docs",
    link: "https://awslabs.github.io/mcp/servers/aws-knowledge-mcp-server",
    server: { type: "remote", url: "https://knowledge-mcp.global.api.aws" },
  },
  {
    id: "notion",
    category: "work",
    kind: "mcp",
    name: "Notion",
    link: "https://developers.notion.com/docs/mcp",
    needsSignIn: true,
    server: { type: "remote", url: "https://mcp.notion.com/mcp" },
  },
  {
    id: "linear",
    category: "work",
    kind: "mcp",
    name: "Linear",
    link: "https://linear.app/docs/mcp",
    needsSignIn: true,
    server: { type: "remote", url: "https://mcp.linear.app/mcp" },
  },
  {
    id: "atlassian",
    category: "work",
    kind: "mcp",
    name: "Jira & Confluence (Atlassian)",
    link: "https://support.atlassian.com/rovo/docs/getting-started-with-the-atlassian-remote-mcp-server/",
    needsSignIn: true,
    server: { type: "remote", url: "https://mcp.atlassian.com/v1/mcp" },
  },
]
