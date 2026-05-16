'use client';

import { useState } from 'react';
import { Settings, Lock, User as UserIcon, Loader2, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        'Must contain uppercase, lowercase, and a number or special character',
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function AdminSettingsPage() {
  const { user } = useAuthStore();
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormData) => {
    setSubmitting(true);
    try {
      await authApi.changePassword(data.currentPassword, data.newPassword);
      toast.success('Password updated');
      reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-3">
          <Settings className="w-8 h-8 text-blue-400" />
          Settings
        </h1>
        <p className="text-gray-400 mt-1">Manage your admin account</p>
      </div>

      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <UserIcon className="w-5 h-5 text-gray-400" />
          Account
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-gray-700 pb-3">
            <span className="text-gray-400">Email</span>
            <span>{user?.email || '—'}</span>
          </div>
          <div className="flex justify-between border-b border-gray-700 pb-3">
            <span className="text-gray-400">Role</span>
            <span className="px-2 py-0.5 bg-primary-600 text-xs rounded-full">{user?.role || 'ADMIN'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">User ID</span>
            <span className="font-mono text-xs text-gray-500">{user?.id || '—'}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-gray-400" />
          Change Password
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Current password</label>
            <input
              type="password"
              {...register('currentPassword')}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-400">{errors.currentPassword.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">New password</label>
            <input
              type="password"
              {...register('newPassword')}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-400">{errors.newPassword.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Confirm new password</label>
            <input
              type="password"
              {...register('confirmPassword')}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-400">{errors.confirmPassword.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-70 text-white rounded-lg"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Update password
          </button>
        </form>
      </div>
    </div>
  );
}
