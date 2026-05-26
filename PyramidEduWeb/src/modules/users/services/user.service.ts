/**
 * User Service - Axios API calls for User Management
 * FRONTEND ONLY - API integration ready
 */

import axios from 'axios';
import { User, CreateUserPayload, UpdateUserPayload, PaginatedResponse, UserFilters } from '../types/user.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const USERS_ENDPOINT = `${API_BASE_URL}/users`;

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
    department: 'Administration',
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
    parentName: 'Kala Rajan',
    parentPhone: '0709988776',
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
    parentName: 'Selvan Kumar',
    parentPhone: '0764567890',
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
    department: 'Operations',
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
    department: 'Finance',
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

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: USERS_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token interceptor for auth
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const userService = {
  /**
   * Fetch all users with filters and pagination
   * TODO: Uncomment API call when backend is ready
   */
  getUsers: async (filters?: UserFilters): Promise<PaginatedResponse<User>> => {
    try {
      const filteredUsers = filterUsers(filters);
      const page = filters?.page || 1;
      const limit = filters?.limit || 10;
      const start = (page - 1) * limit;
      const pagedUsers = filteredUsers.slice(start, start + limit);

      return {
        data: pagedUsers,
        total: filteredUsers.length,
        page,
        limit,
        hasMore: start + limit < filteredUsers.length,
      };

      // UNCOMMENT BELOW WHEN BACKEND IS READY
      /*
      const params = {
        search: filters?.search,
        role: filters?.role,
        status: filters?.status,
        sortBy: filters?.sortBy || 'createdAt',
        sortOrder: filters?.sortOrder || 'desc',
        page: filters?.page || 1,
        limit: filters?.limit || 10,
      };

      const { data } = await apiClient.get('/', { params });
      return data;
      */
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  /**
   * Fetch single user by ID
   * TODO: Uncomment API call when backend is ready
   */
  getUser: async (userId: string): Promise<User> => {
    try {
      const user = mockUsers.find((item) => item.id === userId);
      if (!user) {
        throw new Error('User not found');
      }
      return user;

      // UNCOMMENT BELOW WHEN BACKEND IS READY
      /*
      const { data } = await apiClient.get(`/${userId}`);
      return data;
      */
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  /**
   * Create new user
   * Currently returns mock response - uncomment API call when backend is ready
   */
  createUser: async (payload: CreateUserPayload): Promise<User> => {
    try {
      const now = new Date().toISOString();
      const newUser: User = {
        id: `user_${Date.now()}`,
        firstName: (payload as any).firstName || 'New',
        lastName: (payload as any).lastName || 'User',
        email: payload.email,
        phoneNumber: payload.phoneNumber,
        role: payload.role,
        status: 'ACTIVE',
        department: payload.department,
        subject: payload.subject,
        salary: payload.salary,
        roleType: payload.roleType,
        indexNumber: payload.indexNumber,
        parentName: payload.parentName,
        parentPhone: payload.parentPhone,
        address: payload.address,
        createdAt: now,
        updatedAt: now,
      };

      mockUsers = [newUser, ...mockUsers];
      return newUser;

      /* UNCOMMENT WHEN BACKEND IS READY
      const { data } = await apiClient.post('/', payload);
      return data;
      */
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
      const now = new Date().toISOString();
      const index = mockUsers.findIndex((item) => item.id === userId);
      if (index === -1) {
        throw new Error('User not found');
      }

      const updatedUser: User = {
        ...mockUsers[index],
        ...payload,
        updatedAt: now,
      };

      mockUsers = mockUsers.map((user) => (user.id === userId ? updatedUser : user));
      return updatedUser;

      /* UNCOMMENT WHEN BACKEND IS READY
      const { data } = await apiClient.put(`/${userId}`, payload);
      return data;
      */
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
      const index = mockUsers.findIndex((item) => item.id === userId);
      if (index === -1) {
        throw new Error('User not found');
      }
      const updatedUser: User = {
        ...mockUsers[index],
        status,
        updatedAt: new Date().toISOString(),
      };
      mockUsers = mockUsers.map((user) => (user.id === userId ? updatedUser : user));
      return updatedUser;

      /* UNCOMMENT WHEN BACKEND IS READY
      const { data } = await apiClient.patch(`/${userId}/status`, { status });
      return data;
      */
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
      mockUsers = mockUsers.filter((user) => user.id !== userId);
      return Promise.resolve();

      /* UNCOMMENT WHEN BACKEND IS READY
      await apiClient.delete(`/${userId}`);
      */
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
      return mockUsers.some((user) => user.email.toLowerCase() === email.toLowerCase());

      /* UNCOMMENT WHEN BACKEND IS READY
      const { data } = await apiClient.post('/check-email', { email });
      return data.exists;
      */
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  },
};
