'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#0033AD] text-white hover:bg-[#0029] focus:ring-[#0033AD]',
    secondary: 'bg-[#00D4AA] text-[#0F172A] hover:bg-[#00c299] focus:ring-[#00D4AA]',
    ghost: 'bg-transparent text-[#F8FAFC] hover:bg-[#1E293B] focus:ring-[#1E293B]',
    danger: 'bg-[#EF4444] text-white hover:bg-[#dc2626] focus:ring-[#EF4444]',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const MotionButton = motion.button as any;
  
  return (
    <MotionButton
      whileHover={{ 
        scale: disabled || loading ? 1 : 1.05,
        boxShadow: disabled || loading ? 'none' : '0 10px 30px -10px rgba(0, 51, 173, 0.5)',
      }}
      whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={cn(baseStyles, variants[variant], sizes[size], 'relative overflow-hidden', className)}
      disabled={disabled || loading}
      {...props}
    >
      {/* Ripple effect on hover */}
      <motion.span
        className="absolute inset-0 bg-white opacity-0"
        whileHover={{ opacity: [0, 0.1, 0] }}
        transition={{ duration: 0.6 }}
      />
      
      <span className="relative z-10 flex items-center justify-center">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </span>
    </MotionButton>
  );
}
