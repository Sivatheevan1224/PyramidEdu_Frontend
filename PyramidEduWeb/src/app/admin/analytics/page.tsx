"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Users,
  CreditCard,
  CalendarCheck,
  Building2,
  Award,
  ShieldCheck,
  RefreshCw,
  Download,
  Printer,
  Search,
  TrendingUp,
  BookOpen,
  GraduationCap,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Wallet,
  BarChart3,
  Layers,
  Sparkles,
  SlidersHorizontal,
  FileSpreadsheet,
  Clock,
  UserCheck,
  HelpCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { api, getApiBaseUrl, getAccessToken } from "@/lib/api";
import { useAcademicData } from "@/modules/Student/Register/hooks";

// Color palettes for Recharts
const BRAND_COLORS = ["#10b981", "#6366f1", "#f59e0b", "#3b82f6", "#ec4899", "#8b5cf6"];
const PERFORMANCE_COLORS: Record<string, string> = {
  EXCELLENT: "#10b981",
  GOOD: "#3b82f6",
  AVERAGE: "#f59e0b",
  AT_RISK: "#ef4444",
};

type TabType = "overview" | "financials" | "academics" | "faculty" | "attendance";

export default function AdminAnalyticsPage() {
  // Academic metadata
  const { streams, batches } = useAcademicData();

  // Filters
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<string>("all"); // "all" or "1".."12"
  const [selectedStream, setSelectedStream] = useState<string>("");
  const [selectedBatch, setSelectedBatch] = useState<string>("");

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Data states
  const [summary, setSummary] = useState<any>(null);
  const [students, setStudents] = useState<any>(null);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any>(null);
  const [exams, setExams] = useState<any[]>([]);
  const [performance, setPerformance] = useState<any>(null);
  const [payments, setPayments] = useState<any>(null);
  const [salaryAnalytics, setSalaryAnalytics] = useState<any>(null);

  // Status & local search states
  const [loading, setLoading] = useState<boolean>(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>("");
  const [searchTeacher, setSearchTeacher] = useState<string>("");
  const [searchInvoice, setSearchInvoice] = useState<string>("");
  const [searchStudent, setSearchStudent] = useState<string>("");

  // Build filter query params
  const filterParams = useMemo(() => {
    const params: Record<string, any> = {
      year: selectedYear,
    };
    if (selectedMonth !== "all") {
      params.month = Number(selectedMonth);
    }
    if (selectedStream) {
      params.streamId = selectedStream;
    }
    if (selectedBatch) {
      params.batchId = selectedBatch;
    }
    return params;
  }, [selectedYear, selectedMonth, selectedStream, selectedBatch]);

  // Fetch all analytics datasets concurrently using allSettled for rock-solid resilience
  const fetchAllAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        api.get("/analytics/dashboard", { params: filterParams }),
        api.get("/analytics/students", { params: filterParams }),
        api.get("/analytics/teachers"),
        api.get("/analytics/subjects"),
        api.get("/analytics/attendance", { params: filterParams }),
        api.get("/analytics/exams", { params: filterParams }),
        api.get("/analytics/performance"),
        api.get("/analytics/payments", { params: filterParams }),
        api.get("/salary/analytics"),
      ]);

      const [
        summaryRes,
        studentsRes,
        teachersRes,
        subjectsRes,
        attendanceRes,
        examsRes,
        performanceRes,
        paymentsRes,
        salaryRes,
      ] = results;

      if (summaryRes.status === "fulfilled" && summaryRes.value.data?.data) {
        setSummary(summaryRes.value.data.data);
      }
      if (studentsRes.status === "fulfilled" && studentsRes.value.data?.data) {
        setStudents(studentsRes.value.data.data);
      }
      if (teachersRes.status === "fulfilled" && teachersRes.value.data?.data) {
        setTeachers(teachersRes.value.data.data);
      }
      if (subjectsRes.status === "fulfilled" && subjectsRes.value.data?.data) {
        setSubjects(subjectsRes.value.data.data);
      }
      if (attendanceRes.status === "fulfilled" && attendanceRes.value.data?.data) {
        setAttendance(attendanceRes.value.data.data);
      }
      if (examsRes.status === "fulfilled" && examsRes.value.data?.data) {
        setExams(examsRes.value.data.data);
      }
      if (performanceRes.status === "fulfilled" && performanceRes.value.data?.data) {
        setPerformance(performanceRes.value.data.data);
      }
      if (paymentsRes.status === "fulfilled" && paymentsRes.value.data?.data) {
        setPayments(paymentsRes.value.data.data);
      }
      if (salaryRes.status === "fulfilled" && salaryRes.value.data?.data) {
        setSalaryAnalytics(salaryRes.value.data.data);
      }

      setLastRefreshed(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    } catch (err) {
      console.error("Failed to load analytics datasets:", err);
    } finally {
      setLoading(false);
    }
  }, [filterParams]);

  useEffect(() => {
    fetchAllAnalytics();
  }, [fetchAllAnalytics]);

  // Actions
  const handlePrint = () => {
    window.print();
  };

  const [exportingType, setExportingType] = useState<string | null>(null);

  const handleExportCsv = async (type: "students" | "payments" | "teachers" | "subjects") => {
    try {
      setExportingType(type);
      toast.info(`Preparing ${type} report...`);

      const response = await api.get("/analytics/export/csv", {
        params: { type },
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${type}-report.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} CSV downloaded successfully.`);
    } catch (err: any) {
      console.error("Export CSV failed:", err);
      toast.error(err?.response?.data?.message || `Failed to download ${type} CSV.`);
    } finally {
      setExportingType(null);
    }
  };

  const resetFilters = () => {
    setSelectedYear(currentYear);
    setSelectedMonth("all");
    setSelectedStream("");
    setSelectedBatch("");
  };

  // Derived metrics
  const totalStudents = summary?.activeStudents ?? summary?.totalStudents ?? 0;
  const registeredStudents = summary?.totalStudents ?? totalStudents;
  const totalFeeRevenue = payments?.totalPayments ?? summary?.totalPayments ?? 0;
  const pendingFees = summary?.pendingPayments ?? 0;
  const avgAttendance = attendance?.averagePercentage ?? summary?.avgAttendance ?? 0;
  const totalTeachers = summary?.totalTeachers ?? teachers.length;
  const passRate = summary?.passRate ?? 0;
  const atRiskCount = summary?.atRiskStudents ?? 0;
  const excellentCount = summary?.excellentStudents ?? 0;

  // Monthly revenue collection trend
  const collectionTrend = useMemo(() => {
    if (!payments?.collectionTrend || !Array.isArray(payments.collectionTrend)) return [];
    return payments.collectionTrend.map((item: any) => ({
      month: item.month ? item.month.split(" ")[0] : item.m,
      revenue: Number(item.income ?? item.paid ?? item.amount ?? 0),
    }));
  }, [payments]);

  // Net Operational calculations (Revenue vs Salaries)
  const totalSalaryDisbursed = useMemo(() => {
    if (!salaryAnalytics?.overview) return 0;
    return (
      (salaryAnalytics.overview.totalTeacherSalaries || 0) +
      (salaryAnalytics.overview.totalManagerSalaries || 0) +
      (salaryAnalytics.overview.totalStaffSalaries || 0)
    );
  }, [salaryAnalytics]);

  const netOperationalMargin = totalFeeRevenue - totalSalaryDisbursed;

  // Batch Distribution
  const batchData = useMemo(() => {
    if (!students?.batchDistribution) return [];
    return students.batchDistribution.map((b: any) => ({
      batch: b.batchName || b.name || "Batch",
      students: b.studentCount ?? b.count ?? 0,
    }));
  }, [students]);

  // Gender demographics
  const genderData = useMemo(() => {
    if (!students?.genderDistribution) return [];
    return students.genderDistribution.map((g: any) => ({
      name: g.gender ? g.gender.charAt(0) + g.gender.slice(1).toLowerCase() : "Unknown",
      value: g.count || 0,
    }));
  }, [students]);

  // Filtered lists
  const filteredTeachers = useMemo(() => {
    if (!teachers) return [];
    return teachers.filter((t) =>
      (t.name || "").toLowerCase().includes(searchTeacher.toLowerCase()) ||
      (t.subjects || "").toLowerCase().includes(searchTeacher.toLowerCase())
    );
  }, [teachers, searchTeacher]);

  const filteredInvoices = useMemo(() => {
    const list = payments?.outstandingInvoices || [];
    if (!searchInvoice) return list;
    return list.filter(
      (inv: any) =>
        (inv.studentName || "").toLowerCase().includes(searchInvoice.toLowerCase()) ||
        (inv.indexNumber || "").toLowerCase().includes(searchInvoice.toLowerCase())
    );
  }, [payments, searchInvoice]);

  const filteredTopStudents = useMemo(() => {
    const list = students?.topStudents || [];
    if (!searchStudent) return list;
    return list.filter(
      (s: any) =>
        (s.name || "").toLowerCase().includes(searchStudent.toLowerCase()) ||
        (s.indexNumber || "").toLowerCase().includes(searchStudent.toLowerCase())
    );
  }, [students, searchStudent]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 print:p-0">
      {/* Print Specific CSS */}
      <style jsx global>{`
        @media print {
          nav, aside, header, .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .print-full-width {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>

      {/* 1. Header & Quick Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-border/60 pb-6 no-print">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              Analytics & Reports
            </h1>
            <Badge variant="outline" className="ml-2 font-mono text-xs border-emerald-500/30 text-emerald-600 bg-emerald-500/5">
              Live Intelligence
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Comprehensive institute reporting, fee collections, academic performance, and department analytics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {lastRefreshed && (
            <span className="text-xs text-muted-foreground hidden sm:inline-flex items-center gap-1 mr-2">
              <Clock className="w-3.5 h-3.5 text-muted-foreground/70" />
              Synced at {lastRefreshed}
            </span>
          )}

          <Button
            onClick={fetchAllAnalytics}
            variant="outline"
            size="sm"
            disabled={loading}
            className="rounded-xl font-semibold gap-2 border-border shadow-xs hover:bg-muted/40 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-emerald-500" : "text-muted-foreground"}`} />
            {loading ? "Refreshing..." : "Refresh"}
          </Button>

          {/* Export CSV options */}
          <div className="relative group">
            <Button
              variant="outline"
              size="sm"
              disabled={!!exportingType}
              className="rounded-xl font-semibold gap-2 border-border shadow-xs hover:bg-muted/40 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              {exportingType ? "Exporting..." : "Export Data"}
            </Button>
            <div className="absolute right-0 top-full mt-1.5 hidden group-hover:flex flex-col w-52 bg-card border border-border shadow-xl rounded-xl p-1 z-30">
              <button
                onClick={() => handleExportCsv("payments")}
                disabled={!!exportingType}
                className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-muted text-foreground transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>Fee Invoices CSV</span>
                {exportingType === "payments" ? (
                  <RefreshCw className="w-3 h-3 animate-spin text-emerald-600" />
                ) : (
                  <Download className="w-3 h-3 text-muted-foreground" />
                )}
              </button>
              <button
                onClick={() => handleExportCsv("students")}
                disabled={!!exportingType}
                className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-muted text-foreground transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>Top Students CSV</span>
                {exportingType === "students" ? (
                  <RefreshCw className="w-3 h-3 animate-spin text-emerald-600" />
                ) : (
                  <Download className="w-3 h-3 text-muted-foreground" />
                )}
              </button>
              <button
                onClick={() => handleExportCsv("teachers")}
                disabled={!!exportingType}
                className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-muted text-foreground transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>Faculty Workload CSV</span>
                {exportingType === "teachers" ? (
                  <RefreshCw className="w-3 h-3 animate-spin text-emerald-600" />
                ) : (
                  <Download className="w-3 h-3 text-muted-foreground" />
                )}
              </button>
              <button
                onClick={() => handleExportCsv("subjects")}
                disabled={!!exportingType}
                className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-muted text-foreground transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>Subjects Analysis CSV</span>
                {exportingType === "subjects" ? (
                  <RefreshCw className="w-3 h-3 animate-spin text-emerald-600" />
                ) : (
                  <Download className="w-3 h-3 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          <Button
            onClick={handlePrint}
            variant="outline"
            size="sm"
            className="rounded-xl font-semibold gap-2 border-border shadow-xs hover:bg-muted/40 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-muted-foreground" />
            Print Report
          </Button>
        </div>
      </div>

      {/* 2. Global Multi-Filter Bar */}
      <Card className="p-4 border border-border/80 bg-card/60 backdrop-blur-md rounded-2xl shadow-xs no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <SlidersHorizontal className="w-4 h-4 text-emerald-500" />
            Filter Data Scope
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 flex-1 max-w-3xl">
            {/* Year */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-3 py-1.5 rounded-xl border border-border bg-background text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {[currentYear + 1, currentYear, currentYear - 1, currentYear - 2].map((y) => (
                <option key={y} value={y}>
                  Year {y}
                </option>
              ))}
            </select>

            {/* Month */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-border bg-background text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">All Months</option>
              {[
                { id: "1", name: "Jan" },
                { id: "2", name: "Feb" },
                { id: "3", name: "Mar" },
                { id: "4", name: "Apr" },
                { id: "5", name: "May" },
                { id: "6", name: "Jun" },
                { id: "7", name: "Jul" },
                { id: "8", name: "Aug" },
                { id: "9", name: "Sep" },
                { id: "10", name: "Oct" },
                { id: "11", name: "Nov" },
                { id: "12", name: "Dec" },
              ].map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>

            {/* Stream */}
            <select
              value={selectedStream}
              onChange={(e) => setSelectedStream(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-border bg-background text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="">All Streams</option>
              {streams?.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name}
                </option>
              ))}
            </select>

            {/* Batch */}
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-border bg-background text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="">All Batches</option>
              {batches?.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {(selectedMonth !== "all" || selectedStream || selectedBatch || selectedYear !== currentYear) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-xs text-muted-foreground hover:text-foreground h-8 px-2.5 rounded-lg cursor-pointer"
            >
              Reset
            </Button>
          )}
        </div>
      </Card>

      {/* 3. Executive KPI Cards Ribbon */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {/* Active Students */}
        <Card className="p-4 border border-border/80 bg-card rounded-2xl shadow-xs relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Enrolled Students</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-foreground tracking-tight">
              {totalStudents.toLocaleString()}
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
              <span className="font-semibold text-emerald-600">{registeredStudents}</span> registered total
            </p>
          </div>
        </Card>

        {/* Fee Revenue */}
        <Card className="p-4 border border-border/80 bg-card rounded-2xl shadow-xs relative overflow-hidden group hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Verified Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-foreground tracking-tight">
              LKR {(totalFeeRevenue / 1000).toFixed(0)}k
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
              <span className="font-semibold text-amber-600">LKR {(pendingFees / 1000).toFixed(0)}k</span> pending
            </p>
          </div>
        </Card>

        {/* Avg Attendance */}
        <Card className="p-4 border border-border/80 bg-card rounded-2xl shadow-xs relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Institute Attendance</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-foreground tracking-tight">
              {avgAttendance}%
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Computed from session logs
            </p>
          </div>
        </Card>

        {/* Faculty & Staff */}
        <Card className="p-4 border border-border/80 bg-card rounded-2xl shadow-xs relative overflow-hidden group hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Faculty & Staff</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-foreground tracking-tight">
              {totalTeachers}
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Active assigned teachers
            </p>
          </div>
        </Card>

        {/* Pass Rate */}
        <Card className="p-4 border border-border/80 bg-card rounded-2xl shadow-xs relative overflow-hidden group hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Exam Pass Rate</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-foreground tracking-tight">
              {passRate}%
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Passing threshold &ge; 50%
            </p>
          </div>
        </Card>

        {/* Standing / At-Risk */}
        <Card className="p-4 border border-border/80 bg-card rounded-2xl shadow-xs relative overflow-hidden group hover:border-rose-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Academic Health</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-foreground tracking-tight">
              {excellentCount} <span className="text-xs font-bold text-emerald-600">Top</span>
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
              <span className="font-bold text-rose-600">{atRiskCount}</span> requiring attention
            </p>
          </div>
        </Card>
      </div>

      {/* 4. Tab Navigation */}
      <div className="border-b border-border/70 no-print">
        <div className="flex items-center gap-1 overflow-x-auto pb-px">
          {[
            { id: "overview", label: "Executive Overview", icon: Layers },
            { id: "financials", label: "Financials & Revenue", icon: Wallet },
            { id: "academics", label: "Academics & Exams", icon: Award },
            { id: "faculty", label: "Faculty & Subjects", icon: Building2 },
            { id: "attendance", label: "Attendance & Retention", icon: CalendarCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`relative flex items-center gap-2 px-4 py-3 text-sm font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "text-emerald-600 dark:text-emerald-400 border-emerald-500 bg-emerald-500/5 rounded-t-xl"
                    : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/30"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Tab Content Sections */}
      <AnimatePresence mode="wait">
        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Charts Row: Revenue Trend & Batch Distribution */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Fee Revenue Trend (2 cols) */}
              <Card className="p-6 border border-border bg-card rounded-2xl shadow-xs lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-foreground">Revenue Collection Trajectory</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Monthly verified student tuition fee collections (LKR)
                    </p>
                  </div>
                  <Badge variant="outline" className="font-semibold text-xs border-emerald-500/30 text-emerald-600 bg-emerald-50/50">
                    Real-time Collections
                  </Badge>
                </div>

                {collectionTrend.length > 0 ? (
                  <ResponsiveContainer width="100%" height={290}>
                    <AreaChart data={collectionTrend}>
                      <defs>
                        <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(val) => `LKR ${(val / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                          color: "hsl(var(--card-foreground))",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                        }}
                        formatter={(val: any) => [`LKR ${Number(val).toLocaleString()}`, "Collection"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#10b981"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#revenueGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="py-16 text-center border border-dashed rounded-xl border-border flex flex-col items-center justify-center gap-2">
                    <TrendingUp className="w-8 h-8 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">No verified fee collections found for the selected timeframe.</p>
                  </div>
                )}
              </Card>

              {/* Student Demographics (Gender & Stream Donut) */}
              <Card className="p-6 border border-border bg-card rounded-2xl shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base text-foreground">Student Gender Breakdown</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Demographics of enrolled student body</p>
                </div>

                {genderData.length > 0 ? (
                  <div className="my-auto py-2">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={genderData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={4}
                        >
                          {genderData.map((_: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={BRAND_COLORS[index % BRAND_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: 12,
                            backgroundColor: "hsl(var(--card))",
                            borderColor: "hsl(var(--border))",
                            color: "hsl(var(--card-foreground))",
                          }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="py-12 text-center border border-dashed rounded-xl border-border text-xs text-muted-foreground my-auto">
                    No gender demographic data recorded.
                  </div>
                )}

                <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span>Institute Total</span>
                  <span className="font-extrabold text-foreground">{totalStudents} Students</span>
                </div>
              </Card>
            </div>

            {/* Row 2: Batch Distribution & Recent Registrations Feed */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Batch Distribution Bar Chart */}
              <Card className="p-6 border border-border bg-card rounded-2xl shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-base text-foreground">Academic Batch Enrollment</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Active student distribution across batches</p>
                  </div>
                </div>

                {batchData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={batchData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="batch" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                          color: "hsl(var(--card-foreground))",
                        }}
                        formatter={(val: any) => [val, "Students"]}
                      />
                      <Bar dataKey="students" fill="#6366f1" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="py-12 text-center border border-dashed rounded-xl border-border flex flex-col items-center justify-center gap-2">
                    <Users className="w-8 h-8 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">No batch distribution records available.</p>
                  </div>
                )}
              </Card>

              {/* Recent Onboarding Feed across Roles */}
              <Card className="p-6 border border-border bg-card rounded-2xl shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-base text-foreground">Recent Registrations</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Latest students & staff registered on platform</p>
                  </div>
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                </div>

                <div className="space-y-3 overflow-y-auto max-h-[250px] pr-1">
                  {summary?.recentStudents && summary.recentStudents.length > 0 ? (
                    summary.recentStudents.map((st: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-border/80 bg-muted/20 hover:bg-muted/40 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                            {st.name?.charAt(0) || "S"}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-foreground">{st.name}</p>
                            <p className="text-[11px] text-muted-foreground">{st.email} • Index: {st.indexNumber}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[10px] font-semibold text-emerald-600 border-emerald-500/30">
                          Student
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="py-10 text-center text-xs text-muted-foreground">
                      No recent user registrations found.
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {/* TAB 2: FINANCIALS & REVENUE */}
        {activeTab === "financials" && (
          <motion.div
            key="financials"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Financial Overview Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="p-5 border border-border bg-card rounded-2xl shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase">Total Collected Fees</span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                    <CreditCard className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-emerald-600 mt-2">
                  LKR {totalFeeRevenue.toLocaleString()}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Verified payment transactions</p>
              </Card>

              <Card className="p-5 border border-border bg-card rounded-2xl shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase">Estimated Salary Payouts</span>
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600">
                    <Wallet className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-purple-600 mt-2">
                  LKR {totalSalaryDisbursed.toLocaleString()}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Faculty & administrative monthly cost</p>
              </Card>

              <Card className="p-5 border border-border bg-card rounded-2xl shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase">Net Operational Margin</span>
                  <div className={`p-2 rounded-xl ${netOperationalMargin >= 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}`}>
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <h3 className={`text-2xl font-black mt-2 ${netOperationalMargin >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                  LKR {netOperationalMargin.toLocaleString()}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Fee Income minus Salary Disbursements</p>
              </Card>
            </div>

            {/* Outstanding Fee Invoices Table */}
            <Card className="p-6 border border-border bg-card rounded-2xl shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-bold text-lg text-foreground">Outstanding Fee Invoices</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Unpaid or partially settled student monthly class fees
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search student or index..."
                      value={searchInvoice}
                      onChange={(e) => setSearchInvoice(e.target.value)}
                      className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-border bg-background text-xs text-foreground outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <Button
                    onClick={() => handleExportCsv("payments")}
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs font-semibold rounded-xl border-border hover:bg-muted"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-600" />
                    CSV
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-muted/40 text-muted-foreground border-b border-border font-bold">
                      <th className="px-4 py-3">Student Name</th>
                      <th className="px-4 py-3">Index Number</th>
                      <th className="px-4 py-3 text-right">Balance Due</th>
                      <th className="px-4 py-3 text-right">Due Date</th>
                      <th className="px-4 py-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="text-center py-6 text-muted-foreground">
                          Loading outstanding fee records...
                        </td>
                      </tr>
                    ) : filteredInvoices.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-muted-foreground">
                          <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                          No outstanding invoices matching search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredInvoices.map((inv: any, idx: number) => (
                        <tr key={idx} className="hover:bg-muted/10 transition-colors">
                          <td className="px-4 py-3 font-semibold text-foreground">{inv.studentName}</td>
                          <td className="px-4 py-3 text-muted-foreground font-mono">{inv.indexNumber}</td>
                          <td className="px-4 py-3 text-right font-black text-rose-600">
                            LKR {Number(inv.amountDue).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right text-muted-foreground">
                            {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "—"}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Badge variant="outline" className="text-[10px] font-bold text-amber-600 border-amber-400 bg-amber-50">
                              {inv.status || "PENDING"}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}

        {/* TAB 3: ACADEMICS & EXAMS */}
        {activeTab === "academics" && (
          <motion.div
            key="academics"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Top Students Leaderboard & Performance Predictions */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Leaderboard */}
              <Card className="p-6 border border-border bg-card rounded-2xl shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-base text-foreground">Top Academic Performers</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Highest scoring students across all subjects</p>
                  </div>
                  <Award className="w-5 h-5 text-amber-500" />
                </div>

                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-muted/40 text-muted-foreground border-b border-border font-bold">
                        <th className="px-4 py-2.5">Rank</th>
                        <th className="px-4 py-2.5">Student</th>
                        <th className="px-4 py-2.5">Index</th>
                        <th className="px-4 py-2.5 text-right">Avg Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredTopStudents.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-center py-6 text-muted-foreground">
                            No student scores recorded yet.
                          </td>
                        </tr>
                      ) : (
                        filteredTopStudents.map((s: any, idx: number) => (
                          <tr key={idx} className="hover:bg-muted/10">
                            <td className="px-4 py-2.5 font-bold text-muted-foreground">
                              {idx === 0 ? "🥇 1" : idx === 1 ? "🥈 2" : idx === 2 ? "🥉 3" : `#${idx + 1}`}
                            </td>
                            <td className="px-4 py-2.5 font-semibold text-foreground">{s.name}</td>
                            <td className="px-4 py-2.5 font-mono text-muted-foreground">{s.indexNumber}</td>
                            <td className="px-4 py-2.5 text-right font-black text-emerald-600">{s.avgScore}%</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Early Intervention & At-Risk Watchlist */}
              <Card className="p-6 border border-border bg-card rounded-2xl shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-base text-foreground">Academic Attention Watchlist</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Students with low scores needing academic intervention</p>
                  </div>
                  <AlertTriangle className="w-5 h-5 text-rose-500" />
                </div>

                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-muted/40 text-muted-foreground border-b border-border font-bold">
                        <th className="px-4 py-2.5">Student</th>
                        <th className="px-4 py-2.5">Index</th>
                        <th className="px-4 py-2.5 text-right">Avg Score</th>
                        <th className="px-4 py-2.5 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {students?.lowStudents && students.lowStudents.length > 0 ? (
                        students.lowStudents.map((s: any, idx: number) => (
                          <tr key={idx} className="hover:bg-muted/10">
                            <td className="px-4 py-2.5 font-semibold text-foreground">{s.name}</td>
                            <td className="px-4 py-2.5 font-mono text-muted-foreground">{s.indexNumber}</td>
                            <td className="px-4 py-2.5 text-right font-black text-rose-600">{s.avgScore}%</td>
                            <td className="px-4 py-2.5 text-center">
                              <Badge variant="outline" className="text-[10px] font-bold text-rose-600 border-rose-400 bg-rose-50">
                                At Risk
                              </Badge>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center py-6 text-muted-foreground">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                            No at-risk students flagged.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* Examination Registry List */}
            <Card className="p-6 border border-border bg-card rounded-2xl shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-base text-foreground">Institute Exam Evaluations</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Assessment schedules, pass rates, and participants</p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-muted/40 text-muted-foreground border-b border-border font-bold">
                      <th className="px-4 py-3">Exam Title</th>
                      <th className="px-4 py-3">Subject</th>
                      <th className="px-4 py-3">Exam Date</th>
                      <th className="px-4 py-3 text-center">Participants</th>
                      <th className="px-4 py-3 text-right">Avg Score</th>
                      <th className="px-4 py-3 text-right">Pass Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {exams.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-6 text-muted-foreground">
                          No exams recorded for this filter range.
                        </td>
                      </tr>
                    ) : (
                      exams.slice(0, 8).map((ex: any, idx: number) => (
                        <tr key={idx} className="hover:bg-muted/10">
                          <td className="px-4 py-3 font-semibold text-foreground">{ex.title}</td>
                          <td className="px-4 py-3 text-muted-foreground">{ex.subject}</td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {ex.date ? new Date(ex.date).toLocaleDateString() : "—"}
                          </td>
                          <td className="px-4 py-3 text-center font-bold text-foreground">{ex.participants}</td>
                          <td className="px-4 py-3 text-right font-extrabold text-indigo-600">{ex.avgScore}%</td>
                          <td className="px-4 py-3 text-right font-extrabold text-emerald-600">{ex.passRate}%</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}

        {/* TAB 4: FACULTY & SUBJECTS */}
        {activeTab === "faculty" && (
          <motion.div
            key="faculty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Faculty Directory Table */}
            <Card className="p-6 border border-border bg-card rounded-2xl shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-bold text-lg text-foreground">Faculty Workload & Performance</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Subject allocations, enrolled student volume, and student performance ratings
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search teacher name or subject..."
                      value={searchTeacher}
                      onChange={(e) => setSearchTeacher(e.target.value)}
                      className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-border bg-background text-xs text-foreground outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <Button
                    onClick={() => handleExportCsv("teachers")}
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs font-semibold rounded-xl border-border hover:bg-muted"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-600" />
                    CSV
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-muted/40 text-muted-foreground border-b border-border font-bold">
                      <th className="px-4 py-3">Teacher</th>
                      <th className="px-4 py-3">Allocated Subjects</th>
                      <th className="px-4 py-3 text-center">Students Handled</th>
                      <th className="px-4 py-3 text-center">Exams Created</th>
                      <th className="px-4 py-3 text-right">Student Avg Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredTeachers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-6 text-muted-foreground">
                          No teachers registered or matching query.
                        </td>
                      </tr>
                    ) : (
                      filteredTeachers.map((t: any, idx: number) => (
                        <tr key={idx} className="hover:bg-muted/10">
                          <td className="px-4 py-3">
                            <p className="font-bold text-foreground">{t.name}</p>
                            <p className="text-[10px] text-muted-foreground">{t.email}</p>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground font-medium">{t.subjects}</td>
                          <td className="px-4 py-3 text-center font-bold text-foreground">{t.studentCount}</td>
                          <td className="px-4 py-3 text-center font-bold text-foreground">{t.examsCreated}</td>
                          <td className="px-4 py-3 text-right font-black text-indigo-600">{t.avgStudentScore}%</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Subject Performance Breakdown */}
            <Card className="p-6 border border-border bg-card rounded-2xl shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-base text-foreground">Subject Academic Metrics</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Average marks, maximum/minimum scores, and pass rates</p>
                </div>
                <Button
                  onClick={() => handleExportCsv("subjects")}
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs font-semibold rounded-xl border-border hover:bg-muted"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  CSV
                </Button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-muted/40 text-muted-foreground border-b border-border font-bold">
                      <th className="px-4 py-3">Subject Name</th>
                      <th className="px-4 py-3">Code</th>
                      <th className="px-4 py-3 text-center">Active Students</th>
                      <th className="px-4 py-3 text-right">Avg Marks</th>
                      <th className="px-4 py-3 text-right">Pass Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {subjects.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-6 text-muted-foreground">
                          No subject statistics available.
                        </td>
                      </tr>
                    ) : (
                      subjects.map((sub: any, idx: number) => (
                        <tr key={idx} className="hover:bg-muted/10">
                          <td className="px-4 py-3 font-semibold text-foreground">{sub.name}</td>
                          <td className="px-4 py-3 text-muted-foreground font-mono">{sub.code}</td>
                          <td className="px-4 py-3 text-center font-bold text-foreground">{sub.students}</td>
                          <td className="px-4 py-3 text-right font-extrabold text-indigo-600">{sub.avgMarks}%</td>
                          <td className="px-4 py-3 text-right font-extrabold text-emerald-600">{sub.passRate}%</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}

        {/* TAB 5: ATTENDANCE & RETENTION */}
        {activeTab === "attendance" && (
          <motion.div
            key="attendance"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Daily Attendance Trend Line */}
            <Card className="p-6 border border-border bg-card rounded-2xl shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-foreground">Daily Attendance Rate Trend</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Percentage of registered students present per academic session
                  </p>
                </div>
                <Badge variant="outline" className="font-semibold text-xs border-amber-500/30 text-amber-600 bg-amber-50">
                  Institute Benchmark &ge; 75%
                </Badge>
              </div>

              {attendance?.dailyTrend && attendance.dailyTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={attendance.dailyTrend}>
                    <defs>
                      <linearGradient id="attendanceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      axisLine={false}
                      tickLine={false}
                      domain={[0, 100]}
                      tickFormatter={(val) => `${val}%`}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        color: "hsl(var(--card-foreground))",
                      }}
                      formatter={(val: any) => [`${val}%`, "Attendance Rate"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="percentage"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#attendanceGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="py-14 text-center border border-dashed rounded-xl border-border flex flex-col items-center justify-center gap-2">
                  <CalendarCheck className="w-8 h-8 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">No attendance session logs recorded in this filter period.</p>
                </div>
              )}
            </Card>

            {/* Low Attendance Watchlist (< 75%) */}
            <Card className="p-6 border border-border bg-card rounded-2xl shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-base text-foreground">Low Attendance Watchlist (&lt; 75%)</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Students at risk of examination ineligibility due to inconsistent attendance
                  </p>
                </div>
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </div>

              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-muted/40 text-muted-foreground border-b border-border font-bold">
                      <th className="px-4 py-3">Student Name</th>
                      <th className="px-4 py-3">Index Number</th>
                      <th className="px-4 py-3 text-right">Attendance Rate</th>
                      <th className="px-4 py-3 text-center">Alert Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {attendance?.lowAttendanceList && attendance.lowAttendanceList.length > 0 ? (
                      attendance.lowAttendanceList.map((st: any, idx: number) => (
                        <tr key={idx} className="hover:bg-muted/10">
                          <td className="px-4 py-3 font-semibold text-foreground">{st.name}</td>
                          <td className="px-4 py-3 text-muted-foreground font-mono">{st.indexNumber}</td>
                          <td className="px-4 py-3 text-right font-black text-rose-600">{st.attendanceRate}%</td>
                          <td className="px-4 py-3 text-center">
                            <Badge variant="outline" className="text-[10px] font-bold text-rose-600 border-rose-400 bg-rose-50">
                              Below 75%
                            </Badge>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center py-6 text-muted-foreground">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                          No students currently below the 75% attendance threshold.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
