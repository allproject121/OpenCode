# CHALU_KAAM — "Programming" (apna OpenCode: Ollama + Router + Workflow system)

Naya session (Claude ya Codex) yahan se shuru kare. Pehle ye file poori padho, phir "Abhi ka haal" -> "Agla kadam".
Jawab simple Hinglish me. Kuch bhi Claude app / claude.ai / cloud par publish NAHI karna — sab is PC par.

## User ne kya maanga (2026-11-17, subah)
1. `Downloads\Programming` folder. Usme OpenCode ka source GitHub se.
2. Kilo Code ke jo features OpenCode me nahi hain, wo OpenCode me daalo.
3. Router (OmniRoute) ko OpenCode ke andar feature/plugin ki tarah: ek click -> website khule -> API key daalo ->
   Connect -> models dikhne lagein. Har baar alag se kuch kholna na pade.
4. Ollama andar hi: alag se download na karna pade; OpenCode ke andar se offline models download ho sakein.
5. Models laptop par aayein aur Cloud-SSD (Z:) par bhi chale jaayein. Download tez ho.
6. "System": kya ban raha hai (website / app) khud samjhe, us hisaab se zaroori "plugin" (skills / MCP) khud lagaye,
   stages me kaam kare (plan -> frontend -> backend -> test -> bug dhundo -> fix -> security). Ye stages khud se
   decide NAHI karne — research (GitHub / jaane-maane log) se lene hain.
7. Aur kya joda ja sakta hai — research karke batao aur jodo.

## Folder
```
Downloads\Programming\
  opencode\    <- anomalyco/opencode, branch `apna-opencode` (upstream dev v2.3.0, commit 32974e0). YAHAN kaam hota hai.
  kilocode\    <- Kilo-Org/kilocode (sirf dekhne / compare ke liye, chhoona nahi)
  omniroute\   <- diegosouzapw/OmniRoute (sirf dekhne ke liye)
  tools\       <- apni jaanch-scripts (probe-models.mjs, drive-app.mjs, test-copy.ts)
  logs\        <- dev log + screenshots
  CHALU_KAAM.md
```
Purana kaam (mat todna): `Downloads\opencode-omniroute-router` (Sangam UI) — uska apna CHALU_KAAM.md.

## Kaise chalayein / test karein
Sab commands se pehle (Git Bash): `export PATH="/c/Users/Roshan/AppData/Roaming/npm/node_modules/bun/bin:$PATH"`
(bun npm se laga hai; asli `bun.exe` isi folder me hai. User PATH me bhi jod diya hai — naya terminal kholne par milega.)
- Desktop app (dev): `cd opencode && bun run dev:desktop`  (pehli baar ~1 min; window khulti hai; DevTools port 9222)
- CLI: `cd opencode && bun dev --help`, `bun dev models --standalone`
- Type-check: `cd opencode/packages/core && bun typecheck` ; `cd opencode/packages/gui-plugins && bun typecheck`
- Unit test: `cd opencode/packages/gui-plugins && bun test src/local-models`  (10 pass)
- Models jaanch: `node tools/probe-models.mjs 4199 20`  (server chala ke ollama/omniroute models ginta hai)
- App ko click karke chalana: `node tools/drive-app.mjs key:Control+Shift+P "type:Offline models" key:Enter wait:2000 text shot:x.png`
- Copy/restore live jaanch: `cd tools && bun run test-copy.ts`  (pehle `all-minilm` model hona chahiye)

## Dhyan rakho (galtiyan jo ho chuki / ho sakti hain)
- Desktop dev app `bun` ko seedha chalata hai — `bun.cmd` (npm shim) se nahi chalta, `bun.exe` PATH me chahiye.
  Na ho to log me "v2 CLI background service failed ... Failed to start server".
- Git Bash me lambi `node -e "..."` me backtick / quotes toot jaate hain -> code badalne ke liye Edit/Write tool hi.
- Source files CRLF ho sakti hain; `\n` wala replace fail hota hai.
- `du` is repo par bahut dheema hai, mat chalao.
- `packages/app/src/custom-elements.d.ts` Git ka symlink hai jo Windows par seedhi text file ban gaya -> `packages/app`
  aur `packages/desktop` ka `bun typecheck` usi par rukta hai. Jaanch ke liye:
  `cp ../ui/src/custom-elements.d.ts src/custom-elements.d.ts && bun typecheck; git checkout -- src/custom-elements.d.ts`.
- i18n file (`en.ts`) badalne par chalte app me hot-reload fail hota hai (app khaali dikhta hai) -> window reload karo
  (`node tools/drive-app.mjs reload`) ya app dobara kholo. Main-process ki file badle to app dobara kholna hi padta hai.
- Chalte app ko script se click karne ke liye `drive-app.mjs` me `role:<role>|<naam>` use karo (asli click window
  dhaki ho to atakta hai); tabs = `role:tab|Router`, tiles = `role:button|Website banao`.
- V2 aur purana OpenCode 1.19.5 ek hi config folder padhte hain (`~\.config\opencode`). Dev build "local" channel hai
  (`opencode-local.db`, alag) — release channel build purane DB ko migrate kar sakta hai, isliye abhi sirf dev chalao.
- Packaged build banoge to `updater` official build se badal dega — pehle updater feed hatana / channel badalna.
- **Cloud-SSD drive ka akshar pakka nahi** (roshan-48, 2026-11-17 ~11:00): Z: abhi "mara hua" naam hai (chhune se
  process atak sakta hai); "All Accounts" drive filhaal G: par hai, PC restart ke baad wapas Z:. Sahi akshar:
  `%LOCALAPPDATA%\Cloud-SSD\mounts.state.json`, entry Id "cloudssd", field Letter. Kabhi Z: hard-code mat karo
  (hamara copy feature folder user se chunwata hai — theek hai). Teeno accounts ab user ki apni Google key par hain.
  Bade write se pehle roshan-48 / user se pucho; PC restart ho sakta hai.
- **Cloud-SSD "Fast drive" (roshan-48, 2026-11-17 dopahar)**: write test khatam, cloud drives ab use kar sakte hain;
  PC restart abhi nahi hoga. Model copy ke liye sabse achhi jagah: seedha local folder
  `C:\Users\Roshan\Cloud-SSD\All Accounts` ke andar EK naya folder (jaise `Ollama-Models`) — local disk ki speed se
  likhta hai, app ~20 s baad khud Google par upload karta hai, kuch delete nahi karta. Ye drive letter ki tarah bhi
  dikhta hai (aaj W:, restart ke baad Z:) — letter hard-code mat karo, folder ka path do. "Copy ho gaya" = PC par
  hai, upload chal raha hai; C: ki jagah leta hai (~115 GB khaali). Z:\ abhi bhi mara hua naam hai (chhune se atak
  sakta hai); asli cloud drive aaj G: (restart ke baad X:). Agla kadam: Settings > Offline models > "Folder chuno" me
  yahi folder sujhana / default dikhana, phir `all-minilm` se asli copy test.
- **Z: / Y: (Cloud-SSD) ko abhi mat chhuo** (purani baat, upar wali nayi hai): doosra session (roshan-48, Cloud-SSD repo) wahan kaam kar raha hai aur
  user ka MiniMax install Z: par chal raha tha. Us session ki salah: copy ek hi seedhe (flat) folder me, ek file ek
  baar, default band, sirf button se; Z: par "copy ho gaya" ka matlab abhi cloud par upload nahi — local model mat hatana.
- Dhyan: user env `OLLAMA_HOST=0.0.0.0:11434` hai (Ollama poore Wi-Fi par khula) — user ko batana; app jab khud
  chalu karta hai to 127.0.0.1 hi deta hai.

## Research se pakki baatein
- Kilo CLI khud OpenCode 1.x ka fork hai (MIT). Kilo ke apne extra: Agent Manager (git worktree), Code/Plan/Ask/Debug
  agents, orchestrator, MCP marketplace, autocomplete (VS Code), Claude Code import, `/goal`. OpenCode 2.3 me `goal`,
  plan, subagent, worktree pehle se hain. Kilo ka code seedha copy nahi hota (1.x vs 2.x dhaancha alag) — feature
  plugin/agent ki tarah dobara banana. Cloud/paid wale (Gateway, Kilo Pass, Cloud Agent) nahi laane.
- OpenCode 2.x: server plugin (`packages/plugin`, built-in list `packages/core/src/plugin/internal.ts` +
  `provider.ts`) aur GUI plugin (`packages/gui-plugins/src/<id>/`, list `src/renderer.ts` + `src/main.ts`).
  Guide: `packages/gui-plugins/README.md` + `AGENTS.md`. Settings page = `ctx.add(SettingsPage, ...)`.
  Main <-> window = `Ipc.define` (state + methods). Bahar ka plugin: config `plugins: ["path"]`, GUI sirf desktop.
- Ollama pehle se OpenCode ka built-in provider hai (`core/src/plugin/provider/ollama.ts`, 30 s me models dhundhta
  hai). Download/hatana kahin nahi tha — wo humne joda.
- Ollama engine zip (`ollama-windows-amd64.zip`) 1.5 GB hai. Pull 16 tukdo me parallel hota hai; dheeme net par
  tukde atak jaate hain -> ilaaj: ek baar me ek download + atakne par wahin se apne aap dobara (resume).
- Workflow ke stages (research se): addyosmani/agent-skills (MIT: Define -> Plan -> Build -> Verify -> Review -> Ship),
  obra/superpowers (MIT: brainstorm -> plan -> TDD -> systematic-debugging -> verify -> review),
  github/spec-kit (MIT: constitution -> specify -> plan -> tasks -> implement), OWASP Developer Guide / ASVS / Top 10.
  MCP: Playwright (browser test), Context7 (taaza docs), GitHub.

## Abhi ka haal (2026-11-17 ~17:50; sabse naya kaam: "Cloud-SSD se jodo" — bana, live jaancha, models ka upload chal raha hai)
Branch `apna-opencode`, kuch commit NAHI kiya (user ne nahi kaha). Upstream ki sirf 3 files me 13 line badli
(`core/src/plugin/provider.ts`, `gui-plugins/src/main.ts`, `gui-plugins/src/renderer.ts`); baaki sab naye folder.

Bana aur live jaancha:
- **OmniRoute built-in provider**: `packages/core/src/plugin/provider/omniroute.ts`. `http://127.0.0.1:20128` se
  `/v1/models` + `/api/providers` padh ke combos + jude providers ke chat models dikhata hai; key = /connect,
  env `OMNIROUTE_API_KEY` (integration env method), ya config. Live: 54 models; `omniroute/auto/coding` se jawab aaya.
- **Settings > Offline models**: `packages/gui-plugins/src/local-models/`. Engine dhundhna / khud chalu / (na ho to)
  app ke folder me download; model download (progress, speed, ETA, ek-ek karke, atke to 12 baar resume); hatana;
  doosri copy = **ek seedha (flat) folder** (`sha256-…` files + `manifest+host+ns+model+tag.json`), "Wapas lao".
  Live: `all-minilm` download; `tools/test-copy.ts` 10/10 (copy -> delete -> restore -> model chala).
- **Settings > Router**: `packages/gui-plugins/src/router/`. OmniRoute khud chalu (127.0.0.1, key zaroori), haal,
  "Key lo" (website) -> key chipkao -> "Jodo" (POST `/api/providers`, phir `/test`; `valid:false` ho to connection
  wapas hata deta hai), jude providers ki list / hatana, dashboard. Router ki apni key: env se, ya page par daalo
  (Windows keychain se encrypt) + OpenCode ko `integration.connect.key`. Live: page, list, galat key ka raasta.
- **Workflow plugin**: `packages/plugins/workflow/` (Promise plugin API). `project_detect` tool (`detect.ts`),
  25 skills (`skills/`, addyosmani/agent-skills MIT, bina badle; `skills/NOTICE.md`), commands `/banao` `/jaanch`
  `/suraksha` (`prompts.ts`), web project me `chrome-devtools` MCP apne aap. Live: plugin load, 25 skills, 3 commands,
  MCP sirf web folder me, asli model ne `project_detect` chalaya.
- **Kilo jaise 3 mode** (usi workflow plugin me, `ctx.agent.transform`): `ask` (deny sab, allow read/grep/glob/web/
  skill/question), `debug`, `orchestrator` (prompts `prompts.ts` me). Live: `/api/agent` me teeno; `--agent ask` se
  file banane ko kaha -> mana kiya, file nahi bani. Debug / Orchestrator se asli kaam nahi karwaya.
- **Naya Home + roop** (user ne 2026-11-17 ko chuna: "Naya Home + naya roop", rang "System ke saath badle",
  naam "Apna OpenCode"):
  - `packages/app/src/new-session/apna-home.tsx` (naya) — title, Router/Offline chips (`useProviders` se model ginti),
    6 tiles. Tile composer me text daalta hai (`restoreFocus` + `execCommand("insertText")`) ya plugin command
    chalata hai (`command.trigger("local-models.open" / "router.open")`). `view.tsx` me wordmark (aur uske chhupe
    games) ki jagah laga. Copy: `packages/app/src/runtime/i18n/en.ts` me `apna.home.*`.
  - Theme `packages/ui/src/theme/themes/apna.json` (light + dark), `context.tsx` me naam + default (`APNA_THEME_ID`;
    jisne khud theme chuna ho uska chunav rehta hai). Color scheme default "system".
  - Naam: `packages/desktop/src/main/constants.ts` (unpackaged `APP_NAME`), window title (`windows/appearance.ts`,
    `windows/early.ts`, `renderer/index.html`). Composer placeholder Hinglish: `packages/ui/src/i18n/en.ts`.
  - Live: dark + light screenshot, tile -> `/banao Website: `, chips me ginti. `packages/ui`: `bun test src/theme` 30 pass.
  - Baaki: "Pichhle kaam" line; baaki app ke labels English; installer ke liye naam/icon (packaged) alag se.
- **Codex jaisa design** (user, 2026-11-17: "pura UI ka design Codex jaisa bana do"; isne upar wale neele-kesariya
  Home ko badal diya):
  - Layout: OpenCode me pehle se "Side tabs" + sidebar grouping "Projects" hai — wahi Codex jaisi baayein patti hai.
    Default badle: `packages/app/src/settings/model.tsx` (`tabLayout: "vertical"`, `sidebarOrganize: "projects"`).
    Is PC par setting pehle se save thi, isliye Settings se badli (Preferences > Interface layout > Side tabs;
    Experimental > Organize vertical sidebar > Projects).
  - Home: `apna-home.tsx` ab do component — `ApnaHomeHeading` (beech me sawal + Router/Offline chips) aur
    `ApnaHomeCards` (composer ke neeche 6 border wale card, line icons). `view.tsx` me top `clamp(32px,20%,200px)`.
  - Theme: `themes/apna.json` ab sada (dark #181818 / light #ffffff, accent neela); purana neela-kesariya
    `themes/apna-neela.json` ("Apna (neela + kesariya)") me bacha hai.
  - Labels (`app/src/runtime/i18n/en.ts`): "Naya thread", "Thread dhundo", "Threads", "Aaj kya banayein?".
  - Live: `logs\24-codex-dark.png`, `logs\25-codex-light.png`; card -> `/banao Website: `; theme tests 30 pass.
  - Nahi badla: chalte thread ka screen, review/files panel, Settings ka dhaancha (sirf rang). Codex ka naam /
    logo / assets nahi liye — sirf layout ka dhang.
  - Dhyan: user is app me khud bhi kaam kar raha hai (thread "Pura UI system change" dikha) — app band / reload
    karne se pehle socho; reload se thread nahi jaata, par chalta jawab ruk sakta hai.
- **"Ekdam Codex jaisa" (user, 2026-11-17 ~11:40: "ekdam same uske jaisa, bas naam apna rahe")**:
  - Asli Codex app is PC par hai (Start menu "ChatGPT", Appx `OpenAI.Codex`). Reference tasveer:
    `logs\ref-codex-1.png` (`tools\capture-window.ps1 -Match "^ChatGPT$"` se; app khol ke sirf tasveer li, band kiya).
    Codex ka code / logo / assets NAHI liye — sirf dhaancha.
  - New chat screen (`view.tsx`, `apna-home.tsx`): beech me apna nishaan (terminal glyph ring me) + "What should we
    work on in <project>?" (project underline, click = project picker); composer NEECHE dock, uske upar project wala
    tab (`NewSessionLocation`). Pehle wale 6 card aur Router/Offline chips Home se HAT gaye (commands `/banao`
    `/jaanch` `/suraksha` aur Settings ke page wahi hain).
  - Sidebar: upar "Apna OpenCode" + search icon (`titlebar.tsx`), "Recents" heading (`sidebar-organized.tsx`).
    Labels English, Codex jaise: "New chat", "Projects", "Recents", "No chats", placeholder "Do anything".
  - Live: `logs\31-newchat.png`. App typecheck saaf.
  - Codex se abhi ALAG: sabse baayein icon wali patli patti (rail) nahi; upar File / Edit / View / Help menu nahi
    (hamara ≡ hai); composer ke andar "Full access" / mic nahi; chalte chat ka screen aur Settings OpenCode wale.
  - User ne beech me layout khud "inbox" jaisa kar liya lagta hai (sidebar: Home / New chat / Unread / Recent /
    Archived) — use mat badlo.
- **Codex jaisa: poora dhaancha (user, ~11:50: "logo or name chod kar pura same chahiye kitni bar bolu")** —
  ab dobara mat pucho, jo bacha hai wo bhi isi tarah milate jao (memory: finish-whole-ask-no-reasking):
  - Upar ki patti (`titlebar.tsx`, `windows-menu.tsx`): back / forward teer, sidebar toggle, phir File / Edit / View
    / Help alag-alag menu (pehle ek ≡ tha; Go aur Window menu bar me nahi, shortcuts chalte hain).
  - Icon patti (`shell/apna-rail.tsx`, `shell.tsx` me mount): home=`tab.new`, chats=`sessions.search`,
    clock=`home.toggle`, books=`local-models.open`, @=`router.open`, ...=`command.palette`, PR=`review.open`
    (session na ho to dhundhla), neeche "RT" = `settings.open`. Glyph apne banaye SVG hain.
  - Sidebar: "Apna OpenCode" + search; sirf "New chat" row (Settings row hata, avatar se khulta hai); "Projects"
    me folder icon; "Recents" heading. Is PC par layout Settings se "Side tabs" kiya (user ne "Inbox" chuna tha).
  - Composer (`composer/editor/editor.tsx`, naya `access-chip.tsx`): gol kone (24px), mode ke baad "Full access /
    Ask first" (= Auto-accept permissions setting ka toggle), model daayein, bhejne ka button gol.
  - Reference: `logs\ref-codex-1.png`, `logs\ref-codex-2.png`; hamara: `logs\41-same.png`, `logs\31-newchat.png`.
  - Abhi alag (karna baaki): mic button, bell, "Projects" ke paas chhota teer, Codex ka Settings page aur chalte
    chat ke andar ke hisse (inki Codex tasveer nahi li — user us waqt khud Codex window chala raha tha, isliye
    uska mouse nahi liya; `tools\click-window.ps1` bana hai, user ke na hone par use karo), light roop ki jaanch.
- **Codex jaisa, doosra daur (user ~12:00: "sab kuch matlab sabkuch", bahar se poora same)**:
  - Codex ke aur reference liye (`tools\click-window.ps1` se Codex me 2 click: home, ek purana chat):
    `logs\ref-codex-3.png` (Settings), `ref-codex-4.png` (home), `ref-codex-5.png` (chalta chat).
  - Settings (`settings/settings.css` ke aakhir me block, `shell.tsx` me chat sidebar chhupta hai jab Settings khula
    ho, `settings.backToApp` = "Settings"): baayein "Settings" + search + panno ki list, daayein ek panel me bada
    sirnaam + card. `logs\42-settings.png`.
  - Chat header (`session/session-identity-header.css`): folder + chat ka naam (project naam chhupa).
  - Sidebar: ghanti (= `home.toggle`) + search; "Projects" ka teer hata; Recents me project ka akshar chhupa
    (`shell/titlebar/titlebar.css`). Follow-up placeholder "Work with Apna OpenCode". `logs\43-chat.png`.
  - Abhi Codex se alag: mic (asli voice feature composer me nahi, nakli button nahi banaya), "Get Plus", chat ke
    daayein "Outputs" panel, Settings me "Personal / Integrations" jaise group ke naam aur search ka gol dabba,
    Codex ke baaki rail panne (unke barabar hamare panne alag kaam ke hain), light roop ki jaanch.
  - Screenshot tab hi aata hai jab hamari window saamne ho (peeche ho to `drive-app.mjs shot` atakta hai aur
    `capture-window.ps1` kaali tasveer deta hai) -> pehle window saamne lao.
- **Glass effect (user ~12:10: "iPhone wala glass effect add karo")**:
  - Window: `packages/desktop/src/main/windows/defaults.ts` (`glassEnabled`, `windowGlass` = clear background +
    `backgroundMaterial: "acrylic"`), `appearance.ts` + `early.ts` me laga; `setBackgroundColor` glass me window ko
    thos rang nahi deta. Band karne ke liye env `APNA_GLASS=0` (launcher me set karo) — sirf Windows.
  - App: `packages/app/src/apna-glass.css` (`index.css` me import): shell / panel / card / composer aadhe aar-paar,
    panel aur composer par `backdrop-filter` + halki kinaar; peeche halka rangeen wash; sidebar rows ka thos rang
    hataya (`--tab-base: transparent`). Ek window me band: `document.documentElement.dataset.apnaGlass = "off"`.
  - **Dobara likha (user: "pure me lagao, design bhi sambhalo, naam nahi dikh rahe")** — ab variable se chalta hai:
    `--v2-background-bg-deep` = clear, `--v2-background-bg-base` = "float" (mota sheesha) default; pane
    (`[class*=bg-base][class*=elevation-raised]`, `.settings-content`) ke andar base = clear (dohri pattiyan nahi);
    popups (`role=dialog/menu/listbox/tooltip`, `data-popper-positioner`, composer-suggestions) ko float wapas.
    Shell ka rang ek baar `body` par. Mote-pan: shell 0.8, pane 0.72, field 0.7, float 0.94 (safed window peeche
    ho tab bhi likhawat padhi jaye — in-page screenshot safed par chadhta hai, wahi sabse bura haal hai).
  - Galti jo thi: `[data-component="dialog-v2"]` poori screen ka positioner hai — us par sheesha lagane se dialog
    khulte hi sab dhak jata tha. Ab sirf `[data-slot="dialog-container"]`. Naye popup par sheesha lagao to pehle
    dekho wo element poori screen ka to nahi.
  - Menu ki chaudai: `windows-menu.tsx` me `desktop-app-menu-sub` class (warna naam aur shortcut chadhte hain).
  - Dekha: chat, File menu, command palette, "/" list, project search dialog, Settings (Preferences, Offline
    models), naya chat — `logs\64..71-*.png`. Window peeche / chhoti ho to script ke click aur screenshot atakte hain.
  - Live: `logs\51-glass.png` (asli screen ki tasveer, `tools\capture-screen.ps1 -Front`). Desktop typecheck saaf.
  - Nahi dekha: light roop me glass, lamba chat scroll hote hue, Settings aur menu / dialog par glass, purane
    Windows par (acrylic na mile to peeche sirf rangeen wash dikhega).
- **Plugins panna (user: "isme plugin nahi hai kya" -> "bana sakte hai ki nahi")**: Settings > "Plugins",
  `packages/gui-plugins/src/plugin-store/` (catalog, config(+test, 7 pass), contract, main, renderer, page, i18n),
  `renderer.ts` + `main.ts` me joda. List: MCP (Context7, Playwright, Chrome DevTools, GitHub, Figma, Sequential
  Thinking, Memory), plugin (OpenCode ka Figma plugin — source folder se, warna git spec), skill pack (obra/superpowers,
  `git clone` -> `<config>\packs\superpowers\skills`). "Jodo"/"Hatao" settings file (`config\opencode.jsonc`) me
  `mcp.servers` / `plugins` / `skills` badalta hai (temp file + rename; file ke purane comments nahi bachte), phir
  window `client.location.reload()` bulati hai. Live: Context7 joda -> panna "Juda hua hai", file me aaya, alag server
  ne `/api/mcp` me `context7` dikhaya; hataya -> file se gaya, toast aaya. `logs\72-plugins.png`.
  Nahi jaancha: `npx` wale MCP ka asli chalna, GitHub/Figma sign in, Figma plugin, superpowers ka clone.
- **Bhasha (user: "language add karo, English default")**: app me Language ka chunav pehle se hai (Settings >
  Preferences > Language, 60+ bhasha, default English). Mere teen panno (local-models, router, plugin-store) ka
  `i18n/en.ts` ab asli English hai aur purani Hinglish `i18n/hi.ts` me hai (`builtinCatalog({ en, hi: () =>
  import("./i18n/hi") })`), yani bhasha "हिन्दी" chunne par Hinglish dikhti hai. Catalog ke data-strings ab keys hain:
  `use.<model>`, `left.*` (local-models), `note.<provider>` (router), `item.<id>` (plugin-store). Workflow plugin ke
  command / mode ke description English; uske prompts Hinglish hi hain (AI user se Hinglish me baat kare).
  Live: English me teeno panne; Hindi chun ke Offline models Hinglish me aaya; wapas English. Naya panna banao to
  dono file bharo.
- **Plugins ki list ki jaanch (alag test server, user ki settings chhue bina)**: MCP — context7, playwright,
  chrome-devtools, sequential-thinking, memory = `connected`; github, figma = `needs_auth` (sign in). Figma plugin +
  workflow plugin + superpowers pack ke skills load hue (66 skills). `tools/api.mjs` me `APNA_CONFIG_DIR` (doosra
  settings folder) aur `APNA_RAW=1` (kaccha jawab) jode.
- **`C:\Users\Roshan\CLAUDE.md`** (user ne 2026-11-17 ko Karpathy wali file download karwayi): iske aane se Claude
  Code ne `C:\Users\Roshan\AGENTS.md` padhna band kar diya (file disk par hai). User ke niyam
  `C:\Users\Roshan\.claude\CLAUDE.md` me hain, wo chalte hain.
- **"Plugin dummy hai, kaam nahi karta" (user, 2026-11-17 ~14:50) — asli wajah aur ilaaj**:
  - Plugin ka connection asli tha (chalte app me Extensions > MCPs: `context7 Connected`; model ne
    `tools.context7["resolve-library-id"]` chala ke `/solidjs/solid` diya). Chat isliye nahi chalti thi ki default
    model `omniroute/auto/coding` par `ECONNRESET` aa raha tha (uska pehla model `gemini-3.8-flash` roz ki limit par
    tha; router us par socket band kar deta hai).
  - Ilaaj 1: OmniRoute me apna combo **`apna-coding`** (priority: gemini-3.8-flash -> 3.7-flash -> 3.1-flash-lite ->
    3-flash-preview -> ollama-local/qwen2.5:7b); jaancha ki pehla band ho to agla jawab deta hai (stream aur bina
    stream). `config\opencode.jsonc` me `"model": "omniroute/apna-coding"`. Is model se CLI run me Context7 tool chala.
  - Ilaaj 2: Plugins panna ab asli haal dikhata hai — window har 4 s `client.mcp.list()` puchti hai: Connected /
    Sign-in needed (+ "Sign in" button -> Settings > Extensions) / Failed: wajah / Starting / "Added; not loaded yet".
    Live: Context7 "Connected"; GitHub jodne par "Sign-in needed" + button; phir GitHub hata diya.
  - Nahi jaancha: "Sign in" dabane ke baad ka OAuth (user ka account chahiye).
  - 2026-11-17 16:45 (user: "plugin work karta hai?"): `config\opencode.jsonc` me `mcp.servers` khaali mila (16:38
    par kisi ne Context7 hataya tha, shayad user ne). Panne par Context7 "Add" dabaya -> ~50 s tak "Added; not
    loaded yet", phir "Connected". CLI run aur **chalte app ki chat** dono me AI ne `context7["resolve-library-id"]`
    / `["query-docs"]` chalaya aur sahi jawab diya. Context7 juda hua chhoda hai. Baaki (Playwright, Chrome
    DevTools, Sequential Thinking, Memory, Superpowers) ek-ek karke chat me abhi nahi jaanche.
  - MCP tools "code mode" se chalte hain (`execute` tool me `tools.<server>[...]`) — chhote / bina tool wale model
    (jaise `qwen2.5-coder:7b`) inhe nahi chala pate.
- **Saare plugin ek-ek karke jaanche aur theek kiye (2026-11-17 ~17:20, user: "fix karo sabko ek ek karke")**:
  - Tarika: panne par "Add" (`node tools/press.mjs Add <naam> 15000`) -> status "Connected" -> AI se us tool ka kaam
    karwana. CLI run (`--standalone`) me har tool call dikhta hai, par wahan npx wale server der se judte hain, to
    prompt me likho "pehle `await search({query:...})`, na mile to 20 s ruk kar dobara". App ki chat: `node tools/chat.mjs "<sawal>"`.
  - Chale (asli tool call dekha): Context7 (`query-docs`), Playwright (`browser_navigate`, title "Example Domain"),
    Chrome DevTools (`new_page`, `list_network_requests` = 2, status 200), Sequential Thinking (`sequentialthinking`),
    Memory (`create_entities`, `read_graph`), Superpowers (skill `systematic-debugging` load hua), Figma skills
    plugin (`/api/skill` me 14 `figma-*` skills).
  - **GitHub kharab tha**: Sign in par server ka jawab 400 "Incompatible auth server: does not support dynamic client
    registration". Ilaaj: token. `catalog.ts` me `token: { variable, page }`; `config.ts` `serverOf()` likhta hai
    `oauth: false` + `headers.Authorization = "Bearer {env:GITHUB_PERSONAL_ACCESS_TOKEN}"`; panne par "GitHub token"
    line (Get token / chipkao / Save / Clear); `main.ts` `setToken` -> PowerShell `SetEnvironmentVariable(..., 'User')`
    (value child ke env se jata hai, command line / file me nahi). App ka server apna env start par leta hai, isliye
    Save ke baad "app band karke dobara kholo" (state `missing` / `restart` / `ready`). Jaancha: nakli token save ->
    registry me aaya -> Clear -> gaya; bina token "Authorization header is badly formatted (400)", `ghp_…` shakal ke
    nakli token par "token authentication failed (401)" = header sach me jata hai. **Asli token se nahi jaancha.**
  - **17:20 user: "abhi bhi kuch chijo ka error aa raha hai"** = Extensions me github laal "Failed: Authorization
    header is badly formatted" (token diya hi nahi tha) + meri jaanch ka atka hua "token saved" toast. Badla:
    header ab `Bearer {user-env:NAME}` (OpenCode ka `{env:}` nahi); `plugins/workflow/tokens.ts` + `index.ts`
    har settings-load par Windows ke user variables taaza padhta hai (`reg query HKCU\Environment`) aur header bharta
    hai; token na ho to server `disabled` (laal nahi). Isliye **app band-chalu ki zaroorat khatam**: Save ->
    `reload()` -> turant asar. State ab sirf `missing` / `ready`; galat token par "The token is wrong or has expired".
    Live: bina token `github: disabled`; nakli `ghp_…` save -> 20 s me "token wrong" (401); Clear -> `disabled`.
    Dhyan: ye workflow plugin par tika hai — use `config\opencode.jsonc` ke `plugins` se hataoge to GitHub ka token
    nahi bharega. Upar likha "app band karke dobara kholo" ab laagu nahi.
  - **17:30 user: "github me bhi error show kar raha hai"**: `disabled` server Extensions me switch dikhata hai;
    user ne switch on kiya -> bina token ke connect -> phir laal "badly formatted". Badla (`workflow/index.ts`):
    token na ho to `editor.remove(name)` — server app ke server ki list me aata hi nahi (na error, na switch);
    Plugins panne par line "Needs a token (below)" rehti hai. Live (restart ke baad): `/api/mcp` me github nahi;
    nakli `ghp_…` Save -> github aaya, "The token is wrong or has expired" (401); Clear -> phir list se gayab,
    user variable bhi gaya. Workflow plugin ka badlav `reload()` par hi lag jata hai (app restart nahi chahiye).
    Is beech doosra session `roshan-90` isi tree me hai: uska hissa `gui-plugins/src/local-models`, `tools/press.mjs`,
    `tools/chat.mjs`; mera `plugin-store` + `plugins/workflow`. App restart se pehle use message karo.
  - **Figma (MCP)**: user ne 17:17 par login kar liya, ab "Connected". Sign in sahi chalta hai (server ne `figma.com/oauth/mcp` ka login link diya, "pending"); aage
    user ka Figma account chahiye. Nahi jaancha: login ke baad ke tools.
  - **Memory**: file ab `config\memory.jsonl` (`MEMORY_FILE_PATH`), pehle npx ke cache me jati thi.
  - "Added; not loaded yet" ki jagah "Starting… (the first time can take a minute)"; jodne / hatane par toast ab
    aata hai (pehle `return` ke baad likha tha, kabhi nahi chalta tha).
  - Abhi jude hain: context7, playwright, chrome-devtools, github (token chahiye), figma (sign in chahiye),
    sequential-thinking, memory, Figma skills plugin, Superpowers. Tests: gui-plugins 27 pass.
- **App "Something went wrong ... starting the local server"**: PC vyast ho to andar ka server 2 min me taiyaar nahi
  hota aur app haar maan leta hai, jabki server thodi der baad chal jata hai. Ilaaj: us panne par "Restart" dabao
  (ya window reload). 2026-11-17 14:12 par ek baar hua.
  - 15:10 par phir hua (server "pairing web UI" banane me ~90 s leta hai). **Dev mode me us panne ka "Restart" mat
    dabao**: wo sirf electron ko dobara kholta hai, `electron-vite` (5173 wala dev server) mar jata hai aur app
    khaali reh jata hai. Sahi tarika: sab band karo, phir launcher.
  - **App ko poora band karna (restart se pehle zaroori)**: `Programming\opencode` wale saare process PED ke saath
    maaro (`taskkill /T /F`): electron, node (electron-vite), esbuild, bun (service), `opencode-pty.exe`, aur service
    ke bachche (`npx chrome-devtools-mcp`). Sirf electron/node maarne se bacha hua `opencode-pty.exe` port 9222 aur
    `logs\app.log` pakde rehta hai -> naya app bina DevTools port ke khulta hai / launcher chup-chaap kuch nahi
    chalata. Jaanch: `netstat -ano | findstr :9222` khaali hona chahiye.
- **Cloud-SSD projects (2026-11-17 ~19:15, user ne chuna: "coding projects Cloud-SSD par")** —
  `gui-plugins/src/cloud-projects/` (roshan-90 ka; `renderer.ts` / `main.ts` me 2-2 line, customize ke baad):
  - Jagah: Cloud-SSD ki fast drive ka ASLI folder (`%LOCALAPPDATA%\Cloud-SSD\settings.json` -> `Hybrid.Enabled`,
    `Hybrid.Root`; null ho to `%USERPROFILE%\Cloud-SSD\All Accounts`) + `Coding-Projects\<naam>`. Akshar (W:/Z:)
    kabhi nahi. `folders.ts` (`fastFolder`, `nameProblem`, `carried`, 6 tests), `main.ts` (`refresh/create/bring`;
    Cloud-SSD ki files sirf padhta hai), page: naya project (banao + `layout.draft` se chat kholo), list + Open,
    purana folder lao (`fs.cp`, `node_modules/dist/build/.next/...` chhod kar; asli folder nahi chhuta),
    "aakhri copy kab" = `hybrid-state.json` -> `Uploaded["Coding-Projects"]`.
  - roshan-48 (Cloud-SSD session) ke bataye sach, 19:07: naya folder wahan seedha NTFS folder hai, program ghanton
    chal sakte hain ("unmount mat karo" niyam sirf rclone ke akshar G:/Y: ka hai). Upload ki ikai = TOP-LEVEL cheez
    (poora `Coding-Projects`): andar kahin bhi 20 s shaanti ke baad `sync/copy`; koi exclude list NAHI ->
    `node_modules`, `.git`, `dist` sab jaate hain (har file ek Google request; hazaaron files = ghante, har badlav
    par poora ped dobara mila kar dekha jata hai); jo folder kabhi shaant nahi hota wo kabhi upload nahi hota aur
    ek waqt me ek hi cheez upload hoti hai. Ek-tarfa copy: PC par delete/rename cloud se nahi hat-ta. Top-level
    folder ka naam mat badlo. Sab kuch C: par bhi rehta hai ("sirf cloud" bana nahi). Exclude list Cloud-SSD app me
    banegi, par roshan-48 tabhi banayega jab USER usse kahe -> user ko yahi bataya hai; iske aas-paas jugaad nahi.
  - Models: roshan-48 ke mutabik 19:07 par 23 GB ka upload poora (0 baaki).
  - **Live (19:15-19:20)**: app restart (roshan-57 ke "restart now" ke baad) -> Settings > Cloud-SSD projects ->
    naya project `jaanch-site` -> folder bana + nayi chat usi folder me ("What should we work on in jaanch-site?")
    -> AI ne `index.html` likhi -> Cloud-SSD ne 19:18:20 par upload kiya (`G:\Coding-Projects\jaanch-site\index.html`)
    -> panna "Last copied to the cloud: 7:18:20 PM" dikhata hai. Nahi jaancha: "Choose folder" (Windows ka folder
    dialog script se nahi chalta; `bring` ka filter tests me jaancha).
  - Page kholne ka tareeka (script): `node tools/open-settings.mjs "Cloud-SSD projects"`. Ctrl+Shift+P wala raasta
    ek baar chat me type kar gaya tha — mat use karo.
  - roshan-48 skip list bana raha hai (user ka "wo sab kuch bhi karo"): `Hybrid.ProjectFolders` ["Coding-Projects"]
    + `Hybrid.SkipFolders` (node_modules, dist, build, out, target, .next, .nuxt, .turbo, .cache, .venv, venv,
    __pycache__), sirf project folders ke andar; .git jata hai; 5 min me har haal me upload. Lag jaye to page ka
    note (`cloud-projects/i18n/*.ts` -> `place.note`) badalna.
- **Poori jaanch: app se React project + OpenAI (2026-11-17 19:30-21:15, roshan-90; user: "ek project check
  karao, React me hostel life, code bana raha hai, test kar raha hai, mera OpenAI kaam nahi kar raha, upload video
  wala folder")**:
  - "Upload video" wala folder laptop par kahin NAHI mila (Downloads, Documents, Desktop, Videos, OneDrive, poora
    user folder 4 level tak). User se raasta lena hai.
  - **OpenAI 4 raaste, chaaron band** (CLI "Reply OK" se naapa): `opencode/gpt-*` = "Insufficient balance"
    (OpenCode credits khatam, paid); `github-copilot/gpt-*` = "Model unavailable" / "not available for integrator
    opencode"; `omniroute/auto/gpt` = cxa/dva bridge "not configured" -> 135 s retry ke baad fail; OpenAI provider
    app me juda hi nahi (integration `openai` me "Sign in with ChatGPT" oauth hai — user ke ChatGPT account se,
    sirf user kar sakta hai). Router me sirf `gemini` + `ollama-local` jude.
  - **Gemini (asli kaam karne wala)**: shaam tak 3.8-flash, 3.7-flash, 3-flash-preview, 3.1-pro, 4-argon sab
    "cooling down" (429); 2.5-* "no longer available" (404); sirf `gemini-3.1-flash-lite` chalta, wo bhi beech-beech
    503. `opencode/hy4-flash-free` = "Free usage limit reached".
  - **Hostel Life test** (`Coding-Projects\hostel-life`, Cloud-SSD projects panne se bana): app ne Vite React
    dhancha, SPEC.md, tasks/plan.md, PROGRESS.md, Vitest setup, `npm install` (react-router-dom, vitest,
    testing-library, jsdom) kiya (19:55-20:19, flash-lite). Phir combo `apna-coding` aakhri sahare
    `ollama-local/qwen2.5:7b` par gira jisne bekaar PROGRESS.md likh kar run khatam kiya. Do baar aur chalaya
    (purani chat `--session` se: app service aur standalone server dono ne ek hi chat pakdi -> requests 499 cancel,
    20 min kuch nahi; nayi chat `--standalone` + sirf flash-lite: 20 min me 9 jawab, ek bhi page nahi) -> roka.
    **Pages / Videos upload / tests ab tak NAHI bane.** `npm run build` (dhancha) mera chalaya: pass. Cloud-SSD
    skip list sahi: cloud copy me `node_modules` nahi.
  - Seekh: kisi app-chat ko CLI se aage badhana ho to `--session` + `--standalone` MAT milao (do server ek chat).
    CLI bina `--standalone` app ki service dhundh nahi paya aur nayi `serve --service` chala di (do service ek DB).
  - Link live: `qwen2.5:7b` (4.4 GB) "Bring to this laptop" se ~12 min me aaya (fetch); `test-cloud.ts qwen2.5:7b`
    = sab layer cloud me pehle se, 2.9 s me skip, "complete" true. Naya download -> store -> laptop se hatna app me
    NAHI jaancha. `qwen2.5:7b` abhi laptop par hai (combo ka sahara); user chahe to "Remove".
  - Bacha kachra: khaali folder `test-projects\model-jaanch` (safety check ne delete rokne diya), Default Project
    me roshan-57 ki chats.
- **Models ab Cloud-SSD "app link" se (2026-11-17 ~19:25)**: user ne roshan-48 (Cloud-SSD session) se kaha "jitna
  bhi model download ho laptop par save na ho, Cloud-SSD me save ho, dono me connection link". roshan-48 ne kaha:
  G: akshar se models mat likho (rclone cache me C: par doosri copy bachti hai, us din 24 GB). Uska draft:
  `%LOCALAPPDATA%\Cloud-SSD\app-link.json` {url 127.0.0.1, key (har start par naya; 401 par file dobara padho), pid};
  `GET /api/link/info`, `POST store?path&to&move`, `POST fetch?from&to`, `GET job?id`, `GET list?dir`,
  `POST free?dir` (cache ki copy hatao). Mera hissa (roshan-90) **likha + unit tests**, live NAHI:
  - `local-models/shelf.ts`: `Shelf` = {label, list, put, get, settle}; `folderShelf(folder)` (purana "Folder
    chuno") aur `linkShelf("Ollama-Models")` (app link; key kabhi log/dikhao mat; sirf 127.0.0.1 maana jata hai).
  - `engine.ts`: `hasStored/storeModel/restoreModel/listStored` ab `Shelf` lete hain (folder string nahi);
    restore me manifest pehle temp me, blobs, phir manifest engine ke folder me (adhoora model kabhi list nahi).
    `cloudFolder()` + `progress.ts cloudMount()` hata diye (G: akshar ab use nahi).
  - `main.ts`: `resolveShelf()` — jude hone par link (na chale to "Cloud-SSD is not running"), warna chuna folder.
    Jodte hi (`setCopy` cloud false->true) `free?dir=Ollama-Models` ek baar (purani 24 GB cache copy).
  - Tests: `engine.test.ts` (nakli model: store -> complete -> restore khaali folder me), `shelf.test.ts` (link file
    parse, sirf loopback; folder shelf). gui-plugins local-models 15 pass, typecheck saaf.
  - **Abhi chalte app me PURANA code hai** (G: wala). Restart tabhi karo jab roshan-48 kahe ki link install ho
    gaya, warna page "Cloud-SSD is not running" dikhayega aur cloud ke models ki list khaali aayegi. Restart ke
    baad live test: `bun run tools/test-cloud.ts` (pehle koi chhota model laptop par lao), page par "Bring to this
    laptop" -> "Remove" -> naya download -> apne aap cloud, laptop se hata, C: par cache badha nahi.
- **Cloud-SSD se jodo (2026-11-17 ~17:30, user: "ek baar connect, phir jab tak disconnect na karu sare model
  Cloud-SSD par rahe, laptop se load hate")** — `gui-plugins/src/local-models/` (ye hissa session roshan-90 ka;
  usi waqt roshan-57 `plugin-store` + `plugins/workflow` me GitHub token par kaam kar raha tha — ek doosre ki files
  mat chhuo, pehle `ListAgents`):
  - `progress.ts` `cloudMount(text)` + `engine.ts` `cloudFolder()`: `%LOCALAPPDATA%\Cloud-SSD\mounts.state.json` se
    Id `cloudssd` ka `Letter` + `Pid` padhta hai, process zinda ho tabhi `<Letter>:\Ollama-Models` deta hai (mara
    hua drive naam kabhi nahi chhuta). Akshar har baar naya padha jata hai (aaj G:, restart ke baad X:).
  - Settings (`copy` store) me naye `cloud`, `free` (purani saved settings me nahi hote -> `optionalKey`).
    `setCopy({auto, folder, cloud, free})`. Jude hone par: download khatam -> `queueCopy` -> `storeModel` (flat
    folder, ek file ek baar) -> `freeLocal` (copy poori ho + model `/api/ps` me loaded na ho tabhi `/api/delete`).
    `copyNow("*")` = sab bhejo; jinki copy pehle se poori hai unhe sirf laptop se hatata hai. "Laptop par lao" =
    purana `restore` (wapas lane par apne aap dobara nahi hatata; user "Hatao" dabaye).
  - Page: "Cloud-SSD" line (Connect / Disconnect), switch "Take models off this laptop", "Send all now", cloud par
    pade models ke saamne "Bring to this laptop". Purana "Folder chuno" tabhi dikhta hai jab Cloud-SSD juda na ho.
  - Naapa (`bun run tools/test-cloud.ts`): `all-minilm` (46 MB) G:\Ollama-Models me 3.8 s; ~20 s me Cloud-SSD ne
    Google par chadha diya (`cache\m-cloudssd\vfsMeta\...` me `"Dirty": false`). Drive: 15,292 GB khaali.
  - **Live (17:37-17:46, asli app + asli drive)**: "Connect Cloud-SSD" -> juda, `G:\Ollama-Models`; app restart ke
    baad bhi juda raha. "Send all now" -> `gpt-oss:20b` (13 GB) ~90 s me gaya aur laptop se hata, phir baaki; ant me
    laptop par 0 model (`.ollama\models` 46 KB), Cloud-SSD folder me 5 manifest. "Bring to this laptop"
    (`all-minilm`) -> Ollama me aaya aur wahin raha; "Remove" -> phir sirf cloud par. Naya download (`all-minilm`)
    -> Done -> apne aap cloud par, laptop se hata.
  - Do galtiyan mili aur theek ki: (1) `drainCopies` me queue padhne ke BAAD `await` tha, to "sab bhejo" me pehle
    ke alawa sab gir jaate the -> ab folder pehle dhundha jata hai, phir queue padhi jati hai; (2) "Copying … 0 KB /
    0 KB" atka rehta tha (`<Show>` ke andar seedhi string ek hi baar banti hai) -> fragment me rakha.
  - **Abhi ka sach (17:46)**: chaaron bade model Cloud-SSD ke cache me hain (`"Dirty": true` = Google par upload
    baaki, ~23 GB); C: ki khaali jagah 99 GB hi hai. Upload ke baad Cloud-SSD apna cache khud ghatata hai. Jaanch:
    `cache\m-cloudssd\vfsMeta\CloudSSD\Ollama-Models\sha256-*` me `Dirty`. Upload poora hone tak Cloud-SSD band /
    unmount mat karna (adhoore upload = agla mount der se).
  - Nahi jaancha: PC restart ke baad naya akshar (X:); Cloud-SSD band ho tab ka sandesh (code me hai, chala kar nahi
    dekha); 13 GB ko wapas lane ka asli samay; "Disconnect"; Hindi bhasha me ye panna.
  - **Sach jo user ko batana hai**: model cloud se seedha nahi chalta, chalane ke liye laptop par lana padta hai.
    Cloud-SSD ka apna cache (C:, mount ke liye 30 GB tak; us din 17.6 GB bhara) copy ko kuch der laptop par bhi
    rakhta hai, isliye jagah turant poori khaali nahi dikhti. Sab models hatne par router combo `apna-coding` ka
    aakhri sahara (`ollama-local/qwen2.5:7b`) bhi nahi chalega jab tak wo model wapas na laya jaye.
- **Download ke option (2026-11-17 dopahar, user: "speed, cancel, pause sab basic option")** —
  `gui-plugins/src/local-models/`:
  - Har download ki line: `47% · 6.1 GB / 13 GB · 12 MB/s · 9 min left` + bar. Button: **Pause** (chalte / line me),
    **Resume** (ruke hue par), **Retry** (fail par), **Cancel** (har haal me; pehle poochta hai), **Dismiss** (ho gaya).
  - `contract.ts`: phase `paused`; methods `pause`, `resume`; `cancel` ab = roko + line hatao + adhoori files delete.
    `main.ts`: `Job.progress` (pause ke baad bar peeche nahi jata), `pause/resume/cancel`, `runPull` ka `stopped()`.
    `engine.ts`: `removePartials(models, digests)` sirf `blobs\sha256-<hash>-partial*` hatata hai (poori layers nahi).
  - Upar ki patti me download hamesha dikhta hai (`gpt-oss:20b 61%`, ruka ho to `paused`), dabane par Offline models
    khulta hai. Iske liye `TitlebarItem` me naya `open?: boolean` (`plugin/src/gui/registries.ts`): label bina hover
    ke dikhe aur pill har layout me top bar me rahe (`app/src/runtime/plugin/titlebar-items.tsx`, `titlebar.tsx`).
  - Live (user ke apne `gpt-oss:20b` 13 GB download par): app restart ke baad Download dabaya -> 37% se chala (0 se
    nahi); Pause -> 51% par ruka, files bachi; usi dauran `nomic-embed-text` chala, 11% par Cancel -> poocha ->
    line gayi, uski `-partial` files 0, gpt-oss ki 17 files jaisi ki taisi; Resume -> 52% se aage. Pill home aur
    Settings dono me dikha, dabane par panna khula.
  - Nahi jaancha: app band ho jaye to download **apne aap** dobara shuru nahi hota (list khaali aati hai; Download
    dabane par wahin se chalta hai). Light mode me pill ka rang. Hindi (Hinglish) me naye button.
- **Default model** = `omniroute/auto/coding` (`config\opencode.jsonc` me `"model"`), user ke "speed chahiye" par.
  `qwen2.5-coder:7b` (Ollama) dheema hai aur file nahi bana pata (tool call text me likhta hai).
- **Apni settings**: `Programming\config\opencode.jsonc` (`plugins: ["../opencode/packages/plugins/workflow"]`),
  `OPENCODE_CONFIG_DIR` se. Purane OpenCode ki `~\.config\opencode` nahi chhui.
- **Launcher**: `Programming\Apna-OpenCode.cmd` (PATH me bun + `OPENCODE_CONFIG_DIR`, `bun run dev:desktop`,
  log `logs\app.log`) + Desktop shortcut "Apna OpenCode". Live: isi se app khula, `/banao` dikha.
- `Programming\README.md` (Hinglish: kya hai, kaise use, andar kaise juda, kya jaancha / nahi jaancha, wapas kaise).
- Tests: `cd opencode/packages/gui-plugins && bun test src/local-models src/router src/plugin-store` (25 pass);
  `cd opencode/packages/plugins/workflow && bun test` (8 pass). Type-check: core + gui-plugins saaf.
  Workflow plugin ka type-check nahi chala (naye package ke liye `bun install` dobara chahiye) — live chal raha hai.
- CLI ko kisi project folder me chalana: us folder me `cd` karke
  `bun run --cwd <opencode>/packages/cli src/index.ts run "..." --model omniroute/auto/coding --standalone --auto`
  (project = `PWD`). API jaanch: `MSYS_NO_PATHCONV=1 node tools/api.mjs <projectDir> 20 /api/plugin /api/skill ...`.

Live NAHI jaancha / baaki:
- `/banao` se poori website shuru se aakhir tak. "Folder chuno" button. Z: par asli copy (roshan-48 ke bolne tak
  nahi). Engine ka 1.5 GB download. Sahi key se naya provider. `bun run lint` (upstream ke lint niyam).
- PC par test ka kachra: Ollama me `all-minilm` (44 MB), `Programming\test-projects\chhoti-site`.

## Plan (pakka)
- [x] Phase 1: source se chalana (CLI + desktop dev).
- [x] Phase 2: Offline models page.
- [x] Phase 3: OmniRoute provider + Router page.
- [x] Phase 4: Workflow plugin (pehla roop).
- [x] Phase 6a: ek-click launcher + shortcut + README.
- [ ] Phase 4b: `/banao` ka poora live test ek chhoti website par; jo atke wo prompts / skills me theek karna.
- [x] Phase 5a: Kilo jaise agents (Ask / Debug / Orchestrator).
- [ ] Phase 5b: MCP list / marketplace ka page; Debug + Orchestrator ka asli kaam par live test.
- [ ] Phase 6b: naam / icon, installer (updater feed hata ke, alag channel), taaki dev mode ki zaroorat na rahe.
- [ ] Z: copy ka live test (roshan-48 / user ke haan ke baad), phir "auto copy" on karne ki salah.
Har phase ke baad live test, phir agla.

### "Customize" panna — BAN GAYA aur live jaancha (2026-11-17 shaam)
User ne maanga: Claude ke app jaisa "Customize" — apne skills, connectors, agents, commands, instructions, hooks
khud banana / badalna / hatana; har cheez asli me chale, dummy nahi.

Kahan: Settings > Customize (side ki patti me slider wala icon; command list me "Open Customize").
Code: `opencode/packages/gui-plugins/src/customize/` (`docs.ts`, `settings.ts`, `contract.ts`, `main.ts`,
`renderer.tsx`, `page.tsx`, `i18n/en.ts` + `hi.ts`, 15 tests) + register `gui-plugins/src/renderer.ts`, `main.ts` +
icon `app/src/shell/apna-rail.tsx` (`apna.rail.customize` in `app/src/runtime/i18n/en.ts`) + hooks chalane wala
hissa `plugins/workflow/hooks.ts` (+ test) aur `index.ts`.

Kya kahan save hota hai (sab `Programming\config\` me; server in files ko khud dekhta hai, restart nahi chahiye):
- Skill: `skills\<naam>\SKILL.md`. Command: `commands\<naam>.md`. Agent: `agents\<naam>.md`.
- Niyam (Instructions): `AGENTS.md`. Jawab ka andaaz: `response-style.md` + `opencode.jsonc` ke `instructions` me
  uska path (Normal = dono hat jate hain).
- Connector: `opencode.jsonc` > `mcp.servers.<naam>` (Plugins panne wale bhi isi list me dikhte hain).
- Hooks: `hooks.json`; workflow plugin har tool par ye file padhta hai (isliye save karte hi lagta hai).
Panne par "Active" tabhi likha aata hai jab app ka server us cheez ko apni list me de
(`client.skill.list / command.list / agent.list / mcp.list`), sirf file ban jane se nahi.

Live jaanch (app ki chat me, model apna-coding; har ek: banao -> AI use kare -> badlo -> hatao):
- Skill `jaanch-kela`: "Active"; AI ne "Used 1 Skill" ke saath skill wali line di; badla to nayi line; hataya to gaya.
- Command `/kela-cmd 55` -> AI ka jawab "CMD-OK-55" (`$ARGUMENTS` chala).
- Agent `kela-agent` (mode subagent): asli AI ne kaam diya, jawab "AGENT-OK-9917" laya.
- Niyam: "har jawab ke aakhir me NIYAM-5521" -> aaya; saaf kiya -> nahi aaya, `AGENTS.md` hat gayi.
- Andaaz (custom): "ANDAAZ-88 se shuru karo" -> aaya; Normal -> file aur `instructions` entry dono gaye.
- Connector web address (`https://mcp.deepwiki.com/mcp`): Connected, AI ne `tools.deepwiki.read_wiki_structure`
  chalaya. Connector program (`npx -y @modelcontextprotocol/server-everything`): Connected, AI ne `echo` chalaya.
  Dono hataye.
- Hooks: "After a tool" (`*`, `echo HOOK-SAW tool=%APNA_TOOL% file=%APNA_FILE%`) -> AI ko dikha
  "HOOK-SAW tool=write file=kela-hook-test.txt"; "Before a tool" (`write,edit,patch`, `... & exit 1`) -> file bani
  hi nahi, AI ko "Stopped by the user's hook ..." mila; "When the AI finishes" -> har chat par theek 1 baar chala;
  switch band -> nahi chala. Tool ke naam pakke: `write` (baaki `edit`, `patch`, `shell` code se).
Jaanch ke baad config saaf: koi test skill / command / agent / hook / connector nahi bacha.

Dhyan / jo nahi jaancha:
- "finished" ka signal = `session.execution.succeeded` (`session.status` idle is build me nahi aata). Subagent ke
  khatam hone par bhi chalta hai.
- Agent ka body uska POORA system prompt ban jata hai (OpenCode ka default prompt hat jata hai).
- Skill band karne ka switch nahi (OpenCode me flag nahi) — sirf "AI khud use kare ya nahi".
- Hindi (Hinglish) copy: saari 142 lines hain aur placeholder milte hain, par app ko Hindi me chala kar nahi dekha.
- Agent mode "Me / Both" (chat box me chunna) aur skill ka "khud use na kare" switch chala kar nahi dekhe.
- Light mode me panna nahi dekha.
- Jaanch ke tools: `tools/press.mjs` (button), `tools/dialog.mjs` (khula dialog / uska button),
  `tools/select.mjs` (drop-down), `tools/chat.mjs` (app ki chat me sawal). Git Bash me `/naam` wale argument ke
  liye `MSYS_NO_PATHCONV=1`.

### Patti wale panne Settings list se hate (2026-11-17 raat, roshan-5b; user: "jo home pe hai wo RT/Settings me na dikhe")
- Images, Offline models, Router, Customize (baayein patti ke icon) ab Settings ki list me NAHI dikhte; patti se
  wahi panne khulte hain. Tarika: `app/src/settings/settings.css` ke aakhir me CSS (`data-value` se row chhupao).
  List se hatana (filter) GALAT hai: tabs us page ko na paake pehle page (Providers) par chale jaate hain.
  Naya patti-panna jodo to uska id us CSS me daalo. Jaanch: `node tools/rail-check.mjs Images "Offline models"
  Router Customize` + `logs\81-settings-list.png`.

### Ghanti (notification) ab Notifications kholti hai (2026-11-17 raat, roshan-5b; user: "notification icon galat jagah le jata hai")
- Pehle sidebar ki ghanti `home.toggle` chalati thi -> "Search projects" khulta tha. Ab `app/src/shell/titlebar/apna-bell.tsx`
  (`titlebar.tsx` me `<ApnaBell />`): Popover me upstream ka `SidebarInbox` (Needs attention / Unread / Working /
  Recent) + ghanti par laal ginti (approval / input / done / failed, archived nahi). Chat par click -> wo chat khulti hai,
  panel band (location badalne par), ginti ghatti hai. `apna.sidebar.activity` key hata di (ab use nahi).
- Live: `logs\84-bell-home.png`, `85-bell-opened-chat.png`, `87-after.png`. App typecheck saaf.
- Nahi badla: baayein patti ka ghadi (History) icon abhi bhi `home.toggle` hai.

### Apne aap update (2026-11-17 ~20:30, session roshan-5b; user: "OpenCode upstream update aaye to mera bhi apne aap update ho, install ho, system se jodo")
Poora samjhao: `tools\auto-update\README.md`. Code: `tools\auto-update\update.ps1` (`check` / `apply` / `status` /
`rollback` / `install` / `uninstall` / `check -Target dev` = sirf jaanch). Windows Task "Apna OpenCode Auto Update"
(login +10 min, roz 10:00, `conhost --headless`) — JUDA HUA hai. Launcher `Apna-OpenCode.cmd` me `update.ps1 apply`.
- Upstream ke release tag (vX.Y.Z) follow karta hai, dev nahi. Release commit dev se side me hota hai ("release: vX"
  sirf version + CHANGELOG + bun.lock). Clone shallow tha -> `--shallow-since=2026-10-25` se gehra kiya.
- Pehli baar `opencode\` ka poora working tree commit hua: `1407b37 apna: auto-save` (updater karta hai; files nahi
  badalti). Jaanch alag git worktree `Programming\update-work` (branch `apna-update`) me; pehle wali jaanch fail ho to
  update me nahi gini jati. bun.lock-only takraav = upstream ka lo + bun install.
- **`tools\auto-update\ROKO.txt` hai** (roshan-d0 ne kaha: uske UI kaam ke beech merge nahi). Jab tak ye file hai,
  `apply` kuch nahi lagata. roshan-d0 kaam khatam batayega -> file hatao.
- OmniRoute update (npm, app band ho tab, `~\.omniroute` backup, fail = purana wapas) aur rollback: likha, chala kar
  NAHI dekha (abhi koi naya OmniRoute version nahi, koi update laga nahi).
- Jaancha (20:32-20:34): `check -Target dev` (upstream dev, 30 naye commit) -> merge saaf, saari jaanch pass, kuch
  lagaya nahi. Asli `check` -> v2.3.0 (release commit) milaya, pass, `state.json` = `ready`, toast, `apply` ROKO.txt
  ki wajah se ruka. Type-check sach me galti pakadta hai (nakli galti daal ke dekha). Workflow typecheck pehle se fail
  (`index.ts` TS2307) — gina nahi jata. `apply` ka asli merge + launcher wala raasta abhi NAHI chala (ROKO).
- 21:22: roshan-d0 ne kaam khatam karke ROKO.txt hata di (roshan-90 ki line pehle hi gayi thi). d0 ke 28 files
  auto-save `230453d` me; v2.3.0 usi ke upar dobara jaancha -> pass, `ready` (commit 0609670). App chal raha tha,
  isliye abhi laga NAHI.
- 22:14: roshan-d0 ne naye kaam (Images / Terminal) ke liye ROKO.txt WAPAS rakhi. Updater badla: `apply` tabhi lagata
  hai jab HEAD = jaancha hua `state.head` (warna `status new`, agli `check` dobara jaanchti hai); `check` bhi dobara
  jaanchta hai agar code badla ho. Chala ke dekha: naye badlav ke saath v2.3.0 phir pass (50d1672), ROKO se ruka.
- Agla kadam: roshan-d0 ROKO.txt hataye -> app band karke launcher se kholo -> `logs\auto-update.log` me "Update v2.3.0 laga" -> app chala ke
  dekho (mic, sidebar, plugins sab waise hi). Kuch toote to `tools\auto-update\Wapas-Lo.cmd`.

### Agla kadam
1. User se pucho: aage kya pehle — (a) `/banao` ka poora test, (b) Kilo jaise agents, (c) installer (.exe).
2. Phase 4b: `Programming\test-projects\` me naya khaali folder -> app me kholo -> `/banao ek chhoti todo website`
   (model `omniroute/auto/coding`) -> har stage dekho, jo atke use `packages/plugins/workflow/prompts.ts` me theek karo.
3. Z: copy: pehle roshan-48 (Cloud-SSD session) / user se pucho ki Z: khaali hai; phir Settings > Offline models >
   "Folder chuno" -> `Z:\Ollama-Models` -> `all-minilm` par "Copy banao" (chhota hai) -> phir bade models.
App chalane ke liye: `Programming\Apna-OpenCode.cmd`. Band karne ke liye: app ki window band karo
(Ollama aur OmniRoute peeche chalte rehte hain — jaan-boojh ke, taaki terminal wale tools bhi unhe use kar sakein).

### Model jaanch (2026-11-17 raat, session roshan-d0; user: "har model check karo, kaun chal raha, kaun sahi/galat")
- Scripts: `tools/model-check.mjs <out.json> model...` (router ko seedhe 3 sawal: hisaab=9, Hinglish, tool call;
  `served` = asal me kis model ne jawab diya) aur `tools/oc-convo.sh <provider/model> <slug>` (asli OpenCode CLI,
  Cloud-SSD project `Coding-Projects\jaanch-site` me 3 baat: project ke baare me, `model-test/<slug>.js` banao,
  pichhli baat yaad). Nateeje `logs/model-check/`. CLI ko `--cwd packages/cli` se chalana zaroori (warna
  "Cannot find module react/jsx-dev-runtime"); `--archived` taaki app ki list na bhare.
- Nateeja (daur 1+2): chalte sirf combo (asal me Gemini 3.1-flash-lite / 3-flash-preview) + ddgw (DuckDuckGo, jaldi
  429). Bandh: dva (DEVIN_AGENTIC_HOME nahi), aug (auggie CLI nahi), zc (zcode nahi), cxa (Codex transport nahi),
  cfp (Playwright Chromium nahi), unc (401), gemini ke kai model "quota exceeded / cooling down". Ollama laptop par
  0 chat model (sab Cloud-SSD par) -> `auto/offline` bhi Gemini se chala ya fail. Koi GALAT jawab nahi mila.
- `apna-coding` OpenCode me: 3/3 sahi (project padha, file bani, jodo(2,3)=5, yaad rakha).
- `jaanch-site/model-test/*.js` test files hain (Cloud-SSD par upload ho jati hain; PC se delete karne par cloud se nahi hat-ti).
- Asli OpenCode (CLI, Cloud-SSD project) me 3/3 sahi: `apna-coding`, `auto/best-coding`, `auto/coding` (toote cfp par
  retry, thoda dheema), `eco-heavy`, `gemini/gemini-3.1-flash-lite` — sab asal me Gemini flash-lite. Jawab 12-80 s.
- Nahi chale: `ddgw/*` (OpenCode ki list me hi nahi — router "tools:false" batata hai); `opencode/*-free` (12 jaanche)
  "Free usage limit reached"; `opencode/claude-sonnet-5-5` "Insufficient balance"; `github-copilot/*` (5 jaanche)
  "Model unavailable" (Copilot login nahi, sirf naam list me). Desktop app ki chat window se is baar nahi jaancha
  (roshan-90 us waqt app restart karke apna test chala raha tha).
- Asli khatra: sab kuch ek hi Gemini key par tika hai, jo "quota exceeded" ke kareeb hai.

### UI kaam (2026-11-17 raat ~20:30-21:20, session roshan-d0) — BAN GAYA + LIVE JAANCHA
User ne maanga: mic, Codex/ChatGPT jaise sidebar hisse, terminal dikhao/chhupao, share, "banaya hua project chalao
(server)", Images (photo banana), plugin kaam kare, aur plugin, Claude jaisa Customize (connectors / plugin
marketplace categories / Memory), har cheez prompt de kar jaancho.
Backup: `Programming\backup\2026-11-17_2026_ui-mic-terminal-share-run-customize\before\` (app/src, gui-plugins/src,
plugins/workflow, desktop/src, ui/src/i18n, opencode.jsonc). Auto-update ruka hai: `tools\auto-update\ROKO.txt` me
meri line — kaam + live test ke baad apni line hatana (roshan-5b ka niyam).
Bana (typecheck saaf, tests pass, LIVE ABHI NAHI):
- `gui-plugins/src/apna-tools/` (naya): chat header me Terminal (`terminal.toggle`), Run (play; `detect.ts`: npm
  dev/start/serve/preview + zarurat ho to `npm install`, Python manage.py/Flask/FastAPI/streamlit, warna index.html
  -> apna static server 5500+; URL log se; menu: yahin kholo (in-app browser, `links.open origin "browser"`),
  browser me kholo, roko, log), Share (chat text copy / `chats\<title>.md` project me / JSON export / folder).
  Command `apna-tools.dictate` (Ctrl+Shift+M) = PowerShell se Win+H (Windows voice typing).
- `app/src/composer/editor/mic-button.tsx` (naya) + `editor.tsx` me Send se pehle (sirf normal mode).
- Sidebar rows (`shell/titlebar/titlebar.tsx`): Search, Images, Plugins, Customize, Shortcuts (labels `apna.sidebar.*`).
- `gui-plugins/src/apna-images/` (naya): Settings > Images: prompt + model (router ke aihorde muft + gemini image)
  + size -> `/v1/images/generations` -> `Pictures\Apna-OpenCode\` + `pictures.json`; gallery. Gemini image quota
  khatam; `aihorde/Dreamshaper` curl se chala (webp). Key = env OMNIROUTE_API_KEY.
- `renderer.ts` / `main.ts` me dono naye plugin jode.
Baaki: Customize me Memory + marketplace categories + naye connectors; live test (app restart roshan-90 se pooch kar).
- (20:45) Memory bana: `plugins/workflow/memory.ts` (+test) — `config\memory.md` ("- " lines); `index.ts` context
  hook har agent ke system me memories jodta hai; tools `memory_save`, `memory_forget`. Customize me tab "Memory"
  (`customize/memory.ts` = workflow wali copy; contract `memories` + `saveMemories`). Tabs ab: Skills, Connectors,
  Plugins, Memory, Agents, Commands, Instructions, Hooks.
- Plugins panna = marketplace: `catalog.ts` me `category` (code/browser/design/search/data/deploy/work/think/skills),
  chips + search (`page.tsx`), 19 naye: anthropic-skills (git pack), bina login: deepwiki, svelte, exa,
  microsoft-learn, huggingface, cloudflare-docs, aws-knowledge (sabne MCP initialize par 200 diya); login wale
  (401 + OAuth registration_endpoint = app ka Sign in chalega): sentry, semgrep, canva, supabase, neon, vercel,
  netlify, cloudflare, notion, linear, atlassian. Stripe nahi liya (registration pakka nahi).
  Auto-mode ne "alag config me 24 MCP ek saath chalao (npx bhi)" wala test ROKA — curl initialize se jaancha.
- Typecheck: gui-plugins + app saaf; tests gui-plugins 34 pass, workflow 24 pass.
- AGLA: app restart (roshan-90 se "go" ke baad) -> live test: header buttons, mic, sidebar rows, Images (aihorde),
  Memory (chat me "yaad rakho" -> nayi chat me poochho), naye plugin Add -> Connected -> chat me tool chalwao.
- (21:20) LIVE jaancha asli app me (restart 20:53): Terminal button khula/chhupa; Share copy (clipboard) + save
  (`run-node\chats\*.md`); Run: `test-projects\run-node` (npm start -> localhost:4321, app ke browser me dikha, Stop)
  aur `chhoti-site` (static 5500, Stop); Mic -> Windows voice typing "Listening..."; sidebar rows; Images
  (aihorde/Dreamshaper ~8 s); Memory (panne se jodo -> app chat ne yaad bataya -> Delete); DeepWiki + Exa jode ->
  chat me tool chale; Notion -> "Sign-in needed" + button -> hataya.
- Live me mili aur theek ki: (1) "Open here" kuch nahi kholta tha -> `browser/renderer.tsx` me naya LinkHandler
  (origin "apna-run", sirf jab pane khul sake; warna system browser). (2) Memory row ka "Add" kat raha tha. (3) Share
  me har AI step alag "## AI" -> ek heading. (4) Chrome DevTools "Failed: Request timed out" -> npx wale servers ko
  `timeout: {startup, catalog: 120000}` (`plugin-store/config.ts` `localStartupMs`; maujooda 4 entries
  `tools/add-mcp-timeout.ts` se) -> Connected.
- Abhi jude plugins: context7, playwright, chrome-devtools, sequential-thinking, memory, figma, github(token nahi),
  deepwiki, exa. `config\memory.md` khaali (test memory hata di).
- Backup complete: `backup\2026-11-17_2026_ui-mic-terminal-share-run-customize\complete\` (+README.md).
- Jaanch scripts: `tools/ui-press.mjs` (aria-label / css / menuitem click, type, shot). Settings ka panna kholne ke
  liye `tools/open-settings.mjs "<naam>"` (drive-app `settings:` kaam nahi karta). Settings khula ho to chat sidebar
  chhupa hota hai; rail ka `label:New chat` se wapas.
- Dhyan: user ki chat "Ye kya hai" ka model "GLM-5.3-Flash Free" (opencode Zen) hai, jiski muft limit khatam hai.
- Nahi jaancha: login wale plugins ka asli login, Run me `npm install` wala raasta, Python project, Hindi labels.
- (21:30) roshan-5b: mera saara kaam auto-save commit 230453d me; upstream v2.3.0 uske upar update-work me jaancha (sab check pass, sirf workflow typecheck pehle jaisa fail). Agli baar Apna-OpenCode.cmd se kholne par lagega.

### "Codex jaisa" Images + Terminal (2026-11-17 raat ~21:45-22:30, roshan-d0; user: "codex me kaise hai waise hi image terminal")
- Codex ki asli app dekhi (click-window.ps1 se kuch click; app.asar ke English labels padhe, code/asset NAHI liya):
  `logs\ref-codex-6..9.png`. Codex Images = alag poora panna (rail ka 2nd icon): "Images", Trending / Templates /
  My images, picture cards, neeche tairta composer (+ photo, "Auto" aspect, mic, send), preview (Remix / Use style /
  Prev-Next). Terminal = View > Open Terminal (Ctrl+`), neeche ka pane (setting: bottom/right).
- Terminal: `app/src/session/screen.tsx` — naya terminal tab ek baar side se `bottom` pane me jata hai
  (`tabs().move(key,"bottom")`), side region khaali ho to band. User drag karke wapas side le jaye to wahin rehta hai.
  Live: neeche khula (logs\109), toggle se chhupa (110).
- Images: `gui-plugins/src/apna-images/` naya `page.tsx` + `page.css` (Style registry `?inline`) + `ideas.ts`
  (10 apne idea + 8 style templates, `fullPrompt`, aspects) + `ideas/*.webp` (apni AI Horde tasveerein,
  `tools/make-idea-pictures.ts`; free line lambi ho to 504 — jo na bane wahan rangeen card). "+" = img2img:
  `contract.photo` + `make.photo` -> router body `image` (data URL; aihorde `source_image`). Preview: Remix,
  "Edit this image" (usi ko photo bana deta hai), Open, Folder, Delete, ←/→/Esc.
  Settings shell: `data-apna-page` (`settings/shell.tsx`) + `settings.css` aakhir me: Images par settings list chhupi,
  content box relative, page absolute inset 0 (composer neeche tairta). Rail ka 2nd icon ab Images
  (`shell/apna-rail.tsx`, "Search chats" hata — sidebar me search hai).
- Dhyan: user is waqt khud app chala raha tha (Future city card dabaya, Notifications khola) -> app ko script se mat
  chalao jab user saamne ho. Har app restart par purane npx MCP child process bache rehte hain (taskkill "not supported").
- ROKO.txt me meri line wapas hai (22:00) — kaam + live test ke baad hatani hai.
- (22:45) Images live: panna + cards (18/18 tasveerein bani) + composer neeche (naap: composer 735-790 / window 816) +
  Watercolor template se tasveer + preview. Edit (img2img): photo jaati hai par khaali prompt par nayi tasveer bani ->
  `withoutStyle()` se ab purana vishay composer me aata hai; ISKA live test baaki (user us waqt app chala raha tha).
  roshan-5b ne Settings list se rail wale panne (apna-images, local-models, router, customize) CSS se chhupaye
  (`settings.css` aakhir me) — pehle filter se rail ke panne Providers par khul rahe the, CSS par badla.
  Window minimize ho to Playwright click nahi chalta -> `tools/ui-press.mjs js:<selector>` / `fill:<sel>|<text>`.
  ROKO.txt hata diya (22:45).
