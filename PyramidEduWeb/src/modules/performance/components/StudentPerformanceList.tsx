import React, { useState, useMemo } from 'react';
import { usePerformanceStudents, useCalculateAllPerformance } from '../hooks/usePerformance';
import { Loader2, AlertCircle, Eye, Search, Filter, RefreshCw, Users, Award, AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PERFORMANCE_COLORS, PERFORMANCE_LABELS } from '../constants/performance.constants';
import { TrendStatus, PerformanceLevel } from '../types/performance.types';

interface StudentPerformanceListProps {
  onSelectStudent: (studentId: string) => void;
}

export const StudentPerformanceList: React.FC<StudentPerformanceListProps> = ({ onSelectStudent }) => {
  const { data: students, isLoading, isError, error } = usePerformanceStudents();
  const { mutate: calculateAll, isPending: isRecalculating } = useCalculateAllPerformance();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('ALL');
  const [selectedLevel, setSelectedLevel] = useState('ALL');

  // 1. Get unique batches for the filter dropdown
  const batches = useMemo(() => {
    if (!students) return [];
    const unique = new Set(students.map(s => s.batchName).filter(Boolean));
    return Array.from(unique);
  }, [students]);

  // 2. Filter students based on search, batch, and level filters
  const filteredStudents = useMemo(() => {
    if (!students) return [];
    return students.filter(student => {
      const matchesSearch = 
        student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.indexNumber?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesBatch = 
        selectedBatch === 'ALL' || 
        student.batchName === selectedBatch;
      
      const matchesLevel = 
        selectedLevel === 'ALL' || 
        student.performanceStatus === selectedLevel;

      return matchesSearch && matchesBatch && matchesLevel;
    });
  }, [students, searchTerm, selectedBatch, selectedLevel]);

  // 3. Compute Summary Statistics based on the filtered set (or total set)
  const stats = useMemo(() => {
    const total = filteredStudents.length;
    let excellent = 0;
    let good = 0;
    let average = 0;
    let needsImprovement = 0;
    let atRisk = 0;

    filteredStudents.forEach(s => {
      const status = s.performanceStatus;
      if (status === 'EXCELLENT') excellent++;
      else if (status === 'VERY_GOOD' || status === 'GOOD') good++;
      else if (status === 'AVERAGE') average++;
      else if (status === 'NEEDS_IMPROVEMENT') needsImprovement++;
      else atRisk++;
    });

    return { total, excellent, good, average, needsImprovement, atRisk };
  }, [filteredStudents]);

  const handleRecalculateAll = () => {
    const studentIds = filteredStudents.map(s => s.id);
    if (studentIds.length === 0) return;
    calculateAll(studentIds);
  };

  const getStatusBadgeClass = (status: string | null) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status) {
      case 'EXCELLENT':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'VERY_GOOD':
      case 'GOOD':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'AVERAGE':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'NEEDS_IMPROVEMENT':
        return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'AT_RISK':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderTrendIcon = (trend: string | null) => {
    switch (trend) {
      case TrendStatus.IMPROVING:
        return <TrendingUp className="h-4 w-4 text-emerald-500" />;
      case TrendStatus.DECLINING:
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="p-4 animate-pulse bg-gray-50 h-24" />
          ))}
        </div>
        <Card className="p-6 animate-pulse bg-gray-50 h-96" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex items-start space-x-3">
        <AlertCircle className="h-5 w-5 mt-0.5 text-red-600" />
        <div>
          <h3 className="font-semibold text-red-800">Error Loading Students</h3>
          <p className="text-sm mt-1">{error?.message || 'Could not fetch student list.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4 flex items-center space-x-4 border-l-4 border-l-slate-600 shadow-sm">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Students</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-4 border-l-4 border-l-emerald-500 shadow-sm">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Excellent</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.excellent}</h3>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-4 border-l-4 border-l-blue-500 shadow-sm">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Good</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.good}</h3>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-4 border-l-4 border-l-yellow-500 shadow-sm">
          <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Average</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.average}</h3>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-4 border-l-4 border-l-red-500 shadow-sm">
          <div className="p-2 bg-red-50 rounded-lg text-red-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">At Risk</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.atRisk}</h3>
          </div>
        </Card>
      </div>

      {/* 2. Search, Filters, and Recalculate Controls */}
      <Card className="p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center flex-1">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search student name or index..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Batch Filter */}
            <div className="relative">
              <select
                value={selectedBatch}
                onChange={e => setSelectedBatch(e.target.value)}
                className="pl-3 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white appearance-none"
              >
                <option value="ALL">All Batches</option>
                {batches.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div className="relative">
              <select
                value={selectedLevel}
                onChange={e => setSelectedLevel(e.target.value)}
                className="pl-3 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white appearance-none"
              >
                <option value="ALL">All Levels</option>
                <option value="EXCELLENT">Excellent</option>
                <option value="GOOD">Good</option>
                <option value="AVERAGE">Average</option>
                <option value="NEEDS_IMPROVEMENT">Needs Improvement</option>
                <option value="AT_RISK">At Risk</option>
              </select>
            </div>
          </div>

          {/* Recalculate All Students button */}
          <Button
            onClick={handleRecalculateAll}
            disabled={isRecalculating || filteredStudents.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm flex items-center justify-center py-2 px-4 shadow-sm"
          >
            {isRecalculating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Recalculate All Students ({filteredStudents.length})
          </Button>
        </div>
      </Card>

      {/* 3. Students Table */}
      {filteredStudents.length === 0 ? (
        <Card className="text-center py-16 bg-white rounded-lg border shadow-sm">
          <AlertCircle className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-2 text-lg font-medium">No students match the criteria.</p>
          <p className="text-sm text-gray-400">Try adjusting your filters or search query.</p>
        </Card>
      ) : (
        <Card className="border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Student Details
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Batch
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Performance Score
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Trend
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">{student.fullName || 'Unknown Student'}</span>
                        <span className="text-xs text-gray-400 mt-0.5">Index: {student.indexNumber || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600 font-medium">{student.batchName}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.latestScore !== null ? (
                        <span className="text-sm font-bold text-gray-800">{Number(student.latestScore).toFixed(1)}%</span>
                      ) : (
                        <span className="text-xs text-gray-400 italic font-medium">Not calculated</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-4 font-bold rounded-full ${getStatusBadgeClass(student.performanceStatus)}`}>
                        {student.performanceStatus ? PERFORMANCE_LABELS[student.performanceStatus as PerformanceLevel] || student.performanceStatus : 'PENDING'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        {renderTrendIcon(student.trendStatus)}
                        <span className="text-xs capitalize font-medium">{student.trendStatus ? student.trendStatus.toLowerCase() : 'stable'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold">
                      <button
                        onClick={() => onSelectStudent(student.indexNumber || student.id)}
                        className="text-blue-600 hover:text-blue-900 inline-flex items-center bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4.5 w-4.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
