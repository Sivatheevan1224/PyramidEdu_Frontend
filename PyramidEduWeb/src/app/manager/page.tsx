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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryRes, paymentsRes, attendanceRes, studentRes] = await Promise.all([
          api.get("/analytics/dashboard"),
          api.get("/analytics/payments"),
          api.get("/analytics/attendance"),
          api.get("/analytics/students"),
        ]);

        if (summaryRes.data.success) setSummary(summaryRes.data.data);
        if (paymentsRes.data.success) setPayments(paymentsRes.data.data);
        if (attendanceRes.data.success) setAttendance(attendanceRes.data.data);
        if (studentRes.data.success) setStudentStats(studentRes.data.data);

      } catch (err) {
        console.error("Failed to fetch manager dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">Loading dashboard statistics…</p>
      </div>
    );
  }

  // Format fee collections for chart matching structure { m, paid }
  const collectionData = payments?.collectionTrend?.map((item: any) => ({
    m: item.month.split(' ')[0],
    paid: item.income,
  })) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black tracking-tight text-foreground bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400">
          Manager Dashboard
        </h1>
      </div>

      {/* KPI Cards - Colorful gradient designs */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Active Students */}
        <div className="relative overflow-hidden p-6 rounded-2xl border border-blue-500/10 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 shadow-md flex justify-between items-center group hover:scale-[1.02] transition-all duration-300">
          <div className="space-y-2">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block">Active Students</span>
            <p className="text-3xl font-black text-foreground">{summary?.activeStudents ?? 0}</p>
            <span className="text-[10px] text-muted-foreground block">Active class registrations</span>
          </div>
          <div className="p-4 rounded-2xl bg-blue-600 text-white shadow-lg group-hover:rotate-6 transition-transform">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Collections */}
        <div className="relative overflow-hidden p-6 rounded-2xl border border-emerald-500/10 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 shadow-md flex justify-between items-center group hover:scale-[1.02] transition-all duration-300">
          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">Collections</span>
            <p className="text-2xl font-black text-emerald-600">LKR {(summary?.totalPayments ?? 0).toLocaleString()}</p>
            <span className="text-[10px] text-muted-foreground block">Verified fee payments</span>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-600 text-white shadow-lg group-hover:rotate-6 transition-transform">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        {/* Avg Attendance */}
        <div className="relative overflow-hidden p-6 rounded-2xl border border-purple-500/10 bg-gradient-to-br from-purple-500/5 to-violet-500/5 shadow-md flex justify-between items-center group hover:scale-[1.02] transition-all duration-300">
          <div className="space-y-2">
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest block">Avg Attendance</span>
            <p className="text-3xl font-black text-foreground">{summary?.avgAttendance ?? 0}%</p>
            <span className="text-[10px] text-muted-foreground block">Regular checking rate</span>
          </div>
          <div className="p-4 rounded-2xl bg-purple-600 text-white shadow-lg group-hover:rotate-6 transition-transform">
            <CalendarCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Pass Rates */}
        <div className="relative overflow-hidden p-6 rounded-2xl border border-amber-500/10 bg-gradient-to-br from-amber-500/5 to-orange-500/5 shadow-md flex justify-between items-center group hover:scale-[1.02] transition-all duration-300">
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest block">Pass Rates</span>
            <p className="text-3xl font-black text-foreground">{summary?.passRate ?? 0}%</p>
            <span className="text-[10px] text-muted-foreground block">Student passing marks ratio</span>
          </div>
          <div className="p-4 rounded-2xl bg-amber-500 text-white shadow-lg group-hover:rotate-6 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Fees stack chart */}
        <Card className="p-5 lg:col-span-2 border-border shadow-sm">
          <h3 className="font-bold text-base text-foreground mb-4">Fee Collection Trends</h3>
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
        <Card className="p-5 border-border shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-foreground mb-4">Academic Standing Levels</h3>
          </div>
          <div className="h-64 flex items-center justify-center">
            {studentStats?.performanceLevels?.length === 0 ? (
              <p className="text-xs text-muted-foreground">No prediction standins</p>
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
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      {/* Attendance line chart */}
      <Card className="p-5 border-border shadow-sm">
        <h3 className="font-bold text-base text-foreground mb-4">Attendance Tracking</h3>
        <p className="text-xs text-muted-foreground mb-4">Daily attendance percentages</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={attendance?.dailyTrend || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="percentage" name="Attendance Rate (%)" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Searchable Student Standings / Warnings list */}
      <Card className="p-5 border-border shadow-sm">
        <h3 className="font-bold text-base text-foreground mb-2">Attention Required: At-Risk Students</h3>
        <p className="text-xs text-muted-foreground mb-4">Students currently predicted at warning levels based on average marks</p>
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
                  <td colSpan={4} className="text-center py-6 text-muted-foreground">All students meet requirements. No warnings.</td>
                </tr>
              ) : (
                studentStats?.lowStudents?.map((r: any, idx: number) => (
                  <tr key={idx} className="border-b last:border-0 hover:bg-muted/10">
                    <td className="px-4 py-3 font-semibold text-foreground">{r.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.indexNumber}</td>
                    <td className="px-4 py-3 text-right font-bold text-red-600">{r.avgScore}%</td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
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
        <Card className="p-4 border border-border bg-card shadow-xs">
          <h4 className="font-bold text-xs text-blue-600 dark:text-blue-400 uppercase tracking-widest border-b border-border pb-2 mb-3">Recently Joined Students</h4>
          {summary?.recentStudents?.length === 0 ? (
            <p className="text-xs text-muted-foreground py-2">No new students</p>
          ) : (
            <ul className="space-y-2">
              {summary?.recentStudents?.slice(0, 4).map((s: any, idx: number) => (
                <li key={idx} className="flex justify-between items-center text-xs border-b border-border/20 pb-2 last:border-0 last:pb-0">
                  <div>
                    <p className="font-bold text-foreground">{s.name}</p>
                    <p className="text-[10px] text-muted-foreground">{s.email}</p>
                  </div>
                  <span className="text-[10px] bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded-full font-bold">{s.indexNumber}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Teachers */}
        <Card className="p-4 border border-border bg-card shadow-xs">
          <h4 className="font-bold text-xs text-purple-600 dark:text-purple-400 uppercase tracking-widest border-b border-border pb-2 mb-3">Recently Joined Teachers</h4>
          {summary?.recentTeachers?.length === 0 ? (
            <p className="text-xs text-muted-foreground py-2">No new teachers</p>
          ) : (
            <ul className="space-y-2">
              {summary?.recentTeachers?.slice(0, 4).map((t: any, idx: number) => (
                <li key={idx} className="flex flex-col text-xs border-b border-border/20 pb-2 last:border-0 last:pb-0">
                  <p className="font-bold text-foreground">{t.name}</p>
                  <p className="text-[10px] text-muted-foreground">{t.email}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Support Staff */}
        <Card className="p-4 border border-border bg-card shadow-xs">
          <h4 className="font-bold text-xs text-rose-600 dark:text-rose-400 uppercase tracking-widest border-b border-border pb-2 mb-3">Recently Joined Support Staff</h4>
          {summary?.recentSupportStaff?.length === 0 ? (
            <p className="text-xs text-muted-foreground py-2">No new staff</p>
          ) : (
            <ul className="space-y-2">
              {summary?.recentSupportStaff?.slice(0, 4).map((st: any, idx: number) => (
                <li key={idx} className="flex justify-between items-center text-xs border-b border-border/20 pb-2 last:border-0 last:pb-0">
                  <div>
                    <p className="font-bold text-foreground">{st.name}</p>
                    <p className="text-[10px] text-muted-foreground">{st.code}</p>
                  </div>
                  <span className="text-[10px] bg-rose-500/10 text-rose-600 px-2 py-0.5 rounded-full font-bold">{st.position}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
