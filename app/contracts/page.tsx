'use client';

import { motion } from 'framer-motion';
import { Copy, ExternalLink, CheckCircle, Code } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockContracts } from '@/lib/mock-data';
import { formatAddress } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function ContractsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (address: string, id: string) => {
    navigator.clipboard.writeText(address);
    setCopiedId(id);
    toast.success('Address copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-[#F8FAFC] mb-2">Smart Contracts</h1>
          <p className="text-[#94A3B8]">Deployed contracts on Cardano mainnet</p>
        </div>

        {/* Contract Status Overview */}
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-[#94A3B8]">Deployed Contracts</p>
                  <div className="bg-[#10B981]/10 p-2 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-[#10B981]" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-[#F8FAFC]">{mockContracts.length}</h3>
                <p className="text-xs text-[#10B981] mt-2">All operational</p>
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
                  <p className="text-sm text-[#94A3B8]">Network</p>
                  <div className="bg-[#0033AD]/10 p-2 rounded-lg">
                    <Code className="h-4 w-4 text-[#0033AD]" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#F8FAFC]">Mainnet</h3>
                <p className="text-xs text-[#94A3B8] mt-2">Cardano blockchain</p>
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
                  <p className="text-sm text-[#94A3B8]">Total Transactions</p>
                  <div className="bg-[#00D4AA]/10 p-2 rounded-lg">
                    <ExternalLink className="h-4 w-4 text-[#00D4AA]" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-[#F8FAFC]">1,247</h3>
                <p className="text-xs text-[#94A3B8] mt-2">Last 30 days</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Contract Cards */}
        <div className="space-y-4">
          {mockContracts.map((contract, index) => (
            <motion.div
              key={contract.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Card className="hover:border-[#0033AD] transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-[#F8FAFC]">
                          {contract.name}
                        </h3>
                        <span className="px-3 py-1 text-xs rounded-full bg-[#10B981]/10 text-[#10B981] flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          {contract.status}
                        </span>
                      </div>
                      <p className="text-sm text-[#94A3B8] mb-4">{contract.description}</p>
                      
                      <div className="bg-[#0F172A] rounded-lg p-4 border border-[#334155]">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-xs text-[#94A3B8] mb-1">Contract Address</p>
                            <code className="text-sm font-mono text-[#F8FAFC]">
                              {formatAddress(contract.address, 12, 12)}
                            </code>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(contract.address, contract.id)}
                            >
                              {copiedId === contract.id ? (
                                <CheckCircle className="h-4 w-4 text-[#10B981]" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(`https://cardanoscan.io/address/${contract.address}`, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contract Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-[#334155]">
                    <div>
                      <p className="text-xs text-[#94A3B8] mb-1">Transactions</p>
                      <p className="text-lg font-semibold text-[#F8FAFC]">
                        {Math.floor(Math.random() * 500) + 100}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#94A3B8] mb-1">Total Value</p>
                      <p className="text-lg font-semibold text-[#F8FAFC]">
                        {(Math.random() * 10000 + 1000).toFixed(0)} ₳
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#94A3B8] mb-1">Last Activity</p>
                      <p className="text-lg font-semibold text-[#F8FAFC]">
                        {Math.floor(Math.random() * 24) + 1}h ago
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Contract Validation Examples */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold text-[#F8FAFC]">Contract Validation Examples</h3>
            <p className="text-sm text-[#94A3B8] mt-1">See how the smart contract validates transactions</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Success Case */}
              <div className="bg-[#10B981]/5 border border-[#10B981]/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#10B981] mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#10B981] mb-2">✓ Valid Payment Transaction</h4>
                    <code className="text-xs text-[#94A3B8] block bg-[#0F172A] p-3 rounded">
                      Validation: Payment is due (current time &gt; lastPayment + interval)<br/>
                      Validation: Correct amount (10 ADA) sent to merchant<br/>
                      Validation: Vault continues with updated state<br/>
                      Result: Transaction approved ✓
                    </code>
                  </div>
                </div>
              </div>

              {/* Error Cases */}
              <div className="bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-[#EF4444] flex items-center justify-center text-white text-xs font-bold mt-0.5">!</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#EF4444] mb-2">✗ Payment Not Due Yet</h4>
                    <code className="text-xs text-[#94A3B8] block bg-[#0F172A] p-3 rounded">
                      Error: "Payment not due yet"<br/>
                      Current time: 2025-01-10 12:00:00<br/>
                      Next payment: 2025-01-15 12:00:00<br/>
                      Result: Transaction rejected ✗
                    </code>
                  </div>
                </div>
              </div>

              <div className="bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-[#EF4444] flex items-center justify-center text-white text-xs font-bold mt-0.5">!</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#EF4444] mb-2">✗ Incorrect Payment Amount</h4>
                    <code className="text-xs text-[#94A3B8] block bg-[#0F172A] p-3 rounded">
                      Error: "Incorrect payment amount"<br/>
                      Expected: 10 ADA<br/>
                      Received: 8 ADA<br/>
                      Result: Transaction rejected ✗
                    </code>
                  </div>
                </div>
              </div>

              <div className="bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-[#EF4444] flex items-center justify-center text-white text-xs font-bold mt-0.5">!</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#EF4444] mb-2">✗ Unauthorized Cancellation</h4>
                    <code className="text-xs text-[#94A3B8] block bg-[#0F172A] p-3 rounded">
                      Error: "Only subscriber can cancel"<br/>
                      Subscriber: addr1qxy8z9abc...<br/>
                      Signer: addr1merchant123...<br/>
                      Result: Transaction rejected ✗
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Details */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold text-[#F8FAFC]">Technical Details</h3>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-[#F8FAFC] mb-3">Contract Features</h4>
                <ul className="space-y-2 text-sm text-[#94A3B8]">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#10B981]" />
                    Plutus V2 smart contracts
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#10B981]" />
                    Automated subscription payments
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#10B981]" />
                    Hydra Head integration ready
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#10B981]" />
                    Multi-signature support
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-[#F8FAFC] mb-3">Security</h4>
                <ul className="space-y-2 text-sm text-[#94A3B8]">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#10B981]" />
                    Audited by Certik
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#10B981]" />
                    Formal verification completed
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#10B981]" />
                    Bug bounty program active
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#10B981]" />
                    Open source on GitHub
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
