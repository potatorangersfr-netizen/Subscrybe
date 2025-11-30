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
  const { walletAddress, setSubscriptions } = useApp();
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
      // Add subscription directly to context (client-side only for demo)
      const newSubscription = {
        id: `custom-${Date.now()}`,
        name: formData.name,
        merchantName: formData.name,
        amount: parseFloat(formData.amount),
        interval: formData.interval,
        category: formData.category,
        status: 'active',
        nextPayment: formData.startDate,
        logoUrl: null,
      };

      // Add to subscriptions list
      setSubscriptions((prev: any[]) => [...prev, newSubscription]);

      toast.success('Subscription added successfully!');
      
      setFormData({ 
        name: '', 
        amount: '', 
        interval: 'monthly', 
        category: 'Entertainment',
        startDate: new Date().toISOString().split('T')[0]
      });
      setErrors({});
      onClose();
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
