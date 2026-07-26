"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import { AnalyticsData } from "../types/payment.types";

interface PaymentAnalyticsSectionProps {
  analytics: AnalyticsData | null;
  loading: boolean;
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

export const PaymentAnalyticsSection: React.FC<PaymentAnalyticsSectionProps> = ({ analytics, loading }) => {
  if (loading || !analytics) {
    return (
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-2 w-full max-w-full min-w-0">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-5 space-y-4 w-full max-w-full min-w-0 rounded-xl border border-border/70">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-56 w-full rounded-lg" />
          </Card>
        ))}
      </div>
    );
  }

  const formatCurrencyAxis = (val: number) => {
    if (val === 0) return "Rs. 0";
    if (Math.abs(val) >= 1000000) return `Rs. ${(val / 1000000).toFixed(1)}M`;
    if (Math.abs(val) >= 1000) return `Rs. ${(val / 1000).toFixed(0)}k`;
    return `Rs. ${val}`;
  };

  const formatFullCurrency = (val?: number) => {
    if (val === undefined || val === null) return "Rs. 0";
    return `Rs. ${Number(val).toLocaleString()}`;
  };

  const hasMonthlyRevenue = Boolean(
    analytics.monthlyRevenueTrend &&
      analytics.monthlyRevenueTrend.length > 0 &&
      analytics.monthlyRevenueTrend.some((item) => Number(item.revenue || 0) > 0)
  );

  const totalMonthlyRevenue = analytics.monthlyRevenueTrend?.reduce((acc, curr) => acc + (curr.revenue || 0), 0) || 0;

  const hasDailyCollection = Boolean(
    analytics.dailyCollectionTrend &&
      analytics.dailyCollectionTrend.length > 0 &&
      analytics.dailyCollectionTrend.some((item) => Number(item.amount || 0) > 0)
  );

  const totalDailyCollection = analytics.dailyCollectionTrend?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0;

  const hasPaymentStatus = Boolean(
    analytics.paymentStatusDistribution &&
      analytics.paymentStatusDistribution.length > 0 &&
      analytics.paymentStatusDistribution.some((item) => Number(item.count || 0) > 0)
  );

  const totalStatusPayments = analytics.paymentStatusDistribution?.reduce((acc, curr) => acc + (curr.count || 0), 0) || 0;

  const hasPaymentMethod = Boolean(
    analytics.paymentMethodDistribution &&
      analytics.paymentMethodDistribution.length > 0 &&
      analytics.paymentMethodDistribution.some((item) => Number(item.count || 0) > 0 || Number(item.amount || 0) > 0)
  );

  const totalMethodTransactions = analytics.paymentMethodDistribution?.reduce((acc, curr) => acc + (curr.count || 0), 0) || 0;

  const hasFeeProgress = Boolean(
    analytics.feeCollectionProgress &&
      (Number(analytics.feeCollectionProgress.totalGenerated || 0) > 0 ||
        Number(analytics.feeCollectionProgress.totalCollected || 0) > 0 ||
        Number(analytics.feeCollectionProgress.totalOutstanding || 0) > 0)
  );

  const hasMonthlyOutstanding = Boolean(
    analytics.monthlyOutstandingAmount &&
      analytics.monthlyOutstandingAmount.length > 0 &&
      analytics.monthlyOutstandingAmount.some((item) => Number(item.outstanding || 0) > 0)
  );

  const totalOutstandingAmount = analytics.monthlyOutstandingAmount?.reduce((acc, curr) => acc + (curr.outstanding || 0), 0) || 0;

  const hasRevenueBySubject = Boolean(
    analytics.revenueBySubject &&
      analytics.revenueBySubject.length > 0 &&
      analytics.revenueBySubject.some((item) => Number(item.revenue || 0) > 0)
  );

  const totalSubjectRevenue = analytics.revenueBySubject?.reduce((acc, curr) => acc + (curr.revenue || 0), 0) || 0;

  const hasRevenueByBatch = Boolean(
    analytics.revenueByBatch &&
      analytics.revenueByBatch.length > 0 &&
      analytics.revenueByBatch.some((item) => Number(item.revenue || 0) > 0)
  );

  const totalBatchRevenue = analytics.revenueByBatch?.reduce((acc, curr) => acc + (curr.revenue || 0), 0) || 0;

  const hasAnyAnalytics =
    hasMonthlyRevenue ||
    hasDailyCollection ||
    hasPaymentStatus ||
    hasPaymentMethod ||
    hasFeeProgress ||
    hasMonthlyOutstanding ||
    hasRevenueBySubject ||
    hasRevenueByBatch;

  return (
    <div className="space-y-6 w-full max-w-full min-w-0">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-foreground">Payment & Revenue Analytics</h3>
          <p className="text-xs text-muted-foreground">Comprehensive financial breakdown, revenue distribution, and collection trends.</p>
        </div>
      </div>

      {!hasAnyAnalytics ? (
        <Card className="p-10 text-center text-muted-foreground border border-dashed rounded-xl">
          <p className="text-sm font-medium">No financial analytics data available to display for the selected period.</p>
        </Card>
      ) : (
        <div className="grid gap-6 grid-cols-1 xl:grid-cols-2 w-full max-w-full min-w-0">
          {/* 1. Monthly Revenue Trend */}
          {hasMonthlyRevenue && (
            <Card className="p-5 w-full max-w-full min-w-0 overflow-hidden border border-border/80 shadow-sm hover:shadow transition-all rounded-xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Monthly Revenue Trend</h4>
                  <p className="text-xs text-muted-foreground">Historical verified collection trends over recent months.</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  Total: {formatFullCurrency(totalMonthlyRevenue)}
                </span>
              </div>
              <div className="w-full h-[270px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.monthlyRevenueTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.6} />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={formatCurrencyAxis} tickLine={false} />
                    <Tooltip
                      formatter={(val: any) => [formatFullCurrency(val), "Revenue"]}
                      contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#revenueGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {/* 2. Daily Collection Trend */}
          {hasDailyCollection && (
            <Card className="p-5 w-full max-w-full min-w-0 overflow-hidden border border-border/80 shadow-sm hover:shadow transition-all rounded-xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Daily Collection Trend</h4>
                  <p className="text-xs text-muted-foreground">Daily payment receipts over the last 14 days.</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  Total: {formatFullCurrency(totalDailyCollection)}
                </span>
              </div>
              <div className="w-full h-[270px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.dailyCollectionTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.6} />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={formatCurrencyAxis} tickLine={false} />
                    <Tooltip
                      formatter={(val: any) => [formatFullCurrency(val), "Collected"]}
                      contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                    />
                    <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4, fill: "#3b82f6" }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {/* 3. Payment Status Distribution */}
          {hasPaymentStatus && (
            <Card className="p-5 w-full max-w-full min-w-0 overflow-hidden border border-border/80 shadow-sm hover:shadow transition-all rounded-xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Payment Status Distribution</h4>
                  <p className="text-xs text-muted-foreground">Breakdown of transaction statuses across the platform.</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  {totalStatusPayments} Transactions
                </span>
              </div>
              <div className="w-full h-[270px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.paymentStatusDistribution}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      label={(props: any) => `${props.name || props.status || 'Status'} (${((props.percent || 0) * 100).toFixed(0)}%)`}
                    >
                      {analytics.paymentStatusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(count: any, name: any, item: any) => [
                        `${count || 0} payments (${formatFullCurrency(item?.payload?.amount)})`,
                        item?.payload?.status || "Status",
                      ]}
                      contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                    />
                    <Legend fontSize={11} wrapperStyle={{ paddingTop: "8px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {/* 4. Payment Method Distribution */}
          {hasPaymentMethod && (
            <Card className="p-5 w-full max-w-full min-w-0 overflow-hidden border border-border/80 shadow-sm hover:shadow transition-all rounded-xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Payment Method Distribution</h4>
                  <p className="text-xs text-muted-foreground">Collections categorized by payment method.</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  {totalMethodTransactions} Total Payments
                </span>
              </div>
              <div className="w-full h-[270px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.paymentMethodDistribution} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.6} />
                    <XAxis dataKey="method" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                    <Tooltip
                      formatter={(count: any, name: any, item: any) => [
                        `${count || 0} transactions (${formatFullCurrency(item?.payload?.amount)})`,
                        "Volume",
                      ]}
                      contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                    />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {/* 5. Fee Collection Progress */}
          {hasFeeProgress && (
            <Card className="p-5 w-full max-w-full min-w-0 overflow-hidden border border-border/80 shadow-sm hover:shadow transition-all rounded-xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Fee Collection Progress</h4>
                  <p className="text-xs text-muted-foreground">Generated fees vs. collected vs. outstanding.</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  {analytics.feeCollectionProgress.collectionPercentage}% Rate
                </span>
              </div>
              <div className="space-y-5 pt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Overall Collection Efficiency</span>
                  <span className="font-bold text-emerald-500">{analytics.feeCollectionProgress.collectionPercentage}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-4 overflow-hidden p-0.5 border border-border/50">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, analytics.feeCollectionProgress.collectionPercentage)}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-3 pt-4 text-center border-t border-border/80">
                  <div className="p-2 rounded-lg bg-muted/40 border border-border/40">
                    <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Generated</p>
                    <p className="text-sm font-bold text-foreground mt-0.5">{formatFullCurrency(analytics.feeCollectionProgress.totalGenerated)}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium uppercase tracking-wider">Collected</p>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{formatFullCurrency(analytics.feeCollectionProgress.totalCollected)}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-500/5 border border-amber-500/20">
                    <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium uppercase tracking-wider">Outstanding</p>
                    <p className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-0.5">{formatFullCurrency(analytics.feeCollectionProgress.totalOutstanding)}</p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* 6. Monthly Outstanding Amount */}
          {hasMonthlyOutstanding && (
            <Card className="p-5 w-full max-w-full min-w-0 overflow-hidden border border-border/80 shadow-sm hover:shadow transition-all rounded-xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Monthly Outstanding Amount</h4>
                  <p className="text-xs text-muted-foreground">Pending fee balances grouped by month.</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  Total Dues: {formatFullCurrency(totalOutstandingAmount)}
                </span>
              </div>
              <div className="w-full h-[270px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.monthlyOutstandingAmount} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.6} />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={formatCurrencyAxis} tickLine={false} />
                    <Tooltip
                      formatter={(val: any) => [formatFullCurrency(val), "Outstanding"]}
                      contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                    />
                    <Bar dataKey="outstanding" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {/* 7. Revenue by Subject */}
          {hasRevenueBySubject && (
            <Card className="p-5 w-full max-w-full min-w-0 overflow-hidden border border-border/80 shadow-sm hover:shadow transition-all rounded-xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Revenue by Subject</h4>
                  <p className="text-xs text-muted-foreground">Collection performance per subject curriculum.</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  Total: {formatFullCurrency(totalSubjectRevenue)}
                </span>
              </div>
              <div className="w-full h-[270px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.revenueBySubject} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.6} />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={formatCurrencyAxis} tickLine={false} />
                    <YAxis dataKey="subjectName" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={110} tickLine={false} />
                    <Tooltip
                      formatter={(val: any) => [formatFullCurrency(val), "Revenue"]}
                      contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                    />
                    <Bar dataKey="revenue" fill="#14b8a6" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {/* 8. Revenue by Batch */}
          {hasRevenueByBatch && (
            <Card className="p-5 w-full max-w-full min-w-0 overflow-hidden border border-border/80 shadow-sm hover:shadow transition-all rounded-xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Revenue by Batch</h4>
                  <p className="text-xs text-muted-foreground">Total payments received across student batches.</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-pink-500/10 text-pink-600 dark:text-pink-400">
                  Total: {formatFullCurrency(totalBatchRevenue)}
                </span>
              </div>
              <div className="w-full h-[270px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.revenueByBatch} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.6} />
                    <XAxis dataKey="batchName" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={formatCurrencyAxis} tickLine={false} />
                    <Tooltip
                      formatter={(val: any) => [formatFullCurrency(val), "Revenue"]}
                      contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                    />
                    <Bar dataKey="revenue" fill="#ec4899" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};


