param([string]$Path)

$fuzzyWords = @("可能", "大概", "视情况", "maybe", "probably", "roughly", "TBD", "TODO")
$found = $false

$content = Get-Content -Path $Path -Raw -ErrorAction SilentlyContinue
if (-not $content) {
  Write-Host "FAIL: $Path not readable"
  exit 1
}

foreach ($word in $fuzzyWords) {
  if ($content -match $word) {
    Write-Host "WARN: fuzzy term '$word' found in $Path"
    $found = $true
  }
}

if ($found) {
  Write-Host "FAIL: fuzzy terms detected"
  exit 1
}

Write-Host "OK: no fuzzy terms in $Path"
exit 0
