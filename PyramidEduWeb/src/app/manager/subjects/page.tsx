"use client";

import React, { useEffect } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BookOpen,
  BrainCircuit,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  GraduationCap,
  Layers3,
  QrCode,
  Save,
  Sparkles,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const STREAMS = {
  bio: {
    label: "Bio",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    subjects: [
      {
        key: "biology",
        name: "Biology",
        fee: 2400,
        teachers: ["Dr. Shanika Perera", "Prof. Nadeesha Jayasinghe", "Mrs. Amara Fernando"],
      },
      {
        key: "chemistry",
        name: "Chemistry",
        fee: 2300,
        teachers: ["Dr. Lakshan Silva", "Mrs. Tharushi de Silva", "Mr. Niroshan Perera"],
      },
      {
        key: "physics",
        name: "Physics",
        fee: 2300,
        teachers: ["Prof. Dinesh Rajapaksa", "Dr. Ashan Wickramasinghe", "Mr. Chamara Jayasuriya"],
      },
    ],
  },
  maths: {
    label: "Maths",
    gradient: "from-sky-500 via-blue-500 to-indigo-500",
    subjects: [
      {
        key: "combined-maths",
        name: "Combined Maths",
        fee: 2600,
        teachers: ["Prof. Amal Perera", "Dr. Sunil Silva", "Mr. Kavindu Wijesinghe"],
      },
      {
        key: "chemistry",
        name: "Chemistry",
        fee: 2300,
        teachers: ["Dr. Lakshan Silva", "Mrs. Tharushi de Silva", "Mr. Niroshan Perera"],
      },
      {
        key: "physics",
        name: "Physics",
        fee: 2300,
        teachers: ["Prof. Dinesh Rajapaksa", "Dr. Ashan Wickramasinghe", "Mr. Chamara Jayasuriya"],
      },
    ],
  },
  commerce: {
    label: "Commerce",
    gradient: "from-amber-500 via-orange-500 to-rose-500",
    subjects: [
      {
        key: "accounting",
        name: "Accounting",
        fee: 2200,
        teachers: ["Mr. Rohan Fernando", "Mrs. Deepani Perera", "Dr. Sachini Kariyawasam"],
      },
      {
        key: "economics",
        name: "Economics",
        fee: 2100,
        teachers: ["Dr. Sajith Ranasinghe", "Mr. Lahiru Wijewardena", "Ms. Anushi Fernando"],
      },
      {
        key: "business-studies",
        name: "Business Studies",
        fee: 2100,
        teachers: ["Prof. M. Samarakoon", "Dr. T. Wickramasinghe", "Mrs. Menuki Jayasekara"],
      },
    ],
  },
  arts: {
    label: "Arts",
    gradient: "from-fuchsia-500 via-pink-500 to-violet-500",
    subjects: [
      {
        key: "history",
        name: "History",
        fee: 1800,
        teachers: ["Mr. Suresh Kumar", "Mrs. Nayanathara Perera", "Dr. Heshan Fernando"],
      },
      {
        key: "geography",
        name: "Geography",
        fee: 1800,
        teachers: ["Mrs. Kalani Silva", "Mr. Dilshan Rodrigo", "Ms. Piumi Jayasuriya"],
      },
      {
        key: "tamil",
        name: "Tamil",
        fee: 1700,
        teachers: ["Mr. Arul Raj", "Mrs. Kavitha Karthik", "Ms. Priya Shanmugan"],
      },
    ],
  },
  technology: {
    label: "Technology",
    gradient: "from-cyan-500 via-blue-500 to-slate-700",
    subjects: [
      {
        key: "engineering-technology",
        name: "Engineering Technology",
        fee: 2500,
        teachers: ["Eng. Pavan Dissanayake", "Dr. Nuwan Jayasinghe", "Mr. Kasun Perera"],
      },
      {
        key: "science-for-technology",
        name: "Science for Technology",
        fee: 2300,
        teachers: ["Dr. H. M. Ranasinghe", "Mr. P. Gamage", "Ms. Shanika Ariyaratne"],
      },
      {
        key: "ict",
        name: "ICT",
        fee: 2400,
        teachers: ["Mr. Janaka Senanayake", "Miss K. Perera", "Eng. Tharindu Pathirana"],
      },
    ],
  },
} as const;

const STREAM_OPTIONS = [
  { value: "bio", label: "Bio" },
  { value: "maths", label: "Maths" },
  { value: "commerce", label: "Commerce" },
  { value: "arts", label: "Arts" },
  { value: "technology", label: "Technology" },
] as const;

const GRADES = ["Grade 12", "Grade 13"] as const;
const MEDIUMS = ["English", "Tamil", "Sinhala"] as const;
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

type StreamKey = keyof typeof STREAMS;
type SubjectItem = (typeof STREAMS)[StreamKey]["subjects"][number];
type SubjectKey = SubjectItem["key"];

const subjectSettingsSchema = z.object({
  teacher: z.string().min(1, "Teacher is required"),
  monthlyFee: z.coerce.number().min(1, "Monthly fee is required").max(100000, "Enter a valid fee"),
  day: z.enum(DAYS, { message: "Select a valid day" }),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  qrAttendance: z.boolean(),
  aiPrediction: z.boolean(),
});

const subjectFormSchema = z
  .object({
    stream: z.enum(["bio", "maths", "commerce", "arts", "technology"], { message: "Stream is required" }),
    grade: z.enum(["Grade 12", "Grade 13"], { message: "Grade is required" }),
    medium: z.enum(["English", "Tamil", "Sinhala"], { message: "Medium is required" }),
    selectedSubjects: z.array(z.string()).min(1, "Select at least one subject"),
    subjectSettings: z.record(z.string(), subjectSettingsSchema),
  })
  .superRefine((values, context) => {
    values.selectedSubjects.forEach((subjectKey) => {
      const subject = values.subjectSettings[subjectKey];

      if (!subject) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Subject settings are required",
          path: ["subjectSettings", subjectKey],
        });
        return;
      }

      if (subject.endTime <= subject.startTime) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End time must be after start time",
          path: ["subjectSettings", subjectKey, "endTime"],
        });
      }
    });
  });

type SubjectFormValues = {
  stream: StreamKey | "";
  grade: (typeof GRADES)[number] | "";
  medium: (typeof MEDIUMS)[number] | "";
  selectedSubjects: string[];
  subjectSettings: Record<
    string,
    {
      teacher: string;
      monthlyFee: number;
      day: (typeof DAYS)[number];
      startTime: string;
      endTime: string;
      qrAttendance: boolean;
      aiPrediction: boolean;
    }
  >;
};

const DEFAULT_STREAM_STATE: SubjectFormValues = {
  stream: "",
  grade: "",
  medium: "",
  selectedSubjects: [],
  subjectSettings: {},
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-LK", { maximumFractionDigits: 0 }).format(value);
}

function getDefaultSettings(subject: SubjectItem): SubjectFormValues["subjectSettings"][string] {
  return {
    teacher: "",
    monthlyFee: subject.fee,
    day: "Monday",
    startTime: "16:00",
    endTime: "18:00",
    qrAttendance: true,
    aiPrediction: false,
  };
}

export default function ManagerSubjectAddPage() {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectFormSchema) as unknown as Resolver<SubjectFormValues>,
    defaultValues: DEFAULT_STREAM_STATE,
    mode: "onTouched",
  });

  const stream = useWatch({ control, name: "stream" });
  const selectedSubjects = useWatch({ control, name: "selectedSubjects" }) ?? [];
  const subjectSettings = useWatch({ control, name: "subjectSettings" }) ?? {};
  const grade = useWatch({ control, name: "grade" });
  const medium = useWatch({ control, name: "medium" });

  const currentStream = stream ? STREAMS[stream as StreamKey] : null;
  const activeSubjects = currentStream?.subjects.filter((subject) => selectedSubjects.includes(subject.key)) ?? [];

  useEffect(() => {
    setValue("selectedSubjects", []);
    setValue("subjectSettings", {});
  }, [stream, setValue]);

  // Fetch list of teachers from backend to populate teacher selects
  const [teachers, setTeachers] = React.useState<{ id: number; name: string }[]>([]);
  const apiV1Prefix = (api.defaults.baseURL || '').endsWith('/v1') ? '' : '/v1';
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await api.get(`${apiV1Prefix}/users?role=teachers`);
        const users = res.data?.data?.users ?? [];
        if (!mounted) return;
        setTeachers(users.map((u: any) => ({ id: u.id, name: `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || u.email })));
      } catch (err) {
        // Non-fatal; keep local teacher names as fallback
        console.debug("Failed to load teachers:", err);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Load existing subjects and refresh after save
  const [existingSubjects, setExistingSubjects] = React.useState<any[]>([]);
  // Refs for the toggle buttons so we can set aria attributes at runtime
  const buttonRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});
  const loadSubjects = async () => {
    try {
      const res = await api.get(`${apiV1Prefix}/subjects`);
      const items = res.data?.data?.data ?? [];
      setExistingSubjects(items);
    } catch (err) {
      console.debug('Failed to load subjects', err);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  // Keep aria-pressed attributes in sync at runtime to satisfy static accessibility checks
  React.useEffect(() => {
    try {
      Object.keys(buttonRefs.current).forEach((key) => {
        const el = buttonRefs.current[key];
        if (!el) return;

        if (key.endsWith('-qr')) {
          const subjKey = key.slice(0, -3);
          const val = !!subjectSettings?.[subjKey]?.qrAttendance;
          el.setAttribute('aria-pressed', val ? 'true' : 'false');
        } else if (key.endsWith('-ai')) {
          const subjKey = key.slice(0, -3);
          const val = !!subjectSettings?.[subjKey]?.aiPrediction;
          el.setAttribute('aria-pressed', val ? 'true' : 'false');
        }
      });
    } catch (err) {
      /* non-fatal */
    }
  }, [subjectSettings, activeSubjects]);

  const totalMonthlyFee = activeSubjects.reduce((sum, subject) => {
    const value = subjectSettings?.[subject.key]?.monthlyFee ?? subject.fee;
    return sum + Number(value || 0);
  }, 0);

  const totalTeachersAssigned = activeSubjects.filter((subject) => subjectSettings?.[subject.key]?.teacher).length;

  const onToggleSubject = (subject: SubjectItem) => {
    const currentSelected = getValues("selectedSubjects");
    const isSelected = currentSelected.includes(subject.key);

    if (isSelected) {
      setValue(
        "selectedSubjects",
        currentSelected.filter((key) => key !== subject.key),
        { shouldDirty: true, shouldValidate: true },
      );

      const nextSettings = { ...getValues("subjectSettings") };
      delete nextSettings[subject.key];
      setValue("subjectSettings", nextSettings, { shouldDirty: true, shouldValidate: true });
      return;
    }

    setValue("selectedSubjects", [...currentSelected, subject.key], { shouldDirty: true, shouldValidate: true });
    setValue(
      "subjectSettings",
      {
        ...getValues("subjectSettings"),
        [subject.key]: getDefaultSettings(subject),
      },
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const onSubmit = async (values: SubjectFormValues) => {
    try {
      const payloads = values.selectedSubjects.map((key) => {
        const subjectData = currentStream?.subjects.find((s) => s.key === key)!;
        const settings = values.subjectSettings[key]!;
        return {
          name: subjectData.name,
          code: key.replace(/[^A-Z0-9]/gi, "_").toUpperCase(),
          feePerMonth: Number(settings.monthlyFee),
          teacherId: typeof settings.teacher === "string" && /^[0-9]+$/.test(String(settings.teacher)) ? Number(settings.teacher) : undefined,
          description: `${values.stream} • ${values.grade} • ${values.medium}`,
        };
      });

      for (const p of payloads) {
        await api.post(`${apiV1Prefix}/subjects`, p);
      }

      // Refresh subjects list
      await loadSubjects();

      toast.success(`Stream saved with ${values.selectedSubjects.length} subject${values.selectedSubjects.length === 1 ? "" : "s"}.`);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message ?? "Failed to save subjects");
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-[0_24px_80px_-24px_rgba(15,23,42,0.6)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.22),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.18),transparent_28%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-100 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Subject Management
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">Add Subject Streams</h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Build tuition-ready subject streams with teacher allocation, subject timing, attendance automation, and AI prediction controls in one workflow.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:w-[420px]">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
                <Layers3 className="h-4 w-4 text-cyan-300" /> Stream
              </div>
              <div className="mt-2 text-2xl font-black">5</div>
              <div className="text-xs text-slate-400">Academic stream options</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
                <BookOpen className="h-4 w-4 text-emerald-300" /> Subjects
              </div>
              <div className="mt-2 text-2xl font-black">15</div>
              <div className="text-xs text-slate-400">Stream-linked subjects</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-amber-300" /> Ready
              </div>
              <div className="mt-2 text-2xl font-black">Form</div>
              <div className="text-xs text-slate-400">Validated and responsive</div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.92fr)]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card className="border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/50 dark:border-slate-800/80 dark:bg-slate-950">
            <div className="mb-5 flex items-center justify-between gap-4 border-b border-slate-200/70 pb-4 dark:border-slate-800/80">
              <div>
                <h2 className="text-lg font-bold text-slate-950 dark:text-white">Academic Setup</h2>
                <p className="text-sm text-slate-500">Choose the stream, grade, and medium before assigning subjects.</p>
              </div>
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                Manager Control Panel
              </Badge>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div className="space-y-2 md:col-span-1">
                <Label className="text-sm font-semibold">Stream</Label>
                <Select value={stream} onValueChange={(value) => setValue("stream", value as StreamKey, { shouldDirty: true, shouldValidate: true })}>
                  <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900">
                    <SelectValue placeholder="Select stream" />
                  </SelectTrigger>
                  <SelectContent>
                    {STREAM_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.stream && <p className="text-xs text-rose-500">{errors.stream.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Grade</Label>
                <Select value={grade} onValueChange={(value) => setValue("grade", value as (typeof GRADES)[number], { shouldDirty: true, shouldValidate: true })}>
                  <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADES.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.grade && <p className="text-xs text-rose-500">{errors.grade.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Medium</Label>
                <Select value={medium} onValueChange={(value) => setValue("medium", value as (typeof MEDIUMS)[number], { shouldDirty: true, shouldValidate: true })}>
                  <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900">
                    <SelectValue placeholder="Select medium" />
                  </SelectTrigger>
                  <SelectContent>
                    {MEDIUMS.map((medium) => (
                      <SelectItem key={medium} value={medium}>
                        {medium}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.medium && <p className="text-xs text-rose-500">{errors.medium.message}</p>}
              </div>
            </div>
          </Card>

          <Card className="border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/50 dark:border-slate-800/80 dark:bg-slate-950">
            <div className="mb-5 flex flex-col gap-2 border-b border-slate-200/70 pb-4 dark:border-slate-800/80 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-950 dark:text-white">Stream Subjects</h2>
                <p className="text-sm text-slate-500">Select the subjects that belong to the chosen stream.</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Users className="h-4 w-4" />
                {currentStream ? `${currentStream.label} stream loaded` : "Select a stream to continue"}
              </div>
            </div>

            {!currentStream ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-10 text-center dark:border-slate-800 dark:bg-slate-900/60">
                <GraduationCap className="mx-auto h-10 w-10 text-slate-400" />
                <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-white">Choose a stream to reveal subjects</h3>
                <p className="mt-1 text-sm text-slate-500">The subject card grid will appear instantly after you select Bio, Maths, Commerce, Arts, or Technology.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {currentStream.subjects.map((subject) => {
                  const selected = selectedSubjects.includes(subject.key);

                  return (
                    <button
                      key={subject.key}
                      type="button"
                      onClick={() => onToggleSubject(subject)}
                      className={cn(
                        "group rounded-2xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5",
                        selected
                          ? "border-cyan-400 bg-cyan-50/80 shadow-[0_16px_40px_-24px_rgba(6,182,212,0.85)] dark:border-cyan-500/60 dark:bg-cyan-500/10"
                          : "border-slate-200 bg-slate-50/70 hover:border-cyan-200 hover:bg-cyan-50/50 dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-cyan-900",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-slate-950 dark:text-white">{subject.name}</h3>
                            {selected && <Badge className="rounded-full bg-cyan-600 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white">Selected</Badge>}
                          </div>
                          <p className="mt-1 text-xs text-slate-500">Monthly fee from Rs. {formatMoney(subject.fee)}</p>
                        </div>
                        <div
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
                            selected ? "bg-cyan-600 text-white" : "bg-white text-slate-500 shadow-sm dark:bg-slate-950 dark:text-slate-300",
                          )}
                        >
                          <BookOpen className="h-4 w-4" />
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                        <span>{subject.teachers.length} teacher options</span>
                        <span className="inline-flex items-center gap-1 font-medium text-slate-700 dark:text-slate-200">
                          Configure <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
            {errors.selectedSubjects && <p className="mt-4 text-xs text-rose-500">{errors.selectedSubjects.message}</p>}
          </Card>

          {activeSubjects.length > 0 && (
            <Card className="border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/50 dark:border-slate-800/80 dark:bg-slate-950">
              <div className="mb-5 flex items-center justify-between gap-3 border-b border-slate-200/70 pb-4 dark:border-slate-800/80">
                <div>
                  <h2 className="text-lg font-bold text-slate-950 dark:text-white">Selected Subject Configuration</h2>
                  <p className="text-sm text-slate-500">Complete the subject-level schedule, fee, teacher, and automation controls.</p>
                </div>
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  {activeSubjects.length} subject{activeSubjects.length === 1 ? "" : "s"}
                </Badge>
              </div>

              <div className="space-y-5">
                {activeSubjects.map((subject) => {
                  const settingErrors = errors.subjectSettings?.[subject.key as SubjectKey] as
                    | {
                        teacher?: { message?: string };
                        monthlyFee?: { message?: string };
                        day?: { message?: string };
                        startTime?: { message?: string };
                        endTime?: { message?: string };
                      }
                    | undefined;

                  return (
                    <div key={subject.key} className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/60 sm:p-5">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-slate-950 dark:text-white">{subject.name}</h3>
                            {currentStream && (
                              <Badge className={cn("rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wide text-white", `bg-gradient-to-r ${currentStream.gradient}`)}>
                                {currentStream.label}
                              </Badge>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-slate-500">Configure the teaching schedule and automation for this subject.</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-9 rounded-full text-xs text-slate-500 hover:text-rose-500"
                          onClick={() => onToggleSubject(subject)}
                        >
                          Remove subject
                        </Button>
                      </div>

                      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold">Assign Teacher</Label>
                          <Select
                            value={String(subjectSettings?.[subject.key]?.teacher ?? "")}
                            onValueChange={(value) =>
                              setValue(`subjectSettings.${subject.key}.teacher`, value, { shouldDirty: true, shouldValidate: true })
                            }
                          >
                            <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                              <SelectValue placeholder="Select teacher" />
                            </SelectTrigger>
                            <SelectContent>
                              {teachers.length > 0
                                ? teachers.map((t) => (
                                    <SelectItem key={t.id} value={String(t.id)}>
                                      {t.name}
                                    </SelectItem>
                                  ))
                                : subject.teachers.map((teacher) => (
                                    <SelectItem key={teacher} value={teacher}>
                                      {teacher}
                                    </SelectItem>
                                  ))}
                            </SelectContent>
                          </Select>
                          {settingErrors?.teacher && <p className="text-xs text-rose-500">{settingErrors.teacher.message}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-semibold">Monthly Fee</Label>
                          <Input
                            type="number"
                            min={1}
                            step={50}
                            className="h-11 rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
                            {...register(`subjectSettings.${subject.key}.monthlyFee`, { valueAsNumber: true })}
                          />
                          {settingErrors?.monthlyFee && <p className="text-xs text-rose-500">{settingErrors.monthlyFee.message}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-semibold">Day</Label>
                          <Select
                            value={subjectSettings?.[subject.key]?.day ?? "Monday"}
                            onValueChange={(value) =>
                              setValue(`subjectSettings.${subject.key}.day`, value as (typeof DAYS)[number], { shouldDirty: true, shouldValidate: true })
                            }
                          >
                            <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                              <SelectValue placeholder="Select day" />
                            </SelectTrigger>
                            <SelectContent>
                              {DAYS.map((day) => (
                                <SelectItem key={day} value={day}>
                                  {day}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {settingErrors?.day && <p className="text-xs text-rose-500">{settingErrors.day.message}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-semibold">Start Time</Label>
                          <Input
                            type="time"
                            className="h-11 rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
                            {...register(`subjectSettings.${subject.key}.startTime`)}
                          />
                          {settingErrors?.startTime && <p className="text-xs text-rose-500">{settingErrors.startTime.message}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-semibold">End Time</Label>
                          <Input
                            type="time"
                            className="h-11 rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
                            {...register(`subjectSettings.${subject.key}.endTime`)}
                          />
                          {settingErrors?.endTime && <p className="text-xs text-rose-500">{settingErrors.endTime.message}</p>}
                        </div>

                        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                            <QrCode className="h-4 w-4 text-cyan-500" /> QR Attendance
                          </div>
                          <button
                            type="button"
                            ref={(el) => {
                              buttonRefs.current[`${subject.key}-qr`] = el;
                            }}
                            onClick={() =>
                              setValue(`subjectSettings.${subject.key}.qrAttendance`, !subjectSettings?.[subject.key]?.qrAttendance, {
                                shouldDirty: true,
                                shouldValidate: true,
                              })
                            }
                            className={cn(
                              "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition-colors",
                              subjectSettings?.[subject.key]?.qrAttendance
                                ? "border-cyan-500 bg-cyan-50 text-cyan-700 dark:border-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-200"
                                : "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300",
                            )}
                          >
                            <span>Enable QR attendance capture</span>
                            <span className="text-xs uppercase tracking-wide">{subjectSettings?.[subject.key]?.qrAttendance ? "On" : "Off"}</span>
                          </button>
                        </div>

                        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                            <BrainCircuit className="h-4 w-4 text-violet-500" /> AI Prediction
                          </div>
                          <button
                            type="button"
                            ref={(el) => {
                              buttonRefs.current[`${subject.key}-ai`] = el;
                            }}
                            onClick={() =>
                              setValue(`subjectSettings.${subject.key}.aiPrediction`, !subjectSettings?.[subject.key]?.aiPrediction, {
                                shouldDirty: true,
                                shouldValidate: true,
                              })
                            }
                            className={cn(
                              "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition-colors",
                              subjectSettings?.[subject.key]?.aiPrediction
                                ? "border-violet-500 bg-violet-50 text-violet-700 dark:border-violet-600 dark:bg-violet-500/10 dark:text-violet-200"
                                : "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300",
                            )}
                          >
                            <span>Enable AI subject prediction</span>
                            <span className="text-xs uppercase tracking-wide">{subjectSettings?.[subject.key]?.aiPrediction ? "On" : "Off"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                <Save className="h-4 w-4 text-cyan-500" /> Save Stream
              </div>
              <p className="text-xs text-slate-500">Persist the selected stream, subjects, and subject-level automation settings.</p>
            </div>

            <Button type="submit" size="lg" className="h-12 rounded-xl px-6 font-semibold shadow-lg shadow-cyan-500/20" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Stream"}
            </Button>
          </div>
        </form>

        <aside className="space-y-6">
          <Card className="border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/50 dark:border-slate-800/80 dark:bg-slate-950">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200/70 pb-4 dark:border-slate-800/80">
              <div>
                <h2 className="text-lg font-bold text-slate-950 dark:text-white">Live Summary</h2>
                <p className="text-sm text-slate-500">Quick snapshot of the current stream configuration.</p>
              </div>
              <div className={cn("flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg", currentStream ? currentStream.gradient : "from-slate-400 to-slate-600") }>
                <Sparkles className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/70">
                  <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">Selected Stream</div>
                  <div className="mt-1 text-lg font-black text-slate-950 dark:text-white">{currentStream?.label ?? "No stream selected"}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/70">
                  <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">Subjects Selected</div>
                  <div className="mt-1 text-lg font-black text-slate-950 dark:text-white">{selectedSubjects.length}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/70">
                  <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">Total Monthly Fee</div>
                  <div className="mt-1 text-lg font-black text-slate-950 dark:text-white">Rs. {formatMoney(totalMonthlyFee)}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/70">
                  <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">Teachers Assigned</div>
                  <div className="mt-1 text-lg font-black text-slate-950 dark:text-white">{totalTeachersAssigned}</div>
                </div>
              </div>

              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                  <CalendarDays className="h-4 w-4 text-cyan-500" /> Validation Highlights
                </div>
                <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="mt-0.5 h-4 w-4 text-cyan-500" /> Stream, grade, and medium are required.
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="mt-0.5 h-4 w-4 text-cyan-500" /> At least one subject must be selected for the active stream.
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="mt-0.5 h-4 w-4 text-cyan-500" /> End time must be later than start time.
                  </li>
                </ul>
              </div>

              {activeSubjects.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">Configured Subjects</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {activeSubjects.map((subject) => (
                      <Badge key={subject.key} variant="secondary" className="rounded-full px-3 py-1 text-xs">
                        {subject.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {existingSubjects.length > 0 && (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">Existing Subjects</div>
                  <ul className="mt-3 max-h-40 overflow-auto text-sm text-slate-700 dark:text-slate-300">
                    {existingSubjects.map((s) => (
                      <li key={s.id} className="flex items-center justify-between border-b py-2 last:border-b-0">
                        <div>
                          <div className="font-semibold">{s.name} <span className="text-xs text-slate-400">({s.code})</span></div>
                          <div className="text-xs text-slate-500">{s.teacher ? `${s.teacher.firstName} ${s.teacher.lastName}` : 'Unassigned'}</div>
                        </div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">Rs. {formatMoney(s.feePerMonth ?? 0)}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>

          <Card className="border-slate-200/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-lg shadow-slate-900/20 dark:border-slate-800/80">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200">
              <CheckCircle2 className="h-4 w-4" /> Production Ready
            </div>
            <h3 className="mt-3 text-xl font-black">Designed for institute operations</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              The page is optimized for quick manager entry with clear hierarchy, responsive fields, and direct feedback for each validation rule.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-300">
              <Clock3 className="h-4 w-4 text-cyan-300" /> Fast subject setup workflow
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}