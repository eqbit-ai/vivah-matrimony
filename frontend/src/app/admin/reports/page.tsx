'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Loader2, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { formatDate, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface AdminLog {
  id: string;
  action: string;
  entityType?: string;
  entityId?: string;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  actor?: { id: string; email: string };
}

const actionColor = (action: string) => {
  const a = action.toLowerCase();
  if (a.includes('delete') || a.includes('deactivate') || a.includes('suspend')) return 'text-red-400';
  if (a.includes('create') || a.includes('activate') || a.includes('verify')) return 'text-green-400';
  if (a.includes('update') || a.includes('edit')) return 'text-yellow-400';
  return 'text-gray-300';
};

export default function AdminReportsPage() {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getLogs({ page, limit: 30 });
      const data = response.data || response;
      setLogs(Array.isArray(data) ? data : []);
      setTotalPages(response.meta?.totalPages || 1);
      setTotal(response.meta?.total || data.length || 0);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-purple-400" />
          Reports & Activity
        </h1>
        <p className="text-gray-400 mt-1">{total} log entries</p>
      </div>

      <div className="bg-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : logs.length === 0 ? (
          <div className="py-20 text-center text-gray-400">No activity yet</div>
        ) : (
          <>
            <ul className="divide-y divide-gray-700">
              {logs.map((log) => (
                <li key={log.id} className="px-6 py-4 flex gap-4">
                  <div className="mt-1">
                    <Activity className={cn('w-5 h-5', actionColor(log.action))} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className={cn('font-medium', actionColor(log.action))}>{log.action}</span>
                      {log.entityType && (
                        <span className="text-xs text-gray-500">on {log.entityType}</span>
                      )}
                    </div>
                    {log.description && <p className="text-sm text-gray-300 mt-1">{log.description}</p>}
                    <div className="flex gap-3 text-xs text-gray-500 mt-1">
                      <span>{formatDate(log.createdAt)}</span>
                      {log.actor?.email && <span>by {log.actor.email}</span>}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex justify-between items-center px-6 py-4 border-t border-gray-700">
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
