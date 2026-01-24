'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search, Filter, Heart, MapPin, Briefcase, GraduationCap,
  ChevronDown, X, CheckCircle2, Crown, Lock,
} from 'lucide-react';
import { profilesApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Profile, SearchFilters, RELIGIONS, INDIAN_STATES, MARITAL_STATUSES } from '@/types';
import { cn, getReligionLabel, debounce } from '@/lib/utils';

export default function SearchPage() {
  const { user } = useAuthStore();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  const [filters, setFilters] = useState<SearchFilters>({
    page: 1,
    limit: 12,
    minAge: undefined,
    maxAge: undefined,
    religion: undefined,
    caste: undefined,
    state: undefined,
    city: undefined,
  });

  const isPaid = user?.subscription?.status === 'PAID';

  const fetchProfiles = useCallback(async (searchFilters: SearchFilters, append = false) => {
    try {
      setLoading(true);
      const response = await profilesApi.searchProfiles(searchFilters);
      
      if (append) {
        setProfiles((prev) => [...prev, ...response.data]);
      } else {
        setProfiles(response.data);
      }
      
      setHasMore(response.meta.hasMore || false);
      setTotalResults(response.meta.total);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfiles(filters);
  }, []);

  const applyFilters = () => {
    setPage(1);
    fetchProfiles({ ...filters, page: 1 });
    setFiltersOpen(false);
  };

  const clearFilters = () => {
    const clearedFilters: SearchFilters = { page: 1, limit: 12 };
    setFilters(clearedFilters);
    setPage(1);
    fetchProfiles(clearedFilters);
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProfiles({ ...filters, page: nextPage }, true);
  };

  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== '' && v !== 1 && v !== 12
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900">Browse Profiles</h1>
          <p className="text-gray-600 mt-1">
            {totalResults} profiles found • Showing {user?.profile?.gender === 'MALE' ? 'Female' : 'Male'} profiles
          </p>
        </div>
        <button
          onClick={() => setFiltersOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <Filter className="w-5 h-5" />
          Filters
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.minAge && (
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm flex items-center gap-1">
              Min Age: {filters.minAge}
              <button onClick={() => setFilters({ ...filters, minAge: undefined })}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.maxAge && (
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm flex items-center gap-1">
              Max Age: {filters.maxAge}
              <button onClick={() => setFilters({ ...filters, maxAge: undefined })}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.religion && (
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm flex items-center gap-1">
              {getReligionLabel(filters.religion)}
              <button onClick={() => setFilters({ ...filters, religion: undefined })}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.state && (
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm flex items-center gap-1">
              {filters.state}
              <button onClick={() => setFilters({ ...filters, state: undefined })}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={clearFilters}
            className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-full text-sm"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Profiles Grid */}
      {loading && profiles.length === 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-card">
              <div className="h-56 bg-gray-200 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : profiles.length === 0 ? (
        <div className="text-center py-16">
          <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Profiles Found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your filters to see more results.</p>
          <button onClick={clearFilters} className="btn-primary">
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {profiles.map((profile, index) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/dashboard/profile/${profile.id}`}>
                  <div className="profile-card overflow-hidden group cursor-pointer">
                    <div className="relative h-56 bg-gradient-to-br from-primary-100 to-secondary-100">
                      {profile.profilePicture ? (
                        <img
                          src={profile.profilePicture}
                          alt={profile.firstName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-7xl font-bold text-primary-300">
                            {profile.firstName[0]}
                          </span>
                        </div>
                      )}
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 right-3 flex justify-between">
                        {profile.isVerified && (
                          <span className="badge-verified">
                            <CheckCircle2 className="w-3 h-3" /> Verified
                          </span>
                        )}
                        {profile._requiresSubscription && (
                          <span className="badge-premium">
                            <Crown className="w-3 h-3" /> Premium
                          </span>
                        )}
                      </div>

                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <button className="w-full py-2 bg-white/90 backdrop-blur-sm rounded-lg text-primary-600 font-semibold flex items-center justify-center gap-2">
                          <Heart className="w-4 h-4" />
                          View Profile
                        </button>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 text-lg">
                        {profile.firstName} {profile.lastName}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {profile.age} yrs • {getReligionLabel(profile.religion)}
                        {profile.caste && ` • ${profile.caste}`}
                      </p>
                      
                      <div className="mt-3 space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin className="w-4 h-4" />
                          {profile.city}, {profile.state}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Briefcase className="w-4 h-4" />
                          {profile.profession}
                        </div>
                      </div>

                      {profile._requiresSubscription && !isPaid && (
                        <div className="mt-3 p-2 bg-amber-50 rounded-lg flex items-center gap-2 text-amber-700 text-xs">
                          <Lock className="w-3 h-3" />
                          Upgrade to view full profile
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={loadMore}
                disabled={loading}
                className="btn-outline px-8"
              >
                {loading ? 'Loading...' : 'Load More Profiles'}
              </button>
            </div>
          )}
        </>
      )}

      {/* Filters Sidebar */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFiltersOpen(false)} />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-bold">Filters</h2>
                <button onClick={() => setFiltersOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Age Range */}
                <div>
                  <label className="block font-medium text-gray-700 mb-2">Age Range</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="number"
                        placeholder="Min Age"
                        value={filters.minAge || ''}
                        onChange={(e) => setFilters({ ...filters, minAge: e.target.value ? parseInt(e.target.value) : undefined })}
                        className="input-premium"
                        min={18}
                        max={60}
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Max Age"
                        value={filters.maxAge || ''}
                        onChange={(e) => setFilters({ ...filters, maxAge: e.target.value ? parseInt(e.target.value) : undefined })}
                        className="input-premium"
                        min={18}
                        max={60}
                      />
                    </div>
                  </div>
                </div>

                {/* Religion */}
                <div>
                  <label className="block font-medium text-gray-700 mb-2">Religion</label>
                  <select
                    value={filters.religion || ''}
                    onChange={(e) => setFilters({ ...filters, religion: e.target.value || undefined } as any)}
                    className="input-premium"
                  >
                    <option value="">All Religions</option>
                    {RELIGIONS.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>

                {/* Caste */}
                <div>
                  <label className="block font-medium text-gray-700 mb-2">Caste</label>
                  <input
                    type="text"
                    placeholder="Enter caste"
                    value={filters.caste || ''}
                    onChange={(e) => setFilters({ ...filters, caste: e.target.value || undefined })}
                    className="input-premium"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block font-medium text-gray-700 mb-2">State</label>
                  <select
                    value={filters.state || ''}
                    onChange={(e) => setFilters({ ...filters, state: e.target.value || undefined })}
                    className="input-premium"
                  >
                    <option value="">All States</option>
                    {INDIAN_STATES.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="block font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    placeholder="Enter city"
                    value={filters.city || ''}
                    onChange={(e) => setFilters({ ...filters, city: e.target.value || undefined })}
                    className="input-premium"
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button onClick={clearFilters} className="flex-1 btn-outline">
                  Clear All
                </button>
                <button onClick={applyFilters} className="flex-1 btn-primary">
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
