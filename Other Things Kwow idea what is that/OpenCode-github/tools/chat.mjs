// Asks one question in the running app's own chat (DevTools port 9222) and prints what the chat shows after it.
// It opens a new chat, types the prompt, presses Enter, and waits until the answer's footer (".. tok/s") appears.
// Usage: node chat.mjs "<prompt>" [maxSeconds] [here]
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
const [prompt, limit = "180", where = "new"] = process.argv.slice(2)
const marker = prompt.slice(-40)
const after = async () => {
  const text = await page.evaluate(() => document.body.innerText)

  return text.slice(text.lastIndexOf(marker) + marker.length)
}

// "here" types into the chat that is open now (such as a draft a page just opened) instead of a new one.
if (where !== "here") {
  await page.evaluate(() =>
    [...document.querySelectorAll("button,a")].find((item) => item.getAttribute("aria-label") === "New chat")?.click(),
  )
  await page.waitForTimeout(2500)
}
await page
  .locator('[contenteditable="true"], textarea')
  .first()
  .evaluate((element) => element.focus())
await page.keyboard.type(prompt, { delay: 3 })
await page.keyboard.press("Enter")

for (const _ of Array.from({ length: Math.ceil(Number(limit) / 4) })) {
  await page.waitForTimeout(4000)
  if (/tok\/s/.test(await after())) break
}

// Tool calls are folded in the chat; open them so their names print too.
console.log((await after()).split("\nDo anything\n")[0].trim().slice(0, 3000))
// Detach only: the app keeps running.
await browser.close()
