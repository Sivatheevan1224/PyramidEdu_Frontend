import { api } from "@/lib/api";

import { SubjectFormValues, SubjectItem, StreamItem, TeacherOption } from "../types";

function mapSubjectFromApi(item: any): SubjectItem {
  return {
    id: String(item.id),
    name: item.name,
    streamIds: (item.streams ?? []).map((stream: any) => Number(stream.id)),
    feePerMonth: Number(item.feePerMonth ?? 0),
    isActive: Boolean(item.isActive),
    // teacher assignment handled via Teacher management (many-to-many)
  };
}

export const subjectService = {
  async getStreams() {
    const { data } = await api.get("/subjects/streams");
    const rows = data?.data ?? [];

    return rows.map((stream: any) => ({
      id: Number(stream.id),
      name: String(stream.name),
    })) as StreamItem[];
  },

  async createStream(name: string) {
    const { data } = await api.post("/subjects/streams", { name });
    const stream = data?.data;

    return {
      id: Number(stream.id),
      name: String(stream.name),
    } as StreamItem;
  },

  async getSubjects() {
    const { data } = await api.get("/subjects");
    const rows = data?.data?.data ?? [];
    return rows.map(mapSubjectFromApi) as SubjectItem[];
  },

  async createSubject(values: SubjectFormValues) {
    const payload = {
      name: values.name,
      feePerMonth: Number(values.feePerMonth),
      streamIds: values.streamIds,
      isActive: Boolean(values.isActive),
    };

    const { data } = await api.post("/subjects", payload);
    return mapSubjectFromApi(data?.data);
  },

  async updateSubject(subjectId: string, values: SubjectFormValues) {
    const updatePayload = {
      name: values.name,
      feePerMonth: Number(values.feePerMonth),
      streamIds: values.streamIds,
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
