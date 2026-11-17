// Quick health check of router (OmniRoute) chat models: 3 questions each, straight to http://127.0.0.1:20128.
// Q1 math (answer 9), Q2 Hinglish coding answer, Q3 tool call (must call read_file with index.html).
// Usage: node model-check.mjs <out.json> model1 model2 ...
import { writeFileSync } from "node:fs"

const key = process.env.OMNIROUTE_API_KEY
const [out, ...models] = process.argv.slice(2)

const call = async (model, body) => {
  const start = Date.now()
  try {
    const res = await fetch("http://127.0.0.1:20128/v1/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body: JSON.stringify({ model, stream: false, max_tokens: 1500, ...body }),
      signal: AbortSignal.timeout(120_000),
    })
    const text = await res.text()
    const ms = Date.now() - start
    if (!res.ok) return { ok: false, ms, error: `${res.status} ${text.slice(0, 200)}` }
    const json = JSON.parse(text)
    const msg = json.choices?.[0]?.message ?? {}
    return { ok: true, ms, served: json.model, content: (msg.content ?? "").toString(), tools: msg.tool_calls ?? [] }
  } catch (e) {
    return { ok: false, ms: Date.now() - start, error: String(e.message ?? e).slice(0, 200) }
  }
}

const tool = {
  type: "function",
  function: {
    name: "read_file",
    description: "Read a file from the project",
    parameters: { type: "object", properties: { path: { type: "string" } }, required: ["path"] },
  },
}

const check = async (model) => {
  const q1 = await call(model, {
    messages: [
      {
        role: "user",
        content:
          "A shop sells pens at 7 rupees each. Ravi buys 13 pens and pays with a 100 rupee note. How much change does he get? Reply with only the number.",
      },
    ],
  })
  const q2 = await call(model, {
    messages: [{ role: "user", content: "Hinglish me sirf 2 line me batao: Python me list ko ulta (reverse) kaise karte hain?" }],
  })
  const q3 = await call(model, {
    messages: [{ role: "user", content: "Please read the file index.html of my project using your tool." }],
    tools: [tool],
  })
  const math = q1.ok ? (/(^|\D)9(\D|$)/.test(q1.content.trim()) && !/91/.test(q1.content) ? "right" : "WRONG") : "fail"
  const hing = q2.ok ? (/reverse|\[::-1\]|reversed/i.test(q2.content) ? "right" : "WRONG") : "fail"
  const used = q3.ok
    ? q3.tools.some((t) => t.function?.name === "read_file" && /index\.html/.test(t.function?.arguments ?? ""))
      ? "right"
      : "no-tool"
    : "fail"
  const row = { model, math, hing, tool: used, q1, q2, q3 }
  console.log(
    `${model.padEnd(42)} math:${math.padEnd(6)} hinglish:${hing.padEnd(6)} tool:${used.padEnd(8)} ${Math.round((q1.ms + q2.ms + q3.ms) / 3000)}s served:${[q1.served, q2.served, q3.served].join(",")}` +
      (q1.ok ? "" : `  ERR ${q1.error.slice(0, 120)}`),
  )
  return row
}

const results = []
const queue = [...models]
await Promise.all(
  Array.from({ length: 6 }, async () => {
    while (queue.length) results.push(await check(queue.shift()))
  }),
)
writeFileSync(out, JSON.stringify(results, null, 2))
