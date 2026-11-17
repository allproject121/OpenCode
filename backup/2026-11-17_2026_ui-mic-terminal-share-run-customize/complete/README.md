# Mic, Terminal, Run, Share, Images, Memory, Plugins marketplace (2026-11-17 raat)

## Yeh kya hai
Apna OpenCode me wo cheezein jo Codex / ChatGPT / Claude app me thi aur yahan nahi thi:
- chat ke upar **Terminal**, **Run (project chalao)**, **Share** ke button
- composer me **mic** (bolkar likhna)
- sidebar me naam wale hisse: **Search, Images, Plugins, Customize, Shortcuts**
- **Images** panna (shabdon se tasveer)
- Customize me **Memory** (AI aapki baatein yaad rakhe)
- **Plugins** panna marketplace jaisa: categories, search, 19 naye plugin
- Chrome DevTools plugin ka "Failed: Request timed out" theek

## Kaise use hota hai
- **Terminal**: chat ke upar `>_` button (ya Ctrl+`) — dabao to neeche/side me project ke folder ka terminal, dobara dabao to chhup jaata hai.
- **Run (▷)**: menu me "Run it". App khud dekhta hai project kaisa hai:
  `package.json` me dev/start/serve/preview script -> `npm run dev` (zarurat ho to pehle `npm install`);
  Python (manage.py / Flask / FastAPI / streamlit) -> python se; sirf `index.html` -> app ka apna web server (5500 se).
  Chalne par address dikhta hai: "Open ... here" = app ke andar browser, "Open in my browser", "Stop", aur log.
- **Share**: chat text copy, chat ko `project\chats\<naam>.md` me save, JSON export, project ka folder.
- **Mic**: Send ke paas mic (ya Ctrl+Shift+M) -> Windows ki voice typing khulti hai, jo bolo wo chat box me likha jaata hai.
  Pehli baar Windows "Microsoft Speech Services" ka parichay dikhata hai.
- **Images**: sidebar > Images. Likho kya chahiye, model (muft `aihorde/...`) chuno, "Make picture".
  Tasveerein `C:\Users\Roshan\Pictures\Apna-OpenCode` me.
- **Memory**: Customize > Memory me likho, ya chat me "yaad rakho ki ..." — AI khud save karta hai; "... bhool jao" se hat-ta hai.
  File: `Programming\config\memory.md`. Har nayi chat ise padhti hai.
- **Plugins**: sidebar > Plugins. Category chuno ya search karo, "Add". Bina login wale turant "Connected";
  login wale (Notion, Linear, Supabase, Vercel...) "Sign in" button dikhate hain.

## Andar se kaise juda hai
```
chat header ── apna-tools plugin (gui-plugins/src/apna-tools)
                 ├─ Terminal  -> command "terminal.toggle" (upstream terminal plugin)
                 ├─ Run       -> main process: detect.ts -> cmd /c npm run dev | apna static server
                 │               -> URL log se -> links.open(origin "apna-run") -> browser plugin pane
                 ├─ Share     -> server se message.list -> chat-text.ts (Markdown) -> clipboard / file
                 └─ dictate   -> PowerShell keybd_event Win+H  <── composer mic-button.tsx
Images panna ── apna-images plugin -> OmniRoute /v1/images/generations -> Pictures\Apna-OpenCode
Memory ──────── config\memory.md <── Customize (customize/memory.ts) aur AI ke tools memory_save / memory_forget
                 └─ workflow plugin har request ke system prompt me memories jodta hai
Plugins ─────── plugin-store/catalog.ts (category) -> config\opencode.jsonc mcp.servers
                 npx wale servers ko timeout.startup/catalog 120000 ms
```

## Files
`CHANGED-FILES.txt` me poori list; finished copies `files\` me. Purani haalat `..\before\` me.

## Jaancha (live, asli app me, 2026-11-17 ~21:00)
- Terminal button: khula (PowerShell, project folder), dobara dabane par chhupa.
- Share: copy -> clipboard me poori chat; save -> `run-node\chats\Run button test.md`.
- Run: `run-node` (npm start) -> "Running", `localhost:4321`, app ke browser me "RUN-NODE-OK", Stop -> port khaali.
  `chhoti-site` (sirf html) -> app ka web server `localhost:5500`, Stop -> band.
- Mic: Windows voice typing khula, "Listening..." dikha.
- Sidebar rows: Search (chat mili), Images, Plugins, Customize, Shortcuts.
- Images: `aihorde/Dreamshaper` se lal seb ki tasveer ~8 s me, gallery me dikhi.
- Memory: CLI me AI ne memory_save chalaya, nayi chat me yaad aaya, memory_forget se hata; panne se jodi ->
  app chat ne "TEST-MEM-7" bataya -> Delete.
- Plugins: DeepWiki aur Exa jode -> Connected -> chat me dono ke tool chale, sahi jawab. Notion jodo -> "Sign-in needed"
  + Sign in button -> hataya. Chrome DevTools: timeout badhane ke baad "Connected".
- Tests: gui-plugins 58 pass, workflow 24 pass; app + gui-plugins typecheck saaf.

## Nahi jaancha
- Login wale plugins ka asli login (aapka account chahiye): Notion, Linear, Sentry, Semgrep, Canva, Supabase, Neon,
  Vercel, Netlify, Cloudflare, Atlassian. Anthropic skills pack ka clone.
- Run me `npm install` wala raasta (asli React/Vite project) aur Python project.
- Voice typing me asli bolkar Hindi likhna (Windows ki bhasha par nirbhar).
- Hindi bhasha me naye sidebar labels (abhi English).

## Wapas kaise jaayein
`..\before\` se files wapas copy karo (`opencode\packages\...` aur `config\opencode.jsonc`), aur naye folder hatao:
`gui-plugins\src\apna-tools`, `gui-plugins\src\apna-images`, `app\src\composer\editor\mic-button.tsx`,
`plugins\workflow\memory*.ts`, `gui-plugins\src\customize\memory.ts`. Phir app band karke dobara kholo.

## Doosra daur: "Codex jaisa" Images aur Terminal (2026-11-17 raat ~22:00-22:45)
- **Terminal**: ab Codex ki tarah chat ke **neeche** khulta hai (pehle daayein). Aap tab ko drag karke daayein le jaao to
  wahin rehta hai. `app/src/session/screen.tsx`.
- **Images**: Codex jaisa alag poora panna (rail ka doosra icon): "Images", Trending / Templates / My images, bade
  card (apni banayi tasveerein `ideas/*.webp`), neeche tairta composer: + (apni photo badlo), style chip, model,
  "Auto" aakaar, mic, bhejo. Tasveer dabao = bada preview: Remix, "Edit this image", Open, Folder, Delete, ←/→.
  Settings ki list Images par chhupi rehti hai (`settings/shell.tsx` `data-apna-page` + `settings.css`).
- Jaancha (live): terminal neeche + chhupna; Images panna, cards, composer neeche, Template "Watercolor" + prompt se
  tasveer (~30 s), preview. "+"/Edit se photo chip laga aur router ko gayi, par pehli koshish me prompt khaali tha to AI
  ne nayi tasveer banayi -> ab Edit purana prompt (style hata kar) composer me daalta hai; ye sudhar live nahi jaancha
  (aap app chala rahe the).
- Muft AI Horde ki line kabhi bahut lambi hoti hai (bina key wale sabse peeche) -> "504 / queue" error aa sakta hai.
