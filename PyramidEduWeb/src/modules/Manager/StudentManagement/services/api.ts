import api from "@/lib/api";
import { ApprovedStudent } from "../types";
import { StudentDetails } from "../../newRegisteredStudents/types"; // Reuse detailed type

const API_BASE = "/manager/students";

export const fetchApprovedStudents = async (): Promise<ApprovedStudent[]> => {
  const response = await api.get<{ data: ApprovedStudent[] }>(API_BASE);
  return response.data.data;
};

export const fetchStudentDetails = async (id: string): Promise<StudentDetails> => {
  // Use the existing endpoint for details since the response structure is identical
  const response = await api.get<{ data: StudentDetails }>(`/manager/registered-students/${id}`);
  return response.data.data;
};

export const toggleStudentStatus = async (id: string) => {
  const response = await api.patch(`${API_BASE}/${id}/toggle-status`);
  return response.data;
};

export const updateStudentDetails = async (id: string, data: any) => {
  const response = await api.put(`${API_BASE}/${id}`, data);
  return response.data;
};

export const reEnrollStudent = async (id: string, data: any) => {
  const response = await api.post(`${API_BASE}/${id}/re-enroll`, data);
  return response.data;
};
