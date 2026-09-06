import React, { useState, useMemo, useEffect } from 'react';
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

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedBatch, selectedLevel]);

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

  const totalPages = Math.ceil(filteredStudents.length / pageSize);
  const normalizedCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const paginatedStudents = useMemo(() => {
    const start = (normalizedCurrentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, normalizedCurrentPage, pageSize]);

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
        <Card className="p-4 flex items-center space-x-4 border-l-4 border-l-slate-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 shadow-md backdrop-blur-md">
          <div className="p-2.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Total Students</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{stats.total}</h3>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-4 border-l-4 border-l-emerald-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 shadow-md backdrop-blur-md">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Excellent</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{stats.excellent}</h3>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-4 border-l-4 border-l-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 shadow-md backdrop-blur-md">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/60 rounded-xl text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">Good</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{stats.good}</h3>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-4 border-l-4 border-l-amber-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 shadow-md backdrop-blur-md">
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/60 rounded-xl text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">Average</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{stats.average}</h3>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-4 border-l-4 border-l-rose-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 shadow-md backdrop-blur-md">
          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/60 rounded-xl text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider">At Risk</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{stats.atRisk}</h3>
          </div>
        </Card>
      </div>

      {/* 2. Search, Filters, and Recalculate Controls */}
      <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-lg rounded-xl">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center flex-1">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search student name or index..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2.5 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm font-medium"
              />
            </div>

            {/* Batch Filter */}
            <div className="relative">
              <select
                value={selectedBatch}
                onChange={e => setSelectedBatch(e.target.value)}
                className="pl-3 pr-8 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
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
                className="pl-3 pr-8 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
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
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center py-2.5 px-5 rounded-xl shadow-md transition-all"
          >
            {isRecalculating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Recalculate All ({filteredStudents.length})
          </Button>
        </div>
      </Card>

      {/* 3. Students Table */}
      {filteredStudents.length === 0 ? (
        <Card className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-xl shadow-md">
          <AlertCircle className="h-10 w-10 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-800 dark:text-slate-200 mb-2 text-lg font-semibold">No students match the criteria.</p>
          <p className="text-sm text-slate-500">Try adjusting your filters or search query.</p>
        </Card>
      ) : (
        <Card className="border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden bg-white dark:bg-slate-900 rounded-xl">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-100 dark:bg-slate-950">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Student Details
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Batch
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Performance Score
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Trend
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Streak
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Reward Points
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Free Card / Scholarship
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800/80">
                {paginatedStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{student.fullName || 'Unknown Student'}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">Index: {student.indexNumber || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-700 dark:text-slate-300 font-semibold">{student.batchName}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.latestScore !== null ? (
                        <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{Number(student.latestScore).toFixed(1)}%</span>
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-500 italic font-medium">Not calculated</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-4 font-bold rounded-full shadow-sm ${getStatusBadgeClass(student.performanceStatus)}`}>
                        {student.performanceStatus ? PERFORMANCE_LABELS[student.performanceStatus as PerformanceLevel] || student.performanceStatus : 'PENDING'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1 text-sm text-slate-700 dark:text-slate-300">
                        {renderTrendIcon(student.trendStatus)}
                        <span className="text-xs capitalize font-semibold">{student.trendStatus ? student.trendStatus.toLowerCase() : 'stable'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {student.dailyStreak !== undefined && student.dailyStreak > 0 ? (
                          <span className="text-amber-600 dark:text-amber-400 font-bold">{student.dailyStreak} Days 🔥</span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500">0 Days</span>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400">
                        {student.rewardPoints !== undefined ? `${student.rewardPoints} Pts` : '0 Pts'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={(student as any).freeCardType || 'NONE'}
                        onChange={async (e) => {
                          const newType = e.target.value;
                          try {
                            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
                            const token = localStorage.getItem('token');
                            await fetch(`${baseUrl}/performance/student/${student.id}/free-card`, {
                              method: 'PATCH',
                              headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                              },
                              body: JSON.stringify({ freeCardType: newType }),
                            });
                            window.location.reload();
                          } catch (err) {
                            console.error('Failed to update Free Card status:', err);
                          }
                        }}
                        className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                      >
                        <option value="NONE">Standard (No Discount)</option>
                        <option value="HALF_CARD">🥈 Half Card (50% Off)</option>
                        <option value="FREE_CARD">🏅 Free Card (100% Off)</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold">
                      <button
                        onClick={() => onSelectStudent(student.indexNumber || student.id)}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 inline-flex items-center bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 p-2 rounded-xl transition-all shadow-sm"
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

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80">
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Showing Page <span className="text-slate-900 dark:text-white font-bold">{normalizedCurrentPage}</span> of <span className="text-slate-900 dark:text-white font-bold">{totalPages}</span> ({filteredStudents.length} total students)
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={normalizedCurrentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={normalizedCurrentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
