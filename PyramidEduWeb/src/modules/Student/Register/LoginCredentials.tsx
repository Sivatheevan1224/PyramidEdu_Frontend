"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail, ArrowLeft, ArrowRight } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { RegisterFormValues } from "./types";

type Props = {
  values: RegisterFormValues;
  setValues: Dispatch<SetStateAction<RegisterFormValues>>;
  showPassword: boolean;
  setShowPassword: Dispatch<SetStateAction<boolean>>;
  onBack: () => void;
  onNext: () => void;
};

export default function LoginCredentials({ values, setValues, showPassword, setShowPassword, onBack, onNext }: Props) {
  return (
    <div className="space-y-6 animate-fadeInUp">
      <div className="flex items-center gap-2 border-b border-slate-200/50 dark:border-white/10 pb-2">
        <Lock className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground">Login Credentials</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Portal Email <span className="text-red-500">*</span></Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="email" type="email" className="pl-9" value={values.email} onChange={(e) => setValues((prev) => ({ ...prev, email: e.target.value }))} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="password" type={showPassword ? "text" : "password"} className="pl-9 pr-9" value={values.password} onChange={(e) => setValues((prev) => ({ ...prev, password: e.target.value }))} />
            <button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Toggle password visibility">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack} className="h-11 px-8 rounded-xl font-semibold gap-2 border-slate-200 dark:border-white/10 hover:bg-white/10">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button type="button" onClick={onNext} className="h-11 px-8 rounded-xl font-semibold gap-2 bg-primary hover:bg-primary/95 text-white">
          Next: Fee Payment <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
