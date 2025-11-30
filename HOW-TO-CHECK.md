# 🔍 How to Check Hydra Integration

## Quick Status Check

Run this command to check all services:

```powershell
.\check-status.ps1
```

**Expected Output:**
```
✅ Hydra Node (Docker): RUNNING
✅ Backend API: RUNNING  
✅ Hydra Integration: OPERATIONAL
✅ Frontend: RUNNING
```

---

## Manual Checks

### 1. Check Hydra Node (Docker)

```powershell
# Check if container is running
docker ps

# Should show: hydra-mock-api

# Test API
curl http://localhost:4001/
```

**Expected Response:**
```json
{
  "name": "Hydra Mock API",
  "version": "1.0.0",
  "status": "running"
}
```

### 2. Check Backend API

```powershell
# Test health endpoint
curl http://localhost:3001/health | ConvertFrom-Json
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-30T..."
}
```

### 3. Check Hydra Integration

```powershell
# Test Hydra health
curl http://localhost:3001/api/hydra/health | ConvertFrom-Json
```

**Expected Response:**
```json
{
  "hydraAvailable": true,
  "activeHeads": 0,
  "openHeads": 0,
  "status": "operational"
}
```

### 4. Check Frontend

Open browser: **http://localhost:3000**

Should see the Subscrybe landing page.

---

## Functional Tests

### Test 1: Simple Hydra Test

```powershell
.\test-hydra-simple.ps1
```

**What it does:**
1. Opens a Hydra channel (10 ADA)
2. Executes a payment (0.10 ADA)
3. Shows processing time (~200ms)

**Expected Output:**
```
✅ Opening Hydra channel... SUCCESS
   Head ID: head_xxxxx
   Status: Open
   Balance: 10 ADA

✅ Executing Hydra payment... SUCCESS
   TX Hash: tx_xxxxx
   Processing Time: 246ms ⚡
   New Balance: 9.9 ADA
```

### Test 2: Comprehensive Test

```powershell
.\test-hydra-integration.ps1
```

**What it does:**
1. Checks Hydra health
2. Opens channel
3. Executes 5 rapid payments
4. Shows average processing time
5. Compares with L1 speed

---

## Browser Testing

### 1. Visit Hydra Demo Page

Open: **http://localhost:3000/hydra**

**What to check:**
- ✅ Page loads without errors
- ✅ "Run Comparison Demo" button visible
- ✅ Educational content displays
- ✅ Cost breakdown shows

### 2. Run Demo

Click **"Run Comparison Demo"**

**What should happen:**
- ✅ Hydra completes in ~200ms with confetti 🎉
- ✅ L1 takes ~18 seconds
- ✅ Metrics show 90x faster, 98% cheaper
- ✅ No console errors (F12)

---

## API Testing

### Open a Channel

```powershell
$body = @{
    userId = "test-user"
    depositAmount = 10
} | ConvertTo-Json

Invoke-RestMethod -Method POST `
    -Uri "http://localhost:3001/api/hydra/open-channel" `
    -Body $body `
    -ContentType "application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "headId": "head_xxxxx",
  "status": "initializing",
  "estimatedTime": 2
}
```

### Check Channel Status

```powershell
Invoke-RestMethod -Uri "http://localhost:3001/api/hydra/channel/status/test-user"
```

**Expected Response:**
```json
{
  "hasChannel": true,
  "headId": "head_xxxxx",
  "status": "open",
  "balance": 10,
  "transactionCount": 0
}
```

### Execute Payment

```powershell
$payment = @{
    userId = "test-user"
    creatorId = "creator-1"
    amount = 0.10
    contentId = "article-1"
} | ConvertTo-Json

Invoke-RestMethod -Method POST `
    -Uri "http://localhost:3001/api/hydra/payments/execute-hydra" `
    -Body $payment `
    -ContentType "application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "payment": {
    "id": "...",
    "amount": 0.10,
    "status": "success"
  },
  "processingTimeMs": 246,
  "newBalance": 9.9
}
```

---

## Troubleshooting

### Hydra Node Not Running

```powershell
cd hydra-node
docker-compose up -d
```

Check logs:
```powershell
docker logs hydra-mock-api
```

### Backend Not Running

```powershell
cd backend
node src/server.js
```

### Port Already in Use

```powershell
# Find process on port 3001
netstat -ano | Select-String ":3001"

# Kill process (replace PID)
Stop-Process -Id <PID> -Force

# Restart backend
cd backend
node src/server.js
```

### Frontend Not Running

```powershell
npm run dev
```

---

## Performance Benchmarks

### Expected Performance

| Metric | Hydra | L1 | Improvement |
|--------|-------|----|-----------| 
| Processing Time | 150-250ms | 18,000ms | 72-120x faster |
| Transaction Fee | 0.002 ADA | 0.17 ADA | 98% cheaper |
| Confirmations | Instant | 20 seconds | Immediate |

### How to Measure

Run the test script and check the output:

```powershell
.\test-hydra-simple.ps1
```

Look for:
- **Processing Time**: Should be < 300ms
- **Balance Updates**: Should be instant
- **TX Hash**: Should be returned immediately

---

## Logs and Debugging

### View Hydra Node Logs

```powershell
docker logs hydra-mock-api -f
```

### View Backend Logs

Backend logs appear in the terminal where you ran `node src/server.js`

Look for:
- `🌊 Opening Hydra channel...`
- `💸 Processing Hydra payment...`
- `✅ Payment successful in Xms`

### View Frontend Logs

Open browser DevTools (F12) → Console tab

Should see no errors when:
- Loading pages
- Running Hydra demo
- Executing payments

---

## Success Criteria

Your integration is working correctly if:

✅ **All services running**
- Hydra node responds on port 4001
- Backend responds on port 3001
- Frontend loads on port 3000

✅ **Hydra operations work**
- Can open channels
- Can execute payments
- Processing time < 1 second
- Balance updates correctly

✅ **Demo works**
- Hydra demo page loads
- Comparison demo runs
- Confetti appears
- Metrics display

✅ **No errors**
- No console errors
- No backend errors
- No Docker errors

---

## Quick Reference

### Service URLs
- **Hydra Node**: http://localhost:4001
- **Backend API**: http://localhost:3001
- **Frontend**: http://localhost:3000
- **Hydra Health**: http://localhost:3001/api/hydra/health
- **Hydra Demo**: http://localhost:3000/hydra

### Test Scripts
- **Status Check**: `.\check-status.ps1`
- **Simple Test**: `.\test-hydra-simple.ps1`
- **Full Test**: `.\test-hydra-integration.ps1`

### Start Services
```powershell
# Hydra Node
cd hydra-node
docker-compose up -d

# Backend
cd backend
node src/server.js

# Frontend
npm run dev
```

### Stop Services
```powershell
# Hydra Node
cd hydra-node
docker-compose down

# Backend & Frontend
# Press Ctrl+C in their terminals
```

---

**Need Help?** Check the logs first, then review the troubleshooting section above.
