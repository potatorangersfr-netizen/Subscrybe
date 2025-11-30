const express = require('express');
const router = express.Router();
const db = require('../db/memory-store');
const { generateTxHash } = require('../utils/blockchain');

// Execute standard payment
router.post('/execute', async (req, res) => {
  try {
    const { subscriptionId, amount } = req.body;
    const walletAddress = req.headers['x-wallet-address'];

    if (!walletAddress || !subscriptionId || !amount) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Simulate L1 processing time (1-2 seconds)
    const startTime = Date.now();
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    const processingTime = Date.now() - startTime;

    // Create payment record
    const payment = db.createPayment(subscriptionId, amount, false, processingTime);

    res.json({
      success: true,
      data: {
        id: payment.id,
        subscriptionId: payment.subscriptionId,
        amount: payment.amount,
        status: payment.status,
        txHash: payment.txHash,
        isHydraSimulation: false,
        processingTime: payment.processingTimeMs,
        executedAt: payment.executedAt
      }
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Execute Hydra payment (simulation)
router.post('/execute-hydra', async (req, res) => {
  try {
    const { subscriptionId, amount } = req.body;
    const walletAddress = req.headers['x-wallet-address'];

    if (!walletAddress || !subscriptionId || !amount) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Simulate Hydra processing time (100-200ms)
    const startTime = Date.now();
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 100));
    const processingTime = Date.now() - startTime;

    // Create payment record
    const payment = db.createPayment(subscriptionId, amount, true, processingTime);

    res.json({
      success: true,
      data: {
        id: payment.id,
        subscriptionId: payment.subscriptionId,
        amount: payment.amount,
        status: payment.status,
        txHash: payment.txHash,
        isHydraSimulation: true,
        processingTime: payment.processingTimeMs,
        executedAt: payment.executedAt
      }
    });
  } catch (error) {
    console.error('Hydra payment error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get payment history
router.get('/history', async (req, res) => {
  try {
    const walletAddress = req.headers['x-wallet-address'];

    if (!walletAddress) {
      return res.status(401).json({ success: false, error: 'Wallet address required' });
    }

    const user = db.getUserByWallet(walletAddress);
    if (!user) {
      return res.json({ success: true, data: [] });
    }

    const payments = db.getPaymentsByUser(user.id);

    res.json({ success: true, data: payments });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
