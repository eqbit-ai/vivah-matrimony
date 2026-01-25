'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Camera,
  Save,
  Briefcase,
  Users,
  Heart,
  Loader2,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { profilesApi, uploadApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Profile } from '@/types';
import { cn, getProfileCompletionPercentage } from '@/lib/utils';

/* ===================== SCHEMA ===================== */

const profileSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  gender: z.enum(['MALE', 'FEMALE']),
  profession: z.string().min(1),
});

type ProfileFormData = z.infer<typeof profileSchema>;

/* ===================== COMPONENT ===================== */

export default function ProfilePage() {
  const { fetchUser } = useAuthStore();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const { register, handleSubmit, reset } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  /* ===================== LOAD PROFILE ===================== */

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await profilesApi.getMyProfile();
        if (!mounted) return;

        setProfile(data);

        reset({
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          profession: data.profession,
        });
      } catch (e) {
        console.error(e);
      } finally {
        mounted && setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [reset]);

  /* ===================== SUBMIT ===================== */

  const onSubmit = async (data: ProfileFormData) => {
    setSaving(true);
    try {
      const updated = await profilesApi.updateProfile(data as any);
      setProfile(updated);
      await fetchUser();
      toast.success('Profile updated');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  /* ===================== PHOTO ===================== */

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadApi.uploadProfilePicture(file);
      setProfile((p) => (p ? { ...p, profilePicture: res.imageUrl } : null));
      await fetchUser();
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="h-96 bg-gray-200 animate-pulse rounded-xl" />;
  }

  const completion = profile
    ? getProfileCompletionPercentage(profile)
    : 0;

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'education', label: 'Education & Career' },
    { id: 'family', label: 'Family Details' },
    { id: 'about', label: 'About Me' },
  ];

  /* ===================== UI ===================== */

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <motion.div className="glass-card p-8">
        <div className="flex gap-8 items-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              {profile?.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold">
                  {profile?.firstName?.[0]}
                </span>
              )}
            </div>
            <label className="absolute bottom-0 right-0 cursor-pointer">
              {uploading ? <Loader2 className="animate-spin" /> : <Camera />}
              <input type="file" hidden onChange={handlePhotoUpload} />
            </label>
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              {profile?.firstName} {profile?.lastName}
            </h1>
            <p>{profile?.profession}</p>
            <p>{completion}% complete</p>
          </div>
        </div>
      </motion.div>

      {/* FORM */}
      <motion.div className="glass-card p-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* TABS */}
          <div className="flex gap-6 border-b mb-6">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={cn(
                  'pb-2',
                  activeTab === t.id
                    ? 'border-b-2 border-primary-600 font-semibold'
                    : 'text-gray-500'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* BASIC INFO TAB */}
          {activeTab === 'basic' && (
            <div className="grid md:grid-cols-2 gap-6">
              <input
                {...register('firstName')}
                placeholder="First Name"
                className="input"
              />
              <input
                {...register('lastName')}
                placeholder="Last Name"
                className="input"
              />
              <input
                {...register('profession')}
                placeholder="Profession"
                className="input"
              />
              <select {...register('gender')} className="input">
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
          )}

          <div className="flex justify-end mt-8">
            <button className="btn-primary flex gap-2" disabled={saving}>
              {saving ? <Loader2 className="animate-spin" /> : <Save />}
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
