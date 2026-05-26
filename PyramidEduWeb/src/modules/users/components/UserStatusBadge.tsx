/**
 * UserStatusBadge - Reusable status badge component
 */

'use client';

import React from 'react';
import { UserStatus } from '../types/user.types';

interface UserStatusBadgeProps {
  status: UserStatus;
  className?: string;
}

export const UserStatusBadge: React.FC<UserStatusBadgeProps> = ({ status, className = '' }) => {
  const isActive = status === 'ACTIVE';

  return (
    <span
      className={`
        inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
        ${isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}
        ${className}
      `}
    >
      <span
        className={`w-2 h-2 rounded-full mr-2 ${isActive ? 'bg-emerald-500' : 'bg-red-500'}`}
      />
      {isActive ? 'Active' : 'Disabled'}
    </span>
  );
};
