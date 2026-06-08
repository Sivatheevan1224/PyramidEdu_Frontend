"use client";

import { useEffect, useState, use } from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2 } from "lucide-react";

interface SubjectInfo {
  subjectName: string;
  teacherName: string;
}

interface StudentInfo {
  studentName: string;
  indexNumber: string;
  subjects: SubjectInfo[];
}

interface AttendanceRecord {
  id: string;
  date: string;
  time: string;
  subject: string;
  teacher: string;
  status: string;
  method: string;
}

export default function ManagerStudentDetails({ params }: { params: Promise<{ studentId: string }> }) {
  const unwrappedParams = use(params) as { studentId: string };
  const studentId = unwrappedParams.studentId;

  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  
  const router = useRouter();

  const fetchDetails = async () => {
    setLoading(true);
    try {
      // Build query string
      const q = new URLSearchParams();
      if (fromDate) q.append("fromDate", fromDate);
      if (toDate) q.append("toDate", toDate);
      // We'll skip subjectId backend filter for now to avoid complexity of fetching subject lists, and just do it frontend if needed, OR we just use date filter on backend.
      
      const res = await api.get(`/attendance/manager/student/${studentId}?${q.toString()}`);
      setStudentInfo(res.data.data.studentInfo);
      setAttendances(res.data.data.attendances);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [studentId]);

  const handleApplyFilters = () => {
    fetchDetails();
  };
  
  const clearFilters = () => {
    setFromDate("");
    setToDate("");
    // re-fetch will happen if we call fetchDetails, but wait, state updates are async
    setTimeout(() => {
      fetchDetails();
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">Student Attendance Details</h2>
      </div>

      {loading && !studentInfo ? (
        <div className="py-8 text-center text-sm text-muted-foreground">Loading...</div>
      ) : (
        <>
          {studentInfo && (
            <Card className="p-5">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Student Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Name:</span> {studentInfo.studentName}</p>
                    <p><span className="font-medium">Index Number:</span> {studentInfo.indexNumber}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Selected Subjects</h3>
                  {studentInfo.subjects.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No subjects enrolled.</p>
                  ) : (
                    <ul className="text-sm list-disc list-inside space-y-1">
                      {studentInfo.subjects.map((sub, i) => (
                        <li key={i}>{sub.subjectName} (Teacher: {sub.teacherName})</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </Card>
          )}

          <Card className="p-5">
            <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
              <div className="flex-1">
                <label className="text-xs font-medium mb-1 block">From Date</label>
                <Input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
              </div>
              <div className="flex-1">
                <label className="text-xs font-medium mb-1 block">To Date</label>
                <Input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleApplyFilters} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={clearFilters} disabled={loading}>
                  Clear
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b text-xs uppercase text-muted-foreground bg-muted/50">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Time</th>
                    <th className="px-4 py-3">Subject</th>
                    <th className="px-4 py-3">Teacher</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Method</th>
                  </tr>
                </thead>
                <tbody>
                  {attendances.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground">No attendance records found.</td>
                    </tr>
                  ) : (
                    attendances.map((record) => (
                      <tr key={record.id} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">{record.date}</td>
                        <td className="px-4 py-3">{record.time}</td>
                        <td className="px-4 py-3">{record.subject}</td>
                        <td className="px-4 py-3">{record.teacher}</td>
                        <td className="px-4 py-3 font-medium">
                          <span className={record.status === 'PRESENT' ? 'text-green-600' : 'text-red-600'}>
                            {record.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{record.method}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
