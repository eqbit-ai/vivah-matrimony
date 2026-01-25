'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Crown,
  Check,
  Shield,
  Eye,
  Heart,
  Star,
  Sparkles,
  AlertCircle,
  CreditCard,
  Calendar,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { subscriptionsApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Subscription } from '@/types';
import { cn, formatDate } from '@/lib/utils';

/* ==============================
   UI PLAN TYPE (FRONTEND ONLY)
================================ */
interface Plan {
  id: 'BASIC' | 'PREMIUM';
  name: string;
  amountDisplay: string;
  durationDisplay: string;
  features: string[];
}

const RAZORPAY_ENABLED = false;

export default function SubscriptionPage() {
  const { fetchUser } = useAuthStore();

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  /* ==============================
     LOAD DATA
  ================================ */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [sub, backendPlans] = await Promise.all([
          subscriptionsApi.getMySubscription(),
          subscriptionsApi.getPlans(),
        ]);

        setSubscription(sub);

        // ✅ MAP BACKEND → UI PLAN
        const uiPlans: Plan[] = backendPlans.map((p: any) => ({
          id: p.planType,               // BASIC | PREMIUM
          name: p.name,
          amountDisplay: p.amountDisplay,
          durationDisplay: p.durationDisplay,
          features: p.features ?? [],
        }));

        setPlans(uiPlans);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load subscription info');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSubscribe = () => {
    toast('Payments coming soon 🚀', { icon: '🔒' });
  };

  if (loading) {
    return <div className="h-40 bg-gray-200 rounded-2xl animate-pulse" />;
  }

  const isPaid = subscription?.status === 'PAID';
  const isExpired = subscription?.isExpired;

  return (
    <div className="space-y-8">
      {/* CURRENT PLAN */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'rounded-2xl p-8',
          isPaid && !isExpired
            ? 'bg-gradient-to-r from-secondary-400 to-secondary-500'
            : 'bg-gray-100'
        )}
      >
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">
              {isPaid && !isExpired ? subscription?.planName : 'Free Plan'}
            </h2>
            {subscription?.endDate && (
              <p className="mt-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Valid until {formatDate(subscription.endDate)}
              </p>
            )}
          </div>

          {isPaid && !isExpired && (
            <div className="flex items-center gap-2 bg-white/30 px-4 py-2 rounded-lg">
              <Shield className="w-5 h-5" />
              Premium Member
            </div>
          )}
        </div>

        {isExpired && (
          <div className="mt-4 bg-red-100 text-red-700 p-4 rounded-xl flex gap-3">
            <AlertCircle />
            Subscription expired. Renew when payments go live.
          </div>
        )}
      </motion.div>

      {/* PLANS */}
      <div>
        <h3 className="text-2xl font-bold mb-6">Choose Your Plan</h3>

        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                'rounded-2xl border p-8',
                plan.id === 'PREMIUM'
                  ? 'border-secondary-400'
                  : 'border-gray-200'
              )}
            >
              <h4 className="text-2xl font-bold">{plan.name}</h4>

              <div className="mt-3 text-3xl font-bold">
                {plan.amountDisplay}
                <span className="text-sm text-gray-500">
                  {' '}
                  / {plan.durationDisplay}
                </span>
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex gap-2 items-center">
                    <Check className="text-green-600 w-4 h-4" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                disabled
                onClick={handleSubscribe}
                className="mt-8 w-full bg-gray-300 cursor-not-allowed py-4 rounded-xl flex items-center justify-center gap-2 font-semibold"
              >
                <CreditCard className="w-5 h-5" />
                Coming Soon
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* WHY PREMIUM */}
      <div className="glass-card p-8">
        <h3 className="text-xl font-bold mb-6">Why go Premium?</h3>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: Eye, text: 'View full profiles' },
            { icon: Heart, text: 'Unlimited interests' },
            { icon: Star, text: 'Photo gallery access' },
            { icon: Sparkles, text: 'Priority support' },
          ].map((f, i) => (
            <div key={i} className="text-center">
              <f.icon className="mx-auto mb-2 w-6 h-6 text-primary-600" />
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
