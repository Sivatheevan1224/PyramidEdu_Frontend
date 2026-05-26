"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api, setAccessToken, onTokenUpdate } from '@/lib/api';

// Roles that can access the web dashboard
export type UserRole = 'ADMIN' | 'MANAGER' | 'TEACHER' | 'STUDENT';
export const WEB_LOGIN_ALLOWED_ROLES: UserRole[] = ['ADMIN', 'MANAGER', 'TEACHER'];

export interface User {
  id: number;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isInitializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const router = useRouter();

  // Keep React state in sync with the in-memory token
  useEffect(() => {
    onTokenUpdate((token) => {
      setAccessTokenState(token);
      if (!token) setUser(null);
    });
  }, []);

  // Silent refresh on mount — restores session from httpOnly refresh cookie
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await api.post('/auth/refresh');
        const token = response.data?.data?.accessToken;
        if (token) {
          setAccessToken(token);
          const userRes = await api.get('/auth/me');
          const loggedUser: User = userRes.data?.data?.user;

          // Students don't have dashboard access — clear immediately
          if (loggedUser && !WEB_LOGIN_ALLOWED_ROLES.includes(loggedUser.role)) {
            await api.post('/auth/logout');
            setAccessToken(null);
            return;
          }
          setUser(loggedUser ?? null);
        }
      } catch {
        // No active session — safe to ignore
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const token: string = response.data?.data?.accessToken;
      const loggedUser: User = response.data?.data?.user;

      if (!token || !loggedUser) throw new Error('Invalid response structure');

      // Block student web login
      if (!WEB_LOGIN_ALLOWED_ROLES.includes(loggedUser.role)) {
        // Immediately logout the session on the backend
        await api.post('/auth/logout');
        setAccessToken(null);
        toast.error('Student accounts cannot log in via the web portal.');
        return;
      }

      setAccessToken(token);
      setUser(loggedUser);
      toast.success('Welcome back to PyramidEdu!');

      const roleTargetMap: Record<string, string> = {
        ADMIN:   '/admin',
        MANAGER: '/manager',
        TEACHER: '/teacher',
      };
      router.push(roleTargetMap[loggedUser.role] ?? '/login');
    } catch (error: any) {
      // Only show generic error if it wasn't already handled above
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message !== 'Invalid response structure') {
        toast.error('Login failed. Please verify your credentials.');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setAccessToken(null);
    setUser(null);
    toast.success('Logged out successfully.');
    router.push('/login');

    try {
      await api.post('/auth/logout');
    } catch {
      // Best-effort logout; UI already updated.
    }
  };

  const refresh = async (): Promise<string | null> => {
    try {
      const response = await api.post('/auth/refresh');
      const token = response.data?.data?.accessToken;
      if (token) {
        setAccessToken(token);
        return token;
      }
      return null;
    } catch {
      setAccessToken(null);
      setUser(null);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, isInitializing, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
