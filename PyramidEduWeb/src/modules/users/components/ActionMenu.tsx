/**
 * ActionMenu - Dropdown action menu for user row actions
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';

export interface ActionMenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
  isDangerous?: boolean;
}

interface ActionMenuProps {
  actions: ActionMenuItem[];
  className?: string;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ actions, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleActionClick = (action: ActionMenuItem) => {
    action.onClick();
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2
          text-sm font-semibold text-foreground shadow-sm transition-all duration-200
          hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700
          focus:outline-none focus:ring-2 focus:ring-emerald-500
        "
        aria-label="Open actions menu"
      >
        <MoreVertical className="w-5 h-5" />
        Actions
      </button>

      {isOpen && (
        <div className="
          absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-border
          bg-card shadow-2xl ring-1 ring-black/5 z-50 animate-in fade-in slide-in-from-top-2
        ">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleActionClick(action)}
              className={`
                w-full px-4 py-3 text-left text-sm font-medium flex items-center gap-3 transition-colors
                hover:bg-muted/40
                ${action.isDangerous ? 'text-red-600 dark:text-red-400 hover:bg-red-500/10' : 'text-foreground'}
                ${action.className || ''}
              `}
            >
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${action.isDangerous ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                {action.icon}
              </span>
              <span className="flex flex-col items-start leading-tight">
                <span>{action.label}</span>
                <span className="text-[11px] font-normal text-muted-foreground">
                  {action.isDangerous ? 'Removes or disables access' : 'Open action'}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
