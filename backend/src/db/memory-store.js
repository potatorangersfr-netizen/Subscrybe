// In-memory data store (no database needed for demo)
const { v4: uuidv4 } = require('uuid');

// In-memory storage
const store = {
  users: new Map(),
  merchants: new Map(),
  plans: new Map(),
  subscriptions: new Map(),
  payments: new Map(),
  hydraHeads: new Map(),
};

// Initialize with sample data
function initializeSampleData() {
  // Create merchants
  const merchants = [
    { id: uuidv4(), businessName: 'Netflix', walletAddress: 'addr1merchant_netflix', logoUrl: 'https://logo.clearbit.com/netflix.com', description: 'Streaming service', website: 'https://netflix.com' },
    { id: uuidv4(), businessName: 'Spotify', walletAddress: 'addr1merchant_spotify', logoUrl: 'https://logo.clearbit.com/spotify.com', description: 'Music streaming', website: 'https://spotify.com' },
    { id: uuidv4(), businessName: 'Genius Yield', walletAddress: 'addr1merchant_geniusyield', logoUrl: 'https://logo.clearbit.com/geniusyield.co', description: 'DeFi protocol', website: 'https://geniusyield.co' },
    { id: uuidv4(), businessName: 'GitHub', walletAddress: 'addr1merchant_github', logoUrl: 'https://logo.clearbit.com/github.com', description: 'Code hosting', website: 'https://github.com' },
    { id: uuidv4(), businessName: 'Notion', walletAddress: 'addr1merchant_notion', logoUrl: 'https://logo.clearbit.com/notion.so', description: 'Productivity', website: 'https://notion.so' },
  ];

  merchants.forEach(m => store.merchants.set(m.id, m));

  // Create plans
  const plans = [
    { id: uuidv4(), merchantId: merchants[0].id, name: 'Netflix Premium', description: 'Premium subscription', amount: 10, currency: 'ADA', interval: 'monthly', category: 'Entertainment', isActive: true },
    { id: uuidv4(), merchantId: merchants[1].id, name: 'Spotify Premium', description: 'Premium subscription', amount: 5, currency: 'ADA', interval: 'monthly', category: 'Music', isActive: true },
    { id: uuidv4(), merchantId: merchants[2].id, name: 'Genius Yield Pro', description: 'Premium subscription', amount: 15, currency: 'ADA', interval: 'monthly', category: 'DeFi', isActive: true },
    { id: uuidv4(), merchantId: merchants[3].id, name: 'GitHub Pro', description: 'Premium subscription', amount: 20, currency: 'ADA', interval: 'monthly', category: 'Development', isActive: true },
    { id: uuidv4(), merchantId: merchants[4].id, name: 'Notion Premium', description: 'Premium subscription', amount: 8, currency: 'ADA', interval: 'monthly', category: 'Productivity', isActive: true },
  ];

  plans.forEach(p => store.plans.set(p.id, p));

  console.log('✅ Sample data initialized');
}

// Initialize on load
initializeSampleData();

// Helper functions
const db = {
  // Users
  createUser: (walletAddress) => {
    const user = {
      id: uuidv4(),
      walletAddress,
      balance: 1250,
      joinedDate: new Date().toISOString(),
      preferences: { currency: 'ADA', notifications: true },
      createdAt: new Date().toISOString(),
    };
    store.users.set(user.id, user);
    return user;
  },

  getUserByWallet: (walletAddress) => {
    return Array.from(store.users.values()).find(u => u.walletAddress === walletAddress);
  },

  // Merchants
  getMerchants: () => Array.from(store.merchants.values()),

  getMerchantById: (id) => store.merchants.get(id),

  // Plans
  getPlans: () => Array.from(store.plans.values()),

  getPlanById: (id) => store.plans.get(id),

  // Subscriptions
  createSubscription: (userId, planId) => {
    const nextPaymentDate = new Date();
    nextPaymentDate.setDate(nextPaymentDate.getDate() + 30);

    const subscription = {
      id: uuidv4(),
      userId,
      planId,
      status: 'active',
      nextPaymentDate: nextPaymentDate.toISOString().split('T')[0],
      vaultAddress: `addr1vault_${uuidv4().slice(0, 8)}`,
      createdAt: new Date().toISOString(),
    };
    store.subscriptions.set(subscription.id, subscription);
    return subscription;
  },

  createCustomSubscription: (userId, data) => {
    const startDate = new Date(data.startDate);
    const nextPaymentDate = new Date(startDate);
    
    // Calculate next payment based on interval
    if (data.interval === 'monthly') {
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
    } else if (data.interval === 'yearly') {
      nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);
    }

    const subscription = {
      id: uuidv4(),
      userId,
      planId: null, // Custom subscription, no plan
      customName: data.name,
      customAmount: data.amount,
      customInterval: data.interval,
      customCategory: data.category,
      status: 'active',
      startDate: data.startDate,
      nextPaymentDate: nextPaymentDate.toISOString().split('T')[0],
      vaultAddress: `addr1vault_${uuidv4().slice(0, 8)}`,
      createdAt: new Date().toISOString(),
    };
    store.subscriptions.set(subscription.id, subscription);
    return subscription;
  },

  getSubscriptionsByUser: (userId) => {
    return Array.from(store.subscriptions.values()).filter(s => s.userId === userId);
  },

  updateSubscription: (id, updates) => {
    const sub = store.subscriptions.get(id);
    if (sub) {
      Object.assign(sub, updates);
      store.subscriptions.set(id, sub);
    }
    return sub;
  },

  // Payments
  createPayment: (subscriptionId, amount, isHydra, processingTime) => {
    const payment = {
      id: uuidv4(),
      subscriptionId,
      amount,
      currency: 'ADA',
      status: 'success',
      txHash: isHydra ? `hydra_${Math.random().toString(36).slice(2)}` : Math.random().toString(36).slice(2),
      isHydraSimulation: isHydra,
      processingTimeMs: processingTime,
      executedAt: new Date().toISOString(),
    };
    store.payments.set(payment.id, payment);
    return payment;
  },

  getPaymentsByUser: (userId) => {
    const userSubs = Array.from(store.subscriptions.values())
      .filter(s => s.userId === userId)
      .map(s => s.id);
    
    return Array.from(store.payments.values())
      .filter(p => userSubs.includes(p.subscriptionId));
  },
};

module.exports = db;

// Export hydraHeads directly for Hydra integration
db.hydraHeads = store.hydraHeads;
db.payments = store.payments;
