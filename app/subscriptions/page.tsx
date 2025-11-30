'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Zap } from 'lucide-react';
import Image from 'next/image';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { SubscriptionCard } from '@/components/subscriptions/subscription-card';
import { RealSubscriptionCard } from '@/components/subscriptions/real-subscription-card';
import { AddSubscriptionModal } from '@/components/subscriptions/add-subscription-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/lib/context';
import toast from 'react-hot-toast';
import { staggerContainer } from '@/lib/animations';

export default function SubscriptionsPage() {
  const { subscriptions, setSubscriptions } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'paused' | 'cancelled'>('all');
  const [blockchainFilter, setBlockchainFilter] = useState<'all' | 'cardano' | 'ethereum' | 'polygon'>('all');
  const [useRealPayments, setUseRealPayments] = useState(true);

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch = (sub.name || sub.merchantName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || sub.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handlePaymentComplete = (id: string) => {
    // Update subscription status to active
    setSubscriptions(prev => prev.map(sub => 
      sub.id === id ? { ...sub, status: 'active' } : sub
    ));
    toast.success('Payment completed! Subscription is now active.');
  };

  const handlePause = (id: string) => {
    // Update subscription status to paused
    setSubscriptions(prev => prev.map(sub => 
      sub.id === id ? { ...sub, status: 'paused' } : sub
    ));
    toast.success('Subscription paused');
  };

  const handleCancel = async (id: string) => {
    const sub = subscriptions.find(s => s.id === id);
    if (window.confirm(`Are you sure you want to cancel ${sub?.name || sub?.merchantName}?`)) {
      try {
        // Update subscription status to cancelled
        setSubscriptions(prev => prev.map(s => 
          s.id === id ? { ...s, status: 'cancelled' } : s
        ));
        toast.success('Subscription cancelled');
      } catch (error) {
        toast.error('Failed to cancel subscription');
      }
    }
  };

  const tabs = [
    { value: 'all', label: 'All', count: subscriptions.length },
    { value: 'active', label: 'Active', count: subscriptions.filter(s => s.status === 'active').length },
    { value: 'paused', label: 'Paused', count: subscriptions.filter(s => s.status === 'paused').length },
    { value: 'cancelled', label: 'Cancelled', count: subscriptions.filter(s => s.status === 'cancelled').length },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#F8FAFC] mb-2">Subscriptions</h1>
            <p className="text-[#94A3B8]">Manage all your subscriptions in one place</p>
            <button
              onClick={() => setUseRealPayments(!useRealPayments)}
              className="mt-2 inline-flex items-center gap-2 text-sm text-[#00D4AA] hover:underline"
            >
              {useRealPayments ? (
                <>
                  <Zap className="h-4 w-4" />
                  Using Real Hydra Payments
                </>
              ) : (
                '📊 Using Simulated Payments'
              )}
            </button>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Add Subscription
          </Button>
        </div>

        {/* Blockchain Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            variant={blockchainFilter === 'all' ? 'primary' : 'secondary'}
            onClick={() => setBlockchainFilter('all')}
            size="sm"
          >
            All Chains
          </Button>
          <Button 
            variant={blockchainFilter === 'cardano' ? 'primary' : 'secondary'}
            onClick={() => setBlockchainFilter('cardano')}
            className="flex items-center gap-2"
            size="sm"
          >
            <Image src="/icons/cardano.svg" width={16} height={16} alt="Cardano" />
            Cardano ({subscriptions.length})
          </Button>
          <Button 
            variant="secondary"
            disabled
            className="flex items-center gap-2 opacity-60"
            size="sm"
            onClick={() => toast('Ethereum support coming Q2 2025!')}
          >
            <Image src="/icons/ethereum.svg" width={16} height={16} alt="Ethereum" />
            Ethereum (0)
          </Button>
          <Button 
            variant="secondary"
            disabled
            className="flex items-center gap-2 opacity-60"
            size="sm"
            onClick={() => toast('Polygon support coming Q3 2025!')}
          >
            <Image src="/icons/polygon.svg" width={16} height={16} alt="Polygon" />
            Polygon (0)
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
            <Input
              placeholder="Search subscriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-[#334155]">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilterStatus(tab.value as any)}
              className={`px-4 py-2 font-medium transition-colors relative ${
                filterStatus === tab.value
                  ? 'text-[#0033AD]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              {tab.label} ({tab.count})
              {filterStatus === tab.value && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0033AD]"
                />
              )}
            </button>
          ))}
        </div>

        {/* Subscriptions Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredSubscriptions.length > 0 ? (
              filteredSubscriptions.map((subscription, index) => (
                <motion.div
                  key={subscription.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {useRealPayments ? (
                    <RealSubscriptionCard
                      subscription={subscription}
                      onPaymentComplete={handlePaymentComplete}
                      onCancel={handleCancel}
                      onPause={handlePause}
                    />
                  ) : (
                    <SubscriptionCard
                      subscription={subscription}
                      onCancel={handleCancel}
                    />
                  )}
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-semibold text-[#F8FAFC] mb-2">
                  No subscriptions found
                </h3>
                <p className="text-[#94A3B8] mb-6">
                  {searchQuery ? 'Try a different search term' : 'Add your first subscription to get started'}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="h-5 w-5 mr-2" />
                    Add Subscription
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <AddSubscriptionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </DashboardLayout>
  );
}
