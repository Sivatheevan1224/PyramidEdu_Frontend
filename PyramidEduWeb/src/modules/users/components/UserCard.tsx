/**
 * UserCard - Card component for mobile/responsive view
 */

'use client';

import React from 'react';
import { User } from '../types/user.types';
import { UserStatusBadge } from './UserStatusBadge';
import { ActionMenu, ActionMenuItem } from './ActionMenu';
import { Mail, Phone, Calendar, Edit2, CheckCircle, XCircle, Trash2 } from 'lucide-react';

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onToggleStatus?: (user: User) => void;
  onDelete?: (user: User) => void;
  onView?: (user: User) => void;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onToggleStatus,
  onDelete,
  onView,
}) => {
  const actions: ActionMenuItem[] = [];

  if (onView) {
    actions.push({
      id: 'view',
      label: 'View',
      icon: <Eye className="w-4 h-4" />,
      onClick: () => onView(user),
    });
  }

  if (onEdit) {
    actions.push({
      id: 'edit',
      label: 'Edit',
      icon: <Edit2 className="w-4 h-4" />,
      onClick: () => onEdit(user),
    });
  }

  if (onToggleStatus) {
    const isActive = user.status === 'ACTIVE';
    actions.push({
      id: 'toggle-status',
      label: isActive ? 'Disable' : 'Enable',
      icon: isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />,
      onClick: () => onToggleStatus(user),
    });
  }

  if (onDelete) {
    actions.push({
      id: 'delete',
      label: 'Delete',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: () => onDelete(user),
      isDangerous: true,
    });
  }

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

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
            w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600
            flex items-center justify-center text-white font-bold text-sm
          ">
            {initials}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-sm text-gray-600">{user.role}</p>
          </div>
        </div>

        {actions.length > 0 && <ActionMenu actions={actions} />}
      </div>

      {/* Status */}
      <div className="mb-4">
        <UserStatusBadge status={user.status} />
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm">
        {/* Email */}
        <div className="flex items-center gap-3 text-gray-600">
          <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="truncate">{user.email}</span>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3 text-gray-600">
          <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span>{user.phoneNumber}</span>
        </div>

        {/* Created Date */}
        <div className="flex items-center gap-3 text-gray-600">
          <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span>{new Date(user.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

import { Eye } from 'lucide-react';
