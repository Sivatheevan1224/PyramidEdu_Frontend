import { z } from 'zod';

export const SubmissionSchema = z.object({
  id: z.string().uuid(),
  studentId: z.string().uuid(),
  examId: z.string().uuid(),
  status: z.enum(['PENDING_MANUAL', 'GRADED', 'NOT_SUBMITTED']),
  totalScore: z.number().nullable(),
  submittedAt: z.string().nullable(),
});

export const ExamSchema = z.object({
  id: z.string().uuid(),
  examTitle: z.string(),
  examDate: z.string(),
  totalMarks: z.number(),
  submissions: z.array(SubmissionSchema).optional(),
});
