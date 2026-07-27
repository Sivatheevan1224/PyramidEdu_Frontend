import { z } from 'zod';

export const WeeklyAttendanceDaySchema = z.object({
  date: z.string(),
  status: z.enum(['present', 'absent']),
  percentage: z.number().min(0).max(100),
});

export const SubjectAttendanceSchema = z.object({
  subject: z.string(),
  percentage: z.number().min(0).max(100),
});
