"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import api from "@/lib/api";
import { Check, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import CommonDetails from "./CommonDetails";
import AcademicCourse from "./AcademicCourse";
import LoginCredentials from "./LoginCredentials";
import FeePayment from "./FeePayment";
import type { CourseOption, RegisterFormValues, StreamOption } from "./types";

// Streams are loaded from backend to ensure users always see current data.

const ADMISSION_FEE = 1500;

export default function RegisterWizard() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successState, setSuccessState] = useState<{
    status: "online_success" | "physical_pending" | null;
    regNumber: string;
  }>({ status: null, regNumber: "" });
  const [values, setValues] = useState<RegisterFormValues>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    address: "",
    email: "",
    password: "",
    indexNumber: "",
    parentName: "",
    parentRelation: "",
    parentEmail: "",
    parentPhone: "",
    selectedStreamId: "",
    selectedCourseIds: [],
    selectedTeacherIds: {},
    paymentMethod: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    cardName: "",
    receiptAccepted: false,
  });

  const [streams, setStreams] = useState<StreamOption[]>([]);
  const [streamsLoading, setStreamsLoading] = useState(false);
  const [subjects, setSubjects] = useState<CourseOption[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);

  // Fetch streams on mount
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setStreamsLoading(true);
      try {
        const response = await api.get("/streams");
        if (!mounted) return;
        const rows = Array.isArray(response.data?.data)
          ? response.data.data
          : Array.isArray(response.data)
            ? response.data
            : [];
        setStreams(
          rows.map((stream: any) => ({
            id: String(stream.id),
            name: String(stream.name),
            courses: [],
          })),
        );
      } catch (err) {
        try {
          const fallbackResponse = await api.get("/subjects/streams");
          if (!mounted) return;
          const fallbackRows = Array.isArray(fallbackResponse.data?.data)
            ? fallbackResponse.data.data
            : Array.isArray(fallbackResponse.data)
              ? fallbackResponse.data
              : [];
          setStreams(
            fallbackRows.map((stream: any) => ({
              id: String(stream.id),
              name: String(stream.name),
              courses: [],
            })),
          );
        } catch (fallbackError) {
          console.error(err, fallbackError);
          toast.error("Unable to load streams from server.");
        }
      } finally {
        setStreamsLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch subjects when stream changes
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!values.selectedStreamId) {
        setSubjects([]);
        return;
      }
      setSubjectsLoading(true);
      try {
        const { data } = await api.get("/subjects", {
          params: {
            active: true,
            streamId: values.selectedStreamId,
          },
        });
        if (!mounted) return;
        const rows = Array.isArray(data?.data?.data)
          ? data.data.data
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data)
              ? data
              : [];
        setSubjects(
          rows.map(
            (subject: any): CourseOption => ({
              id: String(subject.id),
              name: String(subject.name),
              monthlyFee: Number(subject.feePerMonth ?? 0),
              description: String(subject.description ?? ""),
              teachers: subject.teacher
                ? [
                    {
                      id: String(subject.teacher.id),
                      name:
                        `${subject.teacher.firstName ?? ""} ${subject.teacher.lastName ?? ""}`.trim() ||
                        "Assigned Teacher",
                      qualification: String(
                        subject.teacher.specialization ?? "",
                      ),
                    },
                  ]
                : [],
            }),
          ),
        );
      } catch (err) {
        try {
          const fallbackResponse = await api.get("/subjects/available", {
            params: {
              streamId: values.selectedStreamId,
            },
          });
          if (!mounted) return;
          const fallbackRows = Array.isArray(fallbackResponse.data?.data?.data)
            ? fallbackResponse.data.data.data
            : Array.isArray(fallbackResponse.data?.data)
              ? fallbackResponse.data.data
              : Array.isArray(fallbackResponse.data)
                ? fallbackResponse.data
                : [];
          setSubjects(
            fallbackRows.map(
              (subject: any): CourseOption => ({
                id: String(subject.id),
                name: String(subject.name),
                monthlyFee: Number(subject.feePerMonth ?? 0),
                description: String(subject.description ?? ""),
                teachers: Array.isArray(subject.teachers)
                  ? subject.teachers.map((teacher: any) => ({
                      id: String(teacher.id),
                      name:
                        `${teacher.firstName ?? ""} ${teacher.lastName ?? ""}`.trim() ||
                        String(teacher.name ?? "Assigned Teacher"),
                      qualification: String(
                        teacher.specialization ?? teacher.qualification ?? "",
                      ),
                    }))
                  : subject.teacher
                    ? [
                        {
                          id: String(subject.teacher.id),
                          name:
                            `${subject.teacher.firstName ?? ""} ${subject.teacher.lastName ?? ""}`.trim() ||
                            "Assigned Teacher",
                          qualification: String(
                            subject.teacher.specialization ?? "",
                          ),
                        },
                      ]
                    : [],
              }),
            ),
          );
        } catch (fallbackError) {
          console.error(err, fallbackError);
          toast.error("Unable to load subjects for the selected stream.");
          setSubjects([]);
        }
      } finally {
        setSubjectsLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [values.selectedStreamId]);

  const selectedStream = streams.find(
    (stream) => stream.id === values.selectedStreamId,
  );
  const selectedSubject = subjects.find(
    (course) => course.id === values.selectedCourseIds[0],
  );
  const selectedCourses = selectedSubject ? [selectedSubject] : [];
  const totalAmount =
    ADMISSION_FEE +
    selectedCourses.reduce((sum, course) => sum + course.monthlyFee, 0);

  const validateStep1 = () => {
    const required = [
      values.firstName,
      values.lastName,
      values.dateOfBirth,
      values.gender,
      values.phone,
      values.address,
      values.parentName,
      values.parentRelation,
      values.parentEmail,
      values.parentPhone,
    ];
    if (required.some((value) => !value)) {
      toast.error("Please fill in the common details.");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!values.selectedStreamId) {
      toast.error("Please select an academic stream.");
      return false;
    }
    if (values.selectedCourseIds.length === 0) {
      toast.error("Please select at least one course.");
      return false;
    }
    if (
      values.selectedCourseIds.some(
        (courseId) => !values.selectedTeacherIds[courseId],
      )
    ) {
      toast.error("Please select a teacher for each course.");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!values.email || !values.password) {
      toast.error("Please fill in your login credentials.");
      return false;
    }
    if (!values.email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    if (values.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!values.paymentMethod) {
      toast.error("Please select a payment method.");
      return;
    }
    if (
      values.paymentMethod === "online" &&
      (!values.cardName ||
        !values.cardNumber ||
        !values.cardExpiry ||
        !values.cardCvv)
    ) {
      toast.error("Please complete the card details.");
      return;
    }
    if (values.paymentMethod === "physical" && !values.receiptAccepted) {
      toast.error("Please confirm the in-person payment option.");
      return;
    }
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    const regNumber = `PE-${values.selectedStreamId.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setSuccessState({
      status:
        values.paymentMethod === "online"
          ? "online_success"
          : "physical_pending",
      regNumber,
    });
    toast.success("Registration submitted.");
  };

  if (successState.status) {
    return (
      <div
        className="relative grid min-h-screen place-items-center overflow-hidden bg-cover bg-center bg-no-repeat p-4 py-10"
        style={{ backgroundImage: "url('/signin_bg.png')" }}
      >
        <div className="relative w-full max-w-xl z-10">
          <div className="mb-6 flex justify-center">
            <Logo />
          </div>
          <div className="glass-premium rounded-3xl p-8 shadow-2xl text-center space-y-6 border border-white/40">
            <div className="relative flex items-center justify-center h-24 w-24 mx-auto">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                <Check className="h-9 w-9 stroke-[3px]" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tight text-primary">
                Registration Complete
              </h1>
              <p className="text-xs text-muted-foreground">
                Your registration number is {successState.regNumber}.
              </p>
            </div>
            <Button
              asChild
              variant="hero"
              className="w-full h-11 text-xs font-bold shadow-glow"
            >
              <Link href="/login">Sign In to Dashboard</Link>
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
      <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-xs" />
      <div className="relative w-full max-w-3xl z-10 animate-scaleUp">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <div className="glass-premium rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/40 text-foreground">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <GraduationCap className="h-5 w-5" />
              </span>
              <div>
                <h1 className="text-2xl font-bold font-sans">
                  Student Admission Portal
                </h1>
                <p className="text-xs text-muted-foreground">
                  Complete the registration in 4 steps.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] sm:text-xs font-semibold">
              {[
                "Common Details",
                "Academic & Course",
                "Login Credentials",
                "Fee Payment",
              ].map((label, index) => (
                <div
                  key={label}
                  className={`rounded-xl border px-2 py-3 ${step === index + 1 ? "bg-primary/10 border-primary text-primary" : "border-slate-200/60 dark:border-white/10 text-muted-foreground"}`}
                >
                  {index + 1}. {label}
                </div>
              ))}
            </div>
          </div>

          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            {step === 1 && (
              <CommonDetails
                values={values}
                setValues={setValues}
                onNext={() => validateStep1() && setStep(2)}
              />
            )}
            {step === 2 && (
              <AcademicCourse
                values={values}
                setValues={setValues}
                streams={streams}
                streamsLoading={streamsLoading}
                subjects={subjects}
                subjectsLoading={subjectsLoading}
                totalAmount={totalAmount}
                admissionFee={ADMISSION_FEE}
                onBack={() => setStep(1)}
                onNext={() => validateStep2() && setStep(3)}
              />
            )}
            {step === 3 && (
              <LoginCredentials
                values={values}
                setValues={setValues}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                onBack={() => setStep(2)}
                onNext={() => validateStep3() && setStep(4)}
              />
            )}
            {step === 4 && (
              <FeePayment
                values={values}
                setValues={setValues}
                selectedStream={selectedStream}
                selectedCourses={selectedCourses}
                totalAmount={totalAmount}
                isSubmitting={isSubmitting}
                admissionFee={ADMISSION_FEE}
                onBack={() => setStep(3)}
                onSubmit={handleSubmit}
              />
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
