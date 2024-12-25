'use client';
import React from 'react';

import { StatsCard } from './StatsCard';
import { QuickActionCard } from './QuickActionCard';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { useState, Suspense } from 'react';
import { EvacuateModal } from './EvacuateModal';
import { CreditWalletModal } from './CreditWalletModal';
import { FundTransferModal } from './FundTransferModal';

export const Overview = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [isEvacuateModalOpen, setIsEvacuateModalOpen] = useState(false);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  return (
    <div className="space-y-4 p-4 md:space-y-6 md:p-6">
      <div className="mb-6 md:mb-[54px]">
        <h2 className="text-lg font-medium text-gray-900 mb-4 md:text-xl md:mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 md:gap-4">
          <QuickActionCard
            title="Manage Users"
            description="View and manage user accounts"
            onClick={() => router.push('/dashboard/users')}
            className="bg-blue-50 hover:bg-blue-100"
          />
          <QuickActionCard
            title="Transactions"
            description="View all transaction history"
            onClick={() => router.push('/dashboard/transactions')}
            className="bg-green-50 hover:bg-green-100"
          />
          <QuickActionCard
            title="Configuration"
            description="Configure fees and percentages"
            onClick={() => router.push('/dashboard/settings')}
            className="bg-purple-50 hover:bg-purple-100"
          />
          <QuickActionCard
            title="Notifications"
            description="Send push notifications to users"
            onClick={() => router.push('/dashboard/notifications')}
            className="bg-orange-50 hover:bg-orange-100"
          />
          <QuickActionCard
            title="Send Email"
            description="Send emails to users"
            onClick={() => router.push('/dashboard/email')}
            className="bg-pink-50 hover:bg-pink-100"
          />
          <QuickActionCard
            title="Manage Wallets"
            description="View and manage user wallets"
            onClick={() => router.push('/dashboard/wallets')}
            className="bg-indigo-50 hover:bg-indigo-100"
          />
          <QuickActionCard
            title="Evacuate Funds"
            description="Evacuate funds from wallets"
            onClick={() => setIsEvacuateModalOpen(true)}
            className="bg-rose-50 hover:bg-rose-100"
          />
          <QuickActionCard
            title="Credit Wallet"
            description="Credit user wallets"
            onClick={() => setIsCreditModalOpen(true)}
            className="bg-rose-50 hover:bg-rose-100"
          />
          <QuickActionCard
            title="Fund Transfer"
            description="Transfer funds between wallets"
            onClick={() => setIsTransferModalOpen(true)}
            className="bg-rose-50 hover:bg-rose-100"
          />
        </div>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-4 md:mb-6">
        <h2 className="text-xl font-medium text-dark md:text-2xl">Overview</h2>
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-4">
          <select
            className="rounded-md border border-gray-300 p-2 w-full md:w-auto"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <Input
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatsCard title="Total Wallet Balance" value="₦0" type="wallet" />
        <StatsCard title="Total Fees" value="₦0" type="fees" />
        <StatsCard title="Airtime to Cash" value="₦0" type="airtime" />
        <StatsCard title="USD Balance" value="$0" type="usd" />
        <StatsCard title="Total Users" value="0" />
        <StatsCard title="Active Users" value="0" />
        <StatsCard title="Pending Transactions" value="0" />
        <StatsCard title="Failed Transactions" value="0" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 md:text-xl md:mb-6">
            Service Availability
          </h2>
          
          <div className="space-y-4 md:space-y-6">
            <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-dark font-medium text-sm md:text-base">Transfers</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#11140E]"></div>
                </label>
              </div>
            </div>

            <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-dark font-medium text-sm md:text-base">Airtime to Cash</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#11140E]"></div>
                </label>
              </div>
            </div>

            <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-dark font-medium text-sm md:text-base">Airtime Purchase</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#11140E]"></div>
                </label>
              </div>
            </div>

            <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-dark font-medium text-sm md:text-base">USD Card Creation</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#11140E]"></div>
                </label>
              </div>
            </div>

            <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-dark font-medium text-sm md:text-base">Data Purchase</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#11140E]"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 md:text-xl md:mb-6">
            Admin Actions
          </h2>
          
          <div className="space-y-4 md:space-y-6">
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        <EvacuateModal 
          isOpen={isEvacuateModalOpen}
          onClose={() => setIsEvacuateModalOpen(false)}
        />
        <CreditWalletModal 
          isOpen={isCreditModalOpen}
          onClose={() => setIsCreditModalOpen(false)}
        />
        <FundTransferModal 
          isOpen={isTransferModalOpen}
          onClose={() => setIsTransferModalOpen(false)}
        />
      </Suspense>
    </div>
  );
};