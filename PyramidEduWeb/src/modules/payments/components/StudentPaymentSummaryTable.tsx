"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  RotateCcw,
  Eye,
  ChevronLeft,
  ChevronRight,
  UserCheck,
} from "lucide-react";
import { StudentSummaryItem, StudentSummaryFiltersState } from "../types/payment.types";

interface StudentPaymentSummaryTableProps {
  data: {
    items: StudentSummaryItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  filters: StudentSummaryFiltersState;
  onFilterChange: (filters: Partial<StudentSummaryFiltersState>) => void;
  onResetFilters: () => void;
  onViewDetails: (studentId: string) => void;
  subjects: { id: string; subjectName: string }[];
  batches: { id: string; batchName: string }[];
  loading: boolean;
}

export const StudentPaymentSummaryTable: React.FC<StudentPaymentSummaryTableProps> = ({
  data,
  filters,
  onFilterChange,
  onResetFilters,
  onViewDetails,
  subjects,
  batches,
  loading,
}) => {
  const getStatusBadge = (status: string, unpaidMonthsCount?: number) => {
    if (unpaidMonthsCount && unpaidMonthsCount >= 3) {
      return <Badge className="bg-red-600 text-white font-bold animate-pulse">3-Month Unpaid (Restricted)</Badge>;
    }
    switch (status) {
      case "PAID":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">Paid</Badge>;
      case "PARTIAL":
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/30">Partial</Badge>;
      case "UNPAID":
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30">Unpaid</Badge>;
      case "OVERDUE":
        return <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/30">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(val).replace("LKR", "Rs.");
  };

  return (
    <Card className="p-6 space-y-4 w-full max-w-full min-w-0 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Student Payment Summary</h3>
          <p className="text-xs text-muted-foreground">
            Per-student balance overview and fee statuses ({data.total} students).
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={onResetFilters} className="self-start sm:self-auto gap-2">
          <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
        </Button>
      </div>

      {/* Filter Controls Bar */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search student name, index..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
            className="pl-9 text-xs"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ status: e.target.value, page: 1 })}
          className="h-9 px-3 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="ALL">All Fee Statuses</option>
          <option value="PAID">Paid</option>
          <option value="UNPAID">Unpaid</option>
          <option value="PARTIAL">Partial</option>
          <option value="OVERDUE">Overdue</option>
        </select>

        {/* Subject Filter */}
        <select
          value={filters.subjectId}
          onChange={(e) => onFilterChange({ subjectId: e.target.value, page: 1 })}
          className="h-9 px-3 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="ALL">All Subjects</option>
          {Array.isArray(subjects) && subjects.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.subjectName}
            </option>
          ))}
        </select>

        {/* Batch Filter */}
        <select
          value={filters.batchId}
          onChange={(e) => onFilterChange({ batchId: e.target.value, page: 1 })}
          className="h-9 px-3 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="ALL">All Batches</option>
          {Array.isArray(batches) && batches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.batchName}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-xs text-left">
          <thead className="bg-muted/50 font-semibold text-muted-foreground border-b border-border uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">Student Name</th>
              <th className="px-4 py-3">Index #</th>
              <th className="px-4 py-3">Batch</th>
              <th className="px-4 py-3">Total Fee</th>
              <th className="px-4 py-3">Total Paid</th>
              <th className="px-4 py-3">Remaining Balance</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Last Payment Date</th>
              <th className="px-4 py-3">Due Date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx}>
                  <td colSpan={10} className="px-4 py-4">
                    <Skeleton className="h-4 w-full" />
                  </td>
                </tr>
              ))
            ) : data.items.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-muted-foreground">
                  No student payment records found.
                </td>
              </tr>
            ) : (
              data.items.map((item) => (
                <tr key={item.studentId} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-foreground">{item.studentName}</div>
                    <div className="text-[11px] text-muted-foreground">{item.email}</div>
                  </td>
                  <td className="px-4 py-3 font-mono font-medium">{item.indexNumber}</td>
                  <td className="px-4 py-3 font-medium text-muted-foreground">{item.batchName}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{formatCurrency(item.totalFee)}</td>
                  <td className="px-4 py-3 font-semibold text-emerald-600">{formatCurrency(item.totalPaid)}</td>
                  <td className="px-4 py-3 font-bold text-amber-600">
                    {formatCurrency(item.remainingBalance)}
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(item.paymentStatus, (item as any).unpaidMonthsCount)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(item.lastPaymentDate)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(item.dueDate)}</td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs gap-1.5"
                      onClick={() => onViewDetails(item.studentId)}
                    >
                      <Eye className="w-3.5 h-3.5" /> View Details
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs text-muted-foreground">
        <div>
          Showing {data.items.length > 0 ? (filters.page - 1) * filters.limit + 1 : 0} to{" "}
          {Math.min(filters.page * filters.limit, data.total)} of {data.total} students
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={filters.page <= 1 || loading}
            onClick={() => onFilterChange({ page: filters.page - 1 })}
            className="h-8 px-2.5 gap-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Previous
          </Button>
          <span className="font-semibold text-foreground">
            Page {filters.page} of {data.totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={filters.page >= data.totalPages || loading}
            onClick={() => onFilterChange({ page: filters.page + 1 })}
            className="h-8 px-2.5 gap-1"
          >
            Next <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
