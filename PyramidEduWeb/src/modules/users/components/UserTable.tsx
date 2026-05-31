/**
 * UserTable - Responsive data table for users
 */

"use client";

import React from "react";
import { User } from "../types/user.types";
import { UserStatusBadge } from "./UserStatusBadge";
import { ActionMenu, ActionMenuItem } from "./ActionMenu";
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
}

const LoadingSkeleton = () => (
  <tr className="border-b border-border hover:bg-muted/40">
    {[...Array(7)].map((_, i) => (
      <td key={i} className="px-6 py-4">
        <div className="h-4 bg-muted rounded animate-pulse" />
      </td>
    ))}
  </tr>
);

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

export const UserTable: React.FC<UserTableProps> = ({
  users,
  isLoading = false,
  onEdit,
  onToggleStatus,
  onView,
  onViewPayment,
  onApprove,
  onResetPassword,
  sortBy,
  sortOrder,
  onSort,
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
            <th className="min-w-28 px-6 py-4 text-left">
              <span className="font-semibold text-muted-foreground text-sm">
                Role
              </span>
            </th>
            <th className="min-w-40 px-6 py-4 text-left">
              <span className="font-semibold text-muted-foreground text-sm">
                Status
              </span>
            </th>
            <th className="min-w-44 px-6 py-4 text-left">
              <span className="font-semibold text-muted-foreground text-sm">
                Subject
              </span>
            </th>
            <th className="min-w-48 px-6 py-4 text-right">
              <span className="font-semibold text-muted-foreground text-sm">
                Actions
              </span>
            </th>
          </tr>
        </thead>

        <tbody>
          {isLoading
            ? [...Array(5)].map((_, i) => <LoadingSkeleton key={i} />)
            : users.map((user) => {
                const actions: ActionMenuItem[] = [];

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
                  `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

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
                        <div
                          className="
                          w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600
                          flex items-center justify-center text-white font-semibold text-xs
                        "
                        >
                          {initials}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {user.firstName} {user.lastName}
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
                    <td className="px-6 py-4">
                      <span
                        className="
                        inline-flex px-2.5 py-1.5 rounded-full text-xs font-medium
                        bg-blue-500/10 text-blue-600 dark:text-blue-400
                      "
                      >
                        {user.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <UserStatusBadge status={user.status} />
                    </td>

                    {/* Subject */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.subject || "-"}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      {user.role === "STUDENT" ? (
                        <div className="flex flex-wrap justify-end gap-2">
                          {onApprove && user.isApproved === false && (
                            <button
                              type="button"
                              onClick={() => onApprove(user)}
                              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
                            >
                              <BadgeCheck className="h-3.5 w-3.5" />
                              Approve
                            </button>
                          )}
                          {onToggleStatus && (
                            <button
                              type="button"
                              onClick={() => onToggleStatus(user)}
                              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                            >
                              <UserMinus className="h-3.5 w-3.5" />
                              {user.status === "ACTIVE" ? "Disable" : "Enable"}
                            </button>
                          )}
                          {onViewPayment && (
                            <button
                              type="button"
                              onClick={() => onViewPayment(user)}
                              className="inline-flex items-center gap-1.5 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700 transition-colors hover:bg-cyan-100"
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
                  </tr>
                );
              })}
        </tbody>
      </table>
    </div>
  );
};
