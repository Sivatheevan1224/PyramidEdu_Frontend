export type AssessmentType = 'MANUAL_EXAM' | 'ONLINE_EXAM' | 'QUIZ' | 'ASSIGNMENT';

export interface UnifiedMark {
  id: string;
  student: {
    id: string;
    fullName: string;
    indexNumber: string;
    batch: string;
    stream: string;
  };
  subject: {
    id: string;
    name: string;
  };
  teacher: {
    id: string;
    fullName: string;
  };
  title: string;
  type: AssessmentType;
  marksObtained: number | null;
  totalMarks: number;
  isAbsent: boolean;
  examDate: string;
}

export interface MarksFilterParams {
  batchId?: string;
  subjectId?: string;
  streamId?: string;
  teacherId?: string;
  type?: string;
  search?: string;
}
