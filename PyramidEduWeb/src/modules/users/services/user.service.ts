/**
 * User Service - Axios API calls for User Management
 * FRONTEND ONLY - API integration ready
 */

import axios from 'axios';
import { User, CreateUserPayload, UpdateUserPayload, PaginatedResponse, UserFilters } from '../types/user.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const USERS_ENDPOINT = `${API_BASE_URL}/users`;

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
      // TEMPORARY: Return mock data (comment out when backend is ready)
      const mockUsers: User[] = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phoneNumber: '1234567890',
          role: 'MANAGER',
          status: 'ACTIVE',
          department: 'Administration',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          phoneNumber: '0987654321',
          role: 'TEACHER',
          status: 'ACTIVE',
          subject: 'Mathematics',
          salary: 50000,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      return {
        data: mockUsers,
        total: mockUsers.length,
        page: filters?.page || 1,
        limit: filters?.limit || 10,
        hasMore: false,
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
      // TEMPORARY: Return mock data
      return {
        id: userId,
        firstName: 'Mock',
        lastName: 'User',
        email: 'mock@example.com',
        phoneNumber: '1234567890',
        role: 'STUDENT',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

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
      // TEMPORARY: Return mock success response
      console.log('Mock: Creating user with payload:', payload);
      return {
        id: `user_${Date.now()}`,
        firstName: (payload as any).firstName || 'New',
        lastName: (payload as any).lastName || 'User',
        email: payload.email,
        phoneNumber: payload.phoneNumber,
        role: payload.role,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

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
      // TEMPORARY: Return mock success response
      console.log('Mock: Updating user:', userId, payload);
      return {
        id: userId,
        firstName: payload.firstName || 'Updated',
        lastName: payload.lastName || 'User',
        email: payload.email || 'user@example.com',
        phoneNumber: payload.phoneNumber || '1234567890',
        role: payload.role || 'STUDENT',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

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
      // TEMPORARY: Return mock success response
      console.log('Mock: Updating user status:', userId, status);
      return {
        id: userId,
        firstName: 'Mock',
        lastName: 'User',
        email: 'mock@example.com',
        phoneNumber: '1234567890',
        role: 'STUDENT',
        status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

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
      // TEMPORARY: Return mock success
      console.log('Mock: Deleting user:', userId);
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
      // TEMPORARY: Return false (allow all emails for testing)
      console.log('Mock: Checking email:', email);
      return false;

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
