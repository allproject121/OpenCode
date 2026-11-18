// Opens a Settings page of the running app (DevTools port 9222) by its name in the Settings list, with clicks made
// inside the page (they work while the window is covered, and never type into a chat).
// Usage: node open-settings.mjs "<page name>"      e.g.  node open-settings.mjs "Cloud-SSD projects"
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
const name = process.argv[2]
const click = (pick) =>
  page.evaluate((input) => {
    const items = [...document.querySelectorAll("button,a,[role=tab],[role=button]")]
    const found = items.find((item) =>
      input.label ? item.getAttribute("aria-label") === input.label : item.textContent?.trim() === input.text,
    )

    found?.click()

    return !!found
  }, pick)

const listed = () => page.evaluate((text) => document.body.innerText.split("\n").includes(text), name)

if (!(await listed())) {
  console.log("Settings button pressed:", await click({ label: "Settings" }))
  await page.waitForTimeout(2500)
}

console.log(`"${name}" pressed:`, await click({ text: name }))
await page.waitForTimeout(3000)
// Detach only: the app keeps running.
await browser.close()
