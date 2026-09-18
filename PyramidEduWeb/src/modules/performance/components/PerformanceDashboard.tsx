import React from 'react';
import { usePerformanceHistory, useCalculateStudentPerformance } from '../hooks/usePerformance';
import { PerformanceScoreCard } from './PerformanceScoreCard';
import { TrendChart } from './TrendChart';
import { RecommendationsList } from './RecommendationsList';
import { MetricsBreakdown } from './MetricsBreakdown';
import { Loader2, AlertCircle, User, GraduationCap, Calendar, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PerformanceDashboardProps {
  studentId: string;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ studentId }) => {
  const { data: history, isLoading, isError, error } = usePerformanceHistory(studentId);
  const { mutate: calculateStudent, isPending: isCalculating } = useCalculateStudentPerformance();

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
      <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 shadow-xs mt-4">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <AlertCircle className="h-6 w-6" />
        </div>
        <p className="text-slate-800 dark:text-slate-200 mb-1 text-base font-bold">No performance predictions yet</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Performance calculations have not been generated for this student yet.</p>
      </div>
    );
  }

  const latestPrediction = history[0];
  const studentData = (latestPrediction as any)?.student;
  const studentName = studentData?.user?.fullName;
  const studentEmail = studentData?.user?.email;
  const indexNumber = studentData?.indexNumber;
  const batchName = studentData?.batch;

  return (
    <div className="space-y-6 mt-6">
      {/* Student Profile Info Card */}
      <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 shrink-0">
              <User className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {studentName || "Student Performance Analytics"}
                </h2>
                {batchName && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-150 dark:border-indigo-800/80">
                    {batchName}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2 text-slate-500 dark:text-slate-400 text-xs mt-2 font-medium">
                {indexNumber ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-mono font-bold border border-slate-200/80 dark:border-slate-700">
                    <GraduationCap className="h-3.5 w-3.5 text-indigo-500" /> Index: {indexNumber}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
                    <GraduationCap className="h-3.5 w-3.5 text-indigo-500" /> ID: {studentId}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
                  <Calendar className="h-3.5 w-3.5 text-indigo-500" /> Calculated: {new Date(latestPrediction.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
                {studentEmail && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700">
                    {studentEmail}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => calculateStudent(studentId)}
              disabled={isCalculating}
              className="flex items-center gap-1.5 font-bold text-xs text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/60 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-xl transition-all px-3.5 py-2 cursor-pointer shadow-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isCalculating ? 'animate-spin' : ''}`} />
              <span>{isCalculating ? 'Recalculating...' : 'Recalculate Score'}</span>
            </Button>
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
