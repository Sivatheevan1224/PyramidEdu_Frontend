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
import { SalaryAnalyticsData } from "../types/salary.types";

interface SalaryAnalyticsSectionProps {
  analytics: SalaryAnalyticsData | null;
  loading: boolean;
}

const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#ec4899", "#14b8a6"];

export const SalaryAnalyticsSection: React.FC<SalaryAnalyticsSectionProps> = ({ analytics, loading }) => {
  if (loading || !analytics) {
    return (
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-2 w-full max-w-full min-w-0">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-5 space-y-4 w-full max-w-full min-w-0 overflow-hidden border border-border/70 rounded-xl">
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

  const hasMonthlyExpense = Boolean(
    analytics.monthlySalaryExpenseTrend &&
      analytics.monthlySalaryExpenseTrend.length > 0 &&
      analytics.monthlySalaryExpenseTrend.some((item) => Number(item.expense || 0) > 0)
  );

  const totalMonthlyExpense = analytics.monthlySalaryExpenseTrend?.reduce((acc, curr) => acc + (curr.expense || 0), 0) || 0;

  const hasExpenseByRole = Boolean(
    analytics.salaryExpenseByRole &&
      analytics.salaryExpenseByRole.length > 0 &&
      analytics.salaryExpenseByRole.some((item) => Number(item.amount || 0) > 0)
  );

  const totalRoleExpense = analytics.salaryExpenseByRole?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0;

  const hasPaidVsPending = Boolean(
    analytics.paidVsPendingDistribution &&
      analytics.paidVsPendingDistribution.length > 0 &&
      analytics.paidVsPendingDistribution.some((item) => Number(item.amount || 0) > 0)
  );

  const hasExpenseByDepartment = Boolean(
    analytics.salaryExpenseByDepartment &&
      analytics.salaryExpenseByDepartment.length > 0 &&
      analytics.salaryExpenseByDepartment.some((item) => Number(item.amount || 0) > 0)
  );

  const totalDeptExpense = analytics.salaryExpenseByDepartment?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0;

  const hasAllowanceTrend = Boolean(
    analytics.monthlyAllowanceTrend &&
      analytics.monthlyAllowanceTrend.length > 0 &&
      analytics.monthlyAllowanceTrend.some((item) => Number(item.amount || 0) > 0)
  );

  const totalAllowances = analytics.monthlyAllowanceTrend?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0;

  const hasPayrollProgress = Boolean(
    analytics.payrollCompletionProgress &&
      (Number(analytics.payrollCompletionProgress.totalGenerated || 0) > 0 ||
        Number(analytics.payrollCompletionProgress.totalPaid || 0) > 0)
  );

  const hasAnyAnalytics =
    hasMonthlyExpense ||
    hasExpenseByRole ||
    hasPaidVsPending ||
    hasExpenseByDepartment ||
    hasAllowanceTrend ||
    hasPayrollProgress;

  return (
    <div className="space-y-6 w-full max-w-full min-w-0">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-foreground">Salary Financial Analytics</h3>
          <p className="text-xs text-muted-foreground">Comprehensive payroll expense, allowance, deduction, and distribution analytics.</p>
        </div>
      </div>

      {!hasAnyAnalytics ? (
        <Card className="p-10 text-center text-muted-foreground border border-dashed rounded-xl">
          <p className="text-sm font-medium">No salary analytics data available to display for the selected period.</p>
        </Card>
      ) : (
        <div className="grid gap-6 grid-cols-1 xl:grid-cols-2 w-full max-w-full min-w-0">
          {/* 1. Monthly Salary Expense Trend */}
          {hasMonthlyExpense && (
            <Card className="p-5 w-full max-w-full min-w-0 overflow-hidden border border-border/80 shadow-sm hover:shadow transition-all rounded-xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Monthly Salary Expense Trend</h4>
                  <p className="text-xs text-muted-foreground">Total payroll expenditure over recent months.</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  Total: {formatFullCurrency(totalMonthlyExpense)}
                </span>
              </div>
              <div className="w-full min-w-0 h-[270px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.monthlySalaryExpenseTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="salaryGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.6} />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={formatCurrencyAxis} tickLine={false} />
                    <Tooltip
                      formatter={(val: any) => [formatFullCurrency(val), "Expense"]}
                      contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                    />
                    <Area type="monotone" dataKey="expense" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#salaryGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {/* 2. Salary Expense by Employee Role */}
          {hasExpenseByRole && (
            <Card className="p-5 w-full max-w-full min-w-0 overflow-hidden border border-border/80 shadow-sm hover:shadow transition-all rounded-xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Salary Expense by Employee Role</h4>
                  <p className="text-xs text-muted-foreground">Breakdown across Teachers, Managers, and Support Staff.</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  Total: {formatFullCurrency(totalRoleExpense)}
                </span>
              </div>
              <div className="w-full min-w-0 h-[270px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.salaryExpenseByRole}
                      dataKey="amount"
                      nameKey="role"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      label={(props: any) => `${props.name || props.role || 'Role'} (${((props.percent || 0) * 100).toFixed(0)}%)`}
                    >
                      {analytics.salaryExpenseByRole.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [formatFullCurrency(val), "Amount"]}
                      contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                    />
                    <Legend fontSize={11} wrapperStyle={{ paddingTop: "8px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {/* 3. Paid vs Pending Distribution */}
          {hasPaidVsPending && (
            <Card className="p-5 w-full max-w-full min-w-0 overflow-hidden border border-border/80 shadow-sm hover:shadow transition-all rounded-xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Paid vs Pending Salary Distribution</h4>
                  <p className="text-xs text-muted-foreground">Payment fulfillment status distribution.</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  Fulfillment Status
                </span>
              </div>
              <div className="w-full min-w-0 h-[270px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.paidVsPendingDistribution} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.6} />
                    <XAxis dataKey="status" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={formatCurrencyAxis} tickLine={false} />
                    <Tooltip
                      formatter={(val: any) => [formatFullCurrency(val), "Amount"]}
                      contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                    />
                    <Bar dataKey="amount" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {/* 4. Salary Expense by Department */}
          {hasExpenseByDepartment && (
            <Card className="p-5 w-full max-w-full min-w-0 overflow-hidden border border-border/80 shadow-sm hover:shadow transition-all rounded-xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Salary Expense by Department</h4>
                  <p className="text-xs text-muted-foreground">Payroll expenditure categorized by functional department.</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  Total: {formatFullCurrency(totalDeptExpense)}
                </span>
              </div>
              <div className="w-full min-w-0 h-[270px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.salaryExpenseByDepartment} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.6} />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={formatCurrencyAxis} tickLine={false} />
                    <YAxis dataKey="department" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={110} tickLine={false} />
                    <Tooltip
                      formatter={(val: any) => [formatFullCurrency(val), "Expense"]}
                      contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                    />
                    <Bar dataKey="amount" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {/* 5. Monthly Allowances & Deductions Trend */}
          {hasAllowanceTrend && (
            <Card className="p-5 w-full max-w-full min-w-0 overflow-hidden border border-border/80 shadow-sm hover:shadow transition-all rounded-xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Monthly Allowances & Deductions Trend</h4>
                  <p className="text-xs text-muted-foreground">Historical comparison of recurring allowances vs deductions.</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  Total: {formatFullCurrency(totalAllowances)}
                </span>
              </div>
              <div className="w-full min-w-0 h-[270px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.monthlyAllowanceTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.6} />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={formatCurrencyAxis} tickLine={false} />
                    <Tooltip
                      formatter={(val: any) => [formatFullCurrency(val), "Allowances"]}
                      contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                    />
                    <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: "#10b981" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {/* 6. Payroll Completion Progress */}
          {hasPayrollProgress && (
            <Card className="p-5 w-full max-w-full min-w-0 overflow-hidden border border-border/80 shadow-sm hover:shadow transition-all rounded-xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Payroll Completion Progress</h4>
                  <p className="text-xs text-muted-foreground">Generated vs disbursed salary payments.</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  {analytics.payrollCompletionProgress.completionPercentage}% Rate
                </span>
              </div>
              <div className="space-y-5 pt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Disbursement Rate</span>
                  <span className="font-bold text-emerald-500">{analytics.payrollCompletionProgress.completionPercentage}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-4 overflow-hidden p-0.5 border border-border/50">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, analytics.payrollCompletionProgress.completionPercentage)}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/80 text-center">
                  <div className="p-2.5 rounded-lg bg-muted/40 border border-border/40">
                    <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Total Generated</p>
                    <p className="text-base font-bold text-foreground mt-0.5">{formatFullCurrency(analytics.payrollCompletionProgress.totalGenerated)}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium uppercase tracking-wider">Total Disbursed</p>
                    <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{formatFullCurrency(analytics.payrollCompletionProgress.totalPaid)}</p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};


