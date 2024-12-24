'use client';
import React from 'react';


import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { useState } from 'react';

export const Header = () => {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-3 lg:px-4 h-10 lg:h-14 flex items-center justify-between relative">
        <Image
          src="/Nyra Logo.png"
          alt="Nyra Logo"
          width={75}
          height={75}
          className="w-[50px] lg:w-[75px]"
        />
        <button 
          className="text-gray-600 hover:text-gray-800 transition-colors p-1 lg:p-2"
          onClick={() => setShowMenu(!showMenu)}
        >
          <Menu className="h-4 w-4 lg:h-6 lg:w-6" />
        </button>

        {showMenu && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Home
            </button>
            <button
              onClick={() => router.push('/dashboard/users')}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Manage Users
            </button>
            <button
              onClick={() => router.push('/dashboard/transactions')}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Transactions
            </button>
            <button
              onClick={() => router.push('/dashboard/settings')}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Configuration
            </button>
            <button
              onClick={() => {
                // Add sign out logic here
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};