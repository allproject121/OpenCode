@echo off
rem Abhi isi waqt naya update dhundho, jaancho aur (app band ho to) lagao. Roz apne aap bhi chalta hai.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0update.ps1" check
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0update.ps1" status
pause
