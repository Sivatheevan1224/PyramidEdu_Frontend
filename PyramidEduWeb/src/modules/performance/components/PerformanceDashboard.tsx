import React from 'react';
import { usePerformanceHistory } from '../hooks/usePerformance';
import { PerformanceScoreCard } from './PerformanceScoreCard';
import { TrendChart } from './TrendChart';
import { RecommendationsList } from './RecommendationsList';
import { MetricsBreakdown } from './MetricsBreakdown';
import { Loader2, AlertCircle, User, GraduationCap, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface PerformanceDashboardProps {
  studentId: string;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ studentId }) => {
  const { data: history, isLoading, isError, error } = usePerformanceHistory(studentId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 my-4 flex items-start space-x-3">
        <AlertCircle className="h-5 w-5 mt-0.5 text-red-600" />
        <div>
          <h3 className="font-semibold text-red-800">Error Loading Performance Data</h3>
          <p className="text-sm mt-1">
            {error?.message || 'Could not fetch performance data for this student.'}
          </p>
        </div>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border shadow-sm mt-4">
        <p className="text-gray-500 mb-2 text-lg">No performance predictions yet.</p>
        <p className="text-sm text-gray-400">Automated calculations might not have run for this student yet.</p>
      </div>
    );
  }

  const latestPrediction = history[0];

  return (
    <div className="space-y-6 mt-6">
      {/* Student Profile Info Card */}
      <Card className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white border-none shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3.5 bg-white/10 rounded-2xl text-white backdrop-blur-md">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Student Performance Analytics</h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-300 text-sm mt-1 font-medium">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4" /> ID: {studentId}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> Calculated: {new Date(latestPrediction.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PerformanceScoreCard prediction={latestPrediction} />
        </div>
        <div className="lg:col-span-2">
          <TrendChart history={history} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricsBreakdown prediction={latestPrediction} />
        <RecommendationsList prediction={latestPrediction} />
      </div>
    </div>
  );
};
