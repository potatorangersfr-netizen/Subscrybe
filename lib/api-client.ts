// API Client for Subscrybe Backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Get wallet address from context/storage
function getWalletAddress(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('walletAddress');
}

// Generic API call function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const walletAddress = getWalletAddress();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (walletAddress) {
    headers['x-wallet-address'] = walletAddress;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const result: ApiResponse<T> = await response.json();

  if (!result.success) {
    throw new Error(result.error || 'API request failed');
  }

  return result.data as T;
}

// Auth API
export const authApi = {
  connectWallet: async (walletAddress: string) => {
    const data = await apiCall<any>('/api/auth/connect-wallet', {
      method: 'POST',
      body: JSON.stringify({ walletAddress }),
    });
    
    // Store wallet address
    if (typeof window !== 'undefined') {
      localStorage.setItem('walletAddress', walletAddress);
    }
    
    return data;
  },
};

// Users API
export const usersApi = {
  getMe: () => apiCall<any>('/api/users/me'),
  
  getMySubscriptions: () => apiCall<any[]>('/api/users/me/subscriptions'),
};

// Subscriptions API
export const subscriptionsApi = {
  getAll: () => apiCall<any[]>('/api/subscriptions'),
  
  subscribe: (planId: string) =>
    apiCall<any>('/api/subscriptions/subscribe', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    }),
  
  cancel: (subscriptionId: string) =>
    apiCall<any>(`/api/subscriptions/${subscriptionId}/cancel`, {
      method: 'DELETE',
    }),
};

// Payments API
export const paymentsApi = {
  execute: (subscriptionId: string, amount: number) =>
    apiCall<any>('/api/payments/execute', {
      method: 'POST',
      body: JSON.stringify({ subscriptionId, amount }),
    }),
  
  executeHydra: (subscriptionId: string, amount: number) =>
    apiCall<any>('/api/payments/execute-hydra', {
      method: 'POST',
      body: JSON.stringify({ subscriptionId, amount }),
    }),
  
  getHistory: () => apiCall<any[]>('/api/payments/history'),
};

// Privacy API
export const privacyApi = {
  getMyData: () => apiCall<any>('/api/privacy/my-data'),
  
  deleteAccount: () =>
    apiCall<any>('/api/privacy/delete-account', {
      method: 'DELETE',
    }),
};

// Merchants API
export const merchantsApi = {
  getDashboard: () => apiCall<any>('/api/merchants/dashboard'),
};

// Export all
export const api = {
  auth: authApi,
  users: usersApi,
  subscriptions: subscriptionsApi,
  payments: paymentsApi,
  privacy: privacyApi,
  merchants: merchantsApi,
};

export default api;
