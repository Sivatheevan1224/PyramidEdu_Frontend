/**
 * UserStatusBadge - Reusable interactive status toggle switch component
 */

'use client';

import React from 'react';
import { UserStatus } from '../types/user.types';

interface UserStatusBadgeProps {
  status: UserStatus;
  onToggle?: () => void;
  disabled?: boolean;
  className?: string;
  isPending?: boolean;
}

export const UserStatusBadge: React.FC<UserStatusBadgeProps> = ({
  status,
  onToggle,
  disabled = false,
  className = '',
  isPending: parentPending,
}) => {
  const isActive = status === 'ACTIVE';

  // Local state to prevent rapid double clicks if parent doesn't control it
  const [localPending, setLocalPending] = React.useState(false);
  const isPending = parentPending !== undefined ? parentPending : localPending;

  // Reset local pending state when status or disabled props change
  React.useEffect(() => {
    setLocalPending(false);
  }, [status, disabled]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || isPending || !onToggle) return;
    setLocalPending(true);
    onToggle();
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <button
        type="button"
        role="switch"
        aria-checked={isActive}
        disabled={disabled || isPending || !onToggle}
        onClick={handleToggle}
        className={`
          relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
          ${isActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}
        `}
      >
        <span
          aria-hidden="true"
          className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out
            ${isActive ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>
      <span className={`text-sm font-semibold min-w-20 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
        {isPending 
          ? (isActive ? 'Disabling...' : 'Activating...') 
          : (isActive ? 'Active' : 'Disabled')}
      </span>
    </div>
  );
};
