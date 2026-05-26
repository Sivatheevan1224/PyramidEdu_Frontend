/**
 * EmptyState - Component for empty state UI
 */

'use client';

import React from 'react';
import { Users } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No users found',
  description = 'Get started by creating a new user',
  actionLabel = 'Create User',
  onAction,
  icon,
}) => {
  return (
    <div className="
      flex flex-col items-center justify-center py-12 px-4
      bg-white rounded-lg border border-dashed border-gray-300
    ">
      <div className="mb-4">
        {icon || <Users className="w-16 h-16 text-gray-300" />}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-6 text-center max-w-sm">{description}</p>
      {onAction && actionLabel && (
        <button
          onClick={onAction}
          className="
            px-6 py-2.5 bg-emerald-600 text-white text-sm font-medium
            rounded-lg hover:bg-emerald-700 transition-colors
            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
          "
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
