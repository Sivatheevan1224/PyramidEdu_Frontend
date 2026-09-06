"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import {
  Users,
  BarChart3,
  CreditCard,
  Calendar,
  Award,
  Brain,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FileSpreadsheet,
} from "lucide-react";
import { api } from "@/lib/api";

interface ReportModule {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  to: string;
  active: boolean;
  color: string;
  bgColor: string;
  borderColor: string;
  badge?: string;
}

export default function ReportsHubPage() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await api.get("/analytics/dashboard");
      if (res.data?.success) {
        setSummary(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load reports summary:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const modules: ReportModule[] = [
    {
      title: "Parent Reports",
      description: "Manage monthly academic student reports with automated recommendations emailed directly to parents.",
      icon: Users,
      to: "/manager/parent-reports",
      active: true,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-500/10 dark:bg-emerald-500/15",
      borderColor: "border-emerald-500/20",
      badge: "Automated",
    },
    {
      title: "Analytics Reports",
      description: "Analyze student statistics, enrollments, and growth timelines over custom periods and batches.",
      icon: BarChart3,
      to: "/manager/analytics-reports",
      active: true,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10 dark:bg-blue-500/15",
      borderColor: "border-blue-500/20",
      badge: "System Wide",
    },
    {
      title: "Financial Reports",
      description: "Track subscription payments, verified collections, outstanding balances, and monthly cashflows.",
      icon: CreditCard,
      to: "/manager/financial-reports",
      active: true,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-500/10 dark:bg-amber-500/15",
      borderColor: "border-amber-500/20",
      badge: "Financial",
    },
    {
      title: "Attendance Reports",
      description: "Monitor class attendance percentages, daily check-in logs, and identify chronic student absentees.",
      icon: Calendar,
      to: "/manager/attendance-reports",
      active: true,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-500/10 dark:bg-purple-500/15",
      badge: "Live Tracking",
      borderColor: "border-purple-500/20",
    },
    {
      title: "Performance Reports",
      description: "Review academic exam and quiz grade averages across subjects, top rankers, and pass statistics.",
      icon: Award,
      to: "/manager/performance-reports",
      active: true,
      color: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-500/10 dark:bg-rose-500/15",
      borderColor: "border-rose-500/20",
      badge: "Academic",
    },
    {
      title: "AI Reports",
      description: "Predictive model analysis forecasting student standing levels, risk alerts, and improvement trajectories.",
      icon: Brain,
      to: "/manager/ai-reports",
      active: true,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-500/10 dark:bg-indigo-500/15",
      borderColor: "border-indigo-500/20",
      badge: "AI Predictive",
    },
  ];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Reports & Insights Hub</h1>
          <p className="text-muted-foreground mt-1">
            Access automated reporting modules, real-time sums, academic standings, and AI analytics.
          </p>
        </div>
        <button
          onClick={fetchSummary}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border border-border bg-card hover:bg-muted text-foreground transition-all shadow-xs w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-emerald-600" : ""}`} />
          Refresh Stats
        </button>
      </div>

      {/* Aggregate Sum / Total Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Collections Sum */}
        <Card className="p-5 border-border bg-card shadow-xs rounded-2xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Income</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {loading ? "..." : `LKR ${(summary?.totalPayments ?? 0).toLocaleString()}`}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold">Verified</span> collected payments
          </p>
        </Card>

        {/* Pending Receivables Sum */}
        <Card className="p-5 border-border bg-card shadow-xs rounded-2xl relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pending Balances</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {loading ? "..." : `LKR ${(summary?.pendingPayments ?? 0).toLocaleString()}`}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            Outstanding fees to be settled
          </p>
        </Card>

        {/* Average Attendance Sum */}
        <Card className="p-5 border-border bg-card shadow-xs rounded-2xl relative overflow-hidden group hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Avg Attendance</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-purple-600 dark:text-purple-400">
            {loading ? "..." : `${summary?.avgAttendance ?? 0}%`}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            Overall student participation rate
          </p>
        </Card>

        {/* Pass Rate Sum */}
        <Card className="p-5 border-border bg-card shadow-xs rounded-2xl relative overflow-hidden group hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Overall Pass Rate</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
            {loading ? "..." : `${summary?.passRate ?? 0}%`}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
            Avg exam score: <span className="font-semibold text-foreground">{summary?.avgMarks ?? 0}%</span>
          </p>
        </Card>
      </div>

      {/* Grid of All 6 Active Report Modules */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">Available Reporting Modules</h2>
          <span className="text-xs text-muted-foreground font-semibold">6 Modules Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod, index) => {
            const Icon = mod.icon;
            return (
              <Link key={index} href={mod.to} className="group block">
                <Card className={`p-6 h-full flex flex-col justify-between border ${mod.borderColor} bg-card hover:border-emerald-500/40 hover:shadow-lg transition-all duration-200 rounded-2xl`}>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-2xl w-fit ${mod.bgColor} ${mod.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      {mod.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                          {mod.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {mod.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {mod.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <span>Open Report</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
