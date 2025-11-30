'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { SpendingOverview } from '@/components/dashboard/spending-overview';
import { SpendingChart } from '@/components/dashboard/spending-chart';
import { UpcomingPayments } from '@/components/dashboard/upcoming-payments';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

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

        {/* Multi-Chain Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative z-10"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#F8FAFC]">Connected Blockchains</h2>
              <span className="px-3 py-1 bg-[#00D4AA]/10 text-[#00D4AA] text-sm rounded-full border border-[#00D4AA]/30">
                Multi-Chain
              </span>
            </div>

            <div className="space-y-3">
              {/* Active: Cardano */}
              <div className="flex items-center justify-between p-4 bg-[#0033AD]/10 border border-[#0033AD]/30 rounded-lg">
                <div className="flex items-center gap-3 flex-1">
                  <Image src="/icons/cardano.svg" width={32} height={32} alt="Cardano" />
                  <div>
                    <p className="font-semibold text-[#F8FAFC]">Cardano</p>
                    <p className="text-sm text-[#94A3B8]">8 active subscriptions</p>
                  </div>
                </div>
                <div className="text-right mr-4">
                  <p className="text-2xl font-bold text-[#00D4AA]">50 ADA</p>
                  <p className="text-sm text-[#94A3B8]">Monthly spend</p>
                </div>
                <span className="px-3 py-1 bg-[#10B981]/20 text-[#10B981] text-sm rounded-full">
                  Active
                </span>
              </div>

              {/* Coming Soon: Ethereum */}
              <div className="flex items-center justify-between p-4 bg-[#1E293B]/50 border border-[#334155] rounded-lg opacity-60">
                <div className="flex items-center gap-3 flex-1">
                  <Image src="/icons/ethereum.svg" width={32} height={32} alt="Ethereum" />
                  <div>
                    <p className="font-semibold text-[#F8FAFC]">Ethereum</p>
                    <p className="text-sm text-[#94A3B8]">Support coming Q2 2025</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-[#334155] text-[#94A3B8] text-sm rounded-full border border-[#334155]">
                  Coming Soon
                </span>
              </div>

              {/* Coming Soon: Polygon */}
              <div className="flex items-center justify-between p-4 bg-[#1E293B]/50 border border-[#334155] rounded-lg opacity-60">
                <div className="flex items-center gap-3 flex-1">
                  <Image src="/icons/polygon.svg" width={32} height={32} alt="Polygon" />
                  <div>
                    <p className="font-semibold text-[#F8FAFC]">Polygon</p>
                    <p className="text-sm text-[#94A3B8]">Support coming Q3 2025</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-[#334155] text-[#94A3B8] text-sm rounded-full border border-[#334155]">
                  Coming Soon
                </span>
              </div>

              {/* Coming Soon: Solana */}
              <div className="flex items-center justify-between p-4 bg-[#1E293B]/50 border border-[#334155] rounded-lg opacity-60">
                <div className="flex items-center gap-3 flex-1">
                  <Image src="/icons/solana.svg" width={32} height={32} alt="Solana" />
                  <div>
                    <p className="font-semibold text-[#F8FAFC]">Solana</p>
                    <p className="text-sm text-[#94A3B8]">Support coming Q3 2025</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-[#334155] text-[#94A3B8] text-sm rounded-full border border-[#334155]">
                  Coming Soon
                </span>
              </div>
            </div>

            <Button 
              variant="secondary" 
              className="w-full mt-4" 
              disabled
              onClick={() => toast('Multi-chain support launching in 2025! Join the waitlist.')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Connect New Blockchain (Coming Soon)
            </Button>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
