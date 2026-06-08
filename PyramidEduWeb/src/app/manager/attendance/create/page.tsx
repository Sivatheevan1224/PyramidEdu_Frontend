"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronDown, Check, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Subject {
  id: string;
  subjectName?: string;
  name?: string;
}

interface Batch {
  id: string;
  batchName: string;
}

function DropdownPanel({
  label,
  placeholder,
  open,
  onToggle,
  disabled = false,
  selectedLabel,
  query,
  setQuery,
  options,
  emptyMessage,
  onSelect,
  loading = false,
}: {
  label: string;
  placeholder: string;
  open: boolean;
  onToggle: () => void;
  disabled?: boolean;
  selectedLabel?: string;
  query: string;
  setQuery: (val: string) => void;
  options: { id: string; name: string }[];
  emptyMessage: string;
  onSelect: (item: { id: string; name: string }) => void;
  loading?: boolean;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (open) onToggle();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onToggle]);

  const filteredOptions = options.filter((o) =>
    o.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-2 flex-1 min-w-[200px] relative" ref={dropdownRef}>
      <Label className="text-sm font-medium">{label}</Label>
      <button
        type="button"
        disabled={disabled}
        onClick={onToggle}
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className={selectedLabel ? "text-foreground" : "text-muted-foreground truncate"}>
          {selectedLabel || placeholder}
        </span>
        <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
      </button>

      {open && (
        <div className="absolute z-50 w-full mt-1 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80 zoom-in-95">
          <div className="p-1">
            <Input
              placeholder={`Search ${label.toLowerCase()}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-8 mb-1"
            />
            <div className="max-h-[200px] overflow-auto">
              {loading ? (
                <div className="py-6 text-center">
                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  {emptyMessage}
                </div>
              ) : (
                filteredOptions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelect(item);
                      onToggle();
                    }}
                    className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                  >
                    <span className="truncate">{item.name}</span>
                    {selectedLabel === item.name && (
                      <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                        <Check className="h-4 w-4 text-primary" />
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CreateClassPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [teachers, setTeachers] = useState<{ id: string; name: string }[]>([]);
  
  const [subjectId, setSubjectId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split("T")[0]);
  const [sessionTime, setSessionTime] = useState("");

  const [subjectQuery, setSubjectQuery] = useState("");
  const [batchQuery, setBatchQuery] = useState("");
  const [teacherQuery, setTeacherQuery] = useState("");
  
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);
  const [batchDropdownOpen, setBatchDropdownOpen] = useState(false);
  const [teacherDropdownOpen, setTeacherDropdownOpen] = useState(false);

  const [teachersLoading, setTeachersLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get("/subjects");
        setSubjects(res.data.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch subjects", err);
      }
    };
    const fetchBatches = async () => {
      try {
        const res = await api.get("/batches?activeOnly=true");
        setBatches(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch batches", err);
      }
    };
    fetchSubjects();
    fetchBatches();
  }, []);

  useEffect(() => {
    if (!subjectId) {
      setTeachers([]);
      setTeacherId("");
      return;
    }

    const fetchTeachers = async () => {
      setTeachersLoading(true);
      try {
        const res = await api.get("/subjects/teachers", { params: { subjectId } });
        const rows = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
        const mapped = rows
          .filter((item: any) => item?.isActive !== false && item?.user?.isActive !== false)
          .map((item: any) => ({
            id: String(item.id),
            name: String(item.user?.fullName ?? item.name ?? `${item.firstName ?? ''} ${item.lastName ?? ''}`.trim()) || "Assigned Teacher",
          }));
        setTeachers(mapped);
      } catch (err) {
        console.error("Failed to fetch teachers", err);
        setTeachers([]);
      } finally {
        setTeachersLoading(false);
      }
    };

    fetchTeachers();
    setTeacherId("");
  }, [subjectId]);

  const handleCreateClass = async () => {
    if (!subjectId || !teacherId || !sessionDate || !sessionTime) {
      toast.error("Subject, Teacher, Session Date, and Session Time are required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/attendance/sessions", {
        subjectId,
        teacherId,
        batchId: batchId || undefined,
        sessionDate,
        sessionTime,
      });
      if (res.data.success) {
        toast.success("Class session created successfully.");
        router.push("/manager/attendance");
      }
    } catch (err: any) {
      console.error("Failed to create class", err);
      toast.error(err.response?.data?.message || "Failed to create class.");
    } finally {
      setSubmitting(false);
    }
  };

  const mappedSubjects = subjects.map((s) => ({
    id: s.id,
    name: s.name || s.subjectName || "Unnamed Subject",
  }));
  const mappedBatches = batches.map((b) => ({
    id: b.id,
    name: b.batchName,
  }));

  const selectedSubject = mappedSubjects.find((s) => s.id === subjectId);
  const selectedBatch = mappedBatches.find((b) => b.id === batchId);
  const selectedTeacher = teachers.find((t) => t.id === teacherId);

  return (
    <div className="w-full px-4 md:px-8 py-6 max-w-[1000px] mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/manager/attendance" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Create Class Session</h1>
          </div>
          <p className="text-muted-foreground">
            Configure a new class session to track attendance.
          </p>
        </div>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Class Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DropdownPanel
            label="Subject *"
            placeholder="-- Select Subject --"
            open={subjectDropdownOpen}
            onToggle={() => {
              setSubjectDropdownOpen(!subjectDropdownOpen);
              setBatchDropdownOpen(false);
              setTeacherDropdownOpen(false);
            }}
            selectedLabel={selectedSubject?.name}
            query={subjectQuery}
            setQuery={setSubjectQuery}
            options={mappedSubjects}
            emptyMessage="No subjects found."
            onSelect={(item) => {
              setSubjectId(item.id);
              setSubjectQuery("");
            }}
          />

          <div className="animate-in fade-in slide-in-from-left-2">
            <DropdownPanel
              label="Teacher *"
              placeholder={subjectId ? "-- Select Teacher --" : "-- Select Subject First --"}
              disabled={!subjectId}
              open={teacherDropdownOpen}
              onToggle={() => {
                setTeacherDropdownOpen(!teacherDropdownOpen);
                setSubjectDropdownOpen(false);
                setBatchDropdownOpen(false);
              }}
              loading={teachersLoading}
              selectedLabel={selectedTeacher?.name}
              query={teacherQuery}
              setQuery={setTeacherQuery}
              options={teachers}
              emptyMessage="No teachers assigned to this subject."
              onSelect={(item) => {
                setTeacherId(item.id);
                setTeacherQuery("");
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Session Date *</Label>
            <Input
              id="date"
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Session Time *</Label>
            <Input
              id="time"
              type="time"
              value={sessionTime}
              onChange={(e) => setSessionTime(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <DropdownPanel
              label="Batch (Optional)"
              placeholder="-- Select Batch --"
              open={batchDropdownOpen}
              onToggle={() => {
                setBatchDropdownOpen(!batchDropdownOpen);
                setSubjectDropdownOpen(false);
                setTeacherDropdownOpen(false);
              }}
              selectedLabel={selectedBatch?.name}
              query={batchQuery}
              setQuery={setBatchQuery}
              options={mappedBatches}
              emptyMessage="No batches found."
              onSelect={(item) => {
                setBatchId(item.id);
                setBatchQuery("");
              }}
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button onClick={handleCreateClass} disabled={submitting} className="min-w-[150px]">
            {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Create Class Session
          </Button>
        </div>
      </Card>
    </div>
  );
}
