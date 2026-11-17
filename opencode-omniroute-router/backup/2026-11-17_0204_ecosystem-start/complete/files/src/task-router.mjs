import { classify } from "./classifier.mjs"

export const DEFAULT_TIERS = ["free", "fast", "standard", "strong", "expert"]

/**
 * Optional, not a classifier tier: when `workers.local` is configured, it
 * receives requests that explicitly ask for an offline/local model, and (in
 * the plugin) every request while the cloud gateway is unreachable.
 */
export const LOCAL_TIER = "local"

export const DEFAULT_WORKERS = {
  free: "free-worker",
  fast: "smart-fast",
  standard: "smart-standard",
  strong: "smart-strong",
  expert: "expert",
}

export const DEFAULT_MODELS = {
  "free-worker": "omniroute/auto/fast",
  "smart-fast": "omniroute/auto/fast",
  "smart-standard": "omniroute/auto/coding",
  "smart-strong": "omniroute/auto/smart",
  "expert": "omniroute/auto/pro-coding",
  "local-worker": "ollama/qwen2.5",
}

/**
 * Builds a deterministic tier -> worker -> model router. All three layers
 * are overridable so the plugin works with any OmniRoute setup, any combo
 * names and any agent naming convention.
 */
export function createTaskRouter({
  tiers,
  workers = DEFAULT_WORKERS,
  models: modelOverrides,
} = {}) {
  // Partial model maps fall back to the defaults for unlisted workers.
  const models = { ...DEFAULT_MODELS, ...modelOverrides }
  const tierList = tiers ?? Object.keys(workers)
  for (const tier of tierList) {
    if (!workers[tier]) {
      throw new TypeError(`no worker configured for tier: ${tier}`)
    }
  }

  const workerSet = new Set(Object.values(workers))
  const workerByTier = new Map(tierList.map((tier) => [tier, workers[tier]]))
  const localWorker = workerByTier.get(LOCAL_TIER)

  return {
    tiers: tierList,
    workers,
    models,
    workerByTier,
    localWorker,

    isWorkerTaskArgs(args) {
      return typeof args === "object"
        && args !== null
        && workerSet.has(args.subagent_type)
    },

    /**
     * Full routing decision for a request.
     * `gatewayDown: true` sends the request to the local worker (if any).
     * Returns { worker, tier, reason, explore?, local?, fallback? }.
     */
    decide(request, { gatewayDown = false } = {}) {
      if (typeof request !== "string") {
        throw new TypeError("request must be a string")
      }

      const classification = classify(request)
      const { tier } = classification

      if (localWorker && classification.local) {
        return { ...classification, worker: localWorker }
      }
      if (localWorker && gatewayDown) {
        return { ...classification, worker: localWorker, local: true, fallback: "gateway-unreachable" }
      }

      const worker = workerByTier.get(tier)
      if (!worker) {
        throw new TypeError(`no worker mapped for tier: ${tier}`)
      }
      const { local, ...rest } = classification
      return { ...rest, worker }
    },

    routeTaskArgs(args, request = args?.prompt, options = {}) {
      if (!this.isWorkerTaskArgs(args)) {
        throw new TypeError("args must select a managed worker")
      }

      const { worker } = this.decide(request, options)

      return {
        ...args,
        subagent_type: worker,
      }
    },
  }
}

export const defaultRouter = createTaskRouter()
