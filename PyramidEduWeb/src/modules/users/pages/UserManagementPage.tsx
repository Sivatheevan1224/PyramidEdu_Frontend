/**
 * UserManagementPage - Main user management page with role-based tabs
 */

"use client";

import React, { useCallback } from "react";
import { Plus, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useUsers } from "../hooks/useUsers";
import { UserTable } from "../components/UserTable";
import { UserCard } from "../components/UserCard";
import { AddUserModal } from "../components/AddUserModal";
import { UserRoleTabs } from "../components/UserRoleTabs";
import { SearchBar } from "../components/SearchBar";
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

  const currentRoleConfig = activeRole
    ? ROLE_CONFIG[activeRole]
    : ROLE_CONFIG["ALL"];

  const userCounts = {
    total: users.length,
    managers: users.filter((user) => user.role === "MANAGER").length,
    teachers: users.filter((user) => user.role === "TEACHER").length,
    students: users.filter((user) => user.role === "STUDENT").length,
    supportStaff: users.filter((user) => user.role === "SUPPORT_STAFF").length,
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_55%,_#f8fafc_100%)] text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-red-900 shadow-sm dark:border-red-900/60 dark:bg-red-950/40">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-900">{error}</p>
              <p className="mt-1 text-sm text-red-700">
                Please try again or contact support.
              </p>
            </div>
          </div>
        )}

        <Card className="sticky top-0 z-20 mb-0 overflow-hidden border-border/70 bg-card/95 shadow-sm">
          <div className="border-b border-border/60 bg-gradient-to-r from-emerald-50 via-white to-cyan-50 px-4 py-2.5 sm:px-6">
            <div className="flex flex-col gap-2.5 2xl:flex-row 2xl:items-center 2xl:justify-between">
              <div className="flex flex-nowrap items-center gap-2 overflow-x-auto">
                <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-background px-2.5 py-1.5 shadow-sm">
                  <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Total Users
                  </span>
                  <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white">
                    {userCounts.total}
                  </span>
                </div>
                <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-background px-2.5 py-1.5 shadow-sm">
                  <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Managers
                  </span>
                  <span className="rounded-full bg-slate-900 px-2 py-0.5 text-xs font-semibold text-white">
                    {userCounts.managers}
                  </span>
                </div>
                <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-background px-2.5 py-1.5 shadow-sm">
                  <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Teachers
                  </span>
                  <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">
                    {userCounts.teachers}
                  </span>
                </div>
                <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-background px-2.5 py-1.5 shadow-sm">
                  <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Students
                  </span>
                  <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white">
                    {userCounts.students}
                  </span>
                </div>
                <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-background px-2.5 py-1.5 shadow-sm">
                  <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Support Staff
                  </span>
                  <span className="rounded-full bg-orange-600 px-2 py-0.5 text-xs font-semibold text-white">
                    {userCounts.supportStaff}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <label className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-1.5 shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Status
                  </span>
                  <select
                    value={filters.status ?? ""}
                    onChange={(event) =>
                      handleFilterChange({
                        status: event.target.value
                          ? (event.target.value as UserStatus)
                          : undefined,
                      })
                    }
                    className="min-w-[140px] bg-transparent text-sm font-medium text-foreground outline-none"
                  >
                    <option value="">All</option>
                    <option value="ACTIVE">Active</option>
                    <option value="DISABLED">Disabled</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        </Card>

        <Card className="sticky top-[72px] z-10 mb-5 overflow-hidden border-border/70 bg-card/95 shadow-sm">
          <div className="border-b border-border/60 bg-gradient-to-r from-emerald-50 via-white to-cyan-50 px-4 py-3 sm:px-6">
            <div className="flex flex-col gap-3 2xl:flex-row 2xl:items-center 2xl:justify-between">
              <div className="flex justify-start">
                <UserRoleTabs
                  activeRole={activeRole}
                  onRoleChange={handleRoleChange}
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 2xl:shrink-0">
                <SearchBar
                  onSearch={(query) => handleFilterChange({ search: query })}
                  className="w-full"
                />
                <button
                  type="button"
                  onClick={openModal}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
                  disabled={isSubmitting}
                >
                  <Plus className="h-4 w-4" />
                  {currentRoleConfig.addButtonLabel}
                </button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden border-border/70 bg-card/95 shadow-sm">
          <div className="p-4 sm:p-5">
            {users.length === 0 && !isLoading ? (
              <EmptyState
                title={`No ${currentRoleConfig.label.toLowerCase()} found`}
                description={`Get started by creating your first ${currentRoleConfig.label.toLowerCase()} account`}
                actionLabel={currentRoleConfig.addButtonLabel}
                onAction={openModal}
              />
            ) : (
              <div>
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
                          filters.sortBy === column &&
                          filters.sortOrder === "asc"
                            ? "desc"
                            : "asc",
                      })
                    }
                  />
                </div>

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
          </div>
        </Card>
      </div>

      {/* Modals */}
      <AddUserModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleCreateUser}
        isLoading={isSubmitting}
        activeRole={activeRole ?? "MANAGER"}
      />

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-xl">
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
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-lg">
          <div className="w-2 h-2 bg-emerald-600 rounded-full" />
          <p className="text-sm text-foreground">{toastMessage}</p>
        </div>
      )}
    </div>
  );
};
