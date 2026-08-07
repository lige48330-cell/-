param([string]$ServerDir, [int]$Port = 8080, [string]$StartCommand = "node src/index.js")

$originalDir = Get-Location
Set-Location $ServerDir

$process = Start-Process -FilePath "node" -ArgumentList "src/index.js" -NoNewWindow -PassThru
Start-Sleep -Seconds 3

try {
  $response = Invoke-WebRequest -Uri "http://localhost:$Port/api/health" -TimeoutSec 5 -ErrorAction Stop
  if ($response.StatusCode -eq 200) {
    Write-Host "PASS: server health check OK (HTTP $($response.StatusCode))"
    exit 0
  } else {
    Write-Host "FAIL: server returned HTTP $($response.StatusCode)"
    exit 1
  }
} catch {
  Write-Host "FAIL: server health check failed 鈥?$_"
  exit 1
} finally {
  Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
  Set-Location $originalDir
}
