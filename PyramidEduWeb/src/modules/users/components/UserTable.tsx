/**
 * UserTable - Responsive data table for users
 */

"use client";

import React from "react";
import { User, UserRole } from "../types/user.types";
import { UserStatusBadge } from "./UserStatusBadge";
import { ActionMenu, ActionMenuItem } from "./ActionMenu";
import { UserAvatar } from "./UserAvatar";
import {
  Edit2,
  CheckCircle,
  XCircle,
  Eye,
  CreditCard,
  BadgeCheck,
  UserMinus,
  ChevronUp,
  ChevronDown,
  Key,
} from "lucide-react";

interface UserTableProps {
  users: User[];
  isLoading?: boolean;
  activeRole?: UserRole;
  onEdit?: (user: User) => void;
  onToggleStatus?: (user: User) => void;
  onDelete?: (user: User) => void;
  onView?: (user: User) => void;
  onViewPayment?: (user: User) => void;
  onApprove?: (user: User) => void;
  onResetPassword?: (user: User) => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (column: string) => void;
  isSubmitting?: boolean;
}

const LoadingSkeleton = ({ activeRole }: { activeRole?: UserRole }) => {
  const colCount = (activeRole === undefined || activeRole === 'MANAGER') ? 4 : 5;
  return (
    <tr className="border-b border-border hover:bg-muted/40">
      {[...Array(colCount)].map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-muted rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
};

const SortIcon = ({
  column,
  sortBy,
  sortOrder,
}: {
  column: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  if (sortBy !== column) return <div className="w-4 h-4" />;
  return sortOrder === "asc" ? (
    <ChevronUp className="w-4 h-4 text-emerald-600" />
  ) : (
    <ChevronDown className="w-4 h-4 text-emerald-600" />
  );
};

const TableHeader = ({
  label,
  column,
  onSort,
  sortBy,
  sortOrder,
  sortable = true,
}: {
  label: string;
  column: string;
  onSort?: (col: string) => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  sortable?: boolean;
}) => (
  <button
    onClick={() => sortable && onSort?.(column)}
    disabled={!sortable}
    className="
      flex items-center gap-2 font-semibold text-muted-foreground text-sm
      hover:text-foreground transition-colors
      disabled:cursor-default disabled:hover:text-muted-foreground
    "
  >
    {label}
    {sortable && (
      <SortIcon column={column} sortBy={sortBy} sortOrder={sortOrder} />
    )}
  </button>
);

const formatSalary = (value?: number) =>
  value ? new Intl.NumberFormat("en-US").format(value) : "-";

const roleLabel = (role?: UserRole) => {
  switch (role) {
    case "MANAGER":
      return "Manager";
    case "TEACHER":
      return "Teacher";
    case "SUPPORT_STAFF":
      return "Support Staff";
    case "STUDENT":
      return "Student";
    default:
      return "User";
  }
};

const getDetailsHeaderLabel = (role?: UserRole) => {
  switch (role) {
    case "MANAGER":
      return "Manager Details";
    case "TEACHER":
      return "Subject";
    case "SUPPORT_STAFF":
      return "Support Staff Details";
    case "STUDENT":
      return "Student Details";
    default:
      return "Details";
  }
};

const detailChip = (label: string, value: string) => (
  <div className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800/60 dark:bg-slate-900/60 px-3 py-2.5">
    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{label}</p>
    <p className="mt-0.5 text-sm font-medium text-slate-800 dark:text-slate-200">{value}</p>
  </div>
);

const detailLine = (label: string, value: string) => (
  <span>
    <span className="font-semibold text-slate-500 dark:text-slate-400">{label}:</span> {value}
  </span>
);

const renderRoleDetails = (user: User) => {
  switch (user.role) {
    case "MANAGER":
      return (
        <div className="space-y-1 text-sm leading-6 text-slate-700 dark:text-slate-300">
          {detailChip("Department", user.department || "-")}
          {detailChip("Salary", formatSalary(user.managerSalary ?? user.salary))}
        </div>
      );
    case "TEACHER":
      return (
        <div className="space-y-1 text-sm leading-6 text-slate-700 dark:text-slate-300">
          {detailChip("Subject", user.subject || "-")}
          {detailChip("Salary", formatSalary(user.salary))}
        </div>
      );
    case "SUPPORT_STAFF":
      return (
        <div className="space-y-1 text-sm leading-6 text-slate-700 dark:text-slate-300">
          {detailChip("Role Type", user.roleType || "-")}
          {detailChip("Salary", formatSalary(user.salary))}
        </div>
      );
    case "STUDENT":
      return (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm leading-6 text-slate-700 dark:text-slate-300">
          <span>{detailLine("Index Number", user.indexNumber || "-")}</span>
          <span>{detailLine("Date of Birth", user.dateOfBirth || "-")}</span>
          <span>{detailLine("Address", user.address || "-")}</span>
          <span>{detailLine("Approval", user.isApproved ? "Approved" : "Pending")}</span>
        </div>
      );
    default:
      return <span className="text-sm text-gray-600 dark:text-gray-400">-</span>;
  }
};

export const UserTable: React.FC<UserTableProps> = ({
  users,
  isLoading = false,
  activeRole,
  onEdit,
  onToggleStatus,
  onView,
  onViewPayment,
  onApprove,
  onResetPassword,
  sortBy,
  sortOrder,
  onSort,
  isSubmitting,
}) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
      <table className="w-full bg-card">
        <thead className="border-b border-border bg-muted/40">
          <tr>
            <th className="min-w-64 px-6 py-4 text-left">
              <TableHeader
                label="User"
                column="name"
                onSort={onSort}
                sortBy={sortBy}
                sortOrder={sortOrder}
              />
            </th>
            <th className="min-w-56 px-6 py-4 text-left">
              <TableHeader
                label="Email"
                column="email"
                onSort={onSort}
                sortBy={sortBy}
                sortOrder={sortOrder}
              />
            </th>
            {activeRole === undefined && (
              <th className="min-w-28 px-6 py-4 text-left">
                <span className="font-semibold text-muted-foreground text-sm">
                  Role
                </span>
              </th>
            )}
            <th className="min-w-40 px-6 py-4 text-left">
              <span className="font-semibold text-muted-foreground text-sm">
                Status
              </span>
            </th>
            {activeRole !== undefined && activeRole !== "MANAGER" && (
              <th className="min-w-44 px-6 py-4 text-left">
                <span className="font-semibold text-muted-foreground text-sm">
                  {getDetailsHeaderLabel(activeRole)}
                </span>
              </th>
            )}
            {activeRole !== undefined && (
              <th className="min-w-48 px-6 py-4 text-right">
                <span className="font-semibold text-muted-foreground text-sm">
                  Actions
                </span>
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {isLoading
            ? [...Array(5)].map((_, i) => <LoadingSkeleton key={i} activeRole={activeRole} />)
            : users.map((user) => {
                const actions: ActionMenuItem[] = [];
                const displayName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email;

                if (onView) {
                  actions.push({
                    id: "view",
                    label: "View",
                    icon: <Eye className="w-4 h-4" />,
                    onClick: () => onView(user),
                  });
                }

                if (onEdit) {
                  actions.push({
                    id: "edit",
                    label: "Edit",
                    icon: <Edit2 className="w-4 h-4" />,
                    onClick: () => onEdit(user),
                  });
                }

                if (onToggleStatus) {
                  const isActive = user.status === "ACTIVE";
                  actions.push({
                    id: "toggle-status",
                    label:
                      user.role === "STUDENT"
                        ? isActive
                          ? "Disable Student"
                          : "Enable Student"
                        : isActive
                          ? "Disable"
                          : "Enable",
                    icon: user.role === "STUDENT" ? (
                      <UserMinus className="w-4 h-4" />
                    ) : isActive ? (
                      <XCircle className="w-4 h-4" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    ),
                    onClick: () => onToggleStatus(user),
                  });
                }

                  if (onResetPassword) {
                    actions.push({
                      id: "reset-password",
                      label: "Reset password & copy",
                      icon: <Key className="w-4 h-4" />,
                      onClick: () => onResetPassword(user),
                    });
                  }
                if (onViewPayment && user.role === "STUDENT") {
                  actions.push({
                    id: "view-payment",
                    label: "View Payment",
                    icon: <CreditCard className="w-4 h-4" />,
                    onClick: () => onViewPayment(user),
                  });
                }

                // Approve student (if applicable)
                if (onApprove && user.role === 'STUDENT' && user.isApproved === false) {
                  actions.push({
                    id: 'approve',
                    label: 'Approve Student',
                    icon: <BadgeCheck className="w-4 h-4" />,
                    onClick: () => onApprove(user),
                  });
                }

                const initials =
                  `${(user.firstName?.[0] ?? user.email?.[0] ?? '?')}${(user.lastName?.[0] ?? user.email?.[1] ?? '')}`.toUpperCase();

                return (
                  <tr
                    key={user.id}
                    className="
                      border-b border-border hover:bg-muted/40 transition-colors
                      focus-within:bg-emerald-500/10
                    "
                  >
                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          src={user.profileImage}
                          alt={displayName}
                          className="w-10 h-10"
                        />
                        <div>
                          <p className="font-medium text-foreground">
                            {displayName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user.phoneNumber}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4">
                      <a
                        href={`mailto:${user.email}`}
                        className="text-emerald-600 dark:text-emerald-400 hover:underline text-sm"
                      >
                        {user.email}
                      </a>
                    </td>

                    {/* Role */}
                    {activeRole === undefined && (
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full bg-blue-500/10 px-2.5 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400">
                          {roleLabel(user.role)}
                        </span>
                      </td>
                    )}

                    {/* Status */}
                    <td className="px-6 py-4">
                      <UserStatusBadge
                        status={user.status}
                        onToggle={() => onToggleStatus?.(user)}
                        disabled={isSubmitting}
                      />
                    </td>

                    {/* Role-specific details */}
                    {activeRole !== undefined && activeRole !== "MANAGER" && (
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-300">
                        {activeRole === "TEACHER" ? (
                          user.subject ? (
                            <div className="flex flex-wrap gap-1.5">
                              {user.subject
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean)
                                .map((subj, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20"
                                  >
                                    {subj}
                                  </span>
                                ))}
                            </div>
                          ) : (
                            <span className="text-gray-400 dark:text-slate-500 italic">
                              Not Assigned
                            </span>
                          )
                        ) : (
                          renderRoleDetails(user)
                        )}
                      </td>
                    )}

                    {/* Actions */}
                    {activeRole !== undefined && (
                      <td className="px-6 py-4 text-right">
                        {user.role === "STUDENT" ? (
                          <div className="flex flex-wrap justify-end gap-2">
                            {onApprove && user.isApproved === false && (
                              <button
                                type="button"
                                onClick={() => onApprove(user)}
                                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-900/60"
                              >
                                <BadgeCheck className="h-3.5 w-3.5" />
                                Approve
                              </button>
                            )}
                            {onToggleStatus && (
                              <button
                                type="button"
                                onClick={() => onToggleStatus(user)}
                                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                              >
                                <UserMinus className="h-3.5 w-3.5" />
                                {user.status === "ACTIVE" ? "Disable" : "Enable"}
                              </button>
                            )}
                            {onViewPayment && (
                              <button
                                type="button"
                                onClick={() => onViewPayment(user)}
                                className="inline-flex items-center gap-1.5 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700 transition-colors hover:bg-cyan-100 dark:border-cyan-900/60 dark:bg-cyan-950/40 dark:text-cyan-400 dark:hover:bg-cyan-900/60"
                              >
                                <CreditCard className="h-3.5 w-3.5" />
                                Payment
                              </button>
                            )}
                          </div>
                        ) : actions.length > 0 ? (
                          <div className="flex justify-end">
                            <ActionMenu actions={actions} />
                          </div>
                        ) : null}
                      </td>
                    )}
                  </tr>
                );
              })}
        </tbody>
      </table>
    </div>
  );
};
