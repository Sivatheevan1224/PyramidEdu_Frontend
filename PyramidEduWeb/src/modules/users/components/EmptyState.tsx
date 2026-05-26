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
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-card rounded-lg border border-dashed border-border p-8 w-full">
        {icon || <Users className="w-16 h-16 text-muted-foreground mx-auto" />}
        <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
          {description}
        </p>
        {onAction && actionLabel && (
          <button
            onClick={onAction}
            className="
              mt-6 px-6 py-2.5 bg-emerald-600 text-white text-sm font-medium
              rounded-lg hover:bg-emerald-700 transition-colors
              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
            "
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};
