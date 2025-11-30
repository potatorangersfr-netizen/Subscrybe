'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ArrowRight, 
  Zap, 
  Shield, 
  TrendingUp, 
  Users, 
  DollarSign,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function PaymentServicePage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDemoPayment = () => {
    setIsProcessing(true);
    setShowSuccess(false);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#0F172A] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#F8FAFC] mb-4">
            Payment Service Provider
          </h1>
          <p className="text-xl text-[#94A3B8]">
            Seamless payment processing between users and merchants on Cardano L1
          </p>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-[#334155] p-8">
            <h2 className="text-2xl font-bold text-[#F8FAFC] mb-6 flex items-center gap-2">
              <Zap className="h-6 w-6 text-[#00D4AA]" />
              How Our Payment Service Works
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-[#0F172A]/50 rounded-lg p-6 border border-[#334155]"
              >
                <div className="bg-[#0033AD]/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-[#0033AD]">1</span>
                </div>
                <h3 className="text-lg font-semibold text-[#F8FAFC] mb-2">User Initiates Payment</h3>
                <p className="text-[#94A3B8]">
                  User subscribes to a service and authorizes payment through our platform
                </p>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-[#0F172A]/50 rounded-lg p-6 border border-[#334155]"
              >
                <div className="bg-[#00D4AA]/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-[#00D4AA]">2</span>
                </div>
                <h3 className="text-lg font-semibold text-[#F8FAFC] mb-2">We Process & Route</h3>
                <p className="text-[#94A3B8]">
                  Our service validates, processes, and routes payment to the merchant on Cardano L1
                </p>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-[#0F172A]/50 rounded-lg p-6 border border-[#334155]"
              >
                <div className="bg-[#10B981]/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-[#10B981]">3</span>
                </div>
                <h3 className="text-lg font-semibold text-[#F8FAFC] mb-2">Merchant Receives</h3>
                <p className="text-[#94A3B8]">
                  Merchant gets payment minus our small commission fee (2.5%)
                </p>
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {/* Demo Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Payment Demo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-[#334155] p-8 h-full">
              <h2 className="text-2xl font-bold text-[#F8FAFC] mb-6">Try Demo Payment</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center p-4 bg-[#0F172A]/50 rounded-lg">
                  <span className="text-[#94A3B8]">Subscription Amount</span>
                  <span className="text-[#F8FAFC] font-semibold">10.00 ADA</span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-[#0F172A]/50 rounded-lg">
                  <span className="text-[#94A3B8]">Service Fee (2.5%)</span>
                  <span className="text-[#F8FAFC] font-semibold">0.25 ADA</span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-[#0F172A]/50 rounded-lg">
                  <span className="text-[#94A3B8]">Network Fee</span>
                  <span className="text-[#F8FAFC] font-semibold">0.17 ADA</span>
                </div>
                
                <div className="h-px bg-[#334155]" />
                
                <div className="flex justify-between items-center p-4 bg-[#0033AD]/10 rounded-lg border border-[#0033AD]">
                  <span className="text-[#F8FAFC] font-semibold">Total You Pay</span>
                  <span className="text-[#00D4AA] font-bold text-xl">10.42 ADA</span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-[#10B981]/10 rounded-lg border border-[#10B981]">
                  <span className="text-[#F8FAFC] font-semibold">Merchant Receives</span>
                  <span className="text-[#10B981] font-bold text-xl">9.75 ADA</span>
                </div>
              </div>

              <Button
                onClick={handleDemoPayment}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-[#0033AD] to-[#00D4AA] hover:opacity-90 transition-opacity"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Clock className="h-5 w-5 mr-2 animate-spin" />
                    Processing Payment...
                  </>
                ) : showSuccess ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Payment Successful!
                  </>
                ) : (
                  <>
                    Process Demo Payment
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>

              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-[#10B981]/10 border border-[#10B981] rounded-lg"
                >
                  <p className="text-[#10B981] text-sm">
                    ✓ Payment processed successfully on Cardano L1
                    <br />
                    ✓ Merchant received 9.75 ADA
                    <br />
                    ✓ Transaction confirmed in ~20 seconds
                  </p>
                </motion.div>
              )}
            </Card>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-[#334155] p-8 h-full">
              <h2 className="text-2xl font-bold text-[#F8FAFC] mb-6">Why Use Our Service?</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-[#0033AD]/10 p-3 rounded-lg">
                    <Shield className="h-6 w-6 text-[#0033AD]" />
                  </div>
                  <div>
                    <h3 className="text-[#F8FAFC] font-semibold mb-1">Secure & Reliable</h3>
                    <p className="text-[#94A3B8] text-sm">
                      All transactions processed on Cardano L1 with full blockchain security
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#00D4AA]/10 p-3 rounded-lg">
                    <DollarSign className="h-6 w-6 text-[#00D4AA]" />
                  </div>
                  <div>
                    <h3 className="text-[#F8FAFC] font-semibold mb-1">Low Commission</h3>
                    <p className="text-[#94A3B8] text-sm">
                      Only 2.5% service fee - much lower than traditional payment processors
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#10B981]/10 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-[#10B981]" />
                  </div>
                  <div>
                    <h3 className="text-[#F8FAFC] font-semibold mb-1">Easy Integration</h3>
                    <p className="text-[#94A3B8] text-sm">
                      Simple API for merchants to accept subscription payments
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#F59E0B]/10 p-3 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-[#F59E0B]" />
                  </div>
                  <div>
                    <h3 className="text-[#F8FAFC] font-semibold mb-1">Automated Recurring</h3>
                    <p className="text-[#94A3B8] text-sm">
                      Set it and forget it - automatic monthly subscription payments
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-[#334155] p-8">
            <h2 className="text-2xl font-bold text-[#F8FAFC] mb-6">Platform Statistics</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#00D4AA] mb-2">1,247</div>
                <div className="text-[#94A3B8] text-sm">Active Merchants</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-[#0033AD] mb-2">15,892</div>
                <div className="text-[#94A3B8] text-sm">Active Users</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-[#10B981] mb-2">₳2.4M</div>
                <div className="text-[#94A3B8] text-sm">Monthly Volume</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-[#F59E0B] mb-2">99.9%</div>
                <div className="text-[#94A3B8] text-sm">Uptime</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
