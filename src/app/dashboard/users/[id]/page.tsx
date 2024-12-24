'use client';
import React from 'react';


import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog } from '@/components/ui/Dialog';
import { useQuery } from '@tanstack/react-query';

const API_BASE_URL = 'https://api.usemelon.co/api/v1';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  nin: string;
  accountNumber: string;
  dateOfBirth: string;
  bvn: string;
  dateCreated: string;
  bankName: string;
  tier: string;
  balance: string;
  transactions: UserTransactions;
}

interface UserTransactions {
  total: number;
  credit: number;
  debit: number;
}

interface ApiTransaction {
  created_at: string;
  transaction_id: string;
  transaction_type: 'CREDIT' | 'DEBIT';
  transaction_category: string;
  transaction_status: string;
  balance_before: string;
  balance_after: string;
  description: string;
  amount: string;
  payment_provider: string;
  charge: string;
  meta: TransactionMeta;
}

interface TransactionMeta {
  beneficiary?: {
    account_name: string;
    account_number: string;
  };
  [key: string]: unknown;
}

export default function UserDetailPage() {
  const router = useRouter();
  const { id: userId } = useParams();
  const { token } = useAuth();
  const [selectedTransaction, setSelectedTransaction] = useState<ApiTransaction | null>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  // Fetch user details
  const { data: apiUser, isLoading: isUserLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/admin/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const userData = await response.json();
      if (!userData.success) {
        throw new Error('Failed to fetch user');
      }
      return userData.data;
    },
    enabled: !!userId && !!token
  });

  // Fetch user transactions
  const { data: transactions = [], isLoading: isTransactionsLoading } = useQuery({
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

  const currentBalance = transactions.length > 0 
    ? transactions.sort((a: ApiTransaction, b: ApiTransaction) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].balance_after 
    : '0';

  const handleTransactionClick = (transaction: ApiTransaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionModal(true);
  };

  // Construct user object combining API data and placeholder data
  const user: User = {
    id: apiUser?.user_id || userId as string,
    name: apiUser ? `${apiUser.firstname} ${apiUser.lastname}` : 'Loading...',
    email: apiUser?.email || 'Loading...',
    phone: apiUser?.phone_number || 'Loading...',
    nin: 'NULL',
    accountNumber: 'NULL',
    dateOfBirth: 'NULL',
    bvn: 'NULL',
    dateCreated: apiUser?.created_at ? new Date(apiUser.created_at).toLocaleDateString() : 'Loading...',
    bankName: 'NULL',
    tier: apiUser?.role || 'Loading...',
    balance: `₦${parseFloat(currentBalance).toLocaleString()}`,
    transactions: {
      total: transactions.length,
      credit: transactions.filter((t: ApiTransaction) => t.transaction_type === 'CREDIT').length,
      debit: transactions.filter((t: ApiTransaction) => t.transaction_type === 'DEBIT').length
    }
  };

  const userInfoFields = [
    { label: 'User ID', value: user.id },
    { label: 'Email address', value: user.email },
    { label: 'Phone number', value: user.phone },
    { label: 'NIN number', value: user.nin },
    { label: 'Account number', value: user.accountNumber },
    { label: 'Date of birth', value: user.dateOfBirth },
    { label: 'BVN', value: user.bvn },
    { label: 'Date created', value: user.dateCreated },
    { label: 'Bank name', value: user.bankName },
  ];

  const statsCards = [
    { label: 'Total balance', value: user.balance },
    { label: 'No of transactions', value: user.transactions.total },
    { label: 'Credit transactions', value: user.transactions.credit },
    { label: 'Debit transactions', value: user.transactions.debit },
  ];

  if (isUserLoading || isTransactionsLoading) {
    return <DashboardLayout>Loading...</DashboardLayout>;
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
            <h1 className="text-2xl lg:text-xl font-medium text-dark">{user.name}</h1>
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
              {user.tier}
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
                <span className="text-gray-500 text-lg">{user.name.charAt(0)}</span>
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
        <div className="bg-white rounded-lg flex flex-col h-[500px]">
          <div className="p-4 lg:p-3 border-b">
            <h2 className="text-lg lg:text-base font-medium">Transactions</h2>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((tx: ApiTransaction) => (
                  <tr 
                    key={tx.transaction_id}
                    onClick={() => handleTransactionClick(tx)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tx.transaction_type === 'CREDIT' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {tx.transaction_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₦{Math.abs(parseFloat(tx.amount)).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tx.transaction_status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tx.transaction_category}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transaction Detail Modal */}
        <Dialog
          open={showTransactionModal}
          onClose={() => setShowTransactionModal(false)}
          title="Transaction Details"
        >
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Transaction ID</p>
                  <p className="font-medium">{selectedTransaction.transaction_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">
                    {new Date(selectedTransaction.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-medium">₦{Math.abs(parseFloat(selectedTransaction.amount)).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">{selectedTransaction.transaction_status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{selectedTransaction.transaction_category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Provider</p>
                  <p className="font-medium">{selectedTransaction.payment_provider}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Balance Before</p>
                  <p className="font-medium">₦{parseFloat(selectedTransaction.balance_before).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Balance After</p>
                  <p className="font-medium">₦{parseFloat(selectedTransaction.balance_after).toLocaleString()}</p>
                </div>
                {selectedTransaction.meta?.beneficiary && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Beneficiary</p>
                    <p className="font-medium">
                      {selectedTransaction.meta.beneficiary.account_name} - {selectedTransaction.meta.beneficiary.account_number}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </Dialog>
      </div>
    </DashboardLayout>
  );
}