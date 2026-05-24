"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole, WEB_LOGIN_ALLOWED_ROLES } from '@/context/AuthContext';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingScreen } from '@/components/LoadingScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Roles allowed to access this route. Omit to allow all web-login roles. */
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // --- Loading screen ---
  if (isLoading) {
    return <LoadingScreen />;
  }

  // --- Not authenticated ---
  if (!user) return null;

  // --- Role check ---
  const effectiveAllowed = allowedRoles ?? WEB_LOGIN_ALLOWED_ROLES;
  if (!effectiveAllowed.includes(user.role)) {
    const dashboardMap: Record<string, string> = {
      ADMIN:   '/admin',
      MANAGER: '/manager',
      TEACHER: '/teacher',
    };
    const home = dashboardMap[user.role] ?? '/login';

    return (
      <div className="relative grid min-h-screen place-items-center overflow-hidden bg-gradient-hero p-4">
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-destructive/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative w-full max-w-md glass rounded-2xl p-8 shadow-elegant text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Access Denied</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your role{' '}
            <span className="font-semibold text-primary">{user.role}</span>{' '}
            does not have permission to view this page.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Button onClick={() => router.push(home)} className="w-full">
              Go to My Dashboard
            </Button>
            <Button variant="outline" onClick={() => logout()} className="w-full">
              Sign in with Another Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
