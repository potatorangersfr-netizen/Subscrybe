# Quick Hydra Integration Status Check
Write-Host "`n🔍 Checking Hydra Integration Status...`n" -ForegroundColor Cyan

# Check 1: Docker Hydra Node
Write-Host "1️⃣ Checking Hydra Node (Docker)..." -ForegroundColor Yellow
try {
    $hydraNode = curl http://localhost:4001/ -UseBasicParsing -TimeoutSec 2 | ConvertFrom-Json
    Write-Host "   ✅ Hydra Node: RUNNING" -ForegroundColor Green
    Write-Host "      Status: $($hydraNode.status)" -ForegroundColor Gray
    Write-Host "      Version: $($hydraNode.version)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Hydra Node: NOT RUNNING" -ForegroundColor Red
    Write-Host "      Start with: cd hydra-node ; docker-compose up -d" -ForegroundColor Gray
}

Write-Host ""

# Check 2: Backend API
Write-Host "2️⃣ Checking Backend API..." -ForegroundColor Yellow
try {
    $backend = curl http://localhost:3001/health -UseBasicParsing -TimeoutSec 2 | ConvertFrom-Json
    Write-Host "   ✅ Backend: RUNNING" -ForegroundColor Green
    Write-Host "      Status: $($backend.status)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Backend: NOT RUNNING" -ForegroundColor Red
    Write-Host "      Start with: cd backend ; node src/server.js" -ForegroundColor Gray
}

Write-Host ""

# Check 3: Hydra Integration
Write-Host "3️⃣ Checking Hydra Integration..." -ForegroundColor Yellow
try {
    $hydraHealth = curl http://localhost:3001/api/hydra/health -UseBasicParsing -TimeoutSec 2 | ConvertFrom-Json
    Write-Host "   ✅ Hydra Integration: OPERATIONAL" -ForegroundColor Green
    Write-Host "      Hydra Available: $($hydraHealth.hydraAvailable)" -ForegroundColor Gray
    Write-Host "      Active Heads: $($hydraHealth.activeHeads)" -ForegroundColor Gray
    Write-Host "      Open Heads: $($hydraHealth.openHeads)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Hydra Integration: NOT AVAILABLE" -ForegroundColor Red
}

Write-Host ""

# Check 4: Frontend
Write-Host "4️⃣ Checking Frontend..." -ForegroundColor Yellow
try {
    $frontend = curl http://localhost:3000 -UseBasicParsing -TimeoutSec 2
    if ($frontend.StatusCode -eq 200) {
        Write-Host "   ✅ Frontend: RUNNING" -ForegroundColor Green
        Write-Host "      URL: http://localhost:3000" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ❌ Frontend: NOT RUNNING" -ForegroundColor Red
    Write-Host "      Start with: npm run dev" -ForegroundColor Gray
}

Write-Host ""

# Summary
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "   • Hydra Node: http://localhost:4001" -ForegroundColor White
Write-Host "   • Backend API: http://localhost:3001" -ForegroundColor White
Write-Host "   • Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   • Hydra Health: http://localhost:3001/api/hydra/health" -ForegroundColor White

Write-Host "`n💡 Next Steps:" -ForegroundColor Cyan
Write-Host "   • Run full test: .\test-hydra-simple.ps1" -ForegroundColor White
Write-Host "   • Open browser: http://localhost:3000/hydra" -ForegroundColor White
Write-Host ""
