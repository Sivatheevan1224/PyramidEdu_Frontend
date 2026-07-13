"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, BadgeCheck, CreditCard, Search, ShieldCheck, UserMinus, Users } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddUserModal } from "../components/AddUserModal";
import { SearchBar } from "../components/SearchBar";
import { useUsers } from "../hooks/useUsers";
import { User } from "../types/user.types";
import { UserRole } from "../types/user.types";
import { AddStudentInput } from "../validation/user.schema";
import { api } from "@/lib/api";
import { ConfirmModal } from "@/components/ConfirmModal";

type StudentPaymentInstallment = {
  invoiceId: string;
  date: string;
  amount: number;
  method: string;
  status: "PAID" | "PENDING" | "OVERDUE";
  note: string;
};

type StudentPaymentProfile = {
  totalDue: number;
  totalPaid: number;
  balance: number;
  status: "PAID" | "PARTIAL" | "PENDING" | "OVERDUE";
  nextDueDate: string;
  guardianName: string;
  history: StudentPaymentInstallment[];
};

const buildPaymentProfile = (student: User): StudentPaymentProfile => {
  const seed = Number.parseInt(student.id, 10) || (student.indexNumber ?? "").length || 1;
  const totalDue = 24000 + (seed % 4) * 2000;
  const approved = Boolean(student.isApproved);
  const partialPaid = approved ? Math.max(12000, totalDue - 6000 - (seed % 3) * 500) : 0;
  const balance = Math.max(totalDue - partialPaid, 0);

  const history: StudentPaymentInstallment[] = approved
    ? [
        {
          invoiceId: `INV-${student.id}-001`,
          date: student.createdAt.slice(0, 10),
          amount: Math.min(12000, totalDue),
          method: "Bank Transfer",
          status: "PAID",
          note: "Admission fee cleared",
        },
        {
          invoiceId: `INV-${student.id}-002`,
          date: new Date().toISOString().slice(0, 10),
          amount: balance,
          method: "Cash",
          status: balance === 0 ? "PAID" : "PENDING",
          note: balance === 0 ? "Current term fully settled" : "Current term balance pending",
        },
      ]
    : [
        {
          invoiceId: `INV-${student.id}-001`,
          date: new Date().toISOString().slice(0, 10),
          amount: totalDue,
          method: "Pending review",
          status: "PENDING",
          note: "Awaiting payment confirmation",
        },
      ];

  const status = !approved ? "PENDING" : balance === 0 ? "PAID" : balance >= totalDue / 2 ? "PARTIAL" : "OVERDUE";

  return {
    totalDue,
    totalPaid: totalDue - balance,
    balance,
    status,
    nextDueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString().slice(0, 10),
    guardianName: `${student.lastName} Family`,
    history,
  };
};

const StatusPill = ({ label, tone }: { label: string; tone: "green" | "amber" | "red" | "slate" }) => {
  const tones = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/40",
    amber: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/40",
    red: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/40",
    slate: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800",
  };

  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>{label}</span>;
};

export interface StudentManagementPageProps {
  title?: string;
  description?: string;
}

export const StudentManagementPage: React.FC<StudentManagementPageProps> = ({
  title = "Students",
  description = "Add, approve, disable, and review student payment details.",
}) => {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentStudent, setPaymentStudent] = useState<User | null>(null);
  const [realPaymentHistory, setRealPaymentHistory] = useState<any[]>([]);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "DISABLED">("ALL");
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    isDestructive?: boolean;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const {
    users,
    isLoading,
    error,
    isModalOpen,
    isSubmitting,
    fetchUsers,
    createUser,
    toggleUserStatus,
    approveStudent,
    handleFilterChange,
    openModal,
    closeModal,
    setActiveRole,
  } = useUsers();

  useEffect(() => {
    setActiveRole("STUDENT");
    handleFilterChange({ role: "STUDENT" });
  }, [handleFilterChange, setActiveRole]);

  useEffect(() => {
    handleFilterChange({ role: "STUDENT", search: searchQuery || undefined, status: statusFilter === "ALL" ? undefined : statusFilter });
  }, [handleFilterChange, searchQuery, statusFilter]);

  const students = useMemo(() => users.filter((user) => user.role === "STUDENT"), [users]);

  const metrics = useMemo(() => {
    const approved = students.filter((student) => student.isApproved).length;
    const pendingApproval = students.filter((student) => !student.isApproved).length;
    const disabled = students.filter((student) => student.status === "DISABLED").length;
    const paid = students.filter((student) => buildPaymentProfile(student).status === "PAID").length;

    return { approved, pendingApproval, disabled, paid };
  }, [students]);

  const handleCreateStudent = useCallback(async (data: AddStudentInput) => {
    try {
      const result = await createUser({
        role: "STUDENT",
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        indexNumber: data.indexNumber,
        dateOfBirth: data.dateOfBirth,
        address: data.address,
        password: (data as any).password,
      });

      if (!result) return;

      const createdStudentId = Number(result.user.id);

      if (data.subjectIds && data.subjectIds.length > 0) {
        await Promise.all(
          data.subjectIds.map((subjectId) =>
            api.post(`/subjects/${subjectId}/enroll`, { userId: createdStudentId }),
          ),
        );
      }

      if (result.temporaryPassword) {
        await navigator.clipboard.writeText(result.temporaryPassword).catch(() => undefined);
      }

      toast.success("Student created successfully.");
      closeModal();
      await fetchUsers();
    } catch (createError) {
      console.error("Failed to create student", createError);
      toast.error("Failed to create student.");
    }
  }, [closeModal, createUser, fetchUsers]);

  const handleApprove = useCallback(async (student: User) => {
    try {
      await approveStudent(student.id);
      toast.success("Student approved successfully.");
      await fetchUsers();
    } catch (approveError) {
      console.error("Failed to approve student", approveError);
      toast.error("Failed to approve student.");
    }
  }, [approveStudent, fetchUsers]);

  const handleToggleStatus = useCallback(async (student: User) => {
    const action = student.status === "ACTIVE" ? "disable" : "enable";
    setConfirmConfig({
      isOpen: true,
      title: `${student.status === "ACTIVE" ? "Disable" : "Enable"} Student Account`,
      message: `Are you sure you want to ${action} the student ${student.firstName} ${student.lastName}?`,
      isDestructive: student.status === "ACTIVE",
      onConfirm: async () => {
        try {
          await toggleUserStatus(student.id, student.status);
          toast.success(`Student ${student.status === "ACTIVE" ? "disabled" : "enabled"} successfully.`);
          await fetchUsers();
        } catch (statusError) {
          console.error("Failed to toggle student status", statusError);
          toast.error("Failed to update student status.");
        }
      }
    });
  }, [fetchUsers, toggleUserStatus]);

  const openPaymentDetails = useCallback(async (student: User) => {
    setPaymentStudent(student);
    setIsPaymentOpen(true);
    setIsPaymentLoading(true);
    try {
      const res = await api.get(`/manager/fees/${student.id}/history`);
      if (res.data?.success) {
        setRealPaymentHistory(res.data.data.history || []);
      }
    } catch (err) {
      console.error("Failed to fetch payment history:", err);
      setRealPaymentHistory([]);
    } finally {
      setIsPaymentLoading(false);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Student Operations</p>
          <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar onSearch={setSearchQuery} placeholder="Search students..." className="w-full sm:w-72" />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
            aria-label="Filter students by status"
            className="min-w-40 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none"
          >
            <option value="ALL">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="DISABLED">Disabled</option>
          </select>
          <button
            type="button"
            onClick={openModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
            disabled={isSubmitting}
          >
            <Users className="h-4 w-4" />
            Add Student
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-900 shadow-sm dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
          <div>
            <p className="font-medium">{error}</p>
            <p className="text-sm text-red-700 dark:text-red-400/80">Please refresh and try again.</p>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Students</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">{students.length}</p>
        </Card>
        <Card className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Approved</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-600 dark:text-emerald-400">{metrics.approved}</p>
        </Card>
        <Card className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Pending Approval</p>
          <p className="mt-2 text-2xl font-semibold text-amber-600 dark:text-amber-400">{metrics.pendingApproval}</p>
        </Card>
        <Card className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Fee Cleared</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">{metrics.paid}</p>
        </Card>
      </div>

      <Card className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border bg-muted/40 px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            Student approval and payment review
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-muted/30">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Student</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Index</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Approval</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Payments</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Loading students...</td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">No students found.</td>
                </tr>
              ) : (
                students.map((student) => {
                  const payment = buildPaymentProfile(student);
                  return (
                    <tr key={student.id} className="hover:bg-muted/30">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-foreground">{student.firstName} {student.lastName}</p>
                          <p className="text-xs text-muted-foreground">{student.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">{student.indexNumber || "-"}</td>
                      <td className="px-4 py-4">
                        {student.isApproved ? (
                          <StatusPill label="Approved" tone="green" />
                        ) : (
                          <StatusPill label="Pending" tone="amber" />
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <Badge variant={payment.status === "PAID" ? "default" : payment.status === "PARTIAL" ? "secondary" : "destructive"}>
                            {payment.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground">Balance Rs. {payment.balance.toLocaleString()}.00</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={student.status === "ACTIVE" ? "default" : "secondary"}>
                          {student.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex flex-wrap justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openPaymentDetails(student)}
                            className="rounded-full border border-border bg-white dark:bg-slate-900 p-2 text-cyan-600 dark:text-cyan-400 transition-all duration-200 hover:border-cyan-200 dark:hover:border-cyan-800/80 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 hover:text-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-xs"
                            title="View Payments"
                          >
                            <CreditCard className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <AddUserModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={async (data) => handleCreateStudent(data as AddStudentInput)}
        isLoading={isSubmitting}
        activeRole={"STUDENT" as UserRole}
        onSuccess={fetchUsers}
      />

      {isPaymentOpen && paymentStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-start justify-between border-b border-border bg-muted/40 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Payment details</p>
                <h3 className="text-lg font-semibold text-foreground">{paymentStudent.firstName} {paymentStudent.lastName}</h3>
                <p className="text-sm text-muted-foreground">{paymentStudent.indexNumber || paymentStudent.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsPaymentOpen(false)}
                className="rounded-full px-3 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Close
              </button>
            </div>

            {(() => {
              const totalDue = Number((paymentStudent as any).totalFeeAmount) || 0;
              const totalPaid = realPaymentHistory
                .filter((p) => p.status === 'COMPLETED' || p.status === 'VERIFIED')
                .reduce((sum, p) => sum + Number(p.amount), 0);
              const balance = Math.max(totalDue - totalPaid, 0);
              const status = balance === 0 ? "PAID" : totalPaid > 0 ? "PARTIAL" : "UNPAID";

              return (
                <div className="grid gap-4 p-5 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Card className="rounded-xl border border-border bg-card p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Total Due</p>
                        <p className="mt-2 text-xl font-semibold text-foreground">Rs. {totalDue.toLocaleString()}.00</p>
                      </Card>
                      <Card className="rounded-xl border border-border bg-card p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Total Paid</p>
                        <p className="mt-2 text-xl font-semibold text-emerald-600 dark:text-emerald-400">Rs. {totalPaid.toLocaleString()}.00</p>
                      </Card>
                      <Card className="rounded-xl border border-border bg-card p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Outstanding</p>
                        <p className="mt-2 text-xl font-semibold text-amber-600 dark:text-amber-400">Rs. {balance.toLocaleString()}.00</p>
                      </Card>
                      <Card className="rounded-xl border border-border bg-card p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Student Status</p>
                        <div className="mt-2 flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-emerald-600" />
                          <span className="text-sm font-medium">{paymentStudent.isApproved ? "Approved" : "Pending approval"}</span>
                        </div>
                      </Card>
                    </div>
                  </div>

                  <Card className="rounded-xl border border-border bg-card p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Transaction history</p>
                        <h4 className="mt-1 text-base font-semibold text-foreground">Latest payments</h4>
                      </div>
                      <Badge variant={status === "PAID" ? "default" : status === "PARTIAL" ? "secondary" : "destructive"}>
                        {status}
                      </Badge>
                    </div>

                    <div className="mt-4 space-y-3">
                      {isPaymentLoading ? (
                        <p className="text-sm text-muted-foreground">Loading payment history...</p>
                      ) : realPaymentHistory.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No payments recorded.</p>
                      ) : (
                        realPaymentHistory.map((entry, idx) => (
                          <div key={entry.transactionId || idx} className="rounded-2xl border border-border bg-muted/20 p-3">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-semibold text-foreground">{entry.receiptNumber || entry.transactionId || 'Payment'}</p>
                                <p className="text-xs text-muted-foreground">
                                  {entry.paymentDate ? new Date(entry.paymentDate).toLocaleDateString() : '—'} · {entry.method}
                                </p>
                              </div>
                              <Badge variant={entry.status === "COMPLETED" || entry.status === "VERIFIED" ? "default" : "secondary"}>
                                {entry.status}
                              </Badge>
                            </div>
                            <p className="mt-2 text-sm font-semibold text-foreground">Rs. {entry.amount.toLocaleString()}.00</p>
                          </div>
                        ))
                      )}
                    </div>
                  </Card>
                </div>
              );
            })()}
          </Card>
        </div>
      )}
      {confirmConfig.isOpen && (
        <ConfirmModal
          isOpen={confirmConfig.isOpen}
          onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
          onConfirm={confirmConfig.onConfirm}
          title={confirmConfig.title}
          message={confirmConfig.message}
          isDestructive={confirmConfig.isDestructive}
          confirmLabel={confirmConfig.isDestructive ? "Disable" : "Enable"}
        />
      )}
    </div>
  );
};
