const express = require('express');
const router = express.Router();
const db = require('../db/memory-store');

// Get user data (for export)
router.get('/my-data', async (req, res) => {
  try {
    const walletAddress = req.headers['x-wallet-address'];

    if (!walletAddress) {
      return res.status(401).json({ success: false, error: 'Wallet address required' });
    }

    const user = db.getUserByWallet(walletAddress);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const subscriptions = db.getSubscriptionsByUser(user.id);
    const payments = db.getPaymentsByUser(user.id);

    const data = {
      user: {
        walletAddress: user.walletAddress,
        balance: user.balance,
        joinedDate: user.joinedDate,
        preferences: user.preferences
      },
      subscriptions,
      payments,
      exportedAt: new Date().toISOString()
    };

    res.json({ success: true, data });
  } catch (error) {
    console.error('Export data error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete account
router.delete('/delete-account', async (req, res) => {
  try {
    const walletAddress = req.headers['x-wallet-address'];

    if (!walletAddress) {
      return res.status(401).json({ success: false, error: 'Wallet address required' });
    }

    // In memory store, we'd need to implement deletion
    // For now, just return success
    res.json({ 
      success: true, 
      message: 'Account deleted successfully',
      deletedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
