/**
 * User Service - Axios API calls for User Management
 * FRONTEND ONLY - API integration ready
 */

import { api } from '@/lib/api';
import { User, CreateUserPayload, CreateUserResult, UpdateUserPayload, PaginatedResponse, UserFilters } from '../types/user.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const USERS_ENDPOINT = `${API_BASE_URL}/users`;

const toUserStatus = (isActive: boolean): 'ACTIVE' | 'DISABLED' => (isActive ? 'ACTIVE' : 'DISABLED');

const mapApiUserToFrontend = (apiUser: any): User => ({
  id: String(apiUser.id),
  firstName: apiUser.firstName || apiUser.fullName?.split(' ')[0] || '',
  lastName: apiUser.lastName || apiUser.fullName?.split(' ').slice(1).join(' ') || '',
  nicNumber: apiUser.nicNumber,
  gender: apiUser.gender,
  email: apiUser.email,
  phoneNumber: apiUser.phone || apiUser.phoneNumber || '',
  role: apiUser.role,
  status: toUserStatus(Boolean(apiUser.isActive)),
  subject: apiUser.subject || apiUser.specialization,
  salary: apiUser.salary ? Number(apiUser.salary) : undefined,
  roleType: apiUser.roleType,
  indexNumber: apiUser.indexNumber,
  dateOfBirth: apiUser.dateOfBirth,
  address: apiUser.address,
  createdAt: apiUser.createdAt || new Date().toISOString(),
  updatedAt: apiUser.updatedAt || apiUser.createdAt || new Date().toISOString(),
});

const createTimestamp = (offsetDays: number) => {
  const date = new Date();
  date.setDate(date.getDate() - offsetDays);
  return date.toISOString();
};

let mockUsers: User[] = [
  {
    id: '1',
    firstName: 'Faisal',
    lastName: 'Malik',
    email: 'admin@pyramidedu.com',
    phoneNumber: '0712345678',
    role: 'MANAGER',
    status: 'ACTIVE',
    createdAt: createTimestamp(20),
    updatedAt: createTimestamp(3),
  },
  {
    id: '2',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya@pyramidedu.com',
    phoneNumber: '0789001122',
    role: 'TEACHER',
    status: 'ACTIVE',
    subject: 'Mathematics',
    salary: 120000,
    createdAt: createTimestamp(18),
    updatedAt: createTimestamp(2),
  },
  {
    id: '3',
    firstName: 'James',
    lastName: 'Okonkwo',
    email: 'james@pyramidedu.com',
    phoneNumber: '0723456789',
    role: 'TEACHER',
    status: 'DISABLED',
    subject: 'Science',
    salary: 110000,
    createdAt: createTimestamp(16),
    updatedAt: createTimestamp(4),
  },
  {
    id: '4',
    firstName: 'Nisha',
    lastName: 'Perera',
    email: 'nisha@pyramidedu.com',
    phoneNumber: '0771234567',
    role: 'SUPPORT_STAFF',
    status: 'ACTIVE',
    nicNumber: '991234567V',
    gender: 'FEMALE',
    address: 'Colombo',
    roleType: 'Reception',
    salary: 85000,
    createdAt: createTimestamp(12),
    updatedAt: createTimestamp(1),
  },
  {
    id: '5',
    firstName: 'Suresh',
    lastName: 'Rajan',
    email: 'suresh@pyramidedu.com',
    phoneNumber: '0701122334',
    role: 'STUDENT',
    status: 'ACTIVE',
    indexNumber: 'S-1024',
    dateOfBirth: '2011-06-14',
    address: 'Colombo',
    createdAt: createTimestamp(10),
    updatedAt: createTimestamp(2),
  },
  {
    id: '6',
    firstName: 'Kavya',
    lastName: 'Selvan',
    email: 'kavya@pyramidedu.com',
    phoneNumber: '0767890123',
    role: 'STUDENT',
    status: 'ACTIVE',
    indexNumber: 'S-1025',
    dateOfBirth: '2012-03-22',
    address: 'Kandy',
    createdAt: createTimestamp(9),
    updatedAt: createTimestamp(3),
  },
  {
    id: '7',
    firstName: 'Ahamed',
    lastName: 'Rizwan',
    email: 'rizwan@pyramidedu.com',
    phoneNumber: '0751122334',
    role: 'MANAGER',
    status: 'ACTIVE',
    createdAt: createTimestamp(8),
    updatedAt: createTimestamp(2),
  },
  {
    id: '8',
    firstName: 'Lahiru',
    lastName: 'Peris',
    email: 'lahiru@pyramidedu.com',
    phoneNumber: '0752233445',
    role: 'SUPPORT_STAFF',
    status: 'DISABLED',
    nicNumber: '881234567V',
    gender: 'MALE',
    address: 'Kandy',
    roleType: 'IT Support',
    salary: 90000,
    createdAt: createTimestamp(7),
    updatedAt: createTimestamp(5),
  },
  {
    id: '9',
    firstName: 'Tharani',
    lastName: 'Silva',
    email: 'tharani@pyramidedu.com',
    phoneNumber: '0783344556',
    role: 'TEACHER',
    status: 'ACTIVE',
    subject: 'English',
    salary: 105000,
    createdAt: createTimestamp(6),
    updatedAt: createTimestamp(1),
  },
  {
    id: '10',
    firstName: 'Yohan',
    lastName: 'Fernando',
    email: 'yohan@pyramidedu.com',
    phoneNumber: '0785566778',
    role: 'MANAGER',
    status: 'ACTIVE',
    createdAt: createTimestamp(5),
    updatedAt: createTimestamp(1),
  },
];

const filterUsers = (filters?: UserFilters) => {
  let results = [...mockUsers];

  if (filters?.search) {
    const query = filters.search.toLowerCase();
    results = results.filter((user) =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.phoneNumber.toLowerCase().includes(query)
    );
  }

  if (filters?.role) {
    results = results.filter((user) => user.role === filters.role);
  }

  if (filters?.status) {
    results = results.filter((user) => user.status === filters.status);
  }

  if (filters?.sortBy) {
    results.sort((a, b) => {
      const order = filters.sortOrder === 'asc' ? 1 : -1;
      if (filters.sortBy === 'name') {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        return nameA.localeCompare(nameB) * order;
      }
      if (filters.sortBy === 'email') {
        return a.email.localeCompare(b.email) * order;
      }
      return new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime()
        ? -1 * order
        : 1 * order;
    });
  }

  return results;
};

export const userService = {
  /**
   * Fetch all users with filters and pagination
   */
  getUsers: async (filters?: UserFilters): Promise<PaginatedResponse<User>> => {
    try {
      const roleMap: Record<string, string> = {
        MANAGER: 'managers',
        TEACHER: 'teachers',
        STUDENT: 'students',
        SUPPORT_STAFF: 'supportStaff',
      };

      const params = {
        search: filters?.search,
        role: filters?.role ? roleMap[filters.role] : undefined,
        status: filters?.status,
        page: filters?.page || 1,
        limit: filters?.limit || 10,
      };

      const { data } = await api.get('/users', { params });
      const payload = data?.data;
      const users = (payload?.data || []).map((item: any) => mapApiUserToFrontend(item));

      return {
        data: users,
        total: payload?.total || 0,
        page: payload?.page || params.page,
        limit: payload?.limit || params.limit,
        hasMore: Boolean(payload?.hasMore),
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  /**
   * Fetch single user by ID
   */
  getUser: async (userId: string): Promise<User> => {
    try {
      const { data } = await api.get(`/users/${userId}`);
      return mapApiUserToFrontend(data?.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  /**
   * Create new user
   */
  createUser: async (payload: CreateUserPayload): Promise<CreateUserResult> => {
    try {
      const { data } = await api.post('/users', payload);
      const apiUser = data?.data;

      if (!apiUser) {
        throw new Error('Invalid API response for user creation');
      }

      return {
        user: mapApiUserToFrontend(apiUser),
        temporaryPassword: data?.temporaryPassword,
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  /**
   * Update user details
   * Currently returns mock response - uncomment API call when backend is ready
   */
  updateUser: async (userId: string, payload: UpdateUserPayload): Promise<User> => {
    try {
      const { data } = await api.patch(`/users/${userId}`, payload);
      return mapApiUserToFrontend(data?.data);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  /**
   * Update user status (enable/disable)
   * Currently returns mock response - uncomment API call when backend is ready
   */
  updateUserStatus: async (userId: string, status: 'ACTIVE' | 'DISABLED'): Promise<User> => {
    try {
      const endpoint = status === 'ACTIVE' ? `/users/${userId}/activate` : `/users/${userId}/deactivate`;
      const { data } = await api.patch(endpoint);
      return mapApiUserToFrontend(data?.data);
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  },

  /**
   * Delete user (if supported by backend)
   * Currently returns mock response - uncomment API call when backend is ready
   */
  deleteUser: async (userId: string): Promise<void> => {
    try {
      await api.delete(`/users/${userId}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  /**
   * Check if email is already registered
   * Currently returns false - uncomment API call when backend is ready
   */
  checkEmailExists: async (email: string): Promise<boolean> => {
    try {
      const { data } = await api.post('/users/check-email', { email });
      return Boolean(data?.exists);
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  },
};
