/**
 * UserManagementPage - Main user management page with role-based tabs
 */

"use client";

import React, { useCallback, useEffect } from "react";
import { Plus, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useUsers } from "../hooks/useUsers";
import { useUserStore } from "../store/user.store";
import { UserTable } from "../components/UserTable";
import { UserCard } from "../components/UserCard";
import { AddUserModal } from "../components/AddUserModal";
import { UserRoleTabs } from "../components/UserRoleTabs";
import { SearchBar } from "../components/SearchBar";
import { FilterDropdown } from "../components/FilterDropdown";
import { EmptyState } from "../components/EmptyState";
import { ROLE_CONFIG } from "../constants/roles";
import {
  AddManagerInput,
  AddTeacherInput,
  AddSupportStaffInput,
  AddStudentInput,
} from "../validation/user.schema";
import { User, UserRole, UserStatus } from "../types/user.types";

type FormData =
  | AddManagerInput
  | AddTeacherInput
  | AddSupportStaffInput
  | AddStudentInput;

export const UserManagementPage: React.FC = () => {
  const [isToastVisible, setIsToastVisible] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState("");
  const [isMobile, setIsMobile] = React.useState(false);

  const {
    users,
    isLoading,
    error,
    filters,
    isModalOpen,
    editingUserId,
    isSubmitting,
    activeRole,
    fetchUsers,
    createUser,
    updateUserDetails,
    toggleUserStatus,
    deleteUser,
    handleFilterChange,
    openModal,
    closeModal,
    setActiveRole,
  } = useUsers();

  // Check mobile view
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Show toast notification
  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setIsToastVisible(true);
    setTimeout(() => setIsToastVisible(false), 4000);
  }, []);

  // Handle form submission
  const handleCreateUser = useCallback(
    async (data: FormData, role: UserRole) => {
      try {
        // Convert role-specific form data to generic CreateUserPayload
        let payload: any = { role };

        if (role === "MANAGER") {
          const managerData = data as AddManagerInput;
          const [firstName, ...lastNameParts] = managerData.fullName.split(" ");
          payload = {
            ...payload,
            firstName,
            lastName: lastNameParts.join(" ") || "User",
            email: managerData.email,
            phoneNumber: managerData.phoneNumber,
            password: managerData.password,
            confirmPassword: managerData.confirmPassword,
            department: managerData.department,
          };
        } else if (role === "TEACHER") {
          const teacherData = data as AddTeacherInput;
          payload = {
            ...payload,
            firstName: teacherData.firstName,
            lastName: teacherData.lastName,
            email: teacherData.email,
            phoneNumber: teacherData.phoneNumber,
            password: teacherData.password,
            confirmPassword: teacherData.confirmPassword,
            subject: teacherData.subject,
            salary: teacherData.salary,
          };
        } else if (role === "SUPPORT_STAFF") {
          const staffData = data as AddSupportStaffInput;
          const [firstName, ...lastNameParts] = staffData.fullName.split(" ");
          payload = {
            ...payload,
            firstName,
            lastName: lastNameParts.join(" ") || "Staff",
            email: staffData.email,
            phoneNumber: staffData.phoneNumber,
            password: staffData.password,
            confirmPassword: staffData.confirmPassword,
            roleType: staffData.roleType,
            salary: staffData.salary,
          };
        } else if (role === "STUDENT") {
          const studentData = data as AddStudentInput;
          payload = {
            ...payload,
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            email: studentData.email,
            phoneNumber: studentData.phoneNumber,
            password: studentData.password,
            confirmPassword: studentData.confirmPassword,
            indexNumber: studentData.indexNumber,
            parentName: studentData.parentName,
            parentPhone: studentData.parentPhone,
            address: studentData.address,
          };
        }

        await createUser(payload);
        showToast(`${ROLE_CONFIG[role].label} created successfully!`);
        closeModal();
        await fetchUsers();
      } catch (err) {
        showToast("Failed to create user. Please try again.");
      }
    },
    [createUser, closeModal, fetchUsers, showToast],
  );

  // Handle edit user
  const handleEditUser = useCallback(
    (user: User) => {
      // TODO: Implement edit functionality
      showToast("Edit functionality coming soon!");
    },
    [showToast],
  );

  // Handle toggle status
  const handleToggleStatus = useCallback(
    async (user: User) => {
      try {
        await toggleUserStatus(user.id, user.status);
        showToast(
          `User ${user.status === "ACTIVE" ? "disabled" : "enabled"} successfully!`,
        );
      } catch (err) {
        showToast("Failed to update user status. Please try again.");
      }
    },
    [toggleUserStatus, showToast],
  );

  // Handle delete user
  const handleDeleteUser = useCallback(
    async (user: User) => {
      const confirmed = window.confirm(
        `Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`,
      );
      if (!confirmed) return;

      try {
        await deleteUser(user.id);
        showToast("User deleted successfully!");
      } catch (err) {
        showToast("Failed to delete user. Please try again.");
      }
    },
    [deleteUser, showToast],
  );

  // Handle role change
  const handleRoleChange = useCallback(
    (role: UserRole) => {
      setActiveRole(role);
    },
    [setActiveRole],
  );

  const statusFilterOptions: Array<{
    label: string;
    value: UserStatus | "ALL";
  }> = [
    { label: "All Status", value: "ALL" },
    { label: "Active", value: "ACTIVE" },
    { label: "Disabled", value: "DISABLED" },
  ];

  const currentRoleConfig = ROLE_CONFIG[activeRole];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Role Tabs */}
      <UserRoleTabs activeRole={activeRole} onRoleChange={handleRoleChange} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          key={activeRole}
        >
          <div className="flex items-center gap-3 mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {currentRoleConfig.label} Management
              </h1>
            </div>
          </div>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-900">{error}</p>
              <p className="text-sm text-red-700 mt-1">
                Please try again or contact support.
              </p>
            </div>
          </motion.div>
        )}

        {/* Controls Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-white rounded-lg border border-gray-200 p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search */}
            <SearchBar
              onSearch={(query) => handleFilterChange({ search: query })}
              className="lg:col-span-1"
            />

            {/* Status Filter */}
            <FilterDropdown
              label="Filter by Status"
              options={statusFilterOptions}
              selectedValue={filters.status || "ALL"}
              onSelect={(value) =>
                handleFilterChange({
                  status: value === "ALL" ? undefined : (value as UserStatus),
                })
              }
            />

            {/* Add User Button */}
            <motion.button
              onClick={openModal}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-4 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:bg-emerald-400 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">
                {currentRoleConfig.addButtonLabel}
              </span>
            </motion.button>
          </div>
        </motion.div>

        {/* Users Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {users.length === 0 && !isLoading ? (
            <EmptyState
              title={`No ${currentRoleConfig.label.toLowerCase()} found`}
              description={`Get started by creating your first ${currentRoleConfig.label.toLowerCase()} account`}
              actionLabel={currentRoleConfig.addButtonLabel}
              onAction={openModal}
            />
          ) : (
            <div>
              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <UserTable
                  users={users}
                  isLoading={isLoading}
                  onEdit={handleEditUser}
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDeleteUser}
                  sortBy={filters.sortBy}
                  sortOrder={filters.sortOrder as "asc" | "desc"}
                  onSort={(column) =>
                    handleFilterChange({
                      sortBy: column as any,
                      sortOrder:
                        filters.sortBy === column && filters.sortOrder === "asc"
                          ? "desc"
                          : "asc",
                    })
                  }
                />
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden grid grid-cols-1 gap-4">
                {users.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onEdit={handleEditUser}
                    onToggleStatus={handleToggleStatus}
                    onDelete={handleDeleteUser}
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Pagination (simple) */}
        {users.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex items-center justify-between border-t border-gray-200 pt-4"
          >
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{users.length}</span> users
            </p>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                disabled
              >
                Previous
              </button>
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                disabled
              >
                Next
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <AddUserModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleCreateUser}
        isLoading={isSubmitting}
        activeRole={activeRole}
      />

      {/* Toast Notification */}
      {isToastVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 flex items-center gap-3 z-40"
        >
          <div className="w-2 h-2 bg-emerald-600 rounded-full" />
          <p className="text-sm text-gray-900">{toastMessage}</p>
        </motion.div>
      )}
    </div>
  );
};
