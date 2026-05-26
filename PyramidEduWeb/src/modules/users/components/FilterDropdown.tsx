/**
 * FilterDropdown - Role and status filter dropdown
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { UserRole, UserStatus } from '../types/user.types';

interface FilterOption {
  label: string;
  value: UserRole | UserStatus | 'ALL';
}

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  className?: string;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  options,
  selectedValue = 'ALL',
  onSelect,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((opt) => opt.value === selectedValue)?.label || label;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white
          text-gray-700 text-sm font-medium
          hover:bg-gray-50 transition-colors
          flex items-center justify-between
          focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
        "
      >
        <span>{selectedLabel}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="
          absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200
          rounded-lg shadow-lg z-50 py-1 animate-in fade-in slide-in-from-top-2
        ">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSelect(option.value);
                setIsOpen(false);
              }}
              className={`
                w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50
                transition-colors flex items-center gap-2
                ${selectedValue === option.value ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-700'}
              `}
            >
              {selectedValue === option.value && (
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              )}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
