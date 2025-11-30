'use client';

import { motion } from 'framer-motion';
import { ExternalLink, CheckCircle } from 'lucide-react';

interface TransactionToastProps {
  txHash: string;
  message: string;
}

export function TransactionToast({ txHash, message }: TransactionToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-3"
    >
      <CheckCircle className="h-5 w-5 text-[#10B981] flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-medium text-[#F8FAFC] mb-1">{message}</p>
        <a
          href={`https://cardanoscan.io/transaction/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#00D4AA] hover:underline flex items-center gap-1"
        >
          View on Cardanoscan
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </motion.div>
  );
}
