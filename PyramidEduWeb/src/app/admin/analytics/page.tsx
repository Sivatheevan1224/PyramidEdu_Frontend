"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  TrendingUp,
  CreditCard,
  CalendarCheck,
  Loader2,
  RefreshCw,
  BarChart3,
  Building2,
  Award,
  ShieldCheck,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import api from "@/lib/api";

interface AnalyticsData {
  summary: any;
  payments: any;
  attendance: any;
  students: any;
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [summaryRes, paymentsRes, attendanceRes, studentRes] = await Promise.all([
        api.get("/analytics/dashboard"),
        api.get("/analytics/payments"),
        api.get("/analytics/attendance"),
        api.get("/analytics/students"),
      ]);

      setData({
        summary: summaryRes.data?.data || null,
        payments: paymentsRes.data?.data || null,
        attendance: attendanceRes.data?.data || null,
        students: studentRes.data?.data || null,
      });
    } catch (err: any) {
      console.error("Failed to load analytics:", err);
      setError(err.response?.data?.message || "Failed to load real-time analytics data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">Loading real-time platform analytics...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center p-4">
        <Card className="max-w-md p-8 text-center shadow-md border-border rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-6 h-6 text-rose-600 dark:text-rose-400" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Error Loading Analytics</h3>
          <p className="mt-2 text-sm text-muted-foreground">{error || "Something went wrong."}</p>
          <Button className="mt-6 rounded-xl font-bold cursor-pointer" onClick={fetchAnalyticsData}>
            Retry Loading
          </Button>
        </Card>
      </div>
    );
  }

  const { summary, payments, attendance, students } = data;

  // Real collection trend data from backend
  const collectionTrend = payments?.collectionTrend?.map((item: any) => ({
    month: item.month ? item.month.split(" ")[0] : item.m,
    amount: item.income ?? item.paid ?? 0,
  })) || [];

  // Real attendance / class breakdown data from backend
  const batchBreakdown = students?.batchDistribution?.map((item: any) => ({
    batch: item.batchName || item.name || "Batch",
    count: item.studentCount ?? item.count ?? 0,
  })) || [];

  const totalStudents = summary?.activeStudents ?? summary?.totalStudents ?? 0;
  const totalRevenue = payments?.totalPayments ?? summary?.totalPayments ?? 0;
  const avgAttendance = attendance?.averagePercentage ?? summary?.avgAttendance ?? 0;
  const totalTeachers = summary?.activeTeachers ?? summary?.totalTeachers ?? 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
            Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time platform revenue trends, student enrollment growth, and attendance metrics.
          </p>
        </div>
        <Button
          onClick={fetchAnalyticsData}
          variant="outline"
          className="w-full sm:w-auto h-10 rounded-xl font-semibold gap-2 border-border cursor-pointer hover:bg-muted/40"
        >
          <RefreshCw className="w-4 h-4 text-muted-foreground" />
          Refresh Metrics
        </Button>
      </div>

      {/* KPI Stat Cards (Real Original Data) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Students"
          value={totalStudents.toLocaleString()}
          icon={Users}
          accent="primary"
        />
        <StatCard
          label="Total Fee Revenue"
          value={`LKR ${totalRevenue.toLocaleString()}`}
          icon={CreditCard}
          accent="secondary"
        />
        <StatCard
          label="Avg Attendance Rate"
          value={`${avgAttendance}%`}
          icon={CalendarCheck}
          accent="accent"
        />
        <StatCard
          label="Active Faculty"
          value={totalTeachers.toLocaleString()}
          icon={Building2}
          accent="warning"
        />
      </div>

      {/* Revenue Trend Chart */}
      <Card className="p-6 border border-border bg-card rounded-2xl shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg text-foreground">Fee Revenue Collection Trend</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Verified payment collections recorded by month</p>
          </div>
          <Badge variant="outline" className="rounded-lg text-xs font-semibold text-emerald-600 border-emerald-300 bg-emerald-50/50">
            Real-time Financials
          </Badge>
        </div>

        {collectionTrend.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={collectionTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `LKR ${val.toLocaleString()}`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  color: "hsl(var(--card-foreground))",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
                formatter={(val: any) => [`LKR ${Number(val).toLocaleString()}`, "Collection"]}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4, fill: "#10b981" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="py-12 text-center border border-dashed rounded-xl border-border flex flex-col items-center justify-center gap-2">
            <TrendingUp className="w-8 h-8 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">No verified payment collections recorded yet.</p>
          </div>
        )}
      </Card>

      {/* Batch Distribution & Enrollment Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Student Batch Distribution */}
        <Card className="p-6 border border-border bg-card rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-foreground">Student Batch Distribution</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Active registrations per academic batch</p>
            </div>
          </div>

          {batchBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={batchBreakdown}>
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
                <Bar dataKey="count" fill="#4f46e5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="py-12 text-center border border-dashed rounded-xl border-border flex flex-col items-center justify-center gap-2">
              <Users className="w-8 h-8 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">No batch distribution records available.</p>
            </div>
          )}
        </Card>

        {/* Real Platform Statistics Overview */}
        <Card className="p-6 border border-border bg-card rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-foreground">Platform Metrics Overview</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Summary of verified system operational totals</p>
            </div>
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          </div>

          <div className="space-y-3 my-auto">
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Total Enrolled Students</p>
                  <p className="text-[11px] text-muted-foreground">Active class registrations</p>
                </div>
              </div>
              <span className="text-sm font-extrabold text-foreground">{totalStudents}</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Total Verified Payments</p>
                  <p className="text-[11px] text-muted-foreground">Total institute revenue</p>
                </div>
              </div>
              <span className="text-sm font-extrabold text-emerald-600">LKR {totalRevenue.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400 flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Active Faculty Members</p>
                  <p className="text-[11px] text-muted-foreground">Assigned teaching staff</p>
                </div>
              </div>
              <span className="text-sm font-extrabold text-foreground">{totalTeachers}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
