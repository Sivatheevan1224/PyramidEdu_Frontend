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
      <Card className="h-full">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-lg">Performance Trend</h3>
        </div>
        <div className="p-6 pt-0 flex items-center justify-center h-64 text-gray-500">
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
    <Card className="h-full">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-lg">Performance Trend</h3>
      </div>
      <div className="p-6 pt-0 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, fill: '#1d4ed8' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
