import { PerformanceLevel, TrendStatus } from '../types/performance.types';

export const PERFORMANCE_COLORS: Record<PerformanceLevel, string> = {
  [PerformanceLevel.EXCELLENT]: 'text-emerald-600 bg-emerald-100',
  [PerformanceLevel.VERY_GOOD]: 'text-blue-600 bg-blue-100',
  [PerformanceLevel.GOOD]: 'text-cyan-600 bg-cyan-100',
  [PerformanceLevel.AVERAGE]: 'text-yellow-600 bg-yellow-100',
  [PerformanceLevel.NEEDS_IMPROVEMENT]: 'text-orange-600 bg-orange-100',
  [PerformanceLevel.AT_RISK]: 'text-red-600 bg-red-100',
};

export const TREND_COLORS: Record<TrendStatus, string> = {
  [TrendStatus.IMPROVING]: 'text-emerald-500',
  [TrendStatus.STABLE]: 'text-gray-500',
  [TrendStatus.DECLINING]: 'text-red-500',
};

export const PERFORMANCE_LABELS: Record<PerformanceLevel, string> = {
  [PerformanceLevel.EXCELLENT]: 'Excellent',
  [PerformanceLevel.VERY_GOOD]: 'Very Good',
  [PerformanceLevel.GOOD]: 'Good',
  [PerformanceLevel.AVERAGE]: 'Average',
  [PerformanceLevel.NEEDS_IMPROVEMENT]: 'Needs Improvement',
  [PerformanceLevel.AT_RISK]: 'At Risk',
};
