import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { usePerformanceStore } from '../store/performance.store';
import { PerformanceDashboard } from '../components/PerformanceDashboard';
import { StudentPerformanceList } from '../components/StudentPerformanceList';

export const StaffPerformancePage: React.FC = () => {
  const { selectedStudentId, setSelectedStudentId } = usePerformanceStore();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Performance Management</h1>
        <p className="text-gray-500 mt-2">Calculate and monitor student performance predictions.</p>
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
              className="flex items-center space-x-1 font-medium"
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
