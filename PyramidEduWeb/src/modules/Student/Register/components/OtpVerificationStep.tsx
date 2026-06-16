import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ArrowRight, ShieldCheck, RefreshCw } from "lucide-react";
import type { RegisterFormValues } from "../types";
import { verifyOtpAndRegister, resendOtp } from "../services";
import { toast } from "sonner";

type Props = {
  values: RegisterFormValues;
  isSubmitting: boolean;
  onBack: () => void;
  onSubmitSuccess: (regNumber: string) => void;
  setIsSubmitting: (value: boolean) => void;
};

export default function OtpVerificationStep({
  values,
  isSubmitting,
  onBack,
  onSubmitSuccess,
  setIsSubmitting,
}: Props) {
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const otpCode = otpValues.join("");

  const handleChange = (value: string, index: number) => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) {
      const newValues = [...otpValues];
      newValues[index] = "";
      setOtpValues(newValues);
      return;
    }

    const digit = cleaned[cleaned.length - 1];
    const newValues = [...otpValues];
    newValues[index] = digit;
    setOtpValues(newValues);

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otpValues[index] && index > 0) {
        const newValues = [...otpValues];
        newValues[index - 1] = "";
        setOtpValues(newValues);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newValues = [...otpValues];
        newValues[index] = "";
        setOtpValues(newValues);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.replace(/\D/g, "").slice(0, 6);
    
    if (digits) {
      const newValues = Array(6).fill("");
      for (let i = 0; i < digits.length; i++) {
        newValues[i] = digits[i];
      }
      setOtpValues(newValues);
      
      const focusIndex = Math.min(digits.length - 1, 5);
      if (focusIndex >= 0) {
        inputRefs.current[focusIndex]?.focus();
      }
    }
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const handleResend = async () => {
    setIsResending(true);
    try {
      await resendOtp(values.email);
      toast.success("A new verification code has been sent to your email.");
      setTimeLeft(60);
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to resend OTP. Please try again.";
      toast.error(msg);
    } finally {
      setIsResending(false);
    }
  };

  const handleVerify = async () => {
    if (otpCode.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP code.");
      return;
    }

    setIsSubmitting(true);
    try {
      const regNumber = await verifyOtpAndRegister({ email: values.email, otpCode });
      toast.success("Registration completed successfully!");
      onSubmitSuccess(regNumber);
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to verify OTP. Please try again.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeInUp">
      <div className="flex items-center gap-2 border-b border-slate-200/50 pb-2 dark:border-white/10">
        <ShieldCheck className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground">
          OTP Verification
        </h2>
      </div>

      <div className="rounded-2xl border border-slate-200/60 bg-white/60 p-6 text-center dark:border-white/10 dark:bg-slate-950/20">
        <h3 className="mb-2 text-lg font-bold text-foreground">
          Enter Verification Code
        </h3>
        <p className="mb-6 text-sm text-muted-foreground">
          We have sent a verification code to <span className="font-semibold text-primary">{values.email}</span>. 
          Please enter the 6-digit code below to complete your registration.
        </p>

        <div className="mx-auto flex justify-center items-center gap-2">
          <div className="flex gap-2">
            {[0, 1, 2].map((index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={otpValues[index]}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                disabled={isSubmitting}
                className="h-14 w-12 rounded-xl border border-slate-200 bg-white text-center text-xl font-bold text-slate-900 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-slate-900 dark:text-white dark:focus:border-primary"
              />
            ))}
          </div>
          <span className="text-slate-400 dark:text-slate-600 font-bold">-</span>
          <div className="flex gap-2">
            {[3, 4, 5].map((index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={otpValues[index]}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                disabled={isSubmitting}
                className="h-14 w-12 rounded-xl border border-slate-200 bg-white text-center text-xl font-bold text-slate-900 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-slate-900 dark:text-white dark:focus:border-primary"
              />
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-2">
          <p className="text-xs text-muted-foreground">
            Didn't receive the code?
          </p>
          <Button
            type="button"
            variant="ghost"
            onClick={handleResend}
            disabled={timeLeft > 0 || isResending || isSubmitting}
            className="text-primary hover:text-primary/80 hover:bg-primary/10 gap-2 font-medium"
          >
            {isResending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Resend Code {timeLeft > 0 && `in ${timeLeft}s`}
          </Button>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="h-11 gap-2 rounded-xl border-slate-200 px-8 font-semibold hover:bg-white/10 dark:border-white/10"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button
          type="button"
          onClick={handleVerify}
          disabled={isSubmitting || otpCode.length !== 6}
          className="h-11 gap-2 rounded-xl bg-primary px-8 font-semibold text-white hover:bg-primary/95"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Verifying...
            </>
          ) : (
            <>
              Verify & Complete <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
