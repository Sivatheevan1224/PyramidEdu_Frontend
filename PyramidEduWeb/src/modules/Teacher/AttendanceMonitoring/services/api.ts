import { api } from "@/lib/api";

export const fetchTeacherSummaryData = async (page: number, search: string) => {
  const res = await api.get(`/attendance/teacher/summary?page=${page}&limit=10&search=${search}`);
  return res.data;
};

export const fetchTeacherStudentDetailsData = async (studentId: string, fromDate: string, toDate: string) => {
  const q = new URLSearchParams();
  if (fromDate) q.append("fromDate", fromDate);
  if (toDate) q.append("toDate", toDate);
  
  const res = await api.get(`/attendance/teacher/student/${studentId}?${q.toString()}`);
  return res.data.data;
};
