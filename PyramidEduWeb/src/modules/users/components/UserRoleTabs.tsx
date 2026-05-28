/**
 * UserRoleTabs - Role navigation tabs component
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
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
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-0">
          {ROLE_TABS.map((tab) => {
            const isActive = activeRole === tab.value;
            // Configuration for role tabs is not needed here.

            return (
              <motion.button
                key={tab.label}
                onClick={() => onRoleChange(tab.value)}
                className={`
                  relative px-6 py-4 text-sm font-semibold transition-colors
                  ${isActive ? "text-emerald-600" : "text-gray-600 hover:text-gray-900"}
                `}                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                <span className="flex items-center gap-2">
                  <span>{tab.label}</span>
                </span>

                {/* Active indicator with animation */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-t"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
