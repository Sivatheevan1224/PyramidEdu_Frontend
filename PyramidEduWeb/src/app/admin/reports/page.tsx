"use client";

import React, { useState, useEffect } from "react";
import { api, getApiBaseUrl, getAccessToken } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  FileText,
  CreditCard,
  TrendingUp,
  Brain,
  Award,
  Clock,
  Printer,
  ChevronLeft,
  Download,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Play,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const COLORS = ["#6366f1", "#3b82f6", "#10b981", "#ef4444"];

export default function AdminAnalyticsReportsPage() {
  // Filters
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedStream, setSelectedStream] = useState<string>("");
  const [selectedBatch, setSelectedBatch] = useState<string>("");

  // Data State
  const [summary, setSummary] = useState<any>(null);
  const [studentData, setStudentData] = useState<any>(null);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any>(null);
  const [payments, setPayments] = useState<any>(null);
  const [exams, setExams] = useState<any[]>([]);
  const [performance, setPerformance] = useState<any>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [searchStudent, setSearchStudent] = useState<string>("");
  const [searchTeacher, setSearchTeacher] = useState<string>("");

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const params = {
        month: selectedMonth,
        year: selectedYear,
        streamId: selectedStream || undefined,
        batchId: selectedBatch || undefined,
      };

      const [
        summaryRes,
        studentRes,
        teachersRes,
        subjectsRes,
        attendanceRes,
        examsRes,
        performanceRes,
        paymentsRes,
      ] = await Promise.all([
        api.get("/analytics/dashboard", { params }),
        api.get("/analytics/students", { params }),
        api.get("/analytics/teachers"),
        api.get("/analytics/subjects"),
        api.get("/analytics/attendance", { params }),
        api.get("/analytics/exams", { params }),
        api.get("/analytics/performance"),
        api.get("/analytics/payments", { params }),
      ]);

      if (summaryRes.data.success) setSummary(summaryRes.data.data);
      if (studentRes.data.success) setStudentData(studentRes.data.data);
      if (teachersRes.data.success) setTeachers(teachersRes.data.data);
      if (subjectsRes.data.success) setSubjects(subjectsRes.data.data);
      if (attendanceRes.data.success) setAttendance(attendanceRes.data.data);
      if (examsRes.data.success) setExams(examsRes.data.data);
      if (performanceRes.data.success) setPerformance(performanceRes.data.data);
      if (paymentsRes.data.success) setPayments(paymentsRes.data.data);

    } catch (error) {
      console.error("Failed to load admin analytics reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedMonth, selectedYear, selectedStream, selectedBatch]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = (type: string) => {
    window.open(`${getApiBaseUrl()}/analytics/export/csv?type=${type}&token=${getAccessToken() || ''}`, '_blank');
  };

  // Filter lists
  const filteredTopStudents = studentData?.topStudents?.filter((s: any) =>
    s.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
    s.indexNumber.toLowerCase().includes(searchStudent.toLowerCase())
  ) || [];

  const filteredTeachers = teachers.filter((t: any) =>
    t.name.toLowerCase().includes(searchTeacher.toLowerCase())
  );

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto min-h-screen">
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-admin-analytics, #printable-admin-analytics * {
            visibility: visible;
          }
          #printable-admin-analytics {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            box-shadow: none;
            border: none;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Admin System Reports</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive system analytics, student grading patterns, and finance tracking.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold hover:bg-muted text-foreground transition-all"
          >
            <Printer className="w-4 h-4" /> Export Report (PDF)
          </button>
        </div>
      </div>

      {/* Filters (No-Print) */}
      <Card className="p-4 border-border bg-card shadow-sm flex flex-wrap items-center gap-4 no-print">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Filters:</span>
        </div>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="rounded-xl border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:ring-2 focus:ring-blue-500/20"
        >
          {monthNames.map((name, index) => (
            <option key={index + 1} value={index + 1}>
              {name}
            </option>
          ))}
        </select>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="rounded-xl border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:ring-2 focus:ring-blue-500/20"
        >
          {[2025, 2026, 2027].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <button
          onClick={fetchAnalytics}
          className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
        >
          <RefreshCw className="w-3 h-3" /> Reload Data
        </button>
      </Card>

      {/* Main Printable Area */}
      <div id="printable-admin-analytics" className="space-y-6">
        
        {/* KPI Summaries Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-5 border-border bg-card shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground font-semibold uppercase block">Active Students</span>
              <p className="text-2xl font-black text-foreground mt-0.5">{loading ? "..." : summary?.activeStudents ?? 0}</p>
            </div>
          </Card>

          <Card className="p-5 border-border bg-card shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground font-semibold uppercase block">Total Income</span>
              <p className="text-2xl font-black text-emerald-600 mt-0.5">
                {loading ? "..." : `LKR ${(summary?.totalPayments ?? 0).toLocaleString()}`}
              </p>
            </div>
          </Card>

          <Card className="p-5 border-border bg-card shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 text-purple-600 rounded-xl">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground font-semibold uppercase block">Avg Attendance</span>
              <p className="text-2xl font-black text-foreground mt-0.5">{loading ? "..." : `${summary?.avgAttendance ?? 0}%`}</p>
            </div>
          </Card>

          <Card className="p-5 border-border bg-card shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground font-semibold uppercase block">Overall Pass Rate</span>
              <p className="text-2xl font-black text-foreground mt-0.5">{loading ? "..." : `${summary?.passRate ?? 0}%`}</p>
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Monthly registrations */}
          <Card className="p-5 border-border bg-card shadow-sm">
            <h3 className="text-base font-bold text-foreground mb-4">Student Registrations Trend</h3>
            <div className="h-72">
              {loading ? (
                <div className="h-full bg-muted/20 animate-pulse rounded-xl"></div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={studentData?.registrationsTrend || []}>
                    <defs>
                      <linearGradient id="colorAdminReg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorAdminReg)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>

          {/* Income collection */}
          <Card className="p-5 border-border bg-card shadow-sm">
            <h3 className="text-base font-bold text-foreground mb-4">Monthly Income Collection (LKR)</h3>
            <div className="h-72">
              {loading ? (
                <div className="h-full bg-muted/20 animate-pulse rounded-xl"></div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={payments?.collectionTrend || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>

          {/* Attendance Trend */}
          <Card className="p-5 border-border bg-card shadow-sm">
            <h3 className="text-base font-bold text-foreground mb-4">Daily Attendance Trend (%)</h3>
            <div className="h-72">
              {loading ? (
                <div className="h-full bg-muted/20 animate-pulse rounded-xl"></div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={attendance?.dailyTrend || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="percentage" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>

          {/* Performance Preditions levels */}
          <Card className="p-5 border-border bg-card shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground mb-4">Student Standing Predictions</h3>
            </div>
            <div className="h-64 flex items-center justify-center">
              {loading ? (
                <div className="h-full w-full bg-muted/20 animate-pulse rounded-xl"></div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={studentData?.performanceLevels || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="level"
                    >
                      {(studentData?.performanceLevels || []).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        </div>

        {/* Searchable Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Top Students list */}
          <Card className="p-5 border-border bg-card shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h3 className="text-base font-bold text-foreground">Top Performing Students</h3>
              <button
                onClick={() => handleExportCsv("students")}
                className="no-print inline-flex items-center gap-1 text-xs font-semibold hover:underline text-blue-600"
              >
                <Download className="w-3.5 h-3.5" /> CSV
              </button>
            </div>
            <div className="relative mb-3 no-print">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search top students..."
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-border bg-background text-xs text-foreground outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-muted/40 text-muted-foreground border-b border-border font-bold">
                    <th className="px-4 py-3">Student Name</th>
                    <th className="px-4 py-3">Index Number</th>
                    <th className="px-4 py-3 text-right">Avg Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="text-center py-4">Loading top students...</td>
                    </tr>
                  ) : filteredTopStudents.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-4 text-muted-foreground">No students found.</td>
                    </tr>
                  ) : (
                    filteredTopStudents.map((s: any, idx: number) => (
                      <tr key={idx} className="hover:bg-muted/10">
                        <td className="px-4 py-3 font-semibold text-foreground">{s.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{s.indexNumber}</td>
                        <td className="px-4 py-3 text-right font-black text-emerald-600">{s.avgScore}%</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Subjects statistics */}
          <Card className="p-5 border-border bg-card shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h3 className="text-base font-bold text-foreground">Subject Average Performance</h3>
              <button
                onClick={() => handleExportCsv("subjects")}
                className="no-print inline-flex items-center gap-1 text-xs font-semibold hover:underline text-blue-600"
              >
                <Download className="w-3.5 h-3.5" /> CSV
              </button>
            </div>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-muted/40 text-muted-foreground border-b border-border font-bold">
                    <th className="px-4 py-3">Subject Name</th>
                    <th className="px-4 py-3">Enrollments</th>
                    <th className="px-4 py-3">Avg Marks</th>
                    <th className="px-4 py-3 text-right">Pass Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="text-center py-4">Loading subject averages...</td>
                    </tr>
                  ) : subjects.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-4 text-muted-foreground">No subjects active.</td>
                    </tr>
                  ) : (
                    subjects.map((sub: any, idx: number) => (
                      <tr key={idx} className="hover:bg-muted/10">
                        <td className="px-4 py-3 font-semibold text-foreground">{sub.name} ({sub.code})</td>
                        <td className="px-4 py-3 text-muted-foreground">{sub.students} enrolled</td>
                        <td className="px-4 py-3 font-bold text-foreground">{sub.avgMarks}%</td>
                        <td className="px-4 py-3 text-right font-black text-blue-600">{sub.passRate}%</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Teachers workload list */}
          <Card className="p-5 border-border bg-card shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h3 className="text-base font-bold text-foreground">Teacher Workload Statistics</h3>
              <button
                onClick={() => handleExportCsv("teachers")}
                className="no-print inline-flex items-center gap-1 text-xs font-semibold hover:underline text-blue-600"
              >
                <Download className="w-3.5 h-3.5" /> CSV
              </button>
            </div>
            <div className="relative mb-3 no-print">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search teachers..."
                value={searchTeacher}
                onChange={(e) => setSearchTeacher(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-border bg-background text-xs text-foreground outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-muted/40 text-muted-foreground border-b border-border font-bold">
                    <th className="px-4 py-3">Teacher</th>
                    <th className="px-4 py-3">Allocated Subjects</th>
                    <th className="px-4 py-3">Students handled</th>
                    <th className="px-4 py-3 text-right">Student Avg</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="text-center py-4">Loading teacher statistics...</td>
                    </tr>
                  ) : filteredTeachers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-4 text-muted-foreground">No teachers registered.</td>
                    </tr>
                  ) : (
                    filteredTeachers.map((t: any, idx: number) => (
                      <tr key={idx} className="hover:bg-muted/10">
                        <td className="px-4 py-3 font-semibold text-foreground">
                          <div>
                            <p className="font-bold">{t.name}</p>
                            <p className="text-[10px] text-muted-foreground">{t.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground max-w-[150px] truncate">{t.subjects}</td>
                        <td className="px-4 py-3 text-muted-foreground">{t.studentCount} students</td>
                        <td className="px-4 py-3 text-right font-bold text-indigo-600">{t.avgStudentScore}%</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Payments Outstanding list */}
          <Card className="p-5 border-border bg-card shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h3 className="text-base font-bold text-foreground">Outstanding Fee Balances</h3>
              <button
                onClick={() => handleExportCsv("payments")}
                className="no-print inline-flex items-center gap-1 text-xs font-semibold hover:underline text-blue-600"
              >
                <Download className="w-3.5 h-3.5" /> CSV
              </button>
            </div>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-muted/40 text-muted-foreground border-b border-border font-bold">
                    <th className="px-4 py-3">Student Name</th>
                    <th className="px-4 py-3">Index Number</th>
                    <th className="px-4 py-3 text-right">Balance Due</th>
                    <th className="px-4 py-3 text-right">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="text-center py-4">Loading balance fees...</td>
                    </tr>
                  ) : payments?.outstandingInvoices?.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-4 text-muted-foreground">No outstanding invoices.</td>
                    </tr>
                  ) : (
                    payments?.outstandingInvoices?.map((i: any, idx: number) => (
                      <tr key={idx} className="hover:bg-muted/10">
                        <td className="px-4 py-3 font-semibold text-foreground">{i.studentName}</td>
                        <td className="px-4 py-3 text-muted-foreground">{i.indexNumber}</td>
                        <td className="px-4 py-3 text-right font-black text-red-600">LKR {Number(i.amountDue).toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-muted-foreground">
                          {i.dueDate ? new Date(i.dueDate).toLocaleDateString() : '—'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
