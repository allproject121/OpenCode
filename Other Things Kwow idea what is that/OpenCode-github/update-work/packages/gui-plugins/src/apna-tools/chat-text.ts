type Loose = Record<string, unknown>

const isObject = (value: unknown): value is Loose => typeof value === "object" && value !== null

/**
 * A chat as Markdown to copy or save: the user's messages, the AI's answers, and one line per tool the AI ran.
 * Reasoning and tool output are left out. Unknown message kinds are skipped.
 */
export function chatMarkdown(title: string, messages: readonly unknown[]): { title: string; markdown: string } {
  const parts = [`# ${title}`, ""]
  let last: "you" | "ai" | undefined

  for (const message of messages) {
    if (!isObject(message)) continue

    if (message.type === "user" && typeof message.text === "string") {
      parts.push("## You", "", message.text.trim(), "")
      last = "you"
      continue
    }

    if (message.type !== "assistant" || !Array.isArray(message.content)) continue
    const lines: string[] = []

    for (const item of message.content) {
      if (!isObject(item)) continue
      if (item.type === "text" && typeof item.text === "string" && item.text.trim()) lines.push(item.text.trim())
      if (item.type === "tool" && typeof item.name === "string") lines.push(`_Used tool: ${item.name}_`)
    }

    if (lines.length === 0) continue
    // One answer is often several assistant messages in a row (a tool, then text): keep them under one heading.
    if (last === "ai") parts.push(lines.join("\n\n"), "")
    else parts.push("## AI", "", lines.join("\n\n"), "")
    last = "ai"
  }

  return { title, markdown: parts.join("\n").trimEnd() + "\n" }
}
