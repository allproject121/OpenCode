# Downloads\Programming â€” poori copy (A se Z)

Is repo mein `C:\Users\Roshan\Downloads\Programming` ki **har file** hai, jaisi 17 Nov 2026 22:37 par thi:
Apna OpenCode (`opencode`), Kilo Code, OmniRoute, `update-work`, backup, config, logs, tools, vendor, test-projects, aur `node_modules` bhi.

GitHub ki teen seemaon ki wajah se kuch cheezein badle roop mein hain (kuch chhoota nahi):
- **95 MB se badi files** `<naam>.part001`, `part002` â€¦ tukdon mein hain (list: `_restore\split-files.tsv`).
- **Andar ke git repo ka `.git` folder** har repo ke folder mein `_git-history.tar` hai (list: `_restore\git-repos.txt`).
- **Windows links / junctions** (bun ke node_modules) ki list `_restore\links.tsv` mein hai.

Sab wapas asli jaisa: `powershell -ExecutionPolicy Bypass -File _restore\restore.ps1`

Yeh repo **private** rehna chahiye: isme `config\service-local.json` (app server ka password) aur `logs\` (chats, screenshots) bhi hain.
