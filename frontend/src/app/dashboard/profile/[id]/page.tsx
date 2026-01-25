'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Heart,
  MapPin,
  Briefcase,
  Ruler,
  CheckCircle2,
  Crown,
  ArrowLeft,
  Loader2,
  User,
} from 'lucide-react';
import { profilesApi, interestsApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Profile } from '@/types';
import {
  formatHeight,
  getReligionLabel,
} from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ViewProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();

  const profileId = params?.id;
  const isPaid = user?.subscription?.status === 'PAID';
  const isOwnProfile = user?.profile?.id === profileId;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingInterest, setSendingInterest] = useState(false);
  const [interestSent, setInterestSent] = useState(false);

  /* =========================
     FETCH PROFILE
  ========================= */

  useEffect(() => {
    if (!profileId) return;

    let mounted = true;

    (async () => {
      try {
        const data = isPaid
          ? await profilesApi.getFullProfile(profileId)
          : await profilesApi.getProfile(profileId);

        if (!mounted) return;
        setProfile(data);
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        if (error?.response?.status === 404) {
          router.replace('/dashboard/search');
        }
      } finally {
        mounted && setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [profileId, isPaid, router]);

  /* =========================
     SEND INTEREST
  ========================= */

  const handleSendInterest = async () => {
    if (!profile?.userId) {
      toast.error('Invalid profile');
      return;
    }

    if (!isPaid) {
      toast.error('Please upgrade to send interest');
      router.push('/dashboard/subscription');
      return;
    }

    setSendingInterest(true);
    try {
      await interestsApi.sendInterest(profile.userId);
      setInterestSent(true);
      toast.success('Interest sent successfully!');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to send interest');
    } finally {
      setSendingInterest(false);
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 bg-gray-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  /* =========================
     NOT FOUND
  ========================= */

  if (!profile) {
    return (
      <div className="text-center py-16">
        <User className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-bold mb-2">Profile Not Found</h3>
        <p className="text-gray-600 mb-4">
          This profile may have been removed or is unavailable.
        </p>
        <Link href="/dashboard/search" className="btn-primary">
          Browse Profiles
        </Link>
      </div>
    );
  }

  /* =========================
     PROFILE VIEW
  ========================= */

  return (
    <div className="space-y-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-primary-600"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden"
      >
        <div className="relative h-64 md:h-80 bg-gradient-to-br from-primary-100 to-secondary-100">
          {profile.profilePicture ? (
            <img
              src={profile.profilePicture}
              alt={profile.firstName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-9xl font-bold text-primary-300">
                {profile.firstName?.[0]}
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <div className="absolute bottom-0 p-6 text-white">
            <h1 className="text-3xl font-bold">
              {profile.firstName} {profile.lastName}
            </h1>
            <p className="text-white/80">
              {profile.age} years • {getReligionLabel(profile.religion)}
            </p>
          </div>
        </div>

        {/* ACTION BAR */}
        <div className="p-6 flex flex-wrap items-center justify-between gap-4 bg-white">
          <div className="flex gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {profile.city}, {profile.state}
            </span>
            <span className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              {profile.profession}
            </span>
            {profile.height && (
              <span className="flex items-center gap-2">
                <Ruler className="w-4 h-4" />
                {formatHeight(profile.height)}
              </span>
            )}
          </div>

          {!isOwnProfile && (
            <div className="flex gap-3">
              {!isPaid && (
                <Link href="/dashboard/subscription" className="btn-gold">
                  <Crown className="w-4 h-4" />
                  Upgrade
                </Link>
              )}

              {isPaid && !interestSent && (
                <button
                  onClick={handleSendInterest}
                  disabled={sendingInterest}
                  className="btn-primary flex gap-2"
                >
                  {sendingInterest ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Heart className="w-5 h-5" />
                  )}
                  Express Interest
                </button>
              )}

              {interestSent && (
                <span className="text-green-700 font-semibold flex gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Interest Sent
                </span>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* ABOUT */}
      {profile.bio && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-bold mb-4">About Me</h2>
          <p className="text-gray-600">{profile.bio}</p>
        </motion.div>
      )}
    </div>
  );
}
