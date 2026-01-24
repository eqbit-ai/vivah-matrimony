'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Crown, Check, Sparkles, Shield, Eye, Heart, Star, AlertCircle,
  Calendar, CreditCard,
} from 'lucide-react';
import { subscriptionsApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Subscription } from '@/types';
import { cn, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Plan {
  id: string;
  name: string;
  amount: number;
  amountDisplay: string;
  duration: number;
  durationDisplay: string;
  features: string[];
}

export default function SubscriptionPage() {
  const { user, fetchUser } = useAuthStore();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subData, plansData] = await Promise.all([
          subscriptionsApi.getStatus(),
          subscriptionsApi.getPlans(),
        ]);
        setSubscription(subData);
        setPlans(plansData);
      } catch (error) {
        console.error('Error fetching subscription data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubscribe = async (planType: 'BASIC' | 'PREMIUM') => {
    setProcessing(true);
    try {
      const orderData = await subscriptionsApi.createOrder(planType);

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Vivah Matrimony',
        description: `${planType} Subscription Plan`,
        order_id: orderData.orderId,
        prefill: orderData.prefill,
        theme: {
          color: '#8B0000',
        },
        handler: async (response: any) => {
          try {
            await subscriptionsApi.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success('Payment successful! Your subscription is now active.');
            
            // Refresh subscription status
            const newSub = await subscriptionsApi.getStatus();
            setSubscription(newSub);
            await fetchUser();
          } catch (error) {
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create order');
    } finally {
      setProcessing(false);
    }
  };

  const isPaid = subscription?.status === 'PAID';
  const isExpired = subscription?.isExpired;

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-40 bg-gray-200 rounded-2xl animate-pulse" />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
          <div className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Current Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'rounded-2xl p-8',
          isPaid && !isExpired
            ? 'bg-gradient-to-r from-secondary-400 to-secondary-500 text-gray-900'
            : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900'
        )}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crown className={cn('w-6 h-6', isPaid && !isExpired ? 'text-gray-900' : 'text-gray-500')} />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Current Plan
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold">
              {isPaid && !isExpired ? subscription?.planName : 'Free Plan'}
            </h2>
            {isPaid && !isExpired && subscription?.endDate && (
              <p className="mt-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Valid until {formatDate(subscription.endDate)} • {subscription.daysRemaining} days remaining
              </p>
            )}
          </div>
          {isPaid && !isExpired && (
            <div className="flex items-center gap-2 px-4 py-2 bg-white/30 rounded-lg">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">Premium Member</span>
            </div>
          )}
        </div>

        {isExpired && (
          <div className="mt-4 p-4 bg-red-100 rounded-xl flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span>Your subscription has expired. Renew now to continue enjoying premium features.</span>
          </div>
        )}
      </motion.div>

      {/* Plans */}
      <div>
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">
          {isPaid && !isExpired ? 'Extend Your Subscription' : 'Choose Your Plan'}
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'relative rounded-2xl border-2 overflow-hidden',
                plan.id === 'PREMIUM'
                  ? 'border-secondary-400 bg-gradient-to-br from-secondary-50 to-white'
                  : 'border-gray-200 bg-white'
              )}
            >
              {plan.id === 'PREMIUM' && (
                <div className="absolute top-0 right-0 bg-secondary-500 text-gray-900 px-4 py-1 text-sm font-semibold">
                  MOST POPULAR
                </div>
              )}

              <div className="p-8">
                <h3 className="font-display text-2xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.amountDisplay}</span>
                  <span className="text-gray-500 ml-2">/ {plan.durationDisplay}</span>
                </div>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center',
                        plan.id === 'PREMIUM' ? 'bg-secondary-100 text-secondary-600' : 'bg-green-100 text-green-600'
                      )}>
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.id as 'BASIC' | 'PREMIUM')}
                  disabled={processing}
                  className={cn(
                    'w-full mt-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all',
                    plan.id === 'PREMIUM'
                      ? 'bg-gradient-to-r from-secondary-400 to-secondary-500 text-gray-900 hover:from-secondary-500 hover:to-secondary-600'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  )}
                >
                  {processing ? (
                    'Processing...'
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Subscribe Now
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Feature Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-8"
      >
        <h3 className="font-display text-xl font-bold text-gray-900 mb-6">Why Upgrade to Premium?</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Eye, title: 'View Full Profiles', desc: 'Access complete profile information including family details' },
            { icon: Heart, title: 'Express Interest', desc: 'Show your interest to unlimited profiles' },
            { icon: Star, title: 'View Gallery', desc: 'See all uploaded photos of potential matches' },
            { icon: Sparkles, title: 'Priority Support', desc: 'Get dedicated assistance from our team' },
          ].map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                <feature.icon className="w-7 h-7 text-primary-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-1">{feature.title}</h4>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* FAQ */}
      <div className="glass-card p-8">
        <h3 className="font-display text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {[
            { q: 'Is my payment secure?', a: 'Yes, all payments are processed through Razorpay, India\'s leading payment gateway with bank-level security.' },
            { q: 'Can I cancel my subscription?', a: 'Subscriptions are non-refundable but you can enjoy all features until the validity expires.' },
            { q: 'What happens when my subscription expires?', a: 'Your account will revert to the free plan. You can renew anytime to restore premium features.' },
          ].map((faq, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-xl">
              <h4 className="font-semibold text-gray-900">{faq.q}</h4>
              <p className="text-gray-600 mt-1">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
