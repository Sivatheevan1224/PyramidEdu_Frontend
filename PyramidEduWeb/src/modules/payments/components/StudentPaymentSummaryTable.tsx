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
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-rose-600 text-white shadow-xs whitespace-nowrap animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
          3-Month Unpaid (Restricted)
        </span>
      );
    }
    switch (status) {
      case "PAID":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 whitespace-nowrap">
            Paid
          </span>
        );
      case "PARTIAL":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/30 whitespace-nowrap">
            Partial
          </span>
        );
      case "UNPAID":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/30 whitespace-nowrap">
            Unpaid
          </span>
        );
      case "OVERDUE":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-600 border border-rose-500/30 whitespace-nowrap">
            Overdue
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border border-border whitespace-nowrap">
            {status}
          </span>
        );
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
          <thead className="bg-muted/50 font-semibold text-muted-foreground border-b border-border uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap min-w-[180px]">Student Name</th>
              <th className="px-4 py-3 whitespace-nowrap min-w-[130px]">Index #</th>
              <th className="px-4 py-3 whitespace-nowrap min-w-[100px]">Batch</th>
              <th className="px-4 py-3 whitespace-nowrap min-w-[100px]">Total Fee</th>
              <th className="px-4 py-3 whitespace-nowrap min-w-[100px]">Total Paid</th>
              <th className="px-4 py-3 whitespace-nowrap min-w-[130px]">Remaining Balance</th>
              <th className="px-4 py-3 whitespace-nowrap min-w-[210px]">Status</th>
              <th className="px-4 py-3 whitespace-nowrap min-w-[125px]">Last Payment</th>
              <th className="px-4 py-3 whitespace-nowrap min-w-[110px]">Due Date</th>
              <th className="px-4 py-3 whitespace-nowrap min-w-[110px] text-right">Actions</th>
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
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-semibold text-foreground">{item.studentName}</div>
                    <div className="text-[11px] text-muted-foreground">{item.email}</div>
                    {item.freeCardType === "FREE_CARD" && (
                      <span className="inline-flex items-center gap-1 mt-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                        🏅 Free Card (100% Off)
                      </span>
                    )}
                    {item.freeCardType === "HALF_CARD" && (
                      <span className="inline-flex items-center gap-1 mt-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50">
                        🥈 Half Card (50% Off)
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono font-medium whitespace-nowrap">{item.indexNumber}</td>
                  <td className="px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">{item.batchName}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-medium text-foreground">{formatCurrency(item.totalFee)}</div>
                    {item.freeCardType === "FREE_CARD" && (
                      <span className="text-[10px] text-emerald-600 font-semibold block">Waived (Rs. 0)</span>
                    )}
                    {item.freeCardType === "HALF_CARD" && (
                      <span className="text-[10px] text-blue-600 font-semibold block">50% Discounted</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold text-emerald-600 whitespace-nowrap">{formatCurrency(item.totalPaid)}</td>
                  <td className="px-4 py-3 font-bold text-amber-600 whitespace-nowrap">
                    {formatCurrency(item.remainingBalance)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{getStatusBadge(item.paymentStatus, (item as any).unpaidMonthsCount)}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDate(item.lastPaymentDate)}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDate(item.dueDate)}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
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
