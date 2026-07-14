import api from "@/lib/api";

const API_BASE = "/manager/fees";

export const fetchFeeManagementData = async (filters?: {
  search?: string;
  indexNumber?: string;
  status?: string;
  method?: string;
}) => {
  const response = await api.get<{ data: any[] }>(API_BASE, { params: filters });
  return response.data.data;
};

export const fetchStudentPaymentHistory = async (id: string) => {
  const response = await api.get<{ data: any }>(`${API_BASE}/${id}/history`);
  return response.data.data;
};
