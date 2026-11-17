# Clicks once inside another app's window at a point given relative to the window's top-left corner (the same pixels
# as a capture-window.ps1 picture). It brings that window to the front first and clicks only if it really is in
# front, then puts the mouse back where it was.
#   powershell -File click-window.ps1 -Match "^ChatGPT$" -X 200 -Y 587
param(
  [Parameter(Mandatory = $true)][string]$Match,
  [Parameter(Mandatory = $true)][int]$X,
  [Parameter(Mandatory = $true)][int]$Y
)

Add-Type @"
using System;
using System.Runtime.InteropServices;
public static class WindowClick {
  [StructLayout(LayoutKind.Sequential)] public struct RECT { public int Left, Top, Right, Bottom; }
  [StructLayout(LayoutKind.Sequential)] public struct POINT { public int X, Y; }
  [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr hWnd, out RECT rect);
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
  [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int cmd);
  [DllImport("user32.dll")] public static extern bool IsIconic(IntPtr hWnd);
  [DllImport("user32.dll")] public static extern bool GetCursorPos(out POINT point);
  [DllImport("user32.dll")] public static extern bool SetCursorPos(int x, int y);
  [DllImport("user32.dll")] public static extern void mouse_event(uint flags, uint dx, uint dy, uint data, UIntPtr extra);
  [DllImport("user32.dll")] public static extern bool SetProcessDPIAware();
}
"@

[void][WindowClick]::SetProcessDPIAware()
$window = Get-Process -ErrorAction SilentlyContinue |
  Where-Object { $_.MainWindowHandle -ne 0 -and ($_.ProcessName -match $Match -or $_.MainWindowTitle -match $Match) } |
  Select-Object -First 1
if (-not $window) { "no window matches '$Match'"; exit 1 }
$handle = $window.MainWindowHandle

if ([WindowClick]::IsIconic($handle)) { [void][WindowClick]::ShowWindow($handle, 9) }
[void][WindowClick]::SetForegroundWindow($handle)
Start-Sleep -Milliseconds 500
if ([WindowClick]::GetForegroundWindow() -ne $handle) { "the window did not come to the front; not clicking"; exit 1 }

$rect = New-Object WindowClick+RECT
[void][WindowClick]::GetWindowRect($handle, [ref]$rect)
if ($X -lt 0 -or $Y -lt 0 -or $X -ge ($rect.Right - $rect.Left) -or $Y -ge ($rect.Bottom - $rect.Top)) { "point is outside the window"; exit 1 }

$before = New-Object WindowClick+POINT
[void][WindowClick]::GetCursorPos([ref]$before)
[void][WindowClick]::SetCursorPos($rect.Left + $X, $rect.Top + $Y)
Start-Sleep -Milliseconds 150
[WindowClick]::mouse_event(0x0002, 0, 0, 0, [UIntPtr]::Zero)
[WindowClick]::mouse_event(0x0004, 0, 0, 0, [UIntPtr]::Zero)
Start-Sleep -Milliseconds 150
[void][WindowClick]::SetCursorPos($before.X, $before.Y)
"clicked ($X, $Y) in '$($window.MainWindowTitle)'"
