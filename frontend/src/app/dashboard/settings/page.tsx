'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Lock, Bell, Shield, Trash2, Eye, EyeOff, Loader2, AlertTriangle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { authApi, usersApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, { message: "Passwords don't match", path: ['confirmPassword'] });

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const [activeSection, setActiveSection] = useState('password');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PasswordFormData>({ resolver: zodResolver(passwordSchema) });

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setChangingPassword(true);
    try {
      await authApi.changePassword(data.currentPassword, data.newPassword);
      toast.success('Password changed successfully!');
      reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await usersApi.deleteAccount();
      toast.success('Account deactivated successfully');
      logout();
      router.push('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete account');
    } finally {
      setDeleting(false);
    }
  };

  const sections = [
    { id: 'password', label: 'Change Password', icon: Lock },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'notifications', label: 'Notification Preferences', icon: Bell },
    { id: 'delete', label: 'Delete Account', icon: Trash2, danger: true },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {sections.map((section) => (
              <button key={section.id} onClick={() => setActiveSection(section.id)} className={cn('w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left', activeSection === section.id ? 'bg-primary-50 text-primary-600 font-semibold' : section.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-600 hover:bg-gray-100')}>
                <section.icon className="w-5 h-5" />{section.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="lg:col-span-3">
          <motion.div key={activeSection} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8">
            {activeSection === 'password' && (
              <div>
                <h2 className="font-display text-xl font-bold text-gray-900 mb-6">Change Password</h2>
                <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-6 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <div className="relative">
                      <input type={showCurrentPassword ? 'text' : 'password'} {...register('currentPassword')} className="input-premium pr-12" />
                      <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.currentPassword && <p className="mt-1 text-sm text-red-500">{errors.currentPassword.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                      <input type={showNewPassword ? 'text' : 'password'} {...register('newPassword')} className="input-premium pr-12" />
                      <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.newPassword && <p className="mt-1 text-sm text-red-500">{errors.newPassword.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <input type="password" {...register('confirmPassword')} className="input-premium" />
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}
                  </div>
                  <button type="submit" disabled={changingPassword} className="btn-primary flex items-center gap-2">
                    {changingPassword ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
                    Change Password
                  </button>
                </form>
              </div>
            )}

            {activeSection === 'privacy' && (
              <div>
                <h2 className="font-display text-xl font-bold text-gray-900 mb-6">Privacy Settings</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div><h3 className="font-medium text-gray-900">Show Profile to All Users</h3><p className="text-sm text-gray-600">Allow all registered users to see your profile</p></div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div><h3 className="font-medium text-gray-900">Hide Contact Information</h3><p className="text-sm text-gray-600">Your contact details will only be visible to matched profiles</p></div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div>
                <h2 className="font-display text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
                <div className="space-y-6">
                  {[
                    { title: 'Email Notifications', desc: 'Receive updates about new interests and matches via email' },
                    { title: 'Interest Alerts', desc: 'Get notified when someone expresses interest in your profile' },
                    { title: 'Match Notifications', desc: 'Get notified when you have a mutual match' },
                    { title: 'Profile View Alerts', desc: 'Get notified when someone views your profile' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div><h3 className="font-medium text-gray-900">{item.title}</h3><p className="text-sm text-gray-600">{item.desc}</p></div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'delete' && (
              <div>
                <h2 className="font-display text-xl font-bold text-red-600 mb-6 flex items-center gap-2"><AlertTriangle className="w-6 h-6" />Delete Account</h2>
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                  <h3 className="font-bold text-red-800 mb-2">Warning: This action cannot be undone</h3>
                  <p className="text-red-700 text-sm">Deleting your account will permanently remove all your data including your profile, photos, interests, and matches.</p>
                </div>
                {!showDeleteConfirm ? (
                  <button onClick={() => setShowDeleteConfirm(true)} className="px-6 py-3 bg-red-100 text-red-600 rounded-xl font-semibold hover:bg-red-200 transition-colors">
                    I want to delete my account
                  </button>
                ) : (
                  <div className="flex gap-4">
                    <button onClick={() => setShowDeleteConfirm(false)} className="btn-outline">Cancel</button>
                    <button onClick={handleDeleteAccount} disabled={deleting} className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center gap-2">
                      {deleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                      Confirm Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
