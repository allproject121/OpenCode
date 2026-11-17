#!/usr/bin/env bun
// Apna OpenCode ka Windows installer (.exe) banata hai.
// Chalao (Git Bash, Programming folder se):  bun tools/installer/build.ts
// Nateeja: Programming\dist-installer\Apna-OpenCode-Setup-<version>.exe
// Kya hota hai: README.md (isi folder me).
import { $ } from "bun"
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import path from "node:path"

const root = path.resolve(import.meta.dir, "../..")
const opencode = path.join(root, "opencode")
const desktop = path.join(opencode, "packages", "desktop")
const version = process.env.APNA_VERSION ?? "2.3.0-apna.1"
const env = { ...process.env, OPENCODE_CHANNEL: "local", OPENCODE_VERSION: version }
const step = (text: string) => console.log(`\n=== ${new Date().toLocaleTimeString()} ${text}`)

// 1. Settings + skills + plugins -> desktop\apna-config (installer isse resources\apna-config me rakhta hai).
step("settings bundle")
const bundle = path.join(desktop, "apna-config")
rmSync(bundle, { recursive: true, force: true })
const config = path.join(root, "config")
// service-local.json = is PC ke local server ka password; doosre PC par naya banta hai.
cpSync(config, bundle, { recursive: true, filter: (file) => path.basename(file) !== "service-local.json" })

for (const name of ["workflow", "figma"]) {
  const source = path.join(opencode, "packages", "plugins", name)
  const target = path.join(bundle, "plugins", name)
  // effect aur @opencode/plugin server khud deta hai; baaki sab ek file me.
  await $`bun build ${path.join(source, "index.ts")} --target=bun --outdir=${target} --external effect --external "effect/*" --external @opencode/plugin --external "@opencode/plugin/*"`
  cpSync(path.join(source, "skills"), path.join(target, "skills"), { recursive: true })
  writeFileSync(
    path.join(target, "package.json"),
    JSON.stringify({ name: `apna-plugin-${name}`, type: "module", exports: { ".": "./index.js", "./server": "./index.js" } }, null, 2),
  )
}

const file = path.join(bundle, "opencode.jsonc")
const configJson = JSON.stringify(config).slice(1, -1)
const text = readFileSync(file, "utf8")
  .replace(/"[^"\n]*packages[\\/]+plugins[\\/]+workflow"/, '"./plugins/workflow"')
  .replace(/"[^"\n]*packages[\\/]+plugins[\\/]+figma"/, '"./plugins/figma"')
  .replaceAll(configJson, "__APNA_CONFIG__")
if (/Users[\\/]+Roshan/i.test(text)) throw new Error("opencode.jsonc me abhi bhi is PC ka raasta hai")
writeFileSync(file, text)

// 2. Server (CLI), "local" channel: opencode-local.db + service-local.json, jaise dev launcher.
step("CLI build")
await $`bun run script/build.ts --single --baseline`.cwd(path.join(opencode, "packages", "cli")).env(env)

// 3. Desktop app build.
step("desktop build")
await $`bun run build`.cwd(desktop).env(env)

// 4. Pack: pehle khula app, phir uske around NSIS installer. pack.ts har baar dist\desktop saaf karta hai,
// isliye khula app beech me alag jagah rakhte hain.
step("pack app")
await $`bun run pack`.cwd(desktop).env(env)
const dist = path.join(opencode, "dist", "desktop")
const staged = path.join(root, "dist-installer", "app")
rmSync(path.join(root, "dist-installer"), { recursive: true, force: true })
mkdirSync(path.dirname(staged), { recursive: true })
cpSync(path.join(dist, "app"), staged, { recursive: true })

step("pack installer")
await $`bun run pack`.cwd(desktop).env({ ...env, OPENCODE_DESKTOP_APP: staged })
const setup = path.join(root, "dist-installer", `Apna-OpenCode-Setup-${version}.exe`)
cpSync(path.join(dist, "opencode-desktop-win-x64.exe"), setup)
if (!existsSync(setup)) throw new Error("installer nahi bana")
step(`DONE: ${setup}`)
