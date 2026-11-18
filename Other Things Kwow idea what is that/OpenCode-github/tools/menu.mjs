// Clicks, with real pointer events, the element whose text matches (the lowest such element on the page when
// several match), then prints the menu / list items that opened and optionally clicks one of them.
// Usage: node menu.mjs "<text to click>" ["<menu item to click>"]
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
const [text, pick] = process.argv.slice(2)
const point = (selector, wanted) =>
  page.evaluate(
    (input) => {
      const found = [...document.querySelectorAll(input.selector)]
        .filter((node) => node.textContent?.trim() === input.wanted && node.getBoundingClientRect().width > 0)
        .sort((a, b) => b.getBoundingClientRect().y - a.getBoundingClientRect().y)[0]
      const rect = found?.getBoundingClientRect()

      return rect ? { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 } : undefined
    },
    { selector, wanted },
  )
const items = () =>
  page.evaluate(() =>
    [...document.querySelectorAll('[role="menuitem"],[role="option"],[role="menuitemradio"],[role="menuitemcheckbox"]')]
      .map((node) => node.textContent?.trim().replace(/\s+/g, " "))
      .filter(Boolean),
  )
const target = await point("button, [role=button], a, span, div", text)

if (!target) console.log(`nothing with the text "${text}"`)
else {
  await page.mouse.click(target.x, target.y)
  await page.waitForTimeout(900)
  console.log("opened:", await items())
  if (pick) {
    const item = await point('[role="menuitem"],[role="option"],[role="menuitemradio"],[role="menuitemcheckbox"]', pick)

    if (!item) console.log(`no item "${pick}"`)
    else {
      await page.mouse.click(item.x, item.y)
      await page.waitForTimeout(1500)
      console.log(`picked "${pick}"`)
    }
  }
}

// Detach only: the app keeps running.
await browser.close()
