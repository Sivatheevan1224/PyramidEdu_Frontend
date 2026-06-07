import axios from "axios";
import { RegisteredStudent, StudentDetails } from "../types";

const API_BASE = "http://localhost:5000/api/v1/manager/registered-students";

// You may need to attach tokens in the interceptor, assuming the global axios instance handles it.
// If using a specific axios instance from lib, import it instead.
import api from "@/lib/api";

export const fetchRegisteredStudents = async (): Promise<RegisteredStudent[]> => {
  const response = await api.get<{ data: RegisteredStudent[] }>(API_BASE);
  return response.data.data;
};

export const fetchStudentDetails = async (id: string): Promise<StudentDetails> => {
  const response = await api.get<{ data: StudentDetails }>(`${API_BASE}/${id}`);
  return response.data.data;
};

export const updatePaymentStatus = async (id: string, paymentStatus: string) => {
  const response = await api.patch(`${API_BASE}/${id}/payment-status`, { paymentStatus });
  return response.data;
};

export const updateApprovalStatus = async (id: string, approvalStatus: string) => {
  const response = await api.patch(`${API_BASE}/${id}/approval-status`, { approvalStatus });
  return response.data;
};
