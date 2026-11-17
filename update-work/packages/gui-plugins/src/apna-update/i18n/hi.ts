// apna-opencode: shown when the app's language is Hindi. The copy is simple Hinglish (Hindi in Latin letters) on
// purpose: that is what this build's user reads.
export default {
  title: "Updates",
  "command.title": "Updates kholo",
  "command.group": "Settings",
  unavailable: "Updates desktop app sambhalta hai.",

  check: "Update check karo",
  how: "Apna OpenCode, OpenCode ke naye release apne aap leta hai (login par aur roz 10 baje). Naya release pehle alag copy me aapke saare badlav ke saath jaancha jata hai; app band hote hi lagta hai, agli baar naya khulta hai.",
  last: "Aakhri kadam: {{time}}.",
  hold: "Ruka hua: {{why}}",

  "status.checking": "Dekh rahe hain…",
  "status.running": "Update dhundh rahe hain… (kuch minute lagte hain)",
  "status.new": "Abhi jaanch nahi hui",
  "status.up-to-date": "Taaza hai ({{target}})",
  "status.ready": "Update {{target}} jaancha hua, taiyaar. App band karo — band hote hi lag jayega.",
  "status.done": "{{target}} par update ho gaya",
  "status.conflict": "Update {{target}} ruka: app ke badlav se takraya. Claude ya Codex se milwao.",
  "status.test-failed": "Update {{target}} ruka: ek jaanch fail hui. Kuch nahi badla.",
  "status.rolled-back": "Update {{target}} wapas le liya.",

  "sources.title": "Jude hue (apne aap update)",
  "kind.opencode": "yahi app",
  "kind.npm": "program",
  "kind.skills": "skills",
  "kind.plugin": "plugin",
  "kind.tool": "sirf taaza rakha jata hai",
  version: "abhi {{version}}",
  updated: "update {{time}}",

  "add.title": "GitHub se tool jodo",
  "add.description": "Project ka address chipkao. Uske skills ya plugin app me jud jaate hain, aur project ke saath taaza rehta hai.",
  "add.label": "GitHub address",
  "add.button": "Jodo",
  "add.done.skills": "{{name}} jud gaya; uske skills ab app me hain.",
  "add.done.plugin": "{{name}} plugin ki tarah jud gaya.",
  "add.done.tool": "{{name}} jud gaya; isme skills / plugin nahi, isliye sirf taaza rakha jayega.",
  "add.reloadFailed": "Jud gaya. App agli baar khulne par load hoga.",

  "remove.button": "Hatao",
  "remove.confirm": "{{name}} hatana hai? App ki settings se niklega aur uska folder delete hoga.",

  error: "Nahi hua: {{message}}",
}
