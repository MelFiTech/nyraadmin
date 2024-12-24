'use client';
import React from 'react';


import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

interface CreditWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Bank {
  code: string;
  name: string;
}

interface CreditWalletResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}

export const CreditWalletModal = ({ isOpen, onClose }: CreditWalletModalProps) => {
  const { token } = useAuth();
  const [accountNumber, setAccountNumber] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [password, setPassword] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load saved account number on mount
  useEffect(() => {
    const savedAccountNumber = localStorage.getItem('lastAccountNumber');
    if (savedAccountNumber) {
      setAccountNumber(savedAccountNumber);
    }
  }, []);

  const banks: Bank[] = [

    {
      code: "090286",
      name: "SAFE HAVEN MICROFINANCE BANK"
    },
    {
      code: "120001",
      name: "9 PAYMICROFINANCENS BANK"
    },

    {
      code: "000014",
      name: "ACCESS BANK"
    },
    {
      code: "090267",
      name: "KUDA MICROFINANCE BANK"
    }
  ];

  const handleCredit = async () => {
    if (!accountNumber || !password || !bankCode || !amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!token) {
      toast.error('You are not authenticated. Please log in again.');
      return;
    }

    // Validate amount is a number
    if (isNaN(Number(amount))) {
      toast.error('Amount must be a valid number');
      return;
    }

    // Use env password only if user enters "Nyra"
    const actualPassword = password === 'Nyra' ? process.env.NEXT_PUBLIC_CREDIT_PASSWORD : password;
    
    try {
      setIsLoading(true);
      
      const response = await axios.post<CreditWalletResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/9psb/admin/credit-wallet`, 
        {
          password: actualPassword,
          account_number: accountNumber,
          bank_code: bankCode,
          amount: amount.toString()
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: false
        }
      );

      const { data } = response;

      if (data && data.success) {
        toast.success('Wallet credited successfully');
        // Save account number before resetting form
        localStorage.setItem('lastAccountNumber', accountNumber);
        // Reset form and close modal
        setPassword('');
        setBankCode('');
        setAmount('');
        onClose();
      } else {
        toast.error(data?.message || 'Failed to credit wallet');
      }
    } catch (error: Error | unknown) {
      console.error('Credit failed:', error);
      const err = error as { response?: { data?: { message: string } }, message?: string };
      toast.error(err?.response?.data?.message || err?.message || 'Failed to credit wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setBankCode('');
    setAmount('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-dark">Credit Wallet</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="bankCode" className="block text-sm font-medium text-gray-700 mb-1">
              Select Bank
            </label>
            <select
              id="bankCode"
              value={bankCode}
              onChange={(e) => setBankCode(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="">Select a bank</option>
              {banks.map(bank => (
                <option key={bank.code} value={bank.code}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Account Number
            </label>
            <Input
              id="accountNumber"
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Enter account number"
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <Input
              id="amount"
              type="text"
              value={amount}
              onChange={(e) => {
                // Only allow numbers and decimal point
                const value = e.target.value.replace(/[^0-9.]/g, '');
                // Prevent multiple decimal points
                if (value.split('.').length <= 2) {
                  setAmount(value);
                }
              }}
              placeholder="Enter amount"
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleCredit}
            disabled={!accountNumber || !password || !bankCode || !amount || isLoading}
            className="px-4 py-2 bg-primary text-dark font-bold rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Processing...' : 'Credit Wallet'}
          </button>
        </div>
      </div>
    </Modal>
  );
};