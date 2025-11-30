'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Calendar, CreditCard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { mockSpendingAnalytics } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';
import { useApp } from '@/lib/context';

export function SpendingOverview() {
  const { subscriptions, loading } = useApp();
  const [displayTotal, setDisplayTotal] = useState(0);
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
  
  // Calculate total from actual subscriptions
  const total = activeSubscriptions.reduce((sum, sub) => sum + (sub.amount || 0), 0) || mockSpendingAnalytics.currentMonth.total;
  const change = mockSpendingAnalytics.currentMonth.change;

  // Animated counter
  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const increment = total / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= total) {
        setDisplayTotal(total);
        clearInterval(timer);
      } else {
        setDisplayTotal(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [total]);

  // Calculate next payment
  const nextPayment = activeSubscriptions.reduce((nearest, sub) => {
    const subDate = new Date(sub.nextPaymentDate);
    const nearestDate = nearest ? new Date(nearest.nextPaymentDate) : new Date('2099-12-31');
    return subDate < nearestDate ? sub : nearest;
  }, activeSubscriptions[0]);

  const daysUntilNext = nextPayment 
    ? Math.ceil((new Date(nextPayment.nextPaymentDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-[#94A3B8]">Total Monthly</p>
              <div className="bg-[#0033AD]/10 p-2 rounded-lg">
                <CreditCard className="h-4 w-4 text-[#0033AD]" />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-bold text-[#F8FAFC]">
                {formatCurrency(displayTotal)}
              </h3>
              <div className={`flex items-center gap-1 text-sm mb-1 ${change >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                {change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span>{Math.abs(change)}%</span>
              </div>
            </div>
            <p className="text-xs text-[#94A3B8] mt-2">vs last month</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-[#94A3B8]">Next Payment</p>
              <div className="bg-[#00D4AA]/10 p-2 rounded-lg">
                <Calendar className="h-4 w-4 text-[#00D4AA]" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-[#F8FAFC]">
              {daysUntilNext} days
            </h3>
            <p className="text-xs text-[#94A3B8] mt-2">
              {nextPayment?.name} - {formatCurrency(nextPayment?.amount || 0)}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-[#94A3B8]">Active Subscriptions</p>
              <div className="bg-[#10B981]/10 p-2 rounded-lg">
                <TrendingUp className="h-4 w-4 text-[#10B981]" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-[#F8FAFC]">
              {activeSubscriptions.length}
            </h3>
            <p className="text-xs text-[#94A3B8] mt-2">
              {subscriptions.length - activeSubscriptions.length} paused/cancelled
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
