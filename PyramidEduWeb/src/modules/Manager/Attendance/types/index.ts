export interface ClassSession {
  id: string;
  subjectId: string;
  teacherId: string;
  sessionDate: string;
  sessionTime: string;
  status: 'CREATED' | 'ACTIVE' | 'COMPLETED';
  subject?: { name: string; subjectName?: string };
  teacher?: { user?: { fullName?: string }; name?: string; firstName?: string; lastName?: string };
  batch?: { batchName?: string };
}

export interface StudentRecord {
  studentId: string;
  studentName: string;
  indexNumber: string;
  feeStatus: string;
  isPresent: boolean;
  hasRecord: boolean;
  attendanceDate: string;
}

export interface Subject {
  id: string;
  subjectName?: string;
  name?: string;
}

export interface Batch {
  id: string;
  batchName: string;
}
