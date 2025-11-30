const express = require('express');
const router = express.Router();
const db = require('../db/memory-store');

// Get merchant dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const merchantAddress = req.headers['x-merchant-address'] || 'addr1merchant_geniusyield';

    const merchants = db.getMerchants();
    const merchant = merchants.find(m => m.walletAddress === merchantAddress) || merchants[2];

    const dashboard = {
      businessName: merchant.businessName,
      subscribers: 47,
      monthlyRevenue: 2350,
      churnRate: 8,
      revenueChange: 15,
      revenueHistory: [
        { month: 'Jul', revenue: 1850 },
        { month: 'Aug', revenue: 1920 },
        { month: 'Sep', revenue: 2050 },
        { month: 'Oct', revenue: 2180 },
        { month: 'Nov', revenue: 2280 },
        { month: 'Dec', revenue: 2350 },
      ],
      recentSubscribers: [
        { userId: 'user_1234', plan: 'Premium', amount: 15, joinedDate: '2 days ago' },
        { userId: 'user_5678', plan: 'Basic', amount: 10, joinedDate: '5 days ago' },
        { userId: 'user_9012', plan: 'Enterprise', amount: 20, joinedDate: '1 week ago' },
      ]
    };

    res.json({ success: true, data: dashboard });
  } catch (error) {
    console.error('Merchant dashboard error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
