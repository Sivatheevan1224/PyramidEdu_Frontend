/**
 * ViewUserModal - Read-only modal component for viewing detailed user profiles
 */

"use client";

import React from "react";
import { X, Mail, Phone, Calendar, User, Shield, CreditCard, DollarSign, Award, MapPin, Tag, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { User as UserType } from "../types/user.types";
import { UserAvatar } from "./UserAvatar";
import { ROLE_CONFIG } from "../constants/roles";

interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
}

export const ViewUserModal: React.FC<ViewUserModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  if (!user) return null;

  const config = ROLE_CONFIG[user.role] || ROLE_CONFIG["ALL"];
  const displayName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || (user.role === "SUPPORT_STAFF" ? "Support Staff" : user.email);

  const formatSalary = (value?: number) =>
    value ? `Rs. ${new Intl.NumberFormat("en-US").format(value)}.00` : "—";

  const DetailField = ({
    label,
    value,
    icon,
  }: {
    label: string;
    value?: string | number | React.ReactNode;
    icon?: React.ReactNode;
  }) => (
    <div className="flex items-start gap-3 p-3.5 rounded-xl border border-border/50 bg-muted/10 dark:bg-muted/5">
      {icon && (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
          {icon}
        </span>
      )}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        <span className="text-sm font-semibold text-foreground truncate">
          {value || "—"}
        </span>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/55 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative bg-card rounded-2xl border border-border shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col z-50"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-emerald-50/50 via-white to-cyan-50/50 dark:from-emerald-950/10 dark:via-card dark:to-cyan-950/10 border-b border-border/60 px-6 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  User Details
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Read-only profile view
                </p>
              </div>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Content Container (Scrollable) */}
            <div className="overflow-y-auto px-6 py-6 space-y-6">
              {/* Profile Card Header */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-5 rounded-2xl border border-border bg-muted/20 dark:bg-muted/5">
                <UserAvatar
                  src={user.profileImage}
                  alt={displayName}
                  className="w-16 h-16 sm:w-20 sm:h-20"
                />
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <h3 className="text-xl font-bold text-foreground truncate">
                    {displayName}
                  </h3>
                  {user.role !== "SUPPORT_STAFF" && (
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                  )}
                  
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2.5">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.bgColor} ${config.color}`}>
                      {config.label}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      user.status === "ACTIVE" 
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                    }`}>
                      {user.status === "ACTIVE" ? "Active" : "Disabled"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.role !== "SUPPORT_STAFF" && (
                  <DetailField
                    label="Email Address"
                    value={user.email}
                    icon={<Mail className="w-4 h-4" />}
                  />
                )}
                <DetailField
                  label="Phone Number"
                  value={user.phoneNumber || "—"}
                  icon={<Phone className="w-4 h-4" />}
                />
                <DetailField
                  label="NIC Number"
                  value={user.nicNumber || (user as any).nic || "—"}
                  icon={<Shield className="w-4 h-4" />}
                />
                <DetailField
                  label="Gender"
                  value={user.gender ? user.gender.charAt(0) + user.gender.slice(1).toLowerCase() : "—"}
                  icon={<User className="w-4 h-4" />}
                />
                <DetailField
                  label="Address"
                  value={user.address || "—"}
                  icon={<MapPin className="w-4 h-4" />}
                />
                <DetailField
                  label="Member Since"
                  value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                  icon={<Calendar className="w-4 h-4" />}
                />

                {/* Role Specific Fields */}
                {user.role === "TEACHER" && (
                  <>
                    <div className="flex items-start gap-3 p-3.5 rounded-xl border border-border/50 bg-muted/10 dark:bg-muted/5 sm:col-span-2">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                        <BookOpen className="w-4 h-4" />
                      </span>
                      <div className="flex flex-col gap-1.5 min-w-0">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                          Assigned Subjects
                        </span>
                        {user.subject ? (
                          <div className="flex flex-wrap gap-1.5">
                            {user.subject
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean)
                              .map((subj, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20"
                                >
                                  {subj}
                                </span>
                              ))}
                          </div>
                        ) : (
                          <span className="text-sm font-semibold text-muted-foreground italic">Not Assigned</span>
                        )}
                      </div>
                    </div>
                    <DetailField
                      label="Teacher Salary"
                      value={formatSalary(user.salary)}
                      icon={<DollarSign className="w-4 h-4" />}
                    />
                  </>
                )}

                {user.role === "MANAGER" && (
                  <>
                    <DetailField
                      label="Manager Salary"
                      value={formatSalary(user.managerSalary ?? user.salary)}
                      icon={<DollarSign className="w-4 h-4" />}
                    />
                  </>
                )}

                {user.role === "SUPPORT_STAFF" && (
                  <>
                    <DetailField
                      label="Staff Role Type"
                      value={user.roleType || "—"}
                      icon={<Tag className="w-4 h-4" />}
                    />
                    <DetailField
                      label="Staff Salary"
                      value={formatSalary(user.salary)}
                      icon={<DollarSign className="w-4 h-4" />}
                    />
                  </>
                )}

                {user.role === "STUDENT" && (
                  <>
                    <DetailField
                      label="Index Number"
                      value={user.indexNumber || (user as any).indexNumber || "—"}
                      icon={<Award className="w-4 h-4" />}
                    />
                    <DetailField
                      label="Date of Birth"
                      value={(user as any).dateOfBirth || "—"}
                      icon={<Calendar className="w-4 h-4" />}
                    />
                    <DetailField
                      label="Batch"
                      value={(user as any).batch || "—"}
                      icon={<Tag className="w-4 h-4" />}
                    />
                    <DetailField
                      label="Stream"
                      value={(user as any).stream || "—"}
                      icon={<BookOpen className="w-4 h-4" />}
                    />
                    <DetailField
                      label="Monthly Fee"
                      value={formatSalary((user as any).totalFeeAmount)}
                      icon={<DollarSign className="w-4 h-4" />}
                    />
                    <DetailField
                      label="Approval Status"
                      value={(user as any).approvalStatus || "—"}
                      icon={<Shield className="w-4 h-4" />}
                    />

                    <div className="col-span-1 sm:col-span-2 mt-4">
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border/60 pb-1.5 mb-3">
                        Guardian Information
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <DetailField
                          label="Guardian Name"
                          value={(user as any).guardianName || "—"}
                          icon={<User className="w-4 h-4" />}
                        />
                        <DetailField
                          label="Relationship"
                          value={(user as any).guardianRelation || "—"}
                          icon={<Shield className="w-4 h-4" />}
                        />
                        <DetailField
                          label="Guardian Phone"
                          value={(user as any).guardianPhone || "—"}
                          icon={<Phone className="w-4 h-4" />}
                        />
                        <DetailField
                          label="Guardian Email"
                          value={(user as any).guardianEmail || "—"}
                          icon={<Mail className="w-4 h-4" />}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-muted/40 border-t border-border px-6 py-4 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-border px-5 py-2 text-sm font-semibold text-foreground hover:bg-muted/60 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                Close Details
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
