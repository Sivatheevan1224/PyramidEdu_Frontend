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
  RotateCcw,
  Eye,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import { PaymentItem, PaymentFiltersState } from "../types/payment.types";

interface PaymentManagementTableProps {
  data: {
    items: PaymentItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  filters: PaymentFiltersState;
  onFilterChange: (filters: Partial<PaymentFiltersState>) => void;
  onResetFilters: () => void;
  onViewDetails: (paymentId: string) => void;
  onUpdateStatus: (paymentId: string, status: string) => void;
  subjects: { id: string; subjectName: string }[];
  batches: { id: string; batchName: string }[];
  loading: boolean;
}

export const PaymentManagementTable: React.FC<PaymentManagementTableProps> = ({
  data,
  filters,
  onFilterChange,
  onResetFilters,
  onViewDetails,
  onUpdateStatus,
  subjects,
  batches,
  loading,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return <Badge className="bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 border-emerald-500/30">Verified</Badge>;
      case "PENDING":
        return <Badge className="bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 border-amber-500/30">Pending</Badge>;
      case "REJECTED":
        return <Badge className="bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 border-rose-500/30">Rejected</Badge>;
      case "REFUNDED":
        return <Badge className="bg-slate-500/10 text-slate-600 dark:bg-slate-500/20 border-slate-500/30">Refunded</Badge>;
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
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Payment Management Transactions</h3>
          <p className="text-xs text-muted-foreground">
            Search, filter, and verify live payment records ({data.total} total transactions).
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={onResetFilters} className="self-start sm:self-auto gap-2">
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Filters
        </Button>
      </div>

      {/* Filter Controls Bar */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {/* Search */}
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search student, invoice..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
            className="pl-9 text-xs"
          />
        </div>

        {/* Payment Status Filter */}
        <select
          value={filters.paymentStatus}
          onChange={(e) => onFilterChange({ paymentStatus: e.target.value, page: 1 })}
          className="h-9 px-3 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="ALL">All Payment Statuses</option>
          <option value="VERIFIED">Verified</option>
          <option value="PENDING">Pending</option>
          <option value="REJECTED">Rejected</option>
          <option value="REFUNDED">Refunded</option>
        </select>

        {/* Payment Method Filter */}
        <select
          value={filters.paymentMethod}
          onChange={(e) => onFilterChange({ paymentMethod: e.target.value, page: 1 })}
          className="h-9 px-3 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="ALL">All Methods</option>
          <option value="CASH">Cash</option>
          <option value="CARD">Card / Online</option>
          <option value="BANK_TRANSFER">Bank Transfer</option>
          <option value="SLIP">Deposit Slip</option>
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

      {/* Date Range Row */}
      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1 font-medium text-foreground">
          <Filter className="w-3.5 h-3.5" /> Date Range:
        </span>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={filters.startDate}
            onChange={(e) => onFilterChange({ startDate: e.target.value, page: 1 })}
            className="h-8 text-xs w-36"
          />
          <span>to</span>
          <Input
            type="date"
            value={filters.endDate}
            onChange={(e) => onFilterChange({ endDate: e.target.value, page: 1 })}
            className="h-8 text-xs w-36"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-xs text-left">
          <thead className="bg-muted/50 font-semibold text-muted-foreground border-b border-border uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">Invoice #</th>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Subject / Batch</th>
              <th className="px-4 py-3">
                <button
                  onClick={() =>
                    onFilterChange({
                      sortBy: "amount",
                      sortOrder: filters.sortBy === "amount" && filters.sortOrder === "desc" ? "asc" : "desc",
                    })
                  }
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  Amount <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">
                <button
                  onClick={() =>
                    onFilterChange({
                      sortBy: "paymentDate",
                      sortOrder: filters.sortBy === "paymentDate" && filters.sortOrder === "desc" ? "asc" : "desc",
                    })
                  }
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  Payment Date <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="px-4 py-3">Verified By</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx}>
                  <td colSpan={9} className="px-4 py-4">
                    <Skeleton className="h-4 w-full" />
                  </td>
                </tr>
              ))
            ) : data.items.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                  No payment transactions found matching the specified filters.
                </td>
              </tr>
            ) : (
              data.items.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono font-medium text-foreground">{item.invoiceNumber}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-foreground">{item.studentName}</div>
                    <div className="text-[11px] text-muted-foreground">{item.indexNumber}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-foreground">{item.subject}</div>
                    <div className="text-[11px] text-muted-foreground">{item.batch}</div>
                  </td>
                  <td className="px-4 py-3 font-bold text-foreground">{formatCurrency(item.amount)}</td>
                  <td className="px-4 py-3 uppercase tracking-wider font-medium text-muted-foreground">
                    {item.paymentMethod}
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(item.paymentStatus)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(item.paymentDate)}</td>
                  <td className="px-4 py-3">
                    <div className="text-foreground font-medium">{item.verifiedBy}</div>
                    <div className="text-[11px] text-muted-foreground">{formatDate(item.verifiedAt)}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        title="View Details"
                        onClick={() => onViewDetails(item.id)}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      {item.paymentStatus === "PENDING" && (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10"
                            title="Verify Payment"
                            onClick={() => onUpdateStatus(item.id, "VERIFIED")}
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-rose-600 hover:text-rose-700 hover:bg-rose-500/10"
                            title="Reject Payment"
                            onClick={() => onUpdateStatus(item.id, "REJECTED")}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </Button>
                        </>
                      )}
                    </div>
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
          {Math.min(filters.page * filters.limit, data.total)} of {data.total} records
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
