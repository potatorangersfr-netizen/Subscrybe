'use client';

import { motion } from 'framer-motion';
import { TrendingDown, Zap, Clock, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface EnhancedMetricsProps {
  hydraTime: number;
  l1Time: number;
  show: boolean;
}

export function EnhancedMetrics({ hydraTime, l1Time, show }: EnhancedMetricsProps) {
  if (!show) return null;

  const speedImprovement = Math.round(l1Time / hydraTime);
  const hydraCost = 0.0001; // ADA
  const l1Cost = 0.17; // ADA
  const costSavings = Math.round(((l1Cost - hydraCost) / l1Cost) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 space-y-6"
    >
      {/* Performance Comparison */}
      <Card className="p-6 bg-gradient-to-br from-[#0033AD]/10 to-[#00D4AA]/10 border-[#00D4AA]/30">
        <h3 className="text-xl font-bold text-[#F8FAFC] mb-6 text-center">
          📊 Performance Comparison
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Speed */}
          <div className="text-center">
            <div className="bg-[#00D4AA]/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="h-8 w-8 text-[#00D4AA]" />
            </div>
            <p className="text-3xl font-bold text-[#00D4AA] mb-1">
              {speedImprovement}x
            </p>
            <p className="text-sm text-[#94A3B8]">Faster</p>
            <p className="text-xs text-[#64748B] mt-2">
              {hydraTime}ms vs {l1Time}ms
            </p>
          </div>

          {/* Cost */}
          <div className="text-center">
            <div className="bg-[#10B981]/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <DollarSign className="h-8 w-8 text-[#10B981]" />
            </div>
            <p className="text-3xl font-bold text-[#10B981] mb-1">
              {costSavings}%
            </p>
            <p className="text-sm text-[#94A3B8]">Cheaper</p>
            <p className="text-xs text-[#64748B] mt-2">
              ${(hydraCost * 0.6).toFixed(4)} vs ${(l1Cost * 0.6).toFixed(2)}
            </p>
          </div>

          {/* Finality */}
          <div className="text-center">
            <div className="bg-[#F59E0B]/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="h-8 w-8 text-[#F59E0B]" />
            </div>
            <p className="text-3xl font-bold text-[#F59E0B] mb-1">
              Instant
            </p>
            <p className="text-sm text-[#94A3B8]">Finality</p>
            <p className="text-xs text-[#64748B] mt-2">
              No block wait
            </p>
          </div>
        </div>
      </Card>

      {/* Cost Breakdown */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-[#F8FAFC] mb-4">
          💰 Cost Breakdown (100 Payments)
        </h3>
        
        <div className="space-y-4">
          {/* L1 Costs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#94A3B8]">Standard L1 (100 payments)</span>
              <span className="text-[#EF4444] font-semibold">17 ADA</span>
            </div>
            <div className="w-full bg-[#0F172A] rounded-full h-3">
              <div className="bg-[#EF4444] h-3 rounded-full" style={{ width: '100%' }} />
            </div>
            <p className="text-xs text-[#64748B] mt-1">
              100 × 0.17 ADA = 17 ADA in fees
            </p>
          </div>

          {/* Hydra Costs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#94A3B8]">Hydra (100 payments)</span>
              <span className="text-[#10B981] font-semibold">0.34 ADA</span>
            </div>
            <div className="w-full bg-[#0F172A] rounded-full h-3">
              <div className="bg-[#10B981] h-3 rounded-full" style={{ width: '2%' }} />
            </div>
            <p className="text-xs text-[#64748B] mt-1">
              Open (0.17) + Close (0.17) = 0.34 ADA total
            </p>
          </div>

          {/* Savings */}
          <div className="pt-4 border-t border-[#334155]">
            <div className="flex items-center justify-between">
              <span className="text-[#F8FAFC] font-semibold">You Save:</span>
              <span className="text-2xl font-bold text-[#00D4AA]">16.66 ADA</span>
            </div>
            <p className="text-xs text-[#64748B] text-right mt-1">
              ≈ ${(16.66 * 0.6).toFixed(2)} USD
            </p>
          </div>
        </div>
      </Card>

      {/* Why This Matters */}
      <Card className="p-6 bg-[#0033AD]/10 border-[#0033AD]/30">
        <h3 className="text-lg font-bold text-[#F8FAFC] mb-3">
          🎯 Why This Matters
        </h3>
        <div className="space-y-3 text-sm text-[#94A3B8]">
          <div className="flex items-start gap-3">
            <TrendingDown className="h-5 w-5 text-[#00D4AA] mt-0.5 flex-shrink-0" />
            <p>
              <span className="text-[#F8FAFC] font-semibold">Micro-payments become viable:</span> Paying $0.10 for an article is now economically feasible
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-[#00D4AA] mt-0.5 flex-shrink-0" />
            <p>
              <span className="text-[#F8FAFC] font-semibold">Instant user experience:</span> No waiting for blockchain confirmations
            </p>
          </div>
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-[#00D4AA] mt-0.5 flex-shrink-0" />
            <p>
              <span className="text-[#F8FAFC] font-semibold">Sustainable business model:</span> 2% overhead vs 170% makes subscriptions profitable
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
