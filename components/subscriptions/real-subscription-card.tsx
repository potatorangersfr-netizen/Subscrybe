'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, DollarSign, Zap, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

interface RealSubscriptionCardProps {
  subscription: any;
  onPaymentComplete?: (id: string) => void;
  onCancel?: (id: string) => void;
  onPause?: (id: string) => void;
}

export function RealSubscriptionCard({ subscription, onPaymentComplete, onCancel, onPause }: RealSubscriptionCardProps) {
  const [paying, setPaying] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  const handlePayNow = async () => {
    setPaying(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0033AD', '#00D4AA', '#10B981']
      });

      toast.success(
        `⚡ Payment processed successfully!\nPaid ${subscription.amount} ADA to ${subscription.name}`,
        { duration: 4000 }
      );

      setPaymentDone(true);

      if (onPaymentComplete) {
        onPaymentComplete(subscription.id);
      }
    } catch (error: any) {
      toast.error('Payment error: ' + error.message);
    } finally {
      setPaying(false);
    }
  };

  const handleCancelSubscription = () => {
    if (onCancel) {
      onCancel(subscription.id);
    }
  };

  const handlePauseSubscription = () => {
    if (onPause) {
      onPause(subscription.id);
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
          {!paymentDone ? (
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
                  Pay Now
                </>
              )}
            </Button>
          ) : (
            <Button
              disabled
              className="flex-1 bg-[#10B981] hover:bg-[#10B981] cursor-not-allowed"
            >
              <Zap className="mr-2 h-4 w-4" />
              Payment Done
            </Button>
          )}
          
          {!paymentDone && (
            <>
              <Button
                onClick={handlePauseSubscription}
                variant="secondary"
                className="border border-[#F59E0B]/30 text-[#F59E0B] hover:bg-[#F59E0B]/10"
              >
                Pause
              </Button>
              <Button
                onClick={handleCancelSubscription}
                variant="ghost"
                className="border border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/10"
              >
                Cancel
              </Button>
            </>
          )}
        </div>

        {subscription.status === 'active' && (
          <div className="mt-3 px-3 py-2 bg-[#10B981]/10 border border-[#10B981]/30 rounded-lg">
            <p className="text-xs text-[#10B981]">
              ✅ Active - Next payment due soon
            </p>
          </div>
        )}
        
        {subscription.status === 'paused' && (
          <div className="mt-3 px-3 py-2 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg">
            <p className="text-xs text-[#F59E0B]">
              ⏸️ Paused - No payments will be processed
            </p>
          </div>
        )}
        
        {subscription.status === 'cancelled' && (
          <div className="mt-3 px-3 py-2 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg">
            <p className="text-xs text-[#EF4444]">
              ❌ Cancelled - Subscription ended
            </p>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
