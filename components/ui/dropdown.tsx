'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DropdownProps {
  children: React.ReactNode;
}

interface DropdownTriggerProps {
  children: React.ReactNode;
}

interface DropdownContentProps {
  children: React.ReactNode;
}

interface DropdownItemProps {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export function Dropdown({ children }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <div onClick={() => setIsOpen(!isOpen)}>
        {Array.isArray(children) ? children[0] : children}
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 right-0 z-50"
          >
            {Array.isArray(children) ? children[1] : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DropdownTrigger({ children }: DropdownTriggerProps) {
  return <>{children}</>;
}

export function DropdownContent({ children }: DropdownContentProps) {
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-lg shadow-xl min-w-[200px] py-2">
      {children}
    </div>
  );
}

export function DropdownItem({ children, active, disabled, onClick }: DropdownItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full px-4 py-2 text-left flex items-center gap-2 transition-colors
        ${active ? 'bg-[#0033AD] text-white' : 'text-[#F8FAFC] hover:bg-[#0F172A]'}
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {children}
    </button>
  );
}
