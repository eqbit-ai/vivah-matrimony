'use client';

import { useState, useEffect } from 'react';
import { Heart, Calendar, Loader2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { formatDate, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface AdminInterest {
  id: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  message?: string;
  createdAt: string;
  sender?: { id: string; email: string; profile?: { firstName?: string; lastName?: string } };
  receiver?: { id: string; email: string; profile?: { firstName?: string; lastName?: string } };
}

const statusStyles: Record<string, string> = {
  PENDING: 'bg-yellow-900/40 text-yellow-300',
  ACCEPTED: 'bg-green-900/40 text-green-300',
  REJECTED: 'bg-red-900/40 text-red-300',
};

export default function AdminInterestsPage() {
  const [interests, setInterests] = useState<AdminInterest[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [scheduling, setScheduling] = useState<AdminInterest | null>(null);

  useEffect(() => {
    fetchInterests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchInterests = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getInterests({ page, limit: 20 });
      const data = response.data || response;
      setInterests(Array.isArray(data) ? data : []);
      setTotalPages(response.meta?.totalPages || 1);
      setTotal(response.meta?.total || data.length || 0);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load interests');
    } finally {
      setLoading(false);
    }
  };

  const displayName = (p?: AdminInterest['sender']) =>
    p?.profile?.firstName ? `${p.profile.firstName} ${p.profile.lastName || ''}`.trim() : p?.email || '—';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-3">
          <Heart className="w-8 h-8 text-pink-400" />
          Interests & Matches
        </h1>
        <p className="text-gray-400 mt-1">{total} total interests</p>
      </div>

      <div className="bg-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : interests.length === 0 ? (
          <div className="py-20 text-center text-gray-400">No interests yet</div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left">From</th>
                  <th className="px-6 py-4 text-left">To</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Sent</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {interests.map((i) => (
                  <tr key={i.id}>
                    <td className="px-6 py-4">
                      <p className="font-medium">{displayName(i.sender)}</p>
                      <p className="text-xs text-gray-400">{i.sender?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{displayName(i.receiver)}</p>
                      <p className="text-xs text-gray-400">{i.receiver?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn('px-2 py-1 rounded-full text-xs', statusStyles[i.status])}>
                        {i.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{formatDate(i.createdAt)}</td>
                    <td className="px-6 py-4">
                      {i.status === 'ACCEPTED' && (
                        <button
                          onClick={() => setScheduling(i)}
                          className="flex items-center gap-1 text-sm text-primary-400 hover:text-primary-300"
                        >
                          <Calendar className="w-4 h-4" />
                          Schedule meeting
                        </button>
                      )}
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

      {scheduling && (
        <ScheduleModal
          interest={scheduling}
          onClose={() => setScheduling(null)}
          onScheduled={() => {
            setScheduling(null);
            fetchInterests();
          }}
        />
      )}
    </div>
  );
}

function ScheduleModal({
  interest,
  onClose,
  onScheduled,
}: {
  interest: AdminInterest;
  onClose: () => void;
  onScheduled: () => void;
}) {
  const [scheduledAt, setScheduledAt] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminApi.scheduleInterestMeeting({
        interestId: interest.id,
        scheduledAt: new Date(scheduledAt).toISOString(),
        location: location || undefined,
        notes: notes || undefined,
      });
      toast.success('Meeting scheduled');
      onScheduled();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to schedule');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Schedule Meeting</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Date & time</label>
            <input
              type="datetime-local"
              required
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Venue or video call link"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-70 rounded-lg flex items-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
