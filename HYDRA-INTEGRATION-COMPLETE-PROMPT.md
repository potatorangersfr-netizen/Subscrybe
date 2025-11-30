# 🚀 COMPLETE HYDRA INTEGRATION PROMPT FOR SUBSCRYBE

You are building SUBSCRYBE - a micro-subscription and pay-per-use billing platform on Cardano that requires Hydra for economic viability.

## PROJECT OVERVIEW

SUBSCRYBE enables:
1. **Micro-subscriptions**: Pay $0.10 per article, $0.50 per week, $0.25 per video
2. **Pay-per-use billing**: $0.001 per API call, $0.05 per minute, $0.02 per GB
3. **Hybrid models**: Combine both approaches

Without Hydra, these micro-payments are impossible due to L1 fees (0.17 ADA ≈ $0.10 = 100% overhead).
With Hydra, fees reduce by 100x, making micro-payments economically viable (2% overhead instead of 170%).

## CORE REQUIREMENT

Build a complete, working integration where:
- Hydra node runs in Docker container
- Backend API communicates with Hydra via REST/WebSocket
- Frontend shows instant payments (<1 second) vs L1 (20+ seconds)
- Users deposit funds → Open Hydra Head → Make unlimited micro-payments → Close Head
- Creators receive batched payments with minimal L1 fees

## TECHNICAL STACK

**Backend:**
- Node.js + Express
- PostgreSQL database
- Docker for Hydra node
- Blockfrost API for Cardano L1 interactions

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- @meshsdk/react for wallet connection

**Hydra:**
- Official Hydra node (latest stable version)
- Docker container with exposed API
- WebSocket for real-time updates

## YOUR TASK

Create a complete, production-ready implementation with these components:

---

## PART 1: DOCKER HYDRA NODE SETUP

### 1.1 Dockerfile for Hydra Node
Create a Dockerfile that:
- Uses official Hydra image or builds from source
- Exposes necessary ports (API: 4001, WebSocket: 4002)
- Configures for Cardano Preview/Preprod testnet
- Sets up persistent volume for Head state
- Includes health checks

### 1.2 Docker Compose Configuration
Create docker-compose.yml with:
- Hydra node service
- PostgreSQL database service
- Redis cache service
- Network configuration for inter-service communication
- Environment variables for Cardano network, API keys

### 1.3 Hydra Node Configuration
Provide hydra-node.config with:
- Cardano network selection (preview/preprod)
- Peer discovery settings
- API server configuration
- Logging settings
- Initial funds configuration

### 1.4 Startup Scripts
Create initialization scripts that:
- Generate Hydra keys if not exists
- Connect to Cardano node (via Blockfrost or local)
- Wait for Cardano sync
- Start Hydra API server
- Perform health check

**Deliverable:** Complete Docker setup that can be started with `docker-compose up` and exposes working Hydra API at `http://localhost:4001`

---

## PART 2: BACKEND API INTEGRATION

### 2.1 Database Schema
Create PostgreSQL tables:

**users** table:
- id, wallet_address, hydra_head_id, channel_balance, channel_status, created_at

**creators** table:
- id, wallet_address, handle, verified, total_revenue, subscriber_count, hydra_head_id

**plans** table:
- id, creator_id, plan_type (micro_sub/pay_per_use/recurring), name, price_per_unit, unit_definition

**subscriptions** table:
- id, user_id, plan_id, status, started_at, payments_count, total_spent, spending_limit_monthly

**payments** table:
- id, subscription_id, user_id, creator_id, amount, status, content_id, hydra_tx_hash, processing_time_ms, executed_at

**hydra_heads** table:
- id, head_id, owner_id, owner_type, status, initial_balance, current_balance, transaction_count, opened_at, closed_at

### 2.2 Hydra Client Service
Create `/services/hydra-client.js` that wraps Hydra API calls:

**Functions needed:**
- `initializeHead(ownerWallet, initialDeposit)` - POST to /init
- `commitFunds(headId, utxos)` - POST to /commit
- `submitTransaction(headId, tx)` - POST to /transaction
- `getHeadStatus(headId)` - GET to /head/{id}
- `closeHead(headId)` - POST to /close
- `subscribeToHeadUpdates(headId, callback)` - WebSocket subscription

**Error handling:**
- Retry logic for network failures
- Timeout handling (30s max)
- Fallback to L1 if Hydra unavailable
- Detailed error logging

### 2.3 User Channel Management API
Create `/routes/hydra-channels.js` with endpoints:

**POST /api/hydra/open-channel**
- Accepts: { depositAmount: number (ADA) }
- Steps:
  1. Validate user has sufficient wallet balance
  2. Create L1 transaction to deposit funds
  3. Call hydraClient.initializeHead()
  4. Store head_id in database
  5. Return: { headId, status: "initializing", estimatedTime: 30 }

**GET /api/hydra/channel/status**
- Returns current Hydra Head state
- Polls Hydra API for latest status
- Returns: { headId, status, balance, transactionCount }

**POST /api/hydra/close-channel**
- Accepts: { withdrawAll: boolean, amount?: number }
- Steps:
  1. Cancel all active subscriptions
  2. Call hydraClient.closeHead()
  3. Wait for L1 settlement
  4. Update database
  5. Return: { txHash, withdrawnAmount, l1Fee }

### 2.4 Payment Execution API
Create `/routes/payments.js` with:

**POST /api/payments/execute-hydra**
- Accepts: { subscriptionId, contentId }
- Process:
  1. Fetch subscription and plan details
  2. Check spending limits
  3. Verify Hydra Head is open
  4. Build payment transaction
  5. Submit via hydraClient.submitTransaction()
  6. Record payment in database (processing_time_ms < 1000)
  7. Return instant confirmation

**POST /api/payments/execute-standard** (L1 fallback)
- Same as above but uses Blockfrost
- Takes ~20 seconds
- Higher fees

**Comparison logic:**
- If user has open Hydra Head → use Hydra
- If Hydra unavailable → fallback to L1
- Always track which method was used for analytics

### 2.5 Subscription Management API
Create `/routes/subscriptions.js`:

**POST /api/subscriptions/subscribe**
- Accepts: { planId, spendingLimitMonthly }
- Creates subscription record
- No immediate payment (pay-as-you-consume model)

**POST /api/content/:contentId/unlock**
- Accepts: { contentId }
- Process:
  1. Find active subscription for this plan
  2. Check spending limits
  3. Execute payment via Hydra
  4. Grant access
  5. Return: { accessGranted: true, paymentId, processingTime }

**DELETE /api/subscriptions/:id/cancel**
- Immediately prevents future payments
- No L1 transaction needed (just database update)

### 2.6 Creator Settlement API
Create `/routes/creators.js`:

**POST /api/creators/withdraw**
- Accepts: { amount: "all" | number }
- Process:
  1. Close creator's Hydra Head
  2. Settle accumulated revenue on L1
  3. Deduct 2% platform fee
  4. Send funds to creator wallet
  5. Reopen Head for continued operation

**GET /api/creators/me/dashboard**
- Returns aggregated analytics
- Shows pending revenue in Hydra Head
- Displays transaction count, subscriber count

---

## PART 3: FRONTEND APPLICATION

### 3.1 User Flow Components

**OpenChannelModal.tsx**
- Form to deposit funds
- Shows cost comparison (Hydra vs L1)
- Displays: "Open channel: 0.17 ADA one-time fee, then unlimited micro-payments"
- Progress indicator during Head initialization
- Success message with channel balance

**HydraChannelStatus.tsx**
- Badge showing "Channel Open ✅" or "Channel Closed"
- Current balance display
- Transaction count this month
- Button to close channel

**SubscriptionCard.tsx**
- Shows plan details (price per unit)
- Current spending this month
- "Powered by Hydra ⚡" badge
- Instant cancel button

**ContentPaywall.tsx**
- Shows content preview
- Price display: "$0.10 per article"
- "Unlock" button
- On click:
  - Instant payment (no wallet popup!)
  - Content reveals immediately
  - Toast: "✅ Unlocked in 0.3 seconds ⚡"
  - Balance updates in real-time

### 3.2 Creator Flow Components

**CreatorDashboard.tsx**
- Revenue chart (last 30 days)
- Hydra Head balance (pending settlement)
- Subscriber count
- "Withdraw" button

**WithdrawModal.tsx**
- Shows available balance
- L1 settlement fee warning
- "Withdraw All" or partial amount
- Progress during settlement
- Success confirmation

### 3.3 Comparison Visualizations

**SpeedComparison.tsx**
- Side-by-side animation:
  - Left: "L1 Payment" with 20-second loading bar
  - Right: "Hydra Payment ⚡" with instant (<1s) completion
- Show actual processing times from database

**CostComparison.tsx**
- Table showing:
  - 1 payment: L1 = $0.17, Hydra = $0.0001
  - 10 payments: L1 = $1.70, Hydra = $0.20
  - 100 payments: L1 = $17.00, Hydra = $0.20
- Highlight savings percentage

### 3.4 Core Pages

**app/dashboard/page.tsx**
- Spending overview cards
- Hydra channel status
- Recent payments list
- Active subscriptions

**app/marketplace/page.tsx**
- Browse plans grid
- Filter by category
- Each plan shows: price, creator, subscriber count
- "Subscribe" button

**app/subscriptions/page.tsx**
- List all active subscriptions
- Spending this month per subscription
- Quick cancel buttons
- Total spend analytics

---

## PART 4: HYDRA-SPECIFIC LOGIC

### 4.1 Head Lifecycle Management

**Opening Flow:**
1. User clicks "Deposit Funds"
2. Frontend: POST /api/hydra/open-channel { depositAmount: 10 }
3. Backend:
   - Create L1 deposit tx via Blockfrost
   - Call Hydra API: POST /init { parties: [userWallet], initialFunds: 10 ADA }
   - Store head_id in database
   - Return: { headId, status: "initializing" }
4. Frontend: Poll /api/hydra/channel/status every 5s
5. Hydra confirms Head open (takes ~30s)
6. Frontend: Show success message

**Payment Flow:**
1. User clicks "Unlock Article"
2. Frontend: POST /api/content/article-123/unlock
3. Backend:
   - Find user's subscription to this creator
   - Verify Head is open
   - Build Hydra transaction: { from: userHead, to: creatorHead, amount: 0.10 ADA }
   - Submit to Hydra: POST /transaction
   - Hydra confirms in <500ms
   - Save payment record with hydra_tx_hash, processing_time_ms
4. Frontend: Instant success response
5. Content unlocks immediately

**Closing Flow:**
1. User clicks "Withdraw Balance"
2. Frontend: POST /api/hydra/close-channel
3. Backend:
   - Call Hydra API: POST /close { headId }
   - Hydra initiates close (L1 transaction)
   - Wait for L1 confirmation (~20s)
   - Funds return to user's wallet
   - Update database: status = "closed"
4. Frontend: Show success with final balance

### 4.2 Error Handling

**If Hydra Head fails to open:**
- Retry up to 3 times
- If still fails, refund deposit and show error
- Suggest trying again later

**If Hydra payment fails:**
- Immediately fallback to L1 payment
- Log the fallback for monitoring
- User experience: slightly slower but still works

**If Hydra becomes unavailable:**
- All new payments route to L1
- Existing open Heads can still settle
- Dashboard shows warning banner

### 4.3 Multi-Party Head Strategy

**For User-to-Creator Payments:**

Option A: Separate Heads (Simpler)
- Each user has their own Head with platform
- Each creator has their own Head with platform
- Payments go: User Head → Platform → Creator Head
- Platform acts as intermediary

Option B: Direct Heads (More Complex)
- Open Head between User ↔ Creator directly
- Requires both parties online simultaneously
- Better privacy, no platform intermediary
- Harder to coordinate

**Recommendation:** Start with Option A for hackathon

### 4.4 Settlement Strategy

**User Heads:**
- Close on demand (user chooses when)
- Or auto-close after 30 days of inactivity
- Remaining balance returns to wallet

**Creator Heads:**
- Auto-settle monthly (configurable)
- Or manual withdrawal anytime
- Platform deducts 2% fee during settlement

---

## PART 5: TESTING & DEMONSTRATION

### 5.1 Test Scenarios

**Scenario 1: New User Journey**
1. Connect wallet (Nami, testnet)
2. Deposit 10 ADA to open Hydra Head
3. Subscribe to 3 micro-subscription plans
4. Unlock 10 pieces of content
5. View dashboard showing instant payments
6. Close channel and withdraw remaining balance

**Expected Results:**
- Head opens in ~30 seconds
- Each payment completes in <1 second
- Total fees: 0.34 ADA (open + close)
- Without Hydra: 1.7 ADA fees (10 payments × 0.17)
- Savings: 80%

**Scenario 2: Creator Revenue**
1. Register as creator
2. Create "Daily News" plan at $0.10/article
3. 5 users subscribe
4. Users unlock 20 articles total
5. Creator sees $2 pending in Hydra Head
6. Creator withdraws revenue
7. Receives $1.96 (after 2% platform fee)

**Scenario 3: High-Frequency Micro-Payments**
1. User subscribes to API service ($0.001 per call)
2. Makes 1000 API calls in 1 hour
3. All payments process via Hydra
4. Total cost: $1 + $0.20 fees (2%)
5. On L1: Would cost $170 in fees (impossible)

### 5.2 Demo Script

**For Judges (5 minutes):**

**[0:00-0:30] The Problem**
- Show calculator: $0.10 article + $0.17 L1 fee = Broken
- "This is why micro-payments don't exist on blockchain today"

**[0:30-1:30] Open Hydra Head**
- Connect wallet
- Deposit $10
- Show progress: "Opening Hydra Head..."
- Success: "Channel open! You can now make unlimited micro-payments"

**[1:30-3:00] Instant Payments Demo**
- Click 5 articles rapidly
- Each unlocks in <1 second
- Show payment notifications: "Paid $0.10 in 0.3s ⚡"
- Balance updates in real-time
- Compare: "On L1, this would take 100 seconds and cost $0.85 in fees"

**[3:00-4:00] Analytics**
- Show dashboard
- "You've made 5 payments, spent $0.50, fees: $0.20 total (4%)"
- "On L1: Same activity = $0.85 fees (170% overhead)"
- Chart showing Hydra vs L1 cost comparison

**[4:00-4:30] Close Channel**
- Click "Withdraw"
- Show: "Closing Head, settling on L1..."
- Success: "9.50 ADA returned to wallet"
- Total fees for entire session: $0.20

**[4:30-5:00] Why This Matters**
- "We've made micro-subscriptions economically viable"
- "Without Hydra: Impossible due to fees"
- "With Hydra: 100x cost reduction"
- "This unlocks entirely new business models on Cardano"

---

## PART 6: DEPLOYMENT & MONITORING

### 6.1 Production Deployment

**Hydra Node:**
- Deploy Docker container on AWS ECS / Railway / Render
- Persistent volume for Head state
- Auto-restart on failure
- Health check endpoint

**Backend:**
- Deploy on Railway / Heroku / AWS
- Environment variables: HYDRA_API_URL, DATABASE_URL, BLOCKFROST_KEY
- Connection pool to Hydra node
- Rate limiting (1000 req/min per user)

**Frontend:**
- Deploy on Vercel
- Environment variables: NEXT_PUBLIC_API_URL
- CDN for static assets
- Analytics integration

### 6.2 Monitoring

**Key Metrics:**
- Hydra Head open success rate
- Average payment processing time (target: <500ms)
- Hydra vs L1 fallback ratio
- Cost savings per user
- Head close success rate

**Alerts:**
- Hydra node unavailable > 5 minutes
- Payment success rate < 95%
- Head open failures > 10%

### 6.3 Logging

**Log every:**
- Hydra Head open/close
- Payment execution (with processing time)
- Fallback to L1 events
- Errors with Hydra API

---

## DELIVERABLES CHECKLIST

### Infrastructure:
- [ ] Dockerfile for Hydra node
- [ ] docker-compose.yml
- [ ] Hydra configuration files
- [ ] Database initialization scripts

### Backend:
- [ ] Hydra client service
- [ ] Channel management API (open, close, status)
- [ ] Payment execution API (Hydra + L1 fallback)
- [ ] Subscription management API
- [ ] Creator withdrawal API
- [ ] Complete database schema

### Frontend:
- [ ] Open channel modal
- [ ] Channel status indicator
- [ ] Content paywall with instant unlock
- [ ] Subscription management UI
- [ ] Payment history with processing times
- [ ] Creator dashboard with settlement
- [ ] Cost comparison visualizations

### Testing:
- [ ] End-to-end test suite
- [ ] Demo script documented
- [ ] Test accounts on Cardano testnet
- [ ] Sample content for demonstration

### Documentation:
- [ ] README with setup instructions
- [ ] API documentation
- [ ] Hydra integration guide
- [ ] Demo video recording
- [ ] Pitch deck explaining Hydra necessity

---

## SUCCESS CRITERIA

Your implementation must demonstrate:

1. **Hydra Head Lifecycle:** Successfully open, use, and close Heads
2. **Instant Payments:** Process payments in <1 second via Hydra
3. **Cost Comparison:** Show 50x+ fee reduction vs L1
4. **Fallback Resilience:** Gracefully handle Hydra unavailability
5. **User Experience:** Seamless, no blockchain complexity visible
6. **Creator Value:** Easy revenue withdrawal with batch settlement
7. **Scale Demonstration:** Handle 100+ micro-payments in single Head

## CRITICAL REQUIREMENTS

- Hydra node must be running and accessible
- All payments must actually go through Hydra (not simulated)
- Must show real processing times (<1s)
- Must compare against real L1 transactions (20s)
- Database must track Hydra-specific data (head_id, hydra_tx_hash)
- Frontend must clearly indicate when Hydra is being used

---

## OUTPUT FORMAT

Provide complete, runnable code for:
1. All Docker configuration files
2. Complete backend with all API endpoints
3. Complete frontend with all user flows
4. Database schema SQL
5. README with step-by-step setup
6. .env.example with all required variables

Make it production-ready, well-commented, and fully functional. The goal is to run `docker-compose up && npm run dev` and have a working Hydra-powered micro-subscription platform.
