import { api } from "@/lib/api";

import { SubjectFormValues, SubjectItem, StreamItem, TeacherOption } from "../types";

function mapSubjectFromApi(item: any): SubjectItem {
  // streams comes as an array from the API (many-to-many)
  let streamIds: string[] = [];
  if (Array.isArray(item.streams) && item.streams.length > 0) {
    streamIds = item.streams.map((s: any) => String(s.id));
  } else if (item.stream?.id) {
    // backwards compat — single stream object
    streamIds = [String(item.stream.id)];
  } else if (item.streamId) {
    streamIds = [String(item.streamId)];
  }

  return {
    id: String(item.id),
    name: item.name || item.subjectName || "",
    streamIds,
    feePerMonth: Number(item.feePerMonth ?? item.feeAmount ?? 0),
    isActive: Boolean(item.isActive),
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
      batchIds: Array.isArray(stream.batches) ? stream.batches.map((b: any) => String(b.id)) : [],
    })) as StreamItem[];
    // Remove entries with empty or NaN IDs
    return mapped.filter((s) => s.id && s.id !== 'NaN');
  },

  async createStream(name: string, batchIds?: string[]) {
    const { data } = await api.post("/subjects/streams", { name, batchIds });
    const stream = data?.data;

    return {
      id: String(stream.id),
      name: String(stream.streamName ?? stream.name ?? ""),
      batchIds: Array.isArray(stream.batches) ? stream.batches.map((b: any) => String(b.id)) : [],
    } as StreamItem;
  },

  async updateStream(streamId: string, name: string, batchIds?: string[]) {
    const { data } = await api.patch(`/subjects/streams/${streamId}`, { name, batchIds });
    const stream = data?.data;

    return {
      id: String(stream.id),
      name: String(stream.streamName ?? stream.name ?? ""),
      batchIds: Array.isArray(stream.batches) ? stream.batches.map((b: any) => String(b.id)) : [],
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
      streamIds: values.streamIds,       // send array
      streamId: values.streamIds[0],     // primary for backwards compat
      feeAmount: Number(values.feePerMonth),
      isActive: Boolean(values.isActive),
    };

    const { data } = await api.post("/subjects", payload);
    return mapSubjectFromApi(data?.data);
  },

  async updateSubject(subjectId: string, values: SubjectFormValues) {
    const updatePayload = {
      subjectName: values.name,
      streamIds: values.streamIds,       // send array
      streamId: values.streamIds[0],     // primary for backwards compat
      feeAmount: Number(values.feePerMonth),
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
