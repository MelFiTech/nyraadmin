'use client';
import React from 'react';


import { Overview } from '@/components/dashboard/Overview';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="p-3 lg:p-6">
        <Overview />
      </div>
    </DashboardLayout>
  );
}