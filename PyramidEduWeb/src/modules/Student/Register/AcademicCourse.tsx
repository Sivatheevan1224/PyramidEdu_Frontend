"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
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
import type {
  CourseOption,
  StreamOption,
  TeacherOption,
  RegisterFormValues,
} from "./types";

type Props = {
  values: RegisterFormValues;
  setValues: Dispatch<SetStateAction<RegisterFormValues>>;
  streams: StreamOption[];
  streamsLoading?: boolean;
  subjects: CourseOption[];
  subjectsLoading?: boolean;
  totalAmount: number;
  admissionFee: number;
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
  admissionFee,
  onBack,
  onNext,
}: Props) {
  const [streamOpen, setStreamOpen] = useState(false);
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [teacherOpen, setTeacherOpen] = useState(false);

  const [streamQuery, setStreamQuery] = useState("");
  const [subjectQuery, setSubjectQuery] = useState("");
  const [teacherQuery, setTeacherQuery] = useState("");

  const [teacherOptions, setTeacherOptions] = useState<TeacherOption[]>([]);
  const [teacherLoading, setTeacherLoading] = useState(false);

  const selectedStream = streams.find(
    (stream) => stream.id === values.selectedStreamId,
  );
  const selectedSubjectId = values.selectedCourseIds[0] ?? "";
  const selectedSubject = subjects.find(
    (subject) => subject.id === selectedSubjectId,
  );
  const selectedTeacherId = values.selectedTeacherIds[selectedSubjectId] ?? "";
  const selectedTeacher =
    teacherOptions.find((teacher) => teacher.id === selectedTeacherId) ??
    selectedSubject?.teachers?.find(
      (teacher) => teacher.id === selectedTeacherId,
    );

  useEffect(() => {
    let mounted = true;

    const loadTeachers = async () => {
      if (!selectedSubjectId) {
        setTeacherOptions([]);
        return;
      }

      setTeacherLoading(true);
      try {
        const response = await api.get("/teachers", {
          params: { subjectId: selectedSubjectId },
        });

        if (!mounted) return;

        const rows = Array.isArray(response.data?.data)
          ? response.data.data
          : Array.isArray(response.data)
            ? response.data
            : [];
        setTeacherOptions(
          rows
            .filter((item: any) => item?.isActive !== false)
            .map((item: any) => ({
              id: String(item.id),
              name: String(item.name),
              qualification: String(item.qualification ?? ""),
            })),
        );
      } catch (error) {
        try {
          const fallbackResponse = await api.get("/subjects/teachers", {
            params: { subjectId: selectedSubjectId },
          });

          if (!mounted) return;

          const fallbackRows = Array.isArray(fallbackResponse.data?.data)
            ? fallbackResponse.data.data
            : Array.isArray(fallbackResponse.data)
              ? fallbackResponse.data
              : [];

          setTeacherOptions(
            fallbackRows
              .filter((item: any) => item?.isActive !== false)
              .map((item: any) => ({
                id: String(item.id),
                name: String(item.name),
                qualification: String(item.qualification ?? ""),
              })),
          );
        } catch (fallbackError) {
          console.error(error, fallbackError);
          setTeacherOptions([]);
        }
      } finally {
        if (mounted) {
          setTeacherLoading(false);
        }
      }
    };

    loadTeachers();

    return () => {
      mounted = false;
    };
  }, [selectedSubjectId]);

  useEffect(() => {
    if (!selectedSubjectId) return;

    const currentTeacherId = values.selectedTeacherIds[selectedSubjectId];
    if (
      currentTeacherId &&
      !teacherOptions.some((teacher) => teacher.id === currentTeacherId)
    ) {
      setValues((prev) => {
        const nextTeacherIds = { ...prev.selectedTeacherIds };
        delete nextTeacherIds[selectedSubjectId];
        return {
          ...prev,
          selectedTeacherIds: nextTeacherIds,
        };
      });
    }
  }, [selectedSubjectId, teacherOptions, setValues, values.selectedTeacherIds]);

  const subjectCount = subjects.length;

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
            setSubjectOpen(false);
            setTeacherOpen(false);
          }}
          onSelect={(stream) => {
            setValues((prev) => ({
              ...prev,
              selectedStreamId: stream.id,
              selectedCourseIds: [],
              selectedTeacherIds: {},
            }));
            setStreamQuery("");
            setSubjectQuery("");
            setTeacherQuery("");
            setTeacherOptions([]);
            setStreamOpen(false);
            setSubjectOpen(false);
            setTeacherOpen(false);
          }}
        />

        <DropdownPanel
          label="Select Subject"
          placeholder={
            selectedStream ? "Choose a subject" : "Select a stream first"
          }
          disabled={!selectedStream}
          loading={subjectsLoading}
          open={subjectOpen}
          selectedLabel={selectedSubject?.name}
          query={subjectQuery}
          setQuery={setSubjectQuery}
          options={subjects}
          emptyMessage={
            selectedStream
              ? "No active subjects available for this stream."
              : "Select a stream first."
          }
          onToggle={() => {
            if (!selectedStream) return;
            setSubjectOpen((current) => !current);
            setStreamOpen(false);
            setTeacherOpen(false);
          }}
          onSelect={(subject) => {
            setValues((prev) => ({
              ...prev,
              selectedCourseIds: [subject.id],
              selectedTeacherIds: {},
            }));
            setSubjectQuery("");
            setTeacherQuery("");
            setTeacherOptions([]);
            setSubjectOpen(false);
            setTeacherOpen(false);
          }}
        />

        <DropdownPanel
          label="Select Teacher"
          placeholder={
            selectedSubject ? "Choose a teacher" : "Select a subject first"
          }
          disabled={!selectedSubject}
          loading={teacherLoading}
          open={teacherOpen}
          selectedLabel={selectedTeacher?.name}
          query={teacherQuery}
          setQuery={setTeacherQuery}
          options={teacherOptions}
          emptyMessage={
            selectedSubject
              ? "No active teachers assigned to this subject."
              : "Select a subject first."
          }
          onToggle={() => {
            if (!selectedSubject) return;
            setTeacherOpen((current) => !current);
            setStreamOpen(false);
            setSubjectOpen(false);
          }}
          onSelect={(teacher) => {
            if (!selectedSubjectId) return;
            setValues((prev) => ({
              ...prev,
              selectedTeacherIds: {
                ...prev.selectedTeacherIds,
                [selectedSubjectId]: teacher.id,
              },
            }));
            setTeacherQuery("");
            setTeacherOpen(false);
          }}
        />

        <div className="grid gap-4 rounded-2xl border border-slate-200/60 bg-white/60 p-5 dark:border-white/10 dark:bg-slate-950/20 sm:grid-cols-2">
          <div className="space-y-1 text-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Selected Stream
            </p>
            <p className="font-semibold text-foreground">
              {selectedStream?.name || "None"}
            </p>
          </div>
          <div className="space-y-1 text-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Selected Subject
            </p>
            <p className="font-semibold text-foreground">
              {selectedSubject?.name || "None"}
            </p>
          </div>
          <div className="space-y-1 text-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Selected Teacher
            </p>
            <p className="font-semibold text-foreground">
              {selectedTeacher?.name || "None"}
            </p>
          </div>
          <div className="space-y-1 text-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Available Subjects
            </p>
            <p className="font-semibold text-foreground">
              {subjectCount} loaded
            </p>
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
            <div className="flex justify-between text-muted-foreground">
              <span>One-time Admission / Registration Fee</span>
              <span className="font-semibold text-foreground">
                Rs. {admissionFee.toLocaleString()}.00
              </span>
            </div>
            {selectedSubject && (
              <div className="flex justify-between text-muted-foreground pl-3 border-l border-primary/20">
                <span>Subject Fee ({selectedSubject.name})</span>
                <span className="font-semibold text-foreground">
                  Rs. {selectedSubject.monthlyFee.toLocaleString()}.00
                </span>
              </div>
            )}
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
