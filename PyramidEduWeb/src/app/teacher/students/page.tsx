"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchMyStudents, TeacherStudent } from "@/modules/Teacher/Students/services/teacherStudents.api";
import TeacherStudentDetailsModal from "@/modules/Teacher/Students/components/TeacherStudentDetailsModal";

export default function Page() {
  const [students, setStudents] = useState<TeacherStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search and Pagination States
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  // Modal State
  const [viewStudentId, setViewStudentId] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on search
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  // Load students
  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchMyStudents({
        page,
        limit,
        search: debouncedSearch || undefined,
      });
      setStudents(res.data);
      setTotal(res.pagination.total);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load students.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [page, limit, debouncedSearch]);

  // Derived stats
  const totalStudents = total;
  const avgAttendance = students.length > 0 
    ? Math.round(students.reduce((acc, curr) => acc + curr.attendancePercentage, 0) / students.length)
    : 0;

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Students Assigned" value={totalStudents.toString()} />
        <StatCard label="Avg Student Attendance" value={`${avgAttendance}%`} />
        <StatCard label="Active Status" value={students.filter(s => s.isActive).length.toString()} />
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-white/10 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <Button onClick={loadStudents} variant="outline" className="w-full sm:w-auto">
          Reload Data
        </Button>
      </div>

      {/* Table Card */}
      <Card className="overflow-hidden border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm bg-white dark:bg-slate-900">
        <div className="p-5 border-b border-slate-200 dark:border-white/10">
          <h3 className="font-bold text-foreground">Students List</h3>
          <p className="text-xs text-muted-foreground">List of all active students assigned to your classes</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-rose-500 font-semibold">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-white/10">
                <tr>
                  <th className="px-6 py-4 font-semibold">Student</th>
                  <th className="px-6 py-4 font-semibold">Index Number</th>
                  <th className="px-6 py-4 font-semibold">Class/Batch</th>
                  <th className="px-6 py-4 font-semibold">Subjects Enrolled</th>
                  <th className="px-6 py-4 font-semibold text-center">Attendance</th>
                  <th className="px-6 py-4 font-semibold text-center">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold overflow-hidden">
                          {student.profileImage ? (
                            <img src={student.profileImage} alt={student.fullName} className="h-full w-full object-cover" />
                          ) : (
                            student.fullName.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{student.fullName}</p>
                          <p className="text-xs text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                      {student.indexNumber || "Pending"}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{student.batch}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {student.subjects.map((sub, idx) => (
                          <span key={idx} className="bg-primary/5 text-primary text-[10px] px-2 py-0.5 rounded-md font-semibold border border-primary/10">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-foreground">
                      <span className={`inline-block font-semibold px-2 py-0.5 rounded ${
                        student.attendancePercentage >= 90 ? 'text-emerald-600 dark:text-emerald-400' :
                        student.attendancePercentage >= 75 ? 'text-amber-600 dark:text-amber-400' :
                        'text-rose-600 dark:text-rose-400'
                      }`}>
                        {student.attendancePercentage}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        student.isActive 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400' 
                          : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {student.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewStudentId(student.id)}
                        className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10 rounded-full"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/20">
            <span className="text-xs text-muted-foreground">
              Page {page} of {totalPages} ({total} total students)
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Details Modal */}
      {viewStudentId && (
        <TeacherStudentDetailsModal
          studentId={viewStudentId}
          onClose={() => setViewStudentId(null)}
        />
      )}
    </div>
  );
}
