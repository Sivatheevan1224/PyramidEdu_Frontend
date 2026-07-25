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
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-5 space-y-4 w-full max-w-full min-w-0 overflow-hidden">
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
          <h3 className="text-lg font-semibold tracking-tight text-foreground">Salary Financial Analytics</h3>
          <p className="text-xs text-muted-foreground">Comprehensive payroll expense, allowance, deduction, and distribution analytics.</p>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 xl:grid-cols-2 w-full max-w-full min-w-0">
        {/* 1. Monthly Salary Expense Trend */}
        <Card className="p-5 w-full max-w-full min-w-0 overflow-hidden">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-foreground">Monthly Salary Expense Trend</h4>
            <p className="text-xs text-muted-foreground">Total payroll expenditure over recent months.</p>
          </div>
          <div className="w-full min-w-0 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.monthlySalaryExpenseTrend}>
                <defs>
                  <linearGradient id="salaryGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={formatCurrency} />
                <Tooltip
                  formatter={(val: any) => [`Rs. ${Number(val || 0).toLocaleString()}`, "Expense"]}
                  contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }}
                />
                <Area type="monotone" dataKey="expense" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#salaryGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 2. Salary Expense by Employee Role */}
        <Card className="p-5 w-full max-w-full min-w-0 overflow-hidden">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-foreground">Salary Expense by Employee Role</h4>
            <p className="text-xs text-muted-foreground">Breakdown across Teachers, Managers, and Support Staff.</p>
          </div>
          <div className="w-full min-w-0 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.salaryExpenseByRole}
                  dataKey="amount"
                  nameKey="role"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  label={(props: any) => `${props.name || props.role || 'Role'} (${((props.percent || 0) * 100).toFixed(0)}%)`}
                >
                  {analytics.salaryExpenseByRole.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`Rs. ${Number(val || 0).toLocaleString()}`, "Amount"]}
                  contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }}
                />
                <Legend fontSize={11} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 3. Paid vs Pending Distribution */}
        <Card className="p-5 w-full max-w-full min-w-0 overflow-hidden">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-foreground">Paid vs Pending Salary Distribution</h4>
            <p className="text-xs text-muted-foreground">Payment fulfillment status distribution.</p>
          </div>
          <div className="w-full min-w-0 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.paidVsPendingDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="status" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={formatCurrency} />
                <Tooltip
                  formatter={(val: any) => [`Rs. ${Number(val || 0).toLocaleString()}`, "Amount"]}
                  contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }}
                />
                <Bar dataKey="amount" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 4. Salary Expense by Department */}
        <Card className="p-5 w-full max-w-full min-w-0 overflow-hidden">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-foreground">Salary Expense by Department</h4>
            <p className="text-xs text-muted-foreground">Payroll expenditure categorized by functional department.</p>
          </div>
          <div className="w-full min-w-0 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.salaryExpenseByDepartment} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={formatCurrency} />
                <YAxis dataKey="department" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={110} />
                <Tooltip
                  formatter={(val: any) => [`Rs. ${Number(val || 0).toLocaleString()}`, "Expense"]}
                  contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }}
                />
                <Bar dataKey="amount" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 5. Monthly Allowances & Deductions Trend */}
        <Card className="p-5 w-full max-w-full min-w-0 overflow-hidden">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-foreground">Monthly Allowances & Deductions Trend</h4>
            <p className="text-xs text-muted-foreground">Historical comparison of recurring allowances vs deductions.</p>
          </div>
          <div className="w-full min-w-0 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.monthlyAllowanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={formatCurrency} />
                <Tooltip
                  formatter={(val: any) => [`Rs. ${Number(val || 0).toLocaleString()}`, "Allowances"]}
                  contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }}
                />
                <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 6. Payroll Completion Progress */}
        <Card className="p-5 w-full max-w-full min-w-0 overflow-hidden">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-foreground">Payroll Completion Progress</h4>
            <p className="text-xs text-muted-foreground">Generated vs disbursed salary payments.</p>
          </div>
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-medium">Disbursement Rate</span>
              <span className="font-bold text-emerald-500">{analytics.payrollCompletionProgress.completionPercentage}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, analytics.payrollCompletionProgress.completionPercentage)}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border text-center">
              <div>
                <p className="text-xs text-muted-foreground">Total Generated</p>
                <p className="text-base font-bold text-foreground mt-0.5">Rs. {analytics.payrollCompletionProgress.totalGenerated.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Disbursed</p>
                <p className="text-base font-bold text-emerald-600 mt-0.5">Rs. {analytics.payrollCompletionProgress.totalPaid.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
