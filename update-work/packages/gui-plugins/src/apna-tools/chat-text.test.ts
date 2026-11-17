import { expect, test } from "bun:test"
import { chatMarkdown } from "./chat-text"

test("chat as markdown keeps questions, answers and tool names", () => {
  const out = chatMarkdown("Greeting", [
    { type: "user", text: "hiii" },
    {
      type: "assistant",
      content: [
        { type: "reasoning", text: "secret thoughts" },
        { type: "tool", name: "read" },
        { type: "text", text: "Hello! How can I help?" },
      ],
    },
    { type: "compaction" },
  ])

  expect(out.markdown).toBe(
    "# Greeting\n\n## You\n\nhiii\n\n## AI\n\n_Used tool: read_\n\nHello! How can I help?\n",
  )
  expect(out.markdown).not.toContain("secret")
})

test("several assistant messages in a row stay under one heading", () => {
  const out = chatMarkdown("T", [
    { type: "user", text: "q" },
    { type: "assistant", content: [{ type: "tool", name: "read" }] },
    { type: "assistant", content: [{ type: "text", text: "answer" }] },
  ])

  expect(out.markdown).toBe("# T\n\n## You\n\nq\n\n## AI\n\n_Used tool: read_\n\nanswer\n")
})
