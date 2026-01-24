'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Home, User, Search, Bell, Settings, LogOut, Crown,
  Users, MessageSquare, Eye, ChevronDown, Menu, X, Shield,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { cn, getInitials } from '@/lib/utils';

const userNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/profile', label: 'My Profile', icon: User },
  { href: '/dashboard/search', label: 'Browse Profiles', icon: Search },
  { href: '/dashboard/interests', label: 'Interests', icon: Heart },
  { href: '/dashboard/matches', label: 'Matches', icon: Users },
  { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  { href: '/dashboard/subscription', label: 'Subscription', icon: Crown },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/users', label: 'Manage Users', icon: Users },
  { href: '/admin/interests', label: 'Interests', icon: Heart },
  { href: '/admin/subscriptions', label: 'Subscriptions', icon: Crown },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout, fetchUser, isLoading } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      fetchUser().catch(() => router.push('/login'));
    }
  }, [isAuthenticated, fetchUser, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center animate-pulse">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const isAdmin = user.role === 'ADMIN';
  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <div>
                <span className="font-display text-xl font-bold text-gradient">Vivah</span>
                {isAdmin && <span className="ml-2 badge-premium text-xs">Admin</span>}
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                        isActive
                          ? 'bg-primary-50 text-primary-600 font-semibold'
                          : 'text-gray-600 hover:bg-gray-100'
                      )}
                    >
                      <item.icon className={cn('w-5 h-5', isActive && 'text-primary-500')} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Info */}
          <div className="p-4 border-t">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition-colors"
              >
                {user.profile?.profilePicture ? (
                  <img
                    src={user.profile.profilePicture}
                    alt={user.profile.firstName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-bold">
                    {getInitials(user.profile?.firstName || 'U', user.profile?.lastName || 'ser')}
                  </div>
                )}
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900 text-sm">
                    {user.profile?.firstName} {user.profile?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <ChevronDown className={cn('w-4 h-4 transition-transform', userMenuOpen && 'rotate-180')} />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-lg border overflow-hidden"
                  >
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <Link href={isAdmin ? '/admin' : '/dashboard/notifications'} className="relative p-2 rounded-lg hover:bg-gray-100">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Link>

              {/* Profile Quick Access */}
              <Link
                href={isAdmin ? '/admin' : '/dashboard/profile'}
                className="hidden sm:flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
              >
                {user.profile?.profilePicture ? (
                  <img
                    src={user.profile.profilePicture}
                    alt={user.profile.firstName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white text-sm font-bold">
                    {getInitials(user.profile?.firstName || 'U', user.profile?.lastName || 'ser')}
                  </div>
                )}
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
