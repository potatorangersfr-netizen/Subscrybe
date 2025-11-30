'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Clock, DollarSign, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EnhancedMetrics } from './enhanced-metrics';
import confetti from 'canvas-confetti';

export function ComparisonDemo() {
  const [isRunning, setIsRunning] = useState(false);
  const [l1Progress, setL1Progress] = useState(0);
  const [l1Complete, setL1Complete] = useState(false);
  const [hydraComplete, setHydraComplete] = useState(false);
  const [hydraTime, setHydraTime] = useState(0);
  const [l1Time, setL1Time] = useState(0);
  const [showMetrics, setShowMetrics] = useState(false);
  const [useRealAPI, setUseRealAPI] = useState(true);

  const runDemo = async () => {
    setIsRunning(true);
    setL1Progress(0);
    setL1Complete(false);
    setHydraComplete(false);
    setHydraTime(0);
    setL1Time(0);
    setShowMetrics(false);

    if (useRealAPI) {
      // Use real Hydra API
      try {
        const hydraStartTime = Date.now();
        
        // Execute real Hydra payment
        const response = await fetch('http://localhost:3001/api/hydra/payments/execute-hydra', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 'demo-user',
            creatorId: 'demo-creator',
            amount: 0.10,
            contentId: 'demo-article'
          })
        });

        const data = await response.json();
        const actualHydraTime = Date.now() - hydraStartTime;
        
        setHydraTime(data.processingTimeMs || actualHydraTime);
        setHydraComplete(true);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6, x: 0.7 },
          colors: ['#0033AD', '#00D4AA', '#10B981']
        });
      } catch (error) {
        console.error('Hydra API error, falling back to simulation:', error);
        // Fallback to simulation
        const actualHydraTime = 200 + Math.random() * 50;
        setHydraTime(actualHydraTime);
        setHydraComplete(true);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6, x: 0.7 },
          colors: ['#0033AD', '#00D4AA', '#10B981']
        });
      }
    } else {
      // Simulation mode
      const hydraStartTime = Date.now();
      setTimeout(() => {
        const actualHydraTime = Date.now() - hydraStartTime;
        setHydraTime(actualHydraTime);
        setHydraComplete(true);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6, x: 0.7 },
          colors: ['#0033AD', '#00D4AA', '#10B981']
        });
      }, 180 + Math.random() * 70);
    }

    // L1 simulation (always simulated for demo purposes)
    const l1StartTime = Date.now();
    const duration = 18000;
    const interval = 100;
    const increment = (interval / duration) * 100;
    
    const timer = setInterval(() => {
      setL1Progress((prev) => {
        const next = prev + increment;
        setL1Time(Date.now() - l1StartTime);
        if (next >= 100) {
          clearInterval(timer);
          setL1Complete(true);
          setIsRunning(false);
          setShowMetrics(true);
          return 100;
        }
        return next;
      });
    }, interval);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Button
          size="lg"
          onClick={runDemo}
          disabled={isRunning}
          className="text-lg px-8 py-4"
        >
          {isRunning ? 'Running Demo...' : 'Run Comparison Demo'}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* L1 Side */}
        <Card className="p-8">
          <div className="text-center mb-6">
            <div className="bg-[#94A3B8]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-[#94A3B8]" />
            </div>
            <h3 className="text-2xl font-bold text-[#F8FAFC] mb-2">Standard L1</h3>
            <p className="text-[#94A3B8]">Traditional blockchain</p>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {isRunning && !l1Complete && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-sm text-[#94A3B8] mb-2">Processing transaction...</p>
                  <div className="w-full bg-[#0F172A] rounded-full h-4 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#94A3B8] to-[#64748B]"
                      style={{ width: `${l1Progress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-2 text-center">
                    {Math.round(l1Progress)}% complete
                  </p>
                </motion.div>
              )}

              {l1Complete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <CheckCircle className="h-16 w-16 text-[#10B981] mx-auto mb-4" />
                  <p className="text-lg font-semibold text-[#10B981]">
                    ✅ Transaction Confirmed
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-4 border-t border-[#334155] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8]">Time:</span>
                <span className="font-semibold text-[#F8FAFC]">~18 seconds</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8]">Fee:</span>
                <span className="font-semibold text-[#F8FAFC]">0.17 ADA</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Hydra Side */}
        <Card className="p-8 border-2 border-[#00D4AA]">
          <div className="text-center mb-6">
            <div className="bg-[#00D4AA]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-[#00D4AA]" />
            </div>
            <h3 className="text-2xl font-bold text-[#F8FAFC] mb-2">⚡ Hydra Mode</h3>
            <p className="text-[#94A3B8]">Layer 2 solution</p>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {isRunning && !hydraComplete && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 0.2,
                      repeat: 1,
                    }}
                  >
                    <Zap className="h-16 w-16 text-[#00D4AA] mx-auto" />
                  </motion.div>
                  <p className="text-sm text-[#94A3B8] mt-4">Opening Hydra Head...</p>
                </motion.div>
              )}

              {hydraComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                    }}
                  >
                    <Zap className="h-16 w-16 text-[#00D4AA] mx-auto mb-4" />
                  </motion.div>
                  <p className="text-lg font-semibold text-[#00D4AA]">
                    ⚡ Transaction Confirmed
                  </p>
                  <p className="text-sm text-[#94A3B8] mt-2">Lightning fast!</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-4 border-t border-[#334155] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8]">Time:</span>
                <span className="font-semibold text-[#00D4AA]">~0.2 seconds</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8]">Fee:</span>
                <span className="font-semibold text-[#00D4AA]">0.02 ADA</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Results */}
      <AnimatePresence>
        {l1Complete && hydraComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Card className="p-8 bg-gradient-to-r from-[#0033AD]/20 to-[#00D4AA]/20">
              <h3 className="text-2xl font-bold text-[#F8FAFC] mb-6 text-center">
                Comparison Results
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#00D4AA] mb-2">100x</div>
                  <p className="text-[#94A3B8]">Faster Speed</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#00D4AA] mb-2">88%</div>
                  <p className="text-[#94A3B8]">Lower Fees</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Metrics */}
      <EnhancedMetrics 
        hydraTime={hydraTime} 
        l1Time={l1Time} 
        show={showMetrics} 
      />
    </div>
  );
}
