const express = require('express');
const router = express.Router();
const hydraClient = require('../services/hydra-client');
const db = require('../db/memory-store');
const { v4: uuidv4 } = require('uuid');

// Execute micro-payment via Hydra
router.post('/execute-hydra', async (req, res) => {
  const { userId, creatorId, amount, contentId, subscriptionId } = req.body;
  const startTime = Date.now();

  try {
    console.log(`\n💸 Processing Hydra payment:`);
    console.log(`   User: ${userId}`);
    console.log(`   Creator: ${creatorId}`);
    console.log(`   Amount: ${amount} ADA`);
    console.log(`   Content: ${contentId}`);

    // Step 1: Find user's Hydra Head
    const userHead = Array.from(db.hydraHeads.values())
      .find(h => h.userId === userId && h.status === 'open');

    if (!userHead) {
      console.log(`❌ No open Hydra channel found`);
      return res.status(400).json({
        success: false,
        error: 'No open Hydra channel. Please open one first.',
        fallbackToL1: true
      });
    }

    // Step 2: Check balance
    if (userHead.balance < amount) {
      console.log(`❌ Insufficient balance: ${userHead.balance} < ${amount}`);
      return res.status(400).json({
        success: false,
        error: `Insufficient balance. Have: ${userHead.balance} ADA, Need: ${amount} ADA`
      });
    }

    // Step 3: Build transaction
    const transaction = {
      from: userId,
      to: creatorId,
      amount: amount * 1000000, // to lovelace
      metadata: { 
        contentId,
        subscriptionId,
        timestamp: new Date().toISOString()
      }
    };

    // Step 4: Submit to Hydra
    const result = await hydraClient.submitTransaction(
      userHead.headId,
      transaction
    );

    if (!result.success) {
      throw new Error(result.error);
    }

    // Step 5: Update balances
    userHead.balance -= amount;
    userHead.transactionCount += 1;

    // Step 6: Record payment
    const processingTime = Date.now() - startTime;
    const payment = {
      id: uuidv4(),
      userId,
      creatorId,
      amount,
      contentId,
      subscriptionId,
      status: 'success',
      hydraTxHash: result.txHash,
      processingTimeMs: result.processingTimeMs || processingTime,
      executedAt: new Date().toISOString(),
      method: 'hydra',
      headId: userHead.headId
    };

    userHead.transactions.push(payment);
    db.hydraHeads.set(userHead.headId, userHead);
    db.payments.set(payment.id, payment);

    console.log(`✅ Payment successful in ${processingTime}ms`);
    console.log(`   TX Hash: ${result.txHash}`);
    console.log(`   New balance: ${userHead.balance} ADA`);

    res.json({
      success: true,
      payment: payment,
      newBalance: userHead.balance,
      processingTimeMs: result.processingTimeMs,
      txHash: result.txHash
    });

  } catch (error) {
    console.error('❌ Hydra payment failed:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      fallbackToL1: true
    });
  }
});

// Execute standard L1 payment (fallback)
router.post('/execute-l1', async (req, res) => {
  const { userId, creatorId, amount, contentId, subscriptionId } = req.body;
  const startTime = Date.now();

  console.log(`\n⏳ Processing L1 payment (fallback):`);
  console.log(`   Amount: ${amount} ADA`);
  console.log(`   This will take ~18 seconds...`);

  try {
    // Simulate L1 transaction (18-20 seconds)
    await new Promise(resolve => setTimeout(resolve, 18000));

    const processingTime = Date.now() - startTime;
    const payment = {
      id: uuidv4(),
      userId,
      creatorId,
      amount,
      contentId,
      subscriptionId,
      status: 'success',
      l1TxHash: `tx_l1_${Math.random().toString(36).substr(2, 12)}`,
      processingTimeMs: processingTime,
      executedAt: new Date().toISOString(),
      method: 'l1',
      fee: 0.17 // ADA
    };

    db.payments.set(payment.id, payment);

    console.log(`✅ L1 payment successful in ${processingTime}ms`);
    console.log(`   Fee: 0.17 ADA`);

    res.json({
      success: true,
      payment: payment,
      processingTimeMs: processingTime,
      fee: 0.17
    });

  } catch (error) {
    console.error('❌ L1 payment failed:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get payment history
router.get('/history/:userId', (req, res) => {
  const { userId } = req.params;
  const limit = parseInt(req.query.limit) || 50;

  const payments = Array.from(db.payments.values())
    .filter(p => p.userId === userId)
    .sort((a, b) => new Date(b.executedAt) - new Date(a.executedAt))
    .slice(0, limit);

  res.json({
    success: true,
    payments,
    total: payments.length
  });
});

// Get payment details
router.get('/:paymentId', (req, res) => {
  const { paymentId } = req.params;
  const payment = db.payments.get(paymentId);

  if (!payment) {
    return res.status(404).json({
      success: false,
      error: 'Payment not found'
    });
  }

  res.json({
    success: true,
    payment
  });
});

module.exports = router;
