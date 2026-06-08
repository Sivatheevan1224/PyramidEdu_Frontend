import { api } from "@/lib/api";

export const fetchSessionsData = async (sessionDate: string) => {
  const res = await api.get("/attendance/sessions", { params: { sessionDate } });
  return res.data.data || [];
};

export const fetchSessionStudentsData = async (session: any) => {
  const res = await api.get("/attendance/students", {
    params: {
      subjectId: session.subjectId,
      teacherId: session.teacherId,
      batchId: session.batchId || undefined,
      sessionDate: session.sessionDate,
      sessionTime: session.sessionTime,
    },
  });
  return res.data.data || [];
};

export const submitManualAttendance = async (records: any[]) => {
  const res = await api.post("/attendance/manual", { records });
  return res.data;
};

export const fetchSubjectsData = async () => {
  const res = await api.get("/subjects");
  return res.data.data?.data || [];
};

export const fetchBatchesData = async () => {
  const res = await api.get("/batches?activeOnly=true");
  return res.data.data || [];
};

export const fetchSubjectTeachersData = async (subjectId: string) => {
  const res = await api.get("/subjects/teachers", { params: { subjectId } });
  return Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
};

export const createClassSessionData = async (payload: any) => {
  const res = await api.post("/attendance/sessions", payload);
  return res.data;
};
