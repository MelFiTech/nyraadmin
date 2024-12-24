'use client';
import React from 'react';


import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PushNotification } from '@/components/dashboard/PushNotification';
import { useRouter } from 'next/navigation';

export default function NotificationsPage() {
  const router = useRouter();

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
          <span>Back</span>
        </button>

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl lg:text-xl font-medium text-dark">Push Notifications</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-2.5">
          <div className="bg-white p-4 lg:p-3 rounded-lg">
            <p className="text-sm text-gray-500">Total Notifications</p>
            <p className="text-xl lg:text-lg font-bold mt-1">1,234</p>
            <p className="text-xs text-green-600 mt-1">↗ 8.5% Up since last month</p>
          </div>
          <div className="bg-white p-4 lg:p-3 rounded-lg">
            <p className="text-sm text-gray-500">Delivered</p>
            <p className="text-xl lg:text-lg font-bold mt-1">1,180</p>
            <p className="text-xs text-green-600 mt-1">95.6% Success rate</p>
          </div>
          <div className="bg-white p-4 lg:p-3 rounded-lg">
            <p className="text-sm text-gray-500">Failed</p>
            <p className="text-xl lg:text-lg font-bold mt-1">54</p>
            <p className="text-xs text-red-600 mt-1">4.4% Failure rate</p>
          </div>
          <div className="bg-white p-4 lg:p-3 rounded-lg">
            <p className="text-sm text-gray-500">Open Rate</p>
            <p className="text-xl lg:text-lg font-bold mt-1">68%</p>
            <p className="text-xs text-green-600 mt-1">↗ 2.1% Up since last month</p>
          </div>
        </div>

        {/* Push Notification Form and Recent Notifications side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-3.5">
          {/* Push Notification Form */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 lg:p-3.5">
              <h2 className="text-lg lg:text-base font-medium mb-6 lg:mb-3.5">Send Push Notification</h2>
              <PushNotification />
            </div>
          </div>

          {/* Recent Notifications Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 lg:p-3.5">
              <h2 className="text-lg lg:text-base font-medium mb-6 lg:mb-3.5">Recent Notifications</h2>
              {/* Add your notifications history table here if needed */}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}