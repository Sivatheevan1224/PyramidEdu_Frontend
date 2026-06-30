"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import {
  FileText,
  Calendar,
  Play,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  Search,
  Clock,
  Printer,
  ChevronLeft,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

interface Report {
  id: string;
  studentId: string;
  studentName: string;
  indexNumber: string;
  parentName: string;
  parentEmail: string;
  attendanceSummary: string;
  performanceScore: number;
  trendAnalysis: string;
  aiRecommendation: string;
  isSent: boolean;
  generatedAt: string;
  generatedBy: "AUTOMATIC" | "MANUAL";
  batchName: string;
  streamName: string;
}

export default function ParentReportsPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // 1-12

  // Filter and generation state
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [genMonth, setGenMonth] = useState<number>(currentMonth);
  const [genYear, setGenYear] = useState<number>(currentYear);

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [generating, setGenerating] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal State
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Warning state for existing reports
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" } | null>(null);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const showToast = (message: string, type: "success" | "error" | "warning" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Live countdown calculation
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      // Next automated run at 23:50 on the last day of the current month
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 50, 0);
      let diff = end.getTime() - now.getTime();
      
      if (diff < 0) {
        // If already passed today, target the end of next month
        const nextEnd = new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 50, 0);
        diff = nextEnd.getTime() - now.getTime();
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/parent-reports`, {
        params: { month: selectedMonth, year: selectedYear },
      });
      if (response.data && response.data.success) {
        setReports(response.data.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch reports:", error);
      showToast("Failed to fetch monthly reports. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [selectedMonth, selectedYear]);

  // Check if reports exist before triggering manual generation
  const checkAndGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Check if reports for the target month and year already exist
      const response = await api.get(`/parent-reports`, {
        params: { month: genMonth, year: genYear },
      });
      
      if (response.data && response.data.success && response.data.data.length > 0) {
        setShowWarningModal(true);
      } else {
        triggerGeneration();
      }
    } catch (error) {
      triggerGeneration();
    }
  };

  const triggerGeneration = async () => {
    setShowWarningModal(false);
    setGenerating(true);
    try {
      const response = await api.post(`/parent-reports/generate`, {
        month: genMonth,
        year: genYear,
      });

      if (response.data && response.data.success) {
        const successes = response.data.data.filter((r: any) => r.success && !r.skipped).length;
        const skipped = response.data.data.filter((r: any) => r.skipped).length;
        showToast(
          `Success: Generated ${successes} reports. (Skipped ${skipped} duplicates)`
        );
        setSelectedMonth(genMonth);
        setSelectedYear(genYear);
        fetchReports();
      }
    } catch (error: any) {
      console.error("Failed to generate reports:", error);
      if (error?.response?.status === 409) {
        showToast("Reports for this period have already been generated.", "warning");
      } else {
        showToast("Failed to generate parent reports. Verify Gemini API key.", "error");
      }
    } finally {
      setGenerating(false);
    }
  };

  const filteredReports = reports.filter(
    (r) =>
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.indexNumber && r.indexNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getPerformanceLevel = (score: number) => {
    if (score >= 75) return { label: "Excellent", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    if (score >= 60) return { label: "Good", color: "bg-blue-50 text-blue-700 border-blue-200" };
    if (score >= 45) return { label: "Average", color: "bg-amber-50 text-amber-700 border-amber-200" };
    return { label: "At Risk", color: "bg-red-50 text-red-700 border-red-200" };
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "IMPROVING":
        return <TrendingUp className="w-4 h-4 text-emerald-500 mr-1 inline" />;
      case "DECLINING":
        return <TrendingDown className="w-4 h-4 text-red-500 mr-1 inline" />;
      default:
        return <span className="w-4 h-4 text-blue-500 mr-1 inline font-bold">~</span>;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto min-h-screen">
      {/* Print stylesheet for physical report viewer layout */}
      <style jsx global>{`
        @media print {
          html, body {
            height: 99%;
            overflow: hidden;
            margin: 0 !important;
            padding: 0 !important;
          }
          #reports-dashboard-content {
            display: none !important;
          }
          body * {
            visibility: hidden;
          }
          #printable-report, #printable-report * {
            visibility: visible;
          }
          #printable-report {
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
        }
      `}</style>

      <div id="reports-dashboard-content" className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/manager/reports" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-4 h-4" /> Back to Reports Hub
            </Link>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Parent Reporting Automation</h1>
          <p className="text-muted-foreground mt-1">
            Configure automatic parent reports dispatched monthly with dynamic counselor recommendations.
          </p>
        </div>
      </div>

      {/* Countdown Card & Manual Trigger */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Countdown card */}
        <Card className="p-5 border-border bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Next Automated Cycle</span>
            </div>
            <p className="text-sm text-slate-400">Reports will automatically compile and dispatch to parent emails on the last day of this month.</p>
          </div>

          <div className="grid grid-cols-4 gap-2 my-4 text-center">
            <div className="bg-white/5 p-2 rounded-xl border border-white/10">
              <span className="text-2xl font-black block">{String(timeLeft.days).padStart(2, '0')}</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase">Days</span>
            </div>
            <div className="bg-white/5 p-2 rounded-xl border border-white/10">
              <span className="text-2xl font-black block">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase">Hours</span>
            </div>
            <div className="bg-white/5 p-2 rounded-xl border border-white/10">
              <span className="text-2xl font-black block">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase">Min</span>
            </div>
            <div className="bg-white/5 p-2 rounded-xl border border-white/10">
              <span className="text-2xl font-black block">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase">Sec</span>
            </div>
          </div>

          <div className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase text-center bg-emerald-500/10 py-1.5 rounded-lg border border-emerald-500/20">
            System Scheduler Active
          </div>
        </Card>

        {/* Manual Trigger Panel */}
        <Card className="md:col-span-2 p-5 border-border bg-card shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Play className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-foreground">Manual Report Dispatch</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Trigger a manual generation run for students and dispatch report card emails directly to parents.
            </p>
          </div>
          
          <form onSubmit={checkAndGenerate} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Select Month</label>
              <select
                value={genMonth}
                onChange={(e) => setGenMonth(Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
              >
                {monthNames.map((name, index) => (
                  <option key={index + 1} value={index + 1}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Select Year</label>
              <input
                type="number"
                value={genYear}
                onChange={(e) => setGenYear(Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-sm text-foreground"
              />
            </div>

            <button
              type="submit"
              disabled={generating}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white shadow-lg hover:bg-emerald-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {generating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Run Generation
                </>
              )}
            </button>
          </form>
        </Card>
      </div>

      {/* Reports Directory & History */}
      <Card className="p-5 border-border bg-card shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-foreground">Report History</h2>
            <p className="text-xs text-muted-foreground">Search and review past monthly parent reports.</p>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="rounded-xl border border-border bg-background px-3 py-1.5 text-sm text-foreground"
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
              className="rounded-xl border border-border bg-background px-3 py-1.5 text-sm text-foreground"
            >
              {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by student name or index number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background text-sm text-foreground outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/40 text-muted-foreground text-xs font-semibold uppercase tracking-wider border-b border-border">
                <th className="px-5 py-3.5">Student</th>
                <th className="px-5 py-3.5">Index No</th>
                <th className="px-5 py-3.5">Reporting Period</th>
                <th className="px-5 py-3.5">Weighted Score</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Source</th>
                <th className="px-5 py-3.5">Email Delivery</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-5 py-4"><div className="h-4 bg-muted rounded-md w-3/4 animate-pulse"></div></td>
                    <td className="px-5 py-4"><div className="h-4 bg-muted rounded-md w-1/2"></div></td>
                    <td className="px-5 py-4"><div className="h-4 bg-muted rounded-md w-1/3"></div></td>
                    <td className="px-5 py-4"><div className="h-4 bg-muted rounded-md w-12"></div></td>
                    <td className="px-5 py-4"><div className="h-6 bg-muted rounded-full w-16"></div></td>
                    <td className="px-5 py-4"><div className="h-5 bg-muted rounded-md w-16"></div></td>
                    <td className="px-5 py-4"><div className="h-5 bg-muted rounded-md w-16"></div></td>
                    <td className="px-5 py-4 text-right"><div className="h-8 bg-muted rounded-md w-16 ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-muted-foreground">
                    No reports generated for this monthly cycle.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => {
                  const level = getPerformanceLevel(report.performanceScore);
                  return (
                    <tr key={report.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-semibold text-foreground">{report.studentName}</p>
                          <p className="text-xs text-muted-foreground">Parent: {report.parentName}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">{report.indexNumber || "—"}</td>
                      <td className="px-5 py-4 text-muted-foreground font-semibold">
                        {monthNames[selectedMonth - 1]} {selectedYear}
                      </td>
                      <td className="px-5 py-4 font-bold text-foreground">{report.performanceScore.toFixed(1)}%</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${level.color}`}>
                          {level.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-semibold">
                        <span className={`inline-flex px-2 py-0.5 rounded-lg text-xs ${report.generatedBy === 'AUTOMATIC' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-700'}`}>
                          {report.generatedBy}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {report.isSent ? (
                          <span className="inline-flex items-center text-emerald-600 gap-1 text-xs font-semibold">
                            <CheckCircle className="w-4 h-4" /> Dispatched
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-red-600 gap-1 text-xs font-semibold">
                            <XCircle className="w-4 h-4" /> Failed / Unsent
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedReport(report);
                            setIsModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold hover:bg-muted transition-colors text-foreground"
                        >
                          <Eye className="w-3.5 h-3.5" /> Open Viewer
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>

    {/* Warning Modal for Duplicate Generation */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6">
            <div className="flex items-center gap-3 text-amber-600 mb-4">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="text-lg font-bold">Reports Already Exist</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Monthly parent reports for <strong>{monthNames[genMonth - 1]} {genYear}</strong> have already been generated. Re-running generation will skip existing students and only create reports for newly enrolled students to prevent duplicates.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowWarningModal(false)}
                className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-muted text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={triggerGeneration}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print-Ready Report Card Viewer Modal */}
      {isModalOpen && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-3xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="border-b border-border bg-muted/20 p-5 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-foreground">Report Card Viewer</h3>
                <p className="text-xs text-muted-foreground">Generated: {new Date(selectedReport.generatedAt).toLocaleDateString()} · Method: {selectedReport.generatedBy}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 text-white px-3.5 py-2 text-xs font-semibold hover:bg-emerald-700 transition-colors"
                >
                  <Printer className="w-4 h-4" /> Download PDF / Print
                </button>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedReport(null);
                  }}
                  className="text-muted-foreground hover:text-foreground text-2xl font-semibold px-2"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Document Printable Report Card Body */}
            <div className="p-8 overflow-y-auto flex-1 bg-slate-50 dark:bg-zinc-950">
              <div
                id="printable-report"
                className="mx-auto max-w-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 rounded-lg p-8 shadow-sm text-slate-800 dark:text-slate-200 font-sans"
              >
                {/* Header branding */}
                <div className="text-center border-b-2 border-emerald-500 pb-5 mb-6">
                  <h2 className="text-2xl font-black text-emerald-600 uppercase tracking-wider">PyramidEdu Institute</h2>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-1">Official Student Academic Report</p>
                </div>

                {/* Meta details */}
                <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Student Profile</p>
                    <p className="font-bold text-slate-900 dark:text-white">{selectedReport.studentName}</p>
                    <p>Index No: {selectedReport.indexNumber || "—"}</p>
                    <p>Batch: {selectedReport.batchName} ({selectedReport.streamName})</p>
                  </div>
                  <div className="space-y-1 text-right sm:text-left">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Recipient Details</p>
                    <p className="font-bold text-slate-900 dark:text-white">Parent: {selectedReport.parentName}</p>
                    <p>{selectedReport.parentEmail || "No Email Registered"}</p>
                    <p>Reporting Period: {monthNames[selectedMonth - 1]} {selectedYear}</p>
                  </div>
                </div>

                {/* Score Summary Grid */}
                <div className="bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-slate-800 rounded-xl p-4 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Attendance</span>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                      {selectedReport.attendanceSummary.match(/Attendance: (\d+)%/)?.[1] || "0"}%
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Weighted Score</span>
                    <p className="text-lg font-bold text-emerald-600 mt-0.5">{selectedReport.performanceScore.toFixed(1)}%</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Performance Trend</span>
                    <p className="text-lg font-bold text-indigo-600 mt-0.5">
                      {getTrendIcon(selectedReport.trendAnalysis)} {selectedReport.trendAnalysis}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Academic Standing</span>
                    <p className="text-lg font-bold text-slate-950 dark:text-white mt-0.5">
                      {getPerformanceLevel(selectedReport.performanceScore).label}
                    </p>
                  </div>
                </div>

                {/* Detailed Metrics Table */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Subject Performance breakdown</h4>
                  <table className="w-full text-left text-sm border border-slate-200 dark:border-slate-700">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                        <th className="px-4 py-2">Metric Type</th>
                        <th className="px-4 py-2 text-right">Average Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      <tr>
                        <td className="px-4 py-2.5 font-medium">Monthly Attendance Rate</td>
                        <td className="px-4 py-2.5 text-right font-bold">{selectedReport.attendanceSummary.match(/Attendance: (\d+)%/)?.[1] || "0"}%</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-medium">Quiz Marks Average</td>
                        <td className="px-4 py-2.5 text-right font-bold">{selectedReport.attendanceSummary.match(/Quiz: (\d+)%/)?.[1] || "0"}%</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-medium">Assignment Completion Rate</td>
                        <td className="px-4 py-2.5 text-right font-bold">{selectedReport.attendanceSummary.match(/Assignment: (\d+)%/)?.[1] || "0"}%</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-medium">Monthly Exam Score</td>
                        <td className="px-4 py-2.5 text-right font-bold">{selectedReport.attendanceSummary.match(/Exam: (\d+)%/)?.[1] || "0"}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* AI Counselor Remarks */}
                <div className="bg-emerald-50 dark:bg-emerald-950/20 border-l-4 border-emerald-500 p-4 rounded-r-xl">
                  <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-1.5">
                    Counselor Academic Recommendations
                  </h4>
                  <p className="text-sm text-emerald-900 dark:text-emerald-200 italic leading-relaxed">
                    "{selectedReport.aiRecommendation}"
                  </p>
                </div>

                {/* Signoff */}
                <div className="flex justify-between items-end mt-12 text-xs border-t border-slate-100 pt-6">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">PyramidEdu Administration</p>
                    <p className="text-slate-400">Automated system release</p>
                  </div>
                  <div className="text-right">
                    <div className="h-8 border-b border-slate-300 w-32 ml-auto mb-1"></div>
                    <p className="text-slate-400">Authorized Signature</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-border bg-muted/20 p-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedReport(null);
                }}
                className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-muted text-foreground"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-lg">
          <div className={`w-2.5 h-2.5 rounded-full ${toast.type === "success" ? "bg-emerald-600" : toast.type === "warning" ? "bg-amber-500" : "bg-red-600"}`} />
          <p className="text-sm font-semibold text-foreground">{toast.message}</p>
        </div>
      )}
    </div>
  );
}
