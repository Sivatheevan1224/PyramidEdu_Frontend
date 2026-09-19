import React from 'react';
import { Card } from '@/components/ui/card';
import { PerformancePrediction } from '../types/performance.types';
import { Progress } from '@/components/ui/progress';

interface MetricsBreakdownProps {
  prediction: PerformancePrediction;
}

export const MetricsBreakdown: React.FC<MetricsBreakdownProps> = ({ prediction }) => {
  const metrics = [
    { label: 'Attendance', score: Number(prediction.attendanceScore) },
    { label: 'Online MCQ Exams', score: Number(prediction.mcqScore) },
    { label: 'Online Essay Exams', score: Number(prediction.essayScore) },
    { label: 'Physical/Manual Exams', score: Number(prediction.manualExamScore) },
  ];

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-indigo-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <Card className="h-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-sm transition-shadow rounded-2xl overflow-hidden">
      <div className="p-6 pb-2 border-b border-slate-100 dark:border-slate-800/80">
        <h3 className="text-base font-bold text-slate-800 dark:text-white">Category Breakdown</h3>
      </div>
      <div className="p-6 pt-5 space-y-5">
        {metrics.map((metric, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-600 dark:text-slate-300">{metric.label}</span>
              <span className="text-slate-900 dark:text-white font-extrabold">{metric.score.toFixed(1)}%</span>
            </div>
            <Progress 
              value={metric.score} 
              className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full"
              indicatorClassName={getProgressColor(metric.score)} 
            />
          </div>
        ))}
        
        {(prediction.missedExamCount > 0 || prediction.absentManualExamCount > 0) && (
          <div className="mt-6 p-3.5 bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/40 rounded-xl text-xs text-rose-800 dark:text-rose-300">
            <p className="font-bold text-rose-900 dark:text-rose-200 mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Noted Absences / Exclusions:
            </p>
            <ul className="list-disc pl-5 space-y-1 font-medium">
              {prediction.missedExamCount > 0 && (
                <li>{prediction.missedExamCount} online exam(s) missed</li>
              )}
              {prediction.absentManualExamCount > 0 && (
                <li>Absent for {prediction.absentManualExamCount} physical/manual exam(s)</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};
