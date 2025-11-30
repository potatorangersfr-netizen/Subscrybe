'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Newspaper, Video, BookOpen, Loader2 } from 'lucide-react';
import { hydraApi } from '@/lib/hydra-api';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const USER_ID = 'demo-user-web';

const MICRO_SUBSCRIPTIONS = [
  {
    id: 'news-articles',
    name: 'Daily Cardano News',
    description: 'Pay per article you read',
    price: 0.10,
    unit: 'per article',
    icon: Newspaper,
    color: 'bg-blue-500',
    category: 'News & Media',
    examples: [
      'Cardano Upgrade Analysis - $0.10',
      'DeFi Market Report - $0.10',
      'Developer Updates - $0.10'
    ]
  },
  {
    id: 'video-tutorials',
    name: 'Smart Contract Tutorials',
    description: 'Pay per video you watch',
    price: 0.25,
    unit: 'per video',
    icon: Video,
    color: 'bg-purple-500',
    category: 'Education',
    examples: [
      'Plutus Basics Part 1 - $0.25',
      'Building a DApp - $0.25',
      'Testing Contracts - $0.25'
    ]
  },
  {
    id: 'research-papers',
    name: 'Crypto Research Papers',
    description: 'Pay per paper you access',
    price: 0.50,
    unit: 'per paper',
    icon: BookOpen,
    color: 'bg-green-500',
    category: 'Research',
    examples: [
      'Hydra Protocol Deep Dive - $0.50',
      'Cardano Scalability Study - $0.50',
      'DeFi Security Analysis - $0.50'
    ]
  }
];

export default function MicroSubscriptionsPage() {
  const [channel, setChannel] = useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [consumedContent, setConsumedContent] = useState<any[]>([]);
  const [openingChannel, setOpeningChannel] = useState(false);

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
        toast.success('Hydra channel opening... Please wait');
        
        // Poll for status
        let pollCount = 0;
        const maxPolls = 15;
        const pollInterval = setInterval(async () => {
          pollCount++;
          const status = await hydraApi.getChannelStatus(USER_ID);
          setChannel(status);
          
          if (status.status?.toLowerCase() === 'open') {
            clearInterval(pollInterval);
            setOpeningChannel(false);
            toast.success('✅ Hydra channel is OPEN! You can now make payments.');
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#0033AD', '#00D4AA']
            });
          } else if (pollCount >= maxPolls) {
            clearInterval(pollInterval);
            setOpeningChannel(false);
            toast.error('Channel opening timed out. Please refresh and try again.');
          }
        }, 1000);
      } else {
        setOpeningChannel(false);
        toast.error('Failed to open channel');
      }
    } catch (error: any) {
      setOpeningChannel(false);
      toast.error('Failed to open channel: ' + error.message);
    }
  };

  const handleConsume = async (subscription: any, exampleIndex: number) => {
    if (!channel?.hasChannel || channel.status?.toLowerCase() !== 'open') {
      toast.error('Please open a Hydra channel first! Go to /hydra');
      return;
    }

    setLoading(subscription.id);
    
    try {
      const contentId = `${subscription.id}-${exampleIndex}-${Date.now()}`;
      const result = await hydraApi.executePayment(
        USER_ID,
        `creator-${subscription.id}`,
        subscription.price,
        contentId
      );

      if (result.success) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0033AD', '#00D4AA', '#10B981']
        });

        const consumed = {
          subscription: subscription.name,
          content: subscription.examples[exampleIndex],
          price: subscription.price,
          time: new Date().toLocaleTimeString(),
          txHash: result.txHash,
          processingTime: result.processingTimeMs
        };

        setConsumedContent(prev => [consumed, ...prev]);
        await loadChannelStatus();

        toast.success(
          `⚡ Unlocked in ${result.processingTimeMs}ms!\nPaid ${subscription.price} ADA`,
          { duration: 4000 }
        );
      }
    } catch (error: any) {
      toast.error('Payment failed: ' + error.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#F8FAFC] mb-2">
            Micro-Subscriptions
          </h1>
          <p className="text-[#94A3B8]">
            Pay only for what you consume - powered by Hydra ⚡
          </p>
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-[#00D4AA]/10 border border-[#00D4AA]/30 rounded-lg">
            <Zap className="h-4 w-4 text-[#00D4AA]" />
            <span className="text-sm text-[#00D4AA] font-semibold">
              Instant payments • No monthly commitment • Pay per use
            </span>
          </div>
        </div>

        {/* Channel Status */}
        {channel?.hasChannel && channel.status?.toLowerCase() === 'open' && (
          <Card className="p-4 bg-[#10B981]/10 border-[#10B981]/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-[#10B981]" />
                <div>
                  <p className="font-semibold text-[#F8FAFC]">
                    Hydra Channel Active
                  </p>
                  <p className="text-sm text-[#94A3B8]">
                    Balance: {channel.balance?.toFixed(2)} ADA • 
                    Transactions: {channel.transactionCount}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {!channel?.hasChannel && (
          <Card className="p-6 bg-[#EF4444]/10 border-[#EF4444]/30">
            <p className="text-[#EF4444] mb-3">
              ⚠️ You need an open Hydra channel to use micro-subscriptions
            </p>
            <Button
              onClick={handleOpenChannel}
              disabled={openingChannel}
              className="bg-[#00D4AA] hover:bg-[#00D4AA]/90"
            >
              {openingChannel ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Opening Channel...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Open Hydra Channel (20 ADA)
                </>
              )}
            </Button>
          </Card>
        )}

        {/* Micro-Subscription Services */}
        <div className="grid md:grid-cols-3 gap-6">
          {MICRO_SUBSCRIPTIONS.map((sub) => {
            const Icon = sub.icon;
            return (
              <Card key={sub.id} className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`${sub.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#F8FAFC] mb-1">
                      {sub.name}
                    </h3>
                    <p className="text-sm text-[#94A3B8] mb-2">
                      {sub.description}
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00D4AA]/10 rounded-full">
                      <span className="text-lg font-bold text-[#00D4AA]">
                        {sub.price} ADA
                      </span>
                      <span className="text-xs text-[#94A3B8]">
                        {sub.unit}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-[#F8FAFC] mb-2">
                    Available Content:
                  </p>
                  {sub.examples.map((example, idx) => (
                    <Button
                      key={idx}
                      onClick={() => handleConsume(sub, idx)}
                      disabled={loading === sub.id || !channel?.hasChannel}
                      variant="secondary"
                      className="w-full justify-between text-left"
                      size="sm"
                    >
                      <span className="text-xs truncate">{example}</span>
                      {loading === sub.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Zap className="h-3 w-3 text-[#00D4AA]" />
                      )}
                    </Button>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        {consumedContent.length > 0 && (
          <Card className="p-6">
            <h3 className="text-xl font-bold text-[#F8FAFC] mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {consumedContent.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-[#0F172A] rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#F8FAFC]">
                      {item.content}
                    </p>
                    <p className="text-xs text-[#94A3B8]">
                      {item.subscription} • {item.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#00D4AA]">
                      {item.price} ADA
                    </p>
                    <p className="text-xs text-[#94A3B8]">
                      {item.processingTime}ms ⚡
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Why Micro-Subscriptions */}
        <Card className="p-6 bg-gradient-to-br from-[#0033AD]/10 to-[#00D4AA]/10">
          <h3 className="text-xl font-bold text-[#F8FAFC] mb-4">
            💡 Why Micro-Subscriptions?
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-[#F8FAFC] mb-2">
                ❌ Traditional Monthly Subscriptions
              </h4>
              <ul className="text-sm text-[#94A3B8] space-y-1">
                <li>• Pay $10/month even if you read 1 article</li>
                <li>• Locked into monthly commitment</li>
                <li>• Waste money on unused access</li>
                <li>• Multiple subscriptions add up fast</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#10B981] mb-2">
                ✅ Micro-Subscriptions with Hydra
              </h4>
              <ul className="text-sm text-[#94A3B8] space-y-1">
                <li>• Pay $0.10 per article you actually read</li>
                <li>• No monthly commitment</li>
                <li>• Only pay for what you consume</li>
                <li>• Instant access, instant payment</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
