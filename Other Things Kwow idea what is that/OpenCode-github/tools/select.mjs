// Picks an option in one of the app's drop-down selects (DevTools port 9222) with real pointer events.
// Usage: node select.mjs "<row text the select sits in>" "<option text>"
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
const [row, option] = process.argv.slice(2)

// The select's button is the one that opens a list box, nearest to the row's text.
const box = await page.evaluate((row) => {
  const depth = (button) => {
    let node = button
    let steps = 0

    while (node && !(node.innerText ?? "").includes(row)) {
      node = node.parentElement
      steps++
    }

    return node ? steps : Infinity
  }
  const triggers = [...document.querySelectorAll('[aria-haspopup="listbox"]')].sort(
    (a, b) => depth(a) - depth(b),
  )
  const target = triggers[0]

  target?.scrollIntoView({ block: "center" })
  const rect = target?.getBoundingClientRect()

  return rect ? { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2, text: target.textContent } : undefined
}, row)

if (!box) {
  console.log("no select found near", row)
} else {
  await page.mouse.click(box.x, box.y)
  await page.waitForTimeout(600)
  const item = await page.evaluate((option) => {
    const found = [...document.querySelectorAll('[role="option"]')].find((node) => node.textContent?.trim() === option)
    const rect = found?.getBoundingClientRect()

    return rect ? { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 } : undefined
  }, option)

  if (!item) console.log(`no option "${option}"; select showed "${box.text}"`)
  else {
    await page.mouse.click(item.x, item.y)
    await page.waitForTimeout(500)
    console.log(`picked "${option}" (was "${box.text?.trim()}")`)
  }
}

// Detach only: the app keeps running.
await browser.close()
