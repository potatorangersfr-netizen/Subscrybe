'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy } from 'lucide-react';
import { useApp } from '@/lib/context';
import { bounceIn } from '@/lib/animations';
import confetti from 'canvas-confetti';

export function MemePopup() {
  const { memeData, closeMeme } = useApp();

  useEffect(() => {
    if (memeData?.show) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  }, [memeData?.show]);

  return (
    <AnimatePresence>
      {memeData?.show && (
        <motion.div
          {...bounceIn}
          className="fixed bottom-8 right-8 z-50 max-w-sm"
        >
          <div className="bg-gradient-to-br from-[#0033AD] to-[#00D4AA] p-1 rounded-xl shadow-2xl">
            <div className="bg-[#1E293B] rounded-lg p-6 relative">
              <button
                onClick={closeMeme}
                className="absolute top-2 right-2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-[#F59E0B] to-[#EF4444] p-3 rounded-full">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#F8FAFC] mb-1">
                    {memeData.title}
                  </h3>
                  <p className="text-sm text-[#94A3B8]">{memeData.message}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#334155]">
                <p className="text-xs text-[#94A3B8] text-center">
                  Achievement unlocked! 🎉
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
