'use client';

import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { mockSpendingAnalytics } from '@/lib/mock-data';

export function SpendingChart() {
  const data = mockSpendingAnalytics.last6Months;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold text-[#F8FAFC]">Spending Trend</h3>
          <p className="text-sm text-[#94A3B8]">Last 6 months</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="month" 
                stroke="#94A3B8"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#94A3B8"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `${value} ₳`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#F8FAFC',
                }}
                formatter={(value: number) => [`${value} ADA`, 'Spending']}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#0033AD"
                strokeWidth={3}
                dot={{ fill: '#0033AD', r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
