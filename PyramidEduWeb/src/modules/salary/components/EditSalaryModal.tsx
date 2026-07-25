"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Edit, DollarSign } from "lucide-react";
import { EmployeeSalaryItem } from "../types/salary.types";

interface EditSalaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: EmployeeSalaryItem | null;
  onSave: (newSalary: number, reason?: string) => Promise<void>;
}

export const EditSalaryModal: React.FC<EditSalaryModalProps> = ({
  isOpen,
  onClose,
  employee,
  onSave,
}) => {
  const [newSalary, setNewSalary] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (employee) {
      setNewSalary(employee.basicSalary ? String(employee.basicSalary) : "");
      setReason("");
    }
  }, [employee]);

  if (!isOpen || !employee) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(newSalary);
    if (isNaN(val) || val < 0) return;
    setSaving(true);
    await onSave(val, reason);
    setSaving(false);
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
            <Edit className="w-4 h-4 text-blue-600" /> Revise Basic Salary
          </h3>
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <p className="font-semibold text-foreground">{employee.employeeName}</p>
            <p className="text-muted-foreground text-[11px]">{employee.employeeRole} • {employee.staffCode}</p>
          </div>

          <div className="space-y-1">
            <label className="font-medium text-foreground">New Basic Salary (LKR)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-muted-foreground">Rs.</span>
              <Input
                type="number"
                value={newSalary}
                onChange={(e) => setNewSalary(e.target.value)}
                placeholder="e.g. 150000"
                className="pl-10 text-xs h-9 font-bold"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-medium text-foreground">Revision Reason / Note</label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Annual performance increment"
              className="text-xs h-9"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
              {saving ? "Saving..." : "Update Salary"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
