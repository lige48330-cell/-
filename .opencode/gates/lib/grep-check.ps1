param([string]$Pattern, [string]$Path, [string]$Message)

$files = Get-ChildItem -Path $Path -Recurse -File -ErrorAction SilentlyContinue
$found = $false
foreach ($file in $files) {
  $matches = Select-String -Path $file.FullName -Pattern $Pattern -SimpleMatch -Quiet
  if ($matches) {
    Write-Host "FAIL: $($file.FullName) 鈥?$Message"
    $found = $true
  }
}
if ($found) { exit 1 }
Write-Host "OK: no '$Pattern' found in $Path"
exit 0
