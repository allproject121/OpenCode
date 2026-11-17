# Apna OpenCode — apne aap update (auto update)

## Ye kya hai
Asli OpenCode (GitHub: `anomalyco/opencode`) jab naya **release** nikalta hai (jaise v2.3.0 -> v2.3.1 — wahi jab
unke app me "Update" aata hai), to aapka Apna OpenCode bhi **apne aap** wo naya code le leta hai, aapke saare
badlav (Router, Offline models, Plugins, Customize, Codex jaisa roop, glass…) bachaye rakhta hai, install karta
hai aur jaanch ke baad laga deta hai. Haath se kuch nahi karna.

Saath me ye bhi apne aap update hote hain:
- **OmniRoute (router)** — npm par naya version aaye to (sirf jab app band ho). Pehle `~\.omniroute` ka backup
  (`omniroute-backup\`), naya version na chale to purana wapas.
- **Superpowers skill pack** (`config\packs\superpowers`) — GitHub se taaza.
- **Ollama** — iska apna updater hai (system tray wala Ollama khud update karta hai), hum nahi chhoote.

## Kaise chalta hai (connection)
```
Windows Task Scheduler  ("Apna OpenCode Auto Update": login ke 10 min baad + roz 10:00)
        |
        v
update.ps1 check
  1. GitHub se sabse naya release tag dekho (vX.Y.Z)        -> pehle se hai? kuch nahi karna
  2. opencode\ ke khule badlav ek local commit me (files waise hi rehti hain, GitHub par kuch nahi jata)
  3. ALAG copy  Programming\update-work  me:  bun install + jaanch (pehle)
  4. usi copy me naya release milao (git merge)             -> takraav? ruk jao + Windows notification
  5. bun install + type-check (core, gui-plugins, app, desktop, workflow) + tests (gui-plugins, workflow)
     -> jo jaanch pehle pass thi wo ab fail? ruk jao + notification (asli app ko chhua hi nahi)
  6. sab pass -> "ready"  (state.json)
        |
        v
update.ps1 apply   (app band ho to turant; warna Apna-OpenCode.cmd agli baar kholte hi ye chalata hai)
  7. wahi jaancha hua code opencode\ me milao + bun install -> app naye version par khulta hai
```
Asli `opencode\` folder me update tabhi lagta hai jab: (a) alag copy me sab jaanch pass ho, (b) app band ho,
(c) `ROKO.txt` na ho, (d) jaanch ke baad `opencode\` ka code na badla ho — badla ho to update nahi lagta, agli
jaanch naye code ke saath dobara hoti hai (bina jaanche kabhi nahi lagta).

## App ke andar: Settings > About > "Updates"
- **"Update check karo"** button: abhi isi waqt poori jaanch (`update.ps1 check`). Haal wahin dikhta hai
  (taaza hai / taiyaar hai — app band karo / ruka kyun).
- **"Jude hue"** list: OpenCode, OmniRoute, Superpowers, aur aapke jode hue tools — har ek ka version / aakhri update.
- **"GitHub se tool jodo"**: kisi bhi GitHub project ka address chipkao -> "Jodo":
  - download hota hai `Programming\connected\<naam>` me;
  - usme **skills** (SKILL.md) hain to wo app ki skills me jud jaate hain; **OpenCode plugin** hai to plugin ki tarah;
    warna sirf taaza rakha jata hai;
  - list `sources.json` me; roz ki jaanch me har juda tool GitHub se taaza hota hai (`sources-state.json`).
  - "Hatao" = settings se niklega + uska folder delete. `connected\` ke andar khud kuch mat badlo — har update par
    GitHub wala roop wapas aa jata hai.
- **App band karte hi** taiyaar update lag jata hai (launcher window band hone ke baad `apply` chalata hai).

## Aapke liye buttons
- `Abhi-Update-Dekho.cmd` — abhi isi waqt update dhundho / jaancho / lagao, aur haal dikhao.
- `Wapas-Lo.cmd` — aakhri update pasand nahi aaya? App band karo, ye chalao: purane par wapas + `ROKO.txt` ban
  jati hai (taaki wahi update phir na lage). `ROKO.txt` hatate hi update phir chalu.
- `ROKO.txt` — ye file ho to update **lagta nahi** (sirf alag copy me jaanch hoti hai). Jab koi Claude/Codex session
  code badal raha ho, wo ye file bana deta hai; kaam khatam -> file hatao.

## Kahan kya hai
- `update.ps1` — sab kaam (`check`, `apply`, `status`, `rollback`, `install`, `uninstall`, `check -Target dev`).
- `state.json` — abhi ka haal (`up-to-date`, `ready`, `done`, `conflict`, `test-failed`, `rolled-back`) + sandesh.
- `Programming\logs\auto-update.log` — har kadam ka log.
- `Programming\update-work\` — jaanch wali alag copy (git worktree, branch `apna-update`). Hatani ho to:
  `git -C opencode worktree remove --force ..\update-work`.
- Launcher `Programming\Apna-OpenCode.cmd` me ek line: `update.ps1 apply`.
- Git: branch `apna-opencode` par updater ke commit "apna: auto-save …" / "apna: update to vX" naam se dikhte hain.

## Jab update ruk jaye (Claude / Codex ke liye)
`state.json` me `status: conflict` (aur `files`) ya `test-failed` (aur `failed`) hoga, user ko notification gaya hoga.
1. `ROKO.txt` banao (taaki beech me kuch na lage), user ko batao.
2. `cd Programming\update-work`, `git merge <tag>` khud karo, takraav wali files me apne badlav + upstream dono
   bachao, `bun install`, wahi jaanch (`update.ps1` ke `$Checks`) chalao, commit.
3. `opencode\` me: `git merge apna-update` (app band karke), `bun install`, live test (app kholo).
4. `state.json` hatao / `update.ps1 check` dobara chalao, `ROKO.txt` hatao.

## Hatana ho to
`powershell -File update.ps1 uninstall` (Task Scheduler se hat jata hai) aur launcher se `update.ps1 apply` wali
line hata do. Code par koi asar nahi.
