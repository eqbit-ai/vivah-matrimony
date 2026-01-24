'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Search, Filter, Eye, CheckCircle, XCircle, Crown,
  Loader2, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { adminApi } from '@/lib/api';
import { User, AdminSearchFilters, RELIGIONS, INDIAN_STATES } from '@/types';
import { cn, formatDate, getSubscriptionStatusColor } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<AdminSearchFilters>({
    page: 1,
    limit: 20,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [page, filters]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminApi.searchUsers({ ...filters, page, search: searchTerm });
      setUsers(response.data);
      setTotalPages(response.meta.totalPages);
      setTotal(response.meta.total);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchUsers();
  };

  const handleVerifyProfile = async (userId: string) => {
    setActionLoading(userId);
    try {
      await adminApi.verifyProfile(userId);
      toast.success('Profile verified successfully');
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to verify profile');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleActive = async (userId: string, isActive: boolean) => {
    setActionLoading(userId);
    try {
      if (isActive) {
        await adminApi.deactivateUser(userId, 'Admin action');
        toast.success('User deactivated');
      } else {
        await adminApi.reactivateUser(userId);
        toast.success('User reactivated');
      }
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-400" />
            Manage Users
          </h1>
          <p className="text-gray-400 mt-1">{total} total users</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-gray-800 rounded-xl p-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
          />
        </div>
        <select
          value={filters.gender || ''}
          onChange={(e) => setFilters({ ...filters, gender: e.target.value as any || undefined })}
          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
        >
          <option value="">All Genders</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
        </select>
        <select
          value={filters.subscriptionStatus || ''}
          onChange={(e) => setFilters({ ...filters, subscriptionStatus: e.target.value as any || undefined })}
          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
        >
          <option value="">All Subscriptions</option>
          <option value="FREE">Free</option>
          <option value="PAID">Paid</option>
          <option value="EXPIRED">Expired</option>
        </select>
        <button onClick={handleSearch} className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          Search
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">User</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Details</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Subscription</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Joined</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-bold text-sm">
                            {user.profile?.firstName?.[0]}{user.profile?.lastName?.[0]}
                          </div>
                          <div>
                            <p className="font-medium text-white">
                              {user.profile?.firstName} {user.profile?.lastName}
                            </p>
                            <p className="text-sm text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-white">
                          {user.profile?.age} yrs • {user.profile?.gender}
                        </p>
                        <p className="text-sm text-gray-400">
                          {user.profile?.city}, {user.profile?.state}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn('px-2 py-1 rounded-full text-xs', getSubscriptionStatusColor(user.subscription?.status || 'FREE'))}>
                          {user.subscription?.status || 'FREE'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {user.isActive ? (
                            <span className="flex items-center gap-1 text-green-400 text-sm">
                              <CheckCircle className="w-4 h-4" /> Active
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-red-400 text-sm">
                              <XCircle className="w-4 h-4" /> Inactive
                            </span>
                          )}
                          {user.profile?.isVerified && (
                            <span className="text-blue-400 text-xs">(Verified)</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => window.open(`/admin/users/${user.id}`, '_blank')}
                            className="p-2 hover:bg-gray-600 rounded-lg"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4 text-gray-400" />
                          </button>
                          {!user.profile?.isVerified && (
                            <button
                              onClick={() => handleVerifyProfile(user.id)}
                              disabled={actionLoading === user.id}
                              className="p-2 hover:bg-green-900/30 rounded-lg"
                              title="Verify Profile"
                            >
                              {actionLoading === user.id ? (
                                <Loader2 className="w-4 h-4 animate-spin text-green-400" />
                              ) : (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => handleToggleActive(user.id, user.isActive)}
                            disabled={actionLoading === user.id}
                            className={cn('p-2 rounded-lg', user.isActive ? 'hover:bg-red-900/30' : 'hover:bg-green-900/30')}
                            title={user.isActive ? 'Deactivate' : 'Reactivate'}
                          >
                            {user.isActive ? (
                              <XCircle className="w-4 h-4 text-red-400" />
                            ) : (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-700">
              <p className="text-sm text-gray-400">
                Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, total)} of {total} users
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="p-2 hover:bg-gray-700 rounded-lg disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="p-2 hover:bg-gray-700 rounded-lg disabled:opacity-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
