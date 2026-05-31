/**
 * UserCard - Card component for mobile/responsive view
 */

'use client';

import React from 'react';
import { User } from '../types/user.types';
import { UserStatusBadge } from './UserStatusBadge';
import { Eye, Mail, Phone, Calendar, Edit2, CheckCircle, XCircle, CreditCard, BadgeCheck, UserMinus, Key } from 'lucide-react';

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onToggleStatus?: (user: User) => void;
  onView?: (user: User) => void;
  onViewPayment?: (user: User) => void;
  onApprove?: (user: User) => void;
  onResetPassword?: (user: User) => void;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onToggleStatus,
  onView,
  onViewPayment,
  onApprove,
  onResetPassword,
}) => {
  const displayName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email;
  const initials = `${(user.firstName?.[0] ?? user.email?.[0] ?? '?')}${(user.lastName?.[0] ?? user.email?.[1] ?? '')}`.toUpperCase();

  return (
    <div className="
      bg-white rounded-lg border border-gray-200 p-5
      hover:shadow-md transition-shadow
    ">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4 flex-1">
          {/* Avatar */}
          <div className="
            w-12 h-12 rounded-full bg-linear-to-br from-emerald-400 to-emerald-600
            flex items-center justify-center text-white font-bold text-sm
          ">
            {initials}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">
              {displayName}
            </h3>
            <p className="text-sm text-gray-600">{user.role}</p>
            {user.subject && (
              <p className="text-xs text-gray-500">Subject: {user.subject}</p>
            )}
          </div>
        </div>

        {user.role !== 'STUDENT' && (onView || onEdit || onToggleStatus) && (
          <div className="flex items-center gap-2">
            {onView && (
              <button
                type="button"
                onClick={() => onView(user)}
                className="rounded-full border border-border bg-white p-2 text-muted-foreground transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                aria-label="View user"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(user)}
                className="rounded-full border border-border bg-white p-2 text-muted-foreground transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                aria-label="Edit user"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {onToggleStatus && (
              <button
                type="button"
                onClick={() => onToggleStatus(user)}
                className="rounded-full border border-border bg-white p-2 text-muted-foreground transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                aria-label={user.status === 'ACTIVE' ? 'Disable user' : 'Enable user'}
              >
                {user.status === 'ACTIVE' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              </button>
            )}
            {onResetPassword && (
              <button
                type="button"
                onClick={() => onResetPassword(user)}
                className="rounded-full border border-border bg-white p-2 text-muted-foreground transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
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
        <UserStatusBadge status={user.status} />
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm">
        {/* Email */}
        <div className="flex items-center gap-3 text-gray-600">
          <Mail className="w-4 h-4 text-gray-400 shrink-0" />
          <span className="truncate">{user.email}</span>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3 text-gray-600">
          <Phone className="w-4 h-4 text-gray-400 shrink-0" />
          <span>{user.phoneNumber}</span>
        </div>

        {/* Created Date */}
        <div className="flex items-center gap-3 text-gray-600">
          <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
          <span>{new Date(user.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center gap-3 text-gray-600">
          <span className="inline-flex rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-600">
            {user.role}
          </span>
          <span className="text-xs text-gray-500">{user.subject || 'Subject not set'}</span>
        </div>

        {user.role === 'STUDENT' && (
          <div className="flex flex-wrap gap-2 pt-2">
            {onApprove && user.isApproved === false && (
              <button
                type="button"
                onClick={() => onApprove(user)}
                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700"
              >
                <BadgeCheck className="h-3.5 w-3.5" />
                Approve
              </button>
            )}
            {onToggleStatus && (
              <button
                type="button"
                onClick={() => onToggleStatus(user)}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
              >
                <UserMinus className="h-3.5 w-3.5" />
                {user.status === 'ACTIVE' ? 'Disable' : 'Enable'}
              </button>
            )}
            {onViewPayment && (
              <button
                type="button"
                onClick={() => onViewPayment(user)}
                className="inline-flex items-center gap-1.5 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700"
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
