'use client';

import { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Input, Select } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useApp } from '@/lib/context';
import toast from 'react-hot-toast';

interface AddSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddSubscriptionModal({ isOpen, onClose }: AddSubscriptionModalProps) {
  const { walletAddress, refreshSubscriptions } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    interval: 'monthly',
    category: 'Entertainment',
    startDate: new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    { value: 'Entertainment', label: 'Entertainment' },
    { value: 'Music', label: 'Music' },
    { value: 'DeFi', label: 'DeFi' },
    { value: 'Community', label: 'Community' },
    { value: 'Tools', label: 'Tools' },
    { value: 'Analytics', label: 'Analytics' },
    { value: 'Media', label: 'Media' },
    { value: 'Marketplace', label: 'Marketplace' },
  ];

  const intervals = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
  ];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      // Use demo wallet address if not connected
      const effectiveWalletAddress = walletAddress || 'addr1qxy8z9abc123def456ghi789jkl012mno345pqr678stu901vwx';
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/subscriptions/custom`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': effectiveWalletAddress,
        },
        body: JSON.stringify({
          name: formData.name,
          amount: parseFloat(formData.amount),
          interval: formData.interval,
          category: formData.category,
          startDate: formData.startDate,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Subscription added successfully!');
        await refreshSubscriptions();
        
        setFormData({ 
          name: '', 
          amount: '', 
          interval: 'monthly', 
          category: 'Entertainment',
          startDate: new Date().toISOString().split('T')[0]
        });
        setErrors({});
        onClose();
      } else {
        toast.error(data.error || 'Failed to add subscription');
      }
    } catch (error) {
      console.error('Failed to add subscription:', error);
      toast.error('Failed to add subscription');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader onClose={onClose}>Add Subscription</ModalHeader>
      <ModalBody>
        <div className="space-y-4">
          <Input
            label="Merchant Name"
            placeholder="e.g., Netflix, Spotify"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
          />
          
          <Input
            label="Amount (ADA)"
            type="number"
            step="0.01"
            placeholder="10"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            error={errors.amount}
          />
          
          <Input
            label="Start Date (First Payment)"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
          
          <Select
            label="Interval"
            options={intervals}
            value={formData.interval}
            onChange={(e) => setFormData({ ...formData, interval: e.target.value })}
          />
          
          <Select
            label="Category"
            options={categories}
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          Add Subscription
        </Button>
      </ModalFooter>
    </Modal>
  );
}
