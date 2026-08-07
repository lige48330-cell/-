param([string]$Workspace = ".")

$errors = 0
$arch = "$Workspace/ARCHITECTURE.md"

if (-not (Test-Path $arch)) {
  Write-Host "FAIL: ARCHITECTURE.md not found"
  exit 1
}

$content = Get-Content $arch -Raw

if ($content -notmatch '(?i)数据流|data flow|→|->|前端.*后端|proxy.*路由') {
  Write-Host "FAIL: no data flow diagram"
  $errors++
}

if ($content -notmatch '(?i)响应格式|code.*message.*data') {
  Write-Host "FAIL: no response format specification"
  $errors++
}

if ($content -notmatch '(?i)分页|page.*pageSize|pageSize') {
  Write-Host "FAIL: no pagination strategy"
  $errors++
}

if ($content -notmatch '(?i)防阻塞|连接池|超时|降级|骨架屏') {
  Write-Host "FAIL: no anti-blocking strategy"
  $errors++
}

if ($content -notmatch '(?i)组件|路由|middleware|中间件|层次') {
  Write-Host "FAIL: no component hierarchy"
  $errors++
}

if ($errors -eq 0) { Write-Host "PASS: phase-2 gate" }
exit $errors
