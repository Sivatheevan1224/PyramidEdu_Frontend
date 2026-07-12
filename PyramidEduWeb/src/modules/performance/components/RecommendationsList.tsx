import React from 'react';
import { Card } from '@/components/ui/card';
import { PerformancePrediction } from '../types/performance.types';
import { Lightbulb, CheckCircle2 } from 'lucide-react';

interface RecommendationsListProps {
  prediction: PerformancePrediction;
}

export const RecommendationsList: React.FC<RecommendationsListProps> = ({ prediction }) => {
  const recommendations = prediction.recommendations || [];

  return (
    <Card className="h-full">
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="flex flex-row items-center space-x-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          <h3 className="text-lg">AI Recommendations</h3>
        </div>
      </div>
      <div className="p-6 pt-0">
        {recommendations.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
            <p>Great job! Keep up the good work. No specific recommendations at this time.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start bg-amber-50 p-3 rounded-md border border-amber-100">
                <span className="flex-shrink-0 h-5 w-5 rounded-full bg-amber-200 text-amber-700 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-sm text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
};
