param([string]$Workspace = ".")

$errors = 0
$root = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent

$verifyResult = & node "$root/scripts/verify-site.js" 2>&1
if ($LASTEXITCODE -ne 0) {
  Write-Host "FAIL: verify-site.js failed"
  Write-Host $verifyResult
  $errors++
}

$homeContent = Get-Content "$root/index.html" -Raw

if ($homeContent -notmatch 'loading="lazy"') {
  Write-Host "WARN: no lazy loading images on homepage"
}

if ($homeContent -notmatch 'width="[0-9]+"') {
  Write-Host "WARN: images missing explicit dimensions"
}

$cssContent = Get-Content "$root/styles/site.css" -Raw
if ($cssContent -notmatch '@media \(max-width: 1050px\)' -or $cssContent -notmatch '@media \(max-width: 720px\)') {
  Write-Host "FAIL: missing responsive breakpoints"
  $errors++
}

if ($cssContent -notmatch 'prefers-reduced-motion') {
  Write-Host "FAIL: missing reduced-motion support"
  $errors++
}

$htmlFiles = @("$root/index.html") + (Get-ChildItem "$root/projects" -Filter "*.html" | ForEach-Object { $_.FullName })
foreach ($f in $htmlFiles) {
  $content = Get-Content $f -Raw
  if ($content -match '<link[^>]+rel="stylesheet"[^>]+href="https?://') {
    Write-Host "FAIL: external CDN stylesheet in $f"
    $errors++
  }
  if ($content -match 'src="https?://') {
    Write-Host "FAIL: external script/image in $f"
    $errors++
  }
}

$homeBytes = (Get-Item "$root/index.html").Length
if ($homeBytes -gt 262144) {
  Write-Host "FAIL: homepage exceeds 250KB ($homeBytes bytes)"
  $errors++
}

if ($errors -eq 0) { Write-Host "PASS: phase-4 gate" }
exit $errors
