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
      <Card className="h-full border border-border dark:bg-slate-900/90 dark:border-slate-800 shadow-md rounded-xl">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-lg font-bold text-foreground dark:text-white">Performance Trend</h3>
        </div>
        <div className="p-6 pt-0 flex items-center justify-center h-64 text-muted-foreground dark:text-slate-400">
          No historical data available.
        </div>
      </Card>
    );
  }

  // Sort history oldest to newest for the chart
  const sortedHistory = [...history].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const data = sortedHistory.map((record) => ({
    date: format(new Date(record.createdAt), 'MMM d, yyyy'),
    score: Number(record.finalScore).toFixed(1),
  }));

  return (
    <Card className="h-full border border-border dark:bg-slate-900/90 dark:border-slate-800 shadow-md rounded-xl">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-lg font-bold text-foreground dark:text-white">Performance Trend</h3>
      </div>
      <div className="p-6 pt-0 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border dark:text-slate-800" />
            <XAxis dataKey="date" tick={{ fill: 'currentColor', fontSize: 12 }} className="text-muted-foreground dark:text-slate-400" axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: 'currentColor', fontSize: 12 }} className="text-muted-foreground dark:text-slate-400" axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: '12px', background: '#0f172a', border: '1px solid #1e293b', color: '#f8fafc', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)' }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 5, fill: '#6366f1', strokeWidth: 2, stroke: '#0f172a' }}
              activeDot={{ r: 7, fill: '#818cf8' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
