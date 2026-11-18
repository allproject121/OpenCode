# Saves a picture of another app's main window without clicking or typing in it.
# Usage: powershell -File capture-window.ps1 -Match "codex" -Out "C:\...\codex.png"
param(
  [Parameter(Mandatory = $true)][string]$Match,
  [Parameter(Mandatory = $true)][string]$Out
)

Add-Type -AssemblyName System.Drawing
Add-Type @"
using System;
using System.Runtime.InteropServices;
public static class WindowShot {
  [StructLayout(LayoutKind.Sequential)] public struct RECT { public int Left, Top, Right, Bottom; }
  [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr hWnd, out RECT rect);
  [DllImport("user32.dll")] public static extern bool PrintWindow(IntPtr hWnd, IntPtr hdc, uint flags);
  [DllImport("user32.dll")] public static extern bool IsIconic(IntPtr hWnd);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int cmd);
  [DllImport("user32.dll")] public static extern bool SetProcessDPIAware();
}
"@

[void][WindowShot]::SetProcessDPIAware()
$window = Get-Process -ErrorAction SilentlyContinue |
  Where-Object { $_.MainWindowHandle -ne 0 -and ($_.ProcessName -match $Match -or $_.MainWindowTitle -match $Match) } |
  Select-Object -First 1

if (-not $window) { "no window matches '$Match'"; exit 1 }
# A minimised window has no picture; show it without giving it the keyboard (4 = SW_SHOWNOACTIVATE).
if ([WindowShot]::IsIconic($window.MainWindowHandle)) { [void][WindowShot]::ShowWindow($window.MainWindowHandle, 4); Start-Sleep -Milliseconds 800 }

$rect = New-Object WindowShot+RECT
[void][WindowShot]::GetWindowRect($window.MainWindowHandle, [ref]$rect)
$width = $rect.Right - $rect.Left
$height = $rect.Bottom - $rect.Top
if ($width -le 0 -or $height -le 0) { "window has no size"; exit 1 }

$bitmap = New-Object System.Drawing.Bitmap $width, $height
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$hdc = $graphics.GetHdc()
# 2 = PW_RENDERFULLCONTENT: needed for windows drawn by a browser engine.
$ok = [WindowShot]::PrintWindow($window.MainWindowHandle, $hdc, 2)
$graphics.ReleaseHdc($hdc)
$graphics.Dispose()
$bitmap.Save($Out, [System.Drawing.Imaging.ImageFormat]::Png)
$bitmap.Dispose()
"saved $Out  ${width}x${height}  process=$($window.ProcessName)  title='$($window.MainWindowTitle)'  printed=$ok"
