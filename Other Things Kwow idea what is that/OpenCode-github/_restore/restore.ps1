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

# folders whose ".git" is a small FILE (git worktree pointer), saved as "_git-file.txt"
$gf = Join-Path $PSScriptRoot 'git-files.txt'
if (Test-Path $gf) { foreach ($rel in Get-Content $gf) { if (-not $rel) { continue }; $p = Join-Path (Join-Path $root $rel) '_git-file.txt'; if (Test-Path $p) { Move-Item -LiteralPath $p -Destination (Join-Path (Join-Path $root $rel) '.git'); "git pointer back: $rel" } } }
