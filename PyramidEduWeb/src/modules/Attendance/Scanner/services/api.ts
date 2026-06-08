import { api } from "@/lib/api";

export const fetchSessionsData = async (sessionDate: string) => {
  const res = await api.get("/attendance/sessions", { params: { sessionDate } });
  return res.data.data || [];
};

export const startSessionData = async (sessionId: string) => {
  const res = await api.patch(`/attendance/sessions/${sessionId}/start`);
  return res.data;
};

export const endSessionData = async (sessionId: string) => {
  const res = await api.patch(`/attendance/sessions/${sessionId}/end`);
  return res.data;
};

export const scanQrCodeData = async (payload: { token: string; subjectId: string; sessionDate: string }) => {
  const res = await api.post('/attendance/qr', payload);
  return res.data;
};
