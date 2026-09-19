import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, TrendingUp } from 'lucide-react';
import { usePerformanceStore } from '../store/performance.store';
import { PerformanceDashboard } from '../components/PerformanceDashboard';
import { StudentPerformanceList } from '../components/StudentPerformanceList';
import { useAuth } from '@/context/AuthContext';

export const StaffPerformancePage: React.FC = () => {
  const { user } = useAuth();
  const isManagerOrAdmin = user?.role === 'MANAGER' || user?.role === 'ADMIN';
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
          {isManagerOrAdmin
            ? "Monitor student performance predictions, review reward points, and manage Free Card scholarships."
            : "Monitor student performance predictions, streaks, and view reward points & scholarships."}
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
              className="flex items-center gap-1.5 font-bold text-xs text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl shadow-xs transition-colors px-3.5 py-2 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4 text-slate-500" />
              <span>Back to Student List</span>
            </Button>
          </div>
          <PerformanceDashboard studentId={selectedStudentId} />
        </div>
      )}
    </div>
  );
};