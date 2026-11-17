# Saves what is really on the screen where a window sits (so glass and what shows through it are in the picture).
# The window must be visible: this copies screen pixels, it does not ask the window to draw itself.
#   powershell -File capture-screen.ps1 -Match "^electron$" -Out "C:\...\shot.png" [-Front]
param(
  [Parameter(Mandatory = $true)][string]$Match,
  [Parameter(Mandatory = $true)][string]$Out,
  [switch]$Front
)

Add-Type -AssemblyName System.Drawing
Add-Type @"
using System;
using System.Runtime.InteropServices;
public static class ScreenShot {
  [StructLayout(LayoutKind.Sequential)] public struct RECT { public int Left, Top, Right, Bottom; }
  [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr hWnd, out RECT rect);
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int cmd);
  [DllImport("user32.dll")] public static extern bool IsIconic(IntPtr hWnd);
  [DllImport("user32.dll")] public static extern bool SetProcessDPIAware();
}
"@

[void][ScreenShot]::SetProcessDPIAware()
$window = Get-Process -ErrorAction SilentlyContinue |
  Where-Object { $_.MainWindowHandle -ne 0 -and ($_.ProcessName -match $Match -or $_.MainWindowTitle -match $Match) } |
  Select-Object -First 1
if (-not $window) { "no window matches '$Match'"; exit 1 }

if ($Front) {
  if ([ScreenShot]::IsIconic($window.MainWindowHandle)) { [void][ScreenShot]::ShowWindow($window.MainWindowHandle, 9) }
  [void][ScreenShot]::SetForegroundWindow($window.MainWindowHandle)
  Start-Sleep -Milliseconds 900
}

$rect = New-Object ScreenShot+RECT
[void][ScreenShot]::GetWindowRect($window.MainWindowHandle, [ref]$rect)
$left = [Math]::Max(0, $rect.Left)
$top = [Math]::Max(0, $rect.Top)
$width = $rect.Right - $left
$height = $rect.Bottom - $top
if ($width -le 0 -or $height -le 0) { "window has no size"; exit 1 }

$bitmap = New-Object System.Drawing.Bitmap $width, $height
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.CopyFromScreen($left, $top, 0, 0, (New-Object System.Drawing.Size $width, $height))
$graphics.Dispose()
$bitmap.Save($Out, [System.Drawing.Imaging.ImageFormat]::Png)
$bitmap.Dispose()
"saved $Out  ${width}x${height}  title='$($window.MainWindowTitle)'"
