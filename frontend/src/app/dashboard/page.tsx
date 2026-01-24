'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Heart, Eye, Users, Crown, ArrowRight, Sparkles, Bell, Search,
  CheckCircle2, AlertCircle, TrendingUp,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { profilesApi, interestsApi, subscriptionsApi, notificationsApi } from '@/lib/api';
import { cn, getProfileCompletionPercentage, formatDate } from '@/lib/utils';
import { Profile, Subscription } from '@/types';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [stats, setStats] = useState({
    interestsSent: 0,
    interestsReceived: 0,
    matches: 0,
    unreadNotifications: 0,
  });
  const [suggestedProfiles, setSuggestedProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, subscriptionData, sentInterests, receivedInterests, matches, notificationCount] = await Promise.all([
          profilesApi.getMyProfile(),
          subscriptionsApi.getStatus(),
          interestsApi.getSentInterests(1, 1),
          interestsApi.getReceivedInterests(1, 1),
          interestsApi.getMutualMatches(1, 1),
          notificationsApi.getUnreadCount(),
        ]);

        setProfile(profileData);
        setSubscription(subscriptionData);
        setStats({
          interestsSent: sentInterests.meta.total,
          interestsReceived: receivedInterests.meta.total,
          matches: matches.meta.total,
          unreadNotifications: notificationCount.unreadCount,
        });

        // Fetch suggested profiles
        const suggested = await profilesApi.searchProfiles({ limit: 4 });
        setSuggestedProfiles(suggested.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const profileCompletion = profile ? getProfileCompletionPercentage(profile) : 0;
  const isPaid = subscription?.status === 'PAID';

  const statCards = [
    { label: 'Interests Sent', value: stats.interestsSent, icon: Heart, color: 'from-rose-400 to-pink-500', href: '/dashboard/interests' },
    { label: 'Interests Received', value: stats.interestsReceived, icon: Eye, color: 'from-purple-400 to-indigo-500', href: '/dashboard/interests' },
    { label: 'Mutual Matches', value: stats.matches, icon: Users, color: 'from-green-400 to-emerald-500', href: '/dashboard/matches' },
    { label: 'Notifications', value: stats.unreadNotifications, icon: Bell, color: 'from-amber-400 to-orange-500', href: '/dashboard/notifications' },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-40 bg-gray-200 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-primary-800 text-white p-8"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <h1 className="font-display text-3xl font-bold mb-2">
            Welcome back, {profile?.firstName}! 👋
          </h1>
          <p className="text-primary-100 text-lg">
            Your journey to find the perfect life partner continues...
          </p>

          {profileCompletion < 100 && (
            <div className="mt-6 bg-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Profile Completion</span>
                <span className="text-sm font-bold">{profileCompletion}%</span>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary-400 rounded-full transition-all duration-500"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
              <Link
                href="/dashboard/profile"
                className="inline-flex items-center gap-2 mt-3 text-sm text-secondary-300 hover:text-secondary-200"
              >
                Complete your profile for better matches <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </motion.div>

      {/* Subscription Banner */}
      {!isPaid && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card-gold p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary-100 flex items-center justify-center">
              <Crown className="w-6 h-6 text-secondary-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Upgrade to Premium</h3>
              <p className="text-sm text-gray-600">Express interest and view full profiles</p>
            </div>
          </div>
          <Link href="/dashboard/subscription" className="btn-gold whitespace-nowrap">
            <Sparkles className="w-4 h-4" />
            Upgrade Now
          </Link>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <Link href={stat.href}>
              <div className="glass-card p-6 card-hover group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Suggested Profiles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-gray-900">Suggested Profiles</h2>
          <Link href="/dashboard/search" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {suggestedProfiles.map((profile, index) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Link href={`/dashboard/profile/${profile.id}`}>
                <div className="profile-card overflow-hidden group">
                  <div className="relative h-48 bg-gradient-to-br from-primary-100 to-secondary-100">
                    {profile.profilePicture ? (
                      <img
                        src={profile.profilePicture}
                        alt={profile.firstName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl font-bold text-primary-300">
                          {profile.firstName[0]}
                        </span>
                      </div>
                    )}
                    {profile.isVerified && (
                      <div className="absolute top-3 right-3 badge-verified">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900">
                      {profile.firstName} {profile.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {profile.age} yrs • {profile.city}, {profile.state}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{profile.profession}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <Link href="/dashboard/search">
          <div className="glass-card p-6 card-hover flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Search className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Search Profiles</h3>
              <p className="text-sm text-gray-600">Find your perfect match</p>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/profile">
          <div className="glass-card p-6 card-hover flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Boost Profile</h3>
              <p className="text-sm text-gray-600">Get more visibility</p>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/interests">
          <div className="glass-card p-6 card-hover flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center">
              <Heart className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">My Interests</h3>
              <p className="text-sm text-gray-600">Manage your interests</p>
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
