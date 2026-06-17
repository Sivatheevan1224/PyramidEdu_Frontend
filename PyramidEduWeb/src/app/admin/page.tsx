"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
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
  Loader2 
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/users/admin/dashboard-stats");
        if (response.data?.success) {
          setStats(response.data.data);
        } else {
          toast.error("Failed to load dashboard statistics.");
        }
      } catch (error) {
        console.error("Error fetching admin stats:", error);
        toast.error("Failed to fetch statistics from backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time institute oversight, system health, and registrations.
        </p>
      </div>

      {/* Main Core Statistics */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-foreground/80">Institute Overview</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard 
            label="Total Students" 
            value={stats.totalStudents.toLocaleString()} 
            icon={Users} 
            accent="primary" 
          />
          <StatCard 
            label="Total Teachers" 
            value={stats.totalTeachers.toLocaleString()} 
            icon={GraduationCap} 
            accent="secondary" 
          />
          <StatCard 
            label="Total Managers" 
            value={stats.totalManagers.toLocaleString()} 
            icon={UserCog} 
            accent="accent" 
          />
          <StatCard 
            label="Total Admins" 
            value={stats.totalAdmins.toLocaleString()} 
            icon={UserCog} 
            accent="primary" 
          />
          <StatCard 
            label="Total Subjects" 
            value={stats.totalSubjects.toLocaleString()} 
            icon={BookOpen} 
            accent="secondary" 
          />
          <StatCard 
            label="Total Batches" 
            value={stats.totalBatches.toLocaleString()} 
            icon={Layers} 
            accent="accent" 
          />
        </div>
      </div>

      {/* System Resource Metrics */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-foreground/80">System Health</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard 
            label="CPU Usage" 
            value={stats.systemStats.cpuUsage} 
            icon={Cpu} 
            accent="primary" 
          />
          <StatCard 
            label="Memory Usage" 
            value={stats.systemStats.memoryUsage} 
            icon={HardDrive} 
            accent="secondary" 
          />
          <StatCard 
            label="Uptime" 
            value={stats.systemStats.uptime} 
            icon={Activity} 
            accent="accent" 
          />
        </div>
      </div>

      {/* Recent Registrations & Logs */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 border border-border bg-card shadow-elegant hover:shadow-elegant-hover transition-base">
          <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
            <h3 className="font-bold text-base">Recent Admin Registrations</h3>
            <Badge variant="outline">{stats.recentAdmins.length} Total</Badge>
          </div>
          {stats.recentAdmins.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No admins registered yet.</p>
          ) : (
            <ul className="space-y-3.5">
              {stats.recentAdmins.map((a) => (
                <li key={a.id} className="flex justify-between items-center py-2 border-b border-border/30 last:border-0 last:pb-0">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">{a.fullName}</span>
                    <span className="text-xs text-muted-foreground">{a.email}</span>
                  </div>
                  <Badge variant={a.isActive ? "default" : "secondary"}>
                    {a.isActive ? "Active" : "Inactive"}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
