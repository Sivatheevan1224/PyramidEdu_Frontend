import { api } from '@/lib/api';
import {
  DashboardOverviewStats,
  AnalyticsData,
  PaymentItem,
  FeeOverviewData,
  StudentSummaryItem,
  PaymentDetailsData,
  PaymentFiltersState,
  StudentSummaryFiltersState,
} from '../types/payment.types';

export class PaymentService {
  /**
   * Fetch Dashboard Overview KPI Stats
   */
  static async getDashboardOverview(): Promise<DashboardOverviewStats> {
    const res = await api.get('/payments/dashboard-overview');
    return res.data.data;
  }

  /**
   * Fetch Payment Analytics Data for Charts
   */
  static async getAnalytics(filters?: Partial<PaymentFiltersState>): Promise<AnalyticsData> {
    const res = await api.get('/payments/analytics', { params: filters });
    return res.data.data;
  }

  /**
   * Fetch Paginated Payment Records
   */
  static async getPayments(filters: PaymentFiltersState): Promise<{
    items: PaymentItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const res = await api.get('/payments', { params: filters });
    return {
      items: res.data.data,
      total: res.data.meta.total,
      page: res.data.meta.page,
      limit: res.data.meta.limit,
      totalPages: res.data.meta.totalPages,
    };
  }

  /**
   * Fetch Dedicated Fee Overview Data
   */
  static async getFeeOverview(): Promise<FeeOverviewData> {
    const res = await api.get('/payments/fee-overview');
    return res.data.data;
  }

  /**
   * Fetch Student Payment Summaries
   */
  static async getStudentSummaries(filters: StudentSummaryFiltersState): Promise<{
    items: StudentSummaryItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const res = await api.get('/payments/student-summaries', { params: filters });
    return {
      items: res.data.data,
      total: res.data.meta.total,
      page: res.data.meta.page,
      limit: res.data.meta.limit,
      totalPages: res.data.meta.totalPages,
    };
  }

  /**
   * Fetch Payment Details Modal Data
   */
  static async getPaymentDetails(id: string): Promise<PaymentDetailsData> {
    const res = await api.get(`/payments/details/${id}`);
    return res.data.data;
  }

  /**
   * Update Payment Verification Status
   */
  static async updatePaymentStatus(id: string, status: string): Promise<any> {
    const res = await api.patch(`/payments/${id}/status`, { status });
    return res.data;
  }

  /**
   * Fetch Active Subjects for Dropdown Filters
   */
  static async getSubjects(): Promise<{ id: string; subjectName: string; subjectCode: string }[]> {
    const res = await api.get('/subjects');
    const rawData = res.data?.data;
    if (Array.isArray(rawData)) return rawData;
    if (rawData && Array.isArray(rawData.data)) return rawData.data;
    return [];
  }

  /**
   * Fetch Active Batches for Dropdown Filters
   */
  static async getBatches(): Promise<{ id: string; batchName: string }[]> {
    const res = await api.get('/batches');
    const rawData = res.data?.data;
    if (Array.isArray(rawData)) return rawData;
    if (rawData && Array.isArray(rawData.data)) return rawData.data;
    return [];
  }
}

