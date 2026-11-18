// Drives the running dev desktop app (Electron, DevTools on 127.0.0.1:9222) for live tests.
// Usage: node drive-app.mjs <step> [<step> ...]
//   pages                 list the app's windows
//   settings:<tab>        open Settings on a tab id (e.g. settings:local-models)
//   click:<text>          click the first button / link with this visible text
//   clickrow:<row>|<btn>  click button <btn> inside the settings row that contains text <row>
//   fill:<label>|<value>  type into the input with this label / placeholder
//   wait:<ms>             wait
//   text                  print the visible text of the page (first 6000 chars)
//   shot:<file.png>       save a screenshot into Programming\logs
import { createRequire } from "node:module"
import path from "node:path"

const require = createRequire(
  "C:/Users/Roshan/Downloads/Programming/opencode/node_modules/.bun/playwright-core@1.60.0/node_modules/playwright-core/package.json",
)
const { chromium } = require("playwright-core")

const logs = "C:\\Users\\Roshan\\Downloads\\Programming\\logs"
// noDefaults: do not force light mode or other emulation onto the user's live window (repo AGENTS.md).
const browser = await chromium.connectOverCDP("http://127.0.0.1:9222", { noDefaults: true })
const pages = browser.contexts().flatMap((context) => context.pages())
const page = pages.find((item) => /localhost:5173|oc:\/\/renderer/.test(item.url())) ?? pages[0]

if (!page) {
  console.log("no window found")
  process.exit(1)
}

for (const step of process.argv.slice(2)) {
  const [name, ...rest] = step.split(":")
  const arg = rest.join(":")

  if (name === "pages") console.log(pages.map((item) => item.url()).join("\n"))
  if (name === "settings") {
    const url = new URL(page.url())

    await page.evaluate((tab) => {
      const next = new URL(location.href)

      next.pathname = "/settings"
      next.search = `?tab=${tab}`
      history.pushState({}, "", next)
      dispatchEvent(new PopStateEvent("popstate"))
    }, arg)
    console.log("opened settings tab", arg, "from", url.pathname)
  }
  if (name === "click") await page.getByRole("button", { name: arg, exact: false }).first().click({ timeout: 8000 })
  if (name === "clickrow") {
    const [row, button] = arg.split("|")
    const target = page
      .locator("div")
      .filter({ hasText: row })
      .filter({ has: page.getByRole("button", { name: button }) })
      .last()

    await target.getByRole("button", { name: button }).first().click({ timeout: 8000 })
  }
  if (name === "fill") {
    const [label, value] = arg.split("|")

    await page.getByLabel(label).or(page.getByPlaceholder(label)).first().fill(value, { timeout: 8000 })
  }
  if (name === "tap") await page.getByText(arg, { exact: true }).first().click({ timeout: 8000 })
  if (name === "find")
    console.log(
      await page.evaluate(
        (text) =>
          [...document.querySelectorAll("*")]
            .filter((element) => element.children.length === 0 && element.textContent?.trim() === text)
            .map((element) => {
              const parent = element.closest("a,button,[role],li") ?? element.parentElement

              return `${element.tagName} in ${parent?.tagName}[role=${parent?.getAttribute("role")}] ${parent?.outerHTML.slice(0, 160)}`
            })
            .join("\n"),
        arg,
      ),
    )
  if (name === "role") {
    const [role, label] = arg.split("|")

    // A window that is covered or minimised never counts as "stable" for a real click, so click in the page.
    await page.getByRole(role, { name: label }).first().evaluate((element) => element.click())
  }
  if (name === "focus") await page.locator(arg).first().focus({ timeout: 8000 })
  // store:<key>=<value> writes one of the app's own localStorage settings; an empty value removes it.
  if (name === "store") {
    const [key, value] = [arg.slice(0, arg.indexOf("=")), arg.slice(arg.indexOf("=") + 1)]

    await page.evaluate(
      (entry) => (entry.value === "" ? localStorage.removeItem(entry.key) : localStorage.setItem(entry.key, entry.value)),
      { key, value },
    )
  }
  if (name === "reload") await page.reload({ waitUntil: "domcontentloaded" })
  if (name === "key") await page.keyboard.press(arg)
  if (name === "type") await page.keyboard.type(arg, { delay: 20 })
  if (name === "wait") await page.waitForTimeout(Number(arg))
  if (name === "text") console.log((await page.evaluate(() => document.body.innerText)).slice(0, 6000))
  if (name === "shot") {
    await page.screenshot({ path: path.join(logs, arg) })
    console.log("saved", path.join(logs, arg))
  }
}

// Detach only: the app keeps running.
await browser.close()
