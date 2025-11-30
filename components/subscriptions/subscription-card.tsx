'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Calendar, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Subscription } from '@/lib/mock-data';

interface SubscriptionCardProps {
  subscription: Subscription;
  onCancel: (id: string) => void;
}

export function SubscriptionCard({ subscription, onCancel }: SubscriptionCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const statusColors = {
    active: 'bg-[#10B981]/10 text-[#10B981]',
    paused: 'bg-[#F59E0B]/10 text-[#F59E0B]',
    cancelled: 'bg-[#EF4444]/10 text-[#EF4444]',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="relative">
        <div className="flex items-center gap-4">
          {subscription.logoUrl && !logoError ? (
            <img
              src={subscription.logoUrl}
              alt={subscription.name}
              className="w-16 h-16 rounded-lg object-cover"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#0033AD] to-[#00D4AA] flex items-center justify-center text-white font-bold text-xl">
              {getInitials(subscription.name)}
            </div>
          )}
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[#F8FAFC]">{subscription.name}</h3>
            <p className="text-sm text-[#94A3B8]">{subscription.category}</p>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1 text-xl font-bold text-[#F8FAFC] mb-1">
              <DollarSign className="h-5 w-5" />
              {formatCurrency(subscription.amount)}
            </div>
            <p className="text-xs text-[#94A3B8]">per {subscription.interval}</p>
          </div>

          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-[#0F172A] rounded-lg transition-colors"
            >
              <MoreVertical className="h-5 w-5 text-[#94A3B8]" />
            </motion.button>

            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 mt-2 w-48 bg-[#0F172A] border border-[#334155] rounded-lg shadow-xl z-10"
              >
                <button
                  onClick={() => {
                    onCancel(subscription.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-[#EF4444] hover:bg-[#1E293B] transition-colors rounded-lg"
                >
                  Cancel Subscription
                </button>
              </motion.div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[#334155] flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
            <Calendar className="h-4 w-4" />
            <span>Next payment: {formatDate(subscription.nextPaymentDate)}</span>
          </div>
          
          <span className={`px-3 py-1 text-xs rounded-full ${statusColors[subscription.status]}`}>
            {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
          </span>
        </div>
      </Card>
    </motion.div>
  );
}
