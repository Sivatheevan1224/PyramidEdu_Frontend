"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Check, GraduationCap } from "lucide-react";
import { toast } from "sonner";

import CommonDetails from "./components/CommonDetails";
import AcademicCourse from "./components/AcademicCourse";
import LoginCredentials from "./components/LoginCredentials";
import OtpVerificationStep from "./components/OtpVerificationStep";
import { useAcademicData } from "./hooks";
import { validateStep1, validateStep2, validateStep3 } from "./validation";
import { initiateRegistration } from "./services";
import { REGISTER_STEPS } from "./constants";
import type { RegisterFormValues, CourseOption } from "./types";

const DEFAULT_VALUES: RegisterFormValues = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  alExamBatch: "",
  batchId: "",
  gender: "",
  phone: "",
  address: "",
  school: "",
  email: "",
  password: "",
  confirmPassword: "",
  nic: "",
  parentName: "",
  parentRelation: "",
  parentEmail: "",
  parentPhone: "",
  selectedStreamId: "",
  selectedCourseIds: [],
  selectedTeacherIds: {},
};

export default function RegisterWizard() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regNumber, setRegNumber] = useState<string | null>(null);
  const [values, setValues] = useState<RegisterFormValues>(DEFAULT_VALUES);

  // Data fetching via hook (which uses the service layer)
  const { batches, batchesLoading, streams, streamsLoading, subjects, subjectsLoading } = useAcademicData();

  const visibleStreams = useMemo(() => {
    if (!values.batchId) return streams;
    return streams.filter(s => !s.batchIds || s.batchIds.length === 0 || s.batchIds.includes(values.batchId));
  }, [values.batchId, streams]);

  const selectedStream = streams.find((s) => s.id === values.selectedStreamId);

  const visibleSubjects = useMemo(() => {
    if (!selectedStream) return [];
    // We now have streamIds mapped from backend M:N
    return subjects.filter((subject) =>
      (subject.streamIds ?? []).includes(selectedStream.id) || 
      (subject.streamNames ?? []).some(
        (streamName) => streamName.trim().toLowerCase() === selectedStream.name.trim().toLowerCase()
      )
    );
  }, [selectedStream, subjects]);

  const selectedCourses = values.selectedCourseIds
    .map((courseId) => visibleSubjects.find((c) => c.id === courseId))
    .filter((c): c is CourseOption => Boolean(c));

  const totalAmount =
    selectedCourses.reduce((sum, c) => sum + c.monthlyFee, 0);

  // Submit step 3 → call initiate API, move to OTP step
  const handleInitiateRegistration = async () => {
    if (!validateStep3(values)) return;
    setIsSubmitting(true);
    try {
      await initiateRegistration(values);
      setStep(4);
    } catch (error: any) {
      console.error("Validation error details:", error.response?.data);
      const errors = error.response?.data?.errors;
      const msg = errors && errors.length > 0 
        ? `${errors[0].field}: ${errors[0].message}`
        : error.response?.data?.message ?? "Failed to initiate registration.";
      
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success screen
  if (regNumber) {
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
          <div className="bg-background border rounded-2xl p-8 shadow-elegant text-center space-y-6">
            <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                <Check className="h-9 w-9 stroke-[3px]" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tight text-primary">
                Registration Complete!
              </h1>
              <p className="text-sm text-muted-foreground">
                Your registration number is{" "}
                <span className="font-bold text-foreground">{regNumber}</span>.
              </p>
              <p className="text-sm text-muted-foreground">
                Your account is now <span className="font-semibold text-amber-500">pending approval</span>. Please visit the tuition center to complete your physical payment. A manager will activate your account after confirmation.
              </p>
            </div>
            <Button
              asChild
              variant="hero"
              className="h-11 w-full text-xs font-bold shadow-glow"
            >
              <Link href="/login">Back to Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative grid min-h-screen place-items-center overflow-hidden bg-cover bg-center bg-no-repeat p-4 py-10"
      style={{ backgroundImage: "url('/signin_bg.png')" }}
    >
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-secondary/30 blur-3xl" />
      
      <div className="relative w-full max-w-3xl">
        <div className="mb-6 flex justify-center">
          <Logo
            textClassName="dark:text-slate-900"
            eduClassName="logo-edu-dark"
          />
        </div>
        <div className="bg-background border rounded-2xl p-8 shadow-elegant text-foreground">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <GraduationCap className="h-5 w-5" />
              </span>
              <div>
                <h1 className="text-2xl font-bold font-sans">
                  Student Admission Portal
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Complete your registration in 4 steps.
                </p>
              </div>
            </div>

            {/* Step indicators */}
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] sm:text-xs font-semibold">
              {REGISTER_STEPS.map((label, index) => (
                <div
                  key={label}
                  className={`rounded-xl px-2 py-3 transition-colors ${
                    step === index + 1
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : step > index + 1
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > index + 1 ? "✓" : `${index + 1}.`} {label}
                </div>
              ))}
            </div>
          </div>

          {/* Step content */}
          <div className="mt-6 space-y-6">
            {step === 1 && (
              <CommonDetails
                values={values}
                setValues={setValues}
                batches={batches}
                batchesLoading={batchesLoading}
                onNext={() => validateStep1(values) && setStep(2)}
              />
            )}
            {step === 2 && (
              <AcademicCourse
                values={values}
                setValues={setValues}
                streams={visibleStreams}
                streamsLoading={streamsLoading}
                subjects={visibleSubjects}
                subjectsLoading={subjectsLoading}
                totalAmount={totalAmount}
                onBack={() => setStep(1)}
                onNext={() => validateStep2(values) && setStep(3)}
              />
            )}
            {step === 3 && (
              <LoginCredentials
                values={values}
                setValues={setValues}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                onBack={() => setStep(2)}
                onNext={handleInitiateRegistration}
                isSubmitting={isSubmitting}
              />
            )}
            {step === 4 && (
              <OtpVerificationStep
                values={values}
                isSubmitting={isSubmitting}
                onBack={() => setStep(3)}
                onSubmitSuccess={(rn) => setRegNumber(rn)}
                setIsSubmitting={setIsSubmitting}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
