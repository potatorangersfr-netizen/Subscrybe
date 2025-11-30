'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Shield, TrendingUp, X } from 'lucide-react';
import { Button } from './button';
import confetti from 'canvas-confetti';

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('subscrybe_visited');
    
    if (!hasVisited) {
      setTimeout(() => {
        setIsOpen(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }, 500);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('subscrybe_visited', 'true');
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-gradient-to-br from-[#0033AD] to-[#00D4AA] p-1 rounded-2xl max-w-2xl w-full">
              <div className="bg-[#0F172A] rounded-xl p-8 relative">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                  aria-label="Close welcome modal"
                >
                  <X className="h-6 w-6" />
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-6xl mb-4"
                  >
                    🎉
                  </motion.div>
                  {/* Meme reference: "POV: You're choosing a blockchain platform" */}
                  <div className="mb-4 text-sm text-[#64748B] italic">
                    POV: You're a blockchain developer looking for a building platform
                  </div>
                  <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0033AD] via-[#00D4AA] to-[#10B981] mb-3">
                    Welcome to Subscrybe!
                  </h2>
                  <p className="text-lg text-[#94A3B8]">
                    Built on Cardano - The choice is obvious 💎
                  </p>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-start gap-3"
                  >
                    <div className="bg-[#0033AD]/20 p-3 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-[#0033AD]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#F8FAFC] mb-1">
                        Track Everything
                      </h3>
                      <p className="text-sm text-[#94A3B8]">
                        See all subscriptions, spending, and upcoming payments
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-start gap-3"
                  >
                    <div className="bg-[#00D4AA]/20 p-3 rounded-lg">
                      <Zap className="h-6 w-6 text-[#00D4AA]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#F8FAFC] mb-1">
                        Hydra-Powered
                      </h3>
                      <p className="text-sm text-[#94A3B8]">
                        Lightning-fast payments with Cardano Layer 2
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-start gap-3"
                  >
                    <div className="bg-[#10B981]/20 p-3 rounded-lg">
                      <Shield className="h-6 w-6 text-[#10B981]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#F8FAFC] mb-1">
                        Privacy First
                      </h3>
                      <p className="text-sm text-[#94A3B8]">
                        Your data, your control. Export or delete anytime
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-start gap-3"
                  >
                    <div className="bg-[#F59E0B]/20 p-3 rounded-lg">
                      <Sparkles className="h-6 w-6 text-[#F59E0B]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#F8FAFC] mb-1">
                        Smart Contracts
                      </h3>
                      <p className="text-sm text-[#94A3B8]">
                        Automated payments secured by Plutus contracts
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* CTA */}
                <div className="text-center">
                  <Button
                    size="lg"
                    onClick={handleClose}
                    className="text-lg px-8 py-4"
                  >
                    Get Started 🚀
                  </Button>
                  <p className="text-xs text-[#64748B] mt-4">
                    Tip: Try the Konami code for a surprise! ↑↑↓↓←→←→BA
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
