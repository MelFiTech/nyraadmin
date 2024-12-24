'use client';
import React from 'react';


import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft, Copy, Loader2, ChevronLeft, ChevronRight, ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';

interface Owner {
  firstname: string;
  middlename: string;
  lastname: string;
  email: string;
  phone_number: string;
  username: string | null;
}

interface Wallet {
  created_at: string;
  updated_at: string;
  wallet_id: string;
  balance: string;
  total_credit: string;
  total_debit: string;
  wallet_pin_changed: boolean | null;
  frozen: boolean;
  owner: Owner;
}

export default function WalletsPage() {
  const { token } = useAuth();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    minBalance: '',
    maxBalance: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/wallet/users?page_size=1000`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.data.success) {
          setWallets(response.data.data);
        }
      } catch {
        toast.error('Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const filteredWallets = wallets.filter(wallet => {
    const matchesSearch = wallet.wallet_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wallet.owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${wallet.owner.firstname} ${wallet.owner.lastname}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filters.status === 'all' ? true : 
      filters.status === 'active' ? !wallet.frozen : wallet.frozen;
    const balance = parseFloat(wallet.balance);
    const matchesMinBalance = !filters.minBalance || balance >= parseFloat(filters.minBalance);
    const matchesMaxBalance = !filters.maxBalance || balance <= parseFloat(filters.maxBalance);
    
    return matchesSearch && matchesStatus && matchesMinBalance && matchesMaxBalance;
  });

  const totalBalance = wallets.reduce((sum, wallet) => sum + parseFloat(wallet.balance), 0);
  const totalCredit = wallets.reduce((sum, wallet) => sum + parseFloat(wallet.total_credit), 0);
  const totalDebit = wallets.reduce((sum, wallet) => sum + parseFloat(wallet.total_debit), 0);
  const totalCreditCount = wallets.reduce((sum, wallet) => sum + (parseFloat(wallet.total_credit) > 0 ? 1 : 0), 0);
  const totalDebitCount = wallets.reduce((sum, wallet) => sum + (parseFloat(wallet.total_debit) > 0 ? 1 : 0), 0);
  const totalWallets = wallets.length;

  // Calculate balance change percentage, capped at 100%
  const balanceChange = totalCredit - totalDebit;
  const balanceChangePercentage = Math.min(
    Math.abs(totalBalance ? (balanceChange / totalBalance) * 100 : 0),
    100
  );
  const isPositiveChange = balanceChange >= 0;

  const handleCopyWalletId = (walletId: string) => {
    navigator.clipboard.writeText(walletId);
    toast.success('Wallet ID copied to clipboard');
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredWallets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentWallets = filteredWallets.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <DashboardLayout>
      {isLoading ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
            <span className="text-white">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="p-6 lg:p-8 space-y-6">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Manage Wallets</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatsCard
              title="Total Balance"
              value={<span className="font-bold">₦{formatCurrency(totalBalance)}</span>}
              description={
                <div className={`flex items-center gap-1 ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositiveChange ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
                  <span>{balanceChangePercentage.toFixed(2)}%</span>
                </div>
              }
              className="bg-blue-50"
            />
            <StatsCard
              title="Total Credit"
              value={<span className="font-bold">₦{formatCurrency(totalCredit)}</span>}
              description={
                <div className={`flex items-center gap-1 ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositiveChange ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
                  <span>{balanceChangePercentage.toFixed(2)}%</span>
                </div>
              }
              className="bg-green-50"
            />
            <StatsCard
              title="Total Debit"
              value={<span className="font-bold">₦{formatCurrency(totalDebit)}</span>}
              description=""
              className="bg-red-50"
            />
            <StatsCard
              title="Credit Transactions"
              value={<span className="font-bold">{totalCreditCount.toString()}</span>}
              description=""
              className="bg-emerald-50"
            />
            <StatsCard
              title="Debit Transactions"
              value={<span className="font-bold">{totalDebitCount.toString()}</span>}
              description=""
              className="bg-orange-50"
            />
            <StatsCard
              title="Total Wallets"
              value={<span className="font-bold">{totalWallets.toString()}</span>}
              description=""
              className="bg-purple-50"
            />
          </div>

          <div className="overflow-x-auto">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">All Wallets</h2>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Search by wallet ID, email or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                />
                
                <select 
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({...prev, status: e.target.value}))}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="frozen">Frozen</option>
                </select>

                <input
                  type="number"
                  placeholder="Min Balance"
                  value={filters.minBalance}
                  onChange={(e) => setFilters(prev => ({...prev, minBalance: e.target.value}))}
                  className="px-4 py-2 border border-gray-300 rounded-md w-32"
                />

                <input
                  type="number"
                  placeholder="Max Balance"
                  value={filters.maxBalance}
                  onChange={(e) => setFilters(prev => ({...prev, maxBalance: e.target.value}))}
                  className="px-4 py-2 border border-gray-300 rounded-md w-32"
                />
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg h-[700px] flex flex-col">
              <div className="overflow-y-auto flex-1">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Wallet ID
                      </th>
                      <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Balance
                      </th>
                      <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Credit
                      </th>
                      <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Debit
                      </th>
                      <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Updated
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentWallets.map((wallet) => (
                      <tr key={wallet.wallet_id} className="hover:bg-gray-50">
                        <td className="w-1/6 px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {`${wallet.owner.firstname} ${wallet.owner.lastname}`}
                        </td>
                        <td className="w-1/6 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <div className="flex items-center space-x-2">
                            <span>{wallet.wallet_id.slice(0, 8)}...</span>
                            <Copy 
                              className="w-4 h-4 cursor-pointer hover:text-gray-700" 
                              onClick={() => handleCopyWalletId(wallet.wallet_id)}
                            />
                          </div>
                        </td>
                        <td className="w-1/6 px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                          ₦{formatCurrency(parseFloat(wallet.balance))}
                        </td>
                        <td className="w-1/6 px-6 py-4 whitespace-nowrap text-sm text-orange-600">
                          ₦{formatCurrency(parseFloat(wallet.total_credit))}
                        </td>
                        <td className="w-1/6 px-6 py-4 whitespace-nowrap text-sm text-red-600">
                          ₦{formatCurrency(parseFloat(wallet.total_debit))}
                        </td>
                        <td className="w-1/6 px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(wallet.updated_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="mt-4 flex items-center justify-between p-4 border-t border-gray-200 bg-white">
                <div className="text-sm text-gray-700">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredWallets.length)} of {filteredWallets.length} results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-md ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}