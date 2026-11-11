"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Loader2,
  AlertCircle,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Dispatch, SetStateAction } from "react";
import type { RegisterFormValues } from "../types";
import { getStep3Errors, isValidEmail } from "../validation";
import { checkAvailability } from "../services";

type Props = {
  values: RegisterFormValues;
  setValues: Dispatch<SetStateAction<RegisterFormValues>>;
  showPassword: boolean;
  setShowPassword: Dispatch<SetStateAction<boolean>>;
  onBack: () => void;
  onNext: () => void;
  isSubmitting?: boolean;
};

export default function LoginCredentials({
  values,
  setValues,
  showPassword,
  setShowPassword,
  onBack,
  onNext,
  isSubmitting,
}: Props) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [focused, setFocused] = useState<Record<string, boolean>>({});
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailTakenError, setEmailTakenError] = useState<string | null>(null);
  const emailCheckTimer = useRef<NodeJS.Timeout | null>(null);

  const errors = useMemo(() => getStep3Errors(values), [values]);

  const handleFocus = (field: string) => {
    setFocused((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: string) => {
    setFocused((prev) => ({ ...prev, [field]: false }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const isFieldInvalid = (field: string) =>
    !focused[field] && Boolean(touched[field]) && Boolean(errors[field]);

  // Debounced real-time email availability check
  useEffect(() => {
    if (emailCheckTimer.current) clearTimeout(emailCheckTimer.current);

    const trimmed = values.email?.trim() || "";
    if (!trimmed || !isValidEmail(trimmed)) {
      setEmailTakenError(null);
      setEmailChecking(false);
      return;
    }

    setEmailChecking(true);
    emailCheckTimer.current = setTimeout(async () => {
      try {
        const res = await checkAvailability({ email: trimmed });
        if (!res.emailAvailable) {
          setEmailTakenError("This email is already registered. Please sign in instead.");
        } else {
          setEmailTakenError(null);
        }
      } catch (e) {
        // Ignore network glitch
      } finally {
        setEmailChecking(false);
      }
    }, 450);

    return () => {
      if (emailCheckTimer.current) clearTimeout(emailCheckTimer.current);
    };
  }, [values.email]);

  const canProceed = useMemo(() => {
    return (
      Boolean(values.email.trim()) &&
      !errors.email &&
      !emailTakenError &&
      !emailChecking &&
      Boolean(values.password.trim()) &&
      !errors.password &&
      Boolean(values.confirmPassword.trim()) &&
      !errors.confirmPassword
    );
  }, [values, errors, emailTakenError, emailChecking]);

  const handleProceed = () => {
    setFocused({});
    setTouched({ email: true, password: true, confirmPassword: true });
    if (canProceed && !isSubmitting) {
      onNext();
    }
  };

  return (
    <div className="space-y-6 animate-fadeInUp">
      <div className="flex items-center gap-2 border-b border-slate-200/50 dark:border-white/10 pb-2">
        <Lock className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground">
          Login Credentials
        </h2>
      </div>

      <div className="grid gap-4">
        {/* Email Address */}
        <div className="space-y-1.5">
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="student@example.com"
              className={cn(
                "pl-9",
                !focused.email && (Boolean(touched.email && errors.email) || Boolean(emailTakenError)) && "border-red-500 focus-visible:ring-red-500",
                !errors.email && !emailTakenError && !emailChecking && values.email.trim().length > 5 && "border-emerald-500 focus-visible:ring-emerald-500"
              )}
              value={values.email}
              onFocus={() => handleFocus("email")}
              onBlur={() => handleBlur("email")}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, email: e.target.value }))
              }
              disabled={isSubmitting}
            />
            {emailChecking && (
              <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
            )}
          </div>

          {/* Real-time email validation feedback: show only after typing is finished (blurred or submitted) */}
          {!focused.email && touched.email && errors.email && (
            <p className="text-xs font-medium text-red-500 flex items-center gap-1 animate-in fade-in duration-150">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {errors.email}
            </p>
          )}
          {!focused.email && !errors.email && emailTakenError && (
            <p className="text-xs font-medium text-red-500 flex items-center gap-1 animate-in fade-in duration-150">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {emailTakenError}
            </p>
          )}
          {!errors.email && !emailChecking && !emailTakenError && values.email.trim().length > 5 && (
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in duration-150">
              <Check className="h-3.5 w-3.5 shrink-0" />
              Email is available
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="password">
            Password <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              className={cn(
                "pl-9 pr-9",
                isFieldInvalid("password") && "border-red-500 focus-visible:ring-red-500"
              )}
              value={values.password}
              onFocus={() => handleFocus("password")}
              onBlur={() => handleBlur("password")}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, password: e.target.value }))
              }
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword((c) => !c)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {isFieldInvalid("password") && (
            <p className="text-xs font-medium text-red-500 flex items-center gap-1 animate-in fade-in duration-150">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">
            Confirm Password <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              className={cn(
                "pl-9 pr-9",
                isFieldInvalid("confirmPassword") && "border-red-500 focus-visible:ring-red-500"
              )}
              value={values.confirmPassword}
              onFocus={() => handleFocus("confirmPassword")}
              onBlur={() => handleBlur("confirmPassword")}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword((c) => !c)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label="Toggle confirm password visibility"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {isFieldInvalid("confirmPassword") && (
            <p className="text-xs font-medium text-red-500 flex items-center gap-1 animate-in fade-in duration-150">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {errors.confirmPassword}
            </p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-200/70 bg-white/50 p-4 text-sm text-muted-foreground dark:border-white/10 dark:bg-slate-950/20">
        After submitting, a 6-digit verification code will be sent to your email address above.
      </div>

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="h-11 px-8 rounded-xl font-semibold gap-2 border-slate-200 dark:border-white/10 hover:bg-white/10 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button
          type="button"
          onClick={handleProceed}
          disabled={!canProceed || isSubmitting}
          className="h-11 px-8 rounded-xl font-semibold gap-2 bg-primary hover:bg-primary/95 text-white disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Sending OTP...
            </>
          ) : (
            <>
              Send OTP <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
