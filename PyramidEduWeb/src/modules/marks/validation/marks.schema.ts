import { z } from 'zod';

export const UnifiedMarkSchema = z.object({
  id: z.string().uuid(),
  student: z.object({
    id: z.string().uuid(),
    fullName: z.string(),
    indexNumber: z.string(),
    batch: z.string(),
    stream: z.string(),
  }),
  subject: z.object({
    id: z.string().uuid(),
    name: z.string(),
  }),
  teacher: z.object({
    id: z.string().uuid(),
    fullName: z.string(),
  }),
  title: z.string(),
  type: z.enum(['MANUAL_EXAM', 'ONLINE_EXAM', 'QUIZ', 'ASSIGNMENT']),
  marksObtained: z.number().nullable(),
  totalMarks: z.number(),
  isAbsent: z.boolean(),
  examDate: z.string(),
});

export type UnifiedMarkValues = z.infer<typeof UnifiedMarkSchema>;
