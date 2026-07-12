import React, { useState } from 'react';
import { useCalculateAllPerformance } from '../hooks/usePerformance';
import { Button } from '@/components/ui/button';
import { Play, Loader2 } from 'lucide-react';
import { usePerformanceStore } from '../store/performance.store';
import { PerformanceDashboard } from '../components/PerformanceDashboard';
import { StudentPerformanceList } from '../components/StudentPerformanceList';
import { useAuth } from '@/context/AuthContext';

export const StaffPerformancePage: React.FC = () => {
  const { mutate: calculateAll, isPending } = useCalculateAllPerformance();
  const { selectedStudentId, setSelectedStudentId } = usePerformanceStore();
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Performance Management</h1>
          <p className="text-gray-500 mt-2">Calculate and monitor student performance predictions.</p>
        </div>
        
        {user?.role === 'MANAGER' && (
          <Button 
            onClick={() => calculateAll()} 
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            Calculate For All Students
          </Button>
        )}
      </div>

      {!selectedStudentId ? (
        <div className="mt-8">
          <StudentPerformanceList onSelectStudent={setSelectedStudentId} />
        </div>
      ) : (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Student ID: {selectedStudentId}</h2>
            <Button variant="outline" size="sm" onClick={() => setSelectedStudentId(null)}>Back to List</Button>
          </div>
          <PerformanceDashboard studentId={selectedStudentId} />
        </div>
      )}
    </div>
  );
};
