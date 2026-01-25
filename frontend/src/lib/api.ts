import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  AuthResponse,
  LoginCredentials,
  SignUpData,
  Profile,
  User,
  Subscription,
  Interest,
  Notification,
  PaginatedResponse,
  SearchFilters,
  ProfileFormData,
  PartnerPreference,
  DashboardMetrics,
  AdminSearchFilters,
} from '@/types';

/* =====================================================
   CONFIG
===================================================== */

const API_URL = 'https://vivah-matrimony.onrender.com/api/v1';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ✅ required for cookie/JWT auth
});

/* =====================================================
   RESPONSE INTERCEPTOR
===================================================== */

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (
      error.response?.status === 401 &&
      typeof window !== 'undefined'
    ) {
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

/* =====================================================
   AUTH
===================================================== */

export const authApi = {
  signUp: async (data: SignUpData): Promise<AuthResponse> =>
    (await api.post('/auth/signup', data)).data,

  login: async (data: LoginCredentials): Promise<AuthResponse> =>
    (await api.post('/auth/login', data)).data,

  getCurrentUser: async (): Promise<User> =>
    (await api.get('/auth/me')).data,

  changePassword: async (currentPassword: string, newPassword: string) =>
    (
      await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      })
    ).data,
};

/* =====================================================
   PROFILES
===================================================== */

export const profilesApi = {
  getMyProfile: async (): Promise<Profile> =>
    (await api.get('/profiles/me')).data,

  getProfile: async (id: string): Promise<Profile> =>
    (await api.get(`/profiles/${id}`)).data,

  getFullProfile: async (id: string): Promise<Profile> =>
    (await api.get(`/profiles/${id}/full`)).data,

  updateProfile: async (data: ProfileFormData): Promise<Profile> =>
    (await api.put('/profiles/me', data)).data,

  updatePartnerPreferences: async (
    data: Partial<PartnerPreference>,
  ): Promise<PartnerPreference> =>
    (await api.put('/profiles/me/preferences', data)).data,

  searchProfiles: async (
    filters: SearchFilters,
  ): Promise<PaginatedResponse<Profile>> =>
    (await api.get('/profiles/search', { params: filters })).data,
};

/* =====================================================
   INTERESTS
===================================================== */

export const interestsApi = {
  sendInterest: async (
    receiverId: string,
    message?: string,
  ): Promise<Interest> =>
    (await api.post('/interests', { receiverId, message })).data,

  respondToInterest: async (
    interestId: string,
    status: 'ACCEPTED' | 'REJECTED',
  ): Promise<Interest> =>
    (await api.put(`/interests/${interestId}/respond`, { status })).data,

  getSent: async (page = 1, limit = 20) =>
    (await api.get('/interests/sent', { params: { page, limit } })).data,

  getReceived: async (page = 1, limit = 20) =>
    (await api.get('/interests/received', { params: { page, limit } })).data,

  getMatches: async (page = 1, limit = 20) =>
    (await api.get('/interests/matches', { params: { page, limit } })).data,

  // UI aliases
  getSentInterests: async (page = 1, limit = 20) =>
    interestsApi.getSent(page, limit),

  getReceivedInterests: async (page = 1, limit = 20) =>
    interestsApi.getReceived(page, limit),

  getMutualMatches: async (page = 1, limit = 20) =>
    interestsApi.getMatches(page, limit),
};

/* =====================================================
   NOTIFICATIONS  ✅ FIXED + TYPE SAFE
===================================================== */

export const notificationsApi = {
  getNotifications: async (page = 1, limit = 20) =>
    (await api.get('/notifications', { params: { page, limit } })).data,

  // legacy alias (used in dashboard)
  getAll: async () =>
    (await api.get('/notifications')).data,

  markAsRead: async (id: string) =>
    (await api.patch(`/notifications/${id}/read`)).data,

  markAllAsRead: async () =>
    (await api.patch('/notifications/read-all')).data,

  deleteNotification: async (id: string) =>
    (await api.delete(`/notifications/${id}`)).data,

  /**
   * ✅ DASHBOARD SAFE
   * - array response
   * - paginated response
   */
  getUnreadCount: async (): Promise<{ unreadCount: number }> => {
    const res = await notificationsApi.getAll();

    if (Array.isArray(res)) {
      return {
        unreadCount: (res as Notification[]).filter(
          (n: Notification) => !n.isRead,
        ).length,
      };
    }

    if (res?.data && Array.isArray(res.data)) {
      return {
        unreadCount: (res.data as Notification[]).filter(
          (n: Notification) => !n.isRead,
        ).length,
      };
    }

    return { unreadCount: 0 };
  },
};

/* =====================================================
   SUBSCRIPTIONS
===================================================== */

export const subscriptionsApi = {
  getMySubscription: async (): Promise<Subscription> =>
    (await api.get('/subscriptions/status')).data, // ✅ correct endpoint

  getPlans: async (): Promise<Subscription[]> =>
    (await api.get('/subscriptions/plans')).data,

  // Dashboard alias
  getStatus: async (): Promise<Subscription> =>
    subscriptionsApi.getMySubscription(),
};

/* =====================================================
   USERS
===================================================== */

export const usersApi = {
  updateSettings: async (data: Partial<User>): Promise<User> =>
    (await api.put('/users/me', data)).data,

  deleteAccount: async () =>
    (await api.delete('/users/me')).data,
};

/* =====================================================
   ADMIN
===================================================== */

export interface AdminDashboardResponse {
  metrics: DashboardMetrics;
  recentUsers: any[];
  recentInterests: any[];
}

export const adminApi = {
  getDashboardMetrics: async (): Promise<AdminDashboardResponse> =>
    (await api.get('/admin/dashboard')).data,

  getUsers: async (filters: AdminSearchFilters) =>
    (await api.get('/admin/users', { params: filters })).data,

  searchUsers: async (filters: AdminSearchFilters) =>
    adminApi.getUsers(filters),

  updateUserStatus: async (
    userId: string,
    status: 'ACTIVE' | 'SUSPENDED',
  ) =>
    (await api.patch(`/admin/users/${userId}/status`, { status })).data,
};

/* =====================================================
   UPLOAD
===================================================== */

export const uploadApi = {
  uploadProfilePicture: async (
    file: File,
  ): Promise<{ imageUrl: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    return (
      await api.post('/upload/profile-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    ).data;
  },
};

export default api;
