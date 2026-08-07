param([string]$Path)

if (-not (Test-Path -LiteralPath $Path)) {
  Write-Host "FAIL: $Path not found"
  exit 1
}
Write-Host "OK: $Path found"
exit 0
