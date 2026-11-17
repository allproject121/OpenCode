export default {
  title: "Updates",
  "command.title": "Open updates",
  "command.group": "Settings",
  unavailable: "Updates are managed by the desktop app.",

  check: "Check for updates",
  how: "Apna OpenCode follows OpenCode's releases by itself (at sign-in and daily at 10:00). A new release is first tested in a separate copy with all your changes; it is applied when the app closes, so the next start is new.",
  last: "Last step: {{time}}.",
  hold: "Paused: {{why}}",

  "status.checking": "Checking…",
  "status.running": "Checking for updates… (this takes a few minutes)",
  "status.new": "No check yet",
  "status.up-to-date": "Up to date ({{target}})",
  "status.ready": "Update {{target}} is tested and ready. Close the app; it updates as it closes.",
  "status.done": "Updated to {{target}}",
  "status.conflict": "Update {{target}} stopped: it clashes with this app's changes. Ask Claude or Codex to merge it.",
  "status.test-failed": "Update {{target}} stopped: a check failed. Nothing was changed.",
  "status.rolled-back": "Update {{target}} was taken back.",

  "sources.title": "Connected (updated by themselves)",
  "kind.opencode": "this app",
  "kind.npm": "program",
  "kind.skills": "skills",
  "kind.plugin": "plugin",
  "kind.tool": "kept updated",
  version: "now {{version}}",
  updated: "updated {{time}}",

  "add.title": "Connect a tool from GitHub",
  "add.description": "Paste a project's address. Its skills or plugin are added to the app, and it stays updated with the project.",
  "add.label": "GitHub address",
  "add.button": "Connect",
  "add.done.skills": "{{name}} connected; its skills are in the app now.",
  "add.done.plugin": "{{name}} connected as a plugin.",
  "add.done.tool": "{{name}} connected; it has no skills or plugin, so it is only kept updated.",
  "add.reloadFailed": "Connected. It loads the next time the app starts.",

  "remove.button": "Remove",
  "remove.confirm": "Remove {{name}}? It leaves the app's settings and its folder is deleted.",

  error: "That did not work: {{message}}",
}
