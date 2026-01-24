import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { User, LoginCredentials, SignUpData } from '@/types';
import { authApi } from './api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login(credentials);
          Cookies.set('accessToken', response.accessToken, { expires: 7 });
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Login failed',
            isLoading: false,
          });
          throw error;
        }
      },

      signUp: async (data: SignUpData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.signUp(data);
          Cookies.set('accessToken', response.accessToken, { expires: 7 });
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Sign up failed',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        Cookies.remove('accessToken');
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      fetchUser: async () => {
        const token = Cookies.get('accessToken');
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        set({ isLoading: true });
        try {
          const user = await authApi.getCurrentUser();
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          Cookies.remove('accessToken');
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      clearError: () => set({ error: null }),

      setUser: (user: User | null) =>
        set({
          user,
          isAuthenticated: !!user,
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
