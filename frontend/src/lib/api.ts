import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import Cookies from 'js-cookie';
import {
  AuthResponse,
  LoginCredentials,
  SignUpData,
  Profile,
  User,
  PaginatedResponse,
  SearchFilters,
  ProfileFormData,
  PartnerPreference,
  DashboardMetrics,
  AdminSearchFilters,
} from '@/types';

/**
 * 🚀 Production backend
 */
const API_URL = 'https://vivah-backend-production.up.railway.app/api/v1';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

/* ===================== INTERCEPTORS ===================== */

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      Cookies.remove('accessToken');
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

/* ===================== AUTH ===================== */

export const authApi = {
  signUp: async (data: SignUpData): Promise<AuthResponse> =>
    (await api.post('/auth/signup', data)).data,

  login: async (credentials: LoginCredentials): Promise<AuthResponse> =>
    (await api.post('/auth/login', credentials)).data,

  getCurrentUser: async (): Promise<User> =>
    (await api.get('/auth/me')).data,
};

/* ===================== PROFILES ===================== */

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
};

/* ===================== ADMIN ===================== */

export const adminApi = {
  getDashboardMetrics: async (): Promise<DashboardMetrics> =>
    (await api.get('/admin/dashboard')).data,

  getUsers: async (filters: AdminSearchFilters) =>
    (await api.get('/admin/users', { params: filters })).data,

  getUserById: async (userId: string): Promise<User> =>
    (await api.get(`/admin/users/${userId}`)).data,

  updateUserStatus: async (
    userId: string,
    status: 'ACTIVE' | 'SUSPENDED'
  ) =>
    (await api.patch(`/admin/users/${userId}/status`, { status })).data,

  getSubscriptions: async () =>
    (await api.get('/admin/subscriptions')).data,

  getReports: async () =>
    (await api.get('/admin/reports')).data,
};

/* ===================== EXPORT ===================== */

export default api;
