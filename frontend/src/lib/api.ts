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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
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

// Response interceptor to handle errors
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

// Auth API
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

// Profiles API
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

// Interests API
export const interestsApi = {
  sendInterest: async (receiverId: string, message?: string): Promise<{ message: string; interest: Interest }> => {
    const response = await api.post('/interests', { receiverId, message });
    return response.data;
  },

  respondToInterest: async (interestId: string, status: 'ACCEPTED' | 'REJECTED'): Promise<{ message: string; interest: Interest }> => {
    const response = await api.put(`/interests/${interestId}/respond`, { status });
    return response.data;
  },

  getSentInterests: async (page = 1, limit = 20): Promise<PaginatedResponse<Interest>> => {
    const response = await api.get('/interests/sent', { params: { page, limit } });
    return response.data;
  },

  getReceivedInterests: async (page = 1, limit = 20): Promise<PaginatedResponse<Interest>> => {
    const response = await api.get('/interests/received', { params: { page, limit } });
    return response.data;
  },

  getMutualMatches: async (page = 1, limit = 20): Promise<PaginatedResponse<any>> => {
    const response = await api.get('/interests/matches', { params: { page, limit } });
    return response.data;
  },
};

// Subscriptions API
export const subscriptionsApi = {
  getPlans: async (): Promise<any[]> => {
    const response = await api.get('/subscriptions/plans');
    return response.data;
  },

  getStatus: async (): Promise<Subscription> => {
    const response = await api.get('/subscriptions/status');
    return response.data;
  },

  createOrder: async (planType: 'BASIC' | 'PREMIUM'): Promise<any> => {
    const response = await api.post('/subscriptions/create-order', { planType });
    return response.data;
  },

  verifyPayment: async (paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Promise<{ message: string; subscription: Subscription }> => {
    const response = await api.post('/subscriptions/verify-payment', paymentData);
    return response.data;
  },
};

// Notifications API
export const notificationsApi = {
  getNotifications: async (page = 1, limit = 20, unreadOnly = false): Promise<PaginatedResponse<Notification> & { unreadCount: number }> => {
    const response = await api.get('/notifications', { params: { page, limit, unreadOnly } });
    return response.data;
  },

  getUnreadCount: async (): Promise<{ unreadCount: number }> => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  markAsRead: async (notificationId: string): Promise<Notification> => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async (): Promise<{ message: string }> => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },

  deleteNotification: async (notificationId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },
};

// Users API
export const usersApi = {
  getProfileViews: async (page = 1, limit = 20): Promise<PaginatedResponse<any>> => {
    const response = await api.get('/users/profile-views', { params: { page, limit } });
    return response.data;
  },

  deleteAccount: async (): Promise<{ message: string }> => {
    const response = await api.delete('/users/account');
    return response.data;
  },
};

// Upload API
export const uploadApi = {
  uploadProfilePicture: async (file: File): Promise<{ imageUrl: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload/profile-picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  uploadGalleryImage: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload/gallery', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

// Admin API
export const adminApi = {
  getDashboard: async (): Promise<{ metrics: DashboardMetrics; recentUsers: User[]; recentInterests: Interest[] }> => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  searchUsers: async (filters: AdminSearchFilters): Promise<PaginatedResponse<User>> => {
    const response = await api.get('/admin/users', { params: filters });
    return response.data;
  },

  getUserDetails: async (userId: string): Promise<User> => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },

  verifyProfile: async (userId: string): Promise<{ message: string }> => {
    const response = await api.put(`/admin/users/${userId}/verify`);
    return response.data;
  },

  deactivateUser: async (userId: string, reason: string): Promise<{ message: string }> => {
    const response = await api.put(`/admin/users/${userId}/deactivate`, { reason });
    return response.data;
  },

  reactivateUser: async (userId: string): Promise<{ message: string }> => {
    const response = await api.put(`/admin/users/${userId}/reactivate`);
    return response.data;
  },

  getAllInterests: async (page = 1, limit = 20, status?: string): Promise<PaginatedResponse<Interest>> => {
    const response = await api.get('/admin/interests', { params: { page, limit, status } });
    return response.data;
  },

  scheduleMeeting: async (data: ScheduleMeetingData): Promise<{ message: string; interest: Interest }> => {
    const response = await api.post('/admin/interests/schedule-meeting', data);
    return response.data;
  },

  getAllSubscriptions: async (page = 1, limit = 20, status?: string): Promise<PaginatedResponse<Subscription>> => {
    const response = await api.get('/admin/subscriptions', { params: { page, limit, status } });
    return response.data;
  },

  activateSubscription: async (userId: string, days: number): Promise<Subscription> => {
    const response = await api.put(`/admin/subscriptions/${userId}/activate`, { days });
    return response.data;
  },

  deactivateSubscription: async (userId: string): Promise<Subscription> => {
    const response = await api.put(`/admin/subscriptions/${userId}/deactivate`);
    return response.data;
  },

  getAdminLogs: async (page = 1, limit = 50): Promise<PaginatedResponse<any>> => {
    const response = await api.get('/admin/logs', { params: { page, limit } });
    return response.data;
  },
};

export default api;
