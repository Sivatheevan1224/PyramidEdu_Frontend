"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { X, Printer, FileText, Building, CheckCircle } from "lucide-react";
import { PayslipData } from "../types/salary.types";

interface PayslipModalProps {
  isOpen: boolean;
  onClose: () => void;
  payslip: PayslipData | null;
  loading: boolean;
}

export const PayslipModal: React.FC<PayslipModalProps> = ({
  isOpen,
  onClose,
  payslip,
  loading,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(val).replace("LKR", "Rs.");
  };

  return (
    <div
      className="fixed inset-0 md:left-64 z-40 flex items-center justify-center p-4 md:p-6 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in-0"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-card shadow-2xl p-6 space-y-6 print:m-0 print:p-0 print:border-none print:shadow-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-border pb-4 print:hidden">
          <div>
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" /> Employee Payslip
            </h3>
            <p className="text-xs text-muted-foreground">Official monthly salary statement and breakdown.</p>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handlePrint} className="text-xs gap-1.5 cursor-pointer">
              <Printer className="w-3.5 h-3.5" /> Print Statement
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {loading || !payslip ? (
          <div className="space-y-4 py-6">
            <Skeleton className="h-8 w-44" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <div className="space-y-6 text-xs font-sans">
            {/* Payslip Branding Header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
                  <Building className="w-6 h-6 text-indigo-600" /> {payslip.instituteName}
                </h2>
                <p className="text-[11px] text-muted-foreground">Salary Disbursement Voucher • Confidential</p>
              </div>
              <div className="text-right">
                <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 font-mono text-xs">
                  {payslip.payslipId}
                </Badge>
                <p className="text-[10px] text-muted-foreground mt-1">Period: {payslip.salaryMonth}</p>
              </div>
            </div>

            {/* Employee Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-muted/30 border border-border">
              <div>
                <span className="text-[10px] text-muted-foreground uppercase block font-medium">Employee Name</span>
                <span className="font-bold text-foreground text-sm">{payslip.employeeName}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground uppercase block font-medium">Staff Code</span>
                <span className="font-mono font-bold text-foreground">{payslip.staffCode}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground uppercase block font-medium">Designation / Role</span>
                <span className="font-semibold text-foreground">{payslip.employeeRole} ({payslip.department})</span>
              </div>
            </div>

            {/* Salary Line Items */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase text-muted-foreground tracking-wider">Salary Computation Breakdown</h4>

              <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/50 font-semibold text-muted-foreground uppercase">
                    <tr>
                      <th className="px-4 py-2.5">Item Description</th>
                      <th className="px-4 py-2.5 text-right">Amount (LKR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-2.5 font-medium">Basic Base Salary</td>
                      <td className="px-4 py-2.5 text-right font-bold">{formatCurrency(payslip.basicSalary)}</td>
                    </tr>
                    {payslip.allowanceBreakdown.map((item, idx) => (
                      <tr key={idx} className="text-emerald-600">
                        <td className="px-4 py-2.5 font-medium">+ {item.title}</td>
                        <td className="px-4 py-2.5 text-right font-semibold">{formatCurrency(item.amount)}</td>
                      </tr>
                    ))}
                    <tr className="bg-muted/20 font-bold">
                      <td className="px-4 py-2.5">Gross Calculated Salary</td>
                      <td className="px-4 py-2.5 text-right">{formatCurrency(payslip.grossSalary)}</td>
                    </tr>
                    {payslip.deductionBreakdown.map((item, idx) => (
                      <tr key={idx} className="text-rose-600">
                        <td className="px-4 py-2.5 font-medium">- {item.title}</td>
                        <td className="px-4 py-2.5 text-right font-semibold">{formatCurrency(item.amount)}</td>
                      </tr>
                    ))}
                    <tr className="bg-indigo-500/10 font-bold text-sm text-indigo-600 dark:text-indigo-400">
                      <td className="px-4 py-3">Net Disbursed Salary</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(payslip.netSalary)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Verification Footer */}
            <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                  Payment Status: {payslip.paymentStatus} ({payslip.paymentMethod})
                </span>
              </div>
              <span className="font-mono text-[11px] text-muted-foreground">{payslip.referenceNumber}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
