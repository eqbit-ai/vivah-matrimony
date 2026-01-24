import axios, {
  AxiosInstance,
  AxiosError,
} from 'axios';
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

const API_URL = 'https://vivah-backend-production.up.railway.app/api/v1';

/**
 * ✅ Axios instance
 * - withCredentials REQUIRED for cookies
 * - DO NOT manually attach Authorization header
 */
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

/* =====================================================
   RESPONSE INTERCEPTOR
===================================================== */

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (
        typeof window !== 'undefined' &&
        !window.location.pathname.includes('/login')
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/* =====================================================
   AUTH
===================================================== */

export const authApi = {
  signUp: async (data: SignUpData): Promise<AuthResponse> =>
    (await api.post('/auth/signup', data)).data,

  login: async (credentials: LoginCredentials): Promise<AuthResponse> =>
    (await api.post('/auth/login', credentials)).data,

  getCurrentUser: async (): Promise<User> =>
    (await api.get('/auth/me')).data,
};

/* =====================================================
   PROFILES
===================================================== */

export const profilesApi = {
  getMyProfile: async (): Promise<Profile> =>
    (await api.get('/profiles/me')).data,

  updateProfile: async (data: ProfileFormData): Promise<Profile> =>
    (await api.put('/profiles/me', data)).data,

  updatePartnerPreferences: async (
    data: Partial<PartnerPreference>
  ): Promise<PartnerPreference> =>
    (await api.put('/profiles/me/preferences', data)).data,

  searchProfiles: async (
    filters: SearchFilters
  ): Promise<PaginatedResponse<Profile>> =>
    (await api.get('/profiles/search', { params: filters })).data,

  getProfile: async (id: string): Promise<Profile> =>
    (await api.get(`/profiles/${id}`)).data,
};

/* =====================================================
   INTERESTS
===================================================== */

export const interestsApi = {
  sendInterest: async (
    receiverId: string,
    message?: string
  ): Promise<Interest> =>
    (await api.post('/interests', { receiverId, message })).data,

  respondToInterest: async (
    interestId: string,
    status: 'ACCEPTED' | 'REJECTED'
  ): Promise<Interest> =>
    (await api.put(`/interests/${interestId}/respond`, { status })).data,

  getSent: async (page = 1, limit = 20) =>
    (await api.get('/interests/sent', { params: { page, limit } })).data,

  getReceived: async (page = 1, limit = 20) =>
    (await api.get('/interests/received', { params: { page, limit } })).data,

  getMatches: async (page = 1, limit = 20) =>
    (await api.get('/interests/matches', { params: { page, limit } })).data,
};

/* =====================================================
   NOTIFICATIONS
===================================================== */

export const notificationsApi = {
  getAll: async (): Promise<Notification[]> =>
    (await api.get('/notifications')).data,

  markAsRead: async (id: string) =>
    (await api.patch(`/notifications/${id}/read`)).data,
};

/* =====================================================
   SUBSCRIPTIONS
===================================================== */

export const subscriptionsApi = {
  getMySubscription: async (): Promise<Subscription> =>
    (await api.get('/subscriptions/me')).data,

  getPlans: async (): Promise<Subscription[]> =>
    (await api.get('/subscriptions/plans')).data,
};

/* =====================================================
   USERS
===================================================== */

export const usersApi = {
  updateSettings: async (data: Partial<User>): Promise<User> =>
    (await api.put('/users/me', data)).data,
};

/* =====================================================
   UPLOAD
===================================================== */

export const uploadApi = {
  uploadProfilePicture: async (file: File): Promise<{ imageUrl: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    return (
      await api.post('/upload/profile-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    ).data;
  },
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

  updateUserStatus: async (
    userId: string,
    status: 'ACTIVE' | 'SUSPENDED'
  ) =>
    (await api.patch(`/admin/users/${userId}/status`, { status })).data,
};

/* =====================================================
   DEFAULT EXPORT
===================================================== */

export default api;
