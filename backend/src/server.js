const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const subscriptionRoutes = require('./routes/subscriptions');
const paymentRoutes = require('./routes/payments');
const privacyRoutes = require('./routes/privacy');
const merchantRoutes = require('./routes/merchants');
const hydraChannelsRoutes = require('./routes/hydra-channels');
const hydraPaymentsRoutes = require('./routes/hydra-payments');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/privacy', privacyRoutes);
app.use('/api/merchants', merchantRoutes);
// Mount more specific routes first
app.use('/api/hydra/payments', hydraPaymentsRoutes);
app.use('/api/hydra', hydraChannelsRoutes);

console.log('🌊 Hydra routes registered');
console.log('   /api/hydra/payments/*');
console.log('   /api/hydra/*');

// Debug: Log all registered routes
console.log('📋 Registered subscription routes:');
subscriptionRoutes.stack.forEach(r => {
  if (r.route) {
    console.log(`  ${Object.keys(r.route.methods)[0].toUpperCase()} /api/subscriptions${r.route.path}`);
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler - must be AFTER all routes
app.use((req, res) => {
  console.log(`❌ 404: ${req.method} ${req.path}`);
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found',
    path: req.path
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: err.message || 'Internal server error' 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Subscrybe Backend running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🌊 Hydra integration: http://localhost:${PORT}/api/hydra/health`);
});
