'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, UserPlus, Copy, Check, Mail as MailIcon, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { authApi } from '@/lib/api';

const RELIGIONS = ['HINDU', 'MUSLIM', 'CHRISTIAN', 'SIKH', 'BUDDHIST', 'JAIN', 'PARSI', 'JEWISH', 'OTHER'] as const;
type Religion = (typeof RELIGIONS)[number];

const schema = z.object({
  firstName: z.string().min(2, 'Min 2 characters').max(50),
  lastName: z.string().min(2, 'Min 2 characters').max(50),
  email: z.string().email('Valid email required'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Indian mobile (10 digits, starts 6-9)'),
  gender: z.enum(['MALE', 'FEMALE']),
  dateOfBirth: z.string().min(1, 'Required'),
  religion: z.enum(RELIGIONS),
  caste: z.string().optional(),
  state: z.string().min(1, 'Required'),
  city: z.string().min(1, 'Required'),
  education: z.string().min(1, 'Required'),
  profession: z.string().min(1, 'Required'),
});

type FormData = z.infer<typeof schema>;

function generatePassword(): string {
  const upper = 'ABCDEFGHJKMNPQRSTUVWXYZ';
  const lower = 'abcdefghjkmnpqrstuvwxyz';
  const digits = '23456789';
  const special = '!@#$%';
  const all = upper + lower + digits + special;
  const pick = (s: string) => s[Math.floor(Math.random() * s.length)];
  // Guarantee one of each so backend regex passes
  let out = pick(upper) + pick(lower) + pick(digits) + pick(special);
  for (let i = 0; i < 8; i++) out += pick(all);
  return out
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}

export default function AdminCreateUserPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<{ email: string; password: string } | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { gender: 'MALE', religion: 'HINDU' },
  });

  const onSubmit = async (data: FormData) => {
    const password = generatePassword();
    setSubmitting(true);
    try {
      // dataConsent: backend requires boolean; admin creating on user's behalf.
      await authApi.signUp({ ...(data as any), password, dataConsent: true });
      setCreated({ email: data.email, password });
    } catch (error: any) {
      const msg = Array.isArray(error.response?.data?.message)
        ? error.response.data.message.join(' · ')
        : error.response?.data?.message || 'Failed to create user';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-3">
          <UserPlus className="w-8 h-8 text-green-400" />
          Create User
        </h1>
        <p className="text-gray-400 mt-1">A temporary password is generated automatically — share the link with the user, who can sign in and change it.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-800 rounded-xl p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="First name" error={errors.firstName?.message}>
            <input {...register('firstName')} className="input-dark" />
          </Field>
          <Field label="Last name" error={errors.lastName?.message}>
            <input {...register('lastName')} className="input-dark" />
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Email" error={errors.email?.message}>
            <input type="email" {...register('email')} className="input-dark" />
          </Field>
          <Field label="Mobile (10 digits)" error={errors.phone?.message}>
            <input {...register('phone')} placeholder="9876543210" className="input-dark" />
          </Field>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Gender" error={errors.gender?.message}>
            <select {...register('gender')} className="input-dark">
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </Field>
          <Field label="Date of birth" error={errors.dateOfBirth?.message}>
            <input type="date" {...register('dateOfBirth')} className="input-dark" />
          </Field>
          <Field label="Religion" error={errors.religion?.message}>
            <select {...register('religion')} className="input-dark">
              {RELIGIONS.map((r) => (
                <option key={r} value={r}>{r.charAt(0) + r.slice(1).toLowerCase()}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Caste (optional)" error={errors.caste?.message}>
          <input {...register('caste')} className="input-dark" placeholder="e.g. Brahmin, Khatri, Jat..." />
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="State" error={errors.state?.message}>
            <input {...register('state')} className="input-dark" />
          </Field>
          <Field label="City" error={errors.city?.message}>
            <input {...register('city')} className="input-dark" />
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Education" error={errors.education?.message}>
            <input {...register('education')} className="input-dark" placeholder="e.g. B.Tech, MBA" />
          </Field>
          <Field label="Profession" error={errors.profession?.message}>
            <input {...register('profession')} className="input-dark" placeholder="e.g. Software Engineer" />
          </Field>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-70 rounded-lg"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            Create user
          </button>
        </div>

        <style jsx global>{`
          .input-dark {
            width: 100%;
            padding: 0.5rem 0.75rem;
            background-color: #374151;
            border: 1px solid #4b5563;
            border-radius: 0.5rem;
            color: #fff;
          }
          .input-dark:focus {
            outline: none;
            border-color: #7a1f3d;
          }
        `}</style>
      </form>

      {created && <SuccessModal email={created.email} password={created.password} onClose={() => router.push('/admin/users')} />}
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      {children}
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
}

function SuccessModal({ email, password, onClose }: { email: string; password: string; onClose: () => void }) {
  const [copied, setCopied] = useState<string | null>(null);
  const [sendingReset, setSendingReset] = useState(false);

  const loginUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/login?email=${encodeURIComponent(email)}`
    : `/login?email=${encodeURIComponent(email)}`;

  const shareText =
    `You've been added to JMD Shaadi.\n\n` +
    `Sign in here: ${loginUrl}\n` +
    `Email: ${email}\n` +
    `Temporary password: ${password}\n\n` +
    `Please sign in and change your password from Settings.`;

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      toast.error('Copy failed — select and copy manually');
    }
  };

  const sendResetEmail = async () => {
    setSendingReset(true);
    try {
      await authApi.forgotPassword(email);
      toast.success('Password reset email sent');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Could not send reset email');
    } finally {
      setSendingReset(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl max-w-lg w-full p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Check className="w-5 h-5 text-green-400" />
            User created
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-400">
          Share these credentials with the user. They can sign in with the temporary password and change it from Settings.
        </p>

        <CopyRow label="Login link" value={loginUrl} copied={copied === 'url'} onCopy={() => copy(loginUrl, 'url')} />
        <CopyRow label="Email" value={email} copied={copied === 'email'} onCopy={() => copy(email, 'email')} />
        <CopyRow label="Temporary password" value={password} copied={copied === 'pw'} onCopy={() => copy(password, 'pw')} mono />
        <CopyRow label="Full message" value={shareText} copied={copied === 'msg'} onCopy={() => copy(shareText, 'msg')} textarea />

        <div className="flex justify-between items-center pt-2 border-t border-gray-700">
          <button
            onClick={sendResetEmail}
            disabled={sendingReset}
            className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 disabled:opacity-70"
          >
            {sendingReset ? <Loader2 className="w-4 h-4 animate-spin" /> : <MailIcon className="w-4 h-4" />}
            Send password reset email instead
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-sm">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function CopyRow({
  label,
  value,
  copied,
  onCopy,
  mono,
  textarea,
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
  mono?: boolean;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <div className="flex gap-2">
        {textarea ? (
          <textarea
            readOnly
            value={value}
            rows={4}
            className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-xs text-gray-200 resize-none"
          />
        ) : (
          <input
            readOnly
            value={value}
            className={`flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-200 ${mono ? 'font-mono' : ''}`}
          />
        )}
        <button
          onClick={onCopy}
          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm flex items-center gap-1"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
