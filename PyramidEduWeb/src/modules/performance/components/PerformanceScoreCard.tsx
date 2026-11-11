import React from 'react';
import { Card } from '@/components/ui/card';
import { PerformancePrediction, PerformanceLevel, TrendStatus } from '../types/performance.types';
import { PERFORMANCE_LABELS } from '../constants/performance.constants';
import { TrendingUp, TrendingDown, Minus, Award } from 'lucide-react';

interface PerformanceScoreCardProps {
  prediction: PerformancePrediction;
}

export const PerformanceScoreCard: React.FC<PerformanceScoreCardProps> = ({ prediction }) => {
  const label = PERFORMANCE_LABELS[prediction.performanceLevel] || prediction.performanceLevel;
  const score = Number(prediction.finalScore);

  const getLevelConfig = (level: PerformanceLevel) => {
    switch (level) {
      case PerformanceLevel.EXCELLENT:
        return {
          stroke: '#10b981',
          bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
        };
      case PerformanceLevel.VERY_GOOD:
      case PerformanceLevel.GOOD:
        return {
          stroke: '#3b82f6',
          bg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60',
        };
      case PerformanceLevel.AVERAGE:
        return {
          stroke: '#eab308',
          bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
        };
      case PerformanceLevel.NEEDS_IMPROVEMENT:
        return {
          stroke: '#f97316',
          bg: 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800/60',
        };
      case PerformanceLevel.AT_RISK:
        return {
          stroke: '#ef4444',
          bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60',
        };
      default:
        return {
          stroke: '#6366f1',
          bg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60',
        };
    }
  };

  const levelConfig = getLevelConfig(prediction.performanceLevel);

  const renderTrendIcon = () => {
    switch (prediction.trendStatus) {
      case TrendStatus.IMPROVING:
        return <TrendingUp className="h-4 w-4 text-emerald-500" />;
      case TrendStatus.DECLINING:
        return <TrendingDown className="h-4 w-4 text-rose-500" />;
      default:
        return <Minus className="h-4 w-4 text-slate-400" />;
    }
  };

  // Circular progress dimensions (properly proportioned 160px diameter)
  const size = 160;
  const strokeWidth = 12;
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(Math.max(score, 0), 100) / 100) * circumference;

  return (
    <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-sm transition-shadow h-full flex flex-col justify-between rounded-2xl overflow-hidden">
      <div className="p-5 pb-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-150 dark:border-indigo-900/50">
            <Award className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">Overall Performance</h3>
        </div>
      </div>

      <div className="p-6 flex flex-col items-center justify-center flex-1">
        {/* Radial Gauge Container */}
        <div className="relative flex items-center justify-center my-2" style={{ width: size, height: size }}>
          <svg
            width={size}
            height={size}
            className="transform -rotate-90"
          >
            {/* Background Track */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="currentColor"
              className="text-slate-100 dark:text-slate-800"
              fill="transparent"
              strokeWidth={strokeWidth}
            />
            {/* Active Progress Bar with dynamic color */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke={levelConfig.stroke}
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Centered Score Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
              {score.toFixed(1)}%
            </span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
              Score
            </span>
          </div>
        </div>

        {/* Level Tag & Trend Status */}
        <div className="flex flex-col items-center gap-2 mt-4">
          <span className={`px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border shadow-2xs ${levelConfig.bg}`}>
            {label}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="text-slate-400 dark:text-slate-500">Trend:</span>
            {renderTrendIcon()}
            <span className="capitalize font-semibold text-slate-700 dark:text-slate-200">
              {prediction.trendStatus.toLowerCase()}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
