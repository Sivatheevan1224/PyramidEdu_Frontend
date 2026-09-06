"use client";

import React, { useState, useEffect } from "react";
import { api, getApiBaseUrl, getAccessToken } from "@/lib/api";
import { Card } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  Printer,
  RefreshCw,
  Search,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import Link from "next/link";
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
} from "recharts";

export default function ManagerAttendanceReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [summary, setSummary] = useState<any>(null);
  const [attendance, setAttendance] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchStudent, setSearchStudent] = useState<string>("");

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      const params = {
        month: selectedMonth,
        year: selectedYear,
      };

      const [summaryRes, attendanceRes] = await Promise.all([
        api.get("/analytics/dashboard", { params }),
        api.get("/analytics/attendance", { params }),
      ]);

      if (summaryRes.data.success) setSummary(summaryRes.data.data);
      if (attendanceRes.data.success) setAttendance(attendanceRes.data.data);
    } catch (error) {
      console.error("Failed to load attendance reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, [selectedMonth, selectedYear]);

  const handlePrint = () => {
    window.print();
  };

  const lowAttendanceStudents = attendance?.lowAttendanceList || [];
  const filteredLowStudents = lowAttendanceStudents.filter(
    (s: any) =>
      s.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
      s.indexNumber.toLowerCase().includes(searchStudent.toLowerCase())
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
          #printable-attendance, #printable-attendance * {
            visibility: visible;
          }
          #printable-attendance {
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
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Attendance Reports</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Monitor daily attendance percentages, class participation logs, and chronic absenteeism alerts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl border border-purple-500/20 bg-purple-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-purple-700 transition-all shadow-md"
          >
            <Printer className="w-3.5 h-3.5" /> Export PDF
          </button>
        </div>
      </div>

      {/* Filters (No-Print) */}
      <Card className="p-4 border-border bg-card shadow-xs flex flex-wrap items-center gap-4 no-print rounded-2xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Report Month:</span>
        </div>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:ring-2 focus:ring-purple-500/20"
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
          className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:ring-2 focus:ring-purple-500/20"
        >
          {[2025, 2026, 2027].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <button
          onClick={fetchAttendanceData}
          className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:underline"
        >
          <RefreshCw className="w-3 h-3" /> Refresh Logs
        </button>
      </Card>

      {/* Printable Area */}
      <div id="printable-attendance" className="space-y-6">
        {/* KPI Summaries */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border-border bg-card shadow-xs rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-semibold uppercase">Avg Attendance</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-purple-600">
              {loading ? "..." : `${summary?.avgAttendance ?? 0}%`}
            </p>
            <span className="text-[11px] text-muted-foreground block mt-1">Overall session turnout</span>
          </Card>

          <Card className="p-5 border-border bg-card shadow-xs rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-semibold uppercase">Active Students</span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-foreground">
              {loading ? "..." : summary?.activeStudents ?? 0}
            </p>
            <span className="text-[11px] text-muted-foreground block mt-1">Enrolled class members</span>
          </Card>

          <Card className="p-5 border-border bg-card shadow-xs rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-semibold uppercase">Regular Attendees</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-emerald-600">
              {loading ? "..." : `${Math.max(0, (summary?.activeStudents || 0) - lowAttendanceStudents.length)}`}
            </p>
            <span className="text-[11px] text-muted-foreground block mt-1">Maintains ≥ 75% attendance</span>
          </Card>

          <Card className="p-5 border-border bg-card shadow-xs rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-semibold uppercase">At-Risk Absentees</span>
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-rose-600">
              {loading ? "..." : lowAttendanceStudents.length}
            </p>
            <span className="text-[11px] text-muted-foreground block mt-1">Falls below 75% threshold</span>
          </Card>
        </div>

        {/* Daily Attendance Trend Line Chart */}
        <Card className="p-5 border-border bg-card shadow-xs rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-foreground">Daily Attendance Rate Trend (%)</h3>
              <p className="text-xs text-muted-foreground">Percentage of enrolled students attending scheduled sessions</p>
            </div>
            <span className="text-xs font-bold text-purple-600 bg-purple-500/10 px-2.5 py-1 rounded-full">
              Live Presence Rates
            </span>
          </div>

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
                  <Line
                    type="monotone"
                    dataKey="percentage"
                    name="Attendance (%)"
                    stroke="#8b5cf6"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Low Attendance / Chronic Absentee Warning Table */}
        <Card className="p-5 border-border bg-card shadow-xs rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-base font-bold text-foreground">Chronic Absenteeism Risk List</h3>
              <p className="text-xs text-muted-foreground">
                Students attending fewer than 75% of class sessions requiring immediate parent alerts
              </p>
            </div>
            <div className="relative no-print w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search at-risk student..."
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-border bg-background text-xs text-foreground outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-muted/40 text-muted-foreground border-b border-border font-bold">
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Index Number</th>
                  <th className="px-4 py-3 text-right">Attendance Rate</th>
                  <th className="px-4 py-3 text-center">Intervention Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-muted-foreground">
                      Loading attendance logs...
                    </td>
                  </tr>
                ) : filteredLowStudents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-muted-foreground">
                      No students are currently below the attendance threshold. Great record!
                    </td>
                  </tr>
                ) : (
                  filteredLowStudents.map((st: any, idx: number) => (
                    <tr key={idx} className="hover:bg-muted/10">
                      <td className="px-4 py-3 font-semibold text-foreground">{st.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{st.indexNumber}</td>
                      <td className="px-4 py-3 text-right font-black text-rose-600">
                        {st.attendanceRate}%
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                          Parent Notice Needed
                        </span>
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
