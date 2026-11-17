# Apna OpenCode — Windows installer

## Ye kya hai
Ek `.exe` jo kisi bhi Windows (64-bit) laptop par "Apna OpenCode" app install karta hai — bina `bun`, bina source,
bina dev mode. Aapki settings, workflow plugin, figma plugin, skills pack aur MCP list andar hi hain.

## Doosre laptop par kaise lagayein
1. GitHub Release se `Apna-OpenCode-Setup-<version>.exe` download karo.
2. Double click. Windows "unknown publisher" (SmartScreen) bole to **More info -> Run anyway** (exe signed nahi hai).
3. Install apne aap hota hai (kuch puchta nahi). Start Menu + Desktop par "Apna OpenCode".
4. Router (OmniRoute) ke liye us laptop par **Node.js** hona chahiye — app ka Router page npm se khud install karta hai.
   Ollama / offline models app khud download karta hai.

## Andar se kaise chalta hai
```
Setup.exe -> %LOCALAPPDATA%\Programs\ai.apna.opencode\Apna OpenCode.exe
                 resources\opencode-cli.exe   (server, "local" channel)
                 resources\apna-config\        (settings + plugins, build ke waqt Programming\config se)
pehli baar khulne par:
  resources\apna-config  -> %APPDATA%\ai.apna.opencode\config   (phir wahi aapki settings, installer dobara nahi chhuta)
  server data            -> ~\.local\share\opencode\opencode-local.db  (dev launcher wala hi)
```
- Naam / id alag (`ai.apna.opencode`): official OpenCode ka install folder ya data nahi chhuta.
- Official updater band hai (`gui-plugins/src/updater/main.ts`) — ye app khud ko official OpenCode se nahi badlega.
- `config\service-local.json` (is PC ke server ka password) installer me NAHI jaata.

## Naya installer banana
Git Bash, `Programming` folder se:
```
export PATH="/c/Users/Roshan/AppData/Roaming/npm/node_modules/bun/bin:$PATH"
APNA_VERSION=2.3.0-apna.3 bun tools/installer/build.ts      # ~20 min, log dekhna ho to > logs/installer-build.log
```
Nateeja: `dist-installer\Apna-OpenCode-Setup-<version>.exe` (git me nahi jaata, 100 MB se bada hai -> GitHub Release).
Upload: `gh release create v<version> dist-installer/Apna-OpenCode-Setup-<version>.exe --repo allproject121/OpenCode`

## Jaancha (2026-11-18)
- apna.1: install + chala; pehli baar "Location plugins did not finish activating" (server 5 s wait) -> 60 s kiya.
- apna.2: data hata ke naye laptop jaisa install -> pehli baar seedha chat screen, model "OmniRoute / apna-coding",
  plugins `config\plugins\*` se load (`logs\94-apna2-first-start.png`).
- Nahi jaancha: asli doosra laptop; Router ka npm install naye PC par; uninstall.

## Wapas kaise jaayein
Badli files ka asli roop: `backup\2026-11-18_installer\before\`. Installed app hatana: Settings > Apps > Apna OpenCode > Uninstall.
