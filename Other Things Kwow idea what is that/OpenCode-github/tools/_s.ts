import { Database } from "bun:sqlite"
const db = new Database("C:/Users/Roshan/.local/share/opencode/opencode-local.db", { readonly: true })
const since = Date.now() - 40 * 60_000
const rows = db.query(`select id,title,directory,time_created,time_idle,idle_outcome from session_v2 where time_created > ? order by time_created`).all(since) as any[]
for (const s of rows) {
  const first = db.query(`select substr(data,1,160) as d from session_message where session_id=? and type='user' order by seq limit 1`).get(s.id) as any
  console.log(new Date(s.time_created).toTimeString().slice(0, 8), s.id.slice(0, 14), (s.directory ?? "").split("\\").pop(), "|", s.title, "| idle", s.time_idle ? new Date(s.time_idle).toTimeString().slice(0, 8) : "-", s.idle_outcome ?? "", "|", String(first?.d ?? "").replace(/\s+/g, " ").slice(30, 140))
}
