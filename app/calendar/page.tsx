'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, DollarSign } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/lib/context';
import { formatCurrency } from '@/lib/utils';

export default function CalendarPage() {
  const { subscriptions } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1)); // January 2025

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getPaymentsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return subscriptions.filter(sub => 
      sub.status === 'active' && sub.nextPaymentDate.startsWith(dateStr)
    );
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#F8FAFC] mb-2">Payment Calendar</h1>
            <p className="text-[#94A3B8]">View all upcoming subscription payments</p>
          </div>
        </div>

        <Card className="p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={previousMonth}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-2xl font-bold text-[#F8FAFC]">{monthName}</h2>
            <Button variant="ghost" onClick={nextMonth}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Day Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-[#94A3B8] py-2">
                {day}
              </div>
            ))}

            {/* Empty cells for days before month starts */}
            {Array.from({ length: firstDay }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}

            {/* Calendar Days */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const payments = getPaymentsForDate(day);
              const hasPayments = payments.length > 0;
              const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

              return (
                <motion.div
                  key={day}
                  whileHover={hasPayments ? { scale: 1.05 } : {}}
                  className={`aspect-square p-2 rounded-lg border transition-all ${
                    hasPayments
                      ? 'border-[#0033AD] bg-[#0033AD]/10 cursor-pointer'
                      : 'border-[#334155] bg-[#1E293B]'
                  }`}
                >
                  <div className="text-sm font-semibold text-[#F8FAFC] mb-1">{day}</div>
                  {hasPayments && (
                    <div className="space-y-1">
                      <div className="text-xs text-[#00D4AA] flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {formatCurrency(totalAmount)}
                      </div>
                      <div className="text-xs text-[#94A3B8]">
                        {payments.length} payment{payments.length > 1 ? 's' : ''}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </Card>

        {/* Legend */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-[#F8FAFC] mb-4">Upcoming Payments This Month</h3>
          <div className="space-y-3">
            {subscriptions
              .filter(sub => sub.status === 'active')
              .sort((a, b) => new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime())
              .slice(0, 5)
              .map((sub) => {
                const getInitials = (name: string) => name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
                return (
                <div key={sub.id} className="flex items-center justify-between p-3 bg-[#0F172A] rounded-lg">
                  <div className="flex items-center gap-3">
                    <img 
                      src={sub.logoUrl} 
                      alt={sub.name} 
                      className="w-10 h-10 rounded-lg object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = document.createElement('div');
                        fallback.className = 'w-10 h-10 rounded-lg bg-gradient-to-br from-[#0033AD] to-[#00D4AA] flex items-center justify-center text-white font-bold text-sm';
                        fallback.textContent = getInitials(sub.name);
                        target.parentNode?.insertBefore(fallback, target);
                      }}
                    />
                    <div>
                      <p className="font-medium text-[#F8FAFC]">{sub.name}</p>
                      <p className="text-sm text-[#94A3B8]">{sub.nextPaymentDate}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-[#F8FAFC]">{formatCurrency(sub.amount)}</p>
                </div>
              )}
              )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
