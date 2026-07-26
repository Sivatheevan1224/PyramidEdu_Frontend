import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { BookOpen, Percent, Award, CheckCircle } from 'lucide-react';
import { UnifiedMark } from '../types/marks.types';

interface MarksStatsProps {
  marks: UnifiedMark[];
}

export const MarksStats: React.FC<MarksStatsProps> = ({ marks }) => {
  const stats = useMemo(() => {
    const validMarks = marks.filter((m) => m.marksObtained !== null && !m.isAbsent);
    const count = validMarks.length;
    if (count === 0) {
      return { avg: 0, top: 0, passRate: 0, totalCount: marks.length };
    }

    let sum = 0;
    let top = 0;
    let passes = 0;

    validMarks.forEach((m) => {
      const percentage = (m.marksObtained! / m.totalMarks) * 100;
      sum += percentage;
      if (percentage > top) top = percentage;
      if (percentage >= 50) passes++;
    });

    return {
      avg: Math.round(sum / count),
      top: Math.round(top),
      passRate: Math.round((passes / count) * 100),
      totalCount: marks.length,
    };
  }, [marks]);

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="p-4 flex items-center justify-between shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Graded Marks</p>
          <h3 className="text-2xl font-bold text-slate-950 dark:text-slate-50">{stats.totalCount}</h3>
        </div>
        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
          <BookOpen className="h-5 w-5" />
        </div>
      </Card>

      <Card className="p-4 flex items-center justify-between shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Average Performance</p>
          <h3 className="text-2xl font-bold text-slate-950 dark:text-slate-50">{stats.avg}%</h3>
        </div>
        <div className="p-3 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 rounded-xl">
          <Percent className="h-5 w-5" />
        </div>
      </Card>

      <Card className="p-4 flex items-center justify-between shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Top Achievement</p>
          <h3 className="text-2xl font-bold text-slate-950 dark:text-slate-50">{stats.top}%</h3>
        </div>
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
          <Award className="h-5 w-5" />
        </div>
      </Card>

      <Card className="p-4 flex items-center justify-between shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Passing Rate</p>
          <h3 className="text-2xl font-bold text-slate-950 dark:text-slate-50">{stats.passRate}%</h3>
        </div>
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
          <CheckCircle className="h-5 w-5" />
        </div>
      </Card>
    </div>
  );
};
