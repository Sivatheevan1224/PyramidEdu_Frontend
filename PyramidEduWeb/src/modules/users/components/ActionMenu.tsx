/**
 * ActionMenu - Dropdown action menu for user row actions
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Eye, Edit2, CheckCircle, XCircle, Trash2 } from 'lucide-react';

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
          p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100
          rounded-lg transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-emerald-500
        "
        aria-label="Open actions menu"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="
          absolute right-0 mt-2 w-48 bg-white border border-gray-200
          rounded-lg shadow-lg z-50 py-1 animate-in fade-in slide-in-from-top-2
        ">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleActionClick(action)}
              className={`
                w-full px-4 py-2.5 text-left text-sm flex items-center gap-3
                hover:bg-gray-50 transition-colors
                ${action.isDangerous ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'}
                ${action.className || ''}
              `}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
