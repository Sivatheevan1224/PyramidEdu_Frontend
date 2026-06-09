"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { api, setAccessToken, onTokenUpdate, executeTokenRefresh } from "@/lib/api";
import {
  clearPersistedSession,
  isPublicRoute,
  setPersistedSession,
  shouldAttemptSilentRefresh,
  hasPersistedSession,
} from "@/lib/auth-session";

// Roles that can access the web dashboard
export type UserRole = "ADMIN" | "MANAGER" | "TEACHER" | "STUDENT";
export const WEB_LOGIN_ALLOWED_ROLES: UserRole[] = [
  "ADMIN",
  "MANAGER",
  "TEACHER",
];

export interface User {
  id: number;
  email: string;
  role: UserRole;
  isActive: boolean;
  forcePasswordChange: boolean;
  createdAt: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  subject?: string;
  subjectId?: string;
  specialization?: string;
  profileImage?: string;
  teacher?: any;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isInitializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<string | null>;
  updateUser: (partialUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
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
      if (!hasPersistedSession()) {
        setIsInitializing(false);
        return;
      }

      try {
        const token = await executeTokenRefresh();
        if (token) {
          setAccessToken(token);
          setPersistedSession(true, pathname);
          const userRes = await api.get("/auth/me");
          const rawUser: any = userRes.data?.data?.user;
          const loggedUser: User = {
            ...rawUser,
            forcePasswordChange: rawUser.forcePwdChange ?? false,
          };

          // Students don't have dashboard access — clear immediately
          if (
            loggedUser &&
            !WEB_LOGIN_ALLOWED_ROLES.includes(loggedUser.role)
          ) {
            await api.post("/auth/logout");
            setAccessToken(null);
            clearPersistedSession();
            return;
          }
          setUser(loggedUser ?? null);

          if (loggedUser?.forcePasswordChange) {
            router.push("/change-password");
            return;
          }

          // Auto-redirect to dashboard if on a public route
          if (isPublicRoute(pathname)) {
            const roleTargetMap: Record<string, string> = {
              ADMIN: "/admin",
              MANAGER: "/manager",
              TEACHER: "/teacher",
            };
            router.push(roleTargetMap[loggedUser.role] ?? "/login");
          }
        } else {
          clearPersistedSession();
          setAccessToken(null);
        }
      } catch (err: any) {
        if (err.response?.status !== 401) {
          console.error("Auth initialization failed:", err);
        } else {
          console.log("No active session found or refresh token has expired.");
        }
        clearPersistedSession();
        setAccessToken(null);
        if (!isPublicRoute(pathname)) {
          router.push("/login?expired=true");
        }
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, [pathname, router]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });
      const token: string = response.data?.data?.accessToken;
      const rawUser: any = response.data?.data?.user;
      const loggedUser: User = {
        ...rawUser,
        forcePasswordChange: rawUser.forcePwdChange ?? false,
      };

      if (!token || !loggedUser) throw new Error("Invalid response structure");

      // Block student web login
      if (!WEB_LOGIN_ALLOWED_ROLES.includes(loggedUser.role)) {
        // Immediately logout the session on the backend
        await api.post("/auth/logout");
        setAccessToken(null);
        toast.error("Student accounts cannot log in via the web portal.");
        return;
      }

      setAccessToken(token);
      setPersistedSession(true, pathname);
      setUser(loggedUser);
      toast.success("Welcome back to PyramidEdu!");

      if (loggedUser.forcePasswordChange) {
        router.push("/change-password");
        return;
      }

      const roleTargetMap: Record<string, string> = {
        ADMIN: "/admin",
        MANAGER: "/manager",
        TEACHER: "/teacher",
      };
      router.push(roleTargetMap[loggedUser.role] ?? "/login");
    } catch (error: any) {
      // Only show generic error if it wasn't already handled above
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message !== "Invalid response structure") {
        toast.error("Login failed. Please verify your credentials.");
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setAccessToken(null);
    setUser(null);
    clearPersistedSession();
    toast.success("Logged out successfully.");
    router.push("/login");

    try {
      await api.post("/auth/logout");
    } catch {
      // Best-effort logout; UI already updated.
    }
  };

  const refresh = async (): Promise<string | null> => {
    try {
      const token = await executeTokenRefresh();
      if (token) {
        setPersistedSession(true, pathname);
        return token;
      }
      return null;
    } catch {
      setUser(null);
      return null;
    }
  };

  const updateUser = (partialUser: Partial<User>) => {
    setUser((prev) => prev ? { ...prev, ...partialUser } : null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        isInitializing,
        login,
        logout,
        refresh,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};