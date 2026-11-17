@echo off
rem Aakhri lagaya hua OpenCode update wapas lo (pehle app band karo). Iske baad ROKO.txt banti hai, taaki wahi update phir na lage.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0update.ps1" rollback
pause
