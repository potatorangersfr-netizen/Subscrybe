# Subscrybe Backend API

Real backend API for Subscrybe subscription management platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your database URL
# DATABASE_URL=postgresql://username:password@localhost:5432/subscrybe

# Create database
createdb subscrybe

# Run schema
psql subscrybe < src/db/schema.sql

# Start server
npm run dev
```

Server runs on http://localhost:3001

## 📡 API Endpoints

### Authentication
- `POST /api/auth/connect-wallet` - Connect wallet and create/get user

### Users
- `GET /api/users/me` - Get current user
- `GET /api/users/me/subscriptions` - Get user's subscriptions

### Subscriptions
- `GET /api/subscriptions` - Get all available plans
- `POST /api/subscriptions/subscribe` - Subscribe to a plan
- `DELETE /api/subscriptions/:id/cancel` - Cancel subscription

### Payments
- `POST /api/payments/execute` - Execute standard L1 payment
- `POST /api/payments/execute-hydra` - Execute Hydra payment (simulation)
- `GET /api/payments/history` - Get payment history

### Privacy
- `GET /api/privacy/my-data` - Export user data
- `DELETE /api/privacy/delete-account` - Delete account

### Merchants
- `GET /api/merchants/dashboard` - Get merchant dashboard data

## 🔑 Authentication

All requests (except `/auth/connect-wallet`) require:
```
Headers:
  x-wallet-address: addr1qxy...
```

## 📦 Response Format

Success:
```json
{
  "success": true,
  "data": { ... }
}
```

Error:
```json
{
  "success": false,
  "error": "Error message"
}
```

## 🗄️ Database Schema

- `users` - User accounts
- `merchants` - Service providers
- `subscription_plans` - Available plans
- `subscriptions` - User subscriptions
- `payments` - Payment history

## 🚀 Deployment

### Render.com (Recommended)

1. Create new Web Service
2. Connect GitHub repo
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables:
   - `DATABASE_URL` (from Supabase)
   - `NODE_ENV=production`

### Supabase Database

1. Create project at supabase.com
2. Go to Database → SQL Editor
3. Run `schema.sql`
4. Copy connection string
5. Add to Render environment variables

## 🧪 Testing

```bash
# Test health endpoint
curl http://localhost:3001/health

# Test connect wallet
curl -X POST http://localhost:3001/api/auth/connect-wallet \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"addr1test123"}'

# Test get subscriptions
curl http://localhost:3001/api/users/me/subscriptions \
  -H "x-wallet-address: addr1test123"
```

## 📝 Notes

- Hydra payments are simulated (<200ms response)
- L1 payments simulate 1-2 second processing
- Sample data is seeded automatically
- All payments marked with `is_hydra_simulation` flag
