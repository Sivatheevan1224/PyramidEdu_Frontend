"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Wallet,
  CheckCircle,
  Clock,
  AlertTriangle,
  GraduationCap,
  UserCheck,
  Users,
  DollarSign,
  TrendingUp,
  Receipt,
  Calendar,
  UserX,
  Building,
} from "lucide-react";
import { SalaryOverviewStats } from "../types/salary.types";

interface SalaryOverviewCardsProps {
  stats: SalaryOverviewStats | null;
  loading: boolean;
}

export const SalaryOverviewCards: React.FC<SalaryOverviewCardsProps> = ({ stats, loading }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(val).replace("LKR", "Rs.");
  };

  if (loading || !stats) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full max-w-full min-w-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <Card key={i} className="p-4 space-y-2 w-full max-w-full min-w-0">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-7 w-36" />
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Monthly Expense",
      value: formatCurrency(stats.totalMonthlySalaryExpense),
      icon: Wallet,
      color: "text-indigo-600 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      title: "Total Salaries Paid",
      value: formatCurrency(stats.totalSalariesPaid),
      icon: CheckCircle,
      color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Total Pending Salaries",
      value: formatCurrency(stats.totalPendingSalaries),
      icon: Clock,
      color: "text-amber-600 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Total Overdue Salaries",
      value: formatCurrency(stats.totalOverdueSalaries),
      icon: AlertTriangle,
      color: "text-rose-600 bg-rose-500/10 border-rose-500/20",
    },
    {
      title: "Teacher Salaries",
      value: formatCurrency(stats.totalTeacherSalaries),
      icon: GraduationCap,
      color: "text-blue-600 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Manager Salaries",
      value: formatCurrency(stats.totalManagerSalaries),
      icon: UserCheck,
      color: "text-purple-600 bg-purple-500/10 border-purple-500/20",
    },
    {
      title: "Support Staff Salaries",
      value: formatCurrency(stats.totalSupportStaffSalaries),
      icon: Users,
      color: "text-teal-600 bg-teal-500/10 border-teal-500/20",
    },
    {
      title: "Total Allowances",
      value: formatCurrency(stats.totalAllowances),
      icon: TrendingUp,
      color: "text-sky-600 bg-sky-500/10 border-sky-500/20",
    },
    {
      title: "Total Deductions",
      value: formatCurrency(stats.totalDeductions),
      icon: Receipt,
      color: "text-orange-600 bg-orange-500/10 border-orange-500/20",
    },
    {
      title: "Current Month Payroll",
      value: formatCurrency(stats.currentMonthPayroll),
      icon: Calendar,
      color: "text-violet-600 bg-violet-500/10 border-violet-500/20",
    },
    {
      title: "Previous Month Payroll",
      value: formatCurrency(stats.previousMonthPayroll),
      icon: DollarSign,
      color: "text-cyan-600 bg-cyan-500/10 border-cyan-500/20",
    },
    {
      title: "Today's Payments",
      value: formatCurrency(stats.todaySalaryPayments),
      icon: CheckCircle,
      color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Paid Employees",
      value: `${stats.numberPaidEmployees} Staff`,
      icon: UserCheck,
      color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Unpaid Employees",
      value: `${stats.numberUnpaidEmployees} Staff`,
      icon: UserX,
      color: "text-amber-600 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Active Employees",
      value: `${stats.numberActiveEmployees} Total`,
      icon: Building,
      color: "text-indigo-600 bg-indigo-500/10 border-indigo-500/20",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full max-w-full min-w-0">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card key={idx} className="p-4 border border-border shadow-xs hover:shadow-md transition-shadow w-full max-w-full min-w-0 overflow-hidden">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider truncate">
                  {card.title}
                </p>
                <p className="text-xl font-bold text-foreground mt-1 tracking-tight truncate">
                  {card.value}
                </p>
              </div>
              <div className={`p-2.5 rounded-xl border shrink-0 ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
