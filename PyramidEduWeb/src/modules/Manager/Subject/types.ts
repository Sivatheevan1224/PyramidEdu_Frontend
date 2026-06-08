export interface StreamItem {
  id: string;
  name: string;
  batchIds: string[];
}

export interface SubjectItem {
  id: string;
  name: string;
  streamIds: string[];   // many-to-many: one subject can belong to multiple streams
  feePerMonth: number;
  isActive: boolean;
}

export interface SubjectFormValues {
  name: string;
  streamIds: string[];   // multi-select checkboxes
  feePerMonth: number;
  isActive: boolean;
}

export interface TeacherOption {
  id: number;
  name: string;
}
