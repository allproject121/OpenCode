// Presses things in the running app by accessible name and takes screenshots (DevTools port 9222).
// Usage: node ui-press.mjs <step> [<step> ...]
//   label:<aria-label>     click the first element with this aria-label
//   item:<text>            click the first menu item (role=menuitem) with this text
//   row:<text>             click the first sidebar button whose text is exactly this
//   key:<keys>             press keys, e.g. key:Escape or key:Control+Backquote
//   css:<selector>         click the first match of a CSS selector
//   type:<text>            type text into whatever has focus
//   wait:<ms>              wait
//   shot:<file.png>        screenshot into Programming\logs
//   text:<selector>        print innerText of the first match (default body), first 3000 chars
//   clip                   print the clipboard text
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

for (const step of process.argv.slice(2)) {
  const [name, ...rest] = step.split(":")
  const value = rest.join(":")

  if (name === "label") await page.locator(`[aria-label="${value}"]`).first().click({ timeout: 8000 })
  else if (name === "css") await page.locator(value).first().click({ timeout: 8000 })
  else if (name === "type") await page.keyboard.type(value, { delay: 15 })
  else if (name === "js") await page.evaluate((selector) => document.querySelector(selector)?.click(), value)
  else if (name === "fill") {
    const [selector, text] = value.split("|")
    await page.locator(selector).first().fill(text, { force: true })
  }
  else if (name === "item") await page.getByRole("menuitem", { name: value }).first().click({ timeout: 8000 })
  else if (name === "row")
    await page
      .locator("button")
      .filter({ hasText: new RegExp(`^${value}$`) })
      .first()
      .click({ timeout: 8000 })
  else if (name === "key") await page.keyboard.press(value)
  else if (name === "wait") await page.waitForTimeout(Number(value))
  else if (name === "shot") {
    await page.screenshot({ path: `C:/Users/Roshan/Downloads/Programming/logs/${value}` })
    console.log(`saved ${value}`)
  } else if (name === "text")
    console.log((await page.locator(value || "body").first().innerText()).slice(0, 3000))
  else if (name === "clip") console.log(await page.evaluate(() => navigator.clipboard.readText()))
  else console.log(`unknown step ${step}`)
}

await browser.close()
