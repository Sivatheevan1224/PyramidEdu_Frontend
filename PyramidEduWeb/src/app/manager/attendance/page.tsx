"use client";

import React, { useState, useEffect, useMemo } from "react";
import api from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronDown, Check, Loader2, QrCode } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Subject {
  id: string;
  name?: string;
  subjectName?: string;
}

interface Batch {
  id: string;
  batchName: string;
}

interface StudentRecord {
  id: string;
  indexNumber: string;
  fullName: string;
  feeStatus: string;
  attendanceStatus?: 'PRESENT' | 'ABSENT'; // State purely for UI
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
}: {
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
}) {
  const filteredOptions = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return options;
    return options.filter((item) => item.name.toLowerCase().includes(needle));
  }, [options, query]);

  return (
    <div className="space-y-2 flex-1 min-w-[200px]">
      <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </Label>
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={onToggle}
          className={`flex h-10 w-full items-center justify-between rounded-md border px-3 text-left text-sm transition-all ${disabled ? "cursor-not-allowed opacity-50 bg-muted text-muted-foreground" : "bg-background border-input text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2"}`}
        >
          <span className={selectedLabel ? "text-foreground" : "text-muted-foreground truncate"}>
            {selectedLabel || placeholder}
          </span>
          <ChevronDown className={`h-4 w-4 opacity-50 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && !disabled && (
          <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md outline-none">
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${label.toLowerCase()}...`}
                className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="max-h-[300px] overflow-auto p-1 bg-white dark:bg-slate-950">
              {loading ? (
                <div className="py-6 text-center text-sm">
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
                    onClick={() => onSelect(item)}
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
        )}
      </div>
    </div>
  );
}

export default function ManagerAttendancePage() {
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

  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

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
      setTeacherId('');
      return;
    }

    const fetchTeachers = async () => {
      setTeachersLoading(true);
      try {
        const res = await api.get('/subjects/teachers', { params: { subjectId } });
        const rows = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
        const mapped = rows
          .filter((item: any) => item?.isActive !== false && item?.user?.isActive !== false)
          .map((item: any) => ({
            id: String(item.id),
            name: String(item.user?.fullName ?? item.name ?? `${item.firstName ?? ''} ${item.lastName ?? ''}`.trim()) || 'Assigned Teacher',
          }));
        setTeachers(mapped);
      } catch (err) {
        console.error('Failed to fetch teachers', err);
        setTeachers([]);
      } finally {
        setTeachersLoading(false);
      }
    };
    fetchTeachers();
    setTeacherId('');
  }, [subjectId]);

  const handleSearch = async () => {
    if (!subjectId || !sessionDate || !sessionTime) {
      toast.error("Subject, Session Date, and Session Time are required.");
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const res = await api.get("/attendance/students", {
        params: {
          subjectId,
          batchId: batchId || undefined,
          teacherId: teacherId || undefined,
          sessionDate,
          sessionTime,
        },
      });

      const fetchedStudents = res.data.data.map((s: any) => ({
        ...s,
        attendanceStatus: 'ABSENT', // default UI state
      }));
      setStudents(fetchedStudents);
    } catch (err: any) {
      console.error("Failed to load students", err);
      toast.error(err.response?.data?.message || "Failed to load students.");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    setStudents((prev) => prev.map(s => ({ ...s, attendanceStatus: 'PRESENT' })));
  };

  const handleUnselectAll = () => {
    setStudents((prev) => prev.map(s => ({ ...s, attendanceStatus: 'ABSENT' })));
  };

  const toggleStudentAttendance = (id: string, checked: boolean) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, attendanceStatus: checked ? 'PRESENT' : 'ABSENT' } : s))
    );
  };

  const handleSubmit = async () => {
    if (!subjectId || !sessionDate || !sessionTime) {
      toast.error("Subject, Session Date, and Session Time are required.");
      return;
    }

    if (students.length === 0) {
      toast.error("No students to submit.");
      return;
    }

    setSubmitting(true);
    try {
      const records = students.map((s) => ({
        studentId: s.id,
        subjectId,
        teacherId: teacherId || undefined,
        batchId: batchId || null,
        sessionDate,
        sessionTime,
        attendanceStatus: s.attendanceStatus,
      }));

      const res = await api.post("/attendance/manual", { records });
      if (res.data.success) {
        toast.success("Attendance saved successfully.");
        // Clear checkboxes
        handleUnselectAll();
        // Optional: refresh student list to potentially remove duplicates or re-verify status
      }
    } catch (err: any) {
      console.error("Failed to submit attendance", err);
      toast.error(err.response?.data?.message || "Failed to submit attendance.");
    } finally {
      setSubmitting(false);
    }
  };

  const mappedSubjects = subjects.map((s) => ({
    id: String(s.id),
    name: s.subjectName || s.name || "Unnamed Subject",
  }));
  const mappedBatches = batches.map((b) => ({
    id: String(b.id),
    name: b.batchName,
  }));

  const selectedSubject = mappedSubjects.find((s) => s.id === subjectId);
  const selectedBatch = mappedBatches.find((b) => b.id === batchId);
  const selectedTeacher = teachers.find((t) => t.id === teacherId);

  return (
    <div className="w-full px-4 md:px-8 py-6 max-w-[1920px] mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manual Attendance</h1>
          <p className="text-muted-foreground mt-2">
            Mark student attendance manually for specific sessions.
          </p>
        </div>
        <Link href="/attendance/scanner">
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
            <QrCode className="h-4 w-4" />
            Open Attendance Scanner
          </Button>
        </Link>
      </div>

      {/* Configuration Form */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-1">Student Details Table / Configuration</h2>
        <p className="text-sm text-muted-foreground mb-6">Select the class session details before starting.</p>
        
        <div className="flex flex-wrap gap-4 items-end">
          <DropdownPanel
            label="Subject"
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
              setSubjectDropdownOpen(false);
              setSubjectQuery("");
            }}
          />

          <DropdownPanel
            label="Teacher"
            placeholder="-- Select Teacher --"
            open={teacherDropdownOpen}
            onToggle={() => {
              setTeacherDropdownOpen(!teacherDropdownOpen);
              setSubjectDropdownOpen(false);
              setBatchDropdownOpen(false);
            }}
            loading={teachersLoading}
            disabled={!subjectId}
            selectedLabel={selectedTeacher?.name}
            query={teacherQuery}
            setQuery={setTeacherQuery}
            options={teachers}
            emptyMessage={!subjectId ? "Select a subject first" : "No teachers found."}
            onSelect={(item) => {
              setTeacherId(item.id);
              setTeacherDropdownOpen(false);
              setTeacherQuery("");
            }}
          />

          <div className="space-y-2 flex-1 min-w-[150px]">
            <Label className="text-sm font-medium">Session Date</Label>
            <Input
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              className="h-10"
            />
          </div>

          <div className="space-y-2 flex-1 min-w-[150px]">
            <Label className="text-sm font-medium">Session Time</Label>
            <Input
              type="time"
              value={sessionTime}
              onChange={(e) => setSessionTime(e.target.value)}
              className="h-10"
            />
          </div>

          <DropdownPanel
            label="Batch (Optional)"
            placeholder="-- Select Batch (Optional) --"
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
              // Toggle logic if same batch clicked
              if (batchId === item.id) {
                setBatchId("");
              } else {
                setBatchId(item.id);
              }
              setBatchDropdownOpen(false);
              setBatchQuery("");
            }}
          />

          <Button 
            onClick={handleSearch} 
            className="h-10 px-8 bg-slate-900 hover:bg-slate-800 text-white min-w-[150px]"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Search className="h-4 w-4 mr-2" /> Search / Load</>}
          </Button>
        </div>
      </Card>

      {/* Student List Table */}
      {hasSearched && (
        <Card className="p-6 overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold">Student Attendance List</h2>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" onClick={handleSelectAll} disabled={students.length === 0 || loading || submitting}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={handleUnselectAll} disabled={students.length === 0 || loading || submitting}>
                Unselect All
              </Button>
              <Button onClick={handleSubmit} disabled={students.length === 0 || loading || submitting} className="bg-primary">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                Submit Attendance
              </Button>
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Index Number</th>
                  <th className="px-4 py-3 font-medium">Student Name</th>
                  <th className="px-4 py-3 font-medium">Fee Status</th>
                  <th className="px-4 py-3 font-medium text-center">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                      Loading students...
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                      No students found for the selected session.
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">{student.indexNumber || "N/A"}</td>
                      <td className="px-4 py-3 font-medium">{student.fullName}</td>
                      <td className="px-4 py-3">
                        <Badge 
                          variant="outline" 
                          className={
                            student.feeStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' :
                            student.feeStatus === 'PARTIALLY_PAID' || student.feeStatus === 'PARTIAL' ? 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' :
                            student.feeStatus === 'OVERDUE' ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' :
                            'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                          }
                        >
                          {student.feeStatus === 'PARTIAL' ? 'PARTIALLY_PAID' : (student.feeStatus || 'UNPAID')}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input 
                          type="checkbox"
                          checked={student.attendanceStatus === 'PRESENT'}
                          onChange={(e) => toggleStudentAttendance(student.id, e.target.checked)}
                          className="h-5 w-5 accent-primary rounded cursor-pointer"
                          aria-label={`Mark ${student.fullName} as present`}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
