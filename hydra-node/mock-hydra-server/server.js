const express = require('express');
const WebSocket = require('ws');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 4001;
const WS_PORT = process.env.WS_PORT || 5001;

app.use(cors());
app.use(express.json());

// In-memory storage for Hydra Heads
const heads = new Map();
const transactions = new Map();

// WebSocket server for real-time updates
const wss = new WebSocket.Server({ port: WS_PORT });

console.log(`🌊 Hydra Mock API Server starting...`);
console.log(`📡 REST API: http://localhost:${PORT}`);
console.log(`🔌 WebSocket: ws://localhost:${WS_PORT}`);

// Broadcast to all connected clients
function broadcast(headId, message) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ headId, ...message }));
    }
  });
}

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Hydra Mock API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      'POST /commit': 'Initialize a new Hydra Head',
      'GET /heads/:headId': 'Get Head status',
      'POST /heads/:headId/transactions': 'Submit transaction',
      'DELETE /heads/:headId': 'Close Head'
    }
  });
});

// Initialize Hydra Head
app.post('/commit', async (req, res) => {
  const { parties, utxo } = req.body;
  
  const headId = `head_${uuidv4().substring(0, 8)}`;
  const head = {
    headId,
    parties: parties || [],
    status: 'Initializing',
    balance: utxo?.amount || 0,
    initialBalance: utxo?.amount || 0,
    transactionCount: 0,
    createdAt: new Date().toISOString(),
    transactions: []
  };
  
  heads.set(headId, head);
  
  console.log(`✅ Head initialized: ${headId}`);
  
  // Simulate Head opening after 2 seconds
  setTimeout(() => {
    head.status = 'Open';
    heads.set(headId, head);
    
    broadcast(headId, {
      tag: 'HeadIsOpen',
      headId,
      utxo: { amount: head.balance }
    });
    
    console.log(`🟢 Head opened: ${headId}`);
  }, 2000);
  
  res.json({
    success: true,
    headId,
    status: 'Initializing',
    message: 'Head initialization started'
  });
});

// Get Head status
app.get('/heads/:headId', (req, res) => {
  const { headId } = req.params;
  const head = heads.get(headId);
  
  if (!head) {
    return res.status(404).json({
      success: false,
      error: 'Head not found'
    });
  }
  
  res.json({
    success: true,
    headId: head.headId,
    status: head.status,
    balance: head.balance,
    transactionCount: head.transactionCount,
    createdAt: head.createdAt,
    parties: head.parties
  });
});

// Submit transaction to Head
app.post('/heads/:headId/transactions', async (req, res) => {
  const { headId } = req.params;
  const { transaction } = req.body;
  
  const head = heads.get(headId);
  
  if (!head) {
    return res.status(404).json({
      success: false,
      error: 'Head not found'
    });
  }
  
  if (head.status !== 'Open') {
    return res.status(400).json({
      success: false,
      error: `Head is ${head.status}, not Open`
    });
  }
  
  // Simulate instant Hydra transaction
  const txId = `tx_${uuidv4().substring(0, 12)}`;
  const tx = {
    transactionId: txId,
    from: transaction.from,
    to: transaction.to,
    amount: transaction.amount,
    metadata: transaction.metadata,
    confirmedAt: new Date().toISOString(),
    processingTimeMs: Math.floor(Math.random() * 100) + 150 // 150-250ms
  };
  
  // Update balance
  head.balance -= (transaction.amount / 1000000); // Convert from lovelace
  head.transactionCount += 1;
  head.transactions.push(tx);
  
  heads.set(headId, head);
  transactions.set(txId, tx);
  
  // Broadcast transaction confirmation
  broadcast(headId, {
    tag: 'TxValid',
    headId,
    transaction: tx
  });
  
  console.log(`💸 Transaction processed: ${txId} (${tx.processingTimeMs}ms)`);
  
  res.json({
    success: true,
    transactionId: txId,
    confirmedAt: tx.confirmedAt,
    processingTimeMs: tx.processingTimeMs
  });
});

// Close Head
app.delete('/heads/:headId', async (req, res) => {
  const { headId } = req.params;
  const head = heads.get(headId);
  
  if (!head) {
    return res.status(404).json({
      success: false,
      error: 'Head not found'
    });
  }
  
  head.status = 'Closed';
  head.closedAt = new Date().toISOString();
  heads.set(headId, head);
  
  // Broadcast Head closed
  broadcast(headId, {
    tag: 'HeadIsClosed',
    headId
  });
  
  console.log(`🔴 Head closed: ${headId}`);
  
  // Simulate L1 settlement
  const settlementTxId = `settlement_${uuidv4().substring(0, 12)}`;
  
  res.json({
    success: true,
    transactionId: settlementTxId,
    finalBalance: head.balance,
    transactionCount: head.transactionCount,
    message: 'Head closed and settled on L1'
  });
});

// Get transaction details
app.get('/transactions/:txId', (req, res) => {
  const { txId } = req.params;
  const tx = transactions.get(txId);
  
  if (!tx) {
    return res.status(404).json({
      success: false,
      error: 'Transaction not found'
    });
  }
  
  res.json({
    success: true,
    transaction: tx
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    activeHeads: heads.size,
    totalTransactions: transactions.size
  });
});

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('🔌 WebSocket client connected');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('📨 Received:', data);
    } catch (error) {
      console.error('Invalid message:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('🔌 WebSocket client disconnected');
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Hydra Mock API running on port ${PORT}`);
  console.log(`✅ WebSocket server running on port ${WS_PORT}`);
  console.log(`\n🎯 Ready to process Hydra transactions!\n`);
});
