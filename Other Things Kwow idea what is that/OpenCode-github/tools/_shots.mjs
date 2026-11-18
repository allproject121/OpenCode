import { createRequire } from "node:module"
const require = createRequire("C:/Users/Roshan/Downloads/Programming/opencode/node_modules/.bun/playwright-core@1.60.0/node_modules/playwright-core/package.json")
const { chromium } = require("playwright-core")
const browser = await chromium.launch({ channel: "msedge", headless: true })
const out = "C:\Users\Roshan\Downloads\Programming\logs\\"
const errors = []
for (const [name, width, height] of [["desktop", 1280, 860], ["mobile", 390, 844]]) {
  const page = await browser.newPage({ viewport: { width, height } })
  page.on("console", (m) => { if (m.type() === "error") errors.push(`${name}: ${m.text().slice(0, 160)}`) })
  for (const path of ["/", "/rooms", "/videos", "/contact"]) {
    await page.goto(`http://127.0.0.1:5173${path}`, { waitUntil: "networkidle" })
    await page.screenshot({ path: `${out}hostel-${name}${path === "/" ? "-home" : path.replace("/", "-")}.png`, fullPage: false })
  }
  if (name === "desktop") {
    await page.goto("http://127.0.0.1:5173/contact", { waitUntil: "networkidle" })
    await page.getByRole("button").last().click().catch(() => {})
    await page.waitForTimeout(500)
    console.log("contact errors shown on empty send:", (await page.locator("body").innerText()).match(/[^\n]*(required|zaroori|valid|sahi|chahiye|enter)[^\n]*/gi)?.slice(0, 4))
  }
  await page.close()
}
console.log("console errors:", errors.length ? errors : "none")
await browser.close()
