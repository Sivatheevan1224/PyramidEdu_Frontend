import React from 'react';
import { Card } from '@/components/ui/card';
import { PerformancePrediction } from '../types/performance.types';
import { PERFORMANCE_COLORS, PERFORMANCE_LABELS } from '../constants/performance.constants';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { TrendStatus } from '../types/performance.types';

interface PerformanceScoreCardProps {
  prediction: PerformancePrediction;
}

export const PerformanceScoreCard: React.FC<PerformanceScoreCardProps> = ({ prediction }) => {
  const colorClass = PERFORMANCE_COLORS[prediction.performanceLevel] || 'text-gray-600 bg-gray-100';
  const label = PERFORMANCE_LABELS[prediction.performanceLevel] || prediction.performanceLevel;
  const score = Number(prediction.finalScore);

  const renderTrendIcon = () => {
    switch (prediction.trendStatus) {
      case TrendStatus.IMPROVING:
        return <TrendingUp className="h-5 w-5 text-emerald-500" />;
      case TrendStatus.DECLINING:
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      default:
        return <Minus className="h-5 w-5 text-gray-500" />;
    }
  };

  // Circular progress dimensions
  const radius = 52;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Card className="shadow-md border-t-4 border-t-blue-600 h-full flex flex-col justify-between">
      <div className="p-6 pb-2">
        <h3 className="text-lg font-bold text-gray-800">Overall Performance</h3>
      </div>
      <div className="p-6 pt-0 flex flex-col items-center justify-center flex-1">
        <div className="relative flex items-center justify-center my-6">
          <svg
            height={radius * 2}
            width={radius * 2}
            className="transform -rotate-90"
          >
            {/* Background Circle */}
            <circle
              stroke="#e2e8f0"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Foreground Circle */}
            <circle
              stroke="#2563eb"
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-gray-900">{score.toFixed(1)}%</span>
          </div>
        </div>
        
        <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${colorClass}`}>
          {label}
        </div>

        <div className="mt-6 flex items-center space-x-2 text-sm font-semibold text-gray-600">
          <span className="text-gray-400 font-medium">Trend Status:</span>
          {renderTrendIcon()}
          <span className="capitalize">{prediction.trendStatus.toLowerCase()}</span>
        </div>
      </div>
    </Card>
  );
};
