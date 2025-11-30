'use client';

import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { SpendingOverview } from '@/components/dashboard/spending-overview';
import { SpendingChart } from '@/components/dashboard/spending-chart';
import { UpcomingPayments } from '@/components/dashboard/upcoming-payments';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 relative">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-96 h-96 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(0, 51, 173, 0.1), transparent)',
                filter: 'blur(60px)',
              }}
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 15 + i * 5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 2,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <h1 className="text-3xl font-bold text-[#F8FAFC] mb-2">Dashboard</h1>
          <p className="text-[#94A3B8]">Overview of your subscriptions and spending</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative z-10"
        >
          <SpendingOverview />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid lg:grid-cols-2 gap-8 relative z-10"
        >
          <SpendingChart />
          <UpcomingPayments />
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
