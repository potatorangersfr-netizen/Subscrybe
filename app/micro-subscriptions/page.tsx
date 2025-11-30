'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Newspaper, Music, Video, BookOpen, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const MICRO_SUBSCRIPTIONS = [
  {
    id: 'news-daily',
    name: 'Daily News Digest',
    description: 'Premium news summary delivered daily',
    price: 0.05,
    period: 'per day',
    icon: Newspaper,
    color: 'bg-blue-500',
    features: ['Breaking news alerts', 'Market analysis', 'Tech updates']
  },
  {
    id: 'music-hourly',
    name: 'Music Streaming',
    description: 'Ad-free music streaming',
    price: 0.02,
    period: 'per hour',
    icon: Music,
    color: 'bg-purple-500',
    features: ['High quality audio', 'Unlimited skips', 'Offline downloads']
  },
  {
    id: 'video-weekly',
    name: 'Video Content',
    description: 'Premium video content access',
    price: 0.3,
    period: 'per week',
    icon: Video,
    color: 'bg-red-500',
    features: ['4K streaming', 'Early access', 'No ads']
  },
  {
    id: 'learning-monthly',
    name: 'Learning Platform',
    description: 'Educational content and courses',
    price: 2.5,
    period: 'per month',
    icon: BookOpen,
    color: 'bg-green-500',
    features: ['Expert courses', 'Certificates', 'Live sessions']
  }
];

export default function MicroSubscriptionsPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [activeSubscriptions, setActiveSubscriptions] = useState<string[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [balance, setBalance] = useState(25); // Mock balance

  const handleSubscribe = async (subscription: any) => {
    setLoading(subscription.id);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      if (balance < subscription.price) {
        toast.error('Insufficient balance!');
        setLoading(null);
        return;
      }

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0033AD', '#00D4AA', '#10B981']
      });

      setActiveSubscriptions(prev => [...prev, subscription.id]);
      setTotalSpent(prev => prev + subscription.price);
      setBalance(prev => prev - subscription.price);

      toast.success(
        `🎉 Subscribed to ${subscription.name}!\nFirst payment: ${subscription.price} ADA`,
        { duration: 4000 }
      );
    } catch (error: any) {
      toast.error('Subscription failed: ' + error.message);
    } finally {
      setLoading(null);
    }
  };

  const handleUnsubscribe = async (subscriptionId: string) => {
    setActiveSubscriptions(prev => prev.filter(id => id !== subscriptionId));
    toast.success('Unsubscribed successfully!');
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
            Small, flexible subscriptions for digital services - powered by Cardano L1 ⚡
          </p>
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-[#00D4AA]/10 border border-[#00D4AA]/30 rounded-lg">
            <Zap className="h-4 w-4 text-[#00D4AA]" />
            <span className="text-sm text-[#00D4AA] font-semibold">
              Micro-payments • Instant activation • Cancel anytime
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-4 bg-[#10B981]/10 border-[#10B981]/30">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-[#10B981]" />
              <div>
                <p className="text-sm text-[#94A3B8]">Balance</p>
                <p className="text-xl font-bold text-[#F8FAFC]">
                  {balance.toFixed(2)} ADA
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#00D4AA]" />
              <div>
                <p className="text-sm text-[#94A3B8]">Active Subscriptions</p>
                <p className="text-xl font-bold text-[#F8FAFC]">
                  {activeSubscriptions.length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Newspaper className="h-5 w-5 text-[#F59E0B]" />
              <div>
                <p className="text-sm text-[#94A3B8]">Total Spent</p>
                <p className="text-xl font-bold text-[#F8FAFC]">
                  {totalSpent.toFixed(2)} ADA
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Available Micro-Subscriptions */}
        <div className="grid md:grid-cols-2 gap-6">
          {MICRO_SUBSCRIPTIONS.map((subscription) => {
            const Icon = subscription.icon;
            const isActive = activeSubscriptions.includes(subscription.id);
            const isLoading = loading === subscription.id;
            
            return (
              <Card key={subscription.id} className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`${subscription.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-[#F8FAFC]">
                        {subscription.name}
                      </h3>
                      {isActive && (
                        <span className="px-2 py-1 bg-[#10B981]/20 text-[#10B981] text-xs rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#94A3B8] mb-3">
                      {subscription.description}
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00D4AA]/10 rounded-full mb-3">
                      <span className="text-sm font-bold text-[#00D4AA]">
                        {subscription.price} ADA
                      </span>
                      <span className="text-xs text-[#94A3B8]">
                        {subscription.period}
                      </span>
                    </div>
                    
                    <div className="space-y-1 mb-4">
                      {subscription.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-[#10B981]" />
                          <span className="text-xs text-[#94A3B8]">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {!isActive ? (
                    <Button
                      onClick={() => handleSubscribe(subscription)}
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-[#0033AD] to-[#00D4AA] hover:opacity-90"
                      size="sm"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Subscribing...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Subscribe Now
                        </>
                      )}
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="secondary"
                        className="flex-1"
                        size="sm"
                        disabled
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Subscribed
                      </Button>
                      <Button
                        onClick={() => handleUnsubscribe(subscription.id)}
                        variant="ghost"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Active Subscriptions Summary */}
        {activeSubscriptions.length > 0 && (
          <Card className="p-6">
            <h3 className="text-xl font-bold text-[#F8FAFC] mb-4">
              Your Active Subscriptions
            </h3>
            <div className="space-y-3">
              {activeSubscriptions.map((subId) => {
                const subscription = MICRO_SUBSCRIPTIONS.find(s => s.id === subId);
                if (!subscription) return null;
                
                return (
                  <div
                    key={subId}
                    className="flex items-center justify-between p-3 bg-[#0F172A] rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`${subscription.color} p-2 rounded`}>
                        <subscription.icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#F8FAFC]">
                          {subscription.name}
                        </p>
                        <p className="text-xs text-[#94A3B8]">
                          Next payment in 2 days
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#00D4AA]">
                        {subscription.price} ADA
                      </p>
                      <p className="text-xs text-[#94A3B8]">
                        {subscription.period}
                      </p>
                    </div>
                  </div>
                );
              })}
        
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
                ❌ Traditional Subscriptions
              </h4>
              <ul className="text-sm text-[#94A3B8] space-y-1">
                <li>• High monthly fees ($10-50+)</li>
                <li>• Pay for unused features</li>
                <li>• Long-term commitments</li>
                <li>• Bundle everything together</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#10B981] mb-2">
                ✅ Micro-Subscriptions
              </h4>
              <ul className="text-sm text-[#94A3B8] space-y-1">
                <li>• Small payments (0.02-2.5 ADA)</li>
                <li>• Pay only for what you use</li>
                <li>• Cancel anytime, no commitment</li>
                <li>• Mix and match services</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
