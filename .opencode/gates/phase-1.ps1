param([string]$Workspace = ".")

$errors = 0

if (-not (Test-Path "$Workspace/PROJECT_SPEC.md")) {
  Write-Host "FAIL: PROJECT_SPEC.md not found"
  $errors++
}

if (Test-Path "$Workspace/PROJECT_SPEC.md") {
  $result = & "$PSScriptRoot\lib\fuzzy-text.ps1" -Path "$Workspace/PROJECT_SPEC.md"
  if ($LASTEXITCODE -ne 0) { $errors++ }
}

if (Test-Path "$Workspace/PROJECT_SPEC.md") {
  $content = Get-Content "$Workspace/PROJECT_SPEC.md" -Raw -ErrorAction SilentlyContinue

  if ($content -notmatch '\^?\d+\.\d+\.\d+') {
    Write-Host "FAIL: no version numbers in PROJECT_SPEC.md"
    $errors++
  }

  if ($content -notmatch '(?i)目录|directory|folder|structure') {
    Write-Host "FAIL: no directory structure in PROJECT_SPEC.md"
    $errors++
  }

  if ($content -notmatch '(?i)约束|constraint|稳定性|分页|异步') {
    Write-Host "FAIL: no constraints section in PROJECT_SPEC.md"
    $errors++
  }
}

if ($errors -eq 0) { Write-Host "PASS: phase-1 gate" }
exit $errors


