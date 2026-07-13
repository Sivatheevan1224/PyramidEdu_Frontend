"use client";

import React from "react";
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
  FileText,
} from "lucide-react";

interface ReportModule {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  to: string;
  active: boolean;
  color: string;
  bgColor: string;
  borderColor: string;
}

export default function ReportsHubPage() {
  const modules: ReportModule[] = [
    {
      title: "Parent Reports",
      description: "Manage monthly academic student reports with automated recommendations emailed directly to parents.",
      icon: Users,
      to: "/manager/parent-reports",
      active: true,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-500/5 dark:bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      title: "Analytics Reports",
      description: "Analyze student statistics, enrollments, and growth timelines over custom periods.",
      icon: BarChart3,
      to: "/manager/analytics-reports",
      active: true,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/5 dark:bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Financial Reports",
      description: "Track subscription payments, outstanding balances, salaries, and overall financial metrics.",
      icon: CreditCard,
      to: "#",
      active: false,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-500/5 dark:bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
    {
      title: "Attendance Reports",
      description: "Monitor class attendance percentages, individual absences, and regular logs.",
      icon: Calendar,
      to: "#",
      active: false,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-500/5 dark:bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      title: "Performance Reports",
      description: "Review academic exam, quiz, and assignment grade averages across streams and subjects.",
      icon: Award,
      to: "#",
      active: false,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-500/5 dark:bg-red-500/10",
      borderColor: "border-red-500/20",
    },
    {
      title: "AI Reports",
      description: "Advanced model-generated predictions and risk analysis for student performance drops.",
      icon: Brain,
      to: "#",
      active: false,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-500/5 dark:bg-indigo-500/10",
      borderColor: "border-indigo-500/20",
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Reports Hub</h1>
        <p className="text-muted-foreground mt-1">
          Access automated reporting tools, AI statistics, and academic performance sheets.
        </p>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod, index) => {
          const Icon = mod.icon;
          return mod.active ? (
            <Link key={index} href={mod.to} className="group block">
              <Card className={`p-6 h-full flex flex-col justify-between border ${mod.borderColor} bg-card hover:border-emerald-500/40 hover:shadow-md transition-all`}>
                <div>
                  <div className={`p-3 rounded-2xl w-fit ${mod.bgColor} ${mod.color} mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{mod.description}</p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  Manage module <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>
          ) : (
            <Card key={index} className="p-6 h-full flex flex-col justify-between border border-border bg-card opacity-70">
              <div>
                <div className={`p-3 rounded-2xl w-fit bg-muted text-muted-foreground mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-foreground">{mod.title}</h3>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-lg text-[9px] font-bold bg-muted text-muted-foreground uppercase border border-border">
                    Coming Soon
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{mod.description}</p>
              </div>
              <div className="mt-6 text-xs text-muted-foreground font-semibold">
                Feature currently locked
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
