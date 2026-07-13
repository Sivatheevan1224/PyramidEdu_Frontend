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
  const [userCounts, setUserCounts] = React.useState({
    total: 0,
    managers: 0,
    teachers: 0,
    students: 0,
    supportStaff: 0,
  });
  const [editForm, setEditForm] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "MANAGER" as UserRole,
    status: "ACTIVE" as UserStatus,
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
        // Convert role-specific form data to generic CreateUserPayload
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
    // Pre-fill subject for teachers
    setEditSubjectId((user as any).subjectId ?? "");
    setIsEditOpen(true);
  }, []);

  const handleUpdateUser = useCallback(async () => {
    if (!editingUser) return;
    try {
      // Build update payload — include subject UUID for teachers
      const updatePayload: any = { ...editForm };
      if (editForm.role === "TEACHER" && editSubjectId) {
        updatePayload.subject = editSubjectId; // backend maps dto.subject → teacher.subjectId
      }
      await updateUserDetails(editingUser.id, updatePayload);

      // Also update SubjectAllocation table for teachers
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
      try {
        await toggleUserStatus(user.id, user.status);
        showToast(
          `User ${user.status === "ACTIVE" ? "disabled" : "enabled"} successfully!`,
        );
        await refreshUserCounts();
      } catch (error: unknown) {
        console.error("Failed to update user status", error);
        showToast("Failed to update user status. Please try again.");
      }
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

  const buildPaymentProfile = useCallback((student: User & { isApproved?: boolean }) => {
    const seed = Number.parseInt(student.id, 10) || (student.indexNumber ?? "").length || 1;
    const totalDue = 24000 + (seed % 4) * 2000;
    const approved = Boolean(student.isApproved);
    const paid = approved ? Math.max(12000, totalDue - 5000 - (seed % 3) * 500) : 0;
    const balance = Math.max(totalDue - paid, 0);

    return {
      totalDue,
      paid,
      balance,
      status: !approved ? "PENDING" : balance === 0 ? "PAID" : balance >= totalDue / 2 ? "PARTIAL" : "OVERDUE",
      history: approved
        ? [
            { id: `INV-${student.id}-001`, amount: Math.min(12000, totalDue), status: "PAID", note: "Admission fee cleared", date: student.createdAt.slice(0, 10) },
            { id: `INV-${student.id}-002`, amount: balance, status: balance === 0 ? "PAID" : "PENDING", note: balance === 0 ? "Current term settled" : "Current term balance pending", date: new Date().toISOString().slice(0, 10) },
          ]
        : [{ id: `INV-${student.id}-001`, amount: totalDue, status: "PENDING", note: "Awaiting payment confirmation", date: new Date().toISOString().slice(0, 10) }],
    };
  }, []);

  const handleViewPaymentDetails = useCallback((user: User) => {
    setPaymentUser(user);
  }, []);

  const handleViewUser = useCallback((user: User) => {
    setViewingUser(user);
    setIsViewOpen(true);
  }, []);

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

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_55%,_#f8fafc_100%)] dark:bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.08),_transparent_40%),linear-gradient(180deg,_hsl(var(--background))_0%,_hsl(var(--background))_100%)] text-foreground">
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
          <div className="border-b border-border/60 bg-gradient-to-r from-emerald-50 via-white to-cyan-50 dark:from-emerald-950/20 dark:via-card/90 dark:to-cyan-950/20 px-4 py-2.5 sm:px-6">
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
                  <span className="rounded-full bg-slate-900 dark:bg-slate-800 dark:text-slate-100 px-2 py-0.5 text-xs font-semibold text-white">
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
                    className="min-w-[140px] bg-transparent text-sm font-medium text-foreground outline-none dark:bg-slate-900"
                  >
                    <option value="" className="bg-white dark:bg-slate-900 text-foreground">All</option>
                    <option value="ACTIVE" className="bg-white dark:bg-slate-900 text-foreground">Active</option>
                    <option value="DISABLED" className="bg-white dark:bg-slate-900 text-foreground">Disabled</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        </Card>

        <Card className="sticky top-[72px] z-10 mb-5 overflow-hidden border-border/70 bg-card/95 shadow-sm">
          <div className="border-b border-border/60 bg-gradient-to-r from-emerald-50 via-white to-cyan-50 dark:from-emerald-950/20 dark:via-card/90 dark:to-cyan-950/20 px-4 py-3 sm:px-6">
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
                {activeRole !== undefined && (
                  <button
                    type="button"
                    onClick={openModal}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
                    disabled={isSubmitting}
                  >
                    <Plus className="h-4 w-4" />
                    {currentRoleConfig.addButtonLabel}
                  </button>
                )}
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
      </div>

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
              {editForm.role === "TEACHER" && (
                <label className="text-sm font-medium text-foreground sm:col-span-2">
                  Subject
                  <select
                    value={editSubjectId}
                    onChange={(e) => setEditSubjectId(e.target.value)}
                    disabled={editSubjectsLoading}
                    className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm disabled:opacity-60"
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
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted/60 transition-colors text-foreground"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700 transition-colors shadow-sm dark:shadow-none"
                onClick={handleUpdateUser}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {paymentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-3xl overflow-hidden border-border bg-card shadow-2xl">
            <div className="flex items-start justify-between border-b border-border/60 bg-linear-to-r from-slate-50 via-white to-emerald-50 dark:from-slate-950/40 dark:via-card dark:to-emerald-950/40 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Payment details</p>
                <h3 className="text-lg font-semibold text-foreground">{paymentUser.firstName} {paymentUser.lastName}</h3>
                <p className="text-sm text-muted-foreground">{paymentUser.indexNumber || paymentUser.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setPaymentUser(null)}
                className="rounded-full px-3 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Close
              </button>
            </div>

            {(() => {
              const payment = buildPaymentProfile(paymentUser);
              return (
                <div className="grid gap-4 p-5 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Card className="p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Total Due</p>
                      <p className="mt-2 text-xl font-semibold">Rs. {payment.totalDue.toLocaleString()}.00</p>
                    </Card>
                    <Card className="p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Paid</p>
                      <p className="mt-2 text-xl font-semibold text-emerald-600">Rs. {payment.paid.toLocaleString()}.00</p>
                    </Card>
                    <Card className="p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Balance</p>
                      <p className="mt-2 text-xl font-semibold text-amber-600">Rs. {payment.balance.toLocaleString()}.00</p>
                    </Card>
                    <Card className="p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Student Status</p>
                      <div className="mt-2 flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm font-medium">{paymentUser?.isApproved ? "Approved" : "Pending approval"}</span>
                      </div>
                    </Card>
                  </div>

                  <Card className="p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Transactions</p>
                        <h4 className="mt-1 text-base font-semibold text-foreground">Payment history</h4>
                      </div>
                      <Badge variant={payment.status === "PAID" ? "default" : payment.status === "PARTIAL" ? "secondary" : "destructive"}>{payment.status}</Badge>
                    </div>
                    <div className="mt-4 space-y-3">
                      {payment.history.map((entry) => (
                        <div key={entry.id} className="rounded-2xl border border-border bg-muted/20 p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-foreground">{entry.id}</p>
                              <p className="text-xs text-muted-foreground">{entry.date}</p>
                            </div>
                            <Badge variant={entry.status === "PAID" ? "default" : "secondary"}>{entry.status}</Badge>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">{entry.note}</p>
                          <p className="mt-2 text-sm font-semibold text-foreground">Rs. {entry.amount.toLocaleString()}.00</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              );
            })()}
          </Card>
        </div>
      )}
    </div>
  );
};
