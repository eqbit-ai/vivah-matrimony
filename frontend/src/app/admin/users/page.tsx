'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  UserPlus,
} from 'lucide-react';
import { adminApi } from '@/lib/api';
import { User, AdminSearchFilters } from '@/types';
import { cn, formatDate, getSubscriptionStatusColor } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [filters, setFilters] = useState<AdminSearchFilters>({
    page: 1,
    limit: 20,
  });

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getUsers({
        ...filters,
        page,
        search: searchTerm || undefined,
      });

      setUsers(response.data);
      setTotalPages(response.meta.totalPages);
      setTotal(response.meta.total);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchUsers();
  };

  const handleToggleActive = async (userId: string, isActive: boolean) => {
    setActionLoading(userId);
    try {
      await adminApi.updateUserStatus(
        userId,
        isActive ? 'SUSPENDED' : 'ACTIVE',
      );
      toast.success(isActive ? 'User suspended' : 'User activated');
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-400" />
            Manage Users
          </h1>
          <p className="text-gray-400 mt-1">{total} total users</p>
        </div>
        <Link
          href="/admin/users/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-white"
        >
          <UserPlus className="w-4 h-4" />
          New user
        </Link>
      </div>

      {/* Search */}
      <div className="bg-gray-800 rounded-xl p-4 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Search
        </button>
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left">User</th>
                  <th className="px-6 py-4 text-left">Subscription</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Joined</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4">
                      <p className="font-medium">
                        {user.profile?.firstName} {user.profile?.lastName}
                      </p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          'px-2 py-1 rounded-full text-xs',
                          getSubscriptionStatusColor(
                            user.subscription?.status || 'FREE',
                          ),
                        )}
                      >
                        {user.subscription?.status || 'FREE'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {user.isActive ? (
                        <span className="text-green-400 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Active
                        </span>
                      ) : (
                        <span className="text-red-400 flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> Suspended
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-400">
                      {formatDate(user.createdAt)}
                    </td>

                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() =>
                          window.open(`/admin/users/${user.id}`, '_blank')
                        }
                        className="p-2 hover:bg-gray-700 rounded"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        disabled={actionLoading === user.id}
                        onClick={() =>
                          handleToggleActive(user.id, user.isActive)
                        }
                        className="p-2 hover:bg-gray-700 rounded"
                      >
                        {actionLoading === user.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : user.isActive ? (
                          <XCircle className="w-4 h-4 text-red-400" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center px-6 py-4">
              <span className="text-sm text-gray-400">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft />
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
