'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  CreditCard, 
  Calendar, 
  Shield, 
  Store,
  Home,
  FileCode,
  Smile
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/contracts', label: 'Smart Contracts', icon: FileCode },
  { href: '/privacy', label: 'Privacy', icon: Shield },
  { href: '/merchant', label: 'Merchant', icon: Store },
  { href: '/memes', label: 'Memes Gallery', icon: Smile },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#1E293B] border-r border-[#334155] min-h-screen p-4">
      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                  isActive
                    ? 'bg-[#0033AD] text-white'
                    : 'text-[#94A3B8] hover:bg-[#0F172A] hover:text-[#F8FAFC]'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
