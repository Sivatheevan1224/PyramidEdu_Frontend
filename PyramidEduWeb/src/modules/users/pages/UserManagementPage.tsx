/**
 * UserManagementPage - Main user management page with role-based tabs
 */

"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { Plus, AlertCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { userService } from "../services/user.service";
import { supportStaffService } from "../services/support-staff.service";
import { useUsers } from "../hooks/useUsers";
import { UserTable } from "../components/UserTable";
import { UserCard } from "../components/UserCard";
import { AddUserModal } from "../components/AddUserModal";
import { ViewUserModal } from "../components/ViewUserModal";
import { UserRoleTabs } from "../components/UserRoleTabs";
import { SearchBar } from "../components/SearchBar";
import { EmptyState } from "../components/EmptyState";
import { ROLE_CONFIG } from "../constants/roles";
import { ConfirmModal } from "@/components/ConfirmModal";
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
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const [isViewOpen, setIsViewOpen] = React.useState(false);
  const [viewingUser, setViewingUser] = React.useState<User | null>(null);
  const [paymentUser, setPaymentUser] = React.useState<(User & { isApproved?: boolean }) | null>(null);
  const [realPaymentHistory, setRealPaymentHistory] = React.useState<any[]>([]);
  const [isPaymentLoading, setIsPaymentLoading] = React.useState(false);
  const [confirmConfig, setConfirmConfig] = React.useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    isDestructive?: boolean;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const [userCounts, setUserCounts] = React.useState({
    total: 0,
    managers: 0,
    teachers: 0,
    students: 0,
    supportStaff: 0,
  });
  const [updatingStatusUserId, setUpdatingStatusUserId] = React.useState<string | null>(null);
  const [editForm, setEditForm] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "MANAGER" as UserRole,
    status: "ACTIVE" as UserStatus,
    roleType: "",
    salary: "",
  });
  // Subject edit state (teachers only)
  const [editSubjectId, setEditSubjectId] = React.useState<string>("");
  const [editSubjects, setEditSubjects] = React.useState<{ id: string; name: string }[]>([]);
  const [editSubjectsLoading, setEditSubjectsLoading] = React.useState(false);
  const editSubjectsFetched = useRef(false);

  // Load available subjects when teacher edit modal opens
  useEffect(() => {
    if (!isEditOpen || editForm.role !== "TEACHER") return;
    if (editSubjectsFetched.current && editSubjects.length > 0) return;
    setEditSubjectsLoading(true);
    api
      .get("/subjects/available")
      .then((res) => {
        const payload = res.data;
        const rows: { id: string; name: string }[] = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
          ? payload.data
          : [];
        setEditSubjects(rows);
        editSubjectsFetched.current = true;
      })
      .catch(() => setEditSubjects([]))
      .finally(() => setEditSubjectsLoading(false));
  }, [isEditOpen, editForm.role]);

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
    approveStudent,
    handleFilterChange,
    openModal,
    closeModal,
    setActiveRole,
  } = useUsers();

  // Show toast notification
  const showToast = useCallback((message: string) => {
    if (message.toLowerCase().includes("failed") || message.toLowerCase().includes("error")) {
      toast.error(message);
    } else {
      toast.success(message);
    }
  }, []);

  const refreshUserCounts = useCallback(async () => {
    try {
      const [usersResponse, supportStaffResponse] = await Promise.all([
        userService.getUsers({ page: 1, limit: 1000 }),
        supportStaffService.getSupportStaff({ page: 1, limit: 1 }),
      ]);
      const allUsers = usersResponse.data;
      const supportStaffCount = supportStaffResponse.total;

      const managersCount = allUsers.filter((user) => user.role === "MANAGER").length;
      const teachersCount = allUsers.filter((user) => user.role === "TEACHER").length;
      const studentsCount = allUsers.filter((user) => user.role === "STUDENT").length;

      setUserCounts({
        total: managersCount + teachersCount + studentsCount + supportStaffCount,
        managers: managersCount,
        teachers: teachersCount,
        students: studentsCount,
        supportStaff: supportStaffCount,
      });
    } catch (error) {
      console.error("Failed to fetch user counts", error);
    }
  }, []);

  React.useEffect(() => {
    void refreshUserCounts();
  }, [refreshUserCounts]);

  // Handle form submission
  const handleCreateUser = useCallback(
    async (data: FormData, role: UserRole) => {
      try {
        let payload: any = { role };
        let selectedSubjectIds: string[] = [];

        if (role === "MANAGER") {
          const managerData = data as AddManagerInput;
          payload = {
            role,
            fullName: `${managerData.firstName} ${managerData.lastName}`.trim(),
            nic: managerData.nicNumber,
            gender: managerData.gender,
            address: managerData.address,
            email: managerData.email,
            phone: managerData.phoneNumber,
            password: managerData.password,
            salary: (managerData.salary !== undefined && managerData.salary !== null && !isNaN(Number(managerData.salary)) && Number(managerData.salary) > 0)
              ? Number(managerData.salary)
              : undefined,
          };
        } else if (role === "TEACHER") {
          const teacherData = data as AddTeacherInput;
          selectedSubjectIds = teacherData.subjects ?? [];
          payload = {
            role,
            fullName: `${teacherData.firstName} ${teacherData.lastName}`.trim(),
            nic: teacherData.nicNumber,
            gender: teacherData.gender,
            address: teacherData.address,
            email: teacherData.email,
            phone: teacherData.phoneNumber,
            password: teacherData.password,
            salary: (teacherData.salary !== undefined && teacherData.salary !== null && !isNaN(Number(teacherData.salary)) && Number(teacherData.salary) > 0)
              ? Number(teacherData.salary)
              : undefined,
            subjectId: selectedSubjectIds[0] ?? undefined,
          };
        } else if (role === "SUPPORT_STAFF") {
          const staffData = data as AddSupportStaffInput;
          payload = {
            role,
            firstName: staffData.firstName,
            lastName: staffData.lastName,
            fullName: `${staffData.firstName} ${staffData.lastName}`.trim(),
            nicNumber: staffData.nicNumber,
            nic: staffData.nicNumber,
            gender: staffData.gender,
            address: staffData.address,
            email: staffData.email,
            phoneNumber: staffData.phoneNumber,
            phone: staffData.phoneNumber,
            roleType: staffData.roleType,
            salary: (staffData.salary !== undefined && staffData.salary !== null && !isNaN(Number(staffData.salary)) && Number(staffData.salary) > 0)
              ? Number(staffData.salary)
              : undefined,
          };
        } else if (role === "STUDENT") {
          const studentData = data as AddStudentInput;
          selectedSubjectIds = studentData.subjectIds ?? [];
          payload = {
            role,
            fullName: `${studentData.firstName} ${studentData.lastName}`.trim(),
            indexNumber: studentData.indexNumber,
            dateOfBirth: studentData.dateOfBirth,
            address: studentData.address,
            email: studentData.email,
            phone: studentData.phoneNumber,
            password: studentData.password,
            nic: (studentData as any).nicNumber || undefined,
            batch: (studentData as any).batch || undefined,
          };
        }

        const result = await createUser(payload);
        if (!result) return;

        const createdUserId = String(result.user.id);

        if (role === "TEACHER" && selectedSubjectIds.length > 0) {
          await Promise.all(
            selectedSubjectIds.map((subjectId) =>
              api.patch(`/subjects/${subjectId}/assign-teacher`, {
                teacherId: createdUserId,
              }),
            ),
          );
        }

        if (role === "STUDENT" && selectedSubjectIds.length > 0) {
          await Promise.all(
            selectedSubjectIds.map((subjectId) =>
              api.post(`/subjects/${subjectId}/enroll`, {
                userId: createdUserId,
              }),
            ),
          );
        }

        const usedPassword = result.temporaryPassword ?? (data as any).password;
        if (usedPassword) {
          await navigator.clipboard.writeText(usedPassword).catch(() => undefined);
          showToast(`User created. Password: ${usedPassword} (copied to clipboard)`);
        } else {
          showToast(`${ROLE_CONFIG[role].label} created successfully!`);
        }
        closeModal();
        await fetchUsers();
        await refreshUserCounts();
      } catch (error: unknown) {
        console.error("Failed to create user", error);
        showToast("Failed to create user. Please try again.");
      }
    },
    [createUser, closeModal, fetchUsers, refreshUserCounts, showToast],
  );

  // Handle edit user
  const handleEditUser = useCallback(async (user: User) => {
    setEditingUser(user);
    
    let detailedUser = user;
    try {
      if (user.role === "SUPPORT_STAFF") {
        const staff = await supportStaffService.getSupportStaffById(user.id);
        if (staff) detailedUser = staff;
      } else {
        const res = await api.get(`/users/${user.id}`);
        if (res.data?.success && res.data.data) {
          detailedUser = { ...user, ...res.data.data };
        }
      }
    } catch {
      // Fallback to row data
    }

    const firstName = detailedUser.firstName || (detailedUser as any).fullName?.split(" ")[0] || (detailedUser as any).staffName?.split(" ")[0] || "";
    const lastName = detailedUser.lastName || (detailedUser as any).fullName?.split(" ").slice(1).join(" ") || (detailedUser as any).staffName?.split(" ").slice(1).join(" ") || "";

    setEditForm({
      firstName,
      lastName,
      email: detailedUser.email || "",
      phoneNumber: detailedUser.phoneNumber || (detailedUser as any).phone || "",
      role: detailedUser.role,
      status: detailedUser.status,
      roleType: detailedUser.roleType || (detailedUser as any).roleType || "",
      salary: detailedUser.salary ? String(detailedUser.salary) : (detailedUser as any).salary ? String((detailedUser as any).salary) : "",
    });
    setEditSubjectId((detailedUser as any).subjectId ?? (detailedUser as any).subject ?? "");
    setIsEditOpen(true);
  }, []);

  const handleUpdateUser = useCallback(async () => {
    if (!editingUser) return;
    try {
      const updatePayload: any = { ...editForm };
      if (editForm.role === "TEACHER" && editSubjectId) {
        updatePayload.subject = editSubjectId;
      }
      await updateUserDetails(editingUser.id, updatePayload);

      if (editForm.role === "TEACHER" && editSubjectId) {
        try {
          await api.patch(`/subjects/${editSubjectId}/assign-teacher`, {
            teacherId: editingUser.id,
          });
        } catch (assignErr) {
          console.warn("Subject allocation update failed (non-critical)", assignErr);
        }
      }

      showToast("User updated successfully!");
      setIsEditOpen(false);
      setEditingUser(null);
      await fetchUsers();
      await refreshUserCounts();
    } catch (error: unknown) {
      console.error("Failed to update user", error);
      showToast("Failed to update user. Please try again.");
    }
  }, [editingUser, editForm, editSubjectId, fetchUsers, refreshUserCounts, updateUserDetails, showToast]);

  // Handle toggle status
  const handleToggleStatus = useCallback(
    async (user: User) => {
      const action = user.status === "ACTIVE" ? "disable" : "enable";
      setConfirmConfig({
        isOpen: true,
        title: `${user.status === "ACTIVE" ? "Disable" : "Enable"} User Account`,
        message: `Are you sure you want to ${action} the user ${user.firstName ? `${user.firstName} ${user.lastName}` : user.email}?`,
        isDestructive: user.status === "ACTIVE",
        onConfirm: async () => {
          setUpdatingStatusUserId(user.id);
          try {
            await toggleUserStatus(user.id, user.status);
            showToast(
              `User ${user.status === "ACTIVE" ? "disabled" : "enabled"} successfully!`,
            );
            await refreshUserCounts();
          } catch (error: unknown) {
            console.error("Failed to update user status", error);
            showToast("Failed to update user status. Please try again.");
          } finally {
            setUpdatingStatusUserId(null);
          }
        }
      });
    },
    [refreshUserCounts, toggleUserStatus, showToast],
  );

  const handleApproveStudent = useCallback(
    async (user: User) => {
      try {
        await approveStudent(user.id);
        showToast('Student approved successfully!');
        await fetchUsers();
        await refreshUserCounts();
      } catch (error: unknown) {
        console.error('Failed to approve student', error);
        showToast('Failed to approve student. Please try again.');
      }
    },
    [approveStudent, fetchUsers, refreshUserCounts, showToast],
  );
  
  const handleResetPassword = useCallback(async (user: User) => {
    try {
      const result = await userService.resetUserPassword(user.id);
      const temp = result.temporaryPassword;
      if (temp) {
        await navigator.clipboard.writeText(temp).catch(() => undefined);
        showToast('Password reset and copied to clipboard');
      } else {
        showToast('Password reset; no password returned.');
      }
      await fetchUsers();
      await refreshUserCounts();
    } catch (error) {
      console.error('Failed to reset password', error);
      showToast('Failed to reset password.');
    }
  }, [fetchUsers, refreshUserCounts, showToast]);

  const handleViewPaymentDetails = useCallback(async (user: User) => {
    setPaymentUser(user);
    setIsPaymentLoading(true);
    try {
      const res = await api.get(`/manager/fees/${user.id}/history`);
      if (res.data?.success) {
        setRealPaymentHistory(res.data.data.history || []);
      }
    } catch (err) {
      console.error("Failed to fetch payment history:", err);
      setRealPaymentHistory([]);
    } finally {
      setIsPaymentLoading(false);
    }
  }, []);

  const handleViewUser = useCallback(async (user: User) => {
    setViewingUser(user);
    setIsViewOpen(true);
    try {
      if (user.role === "SUPPORT_STAFF") {
        const staffUser = await supportStaffService.getSupportStaffById(user.id);
        if (staffUser) setViewingUser(staffUser);
      } else {
        const res = await api.get(`/users/${user.id}`);
        if (res.data?.success && res.data.data) {
          setViewingUser({ ...user, ...res.data.data });
        }
      }
    } catch {
      // Already populated viewingUser with row data, silent fallback
    }
  }, []);

  const handleRoleChange = useCallback(
    (role: UserRole | undefined) => {
      setActiveRole(role);
    },
    [setActiveRole],
  );

  const currentRoleConfig = activeRole
    ? ROLE_CONFIG[activeRole]
    : ROLE_CONFIG["ALL"];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
            User Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage system accounts, assign role permissions, and approve student registrations.
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-rose-900 shadow-xs dark:border-rose-900/60 dark:bg-rose-950/40">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-rose-900 dark:text-rose-200">{error}</p>
            <p className="mt-0.5 text-xs text-rose-700 dark:text-rose-300">
              Please refresh or check server connectivity.
            </p>
          </div>
        </div>
      )}

      {/* User Counts Bar */}
      <Card className="overflow-hidden border border-border bg-card rounded-2xl shadow-xs">
        <div className="p-4 sm:p-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-muted/20 px-3 py-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total</span>
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-white">{userCounts.total}</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-muted/20 px-3 py-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Managers</span>
              <span className="rounded-full bg-slate-900 dark:bg-slate-800 dark:text-slate-100 px-2 py-0.5 text-xs font-bold text-white">{userCounts.managers}</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-muted/20 px-3 py-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Teachers</span>
              <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">{userCounts.teachers}</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-muted/20 px-3 py-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Students</span>
              <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">{userCounts.students}</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-muted/20 px-3 py-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Support</span>
              <span className="rounded-full bg-amber-600 px-2 py-0.5 text-xs font-bold text-white">{userCounts.supportStaff}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status Filter:</span>
            <select
              value={filters.status ?? ""}
              onChange={(event) =>
                handleFilterChange({
                  status: event.target.value
                    ? (event.target.value as UserStatus)
                    : undefined,
                })
              }
              className="h-9 rounded-xl border border-border bg-card px-3 text-xs font-medium text-foreground outline-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="DISABLED">Disabled</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Role Tabs & Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <UserRoleTabs
          activeRole={activeRole}
          onRoleChange={handleRoleChange}
        />

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <SearchBar
            onSearch={(query) => handleFilterChange({ search: query })}
            className="w-full sm:w-64"
          />
          {activeRole !== undefined && (
            <button
              type="button"
              onClick={openModal}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white shadow-xs transition-colors hover:bg-primary/95 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
            >
              <Plus className="h-4 w-4" />
              {currentRoleConfig.addButtonLabel}
            </button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <Card className="overflow-hidden border border-border bg-card rounded-2xl shadow-xs">
        <div className="p-4 sm:p-5">
          {users.length === 0 && !isLoading ? (
            <EmptyState
              title={`No ${currentRoleConfig.label.toLowerCase()} found`}
              description={`Get started by creating your first ${currentRoleConfig.label.toLowerCase()} account`}
              actionLabel={activeRole !== undefined ? currentRoleConfig.addButtonLabel : undefined}
              onAction={activeRole !== undefined ? openModal : undefined}
            />
          ) : (
            <div>
              <div className="hidden lg:block">
                <UserTable
                  users={users}
                  isLoading={isLoading}
                  activeRole={activeRole}
                  onEdit={handleEditUser}
                  onToggleStatus={handleToggleStatus}
                  onApprove={handleApproveStudent}
                  onResetPassword={handleResetPassword}
                  onViewPayment={handleViewPaymentDetails}
                  onView={handleViewUser}
                  sortBy={filters.sortBy}
                  sortOrder={filters.sortOrder}
                  isSubmitting={isSubmitting}
                  updatingStatusUserId={updatingStatusUserId}
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
                    onResetPassword={handleResetPassword}
                    onViewPayment={handleViewPaymentDetails}
                    onApprove={handleApproveStudent}
                    onView={handleViewUser}
                    showDetailsAndActions={activeRole !== undefined}
                    isSubmitting={isSubmitting}
                    activeRole={activeRole}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Modals */}
      <AddUserModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleCreateUser}
        isLoading={isSubmitting}
        activeRole={activeRole ?? "MANAGER"}
      />

      <ViewUserModal
        isOpen={isViewOpen}
        onClose={() => {
          setIsViewOpen(false);
          setViewingUser(null);
        }}
        user={viewingUser}
      />

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold text-foreground">Edit User Details</h3>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="rounded-full p-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                ×
              </button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                First Name
                <input
                  value={editForm.firstName}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-border bg-muted/20 px-3 py-2 text-sm text-foreground focus:outline-none"
                />
              </label>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Last Name
                <input
                  value={editForm.lastName}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-border bg-muted/20 px-3 py-2 text-sm text-foreground focus:outline-none"
                />
              </label>
              {editForm.role !== "SUPPORT_STAFF" && (
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Email Address
                  <input
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-border bg-muted/20 px-3 py-2 text-sm text-foreground focus:outline-none"
                  />
                </label>
              )}
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Phone Number
                <input
                  value={editForm.phoneNumber}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      phoneNumber: e.target.value,
                    }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-border bg-muted/20 px-3 py-2 text-sm text-foreground focus:outline-none"
                />
              </label>
              {editForm.role === "SUPPORT_STAFF" && (
                <>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Staff Role Type
                    <input
                      value={editForm.roleType}
                      onChange={(e) =>
                        setEditForm((prev) => ({ ...prev, roleType: e.target.value }))
                      }
                      placeholder="e.g. Security, Maintenance, Admin Assistant"
                      className="mt-1.5 w-full rounded-xl border border-border bg-muted/20 px-3 py-2 text-sm text-foreground focus:outline-none"
                    />
                  </label>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Salary (Rs.)
                    <input
                      type="number"
                      value={editForm.salary}
                      onChange={(e) =>
                        setEditForm((prev) => ({ ...prev, salary: e.target.value }))
                      }
                      placeholder="e.g. 45000"
                      className="mt-1.5 w-full rounded-xl border border-border bg-muted/20 px-3 py-2 text-sm text-foreground focus:outline-none"
                    />
                  </label>
                </>
              )}
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Role
                <select
                  value={editForm.role}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      role: e.target.value as UserRole,
                    }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none cursor-pointer"
                >
                  <option value="MANAGER">Manager</option>
                  <option value="TEACHER">Teacher</option>
                  <option value="SUPPORT_STAFF">Support Staff</option>
                  <option value="STUDENT">Student</option>
                </select>
              </label>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Account Status
                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      status: e.target.value as UserStatus,
                    }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none cursor-pointer"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="DISABLED">Disabled</option>
                </select>
              </label>
              {editForm.role === "TEACHER" && (
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground sm:col-span-2">
                  Assigned Subject
                  <select
                    value={editSubjectId}
                    onChange={(e) => setEditSubjectId(e.target.value)}
                    disabled={editSubjectsLoading}
                    className="mt-1.5 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none cursor-pointer disabled:opacity-60"
                  >
                    <option value="">{editSubjectsLoading ? "Loading subjects…" : "— No subject —"}</option>
                    {editSubjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </div>
            <div className="mt-6 flex justify-end gap-3 border-t border-border pt-4">
              <button
                type="button"
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-muted/60 transition-colors text-foreground cursor-pointer"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-white hover:bg-primary/95 transition-colors shadow-xs cursor-pointer"
                onClick={handleUpdateUser}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {paymentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <Card className="w-full max-w-3xl overflow-hidden border border-border bg-card shadow-2xl rounded-2xl">
            <div className="flex items-start justify-between border-b border-border bg-muted/30 px-5 py-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Fee Payment Profile</p>
                <h3 className="text-lg font-bold text-foreground">{paymentUser.firstName} {paymentUser.lastName}</h3>
                <p className="text-xs text-muted-foreground">{paymentUser.indexNumber || paymentUser.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setPaymentUser(null)}
                className="rounded-xl px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Close
              </button>
            </div>

            {(() => {
              const totalDue = Number((paymentUser as any).totalFeeAmount) || 0;
              const totalPaid = realPaymentHistory
                .filter((p) => p.status === 'COMPLETED' || p.status === 'VERIFIED')
                .reduce((sum, p) => sum + Number(p.amount), 0);
              const balance = Math.max(totalDue - totalPaid, 0);
              const status = balance === 0 ? "PAID" : totalPaid > 0 ? "PARTIAL" : "UNPAID";

              return (
                <div className="grid gap-4 p-5 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Card className="p-4 shadow-xs border border-border bg-card rounded-xl">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Fee</p>
                      <p className="mt-2 text-xl font-black text-foreground">Rs. {totalDue.toLocaleString()}.00</p>
                    </Card>
                    <Card className="p-4 shadow-xs border border-border bg-card rounded-xl">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Settled</p>
                      <p className="mt-2 text-xl font-black text-emerald-600">Rs. {totalPaid.toLocaleString()}.00</p>
                    </Card>
                    <Card className="p-4 shadow-xs border border-border bg-card rounded-xl">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Balance</p>
                      <p className="mt-2 text-xl font-black text-amber-600">Rs. {balance.toLocaleString()}.00</p>
                    </Card>
                    <Card className="p-4 shadow-xs border border-border bg-card rounded-xl">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Registration</p>
                      <div className="mt-2 flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        <span className="text-xs font-bold text-foreground">{paymentUser?.isApproved ? "Approved" : "Pending approval"}</span>
                      </div>
                    </Card>
                  </div>

                  <Card className="p-4 shadow-xs border border-border bg-card rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">History</p>
                        <h4 className="mt-0.5 text-sm font-bold text-foreground">Transactions Log</h4>
                      </div>
                      <Badge variant={status === "PAID" ? "default" : status === "PARTIAL" ? "secondary" : "destructive"}>{status}</Badge>
                    </div>
                    <div className="mt-3 space-y-2">
                      {isPaymentLoading ? (
                        <p className="text-xs text-muted-foreground">Loading payment history...</p>
                      ) : realPaymentHistory.length === 0 ? (
                        <p className="text-xs text-muted-foreground">No payment history recorded.</p>
                      ) : (
                        realPaymentHistory.map((entry, idx) => (
                          <div key={entry.transactionId || idx} className="rounded-xl border border-border bg-muted/20 p-2.5">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="font-bold text-xs text-foreground">{entry.receiptNumber || entry.transactionId || 'Payment'}</p>
                                <p className="text-[10px] text-muted-foreground">
                                  {entry.paymentDate ? new Date(entry.paymentDate).toLocaleDateString() : '—'} · {entry.method}
                                </p>
                              </div>
                              <Badge variant={entry.status === "COMPLETED" || entry.status === "VERIFIED" ? "default" : "secondary"} className="text-[9px]">
                                {entry.status}
                              </Badge>
                            </div>
                            <p className="mt-1 text-xs font-extrabold text-foreground">Rs. {entry.amount.toLocaleString()}.00</p>
                          </div>
                        ))
                      )}
                    </div>
                  </Card>
                </div>
              );
            })()}
          </Card>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        isDestructive={confirmConfig.isDestructive}
        confirmLabel={confirmConfig.isDestructive ? "Disable" : "Enable"}
      />
    </div>
  );
};
