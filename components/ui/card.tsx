'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { 
        scale: 1.02, 
        boxShadow: '0 20px 40px -10px rgba(0, 51, 173, 0.4)',
        borderColor: 'rgba(0, 51, 173, 0.5)',
      } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-xl p-6 shadow-lg border border-[#334155] backdrop-blur-sm relative overflow-hidden group',
        className
      )}
    >
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 51, 173, 0.15), transparent 50%)',
        }}
      />
      
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#0033AD] to-[#00D4AA] rounded-xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mb-4', className)}>{children}</div>;
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('', className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mt-4 pt-4 border-t border-[#334155]', className)}>{children}</div>;
}
