import { createTaskRouter, DEFAULT_WORKERS, DEFAULT_MODELS } from "./task-router.mjs"
import { createHistoryRecorder } from "./history-recorder.mjs"

export const VERIFICATION_EVIDENCE =/\b\d+ (?:pass|tests)\b|\bfail 0\b|✓|all tests passed/i

export const DEFAULT_GATEWAY_URL = "http://localhost:20128"
const HEALTH_TTL_MS = 30_000

/**
 * Reachability probe for the OmniRoute gateway: any HTTP answer (even 401)
 * means the gateway process is up; only a network error/timeout means down.
 */
export async function probeGateway(url = DEFAULT_GATEWAY_URL, timeoutMs = 1500) {
  try {
    await fetch(new URL("/v1/models", url), { signal: AbortSignal.timeout(timeoutMs) })
    return true
  } catch {
    return false
  }
}

function createGatewayHealth({ gatewayUrl = DEFAULT_GATEWAY_URL, healthCheck = probeGateway, now = Date.now } = {}) {
  let cached = null
  return async () => {
    if (cached && now() - cached.at < HEALTH_TTL_MS) return cached.up
    const up = await healthCheck(gatewayUrl).catch(() => false)
    cached = { at: now(), up }
    return up
  }
}

/**
 * Plugin factory (library API). OpenCode itself loads `src/plugin.mjs`, which
 * must export only plugin functions; it calls this factory with the options
 * from opencode.json:
 *
 *   "plugin": [["opencode-omniroute-router", { "historyDir": "...", "workers": {...}, "models": {...} }]]
 *
 * Guarantees, per user turn (guards reset on every chat.message):
 *   - at most one exploration Task (subagent_type "explore"), never after dispatch
 *   - at most one managed worker Task, routed deterministically by the classifier
 * Dispatch and outcome events are appended to the history log; recording
 * failures never break routing.
 */
export function createSmartRouterPlugin(options = {}) {
  const router = options.router ?? createTaskRouter(options)
  const exploreAgent = options.exploreAgent ?? "explore"
  // Offline fallback only makes sense when a local worker exists.
  const localFallback = Boolean(router.localWorker) && options.localFallback !== false
  const gatewayUp = createGatewayHealth(options)

  return async ({ client, historyDir = options.historyDir } = {}) => {
    const routedSessions = new Set()
    const exploreSessions = new Set()
    const userRequests = new Map()
    const routedCalls = new Map()
    const recorder = createHistoryRecorder(historyDir ? { dir: historyDir } : {})

    await client.app.log({
      body: {
        service: "opencode-omniroute-router",
        level: "info",
        message: "deterministic task routing plugin initialized",
        extra: { workers: Object.values(router.workers), localFallback },
      },
    })

    return {
      "chat.message": async (input, output) => {
        const request = output.parts
          .filter((part) => part.type === "text" && typeof part.text === "string" && !part.synthetic)
          .map((part) => part.text)
          .join("\n")
          .trim()

        // Dispatch guards are per user turn: a multi-turn session may route
        // once per message (exploration + worker), so reset them here.
        routedSessions.delete(input.sessionID)
        exploreSessions.delete(input.sessionID)

        if (request) userRequests.set(input.sessionID, request)
      },
      "tool.execute.before": async (input, output) => {
        if (input.tool !== "task") return

        if (output.args?.subagent_type === exploreAgent) {
          if (routedSessions.has(input.sessionID)) {
            throw new Error("exploration is not allowed after the worker Task has been dispatched")
          }
          if (exploreSessions.has(input.sessionID)) {
            throw new Error("only one exploration Task is allowed per session")
          }
          exploreSessions.add(input.sessionID)

          await client.app.log({
            body: {
              service: "opencode-omniroute-router",
              level: "info",
              message: "deterministic task routing exploration",
              extra: {
                sessionID: input.sessionID,
                selectedWorker: exploreAgent,
              },
            },
          })
          return
        }

        if (!router.isWorkerTaskArgs(output.args)) return

        if (routedSessions.has(input.sessionID)) {
          throw new Error("only one worker Task is allowed per user turn")
        }

        const request = userRequests.get(input.sessionID)
        if (!request) {
          throw new Error("cannot route Task without the original user request")
        }

        const requestedWorker = output.args.subagent_type
        let decision = router.decide(request)
        if (localFallback && decision.worker !== router.localWorker && !(await gatewayUp())) {
          decision = router.decide(request, { gatewayDown: true })
        }
        const { tier, reason, worker: selectedWorker, local, fallback } = decision
        output.args.subagent_type = selectedWorker
        routedSessions.add(input.sessionID)

        const model = router.models[selectedWorker]

        routedCalls.set(input.callID, {
          sessionId: input.sessionID,
          selectedWorker,
          model,
          tier,
          local,
          fallback,
        })

        await client.app.log({
          body: {
            service: "opencode-omniroute-router",
            level: "info",
            message: "deterministic task routing",
            extra: {
              sessionID: input.sessionID,
              requestedWorker,
              selectedWorker,
              local,
              fallback,
            },
          },
        })

        await recorder
          .record({
            type: "dispatch",
            sessionId: input.sessionID,
            requestedWorker,
            selectedWorker,
            tier,
            reason,
            exploreUsed: exploreSessions.has(input.sessionID) || undefined,
            model,
            local,
            fallback,
            request: request.slice(0, 2000),
          })
          .catch(() => {})
      },
      "tool.execute.after": async (input, output) => {
        const routedInfo = routedCalls.get(input.callID)
        if (!routedInfo) return
        routedCalls.delete(input.callID)

        const text =
          typeof output === "string"
            ? output
            : typeof output?.output === "string"
              ? output.output
              : typeof output?.result === "string"
                ? output.result
                : ""

        await recorder
          .record({
            type: "outcome",
            sessionId: routedInfo.sessionId,
            selectedWorker: routedInfo.selectedWorker,
            model: routedInfo.model,
            outputChars: text.length,
            verificationEvidence: VERIFICATION_EVIDENCE.test(text) || undefined,
            local: routedInfo.local,
            fallback: routedInfo.fallback,
            preview: text.slice(0, 500),
          })
          .catch(() => {})

        // Tell the orchestrator which worker/model really ran, so its
        // ROUTE/MODEL lines match the plugin's decision (including fallbacks).
        if (output && typeof output === "object" && typeof output.output === "string") {
          output.output = `${routedLine(routedInfo)}\n${output.output}`
        }
      },
    }
  }
}

export function routedLine({ selectedWorker, model, tier, local, fallback }) {
  const parts = [`ROUTED: ${selectedWorker}`, `MODEL: ${model ?? "unknown"}`, `TIER: ${tier}`]
  if (local) parts.push("LOCAL")
  if (fallback === "gateway-unreachable") parts.push("FALLBACK: OmniRoute unreachable")
  return parts.join(" | ")
}

export { DEFAULT_WORKERS, DEFAULT_MODELS }
