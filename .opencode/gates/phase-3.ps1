param([string]$Workspace = ".")

$errors = 0
$root = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent

$requiredFiles = @(
  "$root/index.html",
  "$root/styles/site.css",
  "$root/liquid-glass.css",
  "$root/scripts/site.js",
  "$root/scripts/verify-site.js",
  "$root/404.html",
  "$root/sitemap.xml",
  "$root/robots.txt",
  "$root/projects/esp32-iot-platform.html",
  "$root/projects/ai-supervisor.html",
  "$root/projects/aquaculture-prototype.html",
  "$root/projects/profile-miniapp.html",
  "$root/projects/ea-research.html"
)
foreach ($f in $requiredFiles) {
  if (-not (Test-Path $f)) {
    Write-Host "FAIL: $f not found"
    $errors++
  }
}

$htmlFiles = @("$root/index.html") + (Get-ChildItem "$root/projects" -Filter "*.html" | ForEach-Object { $_.FullName })
foreach ($f in $htmlFiles) {
  $result = & "$PSScriptRoot\lib\fuzzy-text.ps1" -Path $f
  if ($LASTEXITCODE -ne 0) { $errors++ }
}

if (Test-Path "$root/index.html") {
  $homeContent = Get-Content "$root/index.html" -Raw
  if ($homeContent -notmatch 'data-site-version="2026-08-07"') {
    Write-Host "FAIL: index.html missing site version"
    $errors++
  }
  if ($homeContent -notmatch 'esp32-iot-platform.html|ai-supervisor.html|aquaculture-prototype.html') {
    Write-Host "FAIL: index.html missing featured case links"
    $errors++
  }
}

if ($errors -eq 0) { Write-Host "PASS: phase-3 gate" }
exit $errors
