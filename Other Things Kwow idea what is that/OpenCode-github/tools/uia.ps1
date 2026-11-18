# Looks inside another app's window through Windows accessibility, without moving the mouse.
#   powershell -File uia.ps1 -Window "^ChatGPT$" -List                 lists named buttons / links / items
#   powershell -File uia.ps1 -Window "^ChatGPT$" -Click "Settings"     presses the first element with that exact name
param(
  [Parameter(Mandatory = $true)][string]$Window,
  [switch]$List,
  [string]$Click
)

Add-Type -AssemblyName UIAutomationClient
Add-Type -AssemblyName UIAutomationTypes

$process = Get-Process -ErrorAction SilentlyContinue |
  Where-Object { $_.MainWindowHandle -ne 0 -and ($_.ProcessName -match $Window -or $_.MainWindowTitle -match $Window) } |
  Select-Object -First 1
if (-not $process) { "no window matches '$Window'"; exit 1 }

$root = [System.Windows.Automation.AutomationElement]::FromHandle($process.MainWindowHandle)
$all = $root.FindAll([System.Windows.Automation.TreeScope]::Descendants, [System.Windows.Automation.Condition]::TrueCondition)

if ($List) {
  $all | ForEach-Object {
    $name = $_.Current.Name
    $type = $_.Current.ControlType.ProgrammaticName -replace 'ControlType\.', ''
    if ($name -and $type -in 'Button', 'Hyperlink', 'MenuItem', 'ListItem', 'TabItem', 'TreeItem', 'Text', 'Edit') {
      "{0,-10} {1}" -f $type, ($name.Substring(0, [Math]::Min(70, $name.Length)))
    }
  } | Select-Object -Unique
  exit 0
}

if ($Click) {
  $target = $all | Where-Object { $_.Current.Name -eq $Click } | Select-Object -First 1
  if (-not $target) { "no element named '$Click'"; exit 1 }
  $pattern = $null
  if ($target.TryGetCurrentPattern([System.Windows.Automation.InvokePattern]::Pattern, [ref]$pattern)) {
    $pattern.Invoke(); "pressed '$Click'"; exit 0
  }
  if ($target.TryGetCurrentPattern([System.Windows.Automation.ExpandCollapsePattern]::Pattern, [ref]$pattern)) {
    $pattern.Expand(); "expanded '$Click'"; exit 0
  }
  if ($target.TryGetCurrentPattern([System.Windows.Automation.SelectionItemPattern]::Pattern, [ref]$pattern)) {
    $pattern.Select(); "selected '$Click'"; exit 0
  }
  "element '$Click' cannot be pressed"; exit 1
}
