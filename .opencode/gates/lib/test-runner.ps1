param([string]$TestDir, [string]$TestPattern = "tests/*.test.js")

$originalDir = Get-Location
Set-Location $TestDir

$result = & node --test $TestPattern --timeout=10000 2>&1
$exitCode = $LASTEXITCODE

if ($exitCode -eq 0) {
  Write-Host "PASS: all tests passed"
  Set-Location $originalDir
  exit 0
} else {
  Write-Host "FAIL: tests failed (exit code $exitCode)"
  Write-Host $result
  Set-Location $originalDir
  exit 1
}
