// Makes the card pictures of the Images page once, with a free AI Horde model through the router, and saves them as
// opencode/packages/gui-plugins/src/apna-images/ideas/<id>.webp. Pictures already there are kept.
// Usage: bun run tools/make-idea-pictures.ts
import { existsSync, mkdirSync, writeFileSync } from "node:fs"
import path from "node:path"
import { ideas, templates } from "../opencode/packages/gui-plugins/src/apna-images/ideas"

const folder = path.join(import.meta.dir, "../opencode/packages/gui-plugins/src/apna-images/ideas")
const key = process.env.OMNIROUTE_API_KEY
const jobs = [
  ...ideas.map((idea) => ({ id: idea.id, prompt: idea.prompt })),
  ...templates.map((template) => ({ id: `template-${template.id}`, prompt: template.sample })),
]

mkdirSync(folder, { recursive: true })

const make = async (job: { id: string; prompt: string }) => {
  const file = path.join(folder, `${job.id}.webp`)

  if (existsSync(file)) return console.log(`kept ${job.id}`)
  for (let attempt = 1; attempt <= 3; attempt++) {
    const started = Date.now()
    const response = await fetch("http://127.0.0.1:20128/v1/images/generations", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({ model: "aihorde/Dreamshaper", prompt: job.prompt, n: 1, size: "512x512" }),
      signal: AbortSignal.timeout(600_000),
    }).catch((error) => error as Error)

    if (response instanceof Error || !response.ok) {
      console.log(`retry ${job.id}: ${response instanceof Error ? response.message : response.status}`)
      continue
    }
    const json = (await response.json()) as { data?: { b64_json?: string }[] }
    const data = json.data?.[0]?.b64_json

    if (!data) {
      console.log(`retry ${job.id}: no picture`)
      continue
    }
    writeFileSync(file, Buffer.from(data, "base64"))

    return console.log(`made ${job.id} in ${Math.round((Date.now() - started) / 1000)} s`)
  }
  console.log(`FAILED ${job.id}`)
}

// Two at a time: the free queue gives each request its own turn.
const queue = [...jobs]
await Promise.all([0, 1].map(async () => {
  while (queue.length) await make(queue.shift()!)
}))
