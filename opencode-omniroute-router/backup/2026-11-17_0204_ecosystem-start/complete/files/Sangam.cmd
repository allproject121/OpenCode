@echo off
rem Sangam launcher: double-click to open the UI.
rem Usage: Sangam.cmd [project-folder]   (default: the ecosystem test project)
setlocal
set "REPO=%~dp0"
set "PROJECT=%~1"
if "%PROJECT%"=="" set "PROJECT=%USERPROFILE%\Downloads\ecosystem-test-project"

rem Keep OmniRoute private to this PC and key-protected.
set "REQUIRE_API_KEY=true"
set "OMNIROUTE_SERVER_HOST=127.0.0.1"

rem Start the OmniRoute gateway if it is not answering yet.
curl -s -o nul --max-time 2 http://127.0.0.1:20128/v1/models
if errorlevel 1 (
  echo OmniRoute chalu kar raha hu...
  call omniroute serve --daemon --no-open >nul 2>&1
)

echo Sangam khul raha hai: %PROJECT%
node "%REPO%src\cli.mjs" ui --project "%PROJECT%"
endlocal
