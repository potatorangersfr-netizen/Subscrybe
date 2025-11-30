// Blockchain utilities for transaction handling

export function generateTxHash(): string {
  const chars = '0123456789abcdef';
  let hash = '';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

export function generateContractAddress(): string {
  return `addr1qxy${generateTxHash().slice(0, 54)}`;
}

export function simulateBlockchainDelay(): Promise<string> {
  return new Promise((resolve) => {
    // Blockchain confirmation delay
    const delay = Math.random() * 1000 + 1000;
    setTimeout(() => {
      resolve(generateTxHash());
    }, delay);
  });
}

export function getCardanoscanUrl(txHash: string): string {
  return `https://cardanoscan.io/transaction/${txHash}`;
}

export function getAddressUrl(address: string): string {
  return `https://cardanoscan.io/address/${address}`;
}

// Transaction statuses
export type TxStatus = 'pending' | 'confirmed' | 'failed';

export interface Transaction {
  hash: string;
  status: TxStatus;
  timestamp: Date;
  amount: number;
  fee: number;
}

export function createTransaction(amount: number): Transaction {
  return {
    hash: generateTxHash(),
    status: 'confirmed',
    timestamp: new Date(),
    amount,
    fee: 0.17,
  };
}
