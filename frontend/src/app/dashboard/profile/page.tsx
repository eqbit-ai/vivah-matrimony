'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User, Camera, Save, MapPin, Briefcase, GraduationCap, Heart,
  Calendar, Ruler, Users, Home, Phone, Mail, CheckCircle2, Loader2,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { profilesApi, uploadApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Profile, RELIGIONS, INDIAN_STATES, MARITAL_STATUSES } from '@/types';
import { cn, getProfileCompletionPercentage } from '@/lib/utils';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  dateOfBirth: z.string().min(1, 'Please enter your date of birth'),
  gender: z.enum(['MALE', 'FEMALE']),
  religion: z.string().min(1, 'Please select your religion'),
  caste: z.string().optional(),
  subCaste: z.string().optional(),
  motherTongue: z.string().optional(),
  maritalStatus: z.string().min(1, 'Please select marital status'),
  height: z.number().optional().nullable(),
  weight: z.number().optional().nullable(),
  education: z.string().min(1, 'Please enter your education'),
  educationDetails: z.string().optional(),
  profession: z.string().min(1, 'Please enter your profession'),
  company: z.string().optional(),
  annualIncome: z.string().optional(),
  workLocation: z.string().optional(),
  state: z.string().min(1, 'Please select your state'),
  city: z.string().min(1, 'Please enter your city'),
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

export default function ProfilePage() {
  const { user, fetchUser } = useAuthStore();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profilesApi.getMyProfile();
        setProfile(data);
        reset({
          ...data,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : '',
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setSaving(true);
    try {
      const updated = await profilesApi.updateProfile(data);
      setProfile(updated);
      await fetchUser();
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadApi.uploadProfilePicture(file);
      setProfile((prev) => prev ? { ...prev, profilePicture: result.url } : null);
      await fetchUser();
      toast.success('Profile picture updated!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const profileCompletion = profile ? getProfileCompletionPercentage(profile) : 0;

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'education', label: 'Education & Career', icon: Briefcase },
    { id: 'family', label: 'Family Details', icon: Users },
    { id: 'about', label: 'About Me', icon: Heart },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-48 bg-gray-200 rounded-2xl animate-pulse" />
        <div className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8"
      >
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-primary-100 to-secondary-100">
              {profile?.profilePicture ? (
                <img src={profile.profilePicture} alt={profile.firstName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-5xl font-bold text-primary-300">{profile?.firstName?.[0]}</span>
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-700 transition-colors">
              {uploading ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Camera className="w-5 h-5 text-white" />}
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={uploading} />
            </label>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <h1 className="font-display text-3xl font-bold text-gray-900">{profile?.firstName} {profile?.lastName}</h1>
              {profile?.isVerified && <span className="badge-verified"><CheckCircle2 className="w-3 h-3" /> Verified</span>}
            </div>
            <p className="text-gray-600 mt-1">{profile?.age} yrs • {profile?.city}, {profile?.state}</p>
            <p className="text-gray-500">{profile?.profession}</p>
            <div className="mt-4 max-w-sm mx-auto md:mx-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Profile Completion</span>
                <span className="text-sm font-bold text-primary-600">{profileCompletion}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-500" style={{ width: `${profileCompletion}%` }} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Profile Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn('flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-colors border-b-2', activeTab === tab.id ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700')}>
                <tab.icon className="w-4 h-4" />{tab.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8">
          {activeTab === 'basic' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div><label className="block text-sm font-medium text-gray-700 mb-2">First Name</label><input {...register('firstName')} className="input-premium" />{errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>}</div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label><input {...register('lastName')} className="input-premium" />{errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>}</div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label><input type="date" {...register('dateOfBirth')} className="input-premium" />{errors.dateOfBirth && <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth.message}</p>}</div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Religion</label><select {...register('religion')} className="input-premium"><option value="">Select Religion</option>{RELIGIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}</select>{errors.religion && <p className="mt-1 text-sm text-red-500">{errors.religion.message}</p>}</div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Caste</label><input {...register('caste')} className="input-premium" placeholder="Enter your caste" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Mother Tongue</label><input {...register('motherTongue')} className="input-premium" placeholder="e.g., Hindi, Tamil" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label><select {...register('maritalStatus')} className="input-premium"><option value="">Select Status</option>{MARITAL_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select>{errors.maritalStatus && <p className="mt-1 text-sm text-red-500">{errors.maritalStatus.message}</p>}</div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label><input type="number" {...register('height', { valueAsNumber: true })} className="input-premium" placeholder="e.g., 170" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">State</label><select {...register('state')} className="input-premium"><option value="">Select State</option>{INDIAN_STATES.map((state) => <option key={state} value={state}>{state}</option>)}</select>{errors.state && <p className="mt-1 text-sm text-red-500">{errors.state.message}</p>}</div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">City</label><input {...register('city')} className="input-premium" placeholder="Enter your city" />{errors.city && <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>}</div>
            </div>
          )}

          {activeTab === 'education' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Highest Education</label><input {...register('education')} className="input-premium" placeholder="e.g., B.Tech, MBA" />{errors.education && <p className="mt-1 text-sm text-red-500">{errors.education.message}</p>}</div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Education Details</label><input {...register('educationDetails')} className="input-premium" placeholder="University, College" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Profession</label><input {...register('profession')} className="input-premium" placeholder="e.g., Software Engineer" />{errors.profession && <p className="mt-1 text-sm text-red-500">{errors.profession.message}</p>}</div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Company/Organization</label><input {...register('company')} className="input-premium" placeholder="Where do you work?" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Annual Income</label><select {...register('annualIncome')} className="input-premium"><option value="">Select Income Range</option><option value="0-3">Below ₹3 Lakhs</option><option value="3-5">₹3-5 Lakhs</option><option value="5-7">₹5-7 Lakhs</option><option value="7-10">₹7-10 Lakhs</option><option value="10-15">₹10-15 Lakhs</option><option value="15-20">₹15-20 Lakhs</option><option value="20-30">₹20-30 Lakhs</option><option value="30-50">₹30-50 Lakhs</option><option value="50+">₹50 Lakhs+</option></select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Work Location</label><input {...register('workLocation')} className="input-premium" placeholder="City where you work" /></div>
            </div>
          )}

          {activeTab === 'family' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Father's Name</label><input {...register('fatherName')} className="input-premium" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Father's Occupation</label><input {...register('fatherOccupation')} className="input-premium" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Mother's Name</label><input {...register('motherName')} className="input-premium" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Mother's Occupation</label><input {...register('motherOccupation')} className="input-premium" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Siblings</label><input {...register('siblings')} className="input-premium" placeholder="e.g., 1 Brother, 1 Sister" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Family Type</label><select {...register('familyType')} className="input-premium"><option value="">Select Type</option><option value="JOINT">Joint Family</option><option value="NUCLEAR">Nuclear Family</option></select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Native Place</label><input {...register('nativePlace')} className="input-premium" placeholder="Your hometown" /></div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-6">
              <div><label className="block text-sm font-medium text-gray-700 mb-2">About Me</label><textarea {...register('aboutMe')} rows={5} className="input-premium" placeholder="Write about yourself, your personality, interests, and what you're looking for..." /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Hobbies & Interests</label><textarea {...register('hobbies')} rows={3} className="input-premium" placeholder="e.g., Reading, Traveling, Cooking, Music..." /></div>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
