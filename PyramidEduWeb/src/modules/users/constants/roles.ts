/**
 * Role Constants and Configuration
 */

import { UserRole } from '../types/user.types';

export const ROLE_CONFIG: Record<
  UserRole | 'ALL',
  {
    label: string;
    color: string;
    bgColor: string;
    addButtonLabel: string;
  }
> = {
  MANAGER: {
    label: 'Manager',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    addButtonLabel: 'Add Manager',
  },
  TEACHER: {
    label: 'Teacher',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    addButtonLabel: 'Add Teacher',
  },
  SUPPORT_STAFF: {
    label: 'Support Staff',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    addButtonLabel: 'Add Support Staff',
  },
  STUDENT: {
    label: 'Student',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    addButtonLabel: 'Add Student',
  },
  ALL: {
    label: 'All Users',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    addButtonLabel: 'Add User',
  },
};

export const ROLE_TABS = [
  { label: 'All', value: undefined as any },
  { label: 'Managers', value: 'MANAGER' as UserRole },
  { label: 'Teachers', value: 'TEACHER' as UserRole },
  { label: 'Support Staff', value: 'SUPPORT_STAFF' as UserRole },
  { label: 'Students', value: 'STUDENT' as UserRole },
];

export const ALL_ROLES: UserRole[] = ['MANAGER', 'TEACHER', 'SUPPORT_STAFF', 'STUDENT'];
