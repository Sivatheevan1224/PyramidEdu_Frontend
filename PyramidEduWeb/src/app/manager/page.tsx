"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  CreditCard,
  CalendarCheck,
  TrendingUp,
  Megaphone,
  UserPlus,
  CheckSquare,
  QrCode,
  Loader2,
  BookOpen,
  GraduationCap,
  AlertCircle,
  FileText,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import {
  LineChart,
  Line,
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
} from "recharts";
import Link from "next/link";
import { api } from "@/lib/api";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

export default function ManagerDashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [payments, setPayments] = useState<any>(null);
  const [attendance, setAttendance] = useState<any>(null);
  const [studentStats, setStudentStats] = useState<any>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [summaryRes, paymentsRes, attendanceRes, studentRes, subjectsRes] = await Promise.all([
        api.get("/analytics/dashboard"),
        api.get("/analytics/payments"),
        api.get("/analytics/attendance"),
        api.get("/analytics/students"),
        api.get("/analytics/subjects"),
      ]);

      if (summaryRes.data.success) setSummary(summaryRes.data.data);
      if (paymentsRes.data.success) setPayments(paymentsRes.data.data);
      if (attendanceRes.data.success) setAttendance(attendanceRes.data.data);
      if (studentRes.data.success) setStudentStats(studentRes.data.data);
      if (subjectsRes.data.success) setSubjects(subjectsRes.data.data);
    } catch (err) {
      console.error("Failed to fetch manager dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <p className="text-sm text-muted-foreground font-medium">Loading manager dashboard & financial sums…</p>
      </div>
    );
  }

  // Format fee collections for chart matching structure { m, paid }
  const collectionData =
    payments?.collectionTrend?.map((item: any) => ({
      m: item.month.split(" ")[0],
      paid: item.income,
    })) || [];

  // Financial sums calculations
  const totalCollected = Number(summary?.totalPayments || 0);
  const totalPending = Number(summary?.pendingPayments || 0);
  const grossExpected = totalCollected + totalPending;
  const collectionRatio = grossExpected > 0 ? ((totalCollected / grossExpected) * 100).toFixed(1) : "100.0";

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400">
            Manager Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time aggregate sums, academic KPIs, attendance monitoring, and reports overview.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchDashboardData}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-border bg-card hover:bg-muted text-foreground transition-all shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
            Reload Data
          </button>
          <Link
            href="/manager/reports"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition-all"
          >
            <FileText className="w-4 h-4" />
            Reports Hub
          </Link>
        </div>
      </div>

      {/* Primary KPI Cards - Colorful gradient designs with complete sums */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Active Students */}
        <div className="relative overflow-hidden p-5 rounded-2xl border border-blue-500/15 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 shadow-xs flex justify-between items-center group hover:border-blue-500/40 transition-all duration-300">
          <div className="space-y-1">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
              Active Students
            </span>
            <p className="text-3xl font-black text-foreground">{summary?.activeStudents ?? 0}</p>
            <span className="text-[11px] text-muted-foreground block">
              Total registered: <span className="font-semibold text-foreground">{summary?.totalStudents ?? 0}</span>
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-blue-600 text-white shadow-md group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Collections Total Sum */}
        <div className="relative overflow-hidden p-5 rounded-2xl border border-emerald-500/15 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 shadow-xs flex justify-between items-center group hover:border-emerald-500/40 transition-all duration-300">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
              Total Income Sum
            </span>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              LKR {totalCollected.toLocaleString()}
            </p>
            <span className="text-[11px] text-muted-foreground block">
              Collection rate: <span className="font-semibold text-emerald-600">{collectionRatio}%</span>
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-600 text-white shadow-md group-hover:scale-105 transition-transform">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        {/* Outstanding Pending Sum */}
        <div className="relative overflow-hidden p-5 rounded-2xl border border-amber-500/15 bg-gradient-to-br from-amber-500/5 to-orange-500/5 shadow-xs flex justify-between items-center group hover:border-amber-500/40 transition-all duration-300">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
              Pending Fees Sum
            </span>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400">
              LKR {totalPending.toLocaleString()}
            </p>
            <span className="text-[11px] text-muted-foreground block">
              Unsettled fee balances
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-500 text-white shadow-md group-hover:scale-105 transition-transform">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Avg Attendance */}
        <div className="relative overflow-hidden p-5 rounded-2xl border border-purple-500/15 bg-gradient-to-br from-purple-500/5 to-violet-500/5 shadow-xs flex justify-between items-center group hover:border-purple-500/40 transition-all duration-300">
          <div className="space-y-1">
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
              Avg Attendance
            </span>
            <p className="text-3xl font-black text-foreground">{summary?.avgAttendance ?? 0}%</p>
            <span className="text-[11px] text-muted-foreground block">
              Overall student presence
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-purple-600 text-white shadow-md group-hover:scale-105 transition-transform">
            <CalendarCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Secondary Metrics Bar: Additional Sums and System Counts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-border bg-card shadow-xs rounded-2xl flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold">Active Teachers</p>
            <p className="text-lg font-black text-foreground">{summary?.totalTeachers ?? 0}</p>
          </div>
        </Card>

        <Card className="p-4 border-border bg-card shadow-xs rounded-2xl flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold">Curriculum Subjects</p>
            <p className="text-lg font-black text-foreground">{summary?.totalSubjects ?? subjects.length ?? 0}</p>
          </div>
        </Card>

        <Card className="p-4 border-border bg-card shadow-xs rounded-2xl flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold">Overall Pass Rate</p>
            <p className="text-lg font-black text-foreground">{summary?.passRate ?? 0}%</p>
          </div>
        </Card>

        <Card className="p-4 border-border bg-card shadow-xs rounded-2xl flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold">Exam Avg Score</p>
            <p className="text-lg font-black text-foreground">{summary?.avgMarks ?? 0}%</p>
          </div>
        </Card>
      </div>

      {/* Reports Quick Access Bar */}
      <Card className="p-5 border-border bg-gradient-to-r from-card via-muted/30 to-card shadow-xs rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
              Management Reports & Analyses
            </h3>
          </div>
          <Link
            href="/manager/reports"
            className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
          >
            Explore all reports <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { title: "Parent Reports", to: "/manager/parent-reports", color: "hover:border-emerald-500/40" },
            { title: "Analytics", to: "/manager/analytics-reports", color: "hover:border-blue-500/40" },
            { title: "Financial", to: "/manager/financial-reports", color: "hover:border-amber-500/40" },
            { title: "Attendance", to: "/manager/attendance-reports", color: "hover:border-purple-500/40" },
            { title: "Performance", to: "/manager/performance-reports", color: "hover:border-rose-500/40" },
            { title: "AI Predict", to: "/manager/ai-reports", color: "hover:border-indigo-500/40" },
          ].map((item, idx) => (
            <Link
              key={idx}
              href={item.to}
              className={`p-3 rounded-xl border border-border bg-background hover:bg-muted/40 text-center transition-all ${item.color} shadow-2xs group`}
            >
              <p className="text-xs font-bold text-foreground group-hover:text-emerald-600 transition-colors">
                {item.title}
              </p>
              <span className="text-[10px] text-muted-foreground flex items-center justify-center gap-0.5 mt-0.5">
                View sheet <ArrowUpRight className="w-2.5 h-2.5" />
              </span>
            </Link>
          ))}
        </div>
      </Card>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Fees stack chart */}
        <Card className="p-5 lg:col-span-2 border-border shadow-xs rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-foreground">Fee Collection Trends</h3>
              <p className="text-xs text-muted-foreground">Monthly verified fee income in LKR</p>
            </div>
            <Link
              href="/manager/financial-reports"
              className="text-xs font-semibold text-emerald-600 hover:underline"
            >
              Detailed Breakdown →
            </Link>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={collectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip />
                <Bar dataKey="paid" name="Paid (LKR)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Predictions Doughnut Chart */}
        <Card className="p-5 border-border shadow-xs rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-base text-foreground">Student Standing Levels</h3>
              <Link href="/manager/ai-reports" className="text-xs font-semibold text-indigo-600 hover:underline">
                AI View →
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Model predicted performance tiers</p>
          </div>
          <div className="h-64 flex items-center justify-center">
            {studentStats?.performanceLevels?.length === 0 ? (
              <p className="text-xs text-muted-foreground">No prediction records available</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={studentStats?.performanceLevels || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="count"
                    nameKey="level"
                  >
                    {(studentStats?.performanceLevels || []).map((entry: any, index: number) => (
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

      {/* Attendance line chart */}
      <Card className="p-5 border-border shadow-xs rounded-2xl">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-bold text-base text-foreground">Attendance Daily Tracking</h3>
            <p className="text-xs text-muted-foreground">Average daily attendance rate percentage</p>
          </div>
          <Link href="/manager/attendance-reports" className="text-xs font-semibold text-purple-600 hover:underline">
            Attendance Report →
          </Link>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={attendance?.dailyTrend || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} domain={[0, 100]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="percentage"
                name="Attendance Rate (%)"
                stroke="#8b5cf6"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Searchable Student Standings / Warnings list */}
      <Card className="p-5 border-border shadow-xs rounded-2xl">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-base text-foreground">Attention Required: At-Risk Students</h3>
          <Link href="/manager/performance-reports" className="text-xs font-semibold text-rose-600 hover:underline">
            All Performance →
          </Link>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Students currently predicted at warning levels based on average academic results
        </p>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase text-muted-foreground bg-muted/20">
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Index Number</th>
                <th className="px-4 py-3 text-right">Avg Score</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {studentStats?.lowStudents?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-muted-foreground">
                    All students meet requirements. No critical warnings.
                  </td>
                </tr>
              ) : (
                studentStats?.lowStudents?.map((r: any, idx: number) => (
                  <tr key={idx} className="border-b last:border-0 hover:bg-muted/10">
                    <td className="px-4 py-3 font-semibold text-foreground">{r.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.indexNumber}</td>
                    <td className="px-4 py-3 text-right font-bold text-red-600">{r.avgScore}%</td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-600 border border-red-500/20">
                        At Risk
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recently Joined Directory */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {/* Students */}
        <Card className="p-4 border border-border bg-card shadow-xs rounded-2xl">
          <h4 className="font-bold text-xs text-blue-600 dark:text-blue-400 uppercase tracking-widest border-b border-border pb-2 mb-3">
            Recently Joined Students
          </h4>
          {summary?.recentStudents?.length === 0 ? (
            <p className="text-xs text-muted-foreground py-2">No new students</p>
          ) : (
            <ul className="space-y-2">
              {summary?.recentStudents?.slice(0, 4).map((s: any, idx: number) => (
                <li
                  key={idx}
                  className="flex justify-between items-center text-xs border-b border-border/20 pb-2 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-bold text-foreground">{s.name}</p>
                    <p className="text-[10px] text-muted-foreground">{s.email}</p>
                  </div>
                  <span className="text-[10px] bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded-full font-bold">
                    {s.indexNumber}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Teachers */}
        <Card className="p-4 border border-border bg-card shadow-xs rounded-2xl">
          <h4 className="font-bold text-xs text-purple-600 dark:text-purple-400 uppercase tracking-widest border-b border-border pb-2 mb-3">
            Recently Joined Teachers
          </h4>
          {summary?.recentTeachers?.length === 0 ? (
            <p className="text-xs text-muted-foreground py-2">No new teachers</p>
          ) : (
            <ul className="space-y-2">
              {summary?.recentTeachers?.slice(0, 4).map((t: any, idx: number) => (
                <li
                  key={idx}
                  className="flex flex-col text-xs border-b border-border/20 pb-2 last:border-0 last:pb-0"
                >
                  <p className="font-bold text-foreground">{t.name}</p>
                  <p className="text-[10px] text-muted-foreground">{t.email}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Support Staff */}
        <Card className="p-4 border border-border bg-card shadow-xs rounded-2xl">
          <h4 className="font-bold text-xs text-rose-600 dark:text-rose-400 uppercase tracking-widest border-b border-border pb-2 mb-3">
            Recently Joined Support Staff
          </h4>
          {summary?.recentSupportStaff?.length === 0 ? (
            <p className="text-xs text-muted-foreground py-2">No new staff</p>
          ) : (
            <ul className="space-y-2">
              {summary?.recentSupportStaff?.slice(0, 4).map((st: any, idx: number) => (
                <li
                  key={idx}
                  className="flex justify-between items-center text-xs border-b border-border/20 pb-2 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-bold text-foreground">{st.name}</p>
                    <p className="text-[10px] text-muted-foreground">{st.code}</p>
                  </div>
                  <span className="text-[10px] bg-rose-500/10 text-rose-600 px-2 py-0.5 rounded-full font-bold">
                    {st.position}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
