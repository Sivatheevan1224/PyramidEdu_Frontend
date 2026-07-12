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
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="h-full">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-lg">Category Breakdown</h3>
      </div>
      <div className="p-6 pt-0 space-y-6">
        {metrics.map((metric, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-gray-700">{metric.label}</span>
              <span className="text-gray-900">{metric.score.toFixed(1)}%</span>
            </div>
            <Progress 
              value={metric.score} 
              className="h-2"
              indicatorClassName={getProgressColor(metric.score)} 
            />
          </div>
        ))}
        
        {(prediction.missedExamCount > 0 || prediction.absentManualExamCount > 0) && (
          <div className="mt-6 pt-4 border-t border-gray-100 text-sm text-gray-500">
            <p className="font-semibold text-gray-700 mb-1">Exclusions:</p>
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
