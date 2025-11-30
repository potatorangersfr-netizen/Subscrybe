const express = require('express');
const router = express.Router();
const db = require('../db/memory-store');

// Helper function to generate logo URL from company name
function generateLogoUrl(name) {
  if (!name) return null;
  
  // Common company domains
  const domainMap = {
    'netflix': 'netflix.com',
    'spotify': 'spotify.com',
    'github': 'github.com',
    'notion': 'notion.so',
    'adobe': 'adobe.com',
    'microsoft': 'microsoft.com',
    'google': 'google.com',
    'apple': 'apple.com',
    'amazon': 'amazon.com',
    'discord': 'discord.com',
    'slack': 'slack.com',
    'zoom': 'zoom.us',
    'dropbox': 'dropbox.com',
    'figma': 'figma.com',
    'canva': 'canva.com',
    'youtube': 'youtube.com',
    'twitch': 'twitch.tv',
    'twitter': 'twitter.com',
    'linkedin': 'linkedin.com',
    'facebook': 'facebook.com',
  };
  
  const nameLower = name.toLowerCase().trim();
  
  // Check if it's a known company
  for (const [key, domain] of Object.entries(domainMap)) {
    if (nameLower.includes(key)) {
      return `https://logo.clearbit.com/${domain}`;
    }
  }
  
  // Try to guess domain from name (remove spaces, add .com)
  const guessedDomain = nameLower.replace(/\s+/g, '') + '.com';
  return `https://logo.clearbit.com/${guessedDomain}`;
}

// Get current user
router.get('/me', async (req, res) => {
  try {
    const walletAddress = req.headers['x-wallet-address'];
    
    if (!walletAddress) {
      return res.status(401).json({ success: false, error: 'Wallet address required' });
    }

    const user = db.getUserByWallet(walletAddress);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
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
    console.error('Get user error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user subscriptions
router.get('/me/subscriptions', async (req, res) => {
  try {
    const walletAddress = req.headers['x-wallet-address'];
    
    if (!walletAddress) {
      return res.status(401).json({ success: false, error: 'Wallet address required' });
    }

    const user = db.getUserByWallet(walletAddress);
    if (!user) {
      return res.json({ success: true, data: [] });
    }

    const userSubs = db.getSubscriptionsByUser(user.id);
    const subscriptions = userSubs.map(sub => {
      // Handle custom subscriptions (no plan)
      if (!sub.planId) {
        // Try to generate a logo URL based on the name
        const logoUrl = generateLogoUrl(sub.customName);
        
        return {
          id: sub.id,
          name: sub.customName,
          merchantName: sub.customName,
          amount: sub.customAmount,
          currency: 'ADA',
          interval: sub.customInterval,
          category: sub.customCategory,
          status: sub.status,
          nextPaymentDate: sub.nextPaymentDate,
          startDate: sub.startDate,
          logoUrl: logoUrl,
          merchantAddress: null,
          isCustom: true
        };
      }
      
      // Handle plan-based subscriptions
      const plan = db.getPlanById(sub.planId);
      const merchant = db.getMerchantById(plan.merchantId);
      
      return {
        id: sub.id,
        name: plan.name,
        merchantName: merchant.businessName,
        amount: plan.amount,
        currency: plan.currency,
        interval: plan.interval,
        category: plan.category,
        status: sub.status,
        nextPaymentDate: sub.nextPaymentDate,
        logoUrl: merchant.logoUrl,
        merchantAddress: merchant.walletAddress,
        isCustom: false
      };
    });

    res.json({ success: true, data: subscriptions });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
