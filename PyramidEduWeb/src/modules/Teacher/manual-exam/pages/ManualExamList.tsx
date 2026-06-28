import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Calendar, Clock, Users, BookOpen, ClipboardList } from 'lucide-react';
import { manualExamApi, ManualExam } from '../services/manual-exam.api';

export const ManualExamList: React.FC = () => {
  const [exams, setExams] = useState<ManualExam[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async (searchQuery?: string) => {
    try {
      setLoading(true);
      const data = await manualExamApi.getAllManualExams(searchQuery);
      setExams(data);
    } catch (error) {
      console.error('Error fetching manual exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    
    // Simple debounce
    const timer = setTimeout(() => {
      fetchExams(value);
    }, 500);
    return () => clearTimeout(timer);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manual Exams</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage physical exams and enter student marks</p>
        </div>
        <button
          onClick={() => router.push('/teacher/manual-exams/create')}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Manual Exam
        </button>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          className="block w-full rounded-xl border-0 py-3 pl-10 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:focus:ring-blue-500 transition-all"
          placeholder="Search exams by title..."
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : exams.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">No manual exams found</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new manual exam.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div key={exam.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full">
              <div className="p-5 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {exam.examTitle}
                  </h3>
                  <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-400/20 whitespace-nowrap ml-2">
                    {exam.totalMarks} Marks
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="truncate">{exam.subject.subjectName}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Users className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="truncate">{exam.batch.batchName} ({exam.batch._count?.students || 0} Students)</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{new Date(exam.examDate).toLocaleDateString()}</span>
                  </div>
                  {exam.duration && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{exam.duration} Minutes</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-5 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 mt-auto">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {exam._count?.marks || 0} marks entered
                  </div>
                  <button
                    onClick={() => router.push(`/teacher/manual-exams/${exam.id}/marks`)}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                  >
                    Enter Marks <span aria-hidden="true" className="ml-1">&rarr;</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
