"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function LoginPageClient() {
  const { login, isLoading, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.forcePasswordChange) {
        router.push("/change-password");
        return;
      }
      const roleTargetMap: Record<string, string> = {
        ADMIN: "/admin",
        MANAGER: "/manager",
        TEACHER: "/teacher",
      };
      router.push(roleTargetMap[user.role] ?? "/");
    }
  }, [user, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email.trim(), password);
    } catch {
      // Errors are already toasted inside login()
    }
  };

  if (user) {
    return <LoadingScreen />;
  }

  return (
    <div
      className="relative grid min-h-screen place-items-center overflow-hidden bg-cover bg-center bg-no-repeat p-4"
      style={{ backgroundImage: "url('/signin_bg.png')" }}
    >
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-secondary/30 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo
            textClassName="dark:text-slate-900"
            eduClassName="logo-edu-dark"
          />
        </div>

        <div className="glass rounded-2xl p-8 shadow-elegant">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to your PyramidEdu workspace
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@institute.edu"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={show ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-9"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  aria-label="Toggle password visibility"
                  onClick={() => setShow(!show)}
                  suppressHydrationWarning
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {show ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            This portal is for{" "}
            <span className="font-semibold text-foreground">
              Admin · Manager · Teacher
            </span>{" "}
            accounts only.
            <br />
            Are you a student?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary hover:underline"
            >
              Student Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
