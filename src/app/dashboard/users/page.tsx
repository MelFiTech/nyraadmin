'use client';
import React from 'react';


import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { UserFilter } from '@/components/users/UserFilter';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface User {
  user_id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone_number: string;
  active_status: string;
  created_at: string;
  role: string;
}

interface UserListResponse {
  statusCode: number;
  status: string;
  success: boolean;
  error: string;
  message: string;
  data: User[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [totalUsers, setTotalUsers] = useState<number | null>(0);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { token } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return;

      try {
        const response = await fetch(
          `${API_BASE_URL}/user-admin/list?page_size=1000`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const data: UserListResponse = await response.json();
        if (data.success) {
          setUsers(data.data);
          setTotalUsers(data.data.length);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const handleUserClick = (userId: string) => {
    router.push(`/dashboard/users/${userId}`);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || user.active_status.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-2.5 mb-6 lg:mb-3.5">
          <StatsCard 
            title="Total Users" 
            value={totalUsers?.toString() || '-'} 
          />
          <StatsCard title="New Users" value="-" />
          <StatsCard title="Active Users" value="-" />
          <StatsCard title="Inactive Users" value="-" />
        </div>

        <div className="flex items-center justify-between gap-4 lg:gap-2.5">
          <h2 className="text-2xl lg:text-xl font-medium text-dark">Users</h2>
          <div className="flex items-center gap-4 lg:gap-2.5">
            <Input
              type="search"
              placeholder="Search users..."
              className="w-[300px] lg:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <UserFilter 
              value={filter}
              onChange={setFilter}
            />
            <button className="bg-primary text-dark px-4 py-2 lg:px-2.5 lg:py-1.5 rounded-lg font-medium hover:bg-primary/90 whitespace-nowrap">
              Export Users
            </button>
          </div>
        </div>

        <main className="h-[calc(100vh-250px)] lg:h-[calc(100vh-150px)] bg-white rounded-lg shadow flex flex-col">
          <div className="flex-1 overflow-auto relative">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <p>Loading...</p>
              </div>
            ) : (
              <table className="min-w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr 
                      key={user.user_id}
                      onClick={() => handleUserClick(user.user_id)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.user_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {`${user.firstname} ${user.lastname}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.active_status}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}