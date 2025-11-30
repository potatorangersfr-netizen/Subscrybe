# Frontend-Backend Integration Guide 🔌

Complete guide to connect your Subscrybe frontend to the real backend.

## 🎯 Overview

You now have:
- ✅ **Frontend**: Next.js app with beautiful UI
- ✅ **Backend**: Express API with PostgreSQL
- ✅ **API Client**: Ready-to-use functions

Let's connect them!

---

## Step 1: Start Backend Locally

```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev

# Should see:
# 🚀 Subscrybe Backend running on port 3001
# ✅ Database connected
```

---

## Step 2: Update Frontend Context

Replace the mock context with real API calls.

**File: `lib/context.tsx`**

```typescript
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from './api-client';

interface AppContextType {
  user: any;
  subscriptions: any[];
  loading: boolean;
  addSubscription: (planId: string) => Promise<void>;
  cancelSubscription: (id: string) => Promise<void>;
  refreshSubscriptions: () => Promise<void>;
  showMeme: (type: string, title: string, message: string) => void;
  memeData: { type: string; title: string; message: string; show: boolean } | null;
  closeMeme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [memeData, setMemeData] = useState<any>(null);

  // Load user and subscriptions on mount
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      
      // Check if wallet is connected
      const walletAddress = localStorage.getItem('walletAddress');
      if (!walletAddress) {
        setLoading(false);
        return;
      }

      // Load user data
      const userData = await api.users.getMe();
      setUser(userData);

      // Load subscriptions
      const subs = await api.users.getMySubscriptions();
      setSubscriptions(subs);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addSubscription(planId: string) {
    try {
      await api.subscriptions.subscribe(planId);
      await refreshSubscriptions();
      showMeme('achievement', 'Subscription Added!', '🎉 Successfully subscribed!');
    } catch (error) {
      console.error('Failed to add subscription:', error);
      throw error;
    }
  }

  async function cancelSubscription(id: string) {
    try {
      await api.subscriptions.cancel(id);
      await refreshSubscriptions();
      showMeme('success', 'Cancelled', 'Subscription cancelled successfully');
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      throw error;
    }
  }

  async function refreshSubscriptions() {
    try {
      const subs = await api.users.getMySubscriptions();
      setSubscriptions(subs);
    } catch (error) {
      console.error('Failed to refresh subscriptions:', error);
    }
  }

  function showMeme(type: string, title: string, message: string) {
    setMemeData({ type, title, message, show: true });
    setTimeout(() => {
      setMemeData((prev: any) => (prev ? { ...prev, show: false } : null));
    }, 3000);
  }

  function closeMeme() {
    setMemeData((prev: any) => (prev ? { ...prev, show: false } : null));
  }

  return (
    <AppContext.Provider
      value={{
        user,
        subscriptions,
        loading,
        addSubscription,
        cancelSubscription,
        refreshSubscriptions,
        showMeme,
        memeData,
        closeMeme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
```

---

## Step 3: Add Wallet Connection

**File: `components/layout/header.tsx`**

Add wallet connection button:

```typescript
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Wallet } from 'lucide-react';
import { useApp } from '@/lib/context';
import { api } from '@/lib/api-client';
import { formatAddress, formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';
import { Button } from '../ui/button';

export function Header() {
  const { user } = useApp();
  const [copied, setCopied] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setConnecting(true);
      
      // Simulate wallet connection (replace with real wallet integration)
      const mockWalletAddress = 'addr1qxy8z9abc123def456ghi789jkl012mno345pqr678stu901vwx';
      
      await api.auth.connectWallet(mockWalletAddress);
      toast.success('Wallet connected!');
      
      // Reload page to fetch data
      window.location.reload();
    } catch (error) {
      toast.error('Failed to connect wallet');
      console.error(error);
    } finally {
      setConnecting(false);
    }
  };

  const handleCopy = () => {
    if (user?.walletAddress) {
      navigator.clipboard.writeText(user.walletAddress);
      setCopied(true);
      toast.success('Address copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="bg-[#1E293B] border-b border-[#334155] px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-[#0033AD] to-[#00D4AA] w-10 h-10 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#F8FAFC]">Subscrybe</h1>
            <p className="text-xs text-[#94A3B8]">Crypto Subscription Manager</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <div className="hidden md:block">
                <p className="text-sm text-[#94A3B8] mb-1">Balance</p>
                <p className="text-lg font-semibold text-[#F8FAFC]">
                  {formatCurrency(user.balance)}
                </p>
              </div>

              <div className="flex items-center gap-2 bg-[#0F172A] px-4 py-2 rounded-lg border border-[#334155]">
                <code className="text-sm font-mono text-[#F8FAFC]">
                  {formatAddress(user.walletAddress)}
                </code>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCopy}
                  className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-[#10B981]" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </motion.button>
              </div>
            </>
          ) : (
            <Button onClick={handleConnect} loading={connecting}>
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
```

---

## Step 4: Update Subscription Modal

**File: `components/subscriptions/add-subscription-modal.tsx`**

Update to use real API:

```typescript
const handleSubmit = async () => {
  if (!validate()) return;

  try {
    setLoading(true);
    
    // Get available plans
    const plans = await api.subscriptions.getAll();
    
    // Find matching plan or use first one
    const plan = plans.find(p => 
      p.merchantName.toLowerCase().includes(formData.name.toLowerCase())
    ) || plans[0];

    // Subscribe
    await addSubscription(plan.id);
    
    toast.success('Subscription added successfully!');
    onClose();
  } catch (error) {
    toast.error('Failed to add subscription');
    console.error(error);
  } finally {
    setLoading(false);
  }
};
```

---

## Step 5: Test Integration

### Test Checklist

```bash
# 1. Backend running?
curl http://localhost:3001/health
# Should return: {"status":"ok",...}

# 2. Frontend running?
# Open http://localhost:3000

# 3. Connect wallet
# Click "Connect Wallet" button

# 4. View subscriptions
# Navigate to /subscriptions

# 5. Add subscription
# Click "Add Subscription"
# Fill form and submit

# 6. Cancel subscription
# Click ••• menu → Cancel

# 7. Test Hydra payment
# Go to /hydra
# Run comparison demo
```

---

## Step 6: Environment Variables

**File: `.env.local`** (create in root)

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

For production:
```bash
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

---

## Common Issues & Solutions

### Issue: "Failed to fetch"

**Cause**: Backend not running or wrong URL

**Solution**:
```bash
# Check backend is running
curl http://localhost:3001/health

# Check NEXT_PUBLIC_API_URL in .env.local
# Restart frontend after changing .env
```

### Issue: "User not found"

**Cause**: Wallet not connected

**Solution**:
```typescript
// Check localStorage
console.log(localStorage.getItem('walletAddress'));

// If null, click "Connect Wallet"
```

### Issue: CORS error

**Cause**: Backend CORS not configured

**Solution**:
Backend already has CORS enabled. If still issues:
1. Check backend logs
2. Verify frontend URL
3. Restart backend

### Issue: "Database error"

**Cause**: Database not set up

**Solution**:
```bash
# Create database
createdb subscrybe

# Run schema
cd backend
psql subscrybe < src/db/schema.sql
```

---

## Production Deployment

### 1. Deploy Backend
Follow `BACKEND-DEPLOYMENT.md`

### 2. Update Frontend
```bash
# Add to Vercel environment variables
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com

# Redeploy
vercel --prod
```

### 3. Test Production
```bash
# Test backend
curl https://your-backend.onrender.com/health

# Test frontend
# Open https://your-app.vercel.app
# Connect wallet
# Test full flow
```

---

## Success Criteria ✅

Your integration is working when:

- [ ] Backend health check returns 200
- [ ] Frontend loads without errors
- [ ] Wallet connection works
- [ ] Dashboard shows real data from backend
- [ ] Can add subscription (creates in database)
- [ ] Can cancel subscription (updates in database)
- [ ] Hydra payment completes in <200ms
- [ ] Privacy export downloads real data
- [ ] No console errors
- [ ] Mobile works

---

## Next Steps

1. ✅ Backend deployed
2. ✅ Frontend connected
3. ✅ Integration tested
4. 🎯 Add real wallet integration (Nami/Eternl)
5. 🎯 Deploy to production
6. 🎯 Test end-to-end
7. 🎯 Win hackathon! 🏆

---

## Support

**Backend Issues**: Check `backend/README.md`
**Deployment Issues**: Check `BACKEND-DEPLOYMENT.md`
**API Reference**: Check backend route files

**Still stuck?** 
1. Check browser console
2. Check backend logs
3. Test with curl/Postman
4. Verify environment variables

---

## You're Ready! 🚀

Your Subscrybe app now has a real backend with:
- ✅ PostgreSQL database
- ✅ RESTful API
- ✅ Hydra simulation
- ✅ Privacy features
- ✅ Full CRUD operations

**Time to win that hackathon!** 💪
