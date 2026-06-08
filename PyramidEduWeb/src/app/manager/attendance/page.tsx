"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, Check, Loader2, QrCode, Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { format } from "date-fns";

interface ClassSession {
  id: string;
  subjectId: string;
  teacherId: string;
  sessionDate: string;
  sessionTime: string;
  status: 'CREATED' | 'ACTIVE' | 'COMPLETED';
  subject?: { name: string; subjectName?: string };
  teacher?: { user?: { fullName?: string }; name?: string; firstName?: string; lastName?: string };
  batch?: { batchName?: string };
}

interface StudentRecord {
  studentId: string;
  studentName: string;
  indexNumber: string;
  feeStatus: string;
  isPresent: boolean;
  hasRecord: boolean;
  attendanceDate: string;
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
    <div className="space-y-2 flex-1 min-w-[250px] relative" ref={dropdownRef}>
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
                    <span className="truncate text-left">{item.name}</span>
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

export default function ManagerAttendancePage() {
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split("T")[0]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [sessionId, setSessionId] = useState("");
  const [sessionQuery, setSessionQuery] = useState("");
  const [sessionDropdownOpen, setSessionDropdownOpen] = useState(false);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  
  const [selectedStudents, setSelectedStudents] = useState<Record<string, boolean | undefined>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!sessionDate) return;
    
    const fetchSessions = async () => {
      setSessionsLoading(true);
      try {
        const res = await api.get("/attendance/sessions", {
          params: { sessionDate },
        });
        setSessions(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch sessions", err);
        setSessions([]);
      } finally {
        setSessionsLoading(false);
      }
    };
    
    fetchSessions();
    setSessionId(""); // Reset selection on date change
    setStudents([]);
  }, [sessionDate]);

  const handleLoadStudents = async () => {
    if (!sessionId) {
      toast.error("Please select a class session first.");
      return;
    }

    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    setStudentsLoading(true);
    try {
      const res = await api.get("/attendance/students", {
        params: {
          subjectId: session.subjectId,
          teacherId: session.teacherId,
          batchId: session.batchId || undefined,
          sessionDate: session.sessionDate,
          sessionTime: session.sessionTime,
        },
      });
      
      const loadedStudents: StudentRecord[] = res.data.data || [];
      setStudents(loadedStudents);
      
      const initialSelection: Record<string, boolean | undefined> = {};
      loadedStudents.forEach(s => {
        initialSelection[s.studentId] = s.hasRecord ? s.isPresent : undefined;
      });
      setSelectedStudents(initialSelection);
      
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load students.");
      setStudents([]);
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleCheckboxChange = (studentId: string, checked: boolean) => {
    setSelectedStudents(prev => ({
      ...prev,
      [studentId]: checked,
    }));
  };

  const handleMarkAll = (checked: boolean) => {
    const updated: Record<string, boolean> = {};
    students.forEach((student) => {
      updated[student.studentId] = checked;
    });
    setSelectedStudents(updated);
  };

  const handleSubmit = async () => {
    if (students.length === 0) return;

    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    const records = students.map((student) => ({
      studentId: student.studentId,
      subjectId: session.subjectId,
      teacherId: session.teacherId,
      classSessionId: session.id,
      sessionDate: session.sessionDate,
      sessionTime: session.sessionTime,
      attendanceStatus: selectedStudents[student.studentId] === true ? "PRESENT" : "ABSENT",
      attendanceMethod: "MANUAL",
      isPresent: selectedStudents[student.studentId] === true,
    }));

    setSubmitting(true);
    try {
      await api.post("/attendance/manual", { records });
      toast.success("Attendance updated successfully.");
      handleLoadStudents(); // Reload to refresh statuses
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit attendance.");
    } finally {
      setSubmitting(false);
    }
  };

  const getTeacherName = (t: any) => {
    if (!t) return "Unknown Teacher";
    return t.user?.fullName || t.name || `${t.firstName || ''} ${t.lastName || ''}`.trim() || "Unknown Teacher";
  };

  const mappedSessions = sessions.map((s) => ({
    id: s.id,
    name: `[${s.sessionTime}] ${s.subject?.name || s.subject?.subjectName} - ${getTeacherName(s.teacher)} ${s.batch ? `(${s.batch.batchName})` : ''}`,
  }));

  const selectedSessionItem = mappedSessions.find((s) => s.id === sessionId);

  return (
    <div className="w-full px-4 md:px-8 py-6 max-w-[1920px] mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manual Attendance</h1>
          <p className="text-muted-foreground mt-2">
            Select a class session to load students and manually mark attendance.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/manager/attendance/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Class
            </Button>
          </Link>
          <Link href="/attendance/scanner">
            <Button variant="outline" className="gap-2">
              <QrCode className="h-4 w-4" />
              Open Scanner
            </Button>
          </Link>
        </div>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Select Session</h2>
        
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
            />
          </div>

          <DropdownPanel
            label="Class Session"
            placeholder={sessionsLoading ? "Loading sessions..." : "-- Select Class --"}
            open={sessionDropdownOpen}
            onToggle={() => setSessionDropdownOpen(!sessionDropdownOpen)}
            loading={sessionsLoading}
            selectedLabel={selectedSessionItem?.name}
            query={sessionQuery}
            setQuery={setSessionQuery}
            options={mappedSessions}
            emptyMessage="No classes found for this date."
            onSelect={(item) => {
              setSessionId(item.id);
              setSessionQuery("");
            }}
          />

          <Button 
            onClick={handleLoadStudents} 
            disabled={!sessionId || studentsLoading}
            className="min-w-[150px]"
          >
            {studentsLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Load Students
          </Button>
        </div>
      </Card>

      {students.length > 0 && (
        <Card className="overflow-hidden border border-border/50 shadow-sm">
          <div className="p-4 border-b border-border/50 bg-muted/20 flex justify-between items-center">
            <h3 className="font-semibold text-lg">Student List</h3>
            <span className="text-sm text-muted-foreground">
              {Object.values(selectedStudents).filter(Boolean).length} / {students.length} Present
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="text-xs uppercase bg-muted/40">
                <tr>
                  <th className="px-6 py-4 border-b font-medium text-left">Student Name</th>
                  <th className="px-6 py-4 border-b font-medium text-center">Index Number</th>
                  <th className="px-6 py-4 border-b font-medium text-center">Payment Status</th>
                  <th className="px-6 py-4 border-b">
                    <div className="flex items-center justify-center gap-2">
                      <Checkbox 
                        id="selectAll"
                        checked={students.length > 0 && students.every(s => selectedStudents[s.studentId] === true)}
                        onCheckedChange={(checked) => handleMarkAll(checked as boolean)}
                      />
                      <label htmlFor="selectAll" className="cursor-pointer font-medium text-sm">Mark All Present</label>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const isChecked = selectedStudents[student.studentId] || false;
                  return (
                    <tr 
                      key={student.studentId} 
                      className="border-b hover:bg-muted/10 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium">{student.studentName}</td>
                      <td className="px-6 py-4 text-center font-mono text-sm text-muted-foreground">{student.indexNumber || 'N/A'}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          student.feeStatus === 'PAID' 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' 
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300'
                        }`}>
                          {student.feeStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 w-40 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Checkbox 
                            checked={selectedStudents[student.studentId] === true}
                            onCheckedChange={(checked) => handleCheckboxChange(student.studentId, checked as boolean)}
                          />
                          <span className={`text-xs font-medium ${
                            selectedStudents[student.studentId] === true ? 'text-emerald-600 dark:text-emerald-400' : 
                            selectedStudents[student.studentId] === false ? 'text-rose-600 dark:text-rose-400' : 
                            'text-muted-foreground'
                          }`}>
                            {selectedStudents[student.studentId] === true ? 'Present' : 
                             selectedStudents[student.studentId] === false ? 'Absent' : 
                             'Unmarked'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-muted/10 flex justify-end">
            <Button onClick={handleSubmit} disabled={submitting} className="min-w-[200px]">
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Attendance"
              )}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
