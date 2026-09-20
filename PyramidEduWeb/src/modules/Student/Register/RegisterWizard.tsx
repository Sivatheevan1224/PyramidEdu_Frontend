"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Check, GraduationCap, Smartphone, Home, ArrowRight } from "lucide-react";
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
  const [showPopup, setShowPopup] = useState(true);
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
        className="relative grid min-h-screen place-items-center overflow-hidden bg-cover bg-center bg-no-repeat p-4 py-10"
        style={{ backgroundImage: "url('/signin_bg.png')" }}
      >
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-secondary/30 blur-3xl" />

        <div className="relative w-full max-w-lg">
          <div className="mb-6 flex justify-center">
            <Logo
              textClassName="dark:text-slate-900"
              eduClassName="logo-edu-dark"
            />
          </div>
          <div className="bg-background border rounded-2xl p-6 sm:p-8 shadow-elegant text-center space-y-6">
            <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                <Check className="h-9 w-9 stroke-[3px]" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-primary">
                Registration Complete!
              </h1>
              <p className="text-sm text-muted-foreground">
                Your registration number is{" "}
                <span className="font-mono font-bold text-foreground bg-muted px-2 py-0.5 rounded">
                  {regNumber}
                </span>
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Your account is now <span className="font-semibold text-amber-500">pending approval</span>. Please visit the tuition center to complete your physical payment so our manager can activate your account.
              </p>
            </div>

            {/* Mobile App Instruction Card */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5 text-left space-y-3">
              <div className="flex items-center gap-2.5 text-primary font-bold text-sm sm:text-base">
                <Smartphone className="h-5 w-5 shrink-0" />
                <span>Student Mobile App Access</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All student classes, schedules, attendance, assignments, and exam results are managed through the <strong>PyramidEdu Mobile App</strong>.
              </p>
              <div className="space-y-2 pt-1 border-t border-primary/10 text-xs text-muted-foreground">
                <div className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-[10px]">1</span>
                  <span><strong>Download & Install:</strong> Install the PyramidEdu mobile application on your smartphone.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-[10px]">2</span>
                  <span><strong>Log In:</strong> Sign in with your registered email and password on the mobile app.</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Button
                asChild
                variant="hero"
                className="h-11 w-full text-xs sm:text-sm font-bold shadow-glow flex items-center justify-center gap-2 cursor-pointer"
              >
                <Link href="/">
                  <Home className="h-4 w-4" />
                  Go to Home
                </Link>
              </Button>
              <p className="text-[11px] text-muted-foreground/80 text-center">
                * Note: Web sign-in is reserved for staff and teachers. Students must sign in through the <strong>PyramidEdu Mobile App</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Popup after Signup */}
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-md rounded-3xl bg-background border border-border p-6 sm:p-8 shadow-2xl space-y-5 text-center animate-in zoom-in-95 duration-200">
              <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary/20 to-indigo-500/20 text-primary border border-primary/20 shadow-inner">
                <Smartphone className="h-9 w-9 text-primary" />
              </div>

              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                  <Check className="h-3 w-3" /> Registration Successful
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-foreground pt-1">
                  Install PyramidEdu Mobile App
                </h2>
                <p className="text-xs text-muted-foreground">
                  Your Student ID: <span className="font-mono font-bold text-foreground bg-muted px-2 py-0.5 rounded">{regNumber}</span>
                </p>
              </div>

              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-left space-y-3">
                <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed">
                  Students access all class materials, attendance, exam scores, and tuition updates through the <strong>PyramidEdu Mobile App</strong>.
                </p>
                <div className="space-y-2 pt-1 border-t border-primary/10 text-xs text-muted-foreground">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-[10px]">1</span>
                    <span><strong>Install the Mobile App:</strong> Download and install the PyramidEdu app on your phone.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-[10px]">2</span>
                    <span><strong>Log In:</strong> Sign in with your registered email and password.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white font-bold text-[10px]">3</span>
                    <span><strong>Activation:</strong> Visit the tuition center to complete physical payment for activation.</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 pt-2">
                <Button
                  asChild
                  variant="hero"
                  className="h-11 w-full font-bold text-sm shadow-glow flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Link href="/">
                    <Home className="h-4 w-4" />
                    Go to Home
                  </Link>
                </Button>
                <Button
                  onClick={() => setShowPopup(false)}
                  variant="ghost"
                  className="h-9 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Close & View Details
                </Button>
              </div>
            </div>
          </div>
        )}
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
                onSubmitSuccess={(rn) => {
                  setRegNumber(rn);
                  setShowPopup(true);
                }}
                setIsSubmitting={setIsSubmitting}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
