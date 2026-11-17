# Ecosystem ka pehla hissa + Sangam UI (2026-11-17)

## Yeh kya hai
Aapke "My Own AI Coding Ecosystem" idea ka pehla chalta hua hissa, `opencode-omniroute-router` project ke upar:
ek coding app (OpenCode) + router (OmniRoute) + local AI (Ollama) + ek naya UI jiska naam **Sangam** hai
(Sangam = jahan nadiyan milti hain; yahan saare AI models ek jagah milte hain).

## Kya kaam hua
1. **English + Hinglish samajh** — pehle router sirf Spanish samajhta tha. Ab "bug fix karo", "samjhao", "kabhi kabhi fail hota hai" bhi sahi tier me jaate hain (free / fast / standard / strong / expert).
2. **Local worker (Ollama)** — request me "offline / ollama / bina internet" likho to kaam PC ke model pe hota hai. OmniRoute band ho to kaam apne aap local pe chala jata hai (fallback).
3. **Sangam UI** — browser me ek page: teeno cheezon ki batti, kaam likhne ki jagah, kaam kahan jayega uska preview, live output, route map, hisaab, pichhle kaam.
4. **Naye commands** — `doctor` (sab theek hai ya nahi), `stats` (cloud / local / fallback ginti), `ui` (Sangam), `init --local`.
5. **Purane project ka bug theek** — plugin OpenCode me load hi nahi hota tha ("Plugin export is not a function"). Ab load hota hai.
6. **PC setup** — OpenCode, OmniRoute, Ollama install; model `qwen2.5:7b`; OmniRoute sirf is PC ke liye khula (Wi-Fi se band) aur key zaroori.

## Kaise use hota hai
- **Sabse aasaan:** `C:\Users\Roshan\Downloads\opencode-omniroute-router\Sangam.cmd` pe double-click. Browser me `http://127.0.0.1:4510` khulega.
- Kisi aur project ke liye: `Sangam.cmd "C:\pura\path\project"`. Naye project me pehle ek baar:
  `node C:\Users\Roshan\Downloads\opencode-omniroute-router\src\cli.mjs init --local ollama/qwen2.5:7b`
- Page pe: project folder → request likho → neeche dikhega kaunsa worker/model lagega → **Chalao** (ya Ctrl+Enter). **Roko** se beech me band.
- Jaanch: `node src\cli.mjs doctor`, hisaab: `node src\cli.mjs stats`.

## Connection / andar se kaise chalta hai
```
Aap -> Sangam (browser, 127.0.0.1:4510)
         | request padh ke tier chunta hai (classifier, bina AI ke)
         v
     OpenCode worker (free / fast / standard / strong / expert)  --->  OmniRoute (127.0.0.1:20128) ---> model
         |                                                               (abhi: Ollama qwen2.5:7b; Gemini key aane pe Gemini)
         +-- "offline" bola, ya OmniRoute band --> local-worker ---> Ollama (127.0.0.1:11434)
Har kaam -> C:\Users\Roshan\.smart-opencode\history.jsonl -> Sangam ka "Hisaab" / "Pichhle kaam"
```
Do tareeke: **Seedha worker** (default; router khud worker chun ke chalata hai, tez) aur **Orchestrator se** (ek AI pehle kaam baant-ta hai; chhote local model pe ye bharosemand nahi).

## Files
`CHANGED-FILES.txt` me poori list, `files\` me unki taiyaar copy. Khaas:
- `src/classifier.mjs` (bhasha), `src/task-router.mjs`, `src/router-plugin.mjs` + `src/plugin.mjs` (plugin), `src/cli.mjs` (commands), `src/health.mjs`, `src/stats.mjs`
- `src/ui-server.mjs` + `ui/index.html` (Sangam), `Sangam.cmd` (launcher)
- `templates/agents/local-worker.md` (naya), baaki templates (seedha chalne ke liye `mode: all`, kaam ke niyam)
- `test/*` — 111 tests
- `sangam-screenshot.png` — UI ki photo

GitHub wala hissa (.github, .git, links) aapke kehne par bina chhue hai. Kuch commit / push nahi kiya.

## Jaanch (kya test hua, kya nahi)
Hua (live, 2026-11-17):
- `npm test`: 111 pass, 0 fail (pehle 50 the).
- `doctor`: sab OK.
- Sangam se asli kaam: "samjhao" → free-worker; "README me spelling theek karo" → smart-fast, typo sach me theek hua; "bug fix karo aur npm test chalao" → smart-standard, `cartTotal([])` ab 0 deta hai, tests pass.
- "Offline model se ..." → local-worker (Ollama) pe gaya.
- OmniRoute band karke request → local-worker pe fallback, history me "fallback" likha.
- OmniRoute Wi-Fi IP se band hai, bina key 401.

Nahi hua / kami:
- **Gemini abhi juda nahi** — key aapke Google account se hi banegi. Isliye "cloud" wale kaam bhi abhi OmniRoute ke raste local model `qwen2.5:7b` se hue; hisaab me jo "Cloud" likha hai uska matlab abhi "OmniRoute ke raste" hai.
- Local model chhota hai: ek test me usne naya unit test likhne ki jagah keh diya "zaroorat nahi", aur ek samjhane wale jawab me purani comment padh ke galat baat jod di. Bade/mushkil kaam ke liye Gemini chahiye.
- "Orchestrator se" mode chhote local model pe worker ko kaam nahi deta (isiliye "Seedha worker" default hai). Gemini ke saath dobara test karna hai.
- strong / expert tier, aur "pehle code dhoondhna" (exploration) live nahi chale — sirf unit tests me.
- UI ko maine screenshot aur API se jaancha; browser me button dabake haath se nahi.

## Wapas kaise jaayein
- Purana code: `backup\2026-11-17_0204_ecosystem-start\before\` se files wapas copy karo (ya `git checkout -- .` + nayi files hatao).
- Programs hatane ho to: `npm uninstall -g opencode-ai omniroute`, Ollama ko Settings → Apps se. Models: `ollama rm qwen2.5:7b qwen2.5-coder:7b`.
- Windows user variables jo jode: `OMNIROUTE_API_KEY`, `REQUIRE_API_KEY`, `OMNIROUTE_SERVER_HOST`, `OLLAMA_CONTEXT_LENGTH`.
