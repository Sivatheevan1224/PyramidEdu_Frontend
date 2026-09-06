"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import {
  Brain,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  ChevronLeft,
  Printer,
  RefreshCw,
  Search,
  Zap,
  ShieldAlert,
  ArrowRight,
  Database,
} from "lucide-react";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

export default function ManagerAiReportsPage() {
  const [summary, setSummary] = useState<any>(null);
  const [studentData, setStudentData] = useState<any>(null);
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchRisk, setSearchRisk] = useState<string>("");

  const fetchAiData = async () => {
    setLoading(true);
    try {
      const [summaryRes, studentRes, perfRes] = await Promise.all([
        api.get("/analytics/dashboard"),
        api.get("/analytics/students"),
        api.get("/analytics/performance"),
      ]);

      if (summaryRes.data.success) setSummary(summaryRes.data.data);
      if (studentRes.data.success) setStudentData(studentRes.data.data);
      if (perfRes.data.success) setPerformanceData(perfRes.data.data);
    } catch (error) {
      console.error("Failed to load AI reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAiData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const performanceLevels = studentData?.performanceLevels || [];
  const trendDistribution = performanceData?.trendDistribution || [];
  const totalPredictions = performanceData?.totalPredictions ?? 0;

  // Use real predictions from database or fallback to real low marks students from database
  const rawAlerts = performanceData?.studentAlerts?.length > 0
    ? performanceData.studentAlerts
    : (studentData?.lowStudents || []).map((s: any) => ({
        id: s.id,
        name: s.name,
        indexNumber: s.indexNumber,
        finalScore: s.avgScore,
        performanceLevel: "AT_RISK",
        trendStatus: "DECLINING",
        recommendations: ["Academic counseling & scheduled progress monitoring"],
      }));

  const filteredRiskStudents = rawAlerts.filter(
    (s: any) =>
      s.name.toLowerCase().includes(searchRisk.toLowerCase()) ||
      s.indexNumber.toLowerCase().includes(searchRisk.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto min-h-screen">
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-ai, #printable-ai * {
            visibility: visible;
          }
          #printable-ai {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
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
            <Link
              href="/manager/reports"
              className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Reports Hub
            </Link>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
            <Brain className="w-7 h-7 text-indigo-600" /> AI Predictive Intelligence Reports
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Predictive machine learning models calculated directly from student attendance and assessment records.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchAiData}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold hover:bg-muted text-foreground transition-all shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reload Models
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-500/20 bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition-all shadow-md"
          >
            <Printer className="w-3.5 h-3.5" /> Export PDF
          </button>
        </div>
      </div>

      {/* Main Printable Content */}
      <div id="printable-ai" className="space-y-6">
        {/* KPI Summaries Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border-border bg-card shadow-xs rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-semibold uppercase">Excellent Standings</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-emerald-600">
              {loading ? "..." : summary?.excellentStudents ?? 0}
            </p>
            <span className="text-[11px] text-muted-foreground block mt-1">High-achieving predicted students</span>
          </Card>

          <Card className="p-5 border-border bg-card shadow-xs rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-semibold uppercase">At-Risk Alerts</span>
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-rose-600">
              {loading ? "..." : summary?.atRiskStudents ?? rawAlerts.length}
            </p>
            <span className="text-[11px] text-muted-foreground block mt-1">Urgent intervention required</span>
          </Card>

          <Card className="p-5 border-border bg-card shadow-xs rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-semibold uppercase">Evaluated Records</span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600">
                <Database className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-indigo-600">
              {loading ? "..." : totalPredictions > 0 ? totalPredictions : summary?.activeStudents ?? 0}
            </p>
            <span className="text-[11px] text-muted-foreground block mt-1">Model prediction records</span>
          </Card>

          <Card className="p-5 border-border bg-card shadow-xs rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-semibold uppercase">Active Cohort</span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-foreground">
              {loading ? "..." : summary?.activeStudents ?? 0}
            </p>
            <span className="text-[11px] text-muted-foreground block mt-1">Enrolled students tracked</span>
          </Card>
        </div>

        {/* Charts: Standing Levels & Trend Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Standing Levels Pie Chart */}
          <Card className="p-5 border-border bg-card shadow-xs rounded-2xl flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">Predicted Standing Distribution</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Proportion of students in each predictive performance band
              </p>
            </div>
            <div className="h-64 flex items-center justify-center">
              {loading ? (
                <div className="h-full w-full bg-muted/20 animate-pulse rounded-xl"></div>
              ) : performanceLevels.length === 0 ? (
                <p className="text-xs text-muted-foreground">No prediction data generated in database yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={performanceLevels}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="level"
                    >
                      {performanceLevels.map((entry: any, index: number) => (
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

          {/* Progress Trajectory / Trend Bar Chart */}
          <Card className="p-5 border-border bg-card shadow-xs rounded-2xl flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">Learning Trajectory Breakdown</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Direction of student marks progression across recent assessments
              </p>
            </div>
            <div className="h-64 flex items-center justify-center">
              {loading ? (
                <div className="h-full w-full bg-muted/20 animate-pulse rounded-xl"></div>
              ) : trendDistribution.length === 0 ? (
                <p className="text-xs text-muted-foreground">No trend trajectory records found in database.</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="trend" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="count" name="Students" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        </div>

        {/* AI Recommendations for At-Risk Students */}
        <Card className="p-5 border-border bg-card shadow-xs rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Early-Warning & Remedial Action List
              </h3>
              <p className="text-xs text-muted-foreground">
                Database-calculated recommendations for students flagged in academic jeopardy
              </p>
            </div>
            <div className="relative no-print w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Filter by student..."
                value={searchRisk}
                onChange={(e) => setSearchRisk(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-border bg-background text-xs text-foreground outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-muted/40 text-muted-foreground border-b border-border font-bold">
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Index</th>
                  <th className="px-4 py-3 text-right">Score Avg</th>
                  <th className="px-4 py-3 text-center">Risk Level</th>
                  <th className="px-4 py-3">Remedial Action Recommendations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-muted-foreground">
                      Loading data from backend...
                    </td>
                  </tr>
                ) : filteredRiskStudents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-muted-foreground">
                      No at-risk students found in database. All student records meet academic standards.
                    </td>
                  </tr>
                ) : (
                  filteredRiskStudents.map((s: any, idx: number) => (
                    <tr key={idx} className="hover:bg-muted/10">
                      <td className="px-4 py-3 font-semibold text-foreground">{s.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{s.indexNumber}</td>
                      <td className="px-4 py-3 text-right font-black text-rose-600">{s.finalScore}%</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                          {s.performanceLevel || "AT_RISK"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {s.recommendations && s.recommendations.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            {s.recommendations.map((rec: string, rIdx: number) => (
                              <span key={rIdx} className="flex items-center gap-1.5 text-xs text-foreground">
                                <Zap className="w-3 h-3 text-amber-500 shrink-0" />
                                {rec}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="flex items-center gap-1.5 text-xs">
                            <Zap className="w-3 h-3 text-amber-500 shrink-0" />
                            Academic counseling & targeted revision assigned
                          </span>
                        )}
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
  );
}
