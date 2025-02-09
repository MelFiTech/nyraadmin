'use client';
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { TransactionTable } from '@/components/transactions/TransactionTable';
import type { ApiTransaction } from '@/types/transactions';

const API_BASE_URL = 'https://api.usemelon.co/api/v1';

interface ApiUser {
  created_at: string;
  updated_at: string;
  user_id: string;
  email: string;
  phone_number: string;
  firstname: string;
  lastname: string;
  role: string;
  active_status: string;
}

export default function UserDetailPage() {
  const router = useRouter();
  const { id: userId } = useParams();
  const { token } = useAuth();
  const [transactions, setTransactions] = useState<ApiTransaction[]>([]);

  // Fetch all users to find the specific user
  const { data: users, isLoading: isUsersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/user-admin/list?page_size=1000`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error('Failed to fetch users');
      }
      return data.data;
    },
    enabled: !!token
  });

  // Find the specific user from the users list
  const user = users?.find((u: ApiUser) => u.user_id === userId);

  // Fetch user transactions
  const { data: transactionsData = [], isLoading: isTransactionsLoading } = useQuery({
    queryKey: ['transactions', userId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/transactions/list?owner=${userId}&page_size=1000`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const txData = await response.json();
      return txData.success && Array.isArray(txData.data) ? txData.data : [];
    },
    enabled: !!userId && !!token
  });

  useEffect(() => {
    if (transactionsData.length > 0) {
      setTransactions(transactionsData);
    }
  }, [transactionsData]);

  const currentBalance = transactions.length > 0 
    ? transactions.sort((a: ApiTransaction, b: ApiTransaction) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].balance_after 
    : '0';

  const userInfoFields = [
    { label: 'User ID', value: user?.user_id || 'Loading...' },
    { label: 'Email address', value: user?.email || 'Loading...' },
    { label: 'Phone number', value: user?.phone_number || 'Loading...' },
    { label: 'Created At', value: user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Loading...' },
    { label: 'Updated At', value: user?.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'Loading...' },
    { label: 'Status', value: user?.active_status || 'Loading...' },
  ];

  const statsCards = [
    { label: 'Total balance', value: `₦${parseFloat(currentBalance).toLocaleString()}` },
    { label: 'No of transactions', value: transactions.length },
    { label: 'Credit transactions', value: transactions.filter((t: ApiTransaction) => t.transaction_type === 'CREDIT').length },
    { label: 'Debit transactions', value: transactions.filter((t: ApiTransaction) => t.transaction_type === 'DEBIT').length },
  ];

  if (isUsersLoading || isTransactionsLoading) {
    return <DashboardLayout>Loading...</DashboardLayout>;
  }

  if (!user) {
    return <DashboardLayout>User not found</DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-3.5 space-y-6 lg:space-y-3.5">
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Back to Users</span>
        </button>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-xl font-bold text-dark uppercase">{`${user.firstname} ${user.lastname}`}</h1>
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
              {user.role}
            </span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">Edit Customer</Button>
            <Button>Upgrade Account</Button>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-white p-6 lg:p-3.5 rounded-lg">
          <div className="flex items-start gap-6 lg:gap-3.5">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-lg font-bold uppercase">{user.firstname.charAt(0)}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-12 flex-1">
              {userInfoFields.map((field, index) => (
                <div key={index}>
                  <p className="text-sm text-gray-500">{field.label}</p>
                  <p className="text-sm font-medium">{field.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <Button variant="outline">View KYC docs</Button>
            <Button variant="outline">Reset Password</Button>
            <Button variant="outline" className="!text-red-600">PND</Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 lg:gap-2.5">
          {statsCards.map((card, index) => (
            <div key={index} className="bg-white p-4 lg:p-3 rounded-lg">
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-xl lg:text-lg font-bold mt-1">{card.value}</p>
              <p className="text-xs text-green-600 mt-1">↗ 8.5% Up since last month</p>
            </div>
          ))}
        </div>

        {/* Transactions Table */}
        <TransactionTable transactions={transactions} />
      </div>
    </DashboardLayout>
  );
}