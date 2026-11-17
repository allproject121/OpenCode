<#
  "Sab kuch" GitHub par: Downloads\Programming ki poori copy ek alag folder (stage) mein, jo GitHub le sake:
   1) har file ki copy (robocopy; Windows ke links/junctions copy nahi, unki list banti hai)
   2) andar ke har git repo ka .git folder -> "_git-history.tar" (GitHub ".git" naam ka folder nahi leta)
   3) 95 MB se badi har file -> 90 MB ke tukde "<naam>.part001" … (GitHub 100 MB se badi file nahi leta)
   4) _restore\restore.ps1: tukde jodna, .git wapas kholna, links wapas banana
  Programming ko sirf PADHTA hai. Log: <stage>\_restore\stage-log.txt
#>
param(
    [string] $Source = 'C:\Users\Roshan\Downloads\Programming',
    [string] $Stage = 'C:\Users\Roshan\Downloads\OpenCode-github',
    [long] $SplitAboveMB = 95,
    [long] $PartMB = 90
)
$ErrorActionPreference = 'Stop'
$restore = Join-Path $Stage '_restore'
$null = New-Item -ItemType Directory -Force -Path $restore
$log = Join-Path $restore 'stage-log.txt'
function Log([string] $s) { $line = (Get-Date).ToString('HH:mm:ss') + '  ' + $s; Add-Content -Path $log -Value $line -Encoding utf8; $line }

Add-Type -TypeDefinition @'
using System; using System.Collections.Generic; using System.IO;
public static class Walk {
    // Every folder under root WITHOUT going into links; returns links (path) and git repos (folders that hold a ".git" folder).
    public static void Scan(string root, List<string> links, List<string> repos) {
        var stack = new Stack<string>(); stack.Push(root);
        while (stack.Count > 0) {
            var d = stack.Pop();
            string[] subs;
            try { subs = Directory.GetDirectories(d); } catch { continue; }
            foreach (var s in subs) {
                FileAttributes a; try { a = File.GetAttributes(s); } catch { continue; }
                var name = Path.GetFileName(s);
                if ((a & FileAttributes.ReparsePoint) != 0) { links.Add(s); continue; }
                if (name == ".git") { repos.Add(d); continue; }
                stack.Push(s);
            }
            try { foreach (var f in Directory.GetFiles(d)) { if ((File.GetAttributes(f) & FileAttributes.ReparsePoint) != 0) links.Add(f); } } catch { }
        }
    }
}
'@

Log "source: $Source"
Log "stage:  $Stage"

# 1) copy everything except .git folders and links
Log 'step 1: copying files (robocopy) ...'
$null = robocopy $Source $Stage /E /XJ /XD .git /XF .git /COPY:DAT /DCOPY:T /R:1 /W:1 /MT:16 /NFL /NDL /NP /NJH /LOG+:"$restore\robocopy-log.txt"
Log "robocopy exit code: $LASTEXITCODE (below 8 = fine)"
if ($LASTEXITCODE -ge 8) { Log 'ERROR: copy failed, see robocopy-log.txt'; exit 2 }

# 2) links and git repos
Log 'step 2: finding links (junctions / symlinks) and git repos ...'
$links = New-Object 'System.Collections.Generic.List[string]'; $repos = New-Object 'System.Collections.Generic.List[string]'
[Walk]::Scan($Source, $links, $repos)
$lines = foreach ($l in $links) {
    $it = Get-Item -LiteralPath $l -Force
    $target = @($it.Target)[0]
    $kind = if ($it.PSIsContainer) { 'dir' } else { 'file' }
    $rel = $l.Substring($Source.Length + 1)
    $t = if ($target -and $target.StartsWith($Source, [StringComparison]::OrdinalIgnoreCase)) { '<project>\' + $target.Substring($Source.Length + 1) } else { $target }
    "$kind`t$($it.LinkType)`t$rel`t$t"
}
$lines | Set-Content -Path (Join-Path $restore 'links.tsv') -Encoding utf8
Log "links found: $($links.Count) (listed in _restore\links.tsv)"
Log "git repos found: $($repos.Count): $(($repos | ForEach-Object { if ($_ -eq $Source) { '<root>' } else { $_.Substring($Source.Length + 1) } }) -join ', ')"

# 2b) each repo's .git -> tar
foreach ($r in $repos) {
    $rel = if ($r -eq $Source) { '' } else { $r.Substring($Source.Length + 1) }
    $dest = if ($rel) { Join-Path $Stage $rel } else { $Stage }
    $null = New-Item -ItemType Directory -Force -Path $dest
    $tarFile = Join-Path $dest '_git-history.tar'
    & tar.exe -cf $tarFile -C $r .git 2>&1 | Out-Null
    Log ("  {0}: .git -> _git-history.tar ({1:0.0} MB, tar exit {2})" -f $(if ($rel) { $rel } else { '<root>' }), ((Get-Item $tarFile).Length / 1MB), $LASTEXITCODE)
}
$repos | ForEach-Object { if ($_ -eq $Source) { '.' } else { $_.Substring($Source.Length + 1) } } | Set-Content -Path (Join-Path $restore 'git-repos.txt') -Encoding utf8

# 3) split big files
Log "step 3: splitting files over $SplitAboveMB MB into $PartMB MB parts ..."
$big = & robocopy $Stage 'C:\__nowhere__' /L /E /BYTES /MIN:$($SplitAboveMB * 1MB) /NDL /NJH /NJS /FP /R:0 /W:0 /XJ 2>$null |
    Where-Object { $_ -match '\S' } | ForEach-Object { ($_.Trim() -split "`t")[-1].Trim() } | Where-Object { $_ -and (Test-Path -LiteralPath $_) }
$splitList = New-Object 'System.Collections.Generic.List[string]'
foreach ($f in $big) {
    $len = (Get-Item -LiteralPath $f).Length
    $buf = New-Object byte[] (4MB)
    $in = [IO.File]::OpenRead($f); $n = 0
    try {
        while ($in.Position -lt $len) {
            $n++; $part = '{0}.part{1:000}' -f $f, $n
            $out = [IO.File]::Create($part)
            try { $left = $PartMB * 1MB; while ($left -gt 0) { $r = $in.Read($buf, 0, [int][math]::Min($buf.Length, $left)); if ($r -le 0) { break }; $out.Write($buf, 0, $r); $left -= $r } } finally { $out.Close() }
        }
    } finally { $in.Close() }
    $hash = (Get-FileHash -LiteralPath $f -Algorithm SHA256).Hash
    Remove-Item -LiteralPath $f -Force
    $rel = $f.Substring($Stage.Length + 1)
    $splitList.Add("$rel`t$n`t$len`t$hash")
    Log ("  split {0} ({1:0} MB) into {2} parts" -f $rel, ($len / 1MB), $n)
}
$splitList | Set-Content -Path (Join-Path $restore 'split-files.tsv') -Encoding utf8

# 4) restore script + readme
@'
<#
  Downloads\Programming ko is GitHub copy se wapas poora banana.
    1) "<naam>.partNNN" tukde jod kar asli file (SHA256 milata hai)
    2) har "_git-history.tar" ko kholna -> us folder ka .git wapas
    3) Windows links / junctions wapas banana (links.tsv)
  Chalao (repo ke top folder se):  powershell -ExecutionPolicy Bypass -File _restore\restore.ps1
#>
$root = Split-Path -Parent $PSScriptRoot
foreach ($l in Get-Content (Join-Path $PSScriptRoot 'split-files.tsv')) {
    if (-not $l) { continue }
    $rel, $n, $len, $hash = $l -split "`t"
    $f = Join-Path $root $rel
    $out = [IO.File]::Create($f)
    try { for ($i = 1; $i -le [int]$n; $i++) { $p = '{0}.part{1:000}' -f $f, $i; $b = [IO.File]::ReadAllBytes($p); $out.Write($b, 0, $b.Length) } } finally { $out.Close() }
    if ((Get-FileHash -LiteralPath $f -Algorithm SHA256).Hash -ne $hash) { "BAD: $rel does not match its checksum"; continue }
    for ($i = 1; $i -le [int]$n; $i++) { Remove-Item -LiteralPath ('{0}.part{1:000}' -f $f, $i) }
    "joined: $rel"
}
foreach ($rel in Get-Content (Join-Path $PSScriptRoot 'git-repos.txt')) {
    if (-not $rel) { continue }
    $dir = if ($rel -eq '.') { $root } else { Join-Path $root $rel }
    $tar = Join-Path $dir '_git-history.tar'
    if (Test-Path $tar) { & tar.exe -xf $tar -C $dir; Remove-Item $tar; "git history back: $rel" }
}
foreach ($l in Get-Content (Join-Path $PSScriptRoot 'links.tsv')) {
    if (-not $l) { continue }
    $kind, $type, $rel, $target = $l -split "`t"
    $path = Join-Path $root $rel
    if ($target -like '<project>\*') { $target = Join-Path $root $target.Substring(10) }
    if (Test-Path -LiteralPath $path) { continue }
    $null = New-Item -ItemType Directory -Force -Path (Split-Path -Parent $path)
    if ($type -eq 'Junction') { cmd /c "mklink /J `"$path`" `"$target`"" | Out-Null }
    elseif ($kind -eq 'dir') { cmd /c "mklink /D `"$path`" `"$target`"" | Out-Null }
    else { cmd /c "mklink `"$path`" `"$target`"" | Out-Null }
}
'links back'
'@ | Set-Content -Path (Join-Path $restore 'restore.ps1') -Encoding utf8

@"
# Downloads\Programming — poori copy (A se Z)

Is repo mein ``C:\Users\Roshan\Downloads\Programming`` ki **har file** hai, jaisi $((Get-Date).ToString('dd MMM yyyy HH:mm')) par thi:
Apna OpenCode (``opencode``), Kilo Code, OmniRoute, ``update-work``, backup, config, logs, tools, vendor, test-projects, aur ``node_modules`` bhi.

GitHub ki teen seemaon ki wajah se kuch cheezein badle roop mein hain (kuch chhoota nahi):
- **95 MB se badi files** ``<naam>.part001``, ``part002`` … tukdon mein hain (list: ``_restore\split-files.tsv``).
- **Andar ke git repo ka ``.git`` folder** har repo ke folder mein ``_git-history.tar`` hai (list: ``_restore\git-repos.txt``).
- **Windows links / junctions** (bun ke node_modules) ki list ``_restore\links.tsv`` mein hai.

Sab wapas asli jaisa: ``powershell -ExecutionPolicy Bypass -File _restore\restore.ps1``

Yeh repo **private** rehna chahiye: isme ``config\service-local.json`` (app server ka password) aur ``logs\`` (chats, screenshots) bhi hain.
"@ | Set-Content -Path (Join-Path $Stage 'README-UPLOAD.md') -Encoding utf8

$sum = & robocopy $Stage 'C:\__nowhere__' /L /E /BYTES /NFL /NDL /NJH /R:0 /W:0 /XJ 2>$null
Log ('stage ready: ' + (($sum | Where-Object { $_ -match '^\s*(Files|Bytes)\s*:' } | ForEach-Object { $_.Trim() -replace '\s+', ' ' }) -join ' | '))
