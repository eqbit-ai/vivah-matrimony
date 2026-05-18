'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart, Mail, Lock, Eye, EyeOff, User, Phone, MapPin, Briefcase, GraduationCap, ArrowRight, Loader2, Calendar } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/lib/store';
import { RELIGIONS, INDIAN_STATES } from '@/types';

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9!@#$%^&*])/,
    'Password must contain uppercase, lowercase, and number or special character'
  ),
  confirmPassword: z.string(),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  gender: z.enum(['MALE', 'FEMALE'], { required_error: 'Please select your gender' }),
  dateOfBirth: z.string().min(1, 'Please enter your date of birth'),
  religion: z.string().min(1, 'Please select your religion'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
  state: z.string().min(1, 'Please select your state'),
  city: z.string().min(2, 'Please enter your city'),
  education: z.string().min(2, 'Please enter your education'),
  profession: z.string().min(2, 'Please enter your profession'),
  caste: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { signUp, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);

  const { register, handleSubmit, watch, formState: { errors }, trigger } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const nextStep = async () => {
    const fieldsToValidate = step === 1 
      ? ['email', 'password', 'confirmPassword']
      : step === 2 
        ? ['firstName', 'lastName', 'gender', 'dateOfBirth', 'religion', 'phone']
        : ['state', 'city', 'education', 'profession'];
    
    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) setStep(step + 1);
  };

  const onSubmit = async (data: SignupFormData) => {
    try {
      const { confirmPassword, ...signupData } = data;
      await signUp({ ...signupData, dataConsent: true } as any);
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Sign up failed. Please try again.');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" {...register('email')} className="input-premium pl-12" placeholder="Enter your email" />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} {...register('password')} className="input-premium pl-12 pr-12" placeholder="Create a strong password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="password" {...register('confirmPassword')} className="input-premium pl-12" placeholder="Confirm your password" />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" {...register('firstName')} className="input-premium pl-12" placeholder="First name" />
                </div>
                {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input type="text" {...register('lastName')} className="input-premium" placeholder="Last name" />
                {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <div className="grid grid-cols-2 gap-4">
                {[{ value: 'MALE', label: 'Male' }, { value: 'FEMALE', label: 'Female' }].map((option) => (
                  <label key={option.value} className="relative cursor-pointer">
                    <input type="radio" {...register('gender')} value={option.value} className="peer sr-only" />
                    <div className="p-4 border-2 rounded-xl text-center peer-checked:border-primary-500 peer-checked:bg-primary-50 transition-all">
                      <span className="font-medium">{option.label}</span>
                    </div>
                  </label>
                ))}
              </div>
              {errors.gender && <p className="mt-1 text-sm text-red-500">{errors.gender.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="date" {...register('dateOfBirth')} className="input-premium pl-12" max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]} />
              </div>
              {errors.dateOfBirth && <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
              <select {...register('religion')} className="input-premium">
                <option value="">Select Religion</option>
                {RELIGIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
              {errors.religion && <p className="mt-1 text-sm text-red-500">{errors.religion.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="tel" {...register('phone')} className="input-premium pl-12" placeholder="10-digit mobile number" maxLength={10} />
              </div>
              {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select {...register('state')} className="input-premium pl-12">
                  <option value="">Select State</option>
                  {INDIAN_STATES.map((state) => <option key={state} value={state}>{state}</option>)}
                </select>
              </div>
              {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input type="text" {...register('city')} className="input-premium" placeholder="Enter your city" />
              {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Highest Education</label>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" {...register('education')} className="input-premium pl-12" placeholder="e.g., B.Tech, MBA, MBBS" />
              </div>
              {errors.education && <p className="mt-1 text-sm text-red-500">{errors.education.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profession</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" {...register('profession')} className="input-premium pl-12" placeholder="e.g., Software Engineer, Doctor" />
              </div>
              {errors.profession && <p className="mt-1 text-sm text-red-500">{errors.profession.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Caste (Optional)</label>
              <input type="text" {...register('caste')} className="input-premium" placeholder="Enter your caste" />
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decoration */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23DAA520' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-12 text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <Heart className="w-20 h-20 mx-auto mb-6 text-secondary-400" fill="currentColor" />
            <h2 className="font-display text-4xl font-bold mb-4">Start Your Journey</h2>
            <p className="text-xl text-primary-200 max-w-md">Create your profile and begin your search for the perfect life partner.</p>
            <p className="font-hindi text-xl text-secondary-300 mt-6">"आपके सपनों का साथी यहाँ इंतज़ार कर रहा है"</p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <span className="font-display text-2xl font-bold text-gradient">Vivah</span>
          </Link>

          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Create Your Profile</h1>
          <p className="text-gray-600 mb-4">Step {step} of 3</p>

          {/* Progress Bar */}
          <div className="flex gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`flex-1 h-2 rounded-full ${s <= step ? 'bg-primary-500' : 'bg-gray-200'}`} />
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStep()}

            <div className="mt-8 flex gap-4">
              {step > 1 && (
                <button type="button" onClick={() => setStep(step - 1)} className="flex-1 btn-outline">Back</button>
              )}
              {step < 3 ? (
                <button type="button" onClick={nextStep} className="flex-1 btn-primary flex items-center justify-center gap-2">
                  Continue <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create Account <ArrowRight className="w-5 h-5" /></>}
                </motion.button>
              )}
            </div>
          </form>

          <p className="mt-8 text-center text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-primary-600 hover:text-primary-700 font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
