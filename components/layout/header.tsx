'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Wallet, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useApp } from '@/lib/context';
import { formatAddress, formatCurrency } from '@/lib/utils';
import { Button } from '../ui/button';
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from '../ui/dropdown';
import toast from 'react-hot-toast';

export function Header() {
  const { user, connected, connectWallet, loading } = useApp();
  const [copied, setCopied] = useState(false);

  const handleConnect = async () => {
    try {
      // Simulate wallet connection with a test address
      const testWalletAddress = 'addr1qxy8z9abc123def456ghi789jkl012mno345pqr678stu901vwx';
      await connectWallet(testWalletAddress);
      toast.success('Wallet connected to backend!');
    } catch (error) {
      toast.error('Failed to connect wallet');
      console.error(error);
    }
  };

  const handleCopy = () => {
    if (user?.walletAddress) {
      navigator.clipboard.writeText(user.walletAddress);
      setCopied(true);
      toast.success('Address copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="bg-[#1E293B] border-b border-[#334155] px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-[#0033AD] to-[#00D4AA] w-10 h-10 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#F8FAFC]">Subscrybe</h1>
            <p className="text-xs text-[#94A3B8]">Crypto Subscription Manager</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Blockchain Selector */}
          <Dropdown>
            <DropdownTrigger>
              <Button variant="secondary" className="flex items-center gap-2">
                <Image src="/icons/cardano.svg" width={20} height={20} alt="Cardano" />
                <span className="hidden md:inline">Cardano</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownTrigger>
            <DropdownContent>
              <DropdownItem active>
                <Image src="/icons/cardano.svg" width={16} height={16} alt="Cardano" />
                <span>Cardano (Active)</span>
              </DropdownItem>
              <DropdownItem 
                disabled 
                onClick={() => toast('Multi-chain support launching Q2 2025! Join the waitlist.')}
              >
                <Image src="/icons/ethereum.svg" width={16} height={16} alt="Ethereum" />
                <span>Ethereum (Coming Soon)</span>
              </DropdownItem>
              <DropdownItem 
                disabled
                onClick={() => toast('Multi-chain support launching Q3 2025! Join the waitlist.')}
              >
                <Image src="/icons/polygon.svg" width={16} height={16} alt="Polygon" />
                <span>Polygon (Coming Soon)</span>
              </DropdownItem>
              <DropdownItem 
                disabled
                onClick={() => toast('Multi-chain support launching Q3 2025! Join the waitlist.')}
              >
                <Image src="/icons/solana.svg" width={16} height={16} alt="Solana" />
                <span>Solana (Coming Soon)</span>
              </DropdownItem>
            </DropdownContent>
          </Dropdown>

          {/* Wallet Selector */}
          {user && (
            <Dropdown>
              <DropdownTrigger>
                <Button variant="secondary" className="flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  <span className="hidden md:inline">Nami</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownTrigger>
              <DropdownContent>
                <DropdownItem active>
                  <Wallet className="w-4 h-4" />
                  <span>Nami (Connected)</span>
                </DropdownItem>
                <DropdownItem onClick={() => toast('Eternl wallet support coming soon!')}>
                  <Wallet className="w-4 h-4" />
                  <span>Eternl</span>
                </DropdownItem>
                <DropdownItem 
                  disabled
                  onClick={() => toast('MetaMask support launching with Ethereum integration!')}
                >
                  <Wallet className="w-4 h-4" />
                  <span>MetaMask (Coming Soon)</span>
                </DropdownItem>
                <DropdownItem 
                  disabled
                  onClick={() => toast('Phantom support launching with Solana integration!')}
                >
                  <Wallet className="w-4 h-4" />
                  <span>Phantom (Coming Soon)</span>
                </DropdownItem>
              </DropdownContent>
            </Dropdown>
          )}

          {user ? (
            <>
              <div className="hidden lg:block">
                <p className="text-sm text-[#94A3B8] mb-1">Balance</p>
                <p className="text-lg font-semibold text-[#F8FAFC]">
                  {formatCurrency(user.balance || 0)}
                </p>
              </div>

              <div className="hidden md:flex items-center gap-2 bg-[#0F172A] px-4 py-2 rounded-lg border border-[#334155]">
                <code className="text-sm font-mono text-[#F8FAFC]">
                  {formatAddress(user.walletAddress || '')}
                </code>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCopy}
                  className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-[#10B981]" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </motion.button>
              </div>
            </>
          ) : (
            <Button onClick={handleConnect} loading={loading}>
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
