export interface Submission {
  id: string;
  studentId: string;
  examId: string;
  status: 'PENDING_MANUAL' | 'GRADED' | 'NOT_SUBMITTED';
  totalScore: number | null;
  submittedAt: string | null;
}

export interface Exam {
  id: string;
  examTitle: string;
  examDate: string;
  totalMarks: number;
  submissions?: Submission[];
}
