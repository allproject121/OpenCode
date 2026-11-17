# Apna OpenCode: apne aap update (auto update).
#
#   update.ps1 check      GitHub par naya OpenCode release dekho; ho to ALAG copy (update-work) me milao,
#                         install + type-check + tests chalao; sab theek ho to "ready". App band ho to turant lagao.
#                         Saath me OmniRoute (router) aur Superpowers skill pack bhi update.
#   update.ps1 apply      "ready" update ko asli folder (opencode) me lagao. Launcher har start par ye chalata hai.
#   update.ps1 status     abhi ka haal dikhao.
#   update.ps1 rollback   aakhri lagaya hua update wapas lo.
#   update.ps1 install    Windows Task Scheduler me jodo (login ke 10 min baad + roz 10 baje).
#   update.ps1 uninstall  Task Scheduler se hatao.
#   update.ps1 check -Target dev   (sirf jaanch) upstream ki dev branch ko update-work me milao + test; kuch lagata nahi.
#
# Rokna: tools\auto-update\ROKO.txt ho to "apply" kuch nahi lagata (check / test chalta rehta hai).
param(
  [ValidateSet("check", "apply", "status", "rollback", "install", "uninstall")] [string]$Mode = "check",
  [string]$Target = ""
)

$ErrorActionPreference = "Stop"
$Here = $PSScriptRoot
$Root = Split-Path (Split-Path $Here)
$Repo = Join-Path $Root "opencode"
$Work = Join-Path $Root "update-work"
$StateFile = Join-Path $Here "state.json"
$HoldFile = Join-Path $Here "ROKO.txt"
$LogFile = Join-Path $Root "logs\auto-update.log"
$Pack = Join-Path $Root "config\packs\superpowers"
$TaskName = "Apna OpenCode Auto Update"
$env:PATH = "$env:APPDATA\npm\node_modules\bun\bin;$env:APPDATA\npm;$env:PATH"
$GitUser = @("-c", "user.name=Apna OpenCode updater", "-c", "user.email=updater@localhost")

# A busy log file (someone reading it) must never stop an update: retry a few times, then skip the line.
function Write-LogFile([string]$Text) {
  for ($i = 0; $i -lt 10; $i++) {
    try { [System.IO.File]::AppendAllText($LogFile, $Text + "`r`n"); return } catch { Start-Sleep -Milliseconds 300 }
  }
}

function Log([string]$Text) {
  $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Text
  Write-LogFile $line
  Write-Host $line
}

function Quote([string]$Arg) {
  if ($Arg -eq "" -or $Arg -match '[\s"]') { return '"' + ($Arg -replace '"', '\"') + '"' }
  return $Arg
}

# Run a program, wait, log its output; returns { Code, Out }.
function Run([string]$Exe, [string[]]$ArgList, [string]$Dir = $Repo) {
  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = $Exe
  $psi.Arguments = ($ArgList | ForEach-Object { Quote $_ }) -join " "
  $psi.WorkingDirectory = $Dir
  $psi.UseShellExecute = $false
  $psi.CreateNoWindow = $true
  $psi.RedirectStandardOutput = $true
  $psi.RedirectStandardError = $true
  $p = [System.Diagnostics.Process]::Start($psi)
  $out = $p.StandardOutput.ReadToEndAsync()
  $err = $p.StandardError.ReadToEndAsync()
  $p.WaitForExit()
  $all = ($out.Result + $err.Result).Trim()
  $short = if ($all.Length -gt 3000) { "..." + $all.Substring($all.Length - 3000) } else { $all }
  Log ("  > {0} {1}  (in {2}) -> {3}" -f $Exe, $psi.Arguments, $Dir, $p.ExitCode)
  if ($p.ExitCode -ne 0 -and $short) { Write-LogFile $short }
  return [pscustomobject]@{ Code = $p.ExitCode; Out = $out.Result.Trim() }
}

function Git([string[]]$ArgList, [string]$Dir = $Repo) { Run "git" $ArgList $Dir }

function Read-State {
  if (Test-Path $StateFile) { return Get-Content $StateFile -Raw | ConvertFrom-Json }
  return [pscustomobject]@{ status = "new" }
}

function Save-State([hashtable]$Data) {
  $Data.time = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
  ($Data | ConvertTo-Json) | Set-Content -Path $StateFile -Encoding UTF8
}

function Notify([string]$Title, [string]$Text) {
  Log "TOAST: $Title - $Text"
  try {
    [void][Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime]
    $xml = [Windows.UI.Notifications.ToastNotificationManager]::GetTemplateContent([Windows.UI.Notifications.ToastTemplateType]::ToastText02)
    $nodes = $xml.GetElementsByTagName("text")
    [void]$nodes.Item(0).AppendChild($xml.CreateTextNode($Title))
    [void]$nodes.Item(1).AppendChild($xml.CreateTextNode($Text))
    $app = "{1AC14E77-02E7-4E5D-B744-2EB1AE5198B7}\WindowsPowerShell\v1.0\powershell.exe"
    [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier($app).Show([Windows.UI.Notifications.ToastNotification]::new($xml))
  } catch { Log "toast failed: $($_.Exception.Message)" }
}

function App-Running {
  $prefix = $Repo + "\"
  $found = Get-CimInstance Win32_Process -Filter "Name='electron.exe'" |
    Where-Object { $_.ExecutablePath -and $_.ExecutablePath.StartsWith($prefix, [StringComparison]::OrdinalIgnoreCase) }
  return [bool]$found
}

# Commit whatever is changed in a folder, so a merge never mixes with loose edits. Files on disk do not change.
function Save-Changes([string]$Dir, [string]$Why) {
  if (-not (Git @("status", "--porcelain") $Dir).Out) { return $true }
  if ((Git @("add", "-A") $Dir).Code -ne 0) { return $false }
  return (Git ($GitUser + @("commit", "-q", "-m", "apna: auto-save ($Why)")) $Dir).Code -eq 0
}

# Latest stable release tag of upstream (vX.Y.Z), or "" when GitHub is not reachable.
function Latest-Release {
  $r = Git @("ls-remote", "--tags", "origin")
  if ($r.Code -ne 0) { return "" }
  $tags = $r.Out -split "`n" | ForEach-Object { if ($_.Trim() -match 'refs/tags/(v(\d+\.\d+\.\d+))$') { $Matches[1] } }
  if (-not $tags) { return "" }
  return ($tags | Sort-Object { [version]$_.Substring(1) } | Select-Object -Last 1)
}

# The checks every update must pass. A check that already failed before the merge does not block the update.
$Checks = @(
  @{ Name = "core typecheck"; Dir = "packages\core"; Args = @("run", "typecheck") },
  @{ Name = "gui-plugins typecheck"; Dir = "packages\gui-plugins"; Args = @("run", "typecheck") },
  @{ Name = "app typecheck"; Dir = "packages\app"; Args = @("run", "typecheck") },
  @{ Name = "desktop typecheck"; Dir = "packages\desktop"; Args = @("run", "typecheck") },
  @{ Name = "workflow typecheck"; Dir = "packages\plugins\workflow"; Args = @("run", "typecheck") },
  @{ Name = "gui-plugins tests"; Dir = "packages\gui-plugins"; Args = @("test") },
  @{ Name = "workflow tests"; Dir = "packages\plugins\workflow"; Args = @("test") }
)

function Run-Checks {
  # Git turns this symlink into a text file on Windows; the real file lets app/desktop type-check (update-work only).
  Copy-Item (Join-Path $Work "packages\ui\src\custom-elements.d.ts") (Join-Path $Work "packages\app\src\custom-elements.d.ts") -Force
  $passed = @{}
  foreach ($c in $Checks) { $passed[$c.Name] = (Run "bun" $c.Args (Join-Path $Work $c.Dir)).Code -eq 0 }
  Git @("checkout", "--", "packages/app/src/custom-elements.d.ts") $Work | Out-Null
  return $passed
}

function Prepare-Work([string]$Base) {
  if (-not (Test-Path (Join-Path $Work ".git"))) {
    return (Git @("worktree", "add", "-f", "-B", "apna-update", $Work, $Base)).Code -eq 0
  }
  Git @("merge", "--abort") $Work | Out-Null
  if ((Git @("reset", "-q", "--hard") $Work).Code -ne 0) { return $false }
  return (Git @("checkout", "-q", "-B", "apna-update", $Base) $Work).Code -eq 0
}

# Merge $Ref into update-work; bun.lock-only conflicts are settled by taking upstream's file (bun install redoes it).
function Merge-Into([string]$Dir, [string]$Ref, [string]$Label) {
  if ((Git ($GitUser + @("merge", "--no-edit", "-m", "apna: update to $Label", $Ref)) $Dir).Code -eq 0) { return @() }
  $conflicts = @((Git @("diff", "--name-only", "--diff-filter=U") $Dir).Out -split "`n" | ForEach-Object { $_.Trim() } | Where-Object { $_ })
  if ($conflicts.Count -eq 1 -and $conflicts[0] -eq "bun.lock") {
    Git @("checkout", "--theirs", "bun.lock") $Dir | Out-Null
    Git @("add", "bun.lock") $Dir | Out-Null
    if ((Git ($GitUser + @("commit", "-q", "--no-edit")) $Dir).Code -eq 0) { return @() }
  }
  Git @("merge", "--abort") $Dir | Out-Null
  if (-not $conflicts) { $conflicts = @("(merge failed, see log)") }
  return $conflicts
}

function Install-Deps([string]$Dir) {
  if ((Run "bun" @("install") $Dir).Code -ne 0) { return $false }
  if ((Git @("status", "--porcelain", "bun.lock") $Dir).Out) {
    Git @("add", "bun.lock") $Dir | Out-Null
    Git ($GitUser + @("commit", "-q", "-m", "apna: bun.lock after update")) $Dir | Out-Null
  }
  return $true
}

function Do-Check {
  $test = $Target -ne ""
  $state = Read-State
  $ref = ""
  $label = ""

  if ($Target -eq "dev") {
    if ((Git @("fetch", "-q", "--no-tags", "origin", "+refs/heads/dev:refs/remotes/origin/dev")).Code -ne 0) { return Log "GitHub se dev nahi mila." }
    $ref = "origin/dev"; $label = "dev " + (Git @("rev-parse", "--short", "origin/dev")).Out
  } else {
    $tag = if ($test) { $Target } else { Latest-Release }
    if (-not $tag) { return Log "GitHub tak nahi pahunche (net?). Agli baar." }
    if ((Git @("fetch", "-q", "--no-tags", "origin", "+refs/tags/${tag}:refs/tags/${tag}")).Code -ne 0) { return Log "Tag $tag nahi mila." }
    $ref = $tag; $label = $tag
  }

  if ((Git @("merge-base", "--is-ancestor", $ref, "HEAD")).Code -eq 0) {
    Log "OpenCode pehle se $label par hai."
    if (-not $test) { Save-State @{ status = "up-to-date"; target = $label; message = "OpenCode taaza hai ($label)." } }
    return
  }
  $same = -not (Git @("status", "--porcelain")).Out -and $state.head -eq (Git @("rev-parse", "HEAD")).Out
  if (-not $test -and $state.status -eq "ready" -and $state.target -eq $label -and $same) { Log "$label pehle se jaancha hua, lagne ka intezaar."; return }
  if (-not $test -and $state.status -in @("conflict", "test-failed") -and $state.target -eq $label -and $state.head -eq (Git @("rev-parse", "HEAD")).Out) {
    Log "$label pehle fail hua tha aur tab se kuch nahi badla; dobara nahi chalaya."; return
  }

  Log "=== Naya OpenCode: $label. Jaanch shuru (update-work me). ==="
  if (-not (Save-Changes $Repo "before testing $label")) { return Log "Apne badlav commit nahi ho paaye (git vyast?). Agli baar." }
  $head = (Git @("rev-parse", "HEAD")).Out
  if (-not (Prepare-Work $head)) { return Log "update-work taiyaar nahi hua." }

  if (-not (Install-Deps $Work)) { return Log "Pehle wale code par bun install fail; agli baar." }
  $before = Run-Checks

  $conflicts = Merge-Into $Work $ref $label
  if ($conflicts.Count) {
    $msg = "Update $label hamare badlav se takraya: " + ($conflicts -join ", ") + ". Claude/Codex se kaho: tools\auto-update\README.md padh ke ise milao."
    if (-not $test) { Save-State @{ status = "conflict"; target = $label; head = $head; files = $conflicts; message = $msg }; Notify "Apna OpenCode update ruka" $msg }
    return Log $msg
  }

  $broken = @()
  if (-not (Install-Deps $Work)) { $broken += "bun install" }
  else {
    $after = Run-Checks
    foreach ($c in $Checks) {
      if ($before[$c.Name] -and -not $after[$c.Name]) { $broken += $c.Name }
      if (-not $before[$c.Name]) { Log "  (pehle se fail tha, isliye gina nahi: $($c.Name))" }
    }
  }
  if ($broken.Count) {
    $msg = "Update $label milaya par jaanch fail: " + ($broken -join ", ") + ". Asli app nahi chhua. Log: logs\auto-update.log"
    if (-not $test) { Save-State @{ status = "test-failed"; target = $label; head = $head; failed = $broken; message = $msg }; Notify "Apna OpenCode update ruka" $msg }
    return Log $msg
  }

  $commit = (Git @("rev-parse", "HEAD") $Work).Out
  if ($test) { return Log "JAANCH PASS: $label hamare code ke saath milta hai aur saari jaanch pass ($commit). Kuch lagaya nahi." }
  Save-State @{ status = "ready"; target = $label; commit = $commit; head = $head; message = "Update $label jaancha, pass. App band hone par / agli baar kholne par lagega." }
  Log "Update $label taiyaar ($commit)."
  Notify "Apna OpenCode: naya update taiyaar" "$label jaanch me pass. App agli baar khologe to apne aap lag jayega."
  Do-Apply
}

function Do-Apply {
  $state = Read-State
  if ($state.status -ne "ready") { return }
  if (Test-Path $HoldFile) { return Log ("Update {0} taiyaar hai par ROKO.txt hai, isliye nahi lagaya: {1}" -f $state.target, (Get-Content $HoldFile -Raw).Trim()) }
  if (App-Running) { return Log "App chal raha hai; update $($state.target) app band hone ke baad lagega." }

  Log "=== Update $($state.target) asli folder me laga rahe hain ==="
  if (-not (Save-Changes $Repo "before applying $($state.target)")) { return Log "Apne badlav commit nahi ho paaye; baad me." }
  $before = (Git @("rev-parse", "HEAD")).Out
  # Code changed after the test: never apply untested; the next check tests it again (then applies if the app is closed).
  if ($before -ne $state.head) {
    Save-State @{ status = "new"; target = $state.target; message = "Jaanch ke baad code badla; $($state.target) ki jaanch dobara hogi." }
    return Log "Jaanch ke baad opencode\ badla ($($state.head) -> $before); $($state.target) dobara jaancha jayega, abhi nahi lagaya."
  }
  $conflicts = Merge-Into $Repo $state.commit $state.target
  if ($conflicts.Count) {
    $msg = "Update $($state.target) lagate waqt naye badlav se takraya: " + ($conflicts -join ", ") + ". Kuch nahi badla."
    Save-State @{ status = "conflict"; target = $state.target; head = $before; files = $conflicts; message = $msg }
    Notify "Apna OpenCode update ruka" $msg
    return Log $msg
  }
  if (-not (Install-Deps $Repo)) {
    Git @("reset", "-q", "--keep", $before) | Out-Null
    Install-Deps $Repo | Out-Null
    $msg = "Update $($state.target) ke baad bun install fail; wapas purane par."
    Save-State @{ status = "test-failed"; target = $state.target; head = $before; message = $msg }
    Notify "Apna OpenCode update ruka" $msg
    return Log $msg
  }
  $after = (Git @("rev-parse", "HEAD")).Out
  Save-State @{ status = "done"; target = $state.target; before = $before; after = $after; message = "Update $($state.target) laga diya. Wapas jana ho to: update.ps1 rollback" }
  Log "Update $($state.target) laga ($before -> $after)."
  Notify "Apna OpenCode update ho gaya" "Ab $($state.target) par. Kuch gadbad lage to tools\auto-update\Wapas-Lo.cmd"
}

function Do-Rollback {
  $state = Read-State
  if ($state.status -ne "done" -or -not $state.before) { return Log "Wapas lene layak koi update nahi." }
  if (App-Running) { return Log "Pehle app band karo." }
  if ((Git @("reset", "-q", "--keep", $state.before)).Code -ne 0) { return Log "Wapas nahi ho paya (naye badlav takra rahe). Log dekho." }
  Install-Deps $Repo | Out-Null
  Set-Content -Path $HoldFile -Value "Rollback kiya $(Get-Date -Format 'yyyy-MM-dd HH:mm') - update $($state.target) hata diya. Ye file hatao to update phir lagenge." -Encoding UTF8
  Save-State @{ status = "rolled-back"; target = $state.target; head = $state.before; message = "Update $($state.target) hata diya; ROKO.txt bana di." }
  Log "Rollback: wapas $($state.before) par. ROKO.txt bana di."
}

# OmniRoute (router): naya version npm par ho aur app band ho tabhi; data ka backup; na chale to purana wapas.
function Update-OmniRoute {
  $pkg = Join-Path $env:APPDATA "npm\node_modules\omniroute\package.json"
  if (-not (Test-Path $pkg)) { return }
  $have = (Get-Content $pkg -Raw | ConvertFrom-Json).version
  $latest = (Run "cmd.exe" @("/c", "npm", "view", "omniroute", "version") $Root).Out
  if (-not ($latest -match '^\d+\.\d+\.\d+$') -or ([version]$latest -le [version]$have)) { return }
  if (App-Running) { return Log "OmniRoute $latest aaya hai (abhi $have); app band hone par lagega." }
  Log "=== OmniRoute $have -> $latest ==="
  $wasRunning = Router-Answers
  Run "cmd.exe" @("/c", "omniroute", "stop") $Root | Out-Null
  $backup = Join-Path $Here "omniroute-backup"
  Remove-Item $backup -Recurse -Force -ErrorAction SilentlyContinue
  Copy-Item (Join-Path $env:USERPROFILE ".omniroute") $backup -Recurse -Force
  $ok = (Run "cmd.exe" @("/c", "npm", "install", "-g", "omniroute@$latest") $Root).Code -eq 0
  if ($ok -and $wasRunning) { $ok = Start-Router }
  if ($ok) { return Notify "OmniRoute update ho gaya" "$have -> $latest" }
  Log "OmniRoute $latest nahi chala; wapas $have."
  Run "cmd.exe" @("/c", "omniroute", "stop") $Root | Out-Null
  Run "cmd.exe" @("/c", "npm", "install", "-g", "omniroute@$have") $Root | Out-Null
  if ($wasRunning) { Start-Router | Out-Null }
  Notify "OmniRoute update ruka" "$latest nahi chala, wapas $have par."
}

function Router-Answers {
  try { Invoke-WebRequest "http://127.0.0.1:20128/v1/models" -UseBasicParsing -TimeoutSec 3 | Out-Null; return $true }
  catch { return [bool]$_.Exception.Response }
}

# Same start as the app's Router page: only this PC, key required.
function Start-Router {
  $env:OMNIROUTE_SERVER_HOST = "127.0.0.1"
  $env:REQUIRE_API_KEY = "true"
  Start-Process "cmd.exe" -ArgumentList "/c omniroute serve --daemon --no-open" -WindowStyle Hidden -WorkingDirectory $Root
  for ($i = 0; $i -lt 45; $i++) { Start-Sleep 1; if (Router-Answers) { return $true } }
  return $false
}

function Update-Pack {
  if (-not (Test-Path (Join-Path $Pack ".git"))) { return }
  if ((Git @("status", "--porcelain") $Pack).Out) { return Log "Superpowers pack me apne badlav hain; update nahi kiya." }
  if ((Git @("fetch", "-q", "--depth", "1", "origin", "HEAD") $Pack).Code -ne 0) { return }
  $new = (Git @("rev-parse", "FETCH_HEAD") $Pack).Out
  if ($new -eq (Git @("rev-parse", "HEAD") $Pack).Out) { return }
  Git @("reset", "-q", "--hard", $new) $Pack | Out-Null
  Log "Superpowers skill pack update hua ($new)."
}

# Tools the user connected from GitHub (Settings > About > "Connect a tool"; the app writes sources.json). Their
# folders under Programming\connected are managed copies: every check takes upstream's latest, local edits are not kept.
# Results go to sources-state.json (written only here), which the About page reads.
function Update-Sources {
  $file = Join-Path $Here "sources.json"
  if (-not (Test-Path $file)) { return }
  $stateFile = Join-Path $Here "sources-state.json"
  $states = @{}
  if (Test-Path $stateFile) { (Get-Content $stateFile -Raw | ConvertFrom-Json).PSObject.Properties | ForEach-Object { $states[$_.Name] = $_.Value } }
  # PowerShell 5.1 emits a JSON array as one object; assigning it first lets foreach walk its items.
  $list = Get-Content $file -Raw | ConvertFrom-Json
  foreach ($s in $list) {
    $now = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $old = $states[$s.name]
    $updated = if ($old) { $old.updated } else { $null }
    if (-not (Test-Path (Join-Path $s.folder ".git"))) { $states[$s.name] = @{ commit = $null; checked = $now; updated = $updated; message = "Folder nahi mila: $($s.folder)" }; continue }
    $commit = (Git @("rev-parse", "--short", "HEAD") $s.folder).Out
    if ((Git @("fetch", "-q", "--depth", "1", "origin", "HEAD") $s.folder).Code -ne 0) {
      $states[$s.name] = @{ commit = $commit; checked = $now; updated = $updated; message = "GitHub tak nahi pahunche" }; continue
    }
    $new = (Git @("rev-parse", "FETCH_HEAD") $s.folder).Out
    if ($new -ne (Git @("rev-parse", "HEAD") $s.folder).Out) {
      Git @("reset", "-q", "--hard", $new) $s.folder | Out-Null
      if ($s.kind -eq "plugin" -and (Test-Path (Join-Path $s.folder "package.json"))) { Run "bun" @("install") $s.folder | Out-Null }
      $commit = (Git @("rev-parse", "--short", "HEAD") $s.folder).Out
      $updated = $now
      Log "Juda tool $($s.name) update hua ($commit)."
    }
    $states[$s.name] = @{ commit = $commit; checked = $now; updated = $updated; message = $null }
  }
  ($states | ConvertTo-Json -Depth 4) | Set-Content -Path $stateFile -Encoding UTF8
}

function Do-Install {
  $ps = "powershell.exe -NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`" check"
  $action = New-ScheduledTaskAction -Execute "conhost.exe" -Argument "--headless $ps"
  $logon = New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME
  $logon.Delay = "PT10M"
  $daily = New-ScheduledTaskTrigger -Daily -At "10:00"
  $settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -RunOnlyIfNetworkAvailable -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries -ExecutionTimeLimit (New-TimeSpan -Hours 2) -MultipleInstances IgnoreNew
  Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger @($logon, $daily) -Settings $settings `
    -Description "Apna OpenCode ko upstream OpenCode release se apne aap update karta hai (tools\auto-update\README.md)." -Force | Out-Null
  Log "Task Scheduler me juda: '$TaskName' (login ke 10 min baad + roz 10:00)."
}

New-Item -ItemType Directory -Force (Split-Path $LogFile) | Out-Null

switch ($Mode) {
  "status" { Read-State | Format-List; if (Test-Path $HoldFile) { "ROKO.txt: " + (Get-Content $HoldFile -Raw).Trim() }; return }
  "install" { return Do-Install }
  "uninstall" { Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false; return Log "Task Scheduler se hata diya." }
}

# One run at a time.
$lock = $null
try { $lock = [System.IO.File]::Open((Join-Path $Here "run.lock"), "OpenOrCreate", "ReadWrite", "None") }
catch { Write-Host "Ek update pehle se chal raha hai."; return }
try {
  switch ($Mode) {
    "check" { Do-Check; if (-not $Target) { Update-OmniRoute; Update-Pack; Update-Sources } }
    "apply" { Do-Apply }
    "rollback" { Do-Rollback }
  }
} catch { Log "GALTI: $($_.Exception.Message) @ $($_.InvocationInfo.ScriptLineNumber)" }
finally { $lock.Close() }
