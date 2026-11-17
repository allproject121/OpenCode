<#
  stage.ps1 ki banayi copy ko GitHub (private repo allproject121/OpenCode) par bhejna, tukdon mein:
  GitHub ek push mein ~2 GB se zyada nahi leta, isliye har commit + push lagbhag $BatchMB MB ka.
  Dobara chalane par wahi se aage chalta hai (jo pehle commit ho chuka, woh dobara nahi jata).
  Log: <stage>\_restore\push-log.txt   (yeh log GitHub par nahi jata)
#>
param(
    [string] $Stage = 'C:\Users\Roshan\Downloads\OpenCode-github',
    [string] $Remote = 'https://github.com/allproject121/OpenCode.git',
    [long] $BatchMB = 1200
)
$ErrorActionPreference = 'Continue'
Set-Location -LiteralPath $Stage
$tools = Split-Path -Parent $MyInvocation.MyCommand.Path
$log = Join-Path $tools 'push-log.txt'
function Log([string] $s) { $line = (Get-Date).ToString('HH:mm:ss') + '  ' + $s; Add-Content -Path $log -Value $line -Encoding utf8; $line }

Add-Type -TypeDefinition @'
using System; using System.Collections.Generic; using System.IO;
public static class Sz {
    static string L(string p) { return p.StartsWith(@"\\?\") ? p : @"\\?\" + p; }
    public static long Size(string dir) {
        long s = 0; var st = new Stack<string>(); st.Push(L(dir));
        while (st.Count > 0) { var d = st.Pop();
            foreach (var f in Directory.GetFiles(d)) s += new FileInfo(f).Length;
            foreach (var x in Directory.GetDirectories(d)) st.Push(x); }
        return s;
    }
    public static string[] Dirs(string dir) { var r = Directory.GetDirectories(L(dir)); for (int i = 0; i < r.Length; i++) r[i] = r[i].Substring(4); return r; }
    public static string[] Files(string dir) { var r = Directory.GetFiles(L(dir)); for (int i = 0; i < r.Length; i++) r[i] = r[i].Substring(4); return r; }
    public static long Len(string f) { return new FileInfo(L(f)).Length; }
}
'@

if (-not (Test-Path (Join-Path $Stage '.git'))) {
    git init -q -b main
    git remote add origin $Remote
    Log 'git repo made'
}
git config core.longpaths true; git config core.autocrlf false; git config core.safecrlf false
git config http.postBuffer 524288000; git config pack.windowMemory 256m; git config core.bigFileThreshold 50m

# units: a folder bigger than the batch is opened up into its files + subfolders
$limit = $BatchMB * 1MB
$units = New-Object 'System.Collections.Generic.List[object]'
function Add-Units([string] $dir) {
    foreach ($f in [Sz]::Files($dir)) { $units.Add([pscustomobject]@{ P = $f; B = [Sz]::Len($f) }) }
    foreach ($d in [Sz]::Dirs($dir)) {
        if ($d -eq (Join-Path $Stage '.git')) { continue }
        $b = [Sz]::Size($d)
        if ($b -gt $limit) { Add-Units $d } else { $units.Add([pscustomobject]@{ P = $d; B = $b }) }
    }
}
Add-Units $Stage
$total = ($units | Measure-Object B -Sum).Sum
Log ("to upload: {0:0} MB in {1} pieces" -f ($total / 1MB), $units.Count)

$batches = New-Object 'System.Collections.Generic.List[object]'; $cur = New-Object 'System.Collections.Generic.List[string]'; $curB = 0L
foreach ($u in $units) {
    if ($cur.Count -gt 0 -and $curB + $u.B -gt $limit) { $batches.Add(@{ P = $cur; B = $curB }); $cur = New-Object 'System.Collections.Generic.List[string]'; $curB = 0L }
    $cur.Add($u.P.Substring($Stage.Length + 1)); $curB += $u.B
}
if ($cur.Count) { $batches.Add(@{ P = $cur; B = $curB }) }
Log "batches: $($batches.Count)"

$i = 0
foreach ($b in $batches) {
    $i++
    $spec = Join-Path $tools 'pathspec.txt'
    [IO.File]::WriteAllLines($spec, [string[]]$b.P, (New-Object Text.UTF8Encoding($false)))
    git add -A -f --pathspec-from-file="$spec" 2>&1 | Select-Object -First 5 | ForEach-Object { Log "  add: $_" }
    $staged = @(git diff --cached --name-only).Count
    if ($staged -eq 0) { Log ("batch {0}/{1}: already uploaded, skip" -f $i, $batches.Count); continue }
    $first = $b.P[0]; $more = $b.P.Count - 1
    $msg = Join-Path $tools 'msg.txt'
    $text = "Upload {0}/{1}: {2}{3} ({4:0} MB, {5} files)`n`nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`n" -f $i, $batches.Count, $first, $(if ($more) { " + $more more" } else { '' }), ($b.B / 1MB), $staged
    [IO.File]::WriteAllText($msg, $text, (New-Object Text.UTF8Encoding($false)))
    git commit -q -F $msg 2>&1 | Select-Object -First 3 | ForEach-Object { Log "  commit: $_" }
    Log ("batch {0}/{1}: committed {2} files ({3:0} MB), pushing ..." -f $i, $batches.Count, $staged, ($b.B / 1MB))
    $ok = $false
    for ($try = 1; $try -le 3 -and -not $ok; $try++) {
        $out = git push -u origin main 2>&1
        if ($LASTEXITCODE -eq 0) { $ok = $true } else { Log "  push try $try failed: $(($out | Select-Object -Last 4) -join ' / ')" }
    }
    if (-not $ok) { Log "STOPPED at batch $i (push failed 3 times)"; exit 3 }
    Log ("batch {0}/{1}: pushed" -f $i, $batches.Count)
}
$left = @(git status --porcelain).Count
Log "DONE. files not yet in git: $left"
