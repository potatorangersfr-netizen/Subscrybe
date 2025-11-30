// Real Hydra API Client
const API_BASE = 'http://localhost:3001/api';

export interface HydraChannel {
  hasChannel: boolean;
  headId?: string;
  status?: string;
  balance?: number;
  initialBalance?: number;
  transactionCount?: number;
  openedAt?: string;
}

export interface HydraPayment {
  success: boolean;
  payment?: {
    id: string;
    amount: number;
    status: string;
    hydraTxHash?: string;
    processingTimeMs: number;
  };
  newBalance?: number;
  processingTimeMs?: number;
  txHash?: string;
}

export const hydraApi = {
  // Open Hydra channel
  async openChannel(userId: string, depositAmount: number) {
    const response = await fetch(`${API_BASE}/hydra/open-channel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, depositAmount })
    });
    return response.json();
  },

  // Get channel status
  async getChannelStatus(userId: string): Promise<HydraChannel> {
    const response = await fetch(`${API_BASE}/hydra/channel/status/${userId}`);
    return response.json();
  },

  // Close channel
  async closeChannel(userId: string) {
    const response = await fetch(`${API_BASE}/hydra/close-channel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return response.json();
  },

  // Execute Hydra payment
  async executePayment(
    userId: string,
    creatorId: string,
    amount: number,
    contentId: string
  ): Promise<HydraPayment> {
    const response = await fetch(`${API_BASE}/hydra/payments/execute-hydra`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, creatorId, amount, contentId })
    });
    return response.json();
  },

  // Execute L1 payment (fallback)
  async executeL1Payment(
    userId: string,
    creatorId: string,
    amount: number,
    contentId: string
  ) {
    const response = await fetch(`${API_BASE}/hydra/payments/execute-l1`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, creatorId, amount, contentId })
    });
    return response.json();
  },

  // Get payment history
  async getPaymentHistory(userId: string) {
    const response = await fetch(`${API_BASE}/hydra/payments/history/${userId}`);
    return response.json();
  },

  // Check Hydra health
  async checkHealth() {
    const response = await fetch(`${API_BASE}/hydra/health`);
    return response.json();
  }
};
