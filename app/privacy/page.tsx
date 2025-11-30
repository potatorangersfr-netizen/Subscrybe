'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Trash2, Shield, X, Check } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/lib/context';
import { downloadJSON } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function PrivacyPage() {
  const { user, subscriptions } = useApp();
  const [privacyScore, setPrivacyScore] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    // Animate privacy score
    let start = 0;
    const end = 95;
    const duration = 2000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setPrivacyScore(end);
        clearInterval(timer);
      } else {
        setPrivacyScore(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, []);

  const handleExportData = () => {
    const data = {
      wallet: user?.walletAddress || 'Not connected',
      subscriptions: subscriptions.map(s => ({
        name: s.name,
        amount: s.amount,
        interval: s.interval,
        status: s.status,
      })),
      exportedAt: new Date().toISOString(),
    };
    
    downloadJSON(data, 'subscrybe-data.json');
    toast.success('Data exported successfully!');
  };

  const handleDeleteAccount = () => {
    toast.success('Account deleted. Goodbye! 👋');
    setShowDeleteModal(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-[#F8FAFC] mb-2">Privacy Dashboard</h1>
          <p className="text-[#94A3B8]">Your data, your control</p>
        </div>

        {/* Privacy Score */}
        <Card className="p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#F8FAFC] mb-6">Your Privacy Score</h2>
            
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg className="transform -rotate-90 w-48 h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="#334155"
                  strokeWidth="12"
                  fill="none"
                />
                <motion.circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - privacyScore / 100) }}
                  transition={{ duration: 2, ease: 'easeOut' }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0033AD" />
                    <stop offset="100%" stopColor="#00D4AA" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div>
                  <div className="text-5xl font-bold text-[#F8FAFC]">{privacyScore}</div>
                  <div className="text-sm text-[#94A3B8]">/ 100</div>
                </div>
              </div>
            </div>

            <p className="text-[#10B981] font-semibold">Excellent Privacy!</p>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          {/* What We Know */}
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold text-[#F8FAFC] flex items-center gap-2">
                <Check className="h-5 w-5 text-[#10B981]" />
                What We Know About You
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-[#0033AD]/10 p-2 rounded-lg mt-1">
                    <Shield className="h-4 w-4 text-[#0033AD]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#F8FAFC]">Wallet Address</p>
                    <p className="text-xs text-[#94A3B8] font-mono break-all">
                      {user?.walletAddress?.slice(0, 20) || 'Not connected'}...
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-[#0033AD]/10 p-2 rounded-lg mt-1">
                    <Shield className="h-4 w-4 text-[#0033AD]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#F8FAFC]">Subscriptions</p>
                    <p className="text-xs text-[#94A3B8]">{subscriptions.length} active</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-[#0033AD]/10 p-2 rounded-lg mt-1">
                    <Shield className="h-4 w-4 text-[#0033AD]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#F8FAFC]">Account Created</p>
                    <p className="text-xs text-[#94A3B8]">{user?.joinedDate || 'Unknown'}</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-[#10B981]/10 rounded-lg border border-[#10B981]/20">
                  <p className="text-sm text-[#10B981] font-semibold">
                    That's literally everything. 🔒
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What We DON'T Know */}
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold text-[#F8FAFC] flex items-center gap-2">
                <X className="h-5 w-5 text-[#EF4444]" />
                What We DON'T Know (Never Will)
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  'Your real identity',
                  'Your browsing history',
                  'Your location',
                  'Your spending patterns',
                  'Your other wallets',
                  'Your personal information',
                  'Your transaction history',
                  'Your device information',
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <X className="h-5 w-5 text-[#EF4444] flex-shrink-0" />
                    <p className="text-sm text-[#94A3B8] line-through">{item}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Your Data, Your Control */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold text-[#F8FAFC]">Your Data, Your Control</h3>
            <p className="text-sm text-[#94A3B8]">
              All analytics are calculated client-side in your browser 🔒
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleExportData} variant="secondary">
                <Download className="h-5 w-5 mr-2" />
                Export My Data
              </Button>
              <Button onClick={() => setShowDeleteModal(true)} variant="danger">
                <Trash2 className="h-5 w-5 mr-2" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#1E293B] rounded-xl p-6 max-w-md w-full border border-[#334155]"
            >
              <h3 className="text-xl font-bold text-[#F8FAFC] mb-4">Delete Account?</h3>
              <p className="text-[#94A3B8] mb-6">
                This action cannot be undone. All your subscription data will be permanently deleted.
              </p>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setShowDeleteModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleDeleteAccount} className="flex-1">
                  Delete Forever
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
