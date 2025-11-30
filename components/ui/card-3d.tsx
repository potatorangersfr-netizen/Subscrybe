'use client';

import { motion } from 'framer-motion';
import { useRef, useState } from 'react';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
}

export function Card3D({ children, className = '' }: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      className={`relative ${className}`}
    >
      <div
        className="relative bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-xl p-6 shadow-2xl border border-[#334155] backdrop-blur-sm"
        style={{
          transform: 'translateZ(50px)',
          boxShadow: '0 25px 50px -12px rgba(0, 51, 173, 0.25)',
        }}
      >
        {children}
      </div>
      
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle at center, rgba(0, 51, 173, 0.3), transparent 70%)',
          filter: 'blur(20px)',
          transform: 'translateZ(-10px)',
        }}
      />
    </motion.div>
  );
}
