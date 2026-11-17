@echo off
rem Apna OpenCode: ek click me app kholo.
rem - Ollama aur Router (OmniRoute) app ke andar se khud chalu hote hain.
rem - Settings is folder ke "config" me rehti hain (purane OpenCode 1.x ki settings alag hain).
rem - Pehli baar khulne me lagbhag 1 minute lagta hai. Log: logs\app.log
setlocal
set "ROOT=%~dp0"
set "PATH=%APPDATA%\npm\node_modules\bun\bin;%PATH%"
set "OPENCODE_CONFIG_DIR=%ROOT%config"
rem Glass (sheesha) effect band karna ho to neeche wali line se "rem" hata do:
rem set "APNA_GLASS=0"

where bun.exe >nul 2>nul
if errorlevel 1 (
  echo Bun nahi mila. Ek baar ye chalao:  npm install -g bun
  pause
  exit /b 1
)

if not exist "%ROOT%logs" mkdir "%ROOT%logs"
rem Apne aap update: jaancha hua naya OpenCode update taiyaar ho to pehle wo lagta hai (tools\auto-update\README.md).
powershell -NoProfile -ExecutionPolicy Bypass -File "%ROOT%tools\auto-update\update.ps1" apply
cd /d "%ROOT%opencode"
rem App band hote hi (window band karne par) taiyaar update lag jata hai, taaki agli baar naya version khule.
start "Apna OpenCode" /min cmd /c "bun run dev:desktop > "%ROOT%logs\app.log" 2>&1 & powershell -NoProfile -ExecutionPolicy Bypass -File "%ROOT%tools\auto-update\update.ps1" apply"
endlocal
