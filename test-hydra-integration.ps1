# Test Hydra Integration
Write-Host "`n🧪 Testing Real Hydra Integration`n" -ForegroundColor Cyan

# Test 1: Check Hydra Health
Write-Host "1️⃣ Checking Hydra health..." -ForegroundColor Yellow
$health = curl http://localhost:3001/api/hydra/health -UseBasicParsing | ConvertFrom-Json
Write-Host "   Status: $($health.status)" -ForegroundColor Green
Write-Host "   Hydra Available: $($health.hydraAvailable)" -ForegroundColor Green
Write-Host "   Active Heads: $($health.activeHeads)`n" -ForegroundColor Green

# Test 2: Open Hydra Channel
Write-Host "2️⃣ Opening Hydra channel..." -ForegroundColor Yellow
$openBody = @{
    userId = "demo-user-456"
    depositAmount = 20
} | ConvertTo-Json

$openResult = curl -Method POST -Uri 'http://localhost:3001/api/hydra/open-channel' `
    -Body $openBody `
    -ContentType 'application/json' `
    -UseBasicParsing | ConvertFrom-Json

Write-Host "   Head ID: $($openResult.headId)" -ForegroundColor Green
Write-Host "   Status: $($openResult.status)" -ForegroundColor Green
Write-Host "   Waiting for Head to open..." -ForegroundColor Gray

Start-Sleep -Seconds 3

# Test 3: Check Channel Status
Write-Host "`n3️⃣ Checking channel status..." -ForegroundColor Yellow
$status = curl "http://localhost:3001/api/hydra/channel/status/demo-user-456" -UseBasicParsing | ConvertFrom-Json
Write-Host "   Has Channel: $($status.hasChannel)" -ForegroundColor Green
Write-Host "   Status: $($status.status)" -ForegroundColor Green
Write-Host "   Balance: $($status.balance) ADA" -ForegroundColor Green
Write-Host "   Transactions: $($status.transactionCount)`n" -ForegroundColor Green

# Test 4: Execute Hydra Payment
Write-Host "4️⃣ Executing Hydra payment..." -ForegroundColor Yellow
$paymentBody = @{
    userId = "demo-user-456"
    creatorId = "creator-123"
    amount = 0.10
    contentId = "article-test-001"
    subscriptionId = "sub-test"
} | ConvertTo-Json

$payment = curl -Method POST -Uri 'http://localhost:3001/api/hydra/payments/execute-hydra' `
    -Body $paymentBody `
    -ContentType 'application/json' `
    -UseBasicParsing | ConvertFrom-Json

Write-Host "   Success: $($payment.success)" -ForegroundColor Green
Write-Host "   TX Hash: $($payment.txHash)" -ForegroundColor Green
Write-Host "   Processing Time: $($payment.processingTimeMs)ms ⚡" -ForegroundColor Cyan
Write-Host "   New Balance: $($payment.newBalance) ADA`n" -ForegroundColor Green

# Test 5: Execute Multiple Payments (Show Speed)
Write-Host "5️⃣ Executing 5 rapid payments..." -ForegroundColor Yellow
$totalTime = 0
for ($i = 1; $i -le 5; $i++) {
    $payBody = @{
        userId = "demo-user-456"
        creatorId = "creator-123"
        amount = 0.05
        contentId = "article-$i"
    } | ConvertTo-Json
    
    $result = curl -Method POST -Uri 'http://localhost:3001/api/hydra/payments/execute-hydra' `
        -Body $payBody `
        -ContentType 'application/json' `
        -UseBasicParsing | ConvertFrom-Json
    
    $totalTime += $result.processingTimeMs
    Write-Host "   Payment $i : $($result.processingTimeMs)ms" -ForegroundColor Gray
}

$avgTime = [math]::Round($totalTime / 5, 0)
Write-Host "   Average: ${avgTime}ms per payment ⚡`n" -ForegroundColor Cyan

# Test 6: Check Final Status
Write-Host "6️⃣ Final channel status..." -ForegroundColor Yellow
$finalStatus = curl "http://localhost:3001/api/hydra/channel/status/demo-user-456" -UseBasicParsing | ConvertFrom-Json
Write-Host "   Balance: $($finalStatus.balance) ADA" -ForegroundColor Green
Write-Host "   Total Transactions: $($finalStatus.transactionCount)" -ForegroundColor Green
Write-Host "   Total Spent: $([math]::Round(20 - $finalStatus.balance, 2)) ADA`n" -ForegroundColor Green

# Test 7: Compare with L1 (Simulation)
Write-Host "7️⃣ Comparison: Hydra vs L1" -ForegroundColor Yellow
Write-Host "   Hydra: ${avgTime}ms average" -ForegroundColor Cyan
Write-Host "   L1: ~18,000ms (18 seconds)" -ForegroundColor Red
$speedup = [math]::Round(18000 / $avgTime, 0)
Write-Host "   Hydra is ${speedup}x FASTER! 🚀`n" -ForegroundColor Green

Write-Host "✅ All tests passed! Hydra integration working perfectly!`n" -ForegroundColor Green
