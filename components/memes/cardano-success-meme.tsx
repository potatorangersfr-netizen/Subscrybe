'use client';

import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

interface CardanoSuccessMemeProps {
  type: 'kidneys' | 'hodl' | 'whale';
  onClose: () => void;
}

export function CardanoSuccessMeme({ type, onClose }: CardanoSuccessMemeProps) {
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0033AD', '#00D4AA', '#10B981'],
    });
  }, []);

  const memes = {
    kidneys: {
      emoji: '🫘',
      title: 'All In on Cardano!',
      message: 'POV: Sold my kidneys to buy Cardano',
      subtitle: 'Worth it for that sweet ADA 💎',
    },
    hodl: {
      emoji: '💎',
      title: 'HODL Master!',
      message: 'Diamond hands activated',
      subtitle: 'Cardano to the moon! 🚀',
    },
    whale: {
      emoji: '🐋',
      title: 'Whale Alert!',
      message: 'Big spender detected',
      subtitle: 'Making moves in the Cardano economy',
    },
  };

  const meme = memes[type];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-gradient-to-br from-[#0033AD] to-[#00D4AA] p-1 rounded-2xl max-w-md"
      >
        <div className="bg-[#0F172A] rounded-xl p-8 text-center">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 0.5,
              repeat: 3,
            }}
            className="text-8xl mb-4"
          >
            {meme.emoji}
          </motion.div>
          
          {/* Uncomment when you add the actual meme image:
          <Image
            src={`/memes/success/${type === 'kidneys' ? 'sold-kidneys.jpg' : 'achievement.png'}`}
            alt={meme.title}
            width={300}
            height={300}
            className="rounded-lg mb-4"
          />
          */}
          
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0033AD] via-[#00D4AA] to-[#10B981] mb-2">
            {meme.title}
          </h2>
          <p className="text-xl text-[#F8FAFC] mb-2">{meme.message}</p>
          <p className="text-sm text-[#94A3B8]">{meme.subtitle}</p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="mt-6 px-6 py-2 bg-gradient-to-r from-[#0033AD] to-[#00D4AA] text-white rounded-lg font-semibold"
          >
            Awesome! 🚀
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
