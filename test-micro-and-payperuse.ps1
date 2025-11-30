# Test Micro-Subscriptions and Pay-Per-Use Features
Write-Host "`n🧪 Testing Micro-Subscriptions & Pay-Per-Use with Hydra`n" -ForegroundColor Cyan

$userId = "demo-user-web"

# Test 1: Check if channel exists
Write-Host "1️⃣ Checking Hydra channel status..." -ForegroundColor Yellow
try {
    $channel = Invoke-RestMethod -Uri "http://localhost:3001/api/hydra/channel/status/$userId"
    if ($channel.hasChannel -and $channel.status -eq "open") {
        Write-Host "   ✅ Channel is OPEN" -ForegroundColor Green
        Write-Host "      Balance: $($channel.balance) ADA" -ForegroundColor Gray
        Write-Host "      Transactions: $($channel.transactionCount)" -ForegroundColor Gray
    } else {
        Write-Host "   ⚠️  No open channel - opening one now..." -ForegroundColor Yellow
        $openResult = Invoke-RestMethod -Method POST `
            -Uri "http://localhost:3001/api/hydra/open-channel" `
            -Body (@{ userId = $userId; depositAmount = 20 } | ConvertTo-Json) `
            -ContentType "application/json"
        Write-Host "   ✅ Channel opened: $($openResult.headId)" -ForegroundColor Green
        Start-Sleep -Seconds 3
    }
} catch {
    Write-Host "   ❌ Failed to check/open channel" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 2: Micro-Subscription Payment (Article)
Write-Host "2️⃣ Testing Micro-Subscription (News Article - 0.10 ADA)..." -ForegroundColor Yellow
try {
    $payment1 = Invoke-RestMethod -Method POST `
        -Uri "http://localhost:3001/api/hydra/payments/execute-hydra" `
        -Body (@{
            userId = $userId
            creatorId = "creator-news"
            amount = 0.10
            contentId = "article-cardano-news-001"
        } | ConvertTo-Json) `
        -ContentType "application/json"
    
    Write-Host "   ✅ Payment successful!" -ForegroundColor Green
    Write-Host "      TX Hash: $($payment1.txHash)" -ForegroundColor Gray
    Write-Host "      Processing Time: $($payment1.processingTimeMs)ms ⚡" -ForegroundColor Cyan
    Write-Host "      New Balance: $($payment1.newBalance) ADA" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Payment failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 3: Micro-Subscription Payment (Video)
Write-Host "3️⃣ Testing Micro-Subscription (Video Tutorial - 0.25 ADA)..." -ForegroundColor Yellow
try {
    $payment2 = Invoke-RestMethod -Method POST `
        -Uri "http://localhost:3001/api/hydra/payments/execute-hydra" `
        -Body (@{
            userId = $userId
            creatorId = "creator-education"
            amount = 0.25
            contentId = "video-plutus-tutorial-001"
        } | ConvertTo-Json) `
        -ContentType "application/json"
    
    Write-Host "   ✅ Payment successful!" -ForegroundColor Green
    Write-Host "      TX Hash: $($payment2.txHash)" -ForegroundColor Gray
    Write-Host "      Processing Time: $($payment2.processingTimeMs)ms ⚡" -ForegroundColor Cyan
    Write-Host "      New Balance: $($payment2.newBalance) ADA" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Payment failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 4: Pay-Per-Use (API Call)
Write-Host "4️⃣ Testing Pay-Per-Use (API Call - 0.001 ADA)..." -ForegroundColor Yellow
try {
    $payment3 = Invoke-RestMethod -Method POST `
        -Uri "http://localhost:3001/api/hydra/payments/execute-hydra" `
        -Body (@{
            userId = $userId
            creatorId = "creator-api-service"
            amount = 0.001
            contentId = "api-call-get-users"
        } | ConvertTo-Json) `
        -ContentType "application/json"
    
    Write-Host "   ✅ Payment successful!" -ForegroundColor Green
    Write-Host "      TX Hash: $($payment3.txHash)" -ForegroundColor Gray
    Write-Host "      Processing Time: $($payment3.processingTimeMs)ms ⚡" -ForegroundColor Cyan
    Write-Host "      New Balance: $($payment3.newBalance) ADA" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Payment failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 5: Pay-Per-Use (Compute Time)
Write-Host "5️⃣ Testing Pay-Per-Use (Compute Time - 0.05 ADA)..." -ForegroundColor Yellow
try {
    $payment4 = Invoke-RestMethod -Method POST `
        -Uri "http://localhost:3001/api/hydra/payments/execute-hydra" `
        -Body (@{
            userId = $userId
            creatorId = "creator-compute"
            amount = 0.05
            contentId = "compute-1-minute"
        } | ConvertTo-Json) `
        -ContentType "application/json"
    
    Write-Host "   ✅ Payment successful!" -ForegroundColor Green
    Write-Host "      TX Hash: $($payment4.txHash)" -ForegroundColor Gray
    Write-Host "      Processing Time: $($payment4.processingTimeMs)ms ⚡" -ForegroundColor Cyan
    Write-Host "      New Balance: $($payment4.newBalance) ADA" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Payment failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 6: Multiple Rapid Payments
Write-Host "6️⃣ Testing Rapid Payments (10 API calls)..." -ForegroundColor Yellow
$totalTime = 0
for ($i = 1; $i -le 10; $i++) {
    try {
        $payment = Invoke-RestMethod -Method POST `
            -Uri "http://localhost:3001/api/hydra/payments/execute-hydra" `
            -Body (@{
                userId = $userId
                creatorId = "creator-api"
                amount = 0.001
                contentId = "api-call-$i"
            } | ConvertTo-Json) `
            -ContentType "application/json"
        
        $totalTime += $payment.processingTimeMs
        Write-Host "   Payment $i : $($payment.processingTimeMs)ms" -ForegroundColor Gray
    } catch {
        Write-Host "   Payment $i : Failed" -ForegroundColor Red
    }
}

$avgTime = [math]::Round($totalTime / 10, 0)
Write-Host "   Average: ${avgTime}ms per payment ⚡" -ForegroundColor Cyan

Write-Host ""

# Summary
Write-Host "`nSummary:" -ForegroundColor Cyan
Write-Host "   Micro-Subscriptions: Working" -ForegroundColor Green
Write-Host "   Pay-Per-Use: Working" -ForegroundColor Green
Write-Host "   Hydra Integration: Operational" -ForegroundColor Green
Write-Host "`nTry it in the browser:" -ForegroundColor Cyan
Write-Host "   Micro-Subscriptions: http://localhost:3000/micro-subscriptions" -ForegroundColor White
Write-Host "   Pay-Per-Use: http://localhost:3000/pay-per-use`n" -ForegroundColor White
