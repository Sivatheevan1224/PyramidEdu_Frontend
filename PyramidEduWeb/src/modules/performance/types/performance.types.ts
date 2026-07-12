export enum PerformanceLevel {
  EXCELLENT = 'EXCELLENT',
  VERY_GOOD = 'VERY_GOOD',
  GOOD = 'GOOD',
  AVERAGE = 'AVERAGE',
  NEEDS_IMPROVEMENT = 'NEEDS_IMPROVEMENT',
  AT_RISK = 'AT_RISK',
}

export enum TrendStatus {
  IMPROVING = 'IMPROVING',
  STABLE = 'STABLE',
  DECLINING = 'DECLINING',
}

export interface PerformancePrediction {
  id: string;
  studentId: string;
  attendanceScore: string | number;
  mcqScore: string | number;
  essayScore: string | number;
  manualExamScore: string | number;
  finalScore: string | number;
  performanceLevel: PerformanceLevel;
  trendStatus: TrendStatus;
  recommendations: string[];
  weightsUsed: any;
  missedExamCount: number;
  absentManualExamCount: number;
  createdAt: string;
}
