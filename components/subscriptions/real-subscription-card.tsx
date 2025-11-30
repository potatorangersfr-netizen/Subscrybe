'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, DollarSign, Zap, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { hydraApi } from '@/lib/hydra-api';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

interface RealSubscriptionCardProps {
  subscription: any;
  onPaymentComplete?: () => void;
}

const USER_ID = 'demo-user-web';

export function RealSubscriptionCard({ subscription, onPaymentComplete }: RealSubscriptionCardProps) {
  const [paying, setPaying] = useState(false);

  const handlePayNow = async () => {
    setPaying(true);
    
    try {
      // Check if user has Hydra channel
      const channel = await hydraApi.getChannelStatus(USER_ID);
      
      if (!channel.hasChannel || channel.status?.toLowerCase() !== 'open') {
        toast.error('Please open a Hydra channel first! Go to /hydra');
        setPaying(false);
        return;
      }

      // Execute payment
      const result = await hydraApi.executePayment(
        USER_ID,
        subscription.merchantId || 'merchant-' + subscription.id,
        subscription.amount,
        'subscription-' + subscription.id
      );

      if (result.success) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0033AD', '#00D4AA', '#10B981']
        });

        toast.success(
          `⚡ Payment processed in ${result.processingTimeMs}ms!\nNew balance: ${result.newBalance} ADA`,
          { duration: 4000 }
        );

        if (onPaymentComplete) {
          onPaymentComplete();
        }
      } else {
        toast.error('Payment failed: ' + (result as any).error);
      }
    } catch (error: any) {
      toast.error('Payment error: ' + error.message);
    } finally {
      setPaying(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-6 hover:border-[#00D4AA]/50 transition-colors">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {subscription.logoUrl && (
              <img
                src={subscription.logoUrl}
                alt={subscription.name}
                className="w-12 h-12 rounded-lg"
              />
            )}
            <div>
              <h3 className="text-lg font-semibold text-[#F8FAFC]">
                {subscription.name}
              </h3>
              <p className="text-sm text-[#94A3B8]">
                {subscription.merchantName || subscription.description}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#00D4AA]">
              {subscription.amount} ADA
            </p>
            <p className="text-xs text-[#94A3B8]">
              per {subscription.interval}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-[#94A3B8] mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{subscription.interval}</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            <span>{subscription.category}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handlePayNow}
            disabled={paying}
            className="flex-1 bg-[#00D4AA] hover:bg-[#00D4AA]/90"
          >
            {paying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Pay Now via Hydra
              </>
            )}
          </Button>
        </div>

        {subscription.status === 'active' && (
          <div className="mt-3 px-3 py-2 bg-[#10B981]/10 border border-[#10B981]/30 rounded-lg">
            <p className="text-xs text-[#10B981]">
              ✅ Active - Next payment due soon
            </p>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
