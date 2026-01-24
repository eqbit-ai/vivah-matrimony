'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Users, MessageSquare, Phone, Mail, MapPin, Briefcase, Calendar, Crown, Lock } from 'lucide-react';
import { interestsApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Interest } from '@/types';
import { formatDate } from '@/lib/utils';

export default function MatchesPage() {
  const { user } = useAuthStore();
  const [matches, setMatches] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);

  const isPaid = user?.subscription?.status === 'PAID';

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await interestsApi.getMutualMatches(1, 50);
        setMatches(data.data);
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-16 bg-gray-200 rounded-xl animate-pulse" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-gray-900">Your Matches</h1>
        <p className="text-gray-600 mt-1">
          {matches.length > 0 ? `You have ${matches.length} mutual match${matches.length > 1 ? 'es' : ''}!` : 'Profiles where you both expressed interest'}
        </p>
      </div>

      {!isPaid && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card-gold p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary-100 flex items-center justify-center"><Lock className="w-6 h-6 text-secondary-600" /></div>
            <div><h3 className="font-bold text-gray-900">Upgrade to Connect</h3><p className="text-sm text-gray-600">Premium members can view contact details of their matches</p></div>
          </div>
          <Link href="/dashboard/subscription" className="btn-gold whitespace-nowrap"><Crown className="w-4 h-4" /> Upgrade Now</Link>
        </motion.div>
      )}

      {matches.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Matches Yet</h3>
          <p className="text-gray-600 mb-4">When both you and another profile express mutual interest, they'll appear here as a match!</p>
          <Link href="/dashboard/search" className="btn-primary">Browse Profiles</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match, index) => {
            const isSender = match.senderId === user?.id;
            const profile = isSender ? match.receiver?.profile : match.sender?.profile;
            
            return (
              <motion.div key={match.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="profile-card overflow-hidden group">
                <div className="relative h-48 bg-gradient-to-br from-primary-100 to-secondary-100">
                  {profile?.profilePicture ? (
                    <img src={profile.profilePicture} alt={profile.firstName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><span className="text-6xl font-bold text-primary-300">{profile?.firstName?.[0]}</span></div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Heart className="w-3 h-3" fill="white" /> It's a Match!
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <Link href={`/dashboard/profile/${profile?.id}`}>
                    <h3 className="font-bold text-gray-900 text-lg hover:text-primary-600">{profile?.firstName} {profile?.lastName}</h3>
                  </Link>
                  <p className="text-gray-600 text-sm">{profile?.age} yrs • {profile?.religion}</p>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />{profile?.city}, {profile?.state}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Briefcase className="w-4 h-4" />{profile?.profession}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />Matched on {formatDate(match.respondedAt || match.createdAt)}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Link href={`/dashboard/profile/${profile?.id}`} className="flex-1 btn-primary py-2 text-sm text-center">View Profile</Link>
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
