import { api } from "@/lib/api";

export const fetchNotes = async () => {
  const res = await api.get("/study-materials");
  return res.data;
};

export const createNote = async (formData: FormData) => {
  const res = await api.post("/study-materials", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateNote = async (noteId: string, formData: FormData) => {
  const res = await api.patch(`/study-materials/${noteId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteNote = async (noteId: string) => {
  const res = await api.delete(`/study-materials/${noteId}`);
  return res.data;
};
