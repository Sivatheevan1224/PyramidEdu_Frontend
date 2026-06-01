"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  ShieldCheck,
  X,
} from "lucide-react";
import { toast } from "sonner";
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

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export default function LoginCredentials({
  values,
  setValues,
  showPassword,
  setShowPassword,
  onBack,
  onNext,
}: Props) {
  // OTP popup state
  const [otpOpen, setOtpOpen] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [otpTextColor, setOtpTextColor] = useState<string>("#0f172a");

  const canSendOtp = useMemo(() => {
    return (
      Boolean(values.email.trim()) &&
      Boolean(values.password.trim()) &&
      Boolean(values.confirmPassword.trim()) &&
      values.password === values.confirmPassword
    );
  }, [values.confirmPassword, values.email, values.password]);

  const openOtpPopup = () => {
    if (
      !values.email.trim() ||
      !values.password.trim() ||
      !values.confirmPassword.trim()
    ) {
      toast.error("Please fill in email, password, and confirm password.");
      return;
    }
    if (!values.email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (values.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (values.password !== values.confirmPassword) {
      toast.error("Password and confirm password must match.");
      return;
    }

    const nextOtp = generateOtp();
    setGeneratedOtp(nextOtp);
    setOtpInput("");
    setOtpVerified(false);
    setOtpOpen(true);
    toast.success(`OTP sent: ${nextOtp}`);
  };

  const verifyOtp = () => {
    if (otpInput.length !== 6) {
      toast.error("Please enter the 6-digit OTP.");
      return;
    }

    if (otpInput !== generatedOtp) {
      toast.error("Invalid OTP. Please try again.");
      return;
    }

    setOtpVerified(true);
    setOtpOpen(false);
    toast.success("OTP verified successfully.");
    onNext();
  };

  const resendOtp = () => {
    const nextOtp = generateOtp();
    setGeneratedOtp(nextOtp);
    setOtpInput("");
    toast.success(`OTP resent: ${nextOtp}`);
  };

  useEffect(() => {
    if (!otpOpen) return;
    otpRefs.current[0]?.focus();
  }, [otpOpen]);

  useEffect(() => {
    // Detect dark mode via root class if present and set OTP text color for contrast
    try {
      const isDark =
        typeof window !== "undefined" &&
        document.documentElement.classList.contains("dark");
      setOtpTextColor(isDark ? "#e6eef8" : "#0f172a");
    } catch (err) {
      setOtpTextColor("#0f172a");
    }
  }, []);

  const otpDigits = Array.from(
    { length: 6 },
    (_, index) => otpInput[index] ?? "",
  );

  const updateOtpDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const nextDigits = otpDigits.map((item, itemIndex) =>
      itemIndex === index ? digit : item,
    );
    setOtpInput(nextDigits.join("").slice(0, 6));

    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (event.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="space-y-6 animate-fadeInUp">
      <div className="flex items-center gap-2 border-b border-slate-200/50 dark:border-white/10 pb-2">
        <Lock className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground">
          Register Details
        </h2>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="student@example.com"
              className="pl-9"
              value={values.email}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">
            Password <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              className="pl-9 pr-9"
              value={values.password}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, password: e.target.value }))
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">
            Confirm Password <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              className="pl-9 pr-9"
              value={values.confirmPassword}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Toggle confirm password visibility"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {values.confirmPassword &&
            values.password !== values.confirmPassword && (
              <p className="text-xs font-medium text-red-500">
                Passwords do not match.
              </p>
            )}
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-200/70 bg-white/50 p-4 text-sm text-muted-foreground dark:border-white/10 dark:bg-slate-950/20">
        After you enter the details, you will verify a 6-digit OTP before moving
        to the next step.
      </div>

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-11 px-8 rounded-xl font-semibold gap-2 border-slate-200 dark:border-white/10 hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button
          type="button"
          onClick={openOtpPopup}
          disabled={!canSendOtp}
          className="h-11 px-8 rounded-xl font-semibold gap-2 bg-primary hover:bg-primary/95 text-white disabled:opacity-60"
        >
          Verify OTP <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      {otpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white p-6 shadow-2xl dark:bg-slate-950">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    OTP Verification
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Enter the 6-digit code sent to your email.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOtpOpen(false)}
                className="rounded-full p-2 text-muted-foreground hover:bg-slate-100 hover:text-foreground dark:hover:bg-white/10"
                aria-label="Close OTP popup"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="space-y-2">
                <Label>6-digit OTP</Label>
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Input
                      key={index}
                      ref={(element) => {
                        otpRefs.current[index] = element;
                      }}
                      inputMode="numeric"
                      type="text"
                      aria-label={`OTP digit ${index + 1}`}
                      maxLength={1}
                      value={otpDigits[index] ?? ""}
                      onChange={(event) =>
                        updateOtpDigit(index, event.target.value)
                      }
                      onKeyDown={(event) => handleOtpKeyDown(event, index)}
                      className="h-12 w-12 px-0 text-center text-lg font-bold caret-primary rounded-lg"
                      style={{
                        color: otpTextColor,
                        WebkitTextFillColor: otpTextColor,
                        opacity: 1,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-dashed border-slate-200/70 bg-slate-950/5 px-4 py-3 text-xs text-muted-foreground dark:border-white/10 dark:bg-white/5">
                Demo code:{" "}
                <span className="font-semibold text-foreground">
                  {generatedOtp || "------"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={resendOtp}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Resend OTP
                </button>
                <p className="text-xs text-muted-foreground">
                  {otpVerified ? "Verified" : "Awaiting verification"}
                </p>
              </div>

              <Button
                type="button"
                onClick={verifyOtp}
                className="h-11 w-full rounded-xl font-semibold bg-primary hover:bg-primary/95 text-white"
              >
                Confirm OTP
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
