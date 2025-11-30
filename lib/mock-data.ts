// Data models and sample data for Subscrybe

export interface User {
  id: string;
  walletAddress: string;
  balance: number;
  joinedDate: string;
  preferences: {
    currency: string;
    notifications: boolean;
  };
}

export interface Subscription {
  id: string;
  name: string;
  category: string;
  amount: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  nextPaymentDate: string;
  status: 'active' | 'paused' | 'cancelled';
  merchantAddress: string;
  logoUrl: string;
}

export interface Payment {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'success' | 'pending' | 'failed';
  txHash: string;
  executedAt: string;
  isHydraSimulation: boolean;
}

export interface SpendingAnalytics {
  currentMonth: {
    total: number;
    change: number;
  };
  last6Months: Array<{
    month: string;
    amount: number;
  }>;
}

export interface MerchantData {
  businessName: string;
  monthlyRevenue: number;
  subscribers: number;
  churnRate: number;
  revenueChange: number;
  revenueHistory: Array<{
    month: string;
    revenue: number;
  }>;
  recentSubscribers: Array<{
    userId: string;
    plan: string;
    amount: number;
    joinedDate: string;
  }>;
}

// Current user data
export const mockUser: User = {
  id: 'user_123',
  walletAddress: 'addr1qxy8z9abc123def456ghi789jkl012mno345pqr678stu901vwx',
  balance: 1250,
  joinedDate: '2024-12-01',
  preferences: {
    currency: 'ADA',
    notifications: true,
  },
};

// Active subscriptions
export const mockSubscriptions: Subscription[] = [
  {
    id: 'sub_1',
    name: 'Netflix',
    category: 'Entertainment',
    amount: 10,
    currency: 'ADA',
    interval: 'monthly',
    nextPaymentDate: '2025-01-15',
    status: 'active',
    merchantAddress: 'addr1merchant1abc...',
    logoUrl: 'https://logo.clearbit.com/netflix.com',
  },
  {
    id: 'sub_2',
    name: 'Spotify',
    category: 'Music',
    amount: 5,
    currency: 'ADA',
    interval: 'monthly',
    nextPaymentDate: '2025-01-08',
    status: 'active',
    merchantAddress: 'addr1merchant2def...',
    logoUrl: 'https://logo.clearbit.com/spotify.com',
  },
  {
    id: 'sub_3',
    name: 'Genius Yield',
    category: 'DeFi',
    amount: 15,
    currency: 'ADA',
    interval: 'monthly',
    nextPaymentDate: '2025-01-20',
    status: 'active',
    merchantAddress: 'addr1merchant3ghi...',
    logoUrl: 'https://logo.clearbit.com/geniusyield.co',
  },
  {
    id: 'sub_4',
    name: 'GitHub Pro',
    category: 'Development',
    amount: 20,
    currency: 'ADA',
    interval: 'monthly',
    nextPaymentDate: '2025-01-12',
    status: 'active',
    merchantAddress: 'addr1merchant4jkl...',
    logoUrl: 'https://logo.clearbit.com/github.com',
  },
  {
    id: 'sub_5',
    name: 'Notion',
    category: 'Productivity',
    amount: 8,
    currency: 'ADA',
    interval: 'monthly',
    nextPaymentDate: '2025-01-18',
    status: 'active',
    merchantAddress: 'addr1merchant5mno...',
    logoUrl: 'https://logo.clearbit.com/notion.so',
  },
  {
    id: 'sub_6',
    name: 'Adobe Creative Cloud',
    category: 'Design',
    amount: 12,
    currency: 'ADA',
    interval: 'monthly',
    nextPaymentDate: '2025-01-25',
    status: 'active',
    merchantAddress: 'addr1merchant6pqr...',
    logoUrl: 'https://logo.clearbit.com/adobe.com',
  },
  {
    id: 'sub_7',
    name: 'Medium',
    category: 'Media',
    amount: 6,
    currency: 'ADA',
    interval: 'monthly',
    nextPaymentDate: '2025-01-10',
    status: 'active',
    merchantAddress: 'addr1merchant7stu...',
    logoUrl: 'https://logo.clearbit.com/medium.com',
  },
  {
    id: 'sub_8',
    name: 'OpenSea Pro',
    category: 'NFT',
    amount: 10,
    currency: 'ADA',
    interval: 'monthly',
    nextPaymentDate: '2025-01-22',
    status: 'active',
    merchantAddress: 'addr1merchant8vwx...',
    logoUrl: 'https://logo.clearbit.com/opensea.io',
  },
  {
    id: 'sub_9',
    name: 'Figma',
    category: 'Design',
    amount: 7,
    currency: 'ADA',
    interval: 'monthly',
    nextPaymentDate: '2025-01-05',
    status: 'paused',
    merchantAddress: 'addr1merchant9yz...',
    logoUrl: 'https://logo.clearbit.com/figma.com',
  },
  {
    id: 'sub_10',
    name: 'Discord Nitro',
    category: 'Communication',
    amount: 18,
    currency: 'ADA',
    interval: 'monthly',
    nextPaymentDate: '2025-01-28',
    status: 'active',
    merchantAddress: 'addr1merchant10abc...',
    logoUrl: 'https://logo.clearbit.com/discord.com',
  },
];

// Spending Analytics
export const mockSpendingAnalytics: SpendingAnalytics = {
  currentMonth: {
    total: 50,
    change: 12,
  },
  last6Months: [
    { month: 'Jul', amount: 45 },
    { month: 'Aug', amount: 48 },
    { month: 'Sep', amount: 42 },
    { month: 'Oct', amount: 50 },
    { month: 'Nov', amount: 47 },
    { month: 'Dec', amount: 50 },
  ],
};

// Merchant Data
export const mockMerchantData: MerchantData = {
  businessName: 'Genius Yield Pro',
  monthlyRevenue: 2350,
  subscribers: 47,
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
    { userId: 'user_3456', plan: 'Premium', amount: 15, joinedDate: '1 week ago' },
    { userId: 'user_7890', plan: 'Basic', amount: 10, joinedDate: '2 weeks ago' },
  ],
};

// Deployed smart contracts
export const mockContracts = [
  {
    id: 'contract_1',
    name: 'Subscription Manager',
    address: 'addr1qxy_contract_subscription_manager_abc123',
    status: 'deployed',
    description: 'Manages recurring subscription payments',
  },
  {
    id: 'contract_2',
    name: 'Payment Processor',
    address: 'addr1qxy_contract_payment_processor_def456',
    status: 'deployed',
    description: 'Processes payments and handles refunds',
  },
  {
    id: 'contract_3',
    name: 'Hydra Head Controller',
    address: 'addr1qxy_contract_hydra_controller_ghi789',
    status: 'deployed',
    description: 'Controls Hydra Head state channels',
  },
];
