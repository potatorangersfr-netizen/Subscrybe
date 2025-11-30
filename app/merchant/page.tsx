'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Users, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { mockMerchantData } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';

export default function MerchantPage() {
  const data = mockMerchantData;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-[#F8FAFC] mb-2">Merchant Dashboard</h1>
          <p className="text-[#94A3B8]">{data.businessName}</p>
        </div>

        {/* Metrics */}
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-[#94A3B8]">Monthly Revenue</p>
                  <div className="bg-[#10B981]/10 p-2 rounded-lg">
                    <DollarSign className="h-4 w-4 text-[#10B981]" />
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  <h3 className="text-3xl font-bold text-[#F8FAFC]">
                    {formatCurrency(data.monthlyRevenue)}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-[#10B981] mb-1">
                    <TrendingUp className="h-4 w-4" />
                    <span>{data.revenueChange}%</span>
                  </div>
                </div>
                <p className="text-xs text-[#94A3B8] mt-2">vs last month</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-[#94A3B8]">Subscribers</p>
                  <div className="bg-[#0033AD]/10 p-2 rounded-lg">
                    <Users className="h-4 w-4 text-[#0033AD]" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-[#F8FAFC]">{data.subscribers}</h3>
                <p className="text-xs text-[#94A3B8] mt-2">active subscribers</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-[#94A3B8]">Churn Rate</p>
                  <div className="bg-[#F59E0B]/10 p-2 rounded-lg">
                    <TrendingDown className="h-4 w-4 text-[#F59E0B]" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-[#F8FAFC]">{data.churnRate}%</h3>
                <p className="text-xs text-[#10B981] mt-2">↓ 2% from last month</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold text-[#F8FAFC]">Revenue Trend</h3>
              <p className="text-sm text-[#94A3B8]">Last 6 months</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.revenueHistory}>
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
                    formatter={(value: number) => [`${value} ADA`, 'Revenue']}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: '#10B981', r: 4 }}
                    activeDot={{ r: 6 }}
                    animationDuration={1000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Subscribers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold text-[#F8FAFC]">Recent Subscribers</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.recentSubscribers.map((subscriber, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-[#0F172A] rounded-lg hover:bg-[#1E293B] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0033AD] to-[#00D4AA] flex items-center justify-center text-white font-bold">
                        {subscriber.userId.slice(-2)}
                      </div>
                      <div>
                        <p className="font-medium text-[#F8FAFC]">{subscriber.userId}</p>
                        <p className="text-sm text-[#94A3B8]">{subscriber.plan} Plan</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#F8FAFC]">{formatCurrency(subscriber.amount)}/mo</p>
                      <p className="text-sm text-[#94A3B8]">{subscriber.joinedDate}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
