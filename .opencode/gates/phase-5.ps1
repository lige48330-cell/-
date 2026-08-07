param([string]$Workspace = ".")

$errors = 0

$retro = "$Workspace/RETROSPECTIVE.md"
if (-not (Test-Path $retro)) {
  Write-Host "FAIL: RETROSPECTIVE.md not found"
  $errors++
}

$templateDir = "$Workspace/ONE_CALL_TEMPLATE"
$templateFiles = @(
  "$templateDir/PROJECT_BRIEF.md",
  "$templateDir/SYSTEM_PROMPT.txt",
  "$templateDir/VALIDATION_CHECKLIST.md"
)
foreach ($f in $templateFiles) {
  if (-not (Test-Path $f)) {
    Write-Host "FAIL: $f not found"
    $errors++
  }
}

if ($errors -eq 0) { Write-Host "PASS: phase-5 gate" }
exit $errors
