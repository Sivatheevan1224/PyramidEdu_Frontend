/**
 * UserCard - Card component for mobile/responsive view
 */

'use client';

import React from 'react';
import { User, UserRole } from '../types/user.types';
import { UserStatusBadge } from './UserStatusBadge';
import { UserAvatar } from './UserAvatar';
import { Eye, Mail, Phone, Calendar, Edit2, CheckCircle, XCircle, CreditCard, BadgeCheck, UserMinus, Key } from 'lucide-react';

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onToggleStatus?: (user: User) => void;
  onView?: (user: User) => void;
  onViewPayment?: (user: User) => void;
  onApprove?: (user: User) => void;
  onResetPassword?: (user: User) => void;
  showDetailsAndActions?: boolean;
  isSubmitting?: boolean;
  activeRole?: UserRole;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onToggleStatus,
  onView,
  onViewPayment,
  onApprove,
  onResetPassword,
  showDetailsAndActions = true,
  isSubmitting,
  activeRole,
}) => {
  const displayName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email;
  const initials = `${(user.firstName?.[0] ?? user.email?.[0] ?? '?')}${(user.lastName?.[0] ?? user.email?.[1] ?? '')}`.toUpperCase();

  const formatSalary = (value?: number) => (value ? new Intl.NumberFormat('en-US').format(value) : '-');

  const detailChip = (label: string, value: string) => (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800/60 dark:bg-slate-900/60 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-slate-800 dark:text-slate-200">{value}</p>
    </div>
  );

  const renderRoleDetails = () => {
    switch (user.role) {
      case 'MANAGER':
        return (
          <div className="grid gap-2 sm:grid-cols-2">
            {detailChip('Department', user.department || '-')}
            {detailChip('Salary', formatSalary(user.managerSalary ?? user.salary))}
          </div>
        );
      case 'TEACHER':
        return (
          <div className="grid gap-2 sm:grid-cols-2">
            {detailChip('Subject', user.subject || '-')}
            {detailChip('Salary', formatSalary(user.salary))}
          </div>
        );
      case 'SUPPORT_STAFF':
        return (
          <div className="grid gap-2 sm:grid-cols-2">
            {detailChip('Role Type', user.roleType || '-')}
            {detailChip('Salary', formatSalary(user.salary))}
          </div>
        );
      case 'STUDENT':
        return (
          <div className="grid gap-2 sm:grid-cols-2">
            {detailChip('Index Number', user.indexNumber || '-')}
            {detailChip('Date of Birth', user.dateOfBirth || '-')}
            {detailChip('Address', user.address || '-')}
            {detailChip('Approval', user.isApproved ? 'Approved' : 'Pending')}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="
      bg-card text-card-foreground rounded-lg border border-border p-5
      hover:shadow-md transition-shadow
    ">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4 flex-1">
          {/* Avatar */}
          <UserAvatar
            src={user.profileImage}
            alt={displayName}
            className="w-12 h-12"
          />

          {/* User Info */}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {displayName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{user.role}</p>
          </div>
        </div>

        {showDetailsAndActions && user.role !== 'STUDENT' && (onView || onEdit || onToggleStatus) && (
          <div className="flex items-center gap-2">
            {onView && (
              <button
                type="button"
                onClick={() => onView(user)}
                className="rounded-full border border-border bg-white dark:bg-slate-900 p-2 text-muted-foreground transition-colors hover:border-emerald-200 dark:hover:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-400"
                aria-label="View user"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(user)}
                className="rounded-full border border-border bg-white dark:bg-slate-900 p-2 text-muted-foreground transition-colors hover:border-emerald-200 dark:hover:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-400"
                aria-label="Edit user"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {onToggleStatus && activeRole !== 'TEACHER' && activeRole !== 'MANAGER' && activeRole !== 'SUPPORT_STAFF' && (
              <button
                type="button"
                onClick={() => onToggleStatus(user)}
                className="rounded-full border border-border bg-white dark:bg-slate-900 p-2 text-muted-foreground transition-colors hover:border-emerald-200 dark:hover:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-400"
                aria-label={user.status === 'ACTIVE' ? 'Disable user' : 'Enable user'}
              >
                {user.status === 'ACTIVE' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              </button>
            )}
            {onResetPassword && activeRole !== 'SUPPORT_STAFF' && (
              <button
                type="button"
                onClick={() => onResetPassword(user)}
                className="rounded-full border border-border bg-white dark:bg-slate-900 p-2 text-muted-foreground transition-colors hover:border-emerald-200 dark:hover:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-400"
                aria-label="Reset password"
              >
                <Key className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Status */}
      <div className="mb-4">
        <UserStatusBadge
          status={user.status}
          onToggle={onToggleStatus ? () => onToggleStatus(user) : undefined}
          disabled={isSubmitting}
        />
      </div>

      {/* Details */}
      <div className="space-y-3 text-sm">
        {/* Email */}
        {activeRole !== 'SUPPORT_STAFF' && (
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
            <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
            <span className="truncate">{user.email}</span>
          </div>
        )}

        {/* Phone */}
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
          <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
          <span>{user.phoneNumber || (user as any).phone || "—"}</span>
        </div>

        {/* Created Date */}
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
          <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
          <span>{new Date(user.createdAt).toLocaleDateString()}</span>
        </div>

        {showDetailsAndActions && renderRoleDetails()}

        {showDetailsAndActions && user.role === 'STUDENT' && (
          <div className="flex flex-wrap gap-2 pt-2">
            {onApprove && user.isApproved === false && (
              <button
                type="button"
                onClick={() => onApprove(user)}
                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-400"
              >
                <BadgeCheck className="h-3.5 w-3.5" />
                Approve
              </button>
            )}
            {onToggleStatus && activeRole !== 'STUDENT' && (
              <button
                type="button"
                onClick={() => onToggleStatus(user)}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              >
                <UserMinus className="h-3.5 w-3.5" />
                {user.status === 'ACTIVE' ? 'Disable' : 'Enable'}
              </button>
            )}
            {onViewPayment && (
              <button
                type="button"
                onClick={() => onViewPayment(user)}
                className="inline-flex items-center gap-1.5 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700 dark:border-cyan-900/60 dark:bg-cyan-950/40 dark:text-cyan-400"
              >
                <CreditCard className="h-3.5 w-3.5" />
                Payment
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
