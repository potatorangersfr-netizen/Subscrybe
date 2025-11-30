const express = require('express');
const router = express.Router();
const hydraClient = require('../services/hydra-client');
const db = require('../db/memory-store');

console.log('🔧 Loading Hydra channels routes...');

// Open Hydra payment channel
router.post('/open-channel', async (req, res) => {
  const { userId, depositAmount } = req.body;

  try {
    console.log(`\n🌊 Opening Hydra channel for user ${userId}`);
    console.log(`💰 Deposit amount: ${depositAmount} ADA`);

    // Step 1: Check for existing channel
    const existingHead = Array.from(db.hydraHeads.values())
      .find(h => h.userId === userId);

    if (existingHead && existingHead.status !== 'closed') {
      console.log(`⚠️ User already has an active channel: ${existingHead.headId}`);
      return res.json({
        success: true,
        headId: existingHead.headId,
        status: existingHead.status,
        message: 'Channel already exists'
      });
    }

    // If there's a closed channel, remove it
    if (existingHead && existingHead.status === 'closed') {
      console.log(`🗑️ Removing old closed channel: ${existingHead.headId}`);
      db.hydraHeads.delete(existingHead.headId);
    }

    // Step 2: Validate deposit
    if (!depositAmount || depositAmount < 5) {
      return res.status(400).json({
        success: false,
        error: 'Minimum deposit is 5 ADA'
      });
    }

    // Step 3: Initialize Hydra Head
    const result = await hydraClient.initHead(
      [userId], // parties
      { amount: depositAmount * 1000000 } // convert to lovelace
    );

    if (!result.success) {
      return res.status(500).json(result);
    }

    // Step 4: Store in database
    const headData = {
      headId: result.headId,
      userId: userId,
      status: 'initializing',
      balance: depositAmount,
      initialBalance: depositAmount,
      openedAt: new Date().toISOString(),
      transactionCount: 0,
      transactions: []
    };

    db.hydraHeads.set(result.headId, headData);

    // Step 4: Subscribe to updates
    hydraClient.subscribeToHead(result.headId, (update) => {
      console.log(`📡 Head update:`, update.tag);
      
      if (update.tag === 'HeadIsOpen') {
        const head = db.hydraHeads.get(result.headId);
        if (head) {
          head.status = 'open';
          db.hydraHeads.set(result.headId, head);
          console.log(`✅ Head ${result.headId} is now OPEN`);
        }
      }
    });

    res.json({
      success: true,
      headId: result.headId,
      status: 'initializing',
      estimatedTime: 2,
      message: 'Hydra Head initialization started'
    });

  } catch (error) {
    console.error('❌ Error opening channel:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get channel status
router.get('/channel/status/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Find user's Head
    const head = Array.from(db.hydraHeads.values())
      .find(h => h.userId === userId);

    if (!head) {
      return res.json({
        hasChannel: false,
        status: 'closed'
      });
    }

    // Get real-time status from Hydra
    const status = await hydraClient.getHeadStatus(head.headId);

    res.json({
      hasChannel: true,
      headId: head.headId,
      status: status.status || head.status,
      balance: head.balance,
      initialBalance: head.initialBalance,
      transactionCount: head.transactionCount,
      openedAt: head.openedAt,
      transactions: head.transactions
    });

  } catch (error) {
    console.error('❌ Error getting channel status:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Close channel
router.post('/close-channel', async (req, res) => {
  const { userId } = req.body;

  try {
    console.log(`\n🔴 Closing channel for user ${userId}`);

    const head = Array.from(db.hydraHeads.values())
      .find(h => h.userId === userId && h.status !== 'closed');

    if (!head) {
      return res.status(404).json({
        success: false,
        error: 'No open channel found'
      });
    }

    const result = await hydraClient.closeHead(head.headId);

    if (result.success) {
      head.status = 'closed';
      head.closedAt = new Date().toISOString();
      head.finalBalance = result.finalBalance;
      db.hydraHeads.set(head.headId, head);

      console.log(`✅ Channel closed successfully`);
    }

    res.json({
      success: result.success,
      closeTxHash: result.closeTxHash,
      finalBalance: result.finalBalance,
      transactionCount: result.transactionCount,
      message: 'Channel closed and settled on L1'
    });

  } catch (error) {
    console.error('❌ Error closing channel:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check
router.get('/health', async (req, res) => {
  const isHealthy = await hydraClient.isHealthy();
  const heads = Array.from(db.hydraHeads.values());
  
  res.json({
    hydraAvailable: isHealthy,
    activeHeads: heads.length,
    openHeads: heads.filter(h => h.status === 'open').length,
    status: isHealthy ? 'operational' : 'degraded'
  });
});

console.log('✅ Hydra channels routes loaded successfully');
console.log('   POST /open-channel');
console.log('   GET /channel/status/:userId');
console.log('   POST /close-channel');
console.log('   GET /health');

module.exports = router;
