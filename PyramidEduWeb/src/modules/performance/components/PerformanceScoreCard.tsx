import React from 'react';
import { Card } from '@/components/ui/card';
import { PerformancePrediction } from '../types/performance.types';
import { PERFORMANCE_COLORS, PERFORMANCE_LABELS } from '../constants/performance.constants';
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { TrendStatus } from '../types/performance.types';

interface PerformanceScoreCardProps {
  prediction: PerformancePrediction;
}

export const PerformanceScoreCard: React.FC<PerformanceScoreCardProps> = ({ prediction }) => {
  const colorClass = PERFORMANCE_COLORS[prediction.performanceLevel] || 'text-gray-600 bg-gray-100';
  const label = PERFORMANCE_LABELS[prediction.performanceLevel] || prediction.performanceLevel;

  const renderTrendIcon = () => {
    switch (prediction.trendStatus) {
      case TrendStatus.IMPROVING:
        return <TrendingUp className="h-6 w-6 text-emerald-500" />;
      case TrendStatus.DECLINING:
        return <TrendingDown className="h-6 w-6 text-red-500" />;
      default:
        return <Minus className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <Card className="shadow-md border-t-4 border-t-blue-600">
      <div className="flex flex-col space-y-1.5 p-6 pb-2">
        <div className="flex flex-row items-center justify-between">
          <h3 className="text-lg font-bold">Overall Performance</h3>
          <Activity className="h-5 w-5 text-gray-500" />
        </div>
      </div>
      <div className="p-6 pt-0 text-center">
        <div className="flex flex-col items-center justify-center py-6">
          <div className="text-6xl font-extrabold text-gray-900 tracking-tighter mb-2">
            {Number(prediction.finalScore).toFixed(1)}<span className="text-2xl text-gray-400">%</span>
          </div>
          
          <div className={`mt-4 px-4 py-1 rounded-full text-sm font-semibold uppercase tracking-wider ${colorClass}`}>
            {label}
          </div>

          <div className="mt-6 flex items-center space-x-2 text-sm font-medium text-gray-600">
            <span className="text-gray-500">Trend:</span>
            {renderTrendIcon()}
            <span className="capitalize">{prediction.trendStatus.toLowerCase()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
