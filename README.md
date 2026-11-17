# Apna OpenCode — kya hai aur kaise chalayein

Ye aapka apna OpenCode hai: asli OpenCode ka source (GitHub se, version 2.3) + usme jode gaye aapke features.
Sab kuch isi PC par hai, folder: `C:\Users\Roshan\Downloads\Programming`.

## Kaise kholein
`Apna-OpenCode.cmd` par double-click (Desktop par "Apna OpenCode" shortcut bhi hai).
Pehli baar khulne me lagbhag 1 minute lagta hai. Ollama aur Router app ke andar se **khud chalu** ho jaate hain —
alag se kuch kholna nahi padta.

## Kya-kya joda gaya

### 0. Naya design (Codex app jaisa, sirf naam aur nishaan apna)
- **Upar**: peeche / aage ke teer, baayein patti chhupane ka button, phir **File, Edit, View, Help**.
- **Sabse baayein icon patti**: ghar = naya chat, do bubble = chat dhundo, ghadi = purane chats ka panna,
  kitaabein = Offline models, @ = Router, ... = saare commands, neeche wala = code review, sabse neeche gol
  "RT" = Settings.
- **Baayein patti**: upar "Apna OpenCode" + dhundhne ka button, "New chat", "Projects" (folder), "Recents".
- **New chat screen**: beech me nishaan aur "What should we work on in <project>?" (project ke naam par click =
  project badlo). Likhne ka dabba neeche: "Do anything".
- **Likhne ka dabba**: baayein + aur mode, uske baad **Full access / Ask first** (dabane se badalta hai: "Full
  access" = bina puche kaam kare), daayein model ka naam aur gol bhejne ka button.
- **Rang**: sada kaala / safed; Windows ke saath apne aap badalta hai. Purana neela + kesariya roop:
  Settings > Appearance > Theme > "Apna (neela + kesariya)".
- Purane 6 bade button hata diye (Codex me nahi hote). `/banao`, `/jaanch`, `/suraksha` dabbe me likhne se chalte hain.
- **Glass (sheesha) effect**: window ke peeche ka desktop dhundhla dikhta hai, aur panel, baayein patti aur
  likhne ka dabba aadhe aar-paar sheeshe jaise hain, halki chamakti kinaar ke saath. Band karna ho to
  `Apna-OpenCode.cmd` me `set "APNA_GLASS=0"` wali line se `rem` hata do.
- **Chalta chat**: upar folder + chat ka naam; baayein Recents me sirf chat ke naam.
- **Settings**: baayein "Settings", search aur panno ki list; daayein bada sirnaam aur card (neeche gol "RT" se khulta hai).
- Codex se abhi alag: mic ka button (hamare app me bolne wala feature nahi hai), "Get Plus", chat ke daayein
  "Outputs" wala dabba, aur Settings ke panno ke naam (hamare apne hain).
- **Tez jawab ke liye**: model me `OmniRoute / apna-coding` chuno (yahi default hai; ek model ki limit khatam ho to khud agle par jaata hai) aur mode "Build" rakho. Laptop wale Ollama
  models dheeme hain; `qwen2.5-coder:7b` file bana hi nahi pata.

### Bhasha
App English me khulta hai (default). Badalni ho to: Settings > Preferences > Language. Wahan "हिन्दी" chunne par
Offline models, Router aur Plugins wale panne Hinglish me dikhte hain (baaki app Hindi me). Neeche in panno ke button
Hinglish naam se likhe hain; English me unke naam ye hain: Jodo = Add / Connect, Hatao = Remove, Dobara dekho =
Check again, Key lo = Get key, Copy banao = Make a copy, Wapas lao = Bring back.

### 1. Offline models (Settings > Offline models)
- Ollama (bina internet wale models ka engine) ko app khud dhundhta aur chalu karta hai. Jis PC par Ollama na ho,
  wahan ek button se app ke andar hi download ho jaata hai.
- Model download: list se "Download" dabao, ya koi bhi naam likho (jaise `qwen2.5:7b`). Har download ki line me
  dikhta hai: kitna % hua, kitne GB me se kitne, speed (MB/s), kitna samay baaki, aur ek bar.
- Download ke button:
  - **Pause**: download rok do. Jo aa chuka hai wo PC par rehta hai.
  - **Resume**: ruka hua download wahin se chalu.
  - **Cancel**: download band + jo adhoora aaya tha wo delete (jagah wapas). Pehle ek baar poochta hai.
  - **Retry**: fail hua download wahin se dobara. **Dismiss**: poora ho chuke download ki line hatao.
- Download chalte waqt app ke **upar ki patti me** hamesha likha rehta hai (jaise `gpt-oss:20b 61%`), chahe aap
  chat me ho ya Settings me. Us par dabao to seedha Offline models ka panna khulta hai.
- Dheeme net ke liye: ek baar me ek hi download chalta hai, aur atak jaaye to **wahin se apne aap dobara** shuru
  hota hai (12 baar tak). App band ho jaye to download ruk jata hai; dobara "Download" dabane par wahin se chalta hai.
- "Is laptop ke liye bhaari" likha aata hai jo model aapki RAM me theek nahi chalega.
- Model hatana: "Hatao".
- **Cloud-SSD se jodo (ek baar)**: page ke neeche "Cloud-SSD" ki line me **Cloud-SSD se jodo / Connect Cloud-SSD**
  dabao. Bas. Uske baad, jab tak aap **Disconnect** na dabao:
  - jo bhi model download hoga wo apne aap Cloud-SSD par jayega (`<Cloud-SSD ki drive>\Ollama-Models`) aur phir
    laptop se hat jayega;
  - jo models pehle se laptop par hain wo bhi usi waqt Cloud-SSD par chale jaate hain ("Sab abhi bhejo" se dobara
    bhi bhej sakte ho);
  - app Cloud-SSD ki drive khud dhundhta hai (akshar G: ho ya X:, farak nahi padta); folder chunna nahi padta.
- **Zaroori baat**: AI model sirf laptop par rakha ho tabhi chal sakta hai (cloud se seedha nahi chalta). Isliye jis
  model se chat karni ho, uske saamne **Laptop par lao / Bring to this laptop** dabao; kaam ho jaye to "Hatao" se
  laptop se hata do (Cloud-SSD par copy rehti hai). "Models ko laptop se hatao" wala switch band kar do to models
  dono jagah rahenge.
- Cloud-SSD app band ho to models kahin nahi jaate; page likh deta hai ki drive nahi mil rahi. Cloud-SSD kholo,
  phir "Sab abhi bhejo".
- Cloud-SSD apni taraf se haal ki files ki ek kachchi copy laptop par rakhta hai (uska apna cache, zyada se zyada
  30 GB) aur use khud saaf karta hai; isliye laptop ki jagah turant poori khaali nahi dikhti.
- Cloud-SSD ke bina kisi aur folder me copy rakhni ho to "Folder chuno" wala purana tareeka bhi wahin hai.

### 1b. Cloud-SSD projects (Settings > Cloud-SSD projects) — coding ke projects Cloud-SSD par
- **Naya project**: naam likho -> "Banao aur kholo / Create and open". Project ka folder Cloud-SSD ke andar banta hai
  (`C:\Users\Roshan\Cloud-SSD\All Accounts\Coding-Projects\<naam>`, Files me Cloud-SSD ki drive ke andar dikhta hai)
  aur usme nayi chat khul jaati hai. Uske baad wo project left me "Projects" me bhi rehta hai.
- **Cloud-SSD par projects**: jo projects wahan hain unki list; "Kholo / Open" se nayi chat usi folder me.
- **Jo folder pehle se hai use lao**: laptop ka koi folder chuno; uski copy Cloud-SSD par banti hai aur khul jaati
  hai. Aapka asli folder jahan tha wahin rehta hai. `node_modules`, `dist`, `build` jaise folder nahi laye jaate
  (wo dobara ban jaate hain).
- **Ye kaise kaam karta hai (sach-sach)**:
  - Project isi laptop se chalta hai, poori speed par. Kaam rukne ke lagbhag 20 second baad Cloud-SSD uski copy
    aapke cloud (Google) par bhej deta hai. Panne par likha aata hai ki aakhri copy kab gayi.
  - Ek copy laptop par bhi rehti hai. Code ko chalane ke liye laptop par hona zaroori hai; "sirf cloud par" abhi
    Cloud-SSD me bana hi nahi hai. Code chhota hota hai, isliye jagah kam hi jaati hai.
  - Laptop par file delete ya naam badlo to agle upload ke baad cloud me bhi wahi hota hai (purani file Google ke
    kooda-daan me 30 din rehti hai). Ek saath bahut saari files (200 se zyada aur aadhe se zyada) gayab hon to
    Cloud-SSD unhe cloud se nahi hatata, sirf batata hai. Phone ya doosre PC se cloud me daali files kabhi nahi
    chhuta. Poora `Coding-Projects` folder delete mat karna: saare projects cloud ke kooda-daan me chale jayenge.
  - `node_modules`, `dist`, `build`, `.next` jaise bhaari folder cloud par NAHI jaate (Cloud-SSD unhe chhod deta
    hai; wo dobara ban jaate hain). `.git` jaata hai. Koi folder lagataar badalta rahe to bhi 5 minute me upload ho
    jaata hai.

### 2. Router (Settings > Router)
- OmniRoute app ke saath khud chalu hota hai (sirf is PC ke liye, bahar se band).
- Naya provider jodna — teen kadam:
  1. "Key lo" dabao -> us company ki website khulti hai.
  2. Wahan key banao, copy karo.
  3. App me chipkao, "Jodo" dabao. Key galat ho to saaf likha aata hai aur kuch juda nahi rehta.
- Jude hue providers ke models aur "auto" (khud sabse achha chunne wale) models, model list me apne aap dikhte hain
  (`omniroute/...`). Ek model band / limit par ho to router doosre par chala jaata hai.
- "Dashboard kholo" se router ka poora panel khulta hai.

### 2a. OpenAI (aapke ChatGPT account se)
- 17 Nov raat se OpenAI aapke ChatGPT account se juda hai ("Codex browser" login se; "Sign in with ChatGPT" wala
  tareeka OpenAI abhi mana karta hai). Model chunne wale menu me **OpenAI** ke neeche ye chalte hain:
  `gpt-6-luna` (achha, coding ke liye yahi lo), `gpt-6-luna-fast`, `gpt-5.6-terra`. Baaki GPT naam (gpt-6-sol,
  gpt-6.1-sol, astra, ...) aapke plan me nahi aate, unpe "not supported" aayega.
- "OpenCode" wale GPT models paid credits maangte hain (khatam hain); GitHub Copilot wale GPT is app ko nahi
  milte; Router ka "auto/gpt" kisi OpenAI se juda nahi — inhe mat chuno.
- Login dobara karna pade: Settings > Providers > OpenAI > "Codex browser (legacy)".

### 2b. Plugins (Settings > Plugins)
- Ek list jisme se ek click me cheez judti hai: **Jodo** dabao, hatana ho to **Hatao**.
- Auzaar (MCP): Context7 (taaza docs), Playwright (browser chalana), Chrome DevTools, GitHub, Figma, Sequential
  Thinking, Memory. Plugin: Figma ke skills. Skill pack: Superpowers.
- Jodne ke baad line me likha aata hai ki wo chal raha hai ya nahi. Pehli baar "Chalu ho raha hai…" lagbhag
  1 minute tak reh sakta hai; jab **Connected / Juda hua** likha aaye tab naye chat me pucho.
- **GitHub**: GitHub is app se sign in nahi karne deta, isliye token lagta hai. GitHub jodo -> neeche "GitHub token"
  wali line me **Token lo** dabao (GitHub ki website khulegi) -> token banao, copy karo -> yahan chipkao -> **Save**.
  Kuch second me "Connected" aa jata hai, app band karne ki zaroorat nahi. Token Windows ke user variable
  `GITHUB_PERSONAL_ACCESS_TOKEN` me rehta hai, kisi file me nahi. Hatana ho to "Hatao / Clear".
  Jab tak token nahi diya, GitHub Settings > Extensions ki list me aata hi nahi (na laal error, na on/off switch);
  wo sirf Plugins panne par "Token chahiye" ke saath dikhta hai. Token galat ho to line me likha aata hai
  "Token galat hai ya purana ho gaya".
- **Figma**: jodne ke baad **Sign in** dabao -> Settings > Extensions me Figma ke saamne Sign in -> browser me Figma
  ka login khulta hai, wahan apne account se haan karo.
- **Memory** ki yaadein yahan rehti hain: `Programming\config\memory.jsonl`.
- Ye tools `apna-coding` (OmniRoute) jaise model se chalte hain; chhote offline model (jaise `qwen2.5-coder:7b`)
  inhe nahi chala pate.
- Ye sab internet se aate hain; jab tak "Jodo" na dabao, kuch download nahi hota.

### 2c. Customize (Settings > Customize) — AI ko apne tareeke se chalao
Side ki patti me slider wala icon, ya Settings > Customize. Yahan jo banaoge wo save karte hi lag jata hai
(app band-chalu nahi karna). Har cheez ke saamne "Active" tab likha aata hai jab app ne use sach me utha liya ho.

- **Skills**: ek kaam ke kadam jo AI follow kare. "New" dabao -> naam, "kab use ho", "kya kare" likho -> Save.
  Jab aapki baat "kab use ho" se milegi, AI use khud padh lega.
- **Connectors**: AI ko naye auzaar dene wale server. "New" -> naam -> ya to web address (`https://...`) ya is PC
  par chalne wala command (jaise `npx -y ...`) -> Add. Line me likha aata hai: Connected / Sign-in needed / Failed.
  Bane-banaye connectors ke liye "Ready-made ones" (Plugins panna).
- **Agents**: apne niyam wala sahayak. Asli AI use kaam ka tukda deta hai (ya aap use chat box me chunte ho).
- **Commands**: apna `/command`. Jo prompt likhoge wo `/naam` likhne par chala jata hai; naam ke baad ke shabd
  `$ARGUMENTS` ki jagah aate hain. Jaise `/samjhao app.js`.
- **Instructions**: wo niyam jo AI har chat me maane (jaise "Simple Hinglish me jawab do"). Neeche
  "Response style": Normal / Short / Explain while working / Teach me / Simple Hinglish / apna likha hua.
- **Hooks**: ek command jo har baar apne aap chale, AI ke faisle ke bina:
  - "Before a tool": tool se pehle; command fail ho to kaam ruk jata hai aur AI ko wajah milti hai.
  - "After a tool": tool ke baad; command jo chhapta hai wo AI ko dikhta hai (jaise file badalne ke baad jaanch).
  - "When the AI finishes": jab jawab poora ho.
  "Which tools" me tool ke naam: file badalna = `edit,write,patch`, commands = `shell`, sab = `*`.
- **Plugins**: Plugins wala panna yahin se khulta hai.

Sab kuch yahan save hota hai: `Programming\config\` (skills, commands, agents ke folder; `AGENTS.md`; `hooks.json`).

### 3. "System" — khud samjhe kya ban raha hai, aur stages me kaam kare
Chat me ye teen commands hain:
- `/banao <kya banana hai>` — samjho -> plan -> banao -> jaancho -> review + suraksha -> taiyaar.
- `/jaanch` — test chalao, galtiyan dhundo, theek karo, dobara jaancho.
- `/suraksha` — security jaanch (OWASP) aur kamiyan theek karo.

Andar kya hota hai:
- `project_detect` tool folder dekh ke batata hai: website (frontend / backend / poori), mobile app, desktop app,
  Python, seedhi HTML site, ya khaali folder — aur us kaam ke liye kaunse "skills" lagenge.
- 25 skills (GitHub ka jaana-maana pack `addyosmani/agent-skills`, MIT license) apne aap jude hain: spec likhna,
  plan, test-pehle-code, frontend, API, browser me jaanch, debugging, code review, security, launch.
- Website wale project me browser-jaanch ka tool (Chrome DevTools MCP) **apne aap** jud jaata hai; baaki me nahi.
- Stages khud se nahi banaye: agent-skills (Define -> Plan -> Build -> Verify -> Review -> Ship), obra/superpowers
  (test-pehle, jad tak debugging) aur OWASP (security) se liye hain.

### 4. Teen naye mode (Kilo Code jaise)
Chat ke neeche "Build" par click karke mode badlo:
- **Ask** — sirf sawal ka jawab; code padhta / samjhata hai, kuch badal nahi sakta (file likhna aur command band).
- **Debug** — pehle galti ki jad dhundhta hai, phir theek karta hai aur us galti ka test jodta hai.
- **Orchestrator** — bade kaam ko hisso me baant ke chhote agents se karwata hai, nateeje jaanch ke jodta hai.
(Build aur Plan OpenCode me pehle se hain.)

## Andar se kaise juda hai
```
Apna-OpenCode.cmd
   |  (Bun + apni settings: config\opencode.jsonc)
   v
OpenCode desktop app (opencode\ , branch apna-opencode)
   |-- Settings > Offline models  -> Ollama (127.0.0.1:11434)  -> models: C:\Users\Roshan\.ollama\models
   |                                                         \-> copy folder (aap chuno, jaise Z:\Ollama-Models)
   |-- Settings > Router          -> OmniRoute (127.0.0.1:20128) -> Gemini / Groq / ... (aapki keys)
   |-- Model list                 <- ollama/...  aur  omniroute/...  (khud dikhte hain)
   \-- /banao /jaanch /suraksha   -> workflow plugin (project_detect + 25 skills + browser-jaanch)
```

## Kya jaancha gaya (sach)
Chala ke dekha gaya:
- App source se khulta hai; "Offline models" aur "Router" page khulte hain.
- Ek chhota model (`all-minilm`, 44 MB) app ke andar se download hua, progress dikha.
- Copy -> PC se hatao -> wapas lao -> model chala (ek temp folder me, Z: par nahi).
- Router ke 54 models khud dikhe; `omniroute/auto/coding` aur Ollama `qwen2.5:7b` se jawab aaya.
- Galat key par "nahi juda: Invalid API key" aaya aur router me kuch nahi bacha.
- Ask mode se "file banao" kaha — usne mana kiya aur file nahi bani.
- `/banao`, `/jaanch`, `/suraksha` app me dikhte hain; `project_detect` ko asli model ne chalaya; website wale
  folder me browser-jaanch tool khud juda.
- Chhote tests: 26 pass (offline models 10, router 8, project pehchaan 8).

- Naya design: asli Codex ki tasveer (`logs\ref-codex-1.png`) se mila ke banaya; hamara: `logs\31-newchat.png`.
  Theme ke 30 tests pass. Light roop is aakhri badlav ke baad dobara nahi dekha.

Abhi NAHI jaancha / nahi bana:
- Chalte hue thread (jawab wala screen), daayein wala review / files panel aur Settings ke page ka dhaancha wahi
  OpenCode wala hai — un par sirf naya rang laga hai, sajawat nahi badli.
- `/banao` se ek poori website shuru se aakhir tak banwa ke nahi dekhi (lamba kaam hai, model ki limit bhi lagti hai).
- "Folder chuno" button (Windows ka dialog script se nahi dabta) aur Z: par asli copy — Z: par us waqt aapka
  MiniMax install chal raha tha, isliye jaan-boojh ke nahi chhua.
- Engine ka 1.5 GB download (is PC par Ollama pehle se hai).
- Sahi key se naya provider jodna (key aapki chahiye).
- Debug aur Orchestrator mode jude hain par unse asli kaam karwa ke nahi dekha (Ask ko jaancha: file nahi bana saka).
- Kilo Code ke baaki features abhi nahi jode: MCP ki dukaan (marketplace) ka page, Agent Manager ka alag panel,
  type karte waqt code ka sujhav (wo VS Code extension ka feature hai). Kilo ke paise wale cloud features jaan-boojh ke nahi.
- Ye abhi "dev" tareeke se chalta hai (source se). Installer (.exe) abhi nahi bana.

## Dhyan dene wali baatein
- Download ki speed aapke net jitni hi hogi; app use tez nahi kar sakta. Jo ho sakta tha wo kiya: atakna band,
  wahin se dobara, ek baar me ek. Chhote models (1-3 GB) jaldi aate hain.
- `gemini-2.5-flash` Google ne band kar diya hai; `gemini-3.8-flash` par free limit roz khatam ho sakti hai. Tab
  `OmniRoute / apna-coding` chuno — ek model band ho to wo khud agle par chala jaata hai.
- Windows me `OLLAMA_HOST=0.0.0.0:11434` set hai, yaani Ollama aapke poore Wi-Fi par khula hai. Zaroorat na ho to
  ise `127.0.0.1:11434` kar dena behtar hai.
- Purana OpenCode (1.19.5) aur "Sangam" wala kaam (`Downloads\opencode-omniroute-router`) jaise the waise hain.

## Wapas kaise jaayein
- Sirf apne badlav dekhne: `cd opencode` phir `git status` / `git diff 32974e0`.
- Asli OpenCode par wapas: `git stash -u` (ya folder `packages\gui-plugins\src\local-models`, `...\router`,
  `packages\plugins\workflow`, `packages\core\src\plugin\provider\omniroute.ts` hatao aur 3 files ki 13 line).
- Pura hatana: `Downloads\Programming` folder aur Desktop ka shortcut hata do. Models `.ollama` me rahenge.
