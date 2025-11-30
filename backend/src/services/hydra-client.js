const axios = require('axios');
const WebSocket = require('ws');

class HydraClient {
  constructor(apiUrl = 'http://localhost:4001', wsUrl = 'ws://localhost:5001') {
    this.apiUrl = apiUrl;
    this.wsUrl = wsUrl;
    this.ws = null;
    this.listeners = new Map();
  }

  // Initialize Hydra Head
  async initHead(parties, initialUTxO) {
    try {
      console.log(`🌊 Initializing Hydra Head for parties:`, parties);
      
      const response = await axios.post(`${this.apiUrl}/commit`, {
        parties: parties,
        utxo: initialUTxO
      });
      
      console.log(`✅ Head initialized:`, response.data.headId);
      
      return {
        success: true,
        headId: response.data.headId,
        status: response.data.status
      };
    } catch (error) {
      console.error('❌ Failed to init Hydra Head:', error.message);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  // Get Head status
  async getHeadStatus(headId) {
    try {
      const response = await axios.get(`${this.apiUrl}/heads/${headId}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Failed to get Head status:`, error.message);
      return { 
        status: 'Unknown', 
        error: error.message 
      };
    }
  }

  // Submit transaction to Hydra Head
  async submitTransaction(headId, transaction) {
    try {
      const startTime = Date.now();
      
      console.log(`💸 Submitting transaction to Head ${headId}`);
      
      const response = await axios.post(
        `${this.apiUrl}/heads/${headId}/transactions`,
        { transaction }
      );
      
      const processingTime = Date.now() - startTime;
      
      console.log(`✅ Transaction confirmed in ${processingTime}ms`);
      
      return {
        success: true,
        txHash: response.data.transactionId,
        confirmedAt: response.data.confirmedAt,
        processingTimeMs: response.data.processingTimeMs || processingTime
      };
    } catch (error) {
      console.error(`❌ Transaction failed:`, error.message);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  // Close Hydra Head
  async closeHead(headId) {
    try {
      console.log(`🔴 Closing Hydra Head ${headId}`);
      
      const response = await axios.delete(`${this.apiUrl}/heads/${headId}`);
      
      console.log(`✅ Head closed successfully`);
      
      return {
        success: true,
        closeTxHash: response.data.transactionId,
        finalBalance: response.data.finalBalance,
        transactionCount: response.data.transactionCount
      };
    } catch (error) {
      console.error(`❌ Failed to close Head:`, error.message);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  // Subscribe to Head updates via WebSocket
  subscribeToHead(headId, onUpdate) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.listeners.set(headId, onUpdate);
      return;
    }

    console.log(`🔌 Connecting to Hydra WebSocket...`);
    
    this.ws = new WebSocket(this.wsUrl);
    
    this.ws.on('open', () => {
      console.log(`✅ Connected to Hydra WebSocket`);
      this.listeners.set(headId, onUpdate);
    });

    this.ws.on('message', (data) => {
      try {
        const update = JSON.parse(data);
        const listener = this.listeners.get(update.headId);
        
        if (listener) {
          listener(update);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    this.ws.on('error', (error) => {
      console.error('❌ WebSocket error:', error.message);
    });

    this.ws.on('close', () => {
      console.log('🔌 WebSocket disconnected');
      this.ws = null;
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.listeners.clear();
    }
  }

  // Health check
  async isHealthy() {
    try {
      const response = await axios.get(`${this.apiUrl}/health`, {
        timeout: 5000
      });
      return response.data.status === 'healthy';
    } catch (error) {
      return false;
    }
  }
}

module.exports = new HydraClient();
