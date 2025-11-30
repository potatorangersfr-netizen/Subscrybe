# Quick Demo Test Script
Write-Host "🧪 Testing Subscrybe Demo..." -ForegroundColor Cyan
Write-Host ""

# Test backend
Write-Host "Testing Backend API..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/subscriptions" -Method Get
    Write-Host "✅ Backend API responding" -ForegroundColor Green
    Write-Host "   Found $($response.data.Count) subscriptions" -ForegroundColor Gray
} catch {
    Write-Host "❌ Backend API failed" -ForegroundColor Red
    Write-Host "   Make sure backend is running on port 3001" -ForegroundColor Gray
}

Write-Host ""

# Test frontend pages
$pages = @(
    @{path="/"; name="Landing Page"},
    @{path="/dashboard"; name="Dashboard"},
    @{path="/subscriptions"; name="Subscriptions"},
    @{path="/hydra"; name="Hydra Demo"},
    @{path="/calendar"; name="Calendar"},
    @{path="/privacy"; name="Privacy"},
    @{path="/merchant"; name="Merchant Portal"},
    @{path="/contracts"; name="Smart Contracts"}
)

Write-Host "Testing Frontend Pages..." -ForegroundColor Yellow
foreach ($page in $pages) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000$($page.path)" -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $($page.name)" -ForegroundColor Green
        }
    } catch {
        Write-Host "❌ $($page.name)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host "2. Navigate to /hydra and run the comparison demo" -ForegroundColor White
Write-Host "3. Try the Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A" -ForegroundColor White
Write-Host "4. Check TEST-CHECKLIST.md for full testing guide" -ForegroundColor White
Write-Host ""
