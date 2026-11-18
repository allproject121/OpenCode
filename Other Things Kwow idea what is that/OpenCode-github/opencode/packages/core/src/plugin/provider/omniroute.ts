import { define } from "@opencode/plugin/effect/plugin"
import { Effect, Schema } from "effect"
import { createLocalProviderPlugin } from "./local.js"

// apna-opencode: OmniRoute (local AI router, https://github.com/diegosouzapw/OmniRoute) as a built-in provider.
// Models appear by themselves while the router answers on its default port; the key comes from /connect, the
// OMNIROUTE_API_KEY integration env var, or `providers.omniroute.settings.apiKey`.

const RemoteModel = Schema.Struct({
  id: Schema.String,
  owned_by: Schema.String.pipe(Schema.optional),
  name: Schema.String.pipe(Schema.optional),
  // Present only on non-chat models: "image", "embedding", "audio", "video".
  type: Schema.String.pipe(Schema.optional),
  context_length: Schema.NullOr(Schema.Number).pipe(Schema.optional),
  input_modalities: Schema.Array(Schema.String).pipe(Schema.optional),
  capabilities: Schema.Struct({ tool_calling: Schema.Boolean.pipe(Schema.optional) }).pipe(Schema.optional),
})

const ModelsResponse = Schema.Struct({ data: Schema.Array(RemoteModel) })

const ConnectionsResponse = Schema.Struct({
  connections: Schema.Array(
    Schema.Struct({ provider: Schema.String, isActive: Schema.Boolean.pipe(Schema.optional) }),
  ),
})

export const make = createLocalProviderPlugin({
  id: "opencode.provider.omniroute",
  providerID: "omniroute",
  name: "OmniRoute",
  origin: "http://127.0.0.1:20128",
  discover: (client) =>
    Effect.gen(function* () {
      const response = yield* client.getJson("/v1/models", ModelsResponse)
      // The router lists every free web channel it knows (hundreds of models). Keep its combos and the models of
      // the providers the user connected; when the connection list cannot be read, keep the combos alone.
      const connected = yield* client.getJson("/api/providers", ConnectionsResponse).pipe(
        Effect.map(
          (result) =>
            new Set(result.connections.filter((item) => item.isActive !== false).map((item) => item.provider)),
        ),
        Effect.orElseSucceed(() => new Set<string>()),
      )
      return response.data
        .filter(
          (model) =>
            model.id.length > 0 &&
            model.type === undefined &&
            (model.owned_by === "combo" || (model.owned_by !== undefined && connected.has(model.owned_by))),
        )
        .toSorted((a, b) => a.id.localeCompare(b.id))
    }),
  model: (item) => ({
    id: item.id,
    name: item.name || item.id,
    tools: item.capabilities?.tool_calling ?? false,
    vision: item.input_modalities?.includes("image"),
    context: item.context_length,
  }),
})

export const OmniRoutePlugin = make()

/**
 * Lists OmniRoute under /connect while it has no models: the router rejects requests without its client key, so the
 * user pastes that key once (or sets OMNIROUTE_API_KEY) and the models appear.
 */
export const OmniRouteIntegrationPlugin = define({
  id: "opencode.provider.omniroute.integration",
  effect: Effect.fn(function* (ctx) {
    yield* ctx.integration.transform((integrations) => {
      integrations.update("omniroute", (integration) => (integration.name = "OmniRoute"))
      integrations.method.update({ integrationID: "omniroute", method: { type: "key", label: "OmniRoute API key" } })
      integrations.method.update({
        integrationID: "omniroute",
        method: { type: "env", names: ["OMNIROUTE_API_KEY"] },
      })
    })
  }),
})
