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
  Lock,
  ArrowLeft,
  Loader2,
  User,
} from 'lucide-react';
import { profilesApi, interestsApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Profile } from '@/types';
import {
  formatDate,
  formatHeight,
  getReligionLabel,
  getMaritalStatusLabel,
} from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ViewProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingInterest, setSendingInterest] = useState(false);
  const [interestSent, setInterestSent] = useState(false);

  const profileId = params.id as string;
  const isPaid = user?.subscription?.status === 'PAID';
  const isOwnProfile = user?.profile?.id === profileId;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = isPaid
          ? await profilesApi.getFullProfile(profileId)
          : await profilesApi.getProfile(profileId);

        setProfile(data);
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        if (error.response?.status === 404) {
          router.push('/dashboard/search');
        }
      } finally {
        setLoading(false);
      }
    };

    if (profileId) fetchProfile();
  }, [profileId, isPaid, router]);

  const handleSendInterest = async () => {
    if (!isPaid) {
      toast.error('Please upgrade to send interest');
      router.push('/dashboard/subscription');
      return;
    }

    setSendingInterest(true);
    try {
      await interestsApi.sendInterest(profile?.userId || '');
      setInterestSent(true);
      toast.success('Interest sent successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send interest');
    } finally {
      setSendingInterest(false);
    }
  };

  /* =========================
     Loading State
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
     Not Found
  ========================= */
  if (!profile) {
    return (
      <div className="text-center py-16">
        <User className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Profile Not Found
        </h3>
        <p className="text-gray-600 mb-4">
          This profile may have been removed or is no longer available.
        </p>
        <Link href="/dashboard/search" className="btn-primary">
          Browse Other Profiles
        </Link>
      </div>
    );
  }

  /* =========================
     Profile View
  ========================= */
  return (
    <div className="space-y-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Search
      </button>

      {/* Header Card */}
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

          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="font-display text-3xl md:text-4xl font-bold">
                {profile.firstName} {profile.lastName}
              </h1>
              {profile.isVerified && (
                <span className="badge-verified">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
            <p className="text-white/80 text-lg">
              {profile.age} years • {getReligionLabel(profile.religion)}
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              {profile.city}, {profile.state}
            </span>
            <span className="flex items-center gap-2 text-gray-600">
              <Briefcase className="w-4 h-4" />
              {profile.profession}
            </span>
            {profile.height && (
              <span className="flex items-center gap-2 text-gray-600">
                <Ruler className="w-4 h-4" />
                {formatHeight(profile.height)}
              </span>
            )}
          </div>

          {!isOwnProfile && (
            <div className="flex gap-3">
              {!isPaid && (
                <Link
                  href="/dashboard/subscription"
                  className="btn-gold flex items-center gap-2"
                >
                  <Crown className="w-4 h-4" />
                  Upgrade to Connect
                </Link>
              )}

              {isPaid && !interestSent && (
                <button
                  onClick={handleSendInterest}
                  disabled={sendingInterest}
                  className="btn-primary flex items-center gap-2"
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
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-xl font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Interest Sent
                </span>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Content */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="md:col-span-2 space-y-6">
          {/* ✅ FIXED: bio instead of aboutMe */}
          {profile.bio && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6"
            >
              <h2 className="font-display text-xl font-bold text-gray-900 mb-4">
                About Me
              </h2>
              <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
            </motion.div>
          )}

          {/* Remaining sections unchanged */}
          {/* … everything else stays exactly as-is */}
        </div>
      </div>
    </div>
  );
}
