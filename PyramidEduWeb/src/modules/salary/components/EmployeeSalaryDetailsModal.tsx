"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  X,
  User,
  CreditCard,
} from "lucide-react";
import { EmployeeSalaryItem } from "../types/salary.types";

interface EmployeeSalaryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: EmployeeSalaryItem | null;
}

export const EmployeeSalaryDetailsModal: React.FC<EmployeeSalaryDetailsModalProps> = ({
  isOpen,
  onClose,
  employee,
}) => {
  if (!isOpen || !employee) return null;

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
        className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-xl border border-border bg-card shadow-2xl p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" /> Employee Salary Profile
            </h3>
            <p className="text-xs text-muted-foreground">Overview of employee salary and payment status.</p>
          </div>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-5 text-xs">
          {/* Employee Info Card */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-foreground">{employee.employeeName}</h4>
                <p className="text-muted-foreground text-[11px]">{employee.position} • {employee.department}</p>
              </div>
              <Badge variant="outline" className="font-mono text-xs">{employee.staffCode}</Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-[11px]">
              <div>
                <span className="text-muted-foreground block">Role</span>
                <span className="font-semibold text-foreground">{employee.employeeRole}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Email</span>
                <span className="font-medium text-foreground">{employee.email}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">NIC Number</span>
                <span className="font-mono font-medium text-foreground">{employee.nic}</span>
              </div>
            </div>
          </div>

          {/* Salary Financial Overview */}
          <div className="p-4 rounded-xl border border-border bg-card space-y-3">
            <h5 className="font-semibold text-sm text-foreground flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-600" /> Salary & Payment Status
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
              <div className="p-3 rounded-lg bg-muted/30 border border-border/50 space-y-1">
                <span className="text-muted-foreground block">Monthly Salary</span>
                <span className="text-lg font-bold text-foreground">{formatCurrency(employee.basicSalary)}</span>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border border-border/50 space-y-1">
                <span className="text-muted-foreground block">Current Payment Status</span>
                <span className="inline-block mt-0.5">
                  <Badge variant="outline" className={employee.paymentStatus === 'PAID' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' : 'bg-amber-500/10 text-amber-600 border-amber-500/30'}>
                    {employee.paymentStatus}
                  </Badge>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-border">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
