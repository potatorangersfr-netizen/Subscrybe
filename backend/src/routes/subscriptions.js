const express = require('express');
const router = express.Router();
const db = require('../db/memory-store');

// Get all available subscription plans
router.get('/', async (req, res) => {
  try {
    const plans = db.getPlans();
    
    const plansWithMerchants = plans.map(plan => {
      const merchant = db.getMerchantById(plan.merchantId);
      return {
        id: plan.id,
        name: plan.name,
        description: plan.description,
        merchantName: merchant.businessName,
        amount: plan.amount,
        currency: plan.currency,
        interval: plan.interval,
        category: plan.category,
        logoUrl: merchant.logoUrl,
        merchantAddress: merchant.walletAddress
      };
    });

    res.json({ success: true, data: plansWithMerchants });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Subscribe to a plan
router.post('/subscribe', async (req, res) => {
  try {
    const { planId } = req.body;
    const walletAddress = req.headers['x-wallet-address'];

    if (!walletAddress || !planId) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Get or create user
    let user = db.getUserByWallet(walletAddress);
    if (!user) {
      user = db.createUser(walletAddress);
    }

    // Create subscription
    const subscription = db.createSubscription(user.id, planId);

    res.json({ success: true, data: subscription });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create custom subscription
router.post('/custom', async (req, res) => {
  console.log('📝 Custom subscription endpoint hit!', req.body);
  try {
    const { name, amount, interval, category, startDate } = req.body;
    const walletAddress = req.headers['x-wallet-address'];

    if (!walletAddress || !name || !amount) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Get or create user
    let user = db.getUserByWallet(walletAddress);
    if (!user) {
      user = db.createUser(walletAddress);
    }

    // Create custom subscription
    const subscription = db.createCustomSubscription(user.id, {
      name,
      amount: parseFloat(amount),
      interval: interval || 'monthly',
      category: category || 'Other',
      startDate: startDate || new Date().toISOString().split('T')[0]
    });

    res.json({ success: true, data: subscription });
  } catch (error) {
    console.error('Create custom subscription error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Cancel subscription
router.delete('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const walletAddress = req.headers['x-wallet-address'];

    if (!walletAddress) {
      return res.status(401).json({ success: false, error: 'Wallet address required' });
    }

    const user = db.getUserByWallet(walletAddress);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const subscription = db.updateSubscription(id, {
      status: 'cancelled',
      cancelledAt: new Date().toISOString()
    });

    if (!subscription) {
      return res.status(404).json({ success: false, error: 'Subscription not found' });
    }

    res.json({ success: true, data: subscription });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

console.log('✅ Subscriptions routes loaded - custom endpoint registered');
module.exports = router;
