import { api } from "@/lib/api";

import { SubjectFormValues, SubjectItem, StreamItem, TeacherOption } from "../types";

function mapSubjectFromApi(item: any): SubjectItem {
  let streamIds: string[] = [];
  if (item.stream && item.stream.id) {
    streamIds = [String(item.stream.id)];
  } else if (item.streamId) {
    streamIds = [String(item.streamId)];
  } else if (Array.isArray(item.streams)) {
    streamIds = item.streams.map((s: any) => String(s.id)).filter((id: any) => id && id !== 'NaN');
  }

  return {
    id: String(item.id),
    name: item.name || item.subjectName || "",
    streamIds,
    feePerMonth: Number(item.feePerMonth ?? item.feeAmount ?? 0),
    isActive: Boolean(item.isActive),
    // teacher assignment handled via Teacher management (many-to-many)
  };
}

export const subjectService = {
  async getStreams() {
    const { data } = await api.get("/subjects/streams");
    const rows = data?.data ?? [];

    // Convert IDs to strings and filter out invalid entries using streamName mapping
    const mapped = rows.map((stream: any) => ({
      id: String(stream.id),
      name: String(stream.streamName ?? stream.name ?? ""),
    })) as StreamItem[];
    // Remove entries with empty or NaN IDs
    return mapped.filter((s) => s.id && s.id !== 'NaN');
  },

  async createStream(name: string) {
    const { data } = await api.post("/subjects/streams", { name });
    const stream = data?.data;

    return {
      id: String(stream.id),
      name: String(stream.streamName ?? stream.name ?? ""),
    } as StreamItem;
  },

  async getSubjects() {
    const { data } = await api.get("/subjects");
    const rows = data?.data?.data ?? [];
    return rows.map(mapSubjectFromApi) as SubjectItem[];
  },

  async createSubject(values: SubjectFormValues) {
    const payload = {
      subjectName: values.name,
      feeAmount: Number(values.feePerMonth),
      streamId: values.streamIds[0] ?? "",
      isActive: Boolean(values.isActive),
    };

    const { data } = await api.post("/subjects", payload);
    return mapSubjectFromApi(data?.data);
  },

  async updateSubject(subjectId: string, values: SubjectFormValues) {
    const updatePayload = {
      subjectName: values.name,
      feeAmount: Number(values.feePerMonth),
      streamId: values.streamIds[0] ?? "",
      isActive: Boolean(values.isActive),
    };

    const { data } = await api.patch(`/subjects/${subjectId}`, updatePayload);
    return mapSubjectFromApi(data?.data);
  },

  async toggleSubjectActive(subjectId: string, isActive: boolean) {
    const { data } = await api.patch(`/subjects/${subjectId}`, { isActive });
    return mapSubjectFromApi(data?.data);
  },

  async getTeachers() {
    const { data } = await api.get("/users", {
      params: {
        role: "teachers",
        limit: 100,
      },
    });

    const rows = data?.data?.data ?? data?.data?.users ?? [];

    return rows.map((item: any) => ({
      id: Number(item.id),
      name: `${item.firstName ?? ""} ${item.lastName ?? ""}`.trim() || item.email,
    })) as TeacherOption[];
  },

};
