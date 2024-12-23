'use client';

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/Table';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  id: string;
}

interface UserListResponse {
  statusCode: number;
  status: string;
  success: boolean;
  error: string;
  message: string;
  data: User[];
  meta?: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}

const API_BASE_URL = 'https://api.usemelon.co/api/v1';

interface UserTableProps {
  searchQuery?: string;
  filter?: string;
  pageSize?: number;
  onRowClick?: (userId: string) => void;
}

export function UserTable({ 
  searchQuery = '', 
  filter = 'all',
  pageSize = 1000,
  onRowClick
}: UserTableProps) {
  const router = useRouter();
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    currentPage: 1,
    pageSize: pageSize,
    totalPages: 0
  });

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) {
        setError('Authentication required');
        setIsLoading(false);
        return;
      }

      try {
        const params = new URLSearchParams({
          page_size: '1000'
        });

        if (searchQuery) {
          params.append('search', searchQuery);
        }

        if (filter !== 'all') {
          params.append('status', filter.toUpperCase());
        }

        const response = await fetch(
          `${API_BASE_URL}/user-admin/list?${params.toString()}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const data: UserListResponse = await response.json();

        if (data.success) {
          const usersWithId = data.data.map(user => ({
            ...user,
            id: user.user_id
          }));
          setUsers(usersWithId);
          if (data.meta) {
            setPagination({
              total: data.meta.total,
              currentPage: 1,
              pageSize: 1000,
              totalPages: Math.ceil(data.meta.total / 1000)
            });
          }
          setError(null);
        } else {
          setError(data.message || 'Failed to fetch users');
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [token, searchQuery, filter]);

  const handlePageChange = (newPage: number) => {
    console.log('Pagination not implemented');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-gray-500">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S/N</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, index) => (
              <TableRow 
                key={user.user_id}
                onClick={() => onRowClick ? onRowClick(user.user_id) : router.push(`/dashboard/users/${user.user_id}`)}
                className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell className="font-medium">
                  {`${user.firstname} ${user.lastname}`}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone_number}</TableCell>
                <TableCell>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${user.active_status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                      user.active_status === 'INACTIVE' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {user.active_status.toLowerCase()}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('PND user:', user.user_id);
                    }}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    PND
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="bg-gray-50 px-6 py-3 lg:px-3.5 lg:py-2 flex items-center justify-between border-t">
        <div className="text-sm lg:text-xs text-gray-500">
          Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1} to{' '}
          {Math.min(pagination.currentPage * pagination.pageSize, pagination.total)} of{' '}
          {pagination.total} results
        </div>
        <div className="flex gap-2 lg:gap-1.5">
          <button 
            className="px-3 py-1 lg:px-2 lg:py-0.5 border rounded text-sm lg:text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          >
            Previous
          </button>
          <button 
            className="px-3 py-1 lg:px-2 lg:py-0.5 border rounded text-sm lg:text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}