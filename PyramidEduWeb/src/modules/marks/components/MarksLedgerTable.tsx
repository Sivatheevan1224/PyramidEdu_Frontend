import React from 'react';
import { Card } from '@/components/ui/card';
import { UnifiedMark } from '../types/marks.types';
import { getBadgeColor, getScoreColor } from '../constants/marks.constants';

interface MarksLedgerTableProps {
  marks: UnifiedMark[];
  loading: boolean;
}

export const MarksLedgerTable: React.FC<MarksLedgerTableProps> = ({ marks, loading }) => {
  return (
    <Card className="overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Institution Marks Ledger</h3>
        <span className="text-xs font-semibold text-slate-400 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-full px-3 py-1">
          {marks.length} Records found
        </span>
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            Loading student marks ledger...
          </div>
        ) : marks.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            No student marks matching selected filters.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 dark:bg-slate-900/40 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-3.5">Student</th>
                <th className="px-6 py-3.5">Subject & Teacher</th>
                <th className="px-6 py-3.5">Assessment</th>
                <th className="px-6 py-3.5">Type</th>
                <th className="px-6 py-3.5">Score</th>
                <th className="px-6 py-3.5">Grade / Pct</th>
                <th className="px-6 py-3.5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-350">
              {marks.map((m) => {
                const percentage =
                  m.marksObtained !== null ? Math.round((m.marksObtained / m.totalMarks) * 100) : 0;
                return (
                  <tr
                    key={m.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {m.student.fullName}
                      </div>
                      <div className="text-xs text-slate-400">
                        Idx: {m.student.indexNumber || 'N/A'} | {m.student.batch} | {m.student.stream}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 dark:text-slate-100">
                        {m.subject.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        Taught by: {m.teacher?.fullName || 'System'}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                      {m.title}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getBadgeColor(m.type)}`}>
                        {m.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {m.isAbsent ? (
                        <span className="text-rose-500 font-bold">Absent</span>
                      ) : m.marksObtained !== null ? (
                        <span>
                          {m.marksObtained} <span className="text-slate-400">/ {m.totalMarks}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {m.isAbsent ? (
                        <span className="text-rose-500 font-bold">-</span>
                      ) : m.marksObtained !== null ? (
                        <span className={getScoreColor(percentage)}>{percentage}%</span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(m.examDate).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </Card>
  );
};
