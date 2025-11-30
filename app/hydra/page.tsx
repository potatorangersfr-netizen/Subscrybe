'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ComparisonDemo } from '@/components/hydra/comparison-demo';
import { RealHydraDemo } from '@/components/hydra/real-hydra-demo';
import { Card } from '@/components/ui/card';
import { Zap, TrendingUp, DollarSign, Repeat } from 'lucide-react';
import { useState } from 'react';

export default function HydraPage() {
  const [showReal, setShowReal] = useState(true);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-[#F8FAFC] mb-2">Hydra Demo</h1>
          <p className="text-[#94A3B8]">Experience the power of Cardano's Layer 2 solution</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00D4AA]/10 border border-[#00D4AA]/30 rounded-lg">
              <span className="text-sm text-[#00D4AA] font-semibold">⚡ Enabling Micro-Subscriptions</span>
              <span className="text-xs text-[#94A3B8]">Pay $0.10 per article with 98% lower fees</span>
            </div>
            <button
              onClick={() => setShowReal(!showReal)}
              className="px-4 py-2 text-sm bg-[#0033AD]/20 hover:bg-[#0033AD]/30 text-[#00D4AA] rounded-lg transition-colors"
            >
              {showReal ? '📊 Show Simulation' : '⚡ Show Real Demo'}
            </button>
          </div>
        </div>

        {/* What is Hydra */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-6">What is Hydra?</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-[#94A3B8] mb-6">
                Hydra is Cardano's Layer 2 scaling solution that enables instant finality and dramatically lower fees for repeated transactions - perfect for subscription payments.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-[#0033AD]/10 p-2 rounded-lg mt-1">
                    <Zap className="h-5 w-5 text-[#0033AD]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#F8FAFC] mb-1">Instant Finality</h4>
                    <p className="text-sm text-[#94A3B8]">
                      Transactions confirm in milliseconds instead of seconds
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-[#00D4AA]/10 p-2 rounded-lg mt-1">
                    <DollarSign className="h-5 w-5 text-[#00D4AA]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#F8FAFC] mb-1">Lower Fees</h4>
                    <p className="text-sm text-[#94A3B8]">
                      Reduce transaction costs by up to 95%
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-[#10B981]/10 p-2 rounded-lg mt-1">
                    <Repeat className="h-5 w-5 text-[#10B981]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#F8FAFC] mb-1">Perfect for Subscriptions</h4>
                    <p className="text-sm text-[#94A3B8]">
                      Ideal for recurring payments with high frequency
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-[#F59E0B]/10 p-2 rounded-lg mt-1">
                    <TrendingUp className="h-5 w-5 text-[#F59E0B]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#F8FAFC] mb-1">Scalable</h4>
                    <p className="text-sm text-[#94A3B8]">
                      Handle thousands of transactions per second
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0F172A] rounded-lg p-6 border border-[#334155]">
              <h4 className="font-semibold text-[#F8FAFC] mb-4 text-center">How It Works</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-[#0033AD] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-[#F8FAFC]">Open Hydra Head</p>
                    <p className="text-xs text-[#94A3B8]">Create a state channel</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-[#00D4AA] text-[#0F172A] w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-[#F8FAFC]">Process Transactions</p>
                    <p className="text-xs text-[#94A3B8]">Lightning-fast off-chain</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-[#10B981] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-[#F8FAFC]">Settle on L1</p>
                    <p className="text-xs text-[#94A3B8]">Final state to blockchain</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Live Demo */}
        <div>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-6 text-center">
            {showReal ? '⚡ Real Hydra Integration' : '📊 Simulated Comparison'}
          </h2>
          {showReal ? <RealHydraDemo /> : <ComparisonDemo />}
        </div>

        {/* Learn More */}
        <Card className="p-6 bg-gradient-to-r from-[#0033AD]/10 to-[#00D4AA]/10">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-[#F8FAFC] mb-2">
              Want to learn more about Hydra?
            </h3>
            <p className="text-[#94A3B8] mb-4">
              Explore the official Hydra documentation and technical specifications
            </p>
            <a
              href="https://hydra.family"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2 bg-[#0033AD] text-white rounded-lg hover:bg-[#0029] transition-colors"
            >
              Visit Hydra.family →
            </a>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}


        {/* Micro-Subscription Use Case */}
        <Card className="p-8 bg-gradient-to-br from-[#0033AD]/5 to-[#00D4AA]/5">
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-6">
            💡 The Micro-Subscription Problem
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Problem */}
            <div>
              <h3 className="text-lg font-semibold text-[#EF4444] mb-4">
                ❌ Without Hydra (Impossible)
              </h3>
              <div className="space-y-3 text-sm text-[#94A3B8]">
                <div className="bg-[#0F172A] p-4 rounded-lg">
                  <p className="font-semibold text-[#F8FAFC] mb-2">Scenario:</p>
                  <p>Pay $0.10 to read one article</p>
                </div>
                <div className="bg-[#EF4444]/10 p-4 rounded-lg border border-[#EF4444]/30">
                  <p className="font-semibold text-[#EF4444] mb-2">Reality:</p>
                  <p>• Article cost: $0.10</p>
                  <p>• L1 transaction fee: $0.10</p>
                  <p>• Total cost: $0.20</p>
                  <p className="text-[#EF4444] font-bold mt-2">= 100% overhead!</p>
                </div>
                <p className="text-xs italic">
                  This is why micro-payments don't exist on blockchain today.
                </p>
              </div>
            </div>

            {/* Solution */}
            <div>
              <h3 className="text-lg font-semibold text-[#10B981] mb-4">
                ✅ With Hydra (Viable!)
              </h3>
              <div className="space-y-3 text-sm text-[#94A3B8]">
                <div className="bg-[#0F172A] p-4 rounded-lg">
                  <p className="font-semibold text-[#F8FAFC] mb-2">Same Scenario:</p>
                  <p>Read 100 articles at $0.10 each</p>
                </div>
                <div className="bg-[#10B981]/10 p-4 rounded-lg border border-[#10B981]/30">
                  <p className="font-semibold text-[#10B981] mb-2">With Hydra:</p>
                  <p>• Open Head: $0.10 (one-time)</p>
                  <p>• 100 articles: $10.00</p>
                  <p>• Close Head: $0.10 (one-time)</p>
                  <p>• Total fees: $0.20</p>
                  <p className="text-[#10B981] font-bold mt-2">= 2% overhead ✅</p>
                </div>
                <p className="text-xs italic text-[#10B981]">
                  50x cost reduction makes micro-subscriptions economically viable!
                </p>
              </div>
            </div>
          </div>
        </Card>
