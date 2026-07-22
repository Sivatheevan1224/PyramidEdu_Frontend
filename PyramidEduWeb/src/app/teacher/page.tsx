"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  CalendarCheck,
  TrendingUp,
  Upload,
  AlertTriangle,
  Loader2,
  FileText,
  ArrowRight,
  Clock,
  UserX,
  UserCheck,
  BarChart2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface DashboardData {
  summaryCards: {
    totalStudents: number;
    todayAttendance: {
      present: number;
      absent: number;
    };
    activeQuiz?: string;
    classAverage: number;
  };
  classPerformance: {
    c: string;
    marks: number;
    attendance: number;
  }[];
  recentActivities: {
    name: string;
    action: string;
    time: string;
  }[];
  todaySchedule: {
    time: string;
    grade: string;
  }[];
  atRiskStudents: {
    studentName: string;
    reason: string;
  }[];
}

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartFilter, setChartFilter] = useState<"marks" | "attendance">("marks");
  const [viewAllActivities, setViewAllActivities] = useState(false);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        const res = await api.get("/teachers/me/dashboard");
        setData(res.data.data);
        setError(null);
      } catch (err: any) {
        console.error("Failed to load teacher dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Loading dashboard statistics...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center p-4">
        <Card className="max-w-md p-8 text-center shadow-md">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
          <h3 className="mt-4 text-lg font-bold text-foreground">Error Loading Dashboard</h3>
          <p className="mt-2 text-sm text-muted-foreground">{error || "Something went wrong."}</p>
          <Button className="mt-6 font-bold" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  const { summaryCards, classPerformance, recentActivities, todaySchedule, atRiskStudents } = data;
  const displayedActivities = recentActivities.slice(0, viewAllActivities ? 20 : 5);

  const totalAttendanceCount = summaryCards.todayAttendance.present + summaryCards.todayAttendance.absent;
  const attendancePercentage = totalAttendanceCount > 0 
    ? Math.round((summaryCards.todayAttendance.present / totalAttendanceCount) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Consistent Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
          Teacher Dashboard
        </h1>
      </div>

      {/* 1. Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Students"
          value={String(summaryCards.totalStudents)}
          icon={Users}
          accent="primary"
        />

        {/* Today's Attendance Card */}
        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Today's Attendance</span>
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-sm">
              <CalendarCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {totalAttendanceCount > 0 ? `${attendancePercentage}%` : "0%"}
              </span>
              <Link href="/teacher/attendance-monitoring">
                <span className="text-[11px] font-bold text-primary hover:underline cursor-pointer">Take Now</span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200/60">
                <UserCheck className="w-3 h-3" /> {summaryCards.todayAttendance.present} Present
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200/60">
                <UserX className="w-3 h-3" /> {summaryCards.todayAttendance.absent} Absent
              </span>
            </div>
          </div>
        </Card>

        <StatCard
          label="Study Materials"
          value="Upload Notes"
          icon={Upload}
          accent="accent"
        />

        <StatCard
          label="Overall Class Average"
          value={`${summaryCards.classAverage}%`}
          icon={TrendingUp}
          accent="warning"
        />
      </div>

      {/* Main Grid Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Columns - Performance & Activities */}
        <div className="lg:col-span-2 space-y-6">
          {/* 2. Class Performance Chart */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">Class Performance Overview</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {chartFilter === "marks"
                    ? "Average scores achieved across your classes"
                    : "Average student attendance percentage by class"}
                </p>
              </div>

              {classPerformance && classPerformance.length > 0 && (
                <div className="flex bg-muted p-1 rounded-lg border border-border">
                  <button
                    onClick={() => setChartFilter("marks")}
                    className={cn(
                      "px-3 py-1 text-xs font-medium rounded-md transition-base cursor-pointer",
                      chartFilter === "marks"
                        ? "bg-card text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Marks
                  </button>
                  <button
                    onClick={() => setChartFilter("attendance")}
                    className={cn(
                      "px-3 py-1 text-xs font-medium rounded-md transition-base cursor-pointer",
                      chartFilter === "attendance"
                        ? "bg-card text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Attendance
                  </button>
                </div>
              )}
            </div>

            {classPerformance && classPerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={classPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="c" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                    domain={chartFilter === "marks" ? [40, 100] : [0, 100]}
                    tickFormatter={(val) => `${val}${chartFilter === "attendance" ? "%" : ""}`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      color: "hsl(var(--card-foreground))",
                    }}
                    formatter={(val) => [
                      `${val}${chartFilter === "attendance" ? "%" : ""}`,
                      chartFilter === "marks" ? "Average Score" : "Attendance Percentage",
                    ]}
                  />
                  <Bar
                    dataKey={chartFilter}
                    fill={chartFilter === "marks" ? "hsl(243 75% 59%)" : "hsl(142 71% 45%)"}
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="py-12 px-4 text-center border border-dashed rounded-lg border-border flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                  <BarChart2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">No Performance Data Available</h4>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    Performance trends will automatically appear here as exam scores and attendance records are recorded.
                  </p>
                </div>
                <Link href="/teacher/marks">
                  <Button size="sm" variant="outline" className="mt-1 text-xs font-semibold cursor-pointer">
                    Upload Marks
                  </Button>
                </Link>
              </div>
            )}
          </Card>

          {/* 3. Recent Student Activities */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Recent Student Activities</h3>
            </div>

            {displayedActivities.length > 0 ? (
              <div className="space-y-3">
                {displayedActivities.map((a, i) => (
                  <div
                    key={a.name + a.time + i}
                    className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/40 transition-base"
                  >
                    <div>
                      <p className="text-sm font-medium">{a.name}</p>
                      <p className="text-xs text-muted-foreground">{a.action}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatRelativeTime(a.time)}</span>
                  </div>
                ))}
                {recentActivities.length > 5 && (
                  <div className="flex justify-center mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewAllActivities(!viewAllActivities)}
                      className="text-xs font-semibold cursor-pointer"
                    >
                      {viewAllActivities ? "Show Less" : "View All Activities"}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-[150px] items-center justify-center border border-dashed rounded-lg border-border mt-4">
                <p className="text-sm text-muted-foreground">No student activities recorded</p>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column - Actions, Schedule & Alerts */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-5">
            <h3 className="font-semibold text-lg mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/teacher/attendance-monitoring" passHref className="w-full">
                <Button
                  className="w-full text-xs font-semibold py-2 px-3 justify-center gap-2 border border-border cursor-pointer"
                  variant="outline"
                >
                  <CalendarCheck className="h-4 w-4 text-secondary" />
                  Take Attendance
                </Button>
              </Link>
              <Link href="/teacher/marks" passHref className="w-full">
                <Button
                  className="w-full text-xs font-semibold py-2 px-3 justify-center gap-2 border border-border cursor-pointer"
                  variant="outline"
                >
                  <TrendingUp className="h-4 w-4 text-warning" />
                  Upload Marks
                </Button>
              </Link>
              <Link href="/teacher/notes" passHref className="w-full">
                <Button
                  className="w-full text-xs font-semibold py-2 px-3 justify-center gap-2 border border-border cursor-pointer"
                  variant="outline"
                >
                  <Upload className="h-4 w-4 text-primary" />
                  Upload Notes
                </Button>
              </Link>
            </div>
          </Card>

          {/* Today's Schedule */}
          <Card className="p-5">
            <h3 className="font-semibold text-lg mb-3">Today's Schedule</h3>
            {todaySchedule.length > 0 ? (
              <div className="space-y-3">
                {todaySchedule.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col border border-border rounded-xl p-3 bg-muted/20"
                  >
                    <span className="text-xs font-medium text-muted-foreground">{item.time}</span>
                    <span className="text-sm font-semibold mt-1">{item.grade}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex py-8 items-center justify-center border border-dashed rounded-lg border-border">
                <p className="text-xs text-muted-foreground">No classes scheduled today</p>
              </div>
            )}
          </Card>

          {/* AI Alerts / At-Risk Students */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">AI Alerts / At-Risk</h3>
              <Badge variant="destructive" className="animate-pulse-glow">
                AI Insight
              </Badge>
            </div>
            {atRiskStudents.length > 0 ? (
              <div className="space-y-3">
                {atRiskStudents.slice(0, 3).map((student, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl border border-border p-3 hover:bg-muted/40 transition-base"
                  >
                    <div>
                      <p className="text-sm font-semibold">{student.studentName}</p>
                      <p className="text-xs text-destructive mt-0.5">{student.reason}</p>
                    </div>
                    <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                  </div>
                ))}
                <div className="flex justify-end mt-2">
                  <Link href="/teacher/performance" passHref>
                    <Button variant="link" size="sm" className="text-xs font-semibold cursor-pointer p-0 h-auto">
                      View All
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex py-8 items-center justify-center border border-dashed rounded-lg border-border">
                <p className="text-xs text-muted-foreground">No alerts today</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
