import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
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
  ScheduleMeetingData,
} from '@/types';

/**
 * 🔒 PRODUCTION-ONLY API BASE
 * No localhost
 * No fallback
 */
const API_URL = 'https://vivah-backend-production.up.railway.app/api/v1';

// Axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

/* ---------------- request interceptor ---------------- */

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

/* ---------------- response interceptor ---------------- */

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      Cookies.remove('accessToken');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/* ===================== AUTH ===================== */

export const authApi = {
  signUp: async (data: SignUpData): Promise<AuthResponse> => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, password: string): Promise<{ message: string }> => {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
    const response = await api.post('/auth/change-password', { currentPassword, newPassword });
    return response.data;
  },

  verifyEmail: async (token: string): Promise<{ message: string }> => {
    const response = await api.get(`/auth/verify-email?token=${token}`);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

/* ===================== PROFILES ===================== */

export const profilesApi = {
  getMyProfile: async (): Promise<Profile> => {
    const response = await api.get('/profiles/me');
    return response.data;
  },

  updateProfile: async (data: ProfileFormData): Promise<Profile> => {
    const response = await api.put('/profiles/me', data);
    return response.data;
  },

  updatePartnerPreferences: async (data: Partial<PartnerPreference>): Promise<PartnerPreference> => {
    const response = await api.put('/profiles/me/preferences', data);
    return response.data;
  },

  searchProfiles: async (filters: SearchFilters): Promise<PaginatedResponse<Profile>> => {
    const response = await api.get('/profiles/search', { params: filters });
    return response.data;
  },

  getProfile: async (id: string): Promise<Profile> => {
    const response = await api.get(`/profiles/${id}`);
    return response.data;
  },

  getFullProfile: async (id: string): Promise<Profile> => {
    const response = await api.get(`/profiles/${id}/full`);
    return response.data;
  },

  addGalleryImage: async (imageUrl: string, caption?: string): Promise<any> => {
    const response = await api.post('/profiles/me/gallery', { imageUrl, caption });
    return response.data;
  },

  removeGalleryImage: async (imageId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/profiles/me/gallery/${imageId}`);
    return response.data;
  },
};

/* ===================== INTERESTS ===================== */

export const interestsApi = {
  sendInterest: async (receiverId: string, message?: string) => {
    const response = await api.post('/interests', { receiverId, message });
    return response.data;
  },

  respondToInterest: async (interestId: string, status: 'ACCEPTED' | 'REJECTED') => {
    const response = await api.put(`/interests/${interestId}/respond`, { status });
    return response.data;
  },

  getSentInterests: async (page = 1, limit = 20) => {
    const response = await api.get('/interests/sent', { params: { page, limit } });
    return response.data;
  },

  getReceivedInterests: async (page = 1, limit = 20) => {
    const response = await api.get('/interests/received', { params: { page, limit } });
    return response.data;
  },

  getMutualMatches: async (page = 1, limit = 20) => {
    const response = await api.get('/interests/matches', { params: { page, limit } });
    return response.data;
  },
};

/* ===================== UPLOAD ===================== */

export const uploadApi = {
  uploadProfilePicture: async (file: File): Promise<{ imageUrl: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload/profile-picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  },

  uploadGalleryImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload/gallery', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  },
};

/* ===================== EXPORT ===================== */

export default api;
