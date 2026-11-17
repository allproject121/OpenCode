// Read-only: reports where the Images page and its composer sit, without clicking or typing.
import { createRequire } from "node:module"
const require = createRequire("C:/Users/Roshan/Downloads/Programming/opencode/node_modules/.bun/playwright-core@1.60.0/node_modules/playwright-core/package.json")
const { chromium } = require("playwright-core")
const browser = await chromium.connectOverCDP("http://127.0.0.1:9222", { noDefaults: true })
const page = browser.contexts().flatMap((c) => c.pages()).find((p) => /localhost:5173|oc:\/\/renderer/.test(p.url()))
console.log(await page.evaluate(() => {
  const root = document.querySelector(".apna-images")
  if (!root) return "not on Images: " + (document.querySelector(".settings-tab-title")?.textContent ?? document.title)
  const r = (el) => { const b = el.getBoundingClientRect(); return `top=${Math.round(b.top)} bottom=${Math.round(b.bottom)} h=${Math.round(b.height)}` }
  return [`window h=${innerHeight}`, `page ${r(root)}`, `scroll ${r(document.querySelector(".apna-images-scroll"))} scrollH=${document.querySelector(".apna-images-scroll").scrollHeight}`, `composer ${r(document.querySelector(".apna-images-composer"))}`].join("\n")
}))
await browser.close()
