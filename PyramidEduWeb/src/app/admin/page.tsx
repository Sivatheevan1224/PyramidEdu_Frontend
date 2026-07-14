"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  GraduationCap, 
  UserCog, 
  Cpu, 
  HardDrive, 
  Activity, 
  BookOpen, 
  Layers, 
  Loader2,
  CreditCard,
  Calendar,
  Award,
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"];

interface AdminStats {
  totalStudents: number;
  totalTeachers: number;
  totalManagers: number;
  totalAdmins: number;
  totalSubjects: number;
  totalBatches: number;
  recentAdmins: Array<{
    id: string;
    fullName: string;
    email: string;
    isActive: boolean;
    createdAt: string;
  }>;
  systemStats: {
    cpuUsage: string;
    memoryUsage: string;
    uptime: string;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [studentsTrend, setStudentsTrend] = useState<any[]>([]);
  const [batchData, setBatchData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, analyticsRes, studentRes] = await Promise.all([
          api.get("/users/admin/dashboard-stats"),
          api.get("/analytics/dashboard"),
          api.get("/analytics/students"),
        ]);

        if (statsRes.data?.success) {
          setStats(statsRes.data.data);
        }
        if (analyticsRes.data?.success) {
          setAnalytics(analyticsRes.data.data);
        }
        if (studentRes.data?.success) {
          setStudentsTrend(studentRes.data.data.registrationsTrend || []);
          setBatchData(studentRes.data.data.batchDistribution || []);
        }
      } catch (error) {
        console.error("Error fetching admin stats:", error);
        toast.error("Failed to fetch dashboard metrics.");
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

  if (!stats) {
    return (
      <div className="flex h-[60vh] w-full flex-col items-center justify-center">
        <p className="text-sm font-semibold text-destructive">Error loading dashboard stats.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-xs text-primary hover:underline"
        >
          Try Refreshing
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-foreground bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
          Admin Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time institute oversight, system health, and registrations.
        </p>
      </div>

      {/* Main Core Statistics - Colorful Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        
        {/* Card 1: Students */}
        <div className="relative overflow-hidden p-6 rounded-2xl border border-blue-500/10 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 shadow-md flex justify-between items-center group hover:scale-[1.02] transition-all duration-300">
          <div className="space-y-2">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block">Active Students</span>
            <p className="text-4xl font-black text-foreground">{stats.totalStudents.toLocaleString()}</p>
            <span className="text-[10px] text-muted-foreground block">Institute Total Registrations</span>
          </div>
          <div className="p-4 rounded-2xl bg-blue-600 text-white shadow-lg group-hover:rotate-6 transition-transform">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Teachers */}
        <div className="relative overflow-hidden p-6 rounded-2xl border border-purple-500/10 bg-gradient-to-br from-purple-500/5 to-pink-500/5 shadow-md flex justify-between items-center group hover:scale-[1.02] transition-all duration-300">
          <div className="space-y-2">
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest block">Active Teachers</span>
            <p className="text-4xl font-black text-foreground">{stats.totalTeachers.toLocaleString()}</p>
            <span className="text-[10px] text-muted-foreground block">Verified staff count</span>
          </div>
          <div className="p-4 rounded-2xl bg-purple-600 text-white shadow-lg group-hover:rotate-6 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Payments */}
        <div className="relative overflow-hidden p-6 rounded-2xl border border-emerald-500/10 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 shadow-md flex justify-between items-center group hover:scale-[1.02] transition-all duration-300">
          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">Collections Volume</span>
            <p className="text-3xl font-black text-emerald-600">LKR {(analytics?.totalPayments ?? 0).toLocaleString()}</p>
            <span className="text-[10px] text-muted-foreground block">Verified transactions</span>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-600 text-white shadow-lg group-hover:rotate-6 transition-transform">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Attendance */}
        <div className="relative overflow-hidden p-6 rounded-2xl border border-indigo-500/10 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 shadow-md flex justify-between items-center group hover:scale-[1.02] transition-all duration-300">
          <div className="space-y-2">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">Avg Attendance</span>
            <p className="text-4xl font-black text-foreground">{analytics?.avgAttendance ?? 92.5}%</p>
            <span className="text-[10px] text-muted-foreground block">Monthly overall rate</span>
          </div>
          <div className="p-4 rounded-2xl bg-indigo-600 text-white shadow-lg group-hover:rotate-6 transition-transform">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Card 5: Pass Rate */}
        <div className="relative overflow-hidden p-6 rounded-2xl border border-amber-500/10 bg-gradient-to-br from-amber-500/5 to-orange-500/5 shadow-md flex justify-between items-center group hover:scale-[1.02] transition-all duration-300">
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest block">Pass Ratios</span>
            <p className="text-4xl font-black text-foreground">{analytics?.passRate ?? 78}%</p>
            <span className="text-[10px] text-muted-foreground block">Exam performance standing</span>
          </div>
          <div className="p-4 rounded-2xl bg-amber-500 text-white shadow-lg group-hover:rotate-6 transition-transform">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Card 6: Subjects */}
        <div className="relative overflow-hidden p-6 rounded-2xl border border-rose-500/10 bg-gradient-to-br from-rose-500/5 to-red-500/5 shadow-md flex justify-between items-center group hover:scale-[1.02] transition-all duration-300">
          <div className="space-y-2">
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest block">Active Courses</span>
            <p className="text-4xl font-black text-foreground">{stats.totalSubjects.toLocaleString()}</p>
            <span className="text-[10px] text-muted-foreground block">Total active subjects</span>
          </div>
          <div className="p-4 rounded-2xl bg-rose-500 text-white shadow-lg group-hover:rotate-6 transition-transform">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Visual Chart representation - Dynamic area + pie chart */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Registrations chart */}
        <Card className="p-5 lg:col-span-2 border-border shadow-sm">
          <h3 className="font-bold text-base text-foreground mb-4">Student Enrollments Growth</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={studentsTrend}>
                <defs>
                  <linearGradient id="colorAdminDashReg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="count" name="Signups" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAdminDashReg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Batch Distribution Doughnut Chart */}
        <Card className="p-5 border-border shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-foreground mb-4">Student Batch Distribution</h3>
          </div>
          <div className="h-64 flex items-center justify-center">
            {batchData.length === 0 ? (
              <p className="text-xs text-muted-foreground">No batch distribution details</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={batchData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="count"
                    nameKey="name"
                  >
                    {batchData.map((entry: any, index: number) => (
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

      {/* System Resource Metrics & Logs */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* System Health */}
        <Card className="p-6 md:col-span-1 space-y-4 border-border shadow-sm">
          <h2 className="text-base font-bold text-foreground/80 mb-2">System Health</h2>
          
          <div className="p-4 bg-muted/20 border border-border rounded-xl flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 text-blue-600 rounded-lg">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold">CPU Usage</span>
              <p className="text-lg font-black text-foreground">{stats.systemStats.cpuUsage}</p>
            </div>
          </div>
          
          <div className="p-4 bg-muted/20 border border-border rounded-xl flex items-center gap-3">
            <div className="p-2.5 bg-purple-500/10 text-purple-600 rounded-lg">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold">Memory Usage</span>
              <p className="text-lg font-black text-foreground">{stats.systemStats.memoryUsage}</p>
            </div>
          </div>
          
          <div className="p-4 bg-muted/20 border border-border rounded-xl flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-lg">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold">System Uptime</span>
              <p className="text-lg font-black text-foreground">{stats.systemStats.uptime}</p>
            </div>
          </div>
        </Card>

        {/* Recently Joined Directory */}
        <div className="md:col-span-2 grid gap-4 grid-cols-1 sm:grid-cols-2">
          {/* Students */}
          <Card className="p-4 border border-border bg-card shadow-xs">
            <h4 className="font-bold text-xs text-blue-600 dark:text-blue-400 uppercase tracking-widest border-b border-border pb-2 mb-3">Recently Joined Students</h4>
            {analytics?.recentStudents?.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">No new students</p>
            ) : (
              <ul className="space-y-2">
                {analytics?.recentStudents?.slice(0, 4).map((s: any, idx: number) => (
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
            {analytics?.recentTeachers?.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">No new teachers</p>
            ) : (
              <ul className="space-y-2">
                {analytics?.recentTeachers?.slice(0, 4).map((t: any, idx: number) => (
                  <li key={idx} className="flex flex-col text-xs border-b border-border/20 pb-2 last:border-0 last:pb-0">
                    <p className="font-bold text-foreground">{t.name}</p>
                    <p className="text-[10px] text-muted-foreground">{t.email}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Managers */}
          <Card className="p-4 border border-border bg-card shadow-xs">
            <h4 className="font-bold text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-widest border-b border-border pb-2 mb-3">Recently Joined Managers</h4>
            {analytics?.recentManagers?.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">No new managers</p>
            ) : (
              <ul className="space-y-2">
                {analytics?.recentManagers?.slice(0, 4).map((m: any, idx: number) => (
                  <li key={idx} className="flex flex-col text-xs border-b border-border/20 pb-2 last:border-0 last:pb-0">
                    <p className="font-bold text-foreground">{m.name}</p>
                    <p className="text-[10px] text-muted-foreground">{m.email}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Support Staff */}
          <Card className="p-4 border border-border bg-card shadow-xs">
            <h4 className="font-bold text-xs text-rose-600 dark:text-rose-400 uppercase tracking-widest border-b border-border pb-2 mb-3">Recently Joined Support Staff</h4>
            {analytics?.recentSupportStaff?.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">No new staff</p>
            ) : (
              <ul className="space-y-2">
                {analytics?.recentSupportStaff?.slice(0, 4).map((st: any, idx: number) => (
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
    </div>
  );
}
