import React from 'react';
import { Card } from '@/components/ui/card';
import { PerformancePrediction } from '../types/performance.types';
import { Lightbulb, CheckCircle2 } from 'lucide-react';

interface RecommendationsListProps {
  prediction: PerformancePrediction;
}

export const RecommendationsList: React.FC<RecommendationsListProps> = ({ prediction }) => {
  const recommendations = prediction.recommendations || [];

  const getRecommendationDetails = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes("attendance")) {
      return {
        title: "Improve Class Attendance",
        description: "Attendance is currently below the 70% benchmark. Regular participation in lectures is key to maintaining consistent academic progress.",
      };
    }
    if (lower.includes("mcq")) {
      return {
        title: "Practice MCQ Questions",
        description: "Online multiple choice test scores indicate areas for revision. Practice timed objective quizzes in the student portal.",
      };
    }
    if (lower.includes("essay")) {
      return {
        title: "Practice for Essay Exams",
        description: "Focus on structuring structured essay answers, improving writing speed, and reviewing teacher feedback on past tests.",
      };
    }
    if (lower.includes("manual") || lower.includes("physical")) {
      return {
        title: "Prepare for Physical Exams",
        description: "Dedicate study time to practical exercises and ensure active participation in on-site lab sessions and physical mock tests.",
      };
    }
    return {
      title: text,
      description: null,
    };
  };

  return (
    <Card className="h-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-sm transition-shadow rounded-2xl overflow-hidden">
      <div className="p-6 pb-2 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center space-x-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">Study Recommendations</h3>
        </div>
      </div>
      <div className="p-6 pt-5">
        {recommendations.length === 0 ? (
          <div className="text-center py-8 px-4 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 rounded-xl">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">Great job!</p>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">Keep up the consistent performance. No critical interventions needed at this time.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {recommendations.map((rec, idx) => {
              const details = getRecommendationDetails(rec);
              return (
                <li key={idx} className="flex items-start bg-amber-50/70 dark:bg-amber-950/30 p-3.5 rounded-xl border border-amber-200/80 dark:border-amber-900/40 text-slate-800 dark:text-slate-200">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xs font-black mr-3 mt-0.5 border border-amber-300/80 dark:border-amber-700">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {details.title}
                    </p>
                    {details.description && (
                      <p className="text-[11px] font-medium leading-relaxed text-slate-600 dark:text-slate-400 mt-1">
                        {details.description}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Card>
  );
};
