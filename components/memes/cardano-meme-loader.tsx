'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface CardanoMemeLoaderProps {
  type?: 'skeleton' | 'morpheus';
  message?: string;
}

export function CardanoMemeLoader({ type = 'skeleton', message }: CardanoMemeLoaderProps) {
  const memes = {
    skeleton: {
      // Use skeleton waiting meme
      alt: 'Waiting for transaction',
      caption: message || 'Developers waiting for ADA tokens...',
      fallback: '⏳'
    },
    morpheus: {
      // Use Morpheus energy efficiency meme
      alt: 'Cardano efficiency',
      caption: message || 'Processing on the most energy-efficient blockchain...',
      fallback: '🔋'
    }
  };

  const meme = memes[type];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-8 text-center"
    >
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 2, -2, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="mb-4"
      >
        {/* Fallback emoji if image not available */}
        <div className="text-6xl mb-4">{meme.fallback}</div>
        {/* Uncomment when you add the actual meme images:
        <Image
          src={`/memes/loading/${type === 'skeleton' ? 'skeleton-waiting.jpg' : 'morpheus-energy.jpg'}`}
          alt={meme.alt}
          width={200}
          height={200}
          className="rounded-lg"
        />
        */}
      </motion.div>
      <p className="text-[#94A3B8] text-sm max-w-md">
        {meme.caption}
      </p>
      <motion.div
        className="mt-4 flex gap-2"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-2 h-2 bg-[#0033AD] rounded-full" />
        <div className="w-2 h-2 bg-[#00D4AA] rounded-full" />
        <div className="w-2 h-2 bg-[#10B981] rounded-full" />
      </motion.div>
    </motion.div>
  );
}
