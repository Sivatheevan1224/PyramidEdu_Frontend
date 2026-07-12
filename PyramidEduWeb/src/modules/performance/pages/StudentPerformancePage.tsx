import React from 'react';
import { PerformanceDashboard } from '../components/PerformanceDashboard';
import { useAuth } from '@/context/AuthContext';

export const StudentPerformancePage: React.FC = () => {
  const { user } = useAuth();
  // Assume user object contains the associated student profile ID
  const studentId = user?.id;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Performance</h1>
        <p className="text-gray-500 mt-2">Track your academic progress and view personalized AI recommendations.</p>
      </div>

      {studentId ? (
        <PerformanceDashboard studentId={studentId.toString()} />
      ) : (
        <div className="text-center py-12 text-gray-500">
          Loading student profile...
        </div>
      )}
    </div>
  );
};
