import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useMarksList } from '../hooks/useMarks';
import { useMarksStore } from '../store/marks.store';
import { MarksStats } from '../components/MarksStats';
import { MarksFilters } from '../components/MarksFilters';
import { MarksLedgerTable } from '../components/MarksLedgerTable';

export const ManagerMarksPage: React.FC = () => {
  const { filters } = useMarksStore();
  const { data: marks = [], isLoading } = useMarksList(filters);

  // Subject chart data
  const subjectChartData = useMemo(() => {
    const subjectMap: Record<string, { name: string; totalPct: number; count: number }> = {};

    marks.forEach((m) => {
      if (m.marksObtained === null || m.isAbsent) return;
      const pct = (m.marksObtained / m.totalMarks) * 100;
      if (subjectMap[m.subject.id]) {
        subjectMap[m.subject.id].totalPct += pct;
        subjectMap[m.subject.id].count += 1;
      } else {
        subjectMap[m.subject.id] = { name: m.subject.name, totalPct: pct, count: 1 };
      }
    });

    return Object.values(subjectMap)
      .map((entry) => ({
        name: entry.name,
        average: Math.round(entry.totalPct / entry.count),
      }))
      .slice(0, 10);
  }, [marks]);

  // Stream chart data
  const streamChartData = useMemo(() => {
    const streamMap: Record<string, { name: string; totalPct: number; count: number }> = {};

    marks.forEach((m) => {
      if (m.marksObtained === null || m.isAbsent) return;
      const pct = (m.marksObtained / m.totalMarks) * 100;
      if (streamMap[m.student.stream]) {
        streamMap[m.student.stream].totalPct += pct;
        streamMap[m.student.stream].count += 1;
      } else {
        streamMap[m.student.stream] = { name: m.student.stream, totalPct: pct, count: 1 };
      }
    });

    return Object.values(streamMap).map((entry) => ({
      name: entry.name,
      average: Math.round(entry.totalPct / entry.count),
    }));
  }, [marks]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Global Marks Analytics
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Institution-wide student performance dashboard and analytical overview.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <MarksStats marks={marks} />

      {/* Global Filters Panel */}
      <MarksFilters />

      {/* Analytics Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Subject wise Performance Chart */}
        <Card className="p-6 shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Subject-wise Performance (%)</h3>
          {subjectChartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
              No subject-wise data available for selection.
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <BarChart data={subjectChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" fontSize={11} stroke="#94a3b8" />
                  <YAxis domain={[0, 100]} fontSize={11} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '12px',
                      borderColor: '#e2e8f0',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="average" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Stream wise Performance Chart */}
        <Card className="p-6 shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Stream-wise Performance (%)</h3>
          {streamChartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
              No stream-wise data available for selection.
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <BarChart data={streamChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" fontSize={11} stroke="#94a3b8" />
                  <YAxis domain={[0, 100]} fontSize={11} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '12px',
                      borderColor: '#e2e8f0',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="average" fill="#818cf8" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      {/* Global Ledger Table */}
      <MarksLedgerTable marks={marks} loading={isLoading} />
    </div>
  );
};
