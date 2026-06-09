import { api } from "@/lib/api";

export const fetchManagerSummaryData = async (page: number, search: string) => {
  const res = await api.get(`/attendance/manager/summary?page=${page}&limit=10&search=${search}`);
  return res.data;
};

export const fetchManagerStudentDetailsData = async (studentId: string, fromDate: string, toDate: string, subjectId: string) => {
  const q = new URLSearchParams();
  if (fromDate) q.append("fromDate", fromDate);
  if (toDate) q.append("toDate", toDate);
  if (subjectId) q.append("subjectId", subjectId);
  
  const res = await api.get(`/attendance/manager/student/${studentId}?${q.toString()}`);
  return res.data.data;
};
