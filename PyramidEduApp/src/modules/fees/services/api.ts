import apiClient from '../../../api/client';
import { FeeHistoryResponse, ProcessPaymentResponse } from '../types/fee.types';

export const feeService = {
  getFeeHistory: async () => {
    const response = await apiClient.get<{ success: boolean; data: FeeHistoryResponse }>('/fees/history');
    return response.data;
  },

  processPayment: async (amount: number, method: string = 'CARD') => {
    const response = await apiClient.post<ProcessPaymentResponse>('/fees/pay', { amount, method });
    return response.data;
  },
};
