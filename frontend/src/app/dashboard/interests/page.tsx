'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Send, Inbox, Check, X, Clock, MessageSquare, ChevronRight, Crown, Lock, Loader2 } from 'lucide-react';
import { interestsApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Interest } from '@/types';
import { cn, formatDate, getInterestStatusColor } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function InterestsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [receivedInterests, setReceivedInterests] = useState<Interest[]>([]);
  const [sentInterests, setSentInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState<string | null>(null);

  const isPaid = user?.subscription?.status === 'PAID';

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const [received, sent] = await Promise.all([
          interestsApi.getReceivedInterests(1, 50),
          interestsApi.getSentInterests(1, 50),
        ]);
        setReceivedInterests(received.data);
        setSentInterests(sent.data);
      } catch (error) {
        console.error('Error fetching interests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInterests();
  }, []);

  const handleRespond = async (interestId: string, status: 'ACCEPTED' | 'REJECTED') => {
    setResponding(interestId);
    try {
      await interestsApi.respondToInterest(interestId, status);
      setReceivedInterests((prev) => prev.map((i) => (i.id === interestId ? { ...i, status } : i)));
      toast.success(status === 'ACCEPTED' ? 'Interest accepted!' : 'Interest declined');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to respond');
    } finally {
      setResponding(null);
    }
  };

  const tabs = [
    { id: 'received', label: 'Received', icon: Inbox, count: receivedInterests.filter(i => i.status === 'PENDING').length },
    { id: 'sent', label: 'Sent', icon: Send, count: sentInterests.length },
  ];

  const currentInterests = activeTab === 'received' ? receivedInterests : sentInterests;

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-16 bg-gray-200 rounded-xl animate-pulse" />
        <div className="grid gap-4">{[1, 2, 3].map((i) => <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />)}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-gray-900">Interests</h1>
        <p className="text-gray-600 mt-1">Manage your sent and received interests</p>
      </div>

      {!isPaid && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card-gold p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary-100 flex items-center justify-center"><Lock className="w-6 h-6 text-secondary-600" /></div>
            <div><h3 className="font-bold text-gray-900">Upgrade to Express Interest</h3><p className="text-sm text-gray-600">Premium members can send interest to profiles they like</p></div>
          </div>
          <Link href="/dashboard/subscription" className="btn-gold whitespace-nowrap"><Crown className="w-4 h-4" /> Upgrade Now</Link>
        </motion.div>
      )}

      <div className="flex gap-4 border-b border-gray-200">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={cn('flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 -mb-px', activeTab === tab.id ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700')}>
            <tab.icon className="w-5 h-5" />{tab.label}
            {tab.count > 0 && <span className="px-2 py-0.5 bg-primary-100 text-primary-600 text-xs rounded-full">{tab.count}</span>}
          </button>
        ))}
      </div>

      {currentInterests.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">{activeTab === 'received' ? 'No Interests Received Yet' : 'No Interests Sent Yet'}</h3>
          <p className="text-gray-600 mb-4">{activeTab === 'received' ? 'When someone expresses interest in your profile, it will appear here.' : 'Express interest in profiles you like to connect with them.'}</p>
          {activeTab === 'sent' && <Link href="/dashboard/search" className="btn-primary">Browse Profiles</Link>}
        </div>
      ) : (
        <div className="space-y-4">
          {currentInterests.map((interest, index) => {
            const profile = activeTab === 'received' ? interest.sender?.profile : interest.receiver?.profile;
            return (
              <motion.div key={interest.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="glass-card p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Link href={`/dashboard/profile/${profile?.id}`}>
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-primary-100 to-secondary-100 flex-shrink-0">
                      {profile?.profilePicture ? <img src={profile.profilePicture} alt={profile.firstName} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><span className="text-3xl font-bold text-primary-300">{profile?.firstName?.[0]}</span></div>}
                    </div>
                  </Link>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link href={`/dashboard/profile/${profile?.id}`}><h3 className="font-bold text-gray-900 hover:text-primary-600">{profile?.firstName} {profile?.lastName}</h3></Link>
                      <span className={cn('px-2 py-0.5 rounded-full text-xs', getInterestStatusColor(interest.status))}>{interest.status}</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{profile?.age} yrs • {profile?.city}, {profile?.state}</p>
                    <p className="text-gray-500 text-sm">{profile?.profession}</p>
                    {interest.message && <div className="mt-2 p-3 bg-gray-50 rounded-lg"><p className="text-sm text-gray-600 flex items-start gap-2"><MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />{interest.message}</p></div>}
                    <p className="text-xs text-gray-400 mt-2"><Clock className="w-3 h-3 inline mr-1" />{formatDate(interest.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {activeTab === 'received' && interest.status === 'PENDING' && (
                      <>
                        <button onClick={() => handleRespond(interest.id, 'ACCEPTED')} disabled={responding === interest.id} className="flex-1 sm:flex-initial px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                          {responding === interest.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}Accept
                        </button>
                        <button onClick={() => handleRespond(interest.id, 'REJECTED')} disabled={responding === interest.id} className="flex-1 sm:flex-initial px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"><X className="w-4 h-4" />Decline</button>
                      </>
                    )}
                    <Link href={`/dashboard/profile/${profile?.id}`} className="p-2 text-gray-400 hover:text-primary-600 transition-colors"><ChevronRight className="w-5 h-5" /></Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
