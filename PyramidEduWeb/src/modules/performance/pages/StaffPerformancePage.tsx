import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, TrendingUp } from 'lucide-react';
import { usePerformanceStore } from '../store/performance.store';
import { PerformanceDashboard } from '../components/PerformanceDashboard';
import { StudentPerformanceList } from '../components/StudentPerformanceList';

export const StaffPerformancePage: React.FC = () => {
  const { selectedStudentId, setSelectedStudentId } = usePerformanceStore();

  return (
    <div className="space-y-6">
      {/* Standard Portal Page Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2 text-foreground">
          <TrendingUp className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          Performance Management
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor student AI performance predictions, review reward points, and manage Free Card scholarships.
        </p>
      </div>

      {!selectedStudentId ? (
        <div className="mt-6">
          <StudentPerformanceList onSelectStudent={setSelectedStudentId} />
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedStudentId(null)}
              className="flex items-center space-x-1 font-semibold text-slate-200 border-slate-700 bg-slate-800 hover:bg-slate-700 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Student List</span>
            </Button>
          </div>
          <PerformanceDashboard studentId={selectedStudentId} />
        </div>
      )}
    </div>
  );
};
