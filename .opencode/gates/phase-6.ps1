param([string]$Workspace = ".")

$errors = 0

$checklist = "$Workspace/CHECKLIST_SIGNED.md"
if (-not (Test-Path $checklist)) {
  Write-Host "FAIL: CHECKLIST_SIGNED.md not found"
  $errors++
} else {
  $content = Get-Content $checklist -Raw
  $unchecked = [regex]::Matches($content, '- \[ \]')
  if ($unchecked.Count -gt 0) {
    Write-Host "WARN: $($unchecked.Count) unchecked items remain"
  }
}

$requiredArtifacts = @(
  "$Workspace/PROJECT_SPEC.md",
  "$Workspace/ARCHITECTURE.md",
  "$Workspace/STABILITY_REPORT.md",
  "$Workspace/RETROSPECTIVE.md",
  "$Workspace/ONE_CALL_TEMPLATE/PROJECT_BRIEF.md"
)
foreach ($f in $requiredArtifacts) {
  if (-not (Test-Path $f)) {
    Write-Host "FAIL: $f not found — missing artifact from prior phase"
    $errors++
  }
}

if ($errors -eq 0) { Write-Host "PASS: phase-6 gate" }
exit $errors
