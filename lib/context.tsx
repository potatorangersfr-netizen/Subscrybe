'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from './api-client';
import { mockUser } from './mock-data';

interface AppContextType {
  user: any;
  subscriptions: any[];
  setSubscriptions: React.Dispatch<React.SetStateAction<any[]>>;
  loading: boolean;
  connected: boolean;
  walletAddress: string | null;
  connectWallet: (address: string) => Promise<void>;
  addSubscription: (planId: string) => Promise<void>;
  cancelSubscription: (id: string) => Promise<void>;
  refreshSubscriptions: () => Promise<void>;
  showMeme: (type: string, title: string, message: string) => void;
  memeData: { type: string; title: string; message: string; show: boolean } | null;
  closeMeme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [memeData, setMemeData] = useState<any>(null);

  // Check if wallet is already connected on mount
  useEffect(() => {
    const walletAddress = typeof window !== 'undefined' ? localStorage.getItem('walletAddress') : null;
    if (walletAddress) {
      loadUserData();
    } else {
      // No wallet connected, use mock data
      setUser(mockUser);
      setConnected(false);
      // Don't set mock subscriptions - let them add their own
      setSubscriptions([]);
    }
  }, []);

  async function loadUserData() {
    try {
      setLoading(true);
      const userData = await api.users.getMe();
      setUser(userData);
      setConnected(true);
      
      const subs = await api.users.getMySubscriptions();
      setSubscriptions(subs);
    } catch (error) {
      console.error('Failed to load user data:', error);
      // Fallback to mock user if API fails
      setUser(mockUser);
      setConnected(false);
      // Clear invalid wallet address
      if (typeof window !== 'undefined') {
        localStorage.removeItem('walletAddress');
      }
    } finally {
      setLoading(false);
    }
  }

  async function connectWallet(address: string) {
    try {
      setLoading(true);
      const userData = await api.auth.connectWallet(address);
      setUser(userData);
      setConnected(true);
      
      // Load subscriptions
      await refreshSubscriptions();
      
      showMeme('success', 'Wallet Connected!', '🎉 Successfully connected to backend!');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function addSubscription(planId: string) {
    try {
      setLoading(true);
      await api.subscriptions.subscribe(planId);
      await refreshSubscriptions();
      showMeme('achievement', 'Subscription Added!', '🎉 Successfully subscribed!');
      
      // Check budget after adding subscription
      checkBudgetWarning();
    } catch (error) {
      console.error('Failed to add subscription:', error);
      showMeme('error', 'Failed', 'Could not add subscription');
      throw error;
    } finally {
      setLoading(false);
    }
  }

  function checkBudgetWarning() {
    if (!user || subscriptions.length === 0) return;
    
    // Calculate total monthly spending
    const monthlySpending = subscriptions
      .filter(s => s.status === 'active')
      .reduce((total, sub) => {
        const amount = sub.interval === 'yearly' ? sub.amount / 12 : sub.amount;
        return total + amount;
      }, 0);
    
    // Warn if spending > 80% of balance
    const spendingPercentage = (monthlySpending / user.balance) * 100;
    
    if (spendingPercentage > 80) {
      setTimeout(() => {
        showMeme(
          'warning',
          '⚠️ Budget Alert!',
          `You're spending ${spendingPercentage.toFixed(0)}% of your balance on subscriptions!`
        );
      }, 2000);
    }
  }

  async function cancelSubscription(id: string) {
    try {
      setLoading(true);
      
      // Remove subscription from local state
      setSubscriptions(prev => prev.filter(s => s.id !== id));
      
      // Check for cancellation milestone
      const cancelledCount = subscriptions.filter(s => s.status === 'cancelled').length + 1;
      if (cancelledCount >= 3) {
        showMeme('achievement', 'Subscription Minimalist', "You're a cancellation master! 🎯");
      } else {
        showMeme('success', 'Cancelled', 'Subscription cancelled successfully');
      }
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      showMeme('error', 'Failed', 'Could not cancel subscription');
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function refreshSubscriptions() {
    try {
      // If not connected, manually fetch with demo wallet
      const walletAddr = typeof window !== 'undefined' ? localStorage.getItem('walletAddress') : null;
      if (!walletAddr) {
        const demoWallet = 'addr1qxy8z9abc123def456ghi789jkl012mno345pqr678stu901vwx';
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/users/me/subscriptions`, {
          headers: {
            'x-wallet-address': demoWallet,
          },
        });
        const result = await response.json();
        if (result.success) {
          setSubscriptions(result.data);
        }
        return;
      }
      
      const subs = await api.users.getMySubscriptions();
      setSubscriptions(subs);
    } catch (error) {
      console.error('Failed to refresh subscriptions:', error);
    }
  }

  function showMeme(type: string, title: string, message: string) {
    setMemeData({ type, title, message, show: true });
    setTimeout(() => {
      setMemeData((prev: any) => (prev ? { ...prev, show: false } : null));
    }, 3000);
  }

  function closeMeme() {
    setMemeData((prev: any) => (prev ? { ...prev, show: false } : null));
  }

  const walletAddress = typeof window !== 'undefined' ? localStorage.getItem('walletAddress') : null;

  return (
    <AppContext.Provider
      value={{
        user,
        subscriptions,
        setSubscriptions,
        loading,
        connected,
        walletAddress,
        connectWallet,
        addSubscription,
        cancelSubscription,
        refreshSubscriptions,
        showMeme,
        memeData,
        closeMeme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
