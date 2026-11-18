/** An AI provider the router can use with an API key the user pastes. What it is good for is copy: `note.<id>`. */
export type RouterProvider = {
  /** The router's own id for the provider. */
  readonly id: string
  readonly name: string
  /** The page of the provider's website where a key is made. */
  readonly keyUrl: string
  /** The provider has a free tier. */
  readonly free: boolean
}

/** The providers offered on the page. Any other provider is added from the router's own dashboard. */
export const providers: readonly RouterProvider[] = [
  {
    id: "gemini",
    name: "Gemini (Google AI Studio)",
    keyUrl: "https://aistudio.google.com/apikey",
    free: true,
  },
  {
    id: "groq",
    name: "Groq",
    keyUrl: "https://console.groq.com/keys",
    free: true,
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    keyUrl: "https://openrouter.ai/settings/keys",
    free: true,
  },
  {
    id: "cerebras",
    name: "Cerebras",
    keyUrl: "https://cloud.cerebras.ai/",
    free: true,
  },
  {
    id: "mistral",
    name: "Mistral",
    keyUrl: "https://console.mistral.ai/api-keys",
    free: true,
  },
  {
    id: "nvidia",
    name: "NVIDIA NIM",
    keyUrl: "https://build.nvidia.com/settings/api-keys",
    free: true,
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    keyUrl: "https://platform.deepseek.com/api_keys",
    free: false,
  },
  {
    id: "openai",
    name: "OpenAI",
    keyUrl: "https://platform.openai.com/api-keys",
    free: false,
  },
  {
    id: "anthropic",
    name: "Anthropic",
    keyUrl: "https://console.anthropic.com/settings/keys",
    free: false,
  },
  {
    id: "xai",
    name: "xAI (Grok)",
    keyUrl: "https://console.x.ai/",
    free: false,
  },
]

/** The router's local address. The app only ever talks to this machine. */
export const routerUrl = "http://127.0.0.1:20128"

/** One connection as the router lists it. */
export type RouterConnection = {
  readonly id: string
  readonly provider: string
  readonly name: string
  readonly active: boolean
  /** The router's last test result, such as "active" or "error". */
  readonly status: string | null
}

const text = (value: unknown) => (typeof value === "string" ? value : undefined)

function fields(value: unknown): Readonly<Record<string, unknown>> | undefined {
  return typeof value === "object" && value !== null ? Object.fromEntries(Object.entries(value)) : undefined
}

/** Reads the router's connection list, keeping only what the page shows. Keys and tokens are never kept. */
export function readConnections(body: unknown): readonly RouterConnection[] {
  const list = fields(body)?.connections

  if (!Array.isArray(list)) return []

  return list.flatMap((entry) => {
    const item = fields(entry)
    const id = text(item?.id)
    const provider = text(item?.provider)

    if (!item || id === undefined || provider === undefined) return []

    return [
      {
        id,
        provider,
        name: text(item.name) ?? provider,
        active: item.isActive !== false,
        status: text(item.testStatus) ?? null,
      },
    ]
  })
}

/** The message of a router error reply, whatever shape it has; undefined when it carries none. */
export function readError(body: unknown): string | undefined {
  const record = fields(body)
  const error = record?.error

  return text(error) ?? text(fields(error)?.message) ?? text(record?.message)
}

/**
 * Why the router's key test failed; undefined when the key works. The router answers a refused key with HTTP 200
 * and `valid: false`, so the body decides, not the status alone.
 */
export function readTestFailure(ok: boolean, status: number, body: unknown): string | undefined {
  const failure = readError(body)

  if (!ok) return failure ?? `The key test answered ${status}.`
  if (fields(body)?.valid === false) return failure ?? "The provider refused this key."

  return undefined
}

/** A connection name that is not taken yet: "main", then "main-2", "main-3"... */
export function freeName(taken: readonly string[]) {
  if (!taken.includes("main")) return "main"
  const next = Array.from({ length: taken.length + 1 }, (_, index) => `main-${index + 2}`).find(
    (name) => !taken.includes(name),
  )

  return next ?? `main-${taken.length + 2}`
}
