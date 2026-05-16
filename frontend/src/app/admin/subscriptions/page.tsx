'use client';

import { useState, useEffect } from 'react';
import { Crown, Loader2, ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { formatDate, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface AdminSubscription {
  id: string;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'CANCELLED' | string;
  plan?: { name?: string; id?: string };
  planName?: string;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  user?: { id: string; email: string; profile?: { firstName?: string; lastName?: string } };
}

const statusStyles: Record<string, string> = {
  ACTIVE: 'bg-green-900/40 text-green-300',
  INACTIVE: 'bg-gray-700 text-gray-300',
  EXPIRED: 'bg-red-900/40 text-red-300',
  CANCELLED: 'bg-red-900/40 text-red-300',
};

export default function AdminSubscriptionsPage() {
  const [subs, setSubs] = useState<AdminSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    fetchSubs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchSubs = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getSubscriptions({ page, limit: 20 });
      const data = response.data || response;
      setSubs(Array.isArray(data) ? data : []);
      setTotalPages(response.meta?.totalPages || 1);
      setTotal(response.meta?.total || data.length || 0);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (sub: AdminSubscription) => {
    if (!sub.user?.id) return;
    setActionId(sub.id);
    try {
      if (sub.status === 'ACTIVE') {
        await adminApi.deactivateSubscription(sub.user.id);
        toast.success('Subscription deactivated');
      } else {
        await adminApi.activateSubscription(sub.user.id, sub.plan?.id);
        toast.success('Subscription activated');
      }
      fetchSubs();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setActionId(null);
    }
  };

  const displayName = (u?: AdminSubscription['user']) =>
    u?.profile?.firstName ? `${u.profile.firstName} ${u.profile.lastName || ''}`.trim() : u?.email || '—';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-3">
          <Crown className="w-8 h-8 text-yellow-400" />
          Subscriptions
        </h1>
        <p className="text-gray-400 mt-1">{total} total subscriptions</p>
      </div>

      <div className="bg-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : subs.length === 0 ? (
          <div className="py-20 text-center text-gray-400">No subscriptions yet</div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left">User</th>
                  <th className="px-6 py-4 text-left">Plan</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Ends</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {subs.map((s) => (
                  <tr key={s.id}>
                    <td className="px-6 py-4">
                      <p className="font-medium">{displayName(s.user)}</p>
                      <p className="text-xs text-gray-400">{s.user?.email}</p>
                    </td>
                    <td className="px-6 py-4">{s.plan?.name || s.planName || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={cn('px-2 py-1 rounded-full text-xs', statusStyles[s.status] || 'bg-gray-700')}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{s.endDate ? formatDate(s.endDate) : '—'}</td>
                    <td className="px-6 py-4">
                      <button
                        disabled={actionId === s.id || !s.user?.id}
                        onClick={() => handleToggle(s)}
                        className="flex items-center gap-1 text-sm hover:text-white"
                      >
                        {actionId === s.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : s.status === 'ACTIVE' ? (
                          <>
                            <XCircle className="w-4 h-4 text-red-400" />
                            <span>Deactivate</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>Activate</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center px-6 py-4">
              <span className="text-sm text-gray-400">Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage(page - 1)} className="p-2 disabled:opacity-30">
                  <ChevronLeft />
                </button>
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="p-2 disabled:opacity-30">
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
