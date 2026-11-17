// One-off: gives every local (npx) tool server in this app's settings the longer start time the Plugins page now
// writes for new ones. Keeps everything else as it is.
import { readFileSync, renameSync, writeFileSync } from "node:fs"
import { formatConfig, localStartupMs, parseConfig } from "../opencode/packages/gui-plugins/src/plugin-store/config"

const file = "C:/Users/Roshan/Downloads/Programming/config/opencode.jsonc"
const config = parseConfig(readFileSync(file, "utf8")) as any
const servers = config.mcp?.servers ?? {}
const changed: string[] = []

for (const [name, server] of Object.entries<any>(servers)) {
  if (server?.type !== "local" || server.timeout) continue
  server.timeout = { startup: localStartupMs, catalog: localStartupMs }
  changed.push(name)
}

writeFileSync(`${file}.tmp`, formatConfig(config), "utf8")
renameSync(`${file}.tmp`, file)
console.log("timeout added to:", changed.join(", ") || "(none)")
