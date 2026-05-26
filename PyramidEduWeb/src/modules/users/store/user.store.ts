/**
 * User Store - Zustand state management
 */

import { create } from 'zustand';
import { User, UserFilters, UserRole } from '../types/user.types';

interface UserState {
  // State
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  totalUsers: number;
  currentPage: number;
  pageSize: number;
  filters: UserFilters;
  isModalOpen: boolean;
  editingUserId: string | null;
  activeRole: UserRole;

  // Actions
  setUsers: (users: User[]) => void;
  setSelectedUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  setError: (error: string | null) => void;
  setTotalUsers: (total: number) => void;
  setCurrentPage: (page: number) => void;
  setFilters: (filters: Partial<UserFilters>) => void;
  setActiveRole: (role: UserRole) => void;
  resetFilters: () => void;
  openModal: () => void;
  closeModal: () => void;
  setEditingUserId: (id: string | null) => void;
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  removeUser: (userId: string) => void;
  reset: () => void;
}

const initialFilters: UserFilters = {
  search: '',
  role: 'MANAGER',
  status: undefined,
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
  limit: 10,
};

export const useUserStore = create<UserState>((set) => ({
  // Initial state
  users: [],
  selectedUser: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
  totalUsers: 0,
  currentPage: 1,
  pageSize: 10,
  filters: initialFilters,
  isModalOpen: false,
  editingUserId: null,
  activeRole: 'MANAGER',

  // Actions
  setUsers: (users) => set({ users }),
  setSelectedUser: (user) => set({ selectedUser: user }),
  setLoading: (isLoading) => set({ isLoading }),
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
  setError: (error) => set({ error }),
  setTotalUsers: (total) => set({ totalUsers: total }),
  setCurrentPage: (page) =>
    set((state) => ({
      currentPage: page,
      filters: { ...state.filters, page },
    })),
  
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters, page: 1 },
      currentPage: 1,
    })),

  setActiveRole: (role) =>
    set((state) => ({
      activeRole: role,
      filters: { ...state.filters, role, page: 1 },
      currentPage: 1,
    })),

  resetFilters: () => set({ filters: initialFilters, currentPage: 1 }),

  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false, editingUserId: null }),

  setEditingUserId: (id) => set({ editingUserId: id }),

  addUser: (user) =>
    set((state) => ({
      users: [user, ...state.users],
      totalUsers: state.totalUsers + 1,
    })),

  updateUser: (updatedUser) =>
    set((state) => ({
      users: state.users.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
      selectedUser: state.selectedUser?.id === updatedUser.id ? updatedUser : state.selectedUser,
    })),

  removeUser: (userId) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== userId),
      totalUsers: state.totalUsers - 1,
    })),

  reset: () =>
    set({
      users: [],
      selectedUser: null,
      isLoading: false,
      isSubmitting: false,
      error: null,
      totalUsers: 0,
      currentPage: 1,
      filters: initialFilters,
      isModalOpen: false,
      editingUserId: null,
      activeRole: 'MANAGER',
    }),
}));
