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
    <Card className="h-full border border-border dark:bg-slate-900/90 dark:border-slate-800 shadow-md rounded-xl">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-lg font-bold text-foreground dark:text-white">Category Breakdown</h3>
      </div>
      <div className="p-6 pt-0 space-y-6">
        {metrics.map((metric, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-muted-foreground dark:text-slate-300">{metric.label}</span>
              <span className="text-foreground dark:text-white font-extrabold">{metric.score.toFixed(1)}%</span>
            </div>
            <Progress 
              value={metric.score} 
              className="h-2.5 bg-muted dark:bg-slate-800 rounded-full"
              indicatorClassName={getProgressColor(metric.score)} 
            />
          </div>
        ))}
        
        {(prediction.missedExamCount > 0 || prediction.absentManualExamCount > 0) && (
          <div className="mt-6 pt-4 border-t border-border dark:border-slate-800 text-xs text-muted-foreground dark:text-slate-400">
            <p className="font-bold text-foreground dark:text-slate-200 mb-1.5">Exclusions:</p>
            <ul className="list-disc pl-5 space-y-1">
              {prediction.missedExamCount > 0 && (
                <li>{prediction.missedExamCount} online exam(s) missed</li>
              )}
              {prediction.absentManualExamCount > 0 && (
                <li>Absent for {prediction.absentManualExamCount} physical exam(s)</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};
