"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { Mail } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Reset link sent to your inbox");
  };
  return (
    <div 
      className="relative grid min-h-screen place-items-center bg-cover bg-center bg-no-repeat p-4"
      style={{ backgroundImage: "url('/signin_bg.png')" }}
    >
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center"><Logo /></div>
        <div className="glass rounded-2xl p-8 shadow-elegant">
          <h1 className="text-2xl font-bold">Forgot password?</h1>
          <p className="mt-1 text-sm text-muted-foreground">Enter your email and we'll send you a reset link</p>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" required className="pl-9" placeholder="you@institute.edu" />
              </div>
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full">Send reset link</Button>
          </form>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            <Link href="/login" className="font-semibold text-primary hover:underline">Back to sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
