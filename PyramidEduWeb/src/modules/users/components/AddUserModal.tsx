/**
 * AddUserModal - Modal component for adding new users with role-specific forms
 */

"use client";

import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { UserRole } from "../types/user.types";
import { AddManagerForm } from "./forms/AddManagerForm";
import { AddTeacherForm } from "./forms/AddTeacherForm";
import { AddSupportStaffForm } from "./forms/AddSupportStaffForm";
import { AddStudentForm } from "./forms/AddStudentForm";
import { ROLE_CONFIG } from "../constants/roles";
import {
  AddManagerInput,
  AddTeacherInput,
  AddSupportStaffInput,
  AddStudentInput,
} from "../validation/user.schema";

type FormData =
  | AddManagerInput
  | AddTeacherInput
  | AddSupportStaffInput
  | AddStudentInput;

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData, role: UserRole) => Promise<void>;
  isLoading?: boolean;
  activeRole: UserRole;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  activeRole,
}) => {
  const config = ROLE_CONFIG[activeRole];

  const handleSubmit = async (data: FormData) => {
    await onSubmit(data, activeRole);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-card rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-muted/40 border-b border-border px-8 py-6 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-foreground">
                    {config.addButtonLabel}
                  </h2>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="px-8 py-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeRole}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeRole === "MANAGER" && (
                    <AddManagerForm
                      onSubmit={handleSubmit}
                      isLoading={isLoading}
                    />
                  )}
                  {activeRole === "TEACHER" && (
                    <AddTeacherForm
                      onSubmit={handleSubmit}
                      isLoading={isLoading}
                    />
                  )}
                  {activeRole === "SUPPORT_STAFF" && (
                    <AddSupportStaffForm
                      onSubmit={handleSubmit}
                      isLoading={isLoading}
                    />
                  )}
                  {activeRole === "STUDENT" && (
                    <AddStudentForm
                      onSubmit={handleSubmit}
                      isLoading={isLoading}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
