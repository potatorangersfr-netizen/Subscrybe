const express = require('express');
const router = express.Router();
const db = require('../db/memory-store');

// Connect wallet - creates or returns user
router.post('/connect-wallet', async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ success: false, error: 'Wallet address required' });
    }

    // Check if user exists
    let user = db.getUserByWallet(walletAddress);

    if (!user) {
      // Create new user
      user = db.createUser(walletAddress);
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        walletAddress: user.walletAddress,
        balance: user.balance,
        joinedDate: user.joinedDate,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
