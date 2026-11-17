// Prints the open dialog of the running app (DevTools port 9222), or presses a button inside it first.
// Usage: node dialog.mjs [button text] [waitMs]
import { createRequire } from "node:module"
const require = createRequire("C:/Users/Roshan/Downloads/Programming/opencode/node_modules/.bun/playwright-core@1.60.0/node_modules/playwright-core/package.json")
const { chromium } = require("playwright-core")
const browser = await chromium.connectOverCDP("http://127.0.0.1:9222", { noDefaults: true })
const page = browser.contexts().flatMap((c) => c.pages()).find((p) => /localhost:5173/.test(p.url()))
const text = process.argv[2]
if (text) console.log("pressed:", await page.evaluate((text) => {
  const dialog = document.querySelector('[role="dialog"],[role="alertdialog"]')
  const button = dialog && [...dialog.querySelectorAll("button")].find((b) => b.textContent?.trim() === text)
  if (button?.disabled) return "DISABLED"
  button?.click()
  return !!button
}, text))
await page.waitForTimeout(Number(process.argv[3] ?? 2500))
console.log("DIALOG:", await page.evaluate(() => (document.querySelector('[role="dialog"],[role="alertdialog"]')?.innerText ?? "(none)").replace(/\n+/g, " | ").slice(0, 700)))
await browser.close()
