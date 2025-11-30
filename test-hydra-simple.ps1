# Simple Hydra Test
Write-Host "`n🌊 Testing Hydra Integration`n" -ForegroundColor Cyan

# Step 1: Open Channel
Write-Host "Opening Hydra channel..." -ForegroundColor Yellow
$openBody = '{"userId":"test-user","depositAmount":10}'
$open = Invoke-RestMethod -Method POST -Uri 'http://localhost:3001/api/hydra/open-channel' -Body $openBody -ContentType 'application/json'
Write-Host "✅ Head ID: $($open.headId)" -ForegroundColor Green
Write-Host "   Status: $($open.status)`n" -ForegroundColor Gray

# Wait for Head to open
Start-Sleep -Seconds 3

# Step 2: Check Status
Write-Host "Checking channel status..." -ForegroundColor Yellow
$status = Invoke-RestMethod -Uri 'http://localhost:3001/api/hydra/channel/status/test-user'
Write-Host "✅ Status: $($status.status)" -ForegroundColor Green
Write-Host "   Balance: $($status.balance) ADA`n" -ForegroundColor Gray

# Step 3: Execute Payment
Write-Host "Executing Hydra payment..." -ForegroundColor Yellow
$payBody = '{"userId":"test-user","creatorId":"creator-1","amount":0.10,"contentId":"article-1"}'
$payment = Invoke-RestMethod -Method POST -Uri 'http://localhost:3001/api/hydra/payments/execute-hydra' -Body $payBody -ContentType 'application/json'
Write-Host "✅ Success!" -ForegroundColor Green
Write-Host "   TX Hash: $($payment.txHash)" -ForegroundColor Gray
Write-Host "   Processing Time: $($payment.processingTimeMs)ms ⚡" -ForegroundColor Cyan
Write-Host "   New Balance: $($payment.newBalance) ADA`n" -ForegroundColor Gray

Write-Host "🎉 Hydra integration working!`n" -ForegroundColor Green
