"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  X,
  User,
  Receipt,
  CreditCard,
  ShieldCheck,
  History,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { PaymentDetailsData } from "../types/payment.types";

interface PaymentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: PaymentDetailsData | null;
  loading: boolean;
  onUpdateStatus?: (paymentId: string, status: string) => void;
}

export const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  isOpen,
  onClose,
  details,
  loading,
  onUpdateStatus,
}) => {
  if (!isOpen) return null;

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (val?: number) => {
    if (val === undefined || val === null) return "Rs. 0";
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(val).replace("LKR", "Rs.");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "VERIFIED":
      case "PAID":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">Verified / Paid</Badge>;
      case "PENDING":
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30">Pending</Badge>;
      case "REJECTED":
        return <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/30">Rejected</Badge>;
      case "REFUNDED":
        return <Badge className="bg-slate-500/10 text-slate-600 border-slate-500/30">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div
      className="fixed inset-0 md:left-64 z-40 flex items-center justify-center p-4 md:p-6 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in-0"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-xl border border-border bg-card shadow-2xl p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" /> Payment Transaction Details
            </h3>
            <p className="text-xs text-muted-foreground">Detailed breakdown of payment, fee, student, and verification audit trail.</p>
          </div>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {loading || !details ? (
          <div className="space-y-4 py-6">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <div className="space-y-6 text-xs">
            {/* Student Information Section */}
            <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-3">
              <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                <User className="w-4 h-4 text-primary" /> Student Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Full Name</span>
                  <span className="font-bold text-foreground text-sm">{details.studentInfo.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Student ID / Index #</span>
                  <span className="font-mono font-semibold text-foreground">{details.studentInfo.indexNumber}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Batch & Stream</span>
                  <span className="font-medium text-foreground">{details.studentInfo.batch} • {details.studentInfo.stream}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Email</span>
                  <span className="font-medium text-foreground">{details.studentInfo.email}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Phone</span>
                  <span className="font-medium text-foreground">{details.studentInfo.phone}</span>
                </div>
              </div>
            </div>

            {/* Fee & Payment Breakdown side-by-side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Payment Info */}
              <div className="p-4 rounded-xl border border-border bg-card space-y-3">
                <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-500" /> Payment Transaction
                </h4>
                <div className="space-y-2 pt-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Invoice Number:</span>
                    <span className="font-mono font-bold text-foreground">{details.paymentInfo.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount Paid:</span>
                    <span className="font-bold text-emerald-600 text-sm">{formatCurrency(details.paymentInfo.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method:</span>
                    <span className="font-semibold uppercase">{details.paymentInfo.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Payment Status:</span>
                    <span>{getStatusBadge(details.paymentInfo.paymentStatus)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Date:</span>
                    <span className="font-medium">{formatDate(details.paymentInfo.paymentDate)}</span>
                  </div>
                </div>
              </div>

              {/* Fee Info */}
              <div className="p-4 rounded-xl border border-border bg-card space-y-3">
                <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-blue-500" /> Associated Fee
                </h4>
                <div className="space-y-2 pt-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fee Period:</span>
                    <span className="font-semibold">{formatDate(details.feeInfo.monthYear)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Month Fee:</span>
                    <span className="font-semibold text-foreground">{formatCurrency(details.feeInfo.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Paid:</span>
                    <span className="font-semibold text-emerald-600">{formatCurrency(details.feeInfo.paidAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Remaining Outstanding:</span>
                    <span className="font-bold text-amber-600">{formatCurrency(details.feeInfo.outstanding)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Due Date:</span>
                    <span className="font-medium">{formatDate(details.feeInfo.dueDate)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Information */}
            <div className="p-4 rounded-xl bg-muted/20 border border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-semibold text-foreground">Verification Record</h5>
                  <p className="text-[11px] text-muted-foreground">
                    Verified by: <span className="font-medium text-foreground">{details.verificationInfo.verifiedBy || "Pending Verification"}</span>
                    {details.verificationInfo.verifiedAt && ` on ${formatDate(details.verificationInfo.verifiedAt)}`}
                  </p>
                </div>
              </div>

              {details.paymentInfo.paymentStatus === "PENDING" && onUpdateStatus && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1"
                    onClick={() => onUpdateStatus(details.paymentInfo.id, "VERIFIED")}
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="text-xs gap-1"
                    onClick={() => onUpdateStatus(details.paymentInfo.id, "REJECTED")}
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </Button>
                </div>
              )}
            </div>

            {/* Payment History Timeline */}
            <div className="space-y-3 pt-2">
              <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                <History className="w-4 h-4 text-purple-500" /> Student Payment History
              </h4>

              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/50 font-semibold text-muted-foreground uppercase">
                    <tr>
                      <th className="px-3 py-2">Invoice #</th>
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2">Method</th>
                      <th className="px-3 py-2">Amount</th>
                      <th className="px-3 py-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {details.paymentHistory.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-3 py-4 text-center text-muted-foreground">
                          No historical payments recorded.
                        </td>
                      </tr>
                    ) : (
                      details.paymentHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/20">
                          <td className="px-3 py-2 font-mono font-medium">{item.invoiceNumber}</td>
                          <td className="px-3 py-2 text-muted-foreground">{formatDate(item.paymentDate)}</td>
                          <td className="px-3 py-2 uppercase font-medium">{item.paymentMethod}</td>
                          <td className="px-3 py-2 font-bold text-foreground">{formatCurrency(item.amount)}</td>
                          <td className="px-3 py-2 text-right">{getStatusBadge(item.paymentStatus)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t border-border">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
