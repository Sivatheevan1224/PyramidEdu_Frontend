/**
 * User Types - TypeScript interfaces for User Management
 */

export type UserRole = 'MANAGER' | 'TEACHER' | 'SUPPORT_STAFF' | 'STUDENT';
export type UserStatus = 'ACTIVE' | 'DISABLED';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  nicNumber?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  email: string;
  phoneNumber: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  // Role-specific fields
  department?: string; // Manager
  subject?: string; // Teacher
  salary?: number; // Teacher, Support Staff
  roleType?: string; // Support Staff
  indexNumber?: string; // Student
  parentName?: string; // Student
  parentPhone?: string; // Student
  address?: string; // Student
}

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  // Role-specific fields
  department?: string;
  subject?: string;
  nicNumber?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  salary?: number;
  roleType?: string;
  indexNumber?: string;
  parentName?: string;
  parentPhone?: string;
  address?: string;
}

export interface CreateUserResult {
  user: User;
  temporaryPassword?: string;
}

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  role?: UserRole;
  department?: string;
  subject?: string;
  salary?: number;
  roleType?: string;
  indexNumber?: string;
  parentName?: string;
  parentPhone?: string;
  address?: string;
}

export interface UserFilters {
  search?: string;
  role?: UserRole;
  status?: UserStatus;
  sortBy?: 'name' | 'email' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
}
