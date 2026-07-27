import React from 'react';
import { Card } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { useMarksStore } from '../store/marks.store';
import { useBatches, useSubjects, useStreams, useTeachers } from '../hooks/useMarks';
import { ASSESSMENT_TYPES } from '../constants/marks.constants';

export const MarksFilters: React.FC = () => {
  const { filters, setFilters } = useMarksStore();

  const { data: batches = [] } = useBatches();
  const { data: subjects = [] } = useSubjects();
  const { data: streams = [] } = useStreams();
  const { data: teachers = [] } = useTeachers();

  return (
    <Card className="p-6 shadow-sm border border-slate-100 dark:border-slate-800">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Search & Filters</h3>
      <div className="grid gap-4 md:grid-cols-6">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-400">Batch</label>
          <select
            value={filters.batchId || ''}
            onChange={(e) => setFilters({ batchId: e.target.value })}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 p-2 text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          >
            <option value="">All Batches</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.batchName}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-400">Subject</label>
          <select
            value={filters.subjectId || ''}
            onChange={(e) => setFilters({ subjectId: e.target.value })}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 p-2 text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          >
            <option value="">All Subjects</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name || sub.subjectName}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-400">Stream</label>
          <select
            value={filters.streamId || ''}
            onChange={(e) => setFilters({ streamId: e.target.value })}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 p-2 text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          >
            <option value="">All Streams</option>
            {streams.map((s) => (
              <option key={s.id} value={s.id}>
                {s.streamName}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-400">Teacher</label>
          <select
            value={filters.teacherId || ''}
            onChange={(e) => setFilters({ teacherId: e.target.value })}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 p-2 text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          >
            <option value="">All Teachers</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.user?.fullName || 'Teacher'}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-400">Assessment Type</label>
          <select
            value={filters.type || ''}
            onChange={(e) => setFilters({ type: e.target.value })}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 p-2 text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          >
            <option value="">All Types</option>
            {ASSESSMENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-400">Search student</label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={filters.search || ''}
              onChange={(e) => setFilters({ search: e.target.value })}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 pl-9 pr-4 py-2 text-sm bg-transparent outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
