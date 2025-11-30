# Backend Deployment Guide 🚀

Complete guide to deploy Subscrybe backend to production.

## Option 1: Render.com + Supabase (FREE, RECOMMENDED)

### Step 1: Set Up Database (Supabase)

1. Go to https://supabase.com
2. Click "New Project"
3. Fill in:
   - Name: `subscrybe`
   - Database Password: (generate strong password)
   - Region: Choose closest to you
4. Wait for project to be created (~2 minutes)
5. Go to **Database** → **SQL Editor**
6. Click "New Query"
7. Copy entire contents of `backend/src/db/schema.sql`
8. Paste and click "Run"
9. Verify tables created: Go to **Table Editor**
10. Copy connection string:
    - Go to **Settings** → **Database**
    - Find "Connection string" → "URI"
    - Copy the full string (starts with `postgresql://`)
    - Save it securely!

### Step 2: Deploy Backend (Render.com)

1. Go to https://render.com
2. Sign up/login with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `subscrybe-backend`
   - **Region**: Same as Supabase
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
6. Add Environment Variables:
   - Click "Advanced"
   - Add:
     ```
     DATABASE_URL = [paste Supabase connection string]
     NODE_ENV = production
     PORT = 3001
     ```
7. Click "Create Web Service"
8. Wait for deployment (~3-5 minutes)
9. Copy your backend URL (e.g., `https://subscrybe-backend.onrender.com`)

### Step 3: Test Backend

```bash
# Test health endpoint
curl https://your-backend-url.onrender.com/health

# Should return:
# {"status":"ok","timestamp":"2024-..."}

# Test connect wallet
curl -X POST https://your-backend-url.onrender.com/api/auth/connect-wallet \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"addr1test123"}'

# Should return user data
```

### Step 4: Update Frontend

1. Open `subscrybe-demo/.env.local` (create if doesn't exist)
2. Add:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
   ```
3. Update API client to use this URL
4. Redeploy frontend to Vercel

---

## Option 2: Railway.app (Alternative)

### Step 1: Database

1. Go to https://railway.app
2. New Project → "Provision PostgreSQL"
3. Copy connection string from Variables tab
4. Connect via psql and run schema.sql

### Step 2: Backend

1. New Service → "GitHub Repo"
2. Select your repo
3. Set Root Directory: `backend`
4. Add environment variables
5. Deploy

---

## Option 3: Local Development

### Prerequisites
```bash
# Install PostgreSQL
brew install postgresql  # Mac
# or download from postgresql.org

# Start PostgreSQL
brew services start postgresql  # Mac
```

### Setup
```bash
# Create database
createdb subscrybe

# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env
# DATABASE_URL=postgresql://localhost:5432/subscrybe

# Run schema
psql subscrybe < src/db/schema.sql

# Start server
npm run dev
```

Server runs on http://localhost:3001

---

## Troubleshooting

### Database Connection Fails

**Error**: `ECONNREFUSED` or `connection refused`

**Solution**:
1. Check DATABASE_URL is correct
2. Verify Supabase project is running
3. Check if IP is whitelisted (Supabase → Settings → Database → Connection Pooling)
4. Try connection pooling URL instead of direct connection

### Tables Not Created

**Error**: `relation "users" does not exist`

**Solution**:
1. Go to Supabase SQL Editor
2. Run schema.sql again
3. Check for errors in SQL execution
4. Verify tables in Table Editor

### Render Deployment Fails

**Error**: Build or start command fails

**Solution**:
1. Check logs in Render dashboard
2. Verify `package.json` scripts are correct
3. Ensure `src/server.js` exists
4. Check Node version (should be 18+)

### CORS Errors

**Error**: `Access-Control-Allow-Origin`

**Solution**:
Backend already has CORS enabled. If still issues:
1. Check frontend is making requests to correct URL
2. Verify headers are being sent
3. Check Render logs for actual error

---

## Environment Variables Reference

### Required
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - `development` or `production`

### Optional
- `PORT` - Server port (default: 3001)

---

## API Testing with Postman

### Import Collection

1. Open Postman
2. Import → Raw Text
3. Paste this:

```json
{
  "info": {
    "name": "Subscrybe API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Connect Wallet",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\"walletAddress\":\"addr1test123\"}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/auth/connect-wallet",
          "host": ["{{baseUrl}}"],
          "path": ["api", "auth", "connect-wallet"]
        }
      }
    },
    {
      "name": "Get My Subscriptions",
      "request": {
        "method": "GET",
        "header": [{"key": "x-wallet-address", "value": "addr1test123"}],
        "url": {
          "raw": "{{baseUrl}}/api/users/me/subscriptions",
          "host": ["{{baseUrl}}"],
          "path": ["api", "users", "me", "subscriptions"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "https://your-backend-url.onrender.com"
    }
  ]
}
```

4. Update `baseUrl` variable
5. Test endpoints

---

## Production Checklist

Before going live:

- [ ] Database deployed and accessible
- [ ] Schema applied successfully
- [ ] Sample data seeded
- [ ] Backend deployed to Render/Railway
- [ ] Environment variables set
- [ ] Health endpoint returns 200
- [ ] Test wallet connection works
- [ ] Test subscription flow works
- [ ] Test Hydra payment (<200ms)
- [ ] Frontend updated with backend URL
- [ ] Frontend redeployed
- [ ] End-to-end test completed
- [ ] Error monitoring set up (optional)
- [ ] Backup strategy in place (optional)

---

## Monitoring

### Render Dashboard
- View logs in real-time
- Monitor CPU/memory usage
- Check deployment history

### Supabase Dashboard
- Monitor database size
- View active connections
- Check query performance

---

## Scaling

### Free Tier Limits
- **Render**: 750 hours/month, sleeps after 15min inactivity
- **Supabase**: 500MB database, 2GB bandwidth

### When to Upgrade
- More than 100 active users
- Database > 400MB
- Need 24/7 uptime
- Need faster response times

### Upgrade Path
1. Render: $7/month (no sleep, more resources)
2. Supabase: $25/month (8GB database, more bandwidth)

---

## Support

### Issues?
1. Check logs in Render dashboard
2. Check database in Supabase
3. Test endpoints with curl/Postman
4. Review error messages carefully

### Common Solutions
- Restart service in Render
- Check environment variables
- Verify database connection
- Clear browser cache
- Redeploy frontend

---

## Success! 🎉

Your backend is now live and ready for the hackathon!

**Next Steps:**
1. Update frontend API client
2. Test complete flow
3. Take screenshots
4. Practice demo
5. Win the hackathon! 🏆
