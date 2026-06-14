import { api, getApiBaseUrl } from '@/lib/api';
import { User, PaginatedResponse, UserFilters } from '../types/user.types';

const API_BASE_URL = getApiBaseUrl();
const SUPPORT_STAFF_ENDPOINT = `${API_BASE_URL}/support-staff`;

const toUserStatus = (isActive: boolean): 'ACTIVE' | 'DISABLED' => (isActive ? 'ACTIVE' : 'DISABLED');

const mapApiStaffToUser = (staff: any): User => ({
  id: String(staff.id),
  firstName: staff.staffName?.split(' ')[0] || '',
  lastName: staff.staffName?.split(' ').slice(1).join(' ') || '',
  nicNumber: staff.nic || '',
  gender: staff.gender,
  email: staff.email || '', // In case of frontend form mapping
  phoneNumber: staff.phone || '',
  role: 'SUPPORT_STAFF',
  status: toUserStatus(Boolean(staff.isActive)),
  salary: staff.salary ? Number(staff.salary) : undefined,
  roleType: staff.roleType || '',
  address: staff.address || '',
  createdAt: staff.createdAt || new Date().toISOString(),
  updatedAt: staff.updatedAt || new Date().toISOString(),
  isApproved: true,
  forcePasswordChange: false,
});

export const supportStaffService = {
  getSupportStaff: async (filters?: UserFilters): Promise<PaginatedResponse<User>> => {
    try {
      const params = {
        search: filters?.search,
        page: filters?.page || 1,
        limit: filters?.limit || 10,
      };

      const { data } = await api.get('/support-staff', { params });
      const payload = data?.data;
      const staffList = (payload?.data || []).map((item: any) => mapApiStaffToUser(item));

      return {
        data: staffList,
        total: payload?.total || 0,
        page: payload?.page || params.page,
        limit: payload?.limit || params.limit,
        hasMore: Boolean(payload?.hasMore),
      };
    } catch (error) {
      console.error('Error fetching support staff:', error);
      throw error;
    }
  },

  getSupportStaffById: async (id: string): Promise<User> => {
    try {
      const { data } = await api.get(`/support-staff/${id}`);
      return mapApiStaffToUser(data?.data);
    } catch (error) {
      console.error('Error fetching support staff by ID:', error);
      throw error;
    }
  },

  createSupportStaff: async (payload: any): Promise<{ user: User }> => {
    try {
      const { data } = await api.post('/support-staff', payload);
      return {
        user: mapApiStaffToUser(data?.data),
      };
    } catch (error) {
      console.error('Error creating support staff:', error);
      throw error;
    }
  },

  updateSupportStaff: async (id: string, payload: any): Promise<User> => {
    try {
      const { data } = await api.patch(`/support-staff/${id}`, payload);
      return mapApiStaffToUser(data?.data);
    } catch (error) {
      console.error('Error updating support staff:', error);
      throw error;
    }
  },

  deleteSupportStaff: async (id: string): Promise<void> => {
    try {
      await api.delete(`/support-staff/${id}`);
    } catch (error) {
      console.error('Error deleting support staff:', error);
      throw error;
    }
  },

  updateStatus: async (id: string, status: 'ACTIVE' | 'DISABLED'): Promise<User> => {
    try {
      const isActive = status === 'ACTIVE';
      const { data } = await api.patch(`/support-staff/${id}`, { isActive });
      return mapApiStaffToUser(data?.data);
    } catch (error) {
      console.error('Error updating status for support staff:', error);
      throw error;
    }
  },
};
