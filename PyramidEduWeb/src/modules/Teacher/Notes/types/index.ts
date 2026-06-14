export type NoteStatus = "Published" | "Draft" | "Pending Review";

export type TeacherNote = {
  id: string;
  title: string;
  description: string;
  batch: string;
  subject: string;
  files: string[];
  uploaded: string;
  status: NoteStatus;
};

export type NoteUploadPayload = {
  title: string;
  subjectId: string;
  batchId: string;
  description: string;
  files: File[];
};
