'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useApp } from '@/lib/context';
import { formatCurrency, formatDate } from '@/lib/utils';
import { staggerContainer, staggerItem } from '@/lib/animations';

export function UpcomingPayments() {
  const { subscriptions } = useApp();
  
  // Get next 5 upcoming payments
  const upcomingPayments = subscriptions
    .filter(s => s.status === 'active')
    .sort((a, b) => new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime())
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold text-[#F8FAFC]">Upcoming Payments</h3>
          <p className="text-sm text-[#94A3B8]">Next 7 days</p>
        </CardHeader>
        <CardContent>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-4"
          >
            {upcomingPayments.map((subscription, index) => {
              const getInitials = (name: string) => {
                return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
              };
              
              return (
              <motion.div
                key={subscription.id}
                variants={staggerItem}
                whileHover={{ x: 4, backgroundColor: '#0F172A' }}
                className="flex items-center gap-4 p-3 rounded-lg transition-colors"
              >
                <img
                  src={subscription.logoUrl}
                  alt={subscription.name}
                  className="w-12 h-12 rounded-lg object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'w-12 h-12 rounded-lg bg-gradient-to-br from-[#0033AD] to-[#00D4AA] flex items-center justify-center text-white font-bold';
                    fallback.textContent = getInitials(subscription.name);
                    target.parentNode?.insertBefore(fallback, target);
                  }}
                />
                <div className="flex-1">
                  <h4 className="font-medium text-[#F8FAFC]">{subscription.name}</h4>
                  <p className="text-sm text-[#94A3B8]">
                    {formatDate(subscription.nextPaymentDate)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#F8FAFC]">
                    {formatCurrency(subscription.amount)}
                  </p>
                  <span className="inline-block px-2 py-1 text-xs rounded-full bg-[#10B981]/10 text-[#10B981]">
                    Active
                  </span>
                </div>
              </motion.div>
            )}
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
