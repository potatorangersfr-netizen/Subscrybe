'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Clock, DollarSign, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { hydraApi } from '@/lib/hydra-api';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

const USER_ID = 'demo-user-web';

export function RealHydraDemo() {
  const [channel, setChannel] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [openingChannel, setOpeningChannel] = useState(false);
  const [runningDemo, setRunningDemo] = useState(false);
  const [demoResults, setDemoResults] = useState<any>(null);

  // Load channel status on mount
  useEffect(() => {
    loadChannelStatus();
  }, []);

  const loadChannelStatus = async () => {
    try {
      const status = await hydraApi.getChannelStatus(USER_ID);
      setChannel(status);
    } catch (error) {
      console.error('Failed to load channel:', error);
    }
  };

  const handleOpenChannel = async () => {
    setOpeningChannel(true);
    try {
      const result = await hydraApi.openChannel(USER_ID, 20);
      
      if (result.success) {
        toast.success('Hydra channel opening...');
        
        // Poll for status
        const pollInterval = setInterval(async () => {
          const status = await hydraApi.getChannelStatus(USER_ID);
          setChannel(status);
          
          if (status.status === 'open') {
            clearInterval(pollInterval);
            toast.success('✅ Hydra channel is OPEN!');
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#0033AD', '#00D4AA']
            });
          }
        }, 1000);
        
        setTimeout(() => clearInterval(pollInterval), 10000);
      }
    } catch (error: any) {
      toast.error('Failed to open channel: ' + error.message);
    } finally {
      setOpeningChannel(false);
    }
  };

  const handleCloseChannel = async () => {
    if (!confirm('Close Hydra channel and settle on L1?')) return;
    
    setLoading(true);
    try {
      const result = await hydraApi.closeChannel(USER_ID);
      if (result.success) {
        toast.success('Channel closed and settled!');
        setChannel(null);
        setDemoResults(null);
      }
    } catch (error: any) {
      toast.error('Failed to close channel: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const runRealDemo = async () => {
    if (!channel?.hasChannel || channel.status?.toLowerCase() !== 'open') {
      toast.error('Please open a Hydra channel first!');
      return;
    }

    setRunningDemo(true);
    setDemoResults(null);

    try {
      // Execute Hydra payment
      const hydraStart = Date.now();
      const hydraResult = await hydraApi.executePayment(
        USER_ID,
        'creator-demo',
        0.10,
        'demo-article-001'
      );
      const hydraTime = Date.now() - hydraStart;

      if (hydraResult.success) {
        // Show confetti for Hydra success
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0033AD', '#00D4AA', '#10B981']
        });

        // Simulate L1 for comparison (don't actually execute)
        const l1Time = 18000; // 18 seconds

        setDemoResults({
          hydra: {
            time: hydraResult.processingTimeMs || hydraTime,
            txHash: hydraResult.txHash,
            success: true
          },
          l1: {
            time: l1Time,
            success: true
          },
          speedup: Math.round(l1Time / (hydraResult.processingTimeMs || hydraTime))
        });

        // Reload channel status
        await loadChannelStatus();

        toast.success(`⚡ Payment processed in ${hydraResult.processingTimeMs}ms!`);
      }
    } catch (error: any) {
      toast.error('Payment failed: ' + error.message);
    } finally {
      setRunningDemo(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Channel Status Card */}
      <Card className="p-6 bg-gradient-to-br from-[#0033AD]/10 to-[#00D4AA]/10">
        <h3 className="text-xl font-bold text-[#F8FAFC] mb-4">
          Your Hydra Channel
        </h3>
        
        {!channel?.hasChannel ? (
          <div className="text-center py-8">
            <p className="text-[#94A3B8] mb-6">
              Open a Hydra payment channel to enable instant micro-payments
            </p>
            <Button
              size="lg"
              onClick={handleOpenChannel}
              disabled={openingChannel}
              className="bg-[#00D4AA] hover:bg-[#00D4AA]/90"
            >
              {openingChannel ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Opening Channel...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-5 w-5" />
                  Open Hydra Channel (20 ADA)
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-[#94A3B8]">Status</p>
                <p className="text-lg font-bold text-[#00D4AA]">
                  {channel.status?.toLowerCase() === 'open' ? '✅ Open' : '⏳ ' + channel.status}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#94A3B8]">Balance</p>
                <p className="text-lg font-bold text-[#F8FAFC]">
                  {channel.balance?.toFixed(2)} ADA
                </p>
              </div>
              <div>
                <p className="text-sm text-[#94A3B8]">Transactions</p>
                <p className="text-lg font-bold text-[#F8FAFC]">
                  {channel.transactionCount || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#94A3B8]">Head ID</p>
                <p className="text-xs font-mono text-[#94A3B8]">
                  {channel.headId?.substring(0, 12)}...
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={runRealDemo}
                disabled={runningDemo || channel.status?.toLowerCase() !== 'open'}
                className={`flex-1 ${(runningDemo || channel.status?.toLowerCase() !== 'open') ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
              >
                {runningDemo ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Execute Real Payment (0.10 ADA)
                  </>
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={handleCloseChannel}
                disabled={loading}
                className={loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
              >
                Close Channel
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Demo Results */}
      <AnimatePresence>
        {demoResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Card className="p-8 bg-gradient-to-r from-[#0033AD]/20 to-[#00D4AA]/20">
              <h3 className="text-2xl font-bold text-[#F8FAFC] mb-6 text-center">
                Real Payment Results ⚡
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Hydra Result */}
                <div className="bg-[#0F172A] rounded-lg p-6 border-2 border-[#00D4AA]">
                  <div className="flex items-center gap-3 mb-4">
                    <Zap className="h-6 w-6 text-[#00D4AA]" />
                    <h4 className="text-lg font-bold text-[#F8FAFC]">Hydra Payment</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Processing Time:</span>
                      <span className="font-bold text-[#00D4AA]">
                        {demoResults.hydra.time}ms ⚡
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">TX Hash:</span>
                      <span className="text-xs font-mono text-[#94A3B8]">
                        {demoResults.hydra.txHash?.substring(0, 16)}...
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Status:</span>
                      <span className="text-[#10B981]">✅ Confirmed</span>
                    </div>
                  </div>
                </div>

                {/* L1 Comparison */}
                <div className="bg-[#0F172A] rounded-lg p-6 border border-[#334155]">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="h-6 w-6 text-[#94A3B8]" />
                    <h4 className="text-lg font-bold text-[#F8FAFC]">L1 (Simulated)</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Processing Time:</span>
                      <span className="font-bold text-[#EF4444]">
                        {demoResults.l1.time}ms
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Fee:</span>
                      <span className="text-[#EF4444]">0.17 ADA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Status:</span>
                      <span className="text-[#94A3B8]">Would take 18s</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comparison Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-[#00D4AA] mb-1">
                    {demoResults.speedup}x
                  </div>
                  <p className="text-sm text-[#94A3B8]">Faster</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#10B981] mb-1">
                    98%
                  </div>
                  <p className="text-sm text-[#94A3B8]">Cheaper</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#F59E0B] mb-1">
                    Instant
                  </div>
                  <p className="text-sm text-[#94A3B8]">Finality</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
