"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Filter,
  RefreshCw,
  Eye,
  CreditCard,
  Edit,
  FileText,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  UserCheck,
  Users,
} from "lucide-react";
import { EmployeeSalaryItem, EmployeeSalaryFilters } from "../types/salary.types";

interface EmployeeSalaryTableProps {
  data: {
    items: EmployeeSalaryItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  filters: EmployeeSalaryFilters;
  onFilterChange: (filters: Partial<EmployeeSalaryFilters>) => void;
  onResetFilters: () => void;
  onViewDetails: (employee: EmployeeSalaryItem) => void;
  onEditSalary: (employee: EmployeeSalaryItem) => void;
  onProcessPayment: (employee: EmployeeSalaryItem) => void;
  onViewPayslip: (employee: EmployeeSalaryItem) => void;
  loading: boolean;
}

export const EmployeeSalaryTable: React.FC<EmployeeSalaryTableProps> = ({
  data,
  filters,
  onFilterChange,
  onResetFilters,
  onViewDetails,
  onEditSalary,
  onProcessPayment,
  onViewPayslip,
  loading,
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(val).replace("LKR", "Rs.");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <Badge className="bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 border-emerald-500/30">Paid</Badge>;
      case "PENDING":
        return <Badge className="bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 border-amber-500/30">Pending</Badge>;
      case "OVERDUE":
        return <Badge className="bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 border-rose-500/30">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "TEACHER":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-500/10 px-2.5 py-0.5 rounded-md border border-blue-500/20">
            <GraduationCap className="w-3 h-3" /> Teacher
          </span>
        );
      case "MANAGER":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 bg-purple-500/10 px-2.5 py-0.5 rounded-md border border-purple-500/20">
            <UserCheck className="w-3 h-3" /> Manager
          </span>
        );
      case "SUPPORT_STAFF":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 bg-teal-500/10 px-2.5 py-0.5 rounded-md border border-teal-500/20">
            <Users className="w-3 h-3" /> Support Staff
          </span>
        );
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <Card className="p-6 space-y-4 w-full max-w-full min-w-0 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Employee Salary Management</h3>
          <p className="text-xs text-muted-foreground">
            Search, filter, edit basic salaries, and process payroll for all active staff ({data.total} employees).
          </p>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-muted/30 p-3.5 rounded-xl border border-border">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name, code, email, NIC..."
            value={filters.search || ""}
            onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
            className="pl-9 h-9 text-xs bg-background"
          />
        </div>

        {/* Role Filter */}
        <div>
          <select
            value={filters.role || "ALL"}
            onChange={(e) => onFilterChange({ role: e.target.value, page: 1 })}
            className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs font-medium text-foreground focus:outline-hidden focus:ring-1 focus:ring-ring"
          >
            <option value="ALL">All Roles (Teachers, Managers, Support)</option>
            <option value="TEACHER">Teachers Only</option>
            <option value="MANAGER">Managers Only</option>
            <option value="SUPPORT_STAFF">Support Staff Only</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={filters.status || "ALL"}
            onChange={(e) => onFilterChange({ status: e.target.value, page: 1 })}
            className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs font-medium text-foreground focus:outline-hidden focus:ring-1 focus:ring-ring"
          >
            <option value="ALL">All Payment Statuses</option>
            <option value="PAID">Paid Only</option>
            <option value="PENDING">Pending Only</option>
          </select>
        </div>

        {/* Reset Button */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onResetFilters} className="h-9 text-xs w-full gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" /> Reset Filters
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-xs text-left">
          <thead className="bg-muted/50 font-semibold text-muted-foreground uppercase border-b border-border">
            <tr>
              <th className="px-4 py-3">Employee Name</th>
              <th className="px-4 py-3">Staff Code</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Basic Salary</th>
              <th className="px-4 py-3">Allowances</th>
              <th className="px-4 py-3">Deductions</th>
              <th className="px-4 py-3">Net Salary</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={10} className="px-4 py-3">
                    <Skeleton className="h-5 w-full" />
                  </td>
                </tr>
              ))
            ) : data.items.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-muted-foreground">
                  No employee salary records found matching current search or filters.
                </td>
              </tr>
            ) : (
              data.items.map((item) => (
                <tr key={item.employeeId} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-bold text-foreground">{item.employeeName}</p>
                      <p className="text-[10px] text-muted-foreground">{item.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono font-medium text-foreground">{item.staffCode}</td>
                  <td className="px-4 py-3">{getRoleBadge(item.employeeRole)}</td>
                  <td className="px-4 py-3 text-muted-foreground font-medium">{item.department}</td>
                  <td className="px-4 py-3 font-semibold text-foreground">{formatCurrency(item.basicSalary)}</td>
                  <td className="px-4 py-3 text-emerald-600 font-medium">+ {formatCurrency(item.allowances)}</td>
                  <td className="px-4 py-3 text-rose-600 font-medium">- {formatCurrency(item.deductions)}</td>
                  <td className="px-4 py-3 font-bold text-foreground text-sm">{formatCurrency(item.netSalary)}</td>
                  <td className="px-4 py-3">{getStatusBadge(item.paymentStatus)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        title="View Details"
                        onClick={() => onViewDetails(item)}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-blue-600 hover:text-blue-700 hover:bg-blue-500/10"
                        title="Edit Basic Salary"
                        onClick={() => onEditSalary(item)}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10"
                        title="Process Payment"
                        onClick={() => onProcessPayment(item)}
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-purple-600 hover:text-purple-700 hover:bg-purple-500/10"
                        title="View Payslip"
                        onClick={() => onViewPayslip(item)}
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-muted-foreground">
        <p>
          Showing {data.items.length === 0 ? 0 : (data.page - 1) * data.limit + 1} to{" "}
          {Math.min(data.page * data.limit, data.total)} of {data.total} records
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={data.page <= 1}
            onClick={() => onFilterChange({ page: data.page - 1 })}
            className="h-8 text-xs gap-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Previous
          </Button>
          <span className="font-semibold text-foreground">
            Page {data.page} of {data.totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={data.page >= data.totalPages}
            onClick={() => onFilterChange({ page: data.page + 1 })}
            className="h-8 text-xs gap-1"
          >
            Next <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
