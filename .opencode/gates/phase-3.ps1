param([string]$Workspace = ".")

$errors = 0
$root = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent

$requiredFiles = @(
  "$root/index.html",
  "$root/styles/site.css",
  "$root/scripts/site.js",
  "$root/scripts/verify-site.js",
  "$root/404.html",
  "$root/sitemap.xml",
  "$root/robots.txt"
)
foreach ($f in $requiredFiles) {
  if (-not (Test-Path $f)) {
    Write-Host "FAIL: $f not found"
    $errors++
  }
}

$htmlFiles = @("$root/index.html")
foreach ($f in $htmlFiles) {
  $result = & "$PSScriptRoot\lib\fuzzy-text.ps1" -Path $f
  if ($LASTEXITCODE -ne 0) { $errors++ }
}

if (Test-Path "$root/index.html") {
  $homeContent = Get-Content "$root/index.html" -Raw
  if ($homeContent -notmatch 'evidence-switcher|tech-chain-list|radar-grid') {
    Write-Host "FAIL: index.html missing core sections"
    $errors++
  }
}

if ($errors -eq 0) { Write-Host "PASS: phase-3 gate" }
exit $errors
