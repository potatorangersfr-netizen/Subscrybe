'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[#F8FAFC] mb-2">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full px-4 py-2 bg-[#0F172A] border rounded-lg text-[#F8FAFC] placeholder-[#94A3B8]',
          'focus:outline-none focus:ring-2 focus:ring-[#0033AD] focus:border-transparent',
          'transition-all duration-200',
          error ? 'border-[#EF4444]' : 'border-[#334155]',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-[#EF4444]">{error}</p>
      )}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export function Select({ label, error, options, className, ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[#F8FAFC] mb-2">
          {label}
        </label>
      )}
      <select
        className={cn(
          'w-full px-4 py-2 bg-[#0F172A] border rounded-lg text-[#F8FAFC]',
          'focus:outline-none focus:ring-2 focus:ring-[#0033AD] focus:border-transparent',
          'transition-all duration-200',
          error ? 'border-[#EF4444]' : 'border-[#334155]',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-[#EF4444]">{error}</p>
      )}
    </div>
  );
}
