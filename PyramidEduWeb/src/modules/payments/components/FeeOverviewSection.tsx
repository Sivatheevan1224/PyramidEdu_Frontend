"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Receipt,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  UserCheck,
  DollarSign,
} from "lucide-react";
import { FeeOverviewData } from "../types/payment.types";

interface FeeOverviewSectionProps {
  data: FeeOverviewData | null;
  loading: boolean;
  onViewPayment?: (paymentId: string) => void;
}

export const FeeOverviewSection: React.FC<FeeOverviewSectionProps> = ({ data, loading, onViewPayment }) => {
  const formatCurrency = (val?: number) => {
    if (val === undefined || val === null) return "Rs. 0";
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(val).replace("LKR", "Rs.");
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-4 space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-6 w-32" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-full min-w-0">
      {/* Title */}
      <div>
        <h3 className="text-lg font-semibold text-foreground tracking-tight">Fee Overview</h3>
        <p className="text-xs text-muted-foreground">Comprehensive tracking of fee generation, collection, and dues.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 border bg-gradient-to-br from-indigo-500/10 to-blue-500/5 border-indigo-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Fees Generated</p>
              <p className="text-2xl font-bold text-foreground mt-1">{formatCurrency(data.totalFeesGenerated)}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border-emerald-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Fees Collected</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{formatCurrency(data.totalFeesCollected)}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Outstanding Fees</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">{formatCurrency(data.outstandingFees)}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border bg-gradient-to-br from-rose-500/10 to-red-500/5 border-rose-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Overdue Fees</p>
              <p className="text-2xl font-bold text-rose-600 mt-1">{formatCurrency(data.overdueFees)}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Fee Status Summary Badges */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-muted/40 border border-border text-xs">
        <span className="font-semibold text-foreground">Status Breakdown:</span>
        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
          Paid Fees: {data.paidFeesCount}
        </Badge>
        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30">
          Unpaid Fees: {data.unpaidFeesCount}
        </Badge>
        <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/30">
          Partial Payments: {data.partialPaymentsCount}
        </Badge>
        <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/30">
          Overdue Fees: {data.overdueFeesCount}
        </Badge>
      </div>

      {/* 3 Activity Widgets Side-by-Side */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Recent Payments */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-500" /> Recent Payments
            </h4>
            <span className="text-[11px] text-muted-foreground">Latest 10</span>
          </div>

          <div className="space-y-2.5">
            {data.recentPayments.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">No recent payments.</p>
            ) : (
              data.recentPayments.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onViewPayment && onViewPayment(item.id)}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer text-xs"
                >
                  <div>
                    <p className="font-semibold text-foreground">{item.studentName}</p>
                    <p className="text-[11px] text-muted-foreground">{item.invoiceNumber} • {formatDate(item.paymentDate)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-600">{formatCurrency(item.amount)}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">{item.paymentMethod}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Upcoming Due Payments */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500" /> Upcoming Due Payments
            </h4>
            <span className="text-[11px] text-muted-foreground">Upcoming</span>
          </div>

          <div className="space-y-2.5">
            {data.upcomingDuePayments.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">No upcoming due payments.</p>
            ) : (
              data.upcomingDuePayments.slice(0, 6).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 text-xs">
                  <div>
                    <p className="font-semibold text-foreground">{item.studentName}</p>
                    <p className="text-[11px] text-muted-foreground">Due: {formatDate(item.dueDate)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-amber-600">{formatCurrency(item.amountDue)}</p>
                    <Badge variant="outline" className="text-[10px] py-0">{item.status}</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Overdue Students */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-500" /> Overdue Students
            </h4>
            <span className="text-[11px] text-muted-foreground">Action Required</span>
          </div>

          <div className="space-y-2.5">
            {data.overdueStudents.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">No overdue students.</p>
            ) : (
              data.overdueStudents.slice(0, 6).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg border border-rose-500/20 bg-rose-500/5 text-xs">
                  <div>
                    <p className="font-semibold text-foreground">{item.studentName}</p>
                    <p className="text-[11px] text-muted-foreground">{item.batch} • {item.indexNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-rose-600">{formatCurrency(item.amountDue)}</p>
                    <span className="text-[10px] text-rose-500 font-medium">Overdue</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
