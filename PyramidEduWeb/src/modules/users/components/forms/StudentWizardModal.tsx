"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Check, GraduationCap, X } from "lucide-react";
import { toast } from "sonner";

import CommonDetails from "@/modules/Student/Register/components/CommonDetails";
import AcademicCourse from "@/modules/Student/Register/components/AcademicCourse";
import LoginCredentials from "@/modules/Student/Register/components/LoginCredentials";
import OtpVerificationStep from "@/modules/Student/Register/components/OtpVerificationStep";
import { useAcademicData } from "@/modules/Student/Register/hooks";
import { validateStep1, validateStep2, validateStep3 } from "@/modules/Student/Register/validation";
import { initiateRegistration } from "@/modules/Student/Register/services";
import { REGISTER_STEPS } from "@/modules/Student/Register/constants";
import type { RegisterFormValues, CourseOption } from "@/modules/Student/Register/types";
import { api } from "@/lib/api";

const DEFAULT_VALUES: any = {
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
  paymentStatus: "PENDING",
};

interface StudentWizardModalProps {
  onClose: () => void;
  onSuccess: () => void;
  isAdminCreation?: boolean;
}

export default function StudentWizardModal({ onClose, onSuccess, isAdminCreation = false }: StudentWizardModalProps) {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regNumber, setRegNumber] = useState<string | null>(null);
  const [values, setValues] = useState<any>(DEFAULT_VALUES);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  const { batches, batchesLoading, streams, streamsLoading, subjects, subjectsLoading } = useAcademicData();

  const visibleStreams = useMemo(() => {
    if (!values.batchId) return streams;
    return streams.filter(s => !s.batchIds || s.batchIds.length === 0 || s.batchIds.includes(values.batchId));
  }, [values.batchId, streams]);

  const selectedStream = streams.find((s) => s.id === values.selectedStreamId);

  const visibleSubjects = useMemo(() => {
    if (!selectedStream) return [];
    return subjects.filter((subject) =>
      (subject.streamIds ?? []).includes(selectedStream.id) || 
      (subject.streamNames ?? []).some(
        (streamName) => streamName.trim().toLowerCase() === selectedStream.name.trim().toLowerCase()
      )
    );
  }, [selectedStream, subjects]);

  const selectedCourses = (values.selectedCourseIds || [])
    .map((courseId: string) => visibleSubjects.find((c: CourseOption) => c.id === courseId))
    .filter((c: CourseOption | undefined): c is CourseOption => Boolean(c));

  const totalAmount = selectedCourses.reduce((sum: number, c: CourseOption) => sum + c.monthlyFee, 0);

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

  const handleAdminStudentCreation = async () => {
    if (!values.email || !values.email.includes("@")) {
      toast.error("Please enter a valid student email address.");
      return;
    }
    setShowConfirmPopup(true);
  };

  const executeStudentCreation = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        role: "STUDENT",
        ...values,
      };
      
      const response = await api.post("/users", payload);
      
      const indexNum = response.data?.data?.student?.indexNumber || "Successfully Created";
      setRegNumber(indexNum);
      setShowConfirmPopup(false);
    } catch (error: any) {
      console.error("Manual creation error details:", error.response?.data);
      const errors = error.response?.data?.errors;
      const msg = errors && errors.length > 0 
        ? `${errors[0].field}: ${errors[0].message}`
        : error.response?.data?.message ?? "Failed to create student account.";
      
      toast.error(msg);
      setShowConfirmPopup(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    onSuccess();
    onClose();
  };

  if (regNumber) {
    return (
      <div className="p-8 text-center space-y-6">
        <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
            <Check className="h-9 w-9 stroke-[3px]" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black tracking-tight text-primary">
            Registration Complete!
          </h1>
          <p className="text-sm text-muted-foreground">
            Student's registration number is{" "}
            <span className="font-bold text-foreground">{regNumber}</span>.
          </p>
          <p className="text-sm text-muted-foreground">
            Account is now <span className="font-semibold text-emerald-500">active & approved</span>. A temporary login password has been generated and sent to their registered email.
          </p>
        </div>
        <Button
          onClick={handleSuccessClose}
          className="h-11 w-full text-xs font-bold bg-primary hover:bg-primary/90 text-white rounded-xl"
        >
          Close & Refresh List
        </Button>
      </div>
    );
  }

  const stepsList = isAdminCreation ? REGISTER_STEPS.slice(0, 3) : REGISTER_STEPS;

  return (
    <div className="flex flex-col text-foreground register-form-theme max-h-[85vh] overflow-y-auto">
      {/* Header */}
      <div className="space-y-4 pb-4 border-b border-slate-200/50 dark:border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <GraduationCap className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold font-sans">
                Add Student Form
              </h1>
              <p className="text-xs text-muted-foreground">
                Complete student registration details.
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={isSubmitting}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Step indicators */}
        <div className={`grid ${isAdminCreation ? 'grid-cols-3' : 'grid-cols-4'} gap-2 text-center text-[10px] sm:text-xs font-semibold`}>
          {stepsList.map((label, index) => (
            <div
              key={label}
              className={`rounded-xl border px-2 py-3 ${
                step === index + 1
                  ? "bg-primary/10 border-primary text-primary"
                  : step > index + 1
                    ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                    : "border-slate-200/60 dark:border-white/10 text-muted-foreground"
              }`}
            >
              {step > index + 1 ? "✓" : `${index + 1}.`} {label}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="mt-6 flex-1">
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
          isAdminCreation ? (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground">Login Credentials</h3>
                <p className="text-xs text-muted-foreground bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-white/5">
                  The student will use their email address to log in. A strong temporary password will be automatically generated and sent to them via email.
                </p>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground block">Student Email Address <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    value={values.email}
                    onChange={(e) => setValues({ ...values, email: e.target.value })}
                    placeholder="student@example.com"
                    className="w-full h-11 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-sm bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground block">Initial Payment Status <span className="text-red-500">*</span></label>
                  <select
                    value={values.paymentStatus || "PENDING"}
                    onChange={(e) => setValues({ ...values, paymentStatus: e.target.value })}
                    className="w-full h-11 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-sm bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="PENDING">Pending (Unpaid)</option>
                    <option value="PAID">Paid (Received)</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-between gap-3 pt-4 border-t border-slate-200/50 dark:border-white/10">
                <Button variant="outline" onClick={() => setStep(2)} disabled={isSubmitting}>
                  Back
                </Button>
                <Button onClick={handleAdminStudentCreation} disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                  {isSubmitting ? "Creating..." : "Create Student"}
                </Button>
              </div>
            </div>
          ) : (
            <LoginCredentials
              values={values}
              setValues={setValues}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              onBack={() => setStep(2)}
              onNext={handleInitiateRegistration}
              isSubmitting={isSubmitting}
            />
          )
        )}
        {step === 4 && !isAdminCreation && (
          <OtpVerificationStep
            values={values}
            isSubmitting={isSubmitting}
            onBack={() => setStep(3)}
            onSubmitSuccess={(rn) => setRegNumber(rn)}
            setIsSubmitting={setIsSubmitting}
          />
        )}
      </div>

      {showConfirmPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl w-full max-w-sm text-center space-y-4">
            <h3 className="text-lg font-bold text-foreground">Confirm Account Creation</h3>
            <p className="text-xs text-muted-foreground">
              A temporary password will be generated and sent to the student's registered email. Do you want to continue?
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowConfirmPopup(false)}
                disabled={isSubmitting}
                className="w-full h-11 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={executeStudentCreation}
                disabled={isSubmitting}
                className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl"
              >
                {isSubmitting ? "Creating..." : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
