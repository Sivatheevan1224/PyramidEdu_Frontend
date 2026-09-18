"use client";

import React, { useState, useEffect } from "react";
import { api, getApiBaseUrl, getAccessToken } from "@/lib/api";
import { Card } from "@/components/ui/card";
import {
  Award,
  TrendingUp,
  BookOpen,
  Users,
  ChevronLeft,
  Printer,
  Download,
  Search,
  RefreshCw,
  Trophy,
  CheckCircle2,
  BarChart2,
} from "lucide-react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export default function ManagerPerformanceReportsPage() {
  const [summary, setSummary] = useState<any>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchStudent, setSearchStudent] = useState<string>("");
  const [searchSubject, setSearchSubject] = useState<string>("");

  const fetchPerformanceData = async () => {
    setLoading(true);
    try {
      const [summaryRes, subjectsRes, studentRes] = await Promise.all([
        api.get("/analytics/dashboard"),
        api.get("/analytics/subjects"),
        api.get("/analytics/students"),
      ]);

      if (summaryRes.data.success) setSummary(summaryRes.data.data);
      if (subjectsRes.data.success) setSubjects(subjectsRes.data.data);
      if (studentRes.data.success) setStudentData(studentRes.data.data);
    } catch (error) {
      console.error("Failed to load performance reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = (type: string) => {
    window.open(`${getApiBaseUrl()}/analytics/export/csv?type=${type}&token=${getAccessToken() || ""}`, "_blank");
  };

  const topStudents = studentData?.topStudents || [];
  const filteredStudents = topStudents.filter(
    (s: any) =>
      s.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
      s.indexNumber.toLowerCase().includes(searchStudent.toLowerCase())
  );

  const filteredSubjects = subjects.filter(
    (sub: any) =>
      sub.name.toLowerCase().includes(searchSubject.toLowerCase()) ||
      sub.code.toLowerCase().includes(searchSubject.toLowerCase())
  );

  // Prepare chart data
  const subjectChartData = subjects.map((sub: any) => ({
    name: sub.code || sub.name,
    avg: Number(sub.avgMarks || 0),
    passRate: Number(sub.passRate || 0),
  }));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto min-h-screen">
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-performance, #printable-performance * {
            visibility: visible;
          }
          #printable-performance {
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
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Academic Performance Reports</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Evaluate subject grade distributions, exam pass rates, and top student rankings across all batches.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExportCsv("students")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold hover:bg-muted text-foreground transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-rose-700 transition-all shadow-md"
          >
            <Printer className="w-3.5 h-3.5" /> Print Sheet (PDF)
          </button>
        </div>
      </div>

      {/* Main Printable Content */}
      <div id="printable-performance" className="space-y-6">
        {/* KPI Summaries Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border-border bg-card shadow-xs rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-semibold uppercase">Overall Pass Rate</span>
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-rose-600">
              {loading ? "..." : `${summary?.passRate ?? 0}%`}
            </p>
            <span className="text-[11px] text-muted-foreground block mt-1">Passing mark threshold ≥ 50%</span>
          </Card>

          <Card className="p-5 border-border bg-card shadow-xs rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-semibold uppercase">Average Exam Mark</span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-foreground">
              {loading ? "..." : `${summary?.avgMarks ?? 0}%`}
            </p>
            <span className="text-[11px] text-muted-foreground block mt-1">Mean performance average</span>
          </Card>

          <Card className="p-5 border-border bg-card shadow-xs rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-semibold uppercase">Curriculum Subjects</span>
              <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-teal-600">
              {loading ? "..." : subjects.length}
            </p>
            <span className="text-[11px] text-muted-foreground block mt-1">Active evaluated subjects</span>
          </Card>

          <Card className="p-5 border-border bg-card shadow-xs rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-semibold uppercase">Top Honor Students</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-amber-600">
              {loading ? "..." : topStudents.length}
            </p>
            <span className="text-[11px] text-muted-foreground block mt-1">Ranked academic leaders</span>
          </Card>
        </div>

        {/* Subject Comparison Chart */}
        <Card className="p-5 border-border bg-card shadow-xs rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-foreground">Subject Average Score vs Pass Rate (%)</h3>
              <p className="text-xs text-muted-foreground">Comparative subject benchmarks across academic terms</p>
            </div>
          </div>

          <div className="h-72">
            {loading ? (
              <div className="h-full bg-muted/20 animate-pulse rounded-xl"></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avg" name="Avg Score (%)" fill="#e11d48" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="passRate" name="Pass Rate (%)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Top Students & Subject Performance Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Students Table */}
          <Card className="p-5 border-border bg-card shadow-xs rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-foreground">Top Performing Students</h3>
                <p className="text-xs text-muted-foreground">Highest scoring students across all subjects</p>
              </div>
              <div className="relative no-print w-full sm:w-48">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search student..."
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-border bg-background text-xs text-foreground outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-muted/40 text-muted-foreground border-b border-border font-bold">
                    <th className="px-4 py-3">Rank</th>
                    <th className="px-4 py-3">Student Name</th>
                    <th className="px-4 py-3">Index</th>
                    <th className="px-4 py-3 text-right">Avg Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="text-center py-6 text-muted-foreground">
                        Loading rank list...
                      </td>
                    </tr>
                  ) : filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-6 text-muted-foreground">
                        No students found.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s: any, idx: number) => (
                      <tr key={idx} className="hover:bg-muted/10">
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-black text-[11px] ${
                              idx === 0
                                ? "bg-amber-500/15 text-amber-600 border border-amber-500/30"
                                : idx === 1
                                ? "bg-slate-500/15 text-slate-600 border border-slate-500/30"
                                : idx === 2
                                ? "bg-orange-500/15 text-orange-600 border border-orange-500/30"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {idx + 1}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-foreground">{s.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{s.indexNumber}</td>
                        <td className="px-4 py-3 text-right font-black text-rose-600">{s.avgScore}%</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Subject Breakdown Table */}
          <Card className="p-5 border-border bg-card shadow-xs rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-foreground">Subject Performance Details</h3>
                <p className="text-xs text-muted-foreground">Enrollment counts and pass ratios</p>
              </div>
              <div className="relative no-print w-full sm:w-48">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search subject..."
                  value={searchSubject}
                  onChange={(e) => setSearchSubject(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-border bg-background text-xs text-foreground outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-muted/40 text-muted-foreground border-b border-border font-bold">
                    <th className="px-4 py-3">Subject</th>
                    <th className="px-4 py-3">Enrolled</th>
                    <th className="px-4 py-3">Avg Mark</th>
                    <th className="px-4 py-3 text-right">Pass Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="text-center py-6 text-muted-foreground">
                        Loading subjects...
                      </td>
                    </tr>
                  ) : filteredSubjects.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-6 text-muted-foreground">
                        No subjects match your search.
                      </td>
                    </tr>
                  ) : (
                    filteredSubjects.map((sub: any, idx: number) => (
                      <tr key={idx} className="hover:bg-muted/10">
                        <td className="px-4 py-3 font-semibold text-foreground">
                          {sub.name} <span className="text-muted-foreground font-normal">({sub.code})</span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{sub.students}</td>
                        <td className="px-4 py-3 font-bold text-foreground">{sub.avgMarks}%</td>
                        <td className="px-4 py-3 text-right font-black text-blue-600">{sub.passRate}%</td>
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
