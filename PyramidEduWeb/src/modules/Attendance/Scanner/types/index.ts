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

export interface ScanResult {
  id: string;
  studentName: string;
  studentCode: string;
  time: string;
  feeStatus?: string;
}
