/**
 * UserRoleTabs - Role navigation tabs component
 */

"use client";

import React from "react";
import { ROLE_TABS, ROLE_CONFIG } from "../constants/roles";
import { UserRole } from "../types/user.types";

interface UserRoleTabsProps {
  activeRole: UserRole | undefined;
  onRoleChange: (role: UserRole | undefined) => void;
}

export const UserRoleTabs: React.FC<UserRoleTabsProps> = ({
  activeRole,
  onRoleChange,
}) => {
  return (
    <div className="flex justify-start">
      <div className="inline-flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-border bg-card p-1.5 shadow-sm">
        {ROLE_TABS.map((tab) => {
          const isActive = activeRole === tab.value;
          // Configuration for role tabs is not needed here.

          return (
            <button
              key={tab.label}
              onClick={() => onRoleChange(tab.value)}
              className={`rounded-full px-3.5 py-2 text-sm font-semibold transition-colors sm:px-4 ${
                isActive
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
