// Presses home-rail icons (by their label) in the running app and prints what opens: the visible settings panel's
// first lines and whether the page also has an entry in the Settings list. DevTools port 9222.
// Usage: node rail-check.mjs Images "Offline models" Router Customize
import { createRequire } from "node:module"

const require = createRequire(
  "C:/Users/Roshan/Downloads/Programming/opencode/node_modules/.bun/playwright-core@1.60.0/node_modules/playwright-core/package.json",
)
const { chromium } = require("playwright-core")
const browser = await chromium.connectOverCDP("http://127.0.0.1:9222", { noDefaults: true })
const page = browser
  .contexts()
  .flatMap((context) => context.pages())
  .find((item) => /localhost:5173|oc:\/\/renderer/.test(item.url()))

for (const label of process.argv.slice(2)) {
  const pressed = await page.evaluate((name) => {
    const button = document.querySelector(`nav[aria-label="Main navigation"] button[aria-label="${name}"], button[aria-label="${name}"]`)
    button?.click()
    return !!button
  }, label)
  await page.waitForTimeout(2500)
  const seen = await page.evaluate(() => {
    const panel = [...document.querySelectorAll('[role="tabpanel"]')].find((item) => item.offsetParent !== null)
    const list = [...document.querySelectorAll('[role="tab"]')].filter((item) => item.offsetParent !== null).map((item) => item.textContent.trim())
    return { panel: panel ? panel.innerText.split("\n").filter(Boolean).slice(0, 3).join(" | ") : "(no settings panel)", list }
  })
  console.log(`== ${label}: pressed=${pressed}`)
  console.log(`   opened: ${seen.panel}`)
  console.log(`   in Settings list: ${seen.list.some((item) => item.startsWith(label)) ? "YES" : "no"}`)
}
await browser.close()
