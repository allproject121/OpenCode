// One-off helper: replaces the text between two markers of a file with the content of another file.
// Usage: node _splice.mjs <file> <startMarker> <endMarker> <replacementFile>
import { readFileSync, writeFileSync } from "node:fs"

const [file, start, end, replacement] = process.argv.slice(2)
const text = readFileSync(file, "utf8")
const from = text.indexOf(start)
const to = text.indexOf(end)

if (from < 0 || to < 0 || to < from) throw new Error(`markers not found: ${from} ${to}`)
writeFileSync(file, text.slice(0, from) + readFileSync(replacement, "utf8") + text.slice(to))
console.log("spliced", file)
