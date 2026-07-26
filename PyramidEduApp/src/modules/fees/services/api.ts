import apiClient from '../../../api/client';
import { FeeHistoryResponse, ProcessPaymentResponse, ProcessPaymentStripeResponse } from '../types/fee.types';

export const feeService = {
  getFeeHistory: async () => {
    const response = await apiClient.get<{ success: boolean; data: FeeHistoryResponse }>('/fees/history');
    return response.data;
  },

  processPayment: async (amount: number, method: string = 'CARD', cardDetails?: any) => {
    const response = await apiClient.post<ProcessPaymentResponse>('/fees/pay', { amount, method, cardDetails });
    return response.data;
  },

  processPaymentStripe: async (amount: number, method: string = 'CARD', redirectUrl?: string) => {
    const response = await apiClient.post<ProcessPaymentStripeResponse>('/fees/pay-stripe', { amount, method, redirectUrl });
    const data = response.data;
    console.log("Payment data", data);
    return data;
  },
};
