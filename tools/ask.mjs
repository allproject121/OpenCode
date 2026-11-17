// Types a message into the chat box that is open in the running app (DevTools port 9222), sends it, waits until
// the answer's footer (".. tok/s") shows, and prints what the chat shows after the message. Unlike chat.mjs it does
// not open a new chat first, so it works for a follow-up message and for a project picked on the new chat screen.
// Usage: node ask.mjs "<message>" [maxSeconds]
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
const [message, limit = "240"] = process.argv.slice(2)
const marker = message.slice(-40)
const after = async () => {
  const text = await page.evaluate(() => document.body.innerText)

  return text.slice(text.lastIndexOf(marker) + marker.length)
}
const started = Date.now()

await page
  .locator('[contenteditable="true"], textarea')
  .first()
  .evaluate((element) => element.focus())
await page.keyboard.type(message, { delay: 3 })
await page.keyboard.press("Enter")

for (const _ of Array.from({ length: Math.ceil(Number(limit) / 4) })) {
  await page.waitForTimeout(4000)
  if (/tok\/s/.test(await after())) break
}

console.log(`(${Math.round((Date.now() - started) / 1000)} s)`)
console.log((await after()).split("\nDo anything\n")[0].trim().slice(0, 3500))
// Detach only: the app keeps running.
await browser.close()
