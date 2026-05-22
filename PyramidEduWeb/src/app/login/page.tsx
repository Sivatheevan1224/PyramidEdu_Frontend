"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { Mail, Lock, Shield, Users, GraduationCap, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const roles = [
  { id: "admin", label: "Admin", icon: Shield, to: "/admin" },
  { id: "manager", label: "Manager", icon: Users, to: "/manager" },
  { id: "teacher", label: "Teacher", icon: GraduationCap, to: "/teacher" },
] as const;

export default function LoginPage() {
  const [role, setRole] = useState<typeof roles[number]["id"]>("admin");
  const [show, setShow] = useState(false);
  const router = useRouter();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = roles.find((r) => r.id === role)?.to ?? "/admin";
    toast.success("Welcome back to PyramidEdu");
    router.push(target);
  };

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-gradient-hero p-4">
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-secondary/30 blur-3xl" />
      <div className="relative w-full max-w-md">
        <div className="mb-6 flex justify-center"><Logo /></div>
        <div className="glass rounded-2xl p-8 shadow-elegant">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to your PyramidEdu workspace</p>
          <form onSubmit={onSubmit} className="mt-6 space-y-5">
            <div className="space-y-2">
              <Label>Sign in as</Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {roles.map((r) => (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border bg-background/60 px-3 py-2.5 text-sm font-medium transition-base",
                      role === r.id
                        ? "border-primary bg-primary/10 text-primary shadow-elegant"
                        : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    )}
                  >
                    <r.icon className="h-4 w-4" /> {r.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@institute.edu" required className="pl-9" defaultValue="demo@pyramidedu.com" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" type={show ? "text" : "password"} placeholder="••••••••" required className="pl-9 pr-9" defaultValue="demo1234" />
                <button type="button" aria-label="Toggle password" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full">Login</Button>
          </form>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Are you a student? <Link href="/register" className="font-semibold text-primary hover:underline">Student sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
