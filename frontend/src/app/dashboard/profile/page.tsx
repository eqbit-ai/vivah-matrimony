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
  dateOfBirth: z.string().min(1),
  gender: z.enum(['MALE', 'FEMALE']),
  religion: z.string().min(1),
  caste: z.string().optional(),
  subCaste: z.string().optional(),
  motherTongue: z.string().optional(),
  maritalStatus: z.string().min(1),
  height: z.number().optional(),
  weight: z.number().optional(),
  education: z.string().min(1),
  educationDetails: z.string().optional(),
  profession: z.string().min(1),
  company: z.string().optional(),
  annualIncome: z.string().optional(),
  workLocation: z.string().optional(),
  state: z.string().min(1),
  city: z.string().min(1),
  aboutMe: z.string().optional(),
  hobbies: z.string().optional(),
  fatherName: z.string().optional(),
  fatherOccupation: z.string().optional(),
  motherName: z.string().optional(),
  motherOccupation: z.string().optional(),
  siblings: z.string().optional(),
  familyType: z.string().optional(),
  familyStatus: z.string().optional(),
  nativePlace: z.string().optional(),
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
          firstName: data.firstName ?? '',
          lastName: data.lastName ?? '',
          gender: data.gender,
          dateOfBirth: data.dateOfBirth
            ? new Date(data.dateOfBirth).toISOString().split('T')[0]
            : '',
          religion: data.religion,
          caste: data.caste ?? '',
          subCaste: data.subCaste ?? '',
          motherTongue: data.motherTongue ?? '',
          maritalStatus: data.maritalStatus,
          height: data.height ?? undefined,
          weight: data.weight ?? undefined,
          education: data.education ?? '',
          educationDetails: data.educationDetail ?? '',
          profession: data.profession ?? '',
          company: data.employer ?? '',
          annualIncome: data.annualIncome ?? '',
          workLocation: data.workingCity ?? '',
          state: data.state ?? '',
          city: data.city ?? '',
          aboutMe: data.bio ?? '',
          hobbies:
            Array.isArray(data.hobbies) && data.hobbies.length > 0
              ? data.hobbies.join(', ')
              : '',
          fatherName: data.fatherName ?? '',
          fatherOccupation: data.fatherOccupation ?? '',
          motherName: data.motherName ?? '',
          motherOccupation: data.motherOccupation ?? '',
          siblings:
            data.siblings !== null && data.siblings !== undefined
              ? String(data.siblings)
              : '',
          familyType: data.familyType ?? '',
          familyStatus: data.familyStatus ?? '',
          nativePlace: data.pincode ?? '',
        });
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        if (mounted) setLoading(false);
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
      const payload = {
        ...data,
        dateOfBirth: new Date(data.dateOfBirth),
        hobbies: data.hobbies
          ? data.hobbies
            .split(',')
            .map((h) => h.trim())
            .filter(Boolean)
          : [],
      };

      const updated = await profilesApi.updateProfile(payload as any);
      setProfile(updated);
      await fetchUser();
      toast.success('Profile updated successfully');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  /* ===================== PHOTO UPLOAD ===================== */

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadApi.uploadProfilePicture(file);
      setProfile((p) => (p ? { ...p, profilePicture: res.imageUrl } : p));
      await fetchUser();
      toast.success('Profile picture updated');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  /* ===================== RENDER GUARDS ===================== */

  if (loading) {
    return <div className="h-96 bg-gray-200 animate-pulse rounded-xl" />;
  }

  if (!profile) {
    return (
      <div className="p-8 text-center text-gray-500">
        Unable to load profile. Please refresh.
      </div>
    );
  }

  const profileCompletion = getProfileCompletionPercentage(profile);

  /* ===================== UI ===================== */

  return (
    <div className="space-y-8">
      <motion.div className="glass-card p-8">
        <div className="flex gap-8 items-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              {profile.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold">
                  {profile.firstName?.[0]}
                </span>
              )}
            </div>

            <label className="absolute bottom-0 right-0 cursor-pointer">
              {uploading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Camera />
              )}
              <input type="file" hidden onChange={handlePhotoUpload} />
            </label>
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              {profile.firstName} {profile.lastName}
            </h1>
            <p>{profile.profession}</p>
            <p>{profileCompletion}% complete</p>
          </div>
        </div>
      </motion.div>

      <motion.div className="glass-card p-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* keep your tabs + inputs exactly as before */}

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex gap-2"
            >
              {saving ? <Loader2 className="animate-spin" /> : <Save />}
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
