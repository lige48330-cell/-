# gate-run.ps1 鈥?闂搁棬缂栨帓鍏ュ彛
param([string]$Phase, [string]$Workspace = ".")

$validPhases = @("phase-1", "phase-2", "phase-3", "phase-4", "phase-5", "phase-6")
if ($validPhases -notcontains $Phase) {
  Write-Host "ERROR: invalid phase '$Phase'. Valid: $($validPhases -join ', ')"
  exit 1
}

Write-Host "=== Running $Phase gate ==="

$gateScript = "$PSScriptRoot/$Phase.ps1"
if (-not (Test-Path $gateScript)) {
  Write-Host "ERROR: gate script not found: $gateScript"
  exit 1
}

& $gateScript -Workspace $Workspace
$exitCode = $LASTEXITCODE

if ($exitCode -eq 0) {
  Write-Host "=== $Phase gate PASSED ==="
} else {
  Write-Host "=== $Phase gate FAILED ($exitCode errors) ==="
}

exit $exitCode
