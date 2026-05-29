export interface StreamItem {
  id: number;
  name: string;
}

export interface SubjectItem {
  id: string;
  name: string;
  streamIds: number[];
  feePerMonth: number;
  isActive: boolean;
  // teacher assignment moved to Teacher ↔ Subject many-to-many
}

export interface SubjectFormValues {
  name: string;
  streamIds: number[];
  feePerMonth: number;
  isActive: boolean;
  // teacherId removed per new design
}

export interface TeacherOption {
  id: number;
  name: string;
}
