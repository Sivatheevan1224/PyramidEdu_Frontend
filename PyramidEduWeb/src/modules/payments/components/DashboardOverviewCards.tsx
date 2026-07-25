"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
  Users,
  AlertCircle,
  Calendar,
  Zap,
} from "lucide-react";
import { DashboardOverviewStats } from "../types/payment.types";

interface DashboardOverviewCardsProps {
  stats: DashboardOverviewStats | null;
  loading: boolean;
}

export const DashboardOverviewCards: React.FC<DashboardOverviewCardsProps> = ({ stats, loading }) => {
  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return "Rs. 0";
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(amount).replace("LKR", "Rs.");
  };

  const cards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats?.totalRevenue),
      icon: TrendingUp,
      accent: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-500",
      iconBg: "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20",
    },
    {
      title: "Amount Collected",
      value: formatCurrency(stats?.totalAmountCollected),
      icon: DollarSign,
      accent: "from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-500",
      iconBg: "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20",
    },
    {
      title: "Outstanding Amount",
      value: formatCurrency(stats?.totalOutstandingAmount),
      icon: AlertTriangle,
      accent: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-500",
      iconBg: "bg-amber-500/10 text-amber-500 dark:bg-amber-500/20",
    },
    {
      title: "Monthly Revenue",
      value: formatCurrency(stats?.monthlyRevenue),
      icon: Calendar,
      accent: "from-purple-500/20 to-violet-500/10 border-purple-500/30 text-purple-500",
      iconBg: "bg-purple-500/10 text-purple-500 dark:bg-purple-500/20",
    },
    {
      title: "Today's Collections",
      value: formatCurrency(stats?.todayCollections),
      icon: Zap,
      accent: "from-cyan-500/20 to-sky-500/10 border-cyan-500/30 text-cyan-500",
      iconBg: "bg-cyan-500/10 text-cyan-500 dark:bg-cyan-500/20",
    },
    {
      title: "Pending Payments",
      value: stats?.totalPendingPayments ?? 0,
      icon: Clock,
      accent: "from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-500",
      iconBg: "bg-amber-500/10 text-amber-500 dark:bg-amber-500/20",
    },
    {
      title: "Verified Payments",
      value: stats?.totalVerifiedPayments ?? 0,
      icon: CheckCircle,
      accent: "from-emerald-500/20 to-green-500/10 border-emerald-500/30 text-emerald-500",
      iconBg: "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20",
    },
    {
      title: "Rejected Payments",
      value: stats?.totalRejectedPayments ?? 0,
      icon: XCircle,
      accent: "from-rose-500/20 to-red-500/10 border-rose-500/30 text-rose-500",
      iconBg: "bg-rose-500/10 text-rose-500 dark:bg-rose-500/20",
    },
    {
      title: "Refunded Payments",
      value: stats?.totalRefundedPayments ?? 0,
      icon: RotateCcw,
      accent: "from-slate-500/20 to-zinc-500/10 border-slate-500/30 text-slate-500",
      iconBg: "bg-slate-500/10 text-slate-500 dark:bg-slate-500/20",
    },
    {
      title: "Pending Fee Students",
      value: stats?.totalStudentsPendingFees ?? 0,
      icon: Users,
      accent: "from-orange-500/20 to-amber-500/10 border-orange-500/30 text-orange-500",
      iconBg: "bg-orange-500/10 text-orange-500 dark:bg-orange-500/20",
    },
    {
      title: "Overdue Fee Students",
      value: stats?.totalStudentsOverdueFees ?? 0,
      icon: AlertCircle,
      accent: "from-red-500/20 to-rose-500/10 border-red-500/30 text-red-500",
      iconBg: "bg-red-500/10 text-red-500 dark:bg-red-500/20",
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 11 }).map((_, i) => (
          <Card key={i} className="p-4 space-y-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-7 w-36" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card
            key={idx}
            className={`p-4 relative overflow-hidden transition-all duration-200 hover:shadow-md border bg-gradient-to-br ${card.accent}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {card.title}
                </p>
                <p className="text-2xl font-bold tracking-tight mt-1 text-foreground">
                  {card.value}
                </p>
              </div>
              <div className={`p-2.5 rounded-xl ${card.iconBg}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
