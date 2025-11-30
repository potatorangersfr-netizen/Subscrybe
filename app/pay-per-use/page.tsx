'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Server, Database, Cpu, HardDrive, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const PAY_PER_USE_SERVICES = [
  {
    id: 'api-calls',
    name: 'API Service',
    description: 'Pay per API request',
    price: 0.001,
    unit: 'per call',
    icon: Server,
    color: 'bg-blue-500',
    actions: [
      { label: 'GET /users', calls: 1 },
      { label: 'POST /data', calls: 1 },
      { label: 'Batch Request (10 calls)', calls: 10 }
    ]
  },
  {
    id: 'compute-time',
    name: 'Computing Power',
    description: 'Pay per minute of compute',
    price: 0.05,
    unit: 'per minute',
    icon: Cpu,
    color: 'bg-purple-500',
    actions: [
      { label: 'Run Analysis (1 min)', minutes: 1 },
      { label: 'Process Data (5 min)', minutes: 5 },
      { label: 'Train Model (10 min)', minutes: 10 }
    ]
  },
  {
    id: 'storage',
    name: 'Data Storage',
    description: 'Pay per GB stored per day',
    price: 0.02,
    unit: 'per GB-day',
    icon: HardDrive,
    color: 'bg-green-500',
    actions: [
      { label: 'Store 1 GB', gb: 1 },
      { label: 'Store 5 GB', gb: 5 },
      { label: 'Store 10 GB', gb: 10 }
    ]
  },
  {
    id: 'database',
    name: 'Database Queries',
    description: 'Pay per query executed',
    price: 0.0005,
    unit: 'per query',
    icon: Database,
    color: 'bg-orange-500',
    actions: [
      { label: 'Simple Query', queries: 1 },
      { label: 'Complex Query', queries: 5 },
      { label: 'Batch Queries (100)', queries: 100 }
    ]
  }
];

export default function PayPerUsePage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [usageHistory, setUsageHistory] = useState<any[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [balance, setBalance] = useState(50); // Mock balance

  const handleUse = async (service: any, action: any) => {
    setLoading(`${service.id}-${action.label}`);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      // Calculate cost based on usage
      const units = (action as any).calls || (action as any).minutes || (action as any).gb || (action as any).queries || 1;
      const cost = service.price * units;
      
      if (balance < cost) {
        toast.error('Insufficient balance!');
        setLoading(null);
        return;
      }

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#0033AD', '#00D4AA', '#10B981']
      });

      const usage = {
        service: service.name,
        action: action.label,
        units,
        unitType: service.unit,
        cost,
        time: new Date().toLocaleTimeString(),
        txHash: `0x${Math.random().toString(16).substr(2, 8)}`,
        processingTime: Math.floor(Math.random() * 500) + 100
      };

      setUsageHistory(prev => [usage, ...prev]);
      setTotalSpent(prev => prev + cost);
      setBalance(prev => prev - cost);

      toast.success(
        `⚡ Processed in ${usage.processingTime}ms!\nCost: ${cost.toFixed(4)} ADA`,
        { duration: 4000 }
      );
    } catch (error: any) {
      toast.error('Payment failed: ' + error.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#F8FAFC] mb-2">
            Pay-Per-Use Services
          </h1>
          <p className="text-[#94A3B8]">
            Pay only for resources you actually use - powered by Cardano L1 ⚡
          </p>
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-[#00D4AA]/10 border border-[#00D4AA]/30 rounded-lg">
            <Zap className="h-4 w-4 text-[#00D4AA]" />
            <span className="text-sm text-[#00D4AA] font-semibold">
              Metered billing • Instant payments • No minimums
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-4 bg-[#10B981]/10 border-[#10B981]/30">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-[#10B981]" />
              <div>
                <p className="text-sm text-[#94A3B8]">Balance</p>
                <p className="text-xl font-bold text-[#F8FAFC]">
                  {balance.toFixed(4)} ADA
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Server className="h-5 w-5 text-[#00D4AA]" />
              <div>
                <p className="text-sm text-[#94A3B8]">Total Usage</p>
                <p className="text-xl font-bold text-[#F8FAFC]">
                  {usageHistory.length} requests
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-[#F59E0B]" />
              <div>
                <p className="text-sm text-[#94A3B8]">Total Spent</p>
                <p className="text-xl font-bold text-[#F8FAFC]">
                  {totalSpent.toFixed(4)} ADA
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Pay-Per-Use Services */}
        <div className="grid md:grid-cols-2 gap-6">
          {PAY_PER_USE_SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <Card key={service.id} className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`${service.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#F8FAFC] mb-1">
                      {service.name}
                    </h3>
                    <p className="text-sm text-[#94A3B8] mb-2">
                      {service.description}
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00D4AA]/10 rounded-full">
                      <span className="text-sm font-bold text-[#00D4AA]">
                        {service.price} ADA
                      </span>
                      <span className="text-xs text-[#94A3B8]">
                        {service.unit}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {service.actions.map((action, idx) => {
                    const units = (action as any).calls || (action as any).minutes || (action as any).gb || (action as any).queries || 1;
                    const cost = service.price * units;
                    const isLoading = loading === `${service.id}-${action.label}`;
                    
                    return (
                      <Button
                        key={idx}
                        onClick={() => handleUse(service, action)}
                        disabled={isLoading}
                        variant="secondary"
                        className="w-full justify-between"
                        size="sm"
                      >
                        <span className="text-sm">{action.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#00D4AA]">
                            {cost.toFixed(4)} ADA
                          </span>
                          {isLoading ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Zap className="h-3 w-3 text-[#00D4AA]" />
                          )}
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Usage History */}
        {usageHistory.length > 0 && (
          <Card className="p-6">
            <h3 className="text-xl font-bold text-[#F8FAFC] mb-4">
              Usage History
            </h3>
            <div className="space-y-2">
              {usageHistory.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-[#0F172A] rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#F8FAFC]">
                      {item.service} - {item.action}
                    </p>
                    <p className="text-xs text-[#94A3B8]">
                      {item.time} • {item.processingTime}ms ⚡
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#00D4AA]">
                      {item.cost.toFixed(4)} ADA
                    </p>
                    <p className="text-xs text-[#94A3B8]">
                      {item.units} {item.unitType}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Why Pay-Per-Use */}
        <Card className="p-6 bg-gradient-to-br from-[#0033AD]/10 to-[#00D4AA]/10">
          <h3 className="text-xl font-bold text-[#F8FAFC] mb-4">
            💡 Why Pay-Per-Use?
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-[#F8FAFC] mb-2">
                ❌ Traditional Pricing
              </h4>
              <ul className="text-sm text-[#94A3B8] space-y-1">
                <li>• Pay for capacity, not usage</li>
                <li>• Minimum monthly fees</li>
                <li>• Waste money on unused resources</li>
                <li>• Complex pricing tiers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#10B981] mb-2">
                ✅ Pay-Per-Use on Cardano
              </h4>
              <ul className="text-sm text-[#94A3B8] space-y-1">
                <li>• Pay only for what you use</li>
                <li>• No minimums or commitments</li>
                <li>• Instant metered billing</li>
                <li>• Transparent, per-unit pricing</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
