import { z } from 'zod';
import { PerformanceLevel, TrendStatus } from '../types/performance.types';

export const PerformancePredictionSchema = z.object({
  id: z.string().uuid(),
  studentId: z.string().uuid(),
  attendanceScore: z.union([z.string(), z.number()]),
  mcqScore: z.union([z.string(), z.number()]),
  essayScore: z.union([z.string(), z.number()]),
  manualExamScore: z.union([z.string(), z.number()]),
  finalScore: z.union([z.string(), z.number()]),
  performanceLevel: z.nativeEnum(PerformanceLevel),
  trendStatus: z.nativeEnum(TrendStatus),
  recommendations: z.array(z.string()),
  weightsUsed: z.any(),
  missedExamCount: z.number(),
  absentManualExamCount: z.number(),
  createdAt: z.string(),
});

export type PerformancePredictionFormValues = z.infer<typeof PerformancePredictionSchema>;
