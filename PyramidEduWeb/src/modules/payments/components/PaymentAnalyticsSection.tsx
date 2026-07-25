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
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="p-5 space-y-4 w-full max-w-full min-w-0">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-56 w-full" />
          </Card>
        ))}
      </div>
    );
  }

  const formatCurrency = (val: number) => `Rs. ${(val / 1000).toFixed(0)}k`;

  return (
    <div className="space-y-6 w-full max-w-full min-w-0">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-foreground">Payment & Revenue Analytics</h3>
          <p className="text-xs text-muted-foreground">Comprehensive financial breakdown and trend analyses.</p>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 xl:grid-cols-2 w-full max-w-full min-w-0">
        {/* 1. Monthly Revenue Trend */}
        <Card className="p-5 w-full max-w-full min-w-0 overflow-hidden">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-foreground">Monthly Revenue Trend</h4>
            <p className="text-xs text-muted-foreground">Historical verified collection trends over recent months.</p>
          </div>
          <div className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.monthlyRevenueTrend}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={formatCurrency} />
                <Tooltip
                  formatter={(val: any) => [`Rs. ${Number(val || 0).toLocaleString()}`, "Revenue"]}
                  contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#revenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 2. Daily Collection Trend */}
        <Card className="p-5 w-full max-w-full min-w-0 overflow-hidden">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-foreground">Daily Collection Trend</h4>
            <p className="text-xs text-muted-foreground">Daily payment receipts over the last 14 days.</p>
          </div>
          <div className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.dailyCollectionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={formatCurrency} />
                <Tooltip
                  formatter={(val: any) => [`Rs. ${Number(val || 0).toLocaleString()}`, "Collected"]}
                  contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }}
                />
                <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 3. Payment Status Distribution */}
        <Card className="p-5 w-full max-w-full min-w-0 overflow-hidden">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-foreground">Payment Status Distribution</h4>
            <p className="text-xs text-muted-foreground">Breakdown of transaction statuses across the platform.</p>
          </div>
          <div className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.paymentStatusDistribution}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  label={(props: any) => `${props.name || props.status || 'Status'} (${((props.percent || 0) * 100).toFixed(0)}%)`}
                >
                  {analytics.paymentStatusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(count: any, name: any, item: any) => [
                    `${count || 0} payments (Rs. ${Number(item?.payload?.amount || 0).toLocaleString()})`,
                    item?.payload?.status || "Status",
                  ]}
                  contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }}
                />
                <Legend fontSize={11} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 4. Payment Method Distribution */}
        <Card className="p-5 w-full max-w-full min-w-0 overflow-hidden">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-foreground">Payment Method Distribution</h4>
            <p className="text-xs text-muted-foreground">Collections categorized by payment method.</p>
          </div>
          <div className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.paymentMethodDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="method" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip
                  formatter={(count: any, name: any, item: any) => [
                    `${count || 0} transactions (Rs. ${Number(item?.payload?.amount || 0).toLocaleString()})`,
                    "Volume",
                  ]}
                  contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 5. Fee Collection Progress */}
        <Card className="p-5 w-full max-w-full min-w-0 overflow-hidden">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-foreground">Fee Collection Progress</h4>
            <p className="text-xs text-muted-foreground">Generated fees vs. collected vs. outstanding.</p>
          </div>
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-medium">Overall Progress</span>
              <span className="font-bold text-emerald-500">{analytics.feeCollectionProgress.collectionPercentage}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, analytics.feeCollectionProgress.collectionPercentage)}%` }}
              />
            </div>
            <div className="grid grid-cols-3 gap-2 pt-3 text-center border-t border-border">
              <div>
                <p className="text-[11px] text-muted-foreground">Generated</p>
                <p className="text-sm font-semibold text-foreground">Rs. {analytics.feeCollectionProgress.totalGenerated.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">Collected</p>
                <p className="text-sm font-semibold text-emerald-500">Rs. {analytics.feeCollectionProgress.totalCollected.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">Outstanding</p>
                <p className="text-sm font-semibold text-amber-500">Rs. {analytics.feeCollectionProgress.totalOutstanding.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* 6. Monthly Outstanding Amount */}
        <Card className="p-5 w-full max-w-full min-w-0 overflow-hidden">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-foreground">Monthly Outstanding Amount</h4>
            <p className="text-xs text-muted-foreground">Pending fee balances grouped by month.</p>
          </div>
          <div className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.monthlyOutstandingAmount}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={formatCurrency} />
                <Tooltip
                  formatter={(val: any) => [`Rs. ${Number(val || 0).toLocaleString()}`, "Outstanding"]}
                  contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }}
                />
                <Bar dataKey="outstanding" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 7. Revenue by Subject */}
        <Card className="p-5 w-full max-w-full min-w-0 overflow-hidden">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-foreground">Revenue by Subject</h4>
            <p className="text-xs text-muted-foreground">Collection performance per subject curriculum.</p>
          </div>
          <div className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.revenueBySubject} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={formatCurrency} />
                <YAxis dataKey="subjectName" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={100} />
                <Tooltip
                  formatter={(val: any) => [`Rs. ${Number(val || 0).toLocaleString()}`, "Revenue"]}
                  contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }}
                />
                <Bar dataKey="revenue" fill="#14b8a6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 8. Revenue by Batch */}
        <Card className="p-5 w-full max-w-full min-w-0 overflow-hidden">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-foreground">Revenue by Batch</h4>
            <p className="text-xs text-muted-foreground">Total payments received across student batches.</p>
          </div>
          <div className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.revenueByBatch}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="batchName" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={formatCurrency} />
                <Tooltip
                  formatter={(val: any) => [`Rs. ${Number(val || 0).toLocaleString()}`, "Revenue"]}
                  contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }}
                />
                <Bar dataKey="revenue" fill="#ec4899" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
