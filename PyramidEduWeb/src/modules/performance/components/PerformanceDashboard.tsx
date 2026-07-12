import React from 'react';
import { usePerformanceHistory, useCalculateStudentPerformance } from '../hooks/usePerformance';
import { PerformanceScoreCard } from './PerformanceScoreCard';
import { TrendChart } from './TrendChart';
import { RecommendationsList } from './RecommendationsList';
import { MetricsBreakdown } from './MetricsBreakdown';
import { Loader2, AlertCircle } from 'lucide-react';

interface PerformanceDashboardProps {
  studentId: string;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ studentId }) => {
  const { data: history, isLoading, isError, error } = usePerformanceHistory(studentId);
  const { mutate: calculate, isPending: isCalculating } = useCalculateStudentPerformance();

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
        <p className="text-gray-500 mb-4 text-lg">No performance predictions yet.</p>
        <p className="text-sm text-gray-400 mb-6">Calculations might not have run for this student.</p>
        <button 
          onClick={() => calculate(studentId)}
          disabled={isCalculating}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isCalculating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <AlertCircle className="mr-2 h-4 w-4" />
          )}
          Calculate Now
        </button>
      </div>
    );
  }

  const latestPrediction = history[0];

  return (
    <div className="space-y-6 mt-6">
      <div className="flex justify-end">
        <button 
          onClick={() => calculate(studentId)}
          disabled={isCalculating}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isCalculating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <AlertCircle className="mr-2 h-4 w-4" />
          )}
          Recalculate Performance
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <PerformanceScoreCard prediction={latestPrediction} />
        </div>
        <div className="md:col-span-2">
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
