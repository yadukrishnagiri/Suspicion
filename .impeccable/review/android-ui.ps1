function Read-GameUI {
  adb shell uiautomator dump /sdcard/suspicion-ui.xml | Out-Null
  adb pull /sdcard/suspicion-ui.xml .impeccable/review/window.xml 2>$null | Out-Null
  [xml]$script:GameUI = Get-Content .impeccable/review/window.xml
  $script:GameUI.SelectNodes('//node') | Where-Object { $_.'content-desc' -or ($_.text -and $_.text -notmatch '[\uE000-\uF8FF]') } | ForEach-Object { '{0} | {1} | {2}' -f $_.'content-desc',$_.text,$_.bounds }
}
function Tap-GameControl([string]$name) {
  [xml]$tapUI = Get-Content .impeccable/review/window.xml
  $node = $tapUI.SelectNodes('//node') | Where-Object { $_.'content-desc' -eq $name } | Select-Object -First 1
  if (!$node) { throw "Control not present: $name" }
  $coords = [regex]::Matches($node.bounds,'\d+') | ForEach-Object { [int]$_.Value }
  adb shell input tap (($coords[0]+$coords[2])/2) (($coords[1]+$coords[3])/2)
}
function Capture-Game([string]$name) {
  adb shell screencap -p /sdcard/suspicion-shot.png
  adb pull /sdcard/suspicion-shot.png ".impeccable/review/$name.png" 2>$null | Out-Null
}
