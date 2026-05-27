/**
 * useUsers Hook - Custom hook for User Management logic
 */

import { useCallback, useEffect, useState } from 'react';
import { userService } from '../services/user.service';
import { useUserStore } from '../store/user.store';
import { User, UserFilters, UserRole, CreateUserPayload, CreateUserResult, UpdateUserPayload } from '../types/user.types';

export const useUsers = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    users,
    isLoading,
    error,
    filters,
    currentPage,
    totalUsers,
    selectedUser,
    isModalOpen,
    editingUserId,
    activeRole,
    setUsers,
    setLoading,
    setSubmitting,
    setError,
    setTotalUsers,
    setSelectedUser,
    addUser,
    updateUser,
    removeUser,
    setFilters,
    setActiveRole,
    openModal,
    closeModal,
    setEditingUserId,
  } = useUserStore();

  // Fetch users
  const fetchUsers = useCallback(async (appliedFilters?: UserFilters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getUsers(appliedFilters || filters);
      setUsers(response.data);
      setTotalUsers(response.total);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(message);
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, setUsers, setLoading, setError, setTotalUsers]);

  // Fetch single user
  const fetchUser = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const user = await userService.getUser(userId);
      setSelectedUser(user);
      return user;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch user';
      setError(message);
      console.error('Fetch user error:', err);
    } finally {
      setLoading(false);
    }
  }, [setSelectedUser, setLoading, setError]);

  // Create user
  const createUser = useCallback(async (payload: CreateUserPayload): Promise<CreateUserResult> => {
    setSubmitting(true);
    setError(null);
    try {
      const result = await userService.createUser(payload);
      addUser(result.user);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create user';
      setError(message);
      console.error('Create user error:', err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [addUser, setError, setSubmitting]);

  // Update user
  const updateUserDetails = useCallback(async (userId: string, payload: UpdateUserPayload) => {
    setSubmitting(true);
    setError(null);
    try {
      const updatedUser = await userService.updateUser(userId, payload);
      updateUser(updatedUser);
      return updatedUser;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update user';
      setError(message);
      console.error('Update user error:', err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [updateUser, setError, setSubmitting]);

  // Toggle user status
  const toggleUserStatus = useCallback(async (userId: string, currentStatus: string) => {
    setSubmitting(true);
    setError(null);
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
      const updatedUser = await userService.updateUserStatus(userId, newStatus as 'ACTIVE' | 'DISABLED');
      updateUser(updatedUser);
      return updatedUser;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update user status';
      setError(message);
      console.error('Toggle status error:', err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [updateUser, setError, setSubmitting]);

  // Delete user
  const deleteUser = useCallback(async (userId: string) => {
    setSubmitting(true);
    setError(null);
    try {
      await userService.deleteUser(userId);
      removeUser(userId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete user';
      setError(message);
      console.error('Delete user error:', err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [removeUser, setError, setSubmitting]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: Partial<UserFilters>) => {
    setFilters(newFilters);
  }, [setFilters]);

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    // State
    users,
    isLoading,
    error,
    filters,
    currentPage,
    totalUsers,
    selectedUser,
    isModalOpen,
    editingUserId,
    isSubmitting,
    activeRole,

    // Actions
    fetchUsers,
    fetchUser,
    createUser,
    updateUserDetails,
    toggleUserStatus,
    deleteUser,
    handleFilterChange,
    openModal,
    closeModal,
    setEditingUserId,
    setActiveRole,
  };
};
