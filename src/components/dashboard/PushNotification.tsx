'use client';
import React from 'react';


import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { showToast } from '@/utils/toast';

const API_BASE_URL = 'https://api.usemelon.co/api/v1';

interface User {
  email: string;
  firstname: string;
  lastname: string;
  user_id: string;
}

export function PushNotification() {
  const { token } = useAuth();
  const [selectedUserType, setSelectedUserType] = useState('all');
  const [singleUserMethod, setSingleUserMethod] = useState('email'); // 'email' or 'search'
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch users for the dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      if (!token || singleUserMethod !== 'search') return;

      try {
        const response = await fetch(
          `${API_BASE_URL}/user-admin/list?page_size=1000`, // Increased page size to get full list
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const data = await response.json();
        if (data.success) {
          setUsers(data.data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        showToast.error('Failed to fetch users');
      }
    };

    fetchUsers();
  }, [token, singleUserMethod]);

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter(user => 
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
      setShowUserDropdown(true);
    } else {
      setFilteredUsers([]);
      setShowUserDropdown(false);
    }
  }, [searchQuery, users]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    showToast.loading('Sending notification...');

    try {
      const endpoint = selectedUserType === 'single'
        ? `${API_BASE_URL}/notifications/admin/user/send-push`
        : `${API_BASE_URL}/notifications/admin/send-push`;

      const payload = selectedUserType === 'single'
        ? { 
            email: singleUserMethod === 'email' ? userEmail : selectedUser?.email,
            title,
            body
          }
        : { title, body };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        showToast.success('Notification sent successfully');
        // Reset form
        setTitle('');
        setBody('');
        setSearchQuery('');
        setSelectedUser(null);
        setUserEmail('');
      } else {
        throw new Error(data.message || 'Failed to send notification');
      }
    } catch (error) {
      console.error('Error sending push notification:', error);
      showToast.error('Failed to send notification');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 lg:p-3.5 rounded-lg ">
      <h2 className="text-xl lg:text-lg font-bold text-gray-900 mb-6 lg:mb-3.5">Send Push</h2>
      <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-2.5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Who are you sending to?
          </label>
          <select
            className="w-full rounded-md border border-gray-300 p-2 lg:p-1.5"
            value={selectedUserType}
            onChange={(e) => setSelectedUserType(e.target.value)}
          >
            <option value="all">All users</option>
            <option value="single">Single user</option>
          </select>
        </div>

        {selectedUserType === 'single' && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="email"
                    checked={singleUserMethod === 'email'}
                    onChange={(e) => {
                      setSingleUserMethod(e.target.value);
                      setSelectedUser(null);
                      setSearchQuery('');
                    }}
                    className="mr-2 accent-[#11140E] text-[#11140E]"
                  />
                  Enter Email
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="search"
                    checked={singleUserMethod === 'search'}
                    onChange={(e) => {
                      setSingleUserMethod(e.target.value);
                      setUserEmail('');
                    }}
                    className="mr-2 accent-[#11140E] text-[#11140E]"
                  />
                  Search User
                </label>
              </div>
            </div>

            {singleUserMethod === 'email' && (
              <div>
                <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  User Email
                </label>
                <Input
                  type="email"
                  id="userEmail"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="Enter user email..."
                  className="w-full"
                />
              </div>
            )}

            {singleUserMethod === 'search' && (
              <div className="relative">
                <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-1">
                  Search User
                </label>
                <Input
                  type="text"
                  id="user"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by email or name..."
                  className="w-full"
                />
                {selectedUser && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium">{selectedUser.email}</p>
                    <p className="text-xs text-gray-500">
                      {selectedUser.firstname} {selectedUser.lastname}
                    </p>
                  </div>
                )}
                {showUserDropdown && filteredUsers.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredUsers.map((user) => (
                      <button
                        key={user.user_id}
                        type="button"
                        className="w-full px-4 py-2 text-left hover:bg-gray-50"
                        onClick={() => {
                          setSelectedUser(user);
                          setSearchQuery('');
                          setShowUserDropdown(false);
                        }}
                      >
                        <div className="text-sm font-medium">{user.email}</div>
                        <div className="text-xs text-gray-500">
                          {user.firstname} {user.lastname}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Notification Title
          </label>
          <Input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter notification title"
          />
        </div>

        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
            Notification Body
          </label>
          <Textarea
            id="body"
            rows={3}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Enter notification message"
          />
        </div>

        <div className="flex justify-end">
          <button 
            type="submit"
            disabled={
              isLoading || 
              (selectedUserType === 'single' && 
                ((singleUserMethod === 'email' && !userEmail) || 
                 (singleUserMethod === 'search' && !selectedUser))
              )
            }
            className="bg-primary text-dark py-2 lg:py-1.5 px-4 lg:px-2.5 rounded-md font-bold hover:opacity-90 disabled:opacity-50 min-w-[160px] flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#11140E]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : 'Send Notification'}
          </button>
        </div>
      </form>
    </div>
  );
}