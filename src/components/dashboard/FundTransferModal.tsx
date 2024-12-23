'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface FundTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface User {
  user_id: string;
  firstname: string;
  lastname: string;
  email: string;
}

interface TransferResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const FundTransferModal = ({ isOpen, onClose }: FundTransferModalProps) => {
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('misc');
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/user-admin/list?page_size=1000`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        if (response.data.success) {
          setUsers(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
        toast.error('Failed to load users');
      }
    };

    if (token && isOpen) {
      fetchUsers();
    }
  }, [token, isOpen]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user => {
        const fullName = `${user.firstname} ${user.lastname}`.toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        return fullName.includes(searchLower) || 
               user.email.toLowerCase().includes(searchLower);
      });
      setFilteredUsers(filtered);
      setShowDropdown(true);
    } else {
      setFilteredUsers([]);
      setShowDropdown(false);
    }
  }, [searchTerm, users]);

  const handleTransfer = async () => {
    if (!selectedUser || !amount || !description) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!token) {
      toast.error('You are not authenticated. Please log in again.');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const response = await axios.post<TransferResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/wallet/user/${selectedUser.user_id}/credit`, 
        {
          amount: Number(amount),
          description
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('Funds transferred successfully');
        handleClose();
      } else {
        toast.error(response.data.message || 'Failed to transfer funds');
      }
    } catch (error: any) {
      console.error('Transfer failed:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to transfer funds');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSearchTerm('');
    setAmount('');
    setDescription('misc');
    setSelectedUser(null);
    setShowDropdown(false);
    onClose();
  };

  const selectUser = (user: User) => {
    setSelectedUser(user);
    setSearchTerm(`${user.firstname} ${user.lastname}`);
    setShowDropdown(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-dark">Transfer Funds</h2>

        <div className="space-y-4">
          <div className="relative">
            <label htmlFor="searchUser" className="block text-sm font-medium text-gray-700 mb-1">
              Search User
            </label>
            <Input
              id="searchUser"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email"
              className="w-full"
            />
            {showDropdown && filteredUsers.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredUsers.map(user => (
                  <div
                    key={user.user_id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => selectUser(user)}
                  >
                    <div>{`${user.firstname} ${user.lastname}`}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount (₦)
            </label>
            <Input
              id="amount"
              type="text"
              value={amount}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                setAmount(value);
              }}
              placeholder="Enter amount"
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <Input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              className="w-full"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6 w-full">
          <button
            onClick={handleClose}
            className="w-full px-4 py-2 border border-gray-300 text-dark hover:bg-gray-100 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleTransfer}
            disabled={!selectedUser || !amount || !description || isLoading}
            className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Processing...' : 'Transfer Funds'}
          </button>
        </div>
      </div>
    </Modal>
  );
};