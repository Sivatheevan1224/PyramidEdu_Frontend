"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Play, CheckCircle, RefreshCw, Layers } from "lucide-react";
import { SalaryOverviewStats } from "../types/salary.types";

interface MonthlyPayrollSectionProps {
  stats: SalaryOverviewStats | null;
  onGeneratePayroll: () => void;
}

export const MonthlyPayrollSection: React.FC<MonthlyPayrollSectionProps> = ({ stats, onGeneratePayroll }) => {
  const [generating, setGenerating] = useState(false);

  const formatCurrency = (val?: number) => {
    if (!val) return "Rs. 0";
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(val).replace("LKR", "Rs.");
  };

  const handleGenerate = async () => {
    setGenerating(true);
    await onGeneratePayroll();
    setGenerating(false);
  };

  return (
    <div className="space-y-6 w-full max-w-full min-w-0">
      <Card className="p-6 border border-border bg-gradient-to-br from-indigo-500/5 via-card to-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-indigo-500/10 text-indigo-600 border-indigo-500/30">Active Batch</Badge>
              <span className="text-xs font-semibold text-muted-foreground">
                {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
            </div>
            <h3 className="text-lg font-bold text-foreground mt-1 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" /> Monthly Payroll Execution
            </h3>
            <p className="text-xs text-muted-foreground">
              Generate and process monthly salary disbursements across Teachers, Managers, and Support Staff.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5 cursor-pointer"
              onClick={handleGenerate}
              disabled={generating}
            >
              <Play className={`w-3.5 h-3.5 ${generating ? "animate-spin" : ""}`} />
              {generating ? "Generating..." : "Generate Monthly Payroll"}
            </Button>
          </div>
        </div>

        {/* Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-background border border-border space-y-1">
            <p className="text-[11px] font-medium text-muted-foreground uppercase">Eligible Employees</p>
            <p className="text-xl font-bold text-foreground">{stats?.numberActiveEmployees || 0} Staff</p>
          </div>

          <div className="p-4 rounded-xl bg-background border border-border space-y-1">
            <p className="text-[11px] font-medium text-muted-foreground uppercase">Gross Monthly Salary</p>
            <p className="text-xl font-bold text-foreground">{formatCurrency((stats?.totalMonthlySalaryExpense || 0) + (stats?.totalAllowances || 0))}</p>
          </div>

          <div className="p-4 rounded-xl bg-background border border-border space-y-1">
            <p className="text-[11px] font-medium text-muted-foreground uppercase">Total Allowances</p>
            <p className="text-xl font-bold text-emerald-600">{formatCurrency(stats?.totalAllowances)}</p>
          </div>

          <div className="p-4 rounded-xl bg-background border border-border space-y-1">
            <p className="text-[11px] font-medium text-muted-foreground uppercase">Total Net Salary</p>
            <p className="text-xl font-bold text-indigo-600">{formatCurrency(stats?.totalMonthlySalaryExpense)}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
