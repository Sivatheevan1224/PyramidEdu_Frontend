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
  Trash2,
  Eye,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

interface UserTableProps {
  users: User[];
  isLoading?: boolean;
  onEdit?: (user: User) => void;
  onToggleStatus?: (user: User) => void;
  onDelete?: (user: User) => void;
  onView?: (user: User) => void;
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
  onDelete,
  onView,
  sortBy,
  sortOrder,
  onSort,
}) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full bg-card">
        <thead className="border-b border-border bg-muted/40">
          <tr>
            <th className="px-6 py-4 text-left">
              <TableHeader
                label="User"
                column="name"
                onSort={onSort}
                sortBy={sortBy}
                sortOrder={sortOrder}
              />
            </th>
            <th className="px-6 py-4 text-left">
              <TableHeader
                label="Email"
                column="email"
                onSort={onSort}
                sortBy={sortBy}
                sortOrder={sortOrder}
              />
            </th>
            <th className="px-6 py-4 text-left">
              <span className="font-semibold text-muted-foreground text-sm">
                Role
              </span>
            </th>
            <th className="px-6 py-4 text-left">
              <span className="font-semibold text-muted-foreground text-sm">
                Status
              </span>
            </th>
            <th className="px-6 py-4 text-left">
              <span className="font-semibold text-muted-foreground text-sm">
                Subject
              </span>
            </th>
            <th className="px-6 py-4 text-right">
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
                    label: isActive ? "Disable" : "Enable",
                    icon: isActive ? (
                      <XCircle className="w-4 h-4" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    ),
                    onClick: () => onToggleStatus(user),
                  });
                }

                if (onDelete) {
                  actions.push({
                    id: "delete",
                    label: "Delete",
                    icon: <Trash2 className="w-4 h-4" />,
                    onClick: () => onDelete(user),
                    isDangerous: true,
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
                      {actions.length > 0 && <ActionMenu actions={actions} />}
                    </td>
                  </tr>
                );
              })}
        </tbody>
      </table>
    </div>
  );
};
