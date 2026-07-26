"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, CreditCard, CheckCircle } from "lucide-react";
import { EmployeeSalaryItem } from "../types/salary.types";

interface ProcessPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: EmployeeSalaryItem | null;
  onProcess: (amount: number, method: string, ref?: string) => Promise<void>;
}

export const ProcessPaymentModal: React.FC<ProcessPaymentModalProps> = ({
  isOpen,
  onClose,
  employee,
  onProcess,
}) => {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("BANK_TRANSFER");
  const [reference, setReference] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (employee) {
      setAmount(employee.netSalary ? String(employee.netSalary) : "");
      setReference(`PAY-${employee.employeeId.slice(0, 8).toUpperCase()}`);
    }
  }, [employee]);

  if (!isOpen || !employee) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(amount);
    if (isNaN(val) || val <= 0) return;
    setProcessing(true);
    await onProcess(val, method, reference);
    setProcessing(false);
  };

  return (
    <div
      className="fixed inset-0 md:left-64 z-40 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in-0"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-xl border border-border bg-card shadow-2xl p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" /> Process Salary Payment
          </h3>
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="p-3 rounded-lg bg-muted/40 border border-border">
            <p className="font-bold text-foreground">{employee.employeeName}</p>
            <p className="text-muted-foreground text-[10px]">{employee.employeeRole} • {employee.staffCode}</p>
            <p className="mt-1 text-xs font-semibold text-emerald-600">
              Net Payable: Rs. {employee.netSalary.toLocaleString()}
            </p>
          </div>

          <div className="space-y-1">
            <label className="font-medium text-foreground">Disbursement Amount (LKR)</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-xs h-9 font-bold"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium text-foreground">Payment Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs font-medium text-foreground"
            >
              <option value="BANK_TRANSFER font-medium">Bank Direct Transfer</option>
              <option value="CASH">Cash Payment</option>
              <option value="CHEQUE">Cheque</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-medium text-foreground">Transaction Reference / Slip #</label>
            <Input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. TXN-998822"
              className="text-xs h-9 font-mono"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={processing} className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              {processing ? "Processing..." : "Confirm & Pay"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
