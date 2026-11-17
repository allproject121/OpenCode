// Presses a button in the running app (DevTools port 9222) by its exact text, picking the one nearest to a row's
// text, then prints that row's lines. Works while the window is covered or minimised (the click runs in the page).
// Usage: node press.mjs <button text | ""> <row text> [waitMs] [linesToPrint]
//   node press.mjs Add Playwright 20000      press "Add" in the Playwright row, wait 20 s, print the row
//   node press.mjs "" Playwright 0           press nothing, only print the row
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
const [text, scope, wait = "4000", count = "6"] = process.argv.slice(2)

if (text) {
  const found = await page.evaluate(
    (input) => {
      const depth = (button) => {
        let node = button
        let steps = 0

        while (node && !(node.innerText ?? "").includes(input.scope)) {
          node = node.parentElement
          steps++
        }

        return node ? steps : Infinity
      }
      const buttons = [...document.querySelectorAll("button")]
        .filter((button) => button.textContent?.trim() === input.text)
        .sort((a, b) => depth(a) - depth(b))

      buttons[0]?.click()

      return buttons.length
    },
    { text, scope },
  )

  console.log(`pressed "${text}" (${found} such buttons)`)
}

await page.waitForTimeout(Number(wait))
const lines = (await page.evaluate(() => document.body.innerText)).split("\n")
const at = lines.indexOf(scope)

console.log(at < 0 ? `(no line "${scope}" on the page)` : lines.slice(at, at + Number(count)).join("\n"))
// Detach only: the app keeps running.
await browser.close()
