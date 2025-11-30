'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useApp } from '@/lib/context';
import { CardanoMemeLoader } from '@/components/memes/cardano-meme-loader';
import { CardanoSuccessMeme } from '@/components/memes/cardano-success-meme';
import confetti from 'canvas-confetti';

export default function MemesTestPage() {
  const { showMeme } = useApp();
  const [showLoader, setShowLoader] = useState(false);
  const [showSuccess, setShowSuccess] = useState<'kidneys' | 'hodl' | 'whale' | null>(null);

  const triggerMeme = (type: string) => {
    switch (type) {
      case 'loading-skeleton':
        setShowLoader(true);
        setTimeout(() => setShowLoader(false), 3000);
        break;
      case 'success-kidneys':
        setShowSuccess('kidneys');
        break;
      case 'success-hodl':
        setShowSuccess('hodl');
        break;
      case 'success-whale':
        setShowSuccess('whale');
        break;
      case 'budget-warning':
        showMeme('warning', '⚠️ Budget Alert!', "You're spending 85% of your balance on subscriptions!");
        break;
      case 'achievement':
        showMeme('achievement', '🏆 Achievement Unlocked!', 'First subscription added!');
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        break;
      case 'error':
        showMeme('error', '❌ Transaction Failed', 'This one didn\'t pass peer review 😅');
        break;
      case 'cancelled':
        showMeme('success', '✅ Subscription Cancelled', 'Successfully cancelled your subscription');
        break;
      case 'hydra':
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#0033AD', '#00D4AA', '#10B981'],
        });
        showMeme('success', '⚡ HYDRA SPEED!', 'Processed in 200ms - That\'s the power of Hydra!');
        break;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-[#F8FAFC] mb-2">🎭 Cardano Memes Test Page</h1>
          <p className="text-[#94A3B8]">Click buttons to see all 10 meme integrations</p>
        </div>

        {/* Meme Triggers */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* 1. Loading States */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-[#F8FAFC] mb-4">1. ⏳ Loading Meme</h3>
            <p className="text-sm text-[#94A3B8] mb-4">
              "Developers waiting for ADA tokens"
            </p>
            <Button onClick={() => triggerMeme('loading-skeleton')}>
              Show Loading Meme
            </Button>
            {showLoader && (
              <div className="mt-4">
                <CardanoMemeLoader type="skeleton" />
              </div>
            )}
          </Card>

          {/* 2. Empty State */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-[#F8FAFC] mb-4">2. 📭 Empty State</h3>
            <p className="text-sm text-[#94A3B8] mb-4">
              Go to /subscriptions with no subs
            </p>
            <Button onClick={() => window.location.href = '/subscriptions'}>
              View Empty State
            </Button>
          </Card>

          {/* 3. Success - Kidneys */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-[#F8FAFC] mb-4">3. 🎉 "Sold My Kidneys"</h3>
            <p className="text-sm text-[#94A3B8] mb-4">
              POV: Sold my kidneys to buy Cardano
            </p>
            <Button onClick={() => triggerMeme('success-kidneys')}>
              Show Kidneys Meme
            </Button>
          </Card>

          {/* 4. Cancelled */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-[#F8FAFC] mb-4">4. ✅ Subscription Cancelled</h3>
            <p className="text-sm text-[#94A3B8] mb-4">
              Success message when cancelling
            </p>
            <Button onClick={() => triggerMeme('cancelled')}>
              Show Cancelled Meme
            </Button>
          </Card>

          {/* 5. Error */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-[#F8FAFC] mb-4">5. ❌ "Peer Review Failed"</h3>
            <p className="text-sm text-[#94A3B8] mb-4">
              Transaction error with humor
            </p>
            <Button onClick={() => triggerMeme('error')}>
              Show Error Meme
            </Button>
          </Card>

          {/* 6. Payment Success */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-[#F8FAFC] mb-4">6. 💰 Payment Confirmed</h3>
            <p className="text-sm text-[#94A3B8] mb-4">
              Your ADA is securing the network
            </p>
            <Button onClick={() => triggerMeme('achievement')}>
              Show Payment Success
            </Button>
          </Card>

          {/* 7. Budget Warning */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-[#F8FAFC] mb-4">7. ⚠️ Budget Warning</h3>
            <p className="text-sm text-[#94A3B8] mb-4">
              "Investing under $1, seeing price above $5"
            </p>
            <Button onClick={() => triggerMeme('budget-warning')}>
              Show Budget Warning
            </Button>
          </Card>

          {/* 8. Welcome Screen */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-[#F8FAFC] mb-4">8. 👋 Welcome Screen</h3>
            <p className="text-sm text-[#94A3B8] mb-4">
              "POV: Choosing a blockchain platform"
            </p>
            <Button onClick={() => {
              localStorage.removeItem('subscrybe_visited');
              window.location.reload();
            }}>
              Show Welcome (Reload)
            </Button>
          </Card>

          {/* 9. Konami Code */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-[#F8FAFC] mb-4">9. 🎮 Konami Code</h3>
            <p className="text-sm text-[#94A3B8] mb-4">
              "Me vs. Cardano Haters" 🦁
            </p>
            <div className="text-xs text-[#64748B] mb-2">
              Type: ↑↑↓↓←→←→BA
            </div>
            <p className="text-xs text-[#F59E0B]">
              Use arrow keys + B + A on keyboard
            </p>
          </Card>

          {/* 10. Hydra Speed */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-[#F8FAFC] mb-4">10. ⚡ Hydra Speed</h3>
            <p className="text-sm text-[#94A3B8] mb-4">
              Lightning fast celebration
            </p>
            <Button onClick={() => triggerMeme('hydra')}>
              Show Hydra Celebration
            </Button>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="p-6 bg-[#0033AD]/10 border-[#0033AD]/30">
          <h3 className="text-xl font-bold text-[#F8FAFC] mb-4">📝 All Memes Are Working!</h3>
          <div className="space-y-2 text-sm text-[#94A3B8]">
            <p>✅ 1. Loading states - Click "Show Loading Meme"</p>
            <p>✅ 2. Empty state - Go to /subscriptions</p>
            <p>✅ 3-7. Success/Error/Warning - Click respective buttons</p>
            <p>✅ 8. Welcome - Clear localStorage and reload</p>
            <p>✅ 9. Konami code - Type ↑↑↓↓←→←→BA</p>
            <p>✅ 10. Hydra - Go to /hydra and run demo</p>
          </div>
        </Card>

        {/* Meme References */}
        <Card className="p-6">
          <h3 className="text-xl font-bold text-[#F8FAFC] mb-4">🎨 Meme References</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[#00D4AA] font-semibold mb-2">Morpheus Memes:</p>
              <ul className="text-[#94A3B8] space-y-1">
                <li>• "Energy efficient" quote in Konami code</li>
                <li>• "Choosing platform" in welcome</li>
              </ul>
            </div>
            <div>
              <p className="text-[#00D4AA] font-semibold mb-2">Community Memes:</p>
              <ul className="text-[#94A3B8] space-y-1">
                <li>• "Sold my kidneys" success</li>
                <li>• "Me vs haters" Konami code</li>
                <li>• "Skeleton waiting" loading</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* Success Meme Modal */}
      {showSuccess && (
        <CardanoSuccessMeme
          type={showSuccess}
          onClose={() => setShowSuccess(null)}
        />
      )}
    </DashboardLayout>
  );
}
