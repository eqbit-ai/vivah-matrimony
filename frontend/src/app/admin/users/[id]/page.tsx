'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft,
  Loader2,
  CheckCircle,
  XCircle,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  Calendar,
  Users as UsersIcon,
  Download,
} from 'lucide-react';
import { adminApi } from '@/lib/api';
import { User } from '@/types';
import { cn, formatDate, formatHeight, getInitials } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminUserDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getUser(id!);
      setUser(response.data || response);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  const doAction = async (kind: 'verify' | 'deactivate' | 'reactivate') => {
    if (!user) return;
    setActionLoading(kind);
    try {
      if (kind === 'verify') await adminApi.verifyUser(user.id);
      if (kind === 'deactivate') await adminApi.deactivateUser(user.id);
      if (kind === 'reactivate') await adminApi.reactivateUser(user.id);
      toast.success(`User ${kind === 'verify' ? 'verified' : kind === 'deactivate' ? 'suspended' : 'reactivated'}`);
      fetchUser();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="bg-gray-800 rounded-xl p-8 text-center">
          <p className="text-gray-400">User not found.</p>
        </div>
      </div>
    );
  }

  const p = user.profile;
  const fullName = p ? `${p.firstName || ''} ${p.lastName || ''}`.trim() : user.email;

  return (
    <div className="space-y-6">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" />
        Back to users
      </button>

      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-shrink-0">
            {p?.profilePicture ? (
              <Image
                src={p.profilePicture}
                alt={fullName}
                width={120}
                height={120}
                className="w-30 h-30 rounded-full object-cover"
                unoptimized
              />
            ) : (
              <div className="w-30 h-30 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-3xl font-bold">
                {p ? getInitials(p.firstName, p.lastName) : user.email[0].toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-2xl font-bold">{fullName || '—'}</h1>
              {p?.isVerified && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-900/40 text-blue-300 text-xs rounded-full">
                  <ShieldCheck className="w-3 h-3" />
                  Verified
                </span>
              )}
              <span
                className={cn(
                  'px-2 py-0.5 text-xs rounded-full',
                  user.isActive ? 'bg-green-900/40 text-green-300' : 'bg-red-900/40 text-red-300',
                )}
              >
                {user.isActive ? 'Active' : 'Suspended'}
              </span>
            </div>

            <div className="mt-3 space-y-1 text-sm text-gray-300">
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-500" /> {user.email}</p>
              {p?.phone && <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-500" /> {p.phone}</p>}
              {p && (
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" /> {[p.city, p.state, p.country].filter(Boolean).join(', ')}
                </p>
              )}
              <p className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-500" /> Joined {formatDate(user.createdAt)}</p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => window.open(`/admin/users/${user.id}/print`, '_blank')}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              {!p?.isVerified && (
                <button
                  onClick={() => doAction('verify')}
                  disabled={actionLoading !== null}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 rounded-lg text-sm"
                >
                  {actionLoading === 'verify' ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  Verify
                </button>
              )}
              {user.isActive ? (
                <button
                  onClick={() => doAction('deactivate')}
                  disabled={actionLoading !== null}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-70 rounded-lg text-sm"
                >
                  {actionLoading === 'deactivate' ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                  Suspend
                </button>
              ) : (
                <button
                  onClick={() => doAction('reactivate')}
                  disabled={actionLoading !== null}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-70 rounded-lg text-sm"
                >
                  {actionLoading === 'reactivate' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Reactivate
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {p && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Personal">
            <Row label="Gender" value={p.gender} />
            <Row label="Date of birth" value={p.dateOfBirth ? formatDate(p.dateOfBirth) : '—'} />
            <Row label="Age" value={p.age ? String(p.age) : '—'} />
            <Row label="Marital status" value={p.maritalStatus} />
            <Row label="Religion" value={p.religion} />
            <Row label="Caste" value={p.caste || '—'} />
            <Row label="Mother tongue" value={p.motherTongue || '—'} />
            <Row label="Height" value={p.height ? formatHeight(p.height) : '—'} />
          </Card>

          <Card title="Career" icon={<Briefcase className="w-5 h-5 text-blue-400" />}>
            <Row label="Profession" value={p.profession || '—'} />
            <Row label="Employer" value={p.employer || '—'} />
            <Row label="Income" value={p.annualIncome || '—'} />
            <Row label="Working city" value={p.workingCity || '—'} />
          </Card>

          <Card title="Education" icon={<GraduationCap className="w-5 h-5 text-purple-400" />}>
            <Row label="Education" value={p.education || '—'} />
            <Row label="Detail" value={p.educationDetail || '—'} />
          </Card>

          <Card title="Family" icon={<UsersIcon className="w-5 h-5 text-yellow-400" />}>
            <Row label="Father" value={p.fatherName || '—'} />
            <Row label="Mother" value={p.motherName || '—'} />
            <Row label="Siblings" value={p.siblings != null ? String(p.siblings) : '—'} />
            <Row label="Family type" value={p.familyType || '—'} />
          </Card>

          {p.bio && (
            <Card title="Bio" icon={<Heart className="w-5 h-5 text-pink-400" />}>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{p.bio}</p>
            </Card>
          )}

          {user.subscription && (
            <Card title="Subscription">
              <Row label="Status" value={user.subscription.status || '—'} />
              <Row label="Plan" value={(user.subscription as any).plan?.name || (user.subscription as any).planName || '—'} />
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

function Card({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
        {icon}
        {title}
      </h2>
      <div className="space-y-2 text-sm">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-400">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}
