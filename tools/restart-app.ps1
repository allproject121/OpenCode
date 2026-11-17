# Closes the running Apna OpenCode dev app completely and opens it again with the launcher.
# Stops only the app's own process trees: the launcher's "bun run dev:desktop" window, Electron from opencode\, and
# the opencode-pty helper. Other bun / node work in the same folder (tests, other sessions) is left alone.
#   restart-app.ps1          stop + start
#   restart-app.ps1 -Stop    stop only
param([switch]$Stop)

$root = Split-Path $PSScriptRoot
$repo = Join-Path $root "opencode"
$all = Get-CimInstance Win32_Process
$roots = $all | Where-Object {
  ($_.Name -eq "cmd.exe" -and $_.CommandLine -like "*dev:desktop*") -or
  ($_.Name -in @("electron.exe", "opencode-pty.exe") -and $_.ExecutablePath -like "$repo\*")
}
foreach ($p in $roots) { & taskkill.exe /T /F /PID $p.ProcessId 2>$null | Out-Null }

# Tool servers (MCP) the app's server started outlive it when their parent dies, and they keep logs\app.log open,
# so the next start cannot write its log and stops at once. Only orphans (parent gone) are stopped.
$alive = @{}
Get-CimInstance Win32_Process | ForEach-Object { $alive[[int]$_.ProcessId] = $true }
Get-CimInstance Win32_Process -Filter "Name='node.exe' OR Name='cmd.exe' OR Name='bun.exe'" |
  Where-Object { -not $alive[[int]$_.ParentProcessId] -and $_.CommandLine -match "mcp|_npx|modelcontextprotocol" } |
  ForEach-Object { & taskkill.exe /T /F /PID $_.ProcessId 2>$null | Out-Null; "stopped orphan tool server $($_.ProcessId)" }

# The DevTools port must be free before a new start, or the new app opens without it.
for ($i = 0; $i -lt 20; $i++) {
  if (-not (Get-NetTCPConnection -LocalPort 9222 -State Listen -ErrorAction SilentlyContinue)) { break }
  Start-Sleep -Milliseconds 500
}
"stopped {0} process tree(s); port 9222 {1}" -f @($roots).Count, $(if (Get-NetTCPConnection -LocalPort 9222 -State Listen -ErrorAction SilentlyContinue) { "STILL BUSY" } else { "free" })
if ($Stop) { return }

# Started through Explorer, so the app does not belong to (and close with) the shell that ran this script.
Start-Process -FilePath "explorer.exe" -ArgumentList "`"$(Join-Path $root "Apna-OpenCode.cmd")`""
"started launcher"
