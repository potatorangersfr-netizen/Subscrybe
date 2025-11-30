'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export function KonamiListener() {
  const [keys, setKeys] = useState<string[]>([]);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys((prevKeys) => {
        const newKeys = [...prevKeys, e.key].slice(-10);
        
        // Check if Konami code matches
        const matches = KONAMI_CODE.every((key, i) => key === newKeys[i]);
        
        if (matches && !activated) {
          triggerKonamiEffect();
          setActivated(true);
          setTimeout(() => setActivated(false), 5000);
          return [];
        }
        
        return newKeys;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activated]);

  const triggerKonamiEffect = () => {
    // Epic confetti explosion
    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#0033AD', '#00D4AA', '#10B981', '#F59E0B'],
      });
      
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#0033AD', '#00D4AA', '#10B981', '#F59E0B'],
      });
    }, 50);
  };

  return (
    <AnimatePresence>
      {activated && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -100 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
        >
          <div className="bg-gradient-to-br from-[#0033AD] via-[#00D4AA] to-[#10B981] p-2 rounded-3xl shadow-2xl">
            <div className="bg-[#0F172A] rounded-2xl p-12 text-center">
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-8xl mb-6"
              >
                🦁
              </motion.div>
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0033AD] via-[#00D4AA] to-[#10B981] mb-4">
                KONAMI CODE ACTIVATED!
              </h2>
              <p className="text-xl text-[#F8FAFC] mb-2">
                Me vs. Cardano Haters 💪
              </p>
              <p className="text-sm text-[#94A3B8] mb-4">
                ↑↑↓↓←→←→BA - The legendary code lives on!
              </p>
              {/* Meme reference: Lion vs Monkey */}
              <div className="bg-[#1E293B] rounded-lg p-4 mb-4">
                <p className="text-[#64748B] text-xs italic mb-2">
                  "What if I told you..."
                </p>
                <p className="text-[#F8FAFC] font-semibold">
                  Cardano will be thousands of times more energy efficient than Bitcoin
                </p>
              </div>
              <div className="mt-6 flex items-center justify-center gap-2">
                <span className="text-6xl">🦁</span>
                <span className="text-6xl">⚡</span>
                <span className="text-6xl">💎</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
