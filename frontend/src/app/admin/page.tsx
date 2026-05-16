'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Heart,
  Crown,
  ArrowUpRight,
  UserPlus,
  Activity,
  PieChart,
} from 'lucide-react';
import { adminApi } from '@/lib/api';
import { formatDate, getInterestStatusColor } from '@/lib/utils';
import Link from 'next/link';

interface DashboardData {
  metrics: {
    totalUsers: number;
    maleProfiles: number;
    femaleProfiles: number;
    totalInterests: number;
    pendingInterests: number;
    acceptedInterests: number;
    paidSubscriptions: number;
    freeUsers: number;
  };
  recentUsers: any[];
  recentInterests: any[];
}

type CasteRow = { label: string; male: number; female: number; total: number };

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [demoLoading, setDemoLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData: DashboardData =
          await adminApi.getDashboardMetrics();

        setData(dashboardData);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await adminApi.getUsers({ page: 1, limit: 1000 });
        setAllUsers(res.data || []);
      } catch (err) {
        console.error('Error fetching users for demographics:', err);
      } finally {
        setDemoLoading(false);
      }
    };
    fetchAll();
  }, []);

  const { casteRows, religionRows } = useMemo(() => {
    const caste: Record<string, CasteRow> = {};
    const religion: Record<string, CasteRow> = {};
    for (const u of allUsers) {
      const p = u.profile;
      if (!p) continue;
      const g = p.gender === 'FEMALE' ? 'female' : 'male';
      const cKey = (p.caste && p.caste.trim()) || 'Not specified';
      const rKey = p.religion || 'Not specified';
      if (!caste[cKey]) caste[cKey] = { label: cKey, male: 0, female: 0, total: 0 };
      caste[cKey][g] += 1;
      caste[cKey].total += 1;
      if (!religion[rKey]) religion[rKey] = { label: rKey, male: 0, female: 0, total: 0 };
      religion[rKey][g] += 1;
      religion[rKey].total += 1;
    }
    const sorter = (a: CasteRow, b: CasteRow) => b.total - a.total;
    return {
      casteRows: Object.values(caste).sort(sorter),
      religionRows: Object.values(religion).sort(sorter),
    };
  }, [allUsers]);

  if (loading || !data) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-800 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  const { metrics } = data;

  const statCards = [
    {
      label: 'Total Users',
      value: metrics.totalUsers,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      change: '+12%',
    },
    {
      label: 'Male Profiles',
      value: metrics.maleProfiles,
      icon: Users,
      color: 'from-indigo-500 to-purple-500',
    },
    {
      label: 'Female Profiles',
      value: metrics.femaleProfiles,
      icon: Users,
      color: 'from-pink-500 to-rose-500',
    },
    {
      label: 'Total Interests',
      value: metrics.totalInterests,
      icon: Heart,
      color: 'from-red-500 to-pink-500',
    },
    {
      label: 'Pending Interests',
      value: metrics.pendingInterests,
      icon: Activity,
      color: 'from-yellow-500 to-orange-500',
    },
    {
      label: 'Accepted Matches',
      value: metrics.acceptedInterests,
      icon: Heart,
      color: 'from-green-500 to-emerald-500',
    },
    {
      label: 'Paid Subscriptions',
      value: metrics.paidSubscriptions,
      icon: Crown,
      color: 'from-amber-500 to-yellow-500',
    },
    {
      label: 'Free Users',
      value: metrics.freeUsers,
      icon: UserPlus,
      color: 'from-gray-500 to-slate-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-400 mt-1">
          Overview of your matrimonial platform
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <div className="flex justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              {stat.change && (
                <span className="flex items-center text-green-400 text-sm">
                  <ArrowUpRight className="w-4 h-4" />
                  {stat.change}
                </span>
              )}
            </div>
            <p className="text-3xl font-bold text-white">
              {stat.value.toLocaleString()}
            </p>
            <p className="text-sm text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Demographics: caste + religion */}
      <div className="grid lg:grid-cols-2 gap-6">
        <DemographicsCard
          title="Caste Distribution"
          rows={casteRows}
          loading={demoLoading}
          totalUsers={data.metrics.totalUsers}
        />
        <DemographicsCard
          title="Religion Distribution"
          rows={religionRows}
          loading={demoLoading}
          totalUsers={data.metrics.totalUsers}
        />
      </div>

      {/* Recent Users & Interests */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-6 border-b border-gray-700 flex justify-between">
            <h2 className="font-bold text-lg">Recent Users</h2>
            <Link href="/admin/users" className="text-primary-400 text-sm">
              View All →
            </Link>
          </div>
          <div className="divide-y divide-gray-700">
            {data.recentUsers.slice(0, 5).map((user: any) => (
              <div key={user.id} className="p-4 flex justify-between">
                <div>
                  <p className="font-medium text-white">
                    {user.profile?.firstName} {user.profile?.lastName}
                  </p>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {formatDate(user.createdAt)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-6 border-b border-gray-700 flex justify-between">
            <h2 className="font-bold text-lg">Recent Interests</h2>
            <Link href="/admin/interests" className="text-primary-400 text-sm">
              View All →
            </Link>
          </div>
          <div className="divide-y divide-gray-700">
            {data.recentInterests.slice(0, 5).map((interest: any) => (
              <div key={interest.id} className="p-4">
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-white">
                    {interest.sender?.profile?.firstName} →
                    {interest.receiver?.profile?.firstName}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getInterestStatusColor(
                      interest.status
                    )}`}
                  >
                    {interest.status}
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  {formatDate(interest.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DemographicsCard({
  title,
  rows,
  loading,
  totalUsers,
}: {
  title: string;
  rows: CasteRow[];
  loading: boolean;
  totalUsers: number;
}) {
  const top = rows.slice(0, 10);
  const max = top.length > 0 ? top[0].total : 1;

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700">
      <div className="p-6 border-b border-gray-700 flex items-center gap-3">
        <PieChart className="w-5 h-5 text-primary-400" />
        <h2 className="font-bold text-lg">{title}</h2>
      </div>
      <div className="p-4">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-700/50 rounded animate-pulse" />
            ))}
          </div>
        ) : top.length === 0 ? (
          <p className="py-6 text-center text-gray-500 text-sm">No data yet</p>
        ) : (
          <ul className="space-y-2">
            {top.map((row) => {
              const pct = totalUsers ? Math.round((row.total / totalUsers) * 100) : 0;
              const malePct = row.total ? (row.male / row.total) * 100 : 0;
              return (
                <li key={row.label} className="px-2 py-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-white truncate pr-2">{row.label}</span>
                    <span className="text-gray-400 flex-shrink-0">
                      <span className="text-blue-400">{row.male}M</span>
                      {' / '}
                      <span className="text-pink-400">{row.female}F</span>
                      <span className="ml-2 text-gray-500">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden bg-gray-700 flex" style={{ width: `${(row.total / max) * 100}%` }}>
                    <div className="bg-blue-500" style={{ width: `${malePct}%` }} />
                    <div className="bg-pink-500" style={{ width: `${100 - malePct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
