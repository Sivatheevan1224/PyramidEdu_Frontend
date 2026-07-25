"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Receipt, Plus, Trash2 } from "lucide-react";
import { AllowanceItem, DeductionItem } from "../types/salary.types";
import { SalaryService } from "../services/salary.service";

interface AllowanceDeductionManagementProps {
  allowances: AllowanceItem[];
  deductions: DeductionItem[];
  onRefresh: () => void;
}

export const AllowanceDeductionManagement: React.FC<AllowanceDeductionManagementProps> = ({
  allowances,
  deductions,
  onRefresh,
}) => {
  const [newAllowanceTitle, setNewAllowanceTitle] = useState("");
  const [newAllowanceAmount, setNewAllowanceAmount] = useState("");
  const [newDeductionTitle, setNewDeductionTitle] = useState("");
  const [newDeductionAmount, setNewDeductionAmount] = useState("");

  const handleAddAllowance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAllowanceTitle.trim()) return;
    await SalaryService.createAllowance({
      title: newAllowanceTitle,
      amount: Number(newAllowanceAmount) || 0,
    });
    setNewAllowanceTitle("");
    setNewAllowanceAmount("");
    onRefresh();
  };

  const handleAddDeduction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeductionTitle.trim()) return;
    await SalaryService.createDeduction({
      title: newDeductionTitle,
      amount: Number(newDeductionAmount) || 0,
    });
    setNewDeductionTitle("");
    setNewDeductionAmount("");
    onRefresh();
  };

  const handleDeleteAllowance = async (id: string) => {
    await SalaryService.deleteAllowance(id);
    onRefresh();
  };

  const handleDeleteDeduction = async (id: string) => {
    await SalaryService.deleteDeduction(id);
    onRefresh();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-full min-w-0">
      {/* Allowances Section */}
      <Card className="p-6 space-y-4 border border-border">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" /> Active Salary Allowances
          </h3>
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">{allowances.length} Rules</Badge>
        </div>

        {/* Add Allowance Form */}
        <form onSubmit={handleAddAllowance} className="flex gap-2">
          <Input
            placeholder="Allowance Title (e.g., Housing)"
            value={newAllowanceTitle}
            onChange={(e) => setNewAllowanceTitle(e.target.value)}
            className="text-xs h-9"
          />
          <Input
            placeholder="Amount (Rs.)"
            type="number"
            value={newAllowanceAmount}
            onChange={(e) => setNewAllowanceAmount(e.target.value)}
            className="text-xs h-9 w-28"
          />
          <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1 cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> Add
          </Button>
        </form>

        <div className="space-y-2">
          {allowances.map((item) => (
            <div key={item.id} className="p-3 rounded-lg border border-border bg-muted/20 flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-foreground">{item.title}</p>
                <p className="text-[10px] text-muted-foreground">Type: {item.type} {item.percentage ? `(${item.percentage}%)` : ""}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-emerald-600">{item.amount ? `Rs. ${item.amount}` : `${item.percentage}%`}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-muted-foreground hover:text-rose-600"
                  onClick={() => handleDeleteAllowance(item.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Deductions Section */}
      <Card className="p-6 space-y-4 border border-border">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Receipt className="w-5 h-5 text-rose-600" /> Active Salary Deductions
          </h3>
          <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/20">{deductions.length} Rules</Badge>
        </div>

        {/* Add Deduction Form */}
        <form onSubmit={handleAddDeduction} className="flex gap-2">
          <Input
            placeholder="Deduction Title (e.g., EPF/ETF)"
            value={newDeductionTitle}
            onChange={(e) => setNewDeductionTitle(e.target.value)}
            className="text-xs h-9"
          />
          <Input
            placeholder="Amount (Rs.)"
            type="number"
            value={newDeductionAmount}
            onChange={(e) => setNewDeductionAmount(e.target.value)}
            className="text-xs h-9 w-28"
          />
          <Button type="submit" size="sm" className="bg-rose-600 hover:bg-rose-700 text-white text-xs gap-1 cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> Add
          </Button>
        </form>

        <div className="space-y-2">
          {deductions.map((item) => (
            <div key={item.id} className="p-3 rounded-lg border border-border bg-muted/20 flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-foreground">{item.title}</p>
                <p className="text-[10px] text-muted-foreground">Type: {item.type} {item.percentage ? `(${item.percentage}%)` : ""}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-rose-600">{item.amount ? `Rs. ${item.amount}` : `${item.percentage}%`}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-muted-foreground hover:text-rose-600"
                  onClick={() => handleDeleteDeduction(item.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
