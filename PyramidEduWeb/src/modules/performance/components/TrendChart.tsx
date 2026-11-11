import React from 'react';
import { Card } from '@/components/ui/card';
import { PerformancePrediction } from '../types/performance.types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface TrendChartProps {
  history: PerformancePrediction[];
}

export const TrendChart: React.FC<TrendChartProps> = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <Card className="h-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs rounded-2xl">
        <div className="p-6 pb-2 border-b border-slate-100 dark:border-slate-800/80">
          <h3 className="text-base font-bold text-slate-800 dark:text-white">Performance Score Trend</h3>
        </div>
        <div className="p-6 pt-0 flex items-center justify-center h-64 text-slate-400 dark:text-slate-500 text-xs font-medium italic">
          No historical data available.
        </div>
      </Card>
    );
  }

  // Sort history oldest to newest for the chart
  const sortedHistory = [...history].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const data = sortedHistory.map((record) => ({
    date: format(new Date(record.createdAt), 'MMM d'),
    score: Number(record.finalScore).toFixed(1),
  }));

  return (
    <Card className="h-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-sm transition-shadow rounded-2xl overflow-hidden">
      <div className="p-6 pb-2 border-b border-slate-100 dark:border-slate-800/80">
        <h3 className="text-base font-bold text-slate-800 dark:text-white">Performance Score Trend</h3>
      </div>
      <div className="p-6 pt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, bottom: 5, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="opacity-60 dark:opacity-20" />
            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
            <Tooltip
              contentStyle={{ borderRadius: '12px', background: '#ffffff', border: '1px solid #e2e8f0', color: '#0f172a', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }}
              formatter={(val: any) => [`${val}%`, 'Score']}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#ffffff' }}
              activeDot={{ r: 6, fill: '#4f46e5', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
