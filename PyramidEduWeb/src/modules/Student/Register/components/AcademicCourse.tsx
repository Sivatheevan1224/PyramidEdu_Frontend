"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchTeachersForSubject } from "../services";
import {
  ChevronDown,
  CircleDollarSign,
  GraduationCap,
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Search,
} from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import type {
  CourseOption,
  StreamOption,
  TeacherOption,
  RegisterFormValues,
} from "../types";

type Props = {
  values: RegisterFormValues;
  setValues: Dispatch<SetStateAction<RegisterFormValues>>;
  streams: StreamOption[];
  streamsLoading?: boolean;
  subjects: CourseOption[];
  subjectsLoading?: boolean;
  totalAmount: number;
  onBack: () => void;
  onNext: () => void;
};

type DropdownPanelProps<T extends { id: string; name: string }> = {
  label: string;
  placeholder: string;
  disabled?: boolean;
  loading?: boolean;
  open: boolean;
  selectedLabel?: string;
  query: string;
  setQuery: (value: string) => void;
  options: T[];
  emptyMessage: string;
  onToggle: () => void;
  onSelect: (item: T) => void;
};

type TeacherApiItem = {
  id: string | number;
  name?: string;
  qualification?: string;
  firstName?: string;
  lastName?: string;
  specialization?: string;
  isActive?: boolean;
  user?: {
    fullName?: string;
    isActive?: boolean;
  };
};

function toTeacherOption(item: TeacherApiItem): TeacherOption {
  return {
    id: String(item.id),
    name:
      String(
        item.user?.fullName ?? item.name ?? `${item.firstName ?? ""} ${item.lastName ?? ""}`.trim(),
      ) || "Assigned Teacher",
    qualification: String(item.qualification ?? item.specialization ?? ""),
  };
}

function DropdownPanel<T extends { id: string; name: string }>({
  label,
  placeholder,
  disabled,
  loading,
  open,
  selectedLabel,
  query,
  setQuery,
  options,
  emptyMessage,
  onToggle,
  onSelect,
}: DropdownPanelProps<T>) {
  const filteredOptions = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return options;
    return options.filter((item) => item.name.toLowerCase().includes(needle));
  }, [options, query]);

  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold">
        {label} <span className="text-red-500">*</span>
      </Label>
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={onToggle}
          className={`flex h-12 w-full items-center justify-between rounded-xl border px-4 text-left text-sm transition-all ${disabled ? "cursor-not-allowed border-slate-200/50 bg-slate-100/60 text-muted-foreground dark:border-white/10 dark:bg-slate-950/20" : "border-slate-200/70 bg-white/80 text-foreground hover:border-primary/50 dark:border-white/10 dark:bg-slate-950/20"}`}
        >
          <span
            className={
              selectedLabel ? "text-foreground" : "text-muted-foreground"
            }
          >
            {selectedLabel || placeholder}
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && !disabled && (
          <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-xl shadow-slate-900/10 dark:border-white/10 dark:bg-slate-950">
            <div className="border-b border-slate-200/70 p-3 dark:border-white/10">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Search ${label.toLowerCase()}...`}
                  className="h-10 pl-9"
                />
              </div>
            </div>

            <div className="max-h-64 overflow-auto p-2">
              {loading ? (
                <div className="flex items-center gap-2 px-3 py-3 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading {label.toLowerCase()}...
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className="px-3 py-3 text-sm text-muted-foreground">
                  {emptyMessage}
                </div>
              ) : (
                filteredOptions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelect(item)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm transition-colors hover:bg-primary/8"
                  >
                    <span className="font-medium text-foreground">
                      {item.name}
                    </span>
                    {selectedLabel === item.name && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AcademicCourse({
  values,
  setValues,
  streams,
  streamsLoading,
  subjects,
  subjectsLoading,
  totalAmount,
  onBack,
  onNext,
}: Props) {
  const [streamOpen, setStreamOpen] = useState(false);

  const [streamQuery, setStreamQuery] = useState("");
  const [teacherQuery, setTeacherQuery] = useState("");

  const [activeTeacherSubjectId, setActiveTeacherSubjectId] = useState<
    string | null
  >(null);
  const [teacherOptionsBySubject, setTeacherOptionsBySubject] = useState<
    Record<string, TeacherOption[]>
  >({});
  const [teacherLoadingBySubject, setTeacherLoadingBySubject] = useState<
    Record<string, boolean>
  >({});

  const selectedStream = streams.find(
    (stream) => stream.id === values.selectedStreamId,
  );
  const selectedSubjects = useMemo(
    () =>
      values.selectedCourseIds
        .map((subjectId) =>
          subjects.find((subject) => subject.id === subjectId),
        )
        .filter((subject): subject is CourseOption => Boolean(subject)),
    [subjects, values.selectedCourseIds],
  );

  const loadTeachersForSubject = async (subjectId: string) => {
    if (
      teacherOptionsBySubject[subjectId] ||
      teacherLoadingBySubject[subjectId]
    ) {
      return;
    }

    setTeacherLoadingBySubject((prev) => ({ ...prev, [subjectId]: true }));

    try {
      const teachers = await fetchTeachersForSubject(subjectId);
      setTeacherOptionsBySubject((prev) => ({
        ...prev,
        [subjectId]: teachers,
      }));
    } catch (error) {
      console.error(error);
      toast.error("Unable to load teachers for the selected subject.");
      setTeacherOptionsBySubject((prev) => ({ ...prev, [subjectId]: [] }));
    } finally {
      setTeacherLoadingBySubject((prev) => ({ ...prev, [subjectId]: false }));
    }
  };

  useEffect(() => {
    if (
      activeTeacherSubjectId &&
      !values.selectedCourseIds.includes(activeTeacherSubjectId)
    ) {
      setActiveTeacherSubjectId(null);
      setTeacherQuery("");
    }

    values.selectedCourseIds.forEach((subjectId) => {
      void loadTeachersForSubject(subjectId);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTeacherSubjectId, values.selectedCourseIds]);

  useEffect(() => {
    values.selectedCourseIds.forEach((subjectId) => {
      const selectedTeacherId = values.selectedTeacherIds[subjectId];
      const availableTeachers = teacherOptionsBySubject[subjectId] ?? [];

      if (
        selectedTeacherId &&
        availableTeachers.length > 0 &&
        !availableTeachers.some((teacher) => teacher.id === selectedTeacherId)
      ) {
        setValues((prev) => {
          const nextTeacherIds = { ...prev.selectedTeacherIds };
          delete nextTeacherIds[subjectId];
          return {
            ...prev,
            selectedTeacherIds: nextTeacherIds,
          };
        });
      }
    });
  }, [
    teacherOptionsBySubject,
    setValues,
    values.selectedCourseIds,
    values.selectedTeacherIds,
  ]);

  const handleToggleSubject = (subject: CourseOption) => {
    const isSelected = values.selectedCourseIds.includes(subject.id);

    if (isSelected) {
      setValues((prev) => {
        const nextTeacherIds = { ...prev.selectedTeacherIds };
        delete nextTeacherIds[subject.id];
        return {
          ...prev,
          selectedCourseIds: prev.selectedCourseIds.filter(
            (id) => id !== subject.id,
          ),
          selectedTeacherIds: nextTeacherIds,
        };
      });

      if (activeTeacherSubjectId === subject.id) {
        setActiveTeacherSubjectId(null);
        setTeacherQuery("");
      }

      return;
    }

    if (values.selectedCourseIds.length >= 3) {
      toast.error("You can select up to 3 subjects only.");
      return;
    }

    setValues((prev) => ({
      ...prev,
      selectedCourseIds: [...prev.selectedCourseIds, subject.id],
    }));

    void loadTeachersForSubject(subject.id);
    setActiveTeacherSubjectId(subject.id);
    setTeacherQuery("");
  };

  const handleSelectTeacher = (subjectId: string, teacherId: string) => {
    setValues((prev) => ({
      ...prev,
      selectedTeacherIds: {
        ...prev.selectedTeacherIds,
        [subjectId]: teacherId,
      },
    }));
    setTeacherQuery("");
    setActiveTeacherSubjectId(null);
  };

  const selectedSubjectCount = values.selectedCourseIds.length;

  return (
    <div className="space-y-6 animate-fadeInUp">
      <div className="flex items-center gap-2 border-b border-slate-200/50 dark:border-white/10 pb-2">
        <GraduationCap className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground">
          Academic & Course
        </h2>
      </div>

      <div className="grid gap-5">
        <DropdownPanel
          label="Select Stream"
          placeholder="Choose your A/L stream"
          disabled={streamsLoading && streams.length === 0}
          loading={streamsLoading}
          open={streamOpen}
          selectedLabel={selectedStream?.name}
          query={streamQuery}
          setQuery={setStreamQuery}
          options={streams}
          emptyMessage="No active streams available."
          onToggle={() => {
            setStreamOpen((current) => !current);
          }}
          onSelect={(stream) => {
            setValues((prev) => ({
              ...prev,
              selectedStreamId: stream.id,
              selectedCourseIds: [],
              selectedTeacherIds: {},
            }));
            setStreamQuery("");
            setTeacherQuery("");
            setStreamOpen(false);
            setActiveTeacherSubjectId(null);
          }}
        />

        <div className="rounded-2xl border border-slate-200/60 bg-white/60 p-5 dark:border-white/10 dark:bg-slate-950/20">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Select Subjects
              </p>
              <p className="text-sm text-muted-foreground">
                Choose 1 to 3 subjects. Each selected subject needs one teacher.
              </p>
            </div>
            <p className="text-xs font-semibold text-muted-foreground">
              {selectedSubjectCount}/3 selected
            </p>
          </div>

          <div className="grid gap-4">
            {subjects.map((subject) => {
              const isSelected = values.selectedCourseIds.includes(subject.id);
              const teacherOptions = teacherOptionsBySubject[subject.id] ?? [];
              const teacherLoading =
                teacherLoadingBySubject[subject.id] ?? false;
              const selectedTeacherId =
                values.selectedTeacherIds[subject.id] ?? "";
              const selectedTeacher = teacherOptions.find(
                (teacher) => teacher.id === selectedTeacherId,
              );
              const teacherDropdownOpen = activeTeacherSubjectId === subject.id;

              return (
                <div
                  key={subject.id}
                  className={`rounded-2xl border p-4 transition-all ${isSelected ? "border-primary bg-primary/5" : "border-slate-200/60 bg-white/70 dark:border-white/10 dark:bg-slate-950/10"}`}
                >
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      checked={isSelected}
                      disabled={!isSelected && selectedSubjectCount >= 3}
                      onChange={() => handleToggleSubject(subject)}
                    />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-foreground">
                            {subject.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {subject.description || "No description available."}
                          </p>
                        </div>
                        <p className="text-xs font-semibold text-primary">
                          Rs. {subject.monthlyFee.toLocaleString()}.00 / month
                        </p>
                      </div>
                    </div>
                  </label>

                  {isSelected && (
                    <div className="mt-4 pl-7">
                      <DropdownPanel
                        label={`Teacher for ${subject.name}`}
                        placeholder="Choose a teacher"
                        disabled={false}
                        loading={teacherLoading}
                        open={teacherDropdownOpen}
                        selectedLabel={selectedTeacher?.name}
                        query={teacherDropdownOpen ? teacherQuery : ""}
                        setQuery={setTeacherQuery}
                        options={teacherOptions}
                        emptyMessage="No active teachers assigned to this subject."
                        onToggle={() => {
                          setStreamOpen(false);
                          setActiveTeacherSubjectId((current) =>
                            current === subject.id ? null : subject.id,
                          );
                          void loadTeachersForSubject(subject.id);
                          setTeacherQuery("");
                        }}
                        onSelect={(teacher) => {
                          handleSelectTeacher(subject.id, teacher.id);
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/60 bg-white/60 p-5 dark:border-white/10 dark:bg-slate-950/20">
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.2fr_1.2fr]">
            <div className="space-y-2 text-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Selected Stream
              </p>
              <p className="font-semibold text-foreground">
                {selectedStream?.name || "None"}
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Selected Subject
              </p>
              <div className="space-y-2">
                {selectedSubjects.length > 0 ? (
                  selectedSubjects.map((subject, index) => (
                    <div
                      key={subject.id}
                      className="flex items-center gap-2 rounded-xl bg-slate-950/5 px-3 py-2 dark:bg-white/5"
                    >
                      <span className="text-xs font-bold text-muted-foreground">
                        {index + 1}.
                      </span>
                      <span className="font-semibold text-foreground">
                        {subject.name}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="font-semibold text-foreground">None</p>
                )}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Selected Teacher
              </p>
              <div className="space-y-2">
                {selectedSubjects.length > 0 ? (
                  selectedSubjects.map((subject, index) => {
                    const teacherId = values.selectedTeacherIds[subject.id];
                    const teacher = (
                      teacherOptionsBySubject[subject.id] ?? []
                    ).find((item) => item.id === teacherId);

                    return (
                      <div
                        key={subject.id}
                        className="flex items-center gap-2 rounded-xl bg-slate-950/5 px-3 py-2 dark:bg-white/5"
                      >
                        <span className="text-xs font-bold text-muted-foreground">
                          {index + 1}.
                        </span>
                        <span className="font-semibold text-foreground">
                          {teacher ? teacher.name : "None"}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="font-semibold text-foreground">None</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-dashed border-slate-200/70 bg-white/40 px-4 py-3 text-xs text-muted-foreground dark:border-white/10 dark:bg-slate-950/20">
            {subjects.length} subjects loaded
          </div>
        </div>

        <div className="glass-subtle border rounded-2xl p-6 space-y-4 animate-fadeInUp shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-200/50 dark:border-white/10 pb-2.5">
            <CircleDollarSign className="h-4 w-4 text-primary" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
              Fee Breakdown Summary
            </h3>
          </div>
          <div className="space-y-2 text-xs">
            {selectedSubjects.map((subject) => (
              <div
                key={subject.id}
                className="flex justify-between text-muted-foreground pl-3 border-l border-primary/20"
              >
                <span>Subject Fee ({subject.name})</span>
                <span className="font-semibold text-foreground">
                  Rs. {subject.monthlyFee.toLocaleString()}.00
                </span>
              </div>
            ))}
            <div className="flex justify-between border-t border-slate-200/50 dark:border-white/10 pt-3 text-sm">
              <span className="font-extrabold text-foreground">
                Total Payable Today
              </span>
              <span className="font-black text-primary text-base">
                Rs. {totalAmount.toLocaleString()}.00
              </span>
            </div>
          </div>
        </div>
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
          onClick={onNext}
          className="h-11 px-8 rounded-xl font-semibold gap-2 bg-primary hover:bg-primary/95 text-white"
        >
          Next: Login Credentials <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
