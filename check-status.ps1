Write-Host "`nChecking Hydra Integration Status...`n" -ForegroundColor Cyan

# Check Hydra Node
Write-Host "1. Hydra Node (Docker)..." -ForegroundColor Yellow
try {
    $hydra = Invoke-RestMethod -Uri "http://localhost:4001/" -TimeoutSec 2
    Write-Host "   RUNNING - Status: $($hydra.status)" -ForegroundColor Green
} catch {
    Write-Host "   NOT RUNNING" -ForegroundColor Red
}

# Check Backend
Write-Host "`n2. Backend API..." -ForegroundColor Yellow
try {
    $backend = Invoke-RestMethod -Uri "http://localhost:3001/health" -TimeoutSec 2
    Write-Host "   RUNNING - Status: $($backend.status)" -ForegroundColor Green
} catch {
    Write-Host "   NOT RUNNING" -ForegroundColor Red
}

# Check Hydra Integration
Write-Host "`n3. Hydra Integration..." -ForegroundColor Yellow
try {
    $hydraHealth = Invoke-RestMethod -Uri "http://localhost:3001/api/hydra/health" -TimeoutSec 2
    Write-Host "   OPERATIONAL" -ForegroundColor Green
    Write-Host "   - Hydra Available: $($hydraHealth.hydraAvailable)" -ForegroundColor Gray
    Write-Host "   - Active Heads: $($hydraHealth.activeHeads)" -ForegroundColor Gray
    Write-Host "   - Open Heads: $($hydraHealth.openHeads)" -ForegroundColor Gray
} catch {
    Write-Host "   NOT AVAILABLE" -ForegroundColor Red
}

# Check Frontend
Write-Host "`n4. Frontend..." -ForegroundColor Yellow
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 2
    Write-Host "   RUNNING" -ForegroundColor Green
} catch {
    Write-Host "   NOT RUNNING" -ForegroundColor Red
}

Write-Host "`n=== URLs ===" -ForegroundColor Cyan
Write-Host "Hydra Node:   http://localhost:4001"
Write-Host "Backend API:  http://localhost:3001"
Write-Host "Frontend:     http://localhost:3000"
Write-Host "Hydra Health: http://localhost:3001/api/hydra/health"

Write-Host "`n=== Quick Tests ===" -ForegroundColor Cyan
Write-Host "Run simple test:  .\test-hydra-simple.ps1"
Write-Host "Run full test:    .\test-hydra-integration.ps1"
Write-Host "Open in browser:  http://localhost:3000/hydra`n"
