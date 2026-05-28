/**
 * UserManagementPage - Main user management page with role-based tabs
 */

"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import {
  Plus,
  AlertCircle,
  Users,
  UserCog,
  GraduationCap,
  UserPlus,
} from "lucide-react";
import { motion } from "framer-motion";
import { StatCard } from "@/components/StatCard";
import { Card } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useUsers } from "../hooks/useUsers";
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
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const [editForm, setEditForm] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "MANAGER" as UserRole,
    status: "ACTIVE" as UserStatus,
  });

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

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, []);

  // Refetch when filters change (role, search, status, sorting)
  useEffect(() => {
    fetchUsers();
  }, [filters]);

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
          payload = {
            ...payload,
            firstName: managerData.firstName,
            lastName: managerData.lastName,
            nicNumber: managerData.nicNumber,
            gender: managerData.gender,
            address: managerData.address,
            email: managerData.email,
            phoneNumber: managerData.phoneNumber,
            salary: managerData.salary,
          };
        } else if (role === "TEACHER") {
          const teacherData = data as AddTeacherInput;
          payload = {
            ...payload,
            firstName: teacherData.firstName,
            lastName: teacherData.lastName,
            nicNumber: teacherData.nicNumber,
            gender: teacherData.gender,
            address: teacherData.address,
            email: teacherData.email,
            phoneNumber: teacherData.phoneNumber,
            subject: teacherData.subject,
            salary: teacherData.salary,
          };
        } else if (role === "SUPPORT_STAFF") {
          const staffData = data as AddSupportStaffInput;
          payload = {
            ...payload,
            firstName: staffData.firstName,
            lastName: staffData.lastName,
            nicNumber: staffData.nicNumber,
            gender: staffData.gender,
            address: staffData.address,
            email: staffData.email,
            phoneNumber: staffData.phoneNumber,
            roleType: staffData.roleType,
            salary: staffData.salary,
          };
        } else if (role === "STUDENT") {
          const studentData = data as AddStudentInput;
          payload = {
            ...payload,
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            dateOfBirth: studentData.dateOfBirth,
            email: studentData.email,
            phoneNumber: studentData.phoneNumber,
            indexNumber: studentData.indexNumber,
            address: studentData.address,
          };
        }

        const result = await createUser(payload);
        if (!result) return;
        if (result.temporaryPassword) {
          await navigator.clipboard
            .writeText(result.temporaryPassword)
            .catch(() => undefined);
          showToast(
            `${ROLE_CONFIG[role].label} created. Temporary password copied.`,
          );
        } else {
          showToast(`${ROLE_CONFIG[role].label} created successfully!`);
        }
        closeModal();
        await fetchUsers();
      } catch (err) {
        showToast("Failed to create user. Please try again.");
      }
    },
    [createUser, closeModal, fetchUsers, showToast],
  );

  // Handle edit user
  const handleEditUser = useCallback((user: User) => {
    setEditingUser(user);
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      status: user.status,
    });
    setIsEditOpen(true);
  }, []);

  const handleUpdateUser = useCallback(async () => {
    if (!editingUser) return;
    try {
      await updateUserDetails(editingUser.id, editForm);
      showToast("User updated successfully!");
      setIsEditOpen(false);
      setEditingUser(null);
    } catch (err) {
      showToast("Failed to update user. Please try again.");
    }
  }, [editingUser, editForm, updateUserDetails, showToast]);

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
    (role: UserRole | undefined) => {
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

  const currentRoleConfig = activeRole ? ROLE_CONFIG[activeRole] : ROLE_CONFIG['ALL'];

  const roleStats = useMemo(() => {
    const totals = {
      MANAGER: 0,
      TEACHER: 0,
      SUPPORT_STAFF: 0,
      STUDENT: 0,
    };
    users.forEach((user) => {
      totals[user.role] += 1;
    });
    return totals;
  }, [users]);

  const statusStats = useMemo(() => {
    const activeCount = users.filter((u) => u.status === "ACTIVE").length;
    const disabledCount = users.filter((u) => u.status === "DISABLED").length;
    return { activeCount, disabledCount };
  }, [users]);

  const chartData = useMemo(
    () => [
      { label: "Managers", value: roleStats.MANAGER },
      { label: "Teachers", value: roleStats.TEACHER },
      { label: "Support", value: roleStats.SUPPORT_STAFF },
      { label: "Students", value: roleStats.STUDENT },
    ],
    [roleStats],
  );

  return (
    <div className="bg-background min-h-screen text-foreground">
      {/* Role Tabs */}
      <UserRoleTabs activeRole={activeRole} onRoleChange={handleRoleChange} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
          <StatCard
            label="Total Users"
            value={`${users.length}`}
            icon={Users}
            accent="primary"
          />
          <StatCard
            label="Active"
            value={`${statusStats.activeCount}`}
            icon={UserPlus}
            accent="accent"
          />
          <StatCard
            label="Disabled"
            value={`${statusStats.disabledCount}`}
            icon={UserCog}
            accent="warning"
            trend="down"
          />
          <StatCard
            label="Teachers"
            value={`${roleStats.TEACHER}`}
            icon={GraduationCap}
            accent="secondary"
          />
        </div>

        <Card className="p-4 mb-8">
          <p className="text-sm font-semibold mb-3">User Distribution</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                type="number"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis
                dataKey="label"
                type="category"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid hsl(var(--border))",
                }}
              />
              <Bar
                dataKey="value"
                fill="hsl(var(--primary))"
                radius={[0, 8, 8, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        {/* Header Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          key={activeRole}
        >
          <div className="flex items-center gap-3 mb-2">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
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
            className="mb-6 p-4 bg-red-50 border border-red-200 dark:bg-red-950/40 dark:border-red-900/60 rounded-lg flex items-center gap-3"
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
          className="mb-6 bg-card rounded-lg border border-border p-6"
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
            className="mt-8 flex items-center justify-between border-t border-border pt-4"
          >
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{users.length}</span> users
            </p>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted/50 transition-colors disabled:bg-muted/40 disabled:text-muted-foreground disabled:cursor-not-allowed"
                disabled
              >
                Previous
              </button>
              <button
                className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted/50 transition-colors disabled:bg-muted/40 disabled:text-muted-foreground disabled:cursor-not-allowed"
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
        activeRole={activeRole ?? 'MANAGER'}
      />

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Edit User</h3>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="rounded-full p-2 text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-foreground">
                First Name
                <input
                  value={editForm.firstName}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
              </label>
              <label className="text-sm font-medium text-foreground">
                Last Name
                <input
                  value={editForm.lastName}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
              </label>
              <label className="text-sm font-medium text-foreground">
                Email
                <input
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
              </label>
              <label className="text-sm font-medium text-foreground">
                Phone
                <input
                  value={editForm.phoneNumber}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      phoneNumber: e.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
              </label>
              <label className="text-sm font-medium text-foreground">
                Role
                <select
                  value={editForm.role}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      role: e.target.value as UserRole,
                    }))
                  }
                  className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                >
                  <option value="MANAGER">Manager</option>
                  <option value="TEACHER">Teacher</option>
                  <option value="SUPPORT_STAFF">Support Staff</option>
                  <option value="STUDENT">Student</option>
                </select>
              </label>
              <label className="text-sm font-medium text-foreground">
                Status
                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      status: e.target.value as UserStatus,
                    }))
                  }
                  className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="DISABLED">Disabled</option>
                </select>
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                className="rounded-lg border border-border px-4 py-2 text-sm"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700"
                onClick={handleUpdateUser}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {isToastVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 bg-card border border-border rounded-lg shadow-lg px-4 py-3 flex items-center gap-3 z-40"
        >
          <div className="w-2 h-2 bg-emerald-600 rounded-full" />
          <p className="text-sm text-foreground">{toastMessage}</p>
        </motion.div>
      )}
    </div>
  );
};
