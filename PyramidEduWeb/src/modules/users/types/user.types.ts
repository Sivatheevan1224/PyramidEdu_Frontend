/**
 * User Types - TypeScript interfaces for User Management
 */

export type UserRole = 'MANAGER' | 'TEACHER' | 'SUPPORT_STAFF' | 'STUDENT';
export type UserStatus = 'ACTIVE' | 'DISABLED';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  nicNumber?: string;
  gender?: Gender;
  email: string;
  phoneNumber: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  // Role-specific fields
  department?: string; // Manager
  managerSalary?: number; // Manager
  subject?: string; // Teacher
  salary?: number; // Teacher, Support Staff
  roleType?: string; // Support Staff
  
  indexNumber?: string; // Student
  dateOfBirth?: string; // Student
  address?: string; // Student
  isApproved?: boolean; // Student approval flag
}

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  password?: string;
  // Role-specific fields
  department?: string;
  managerSalary?: number;
  subject?: string;
  subjectIds?: number[];
  nicNumber?: string;
  gender?: Gender;
  salary?: number;
  roleType?: string;
  indexNumber?: string;
  dateOfBirth?: string;
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
  managerSalary?: number;
  subject?: string;
  salary?: number;
  roleType?: string;
  nicNumber?: string;
  gender?: Gender;
  indexNumber?: string;
  dateOfBirth?: string;
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
