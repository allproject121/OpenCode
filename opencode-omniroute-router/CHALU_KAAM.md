# CHALU_KAAM — AI Coding Ecosystem (opencode-omniroute-router ke upar)

Naya session (Claude ya Codex) yahan se shuru kare. Pehle ye file poori padho, phir "Abhi ka haal" -> "Agla kadam" se kaam chalu karo.

## Idea kahan hai
- `C:\Users\Roshan\Downloads\My_Own_AI_Coding_Ecosystem_Idea.md`
- `C:\Users\Roshan\Downloads\First_Four_Conversations_AI_Coding_Ecosystem.md`
- Approved plan: `C:\Users\Roshan\.claude\plans\c-users-roshan-downloads-opencode-omniro-cuddly-hejlsberg.md`

## User ke faisle (2026-11-17)
- GitHub wala hissa (.github, .git, package.json links, README badges) **rahne do** — chhoona nahi.
- Kaam **isi folder** me (original copy nahi banani).
- Router = **OmniRoute** (apna router nahi banana).
- Pehla cloud provider = **Gemini**. Key user khud OmniRoute dashboard me daalega; key code/chat/Git me kabhi nahi.
- User Hinglish me baat karta hai; simple Hinglish me jawab do.

## Steps (plan)
0. Taiyari: backup + ye file + baseline test
1. Tools: OpenCode, OmniRoute install (user ki permission se), Ollama theek karna
2. Classifier English + Hinglish
3. Local/offline worker (Ollama)
4. `doctor` command
5. OmniRoute me Gemini + combos + fallback
6. Stats: cloud/local/fallback
7. README section
Har step ke baad `npm test`; poore kaam ke baad live test, phir `complete\README.md`.

## Backup niyam
- Backup: `backup\2026-11-17_0204_ecosystem-start\before\` — isko **kabhi mat chhoona**.
- Isi kaam ke liye dusra backup mat banao. Koi file bigde to `before\` se single file wapas copy karo.
- Kaam bana + live test pass -> `backup\2026-11-17_0204_ecosystem-start\complete\` me badli files + `README.md` (Hinglish: kya hai, kya hua, kaise use, connection, files, jaanch, wapas kaise jaayein).

## Test commands
- `npm test` (folder: `C:\Users\Roshan\Downloads\opencode-omniroute-router`) — baseline: 50 pass, 0 fail.

## Dhyan rakho (galtiyan jo ho sakti hain)
- Classifier pehle sirf Spanish words samajhta tha; Spanish wale tests todne nahi hain.
- `ollama` command PATH me nahi mila, par `C:\Users\Roshan\.ollama\models` me qwen2.5 / qwen3.8 hain.
- OpenCode aur OmniRoute PC par install nahi the (2026-11-17).
- Global install / dashboard me key daalna = user se pucho.

## Abhi ka haal (2026-11-17 ~02:50)
**User ne kaha: "pura kaam automatic karo, meri sari permission hai"** (model download, install, setup sab allowed). Sirf Gemini key user ke Google account se hi ban sakti hai.

Code (repo `C:\Users\Roshan\Downloads\opencode-omniroute-router`), `npm test` = 98 pass:
- [x] Step 0 backup (`backup\2026-11-17_0204_ecosystem-start\before\`), baseline 50 pass.
- [x] Step 2 classifier English + Hinglish + `local: true` (offline/ollama/bina internet).
- [x] Step 3 local-worker: `src/task-router.mjs` (`decide()`, `workers.local`), `src/router-plugin.mjs` (pehle `plugin.mjs` tha; gateway health -> local fallback, history me `local`/`fallback`, result ke upar `ROUTED:` line), `templates/agents/local-worker.md`, orchestrator template, `src/cli.mjs init --local/--gateway/--ollama` (ollama provider `tool_call` + `limit` ke saath).
- [x] **Live bug fix:** OpenCode plugin module ke HAR export ko function maan ke chalata hai ("Plugin export is not a function") — original project me bhi bug tha. Ab `src/plugin.mjs` sirf `OmniRouteRouterPlugin(input, options)` export karta hai; library `src/router-plugin.mjs` (`package.json` exports `./router`). Test: entry module sirf functions export kare.
- [x] Step 4 `doctor`, `stats` CLI. Step 6 stats routing/byTier. Step 7 README.
- [x] Expert default model `auto/coding:pro` is OmniRoute version me nahi tha -> `omniroute/auto/pro-coding`.

PC setup (sab ho gaya):
- OpenCode 1.19.5, OmniRoute 3.8.53 (`%APPDATA%\npm`), Ollama 0.40.16 (`%LOCALAPPDATA%\Programs\Ollama`).
- OmniRoute daemon: `omniroute serve --daemon --no-open`, sirf 127.0.0.1 (user env `OMNIROUTE_SERVER_HOST=127.0.0.1`, `REQUIRE_API_KEY=true`); Wi-Fi IP se band (checked). Encryption key `%APPDATA%\omniroute\.env`, copy `~\.omniroute\.env` (CLI warning ke liye).
- Client key: user env var `OMNIROUTE_API_KEY` (name `opencode-ecosystem`). Key kabhi file/Git me nahi.
- OmniRoute providers: `ollama-local` (baseUrl `http://localhost:11434/v1`, active). Combos: `eco-light`, `eco-heavy` (abhi sirf `ollama-local/qwen2.5-coder:7b`; Gemini key aane pe Gemini ko AAGE jodna).
- Free `auto/*` channels bina key ke kaam NAHI karte (cloudflare playground ko browser chahiye, uncloseai band). Cloud ke liye Gemini key zaroori.
- OpenCode global config `~\.config\opencode\opencode.json`: `omniroute` provider, `apiKey: "{env:OMNIROUTE_API_KEY}"`, combos manually jode.
- Ollama: user env `OLLAMA_CONTEXT_LENGTH=16384` (default chhota tha). Models: `qwen2.5-coder:7b`.
- **`qwen2.5-coder:7b` asli tool call nahi karta** (tool call text JSON me likhta hai) -> OpenCode orchestrator Task call nahi karta. `qwen2.5:7b` pull ho raha hai (native tool calling) — test karke combos/local-worker usi pe karna.

Test project: `C:\Users\Roshan\Downloads\ecosystem-test-project` (git, `npm test` 2 pass; bug: `cartTotal([])` crash; README typo "shoping"). `.opencode/opencode.json` me plugin = `file:///C:/Users/Roshan/Downloads/opencode-omniroute-router/src/plugin.mjs`. Logs: `C:\Users\Roshan\Downloads\ecosystem-test-logs\`.
Live run command (Git Bash): `OMNIROUTE_API_KEY=... opencode run "<request>" --print-logs --log-level INFO`; history `~\.smart-opencode\history.jsonl`.

UI + live test (2026-11-17 ~03:20), `npm test` = 111 pass:
- [x] **Sangam UI** (user ne naya UI + naam maanga): `src/ui-server.mjs`, `ui/index.html`, `src/health.mjs`, CLI `ui --project <dir> --port --no-open`, launcher `Sangam.cmd` (OmniRoute daemon chalu karta hai, phir UI). Port 4510, sirf 127.0.0.1, token + Host check, OpenCode bina shell ke.
- [x] Do run modes: "direct" (default; router worker chun ke `opencode run --agent <worker>`, history Sangam likhta hai `source: "sangam"`) aur "orchestrator". Isliye worker templates `mode: all` + "Working rules" (sawal mat pucho, file edit/write tool se, sirf project ka test command).
- [x] Model: `qwen2.5:7b` (OmniRoute ke raste native tool call deta hai); `qwen2.5-coder:7b` tool call text me likhta hai — use mat karo. Combos `eco-light`/`eco-heavy` = `ollama-local/qwen2.5:7b`.
- [x] Live (test project): free, fast (typo theek), standard (bug fix + tests pass), explicit offline -> local-worker, OmniRoute band -> fallback. `doctor` All good.
- [x] `backup\2026-11-17_0204_ecosystem-start\complete\` (files, CHANGED-FILES.txt, README.md, screenshot).
- Kuch commit/push nahi kiya (user ne nahi kaha).

Kami (sach): Gemini juda nahi -> "cloud" tiers bhi abhi local model se chalte hain; orchestrator mode chhote model pe Task call nahi karta; local model ne ek baar test likhne se mana kiya; strong/expert/exploration live nahi chale; UI sirf screenshot + API se jaancha.

### Agla kadam
1. User se Gemini key: `http://localhost:20128` -> Providers -> Gemini (ya `omniroute providers add gemini --credential-stdin`). Phir combos dobara banao Gemini AAGE, Ollama peeche (`omniroute combo delete/create`), aur test project me `init` dobara chalao.
2. Gemini ke saath: orchestrator mode, strong/expert, exploration live test.
3. Baad ke phase (idea file): Qwen Code, parallel agents, Cloud-SSD, multi-key/spending limit, installer.

Chalane ke liye: `Sangam.cmd` (double-click) ya `node src\cli.mjs ui --project <dir>`; OmniRoute: `omniroute serve --daemon --no-open` (env `REQUIRE_API_KEY=true`, `OMNIROUTE_SERVER_HOST=127.0.0.1`).