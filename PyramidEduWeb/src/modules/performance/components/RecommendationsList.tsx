import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PerformancePrediction } from '../types/performance.types';
import { Lightbulb, CheckCircle2, Sparkles, Loader2, AlertTriangle, ExternalLink, BookOpen, GraduationCap } from 'lucide-react';

const YoutubeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);
import { useGenerateStudentAiRecommendation } from '../hooks/usePerformance';
import { useAuth } from '@/context/AuthContext';

interface RecommendationsListProps {
  prediction: PerformancePrediction;
  studentId?: string;
  canGenerate?: boolean;
}

export const RecommendationsList: React.FC<RecommendationsListProps> = ({
  prediction,
  studentId,
  canGenerate,
}) => {
  const { user } = useAuth();
  const isAuthorized =
    canGenerate ??
    (user?.role === 'TEACHER' || user?.role === 'MANAGER' || user?.role === 'ADMIN');

  const { mutate: generateAi, isPending: isGenerating } = useGenerateStudentAiRecommendation();

  const allRecommendations = prediction.recommendations || [];

  // Separate AI personalized recommendation from standard system recommendations
  const aiRecommendation = allRecommendations.find(
    (r) =>
      r.startsWith('AI Strategy:') ||
      r.startsWith('AI Recommendation:') ||
      r.startsWith('💡 AI Strategy:')
  );

  const systemRecommendations = allRecommendations.filter(
    (r) =>
      !r.startsWith('AI Strategy:') &&
      !r.startsWith('AI Recommendation:') &&
      !r.startsWith('💡 AI Strategy:')
  );

  const getRecommendationDetails = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('attendance')) {
      return {
        title: 'Improve Class Attendance',
        description:
          'Attendance is currently below the 70% benchmark. Regular participation in lectures is key to maintaining consistent academic progress.',
      };
    }
    if (lower.includes('mcq')) {
      return {
        title: 'Practice MCQ Questions',
        description:
          'Online multiple choice test scores indicate areas for revision. Practice timed objective quizzes in the student portal.',
      };
    }
    if (lower.includes('essay')) {
      return {
        title: 'Practice for Essay Exams',
        description:
          'Focus on structuring structured essay answers, improving writing speed, and reviewing teacher feedback on past tests.',
      };
    }
    if (lower.includes('manual') || lower.includes('physical')) {
      return {
        title: 'Prepare for Physical Exams',
        description:
          'Dedicate study time to practical exercises and ensure active participation in on-site lab sessions and physical mock tests.',
      };
    }
    return {
      title: text,
      description: null,
    };
  };

  const cleanAiText = aiRecommendation
    ? aiRecommendation.replace(/^(?:💡\s*)?(?:AI Strategy:|AI Recommendation:)\s*/i, '').trim()
    : null;

  const renderBold = (text: string, keyPrefix: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={`${keyPrefix}-${idx}`} className="font-bold text-slate-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const renderInlineContent = (text: string) => {
    const elements: React.ReactNode[] = [];
    const regex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        elements.push(renderBold(text.substring(lastIndex, match.index), `txt-${lastIndex}`));
      }
      const label = match[1];
      const url = match[2];
      const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');

      elements.push(
        <a
          key={`lnk-${match.index}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={
            isYoutube
              ? "inline-flex items-center gap-1.5 px-2.5 py-1 mx-1 my-0.5 text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 border border-rose-200/90 dark:border-rose-900/60 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/70 transition-all shadow-2xs hover:scale-[1.02] cursor-pointer"
              : "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
          }
          title={isYoutube ? "Watch on YouTube" : "Open resource"}
        >
          {isYoutube ? (
            <YoutubeIcon className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
          ) : (
            <BookOpen className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          )}
          <span>{label}</span>
          <ExternalLink className="h-3 w-3 opacity-60 shrink-0" />
        </a>
      );
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      elements.push(renderBold(text.substring(lastIndex), `txt-${lastIndex}`));
    }

    return elements.length > 0 ? elements : renderBold(text, 'inline-base');
  };

  const renderFormattedMarkdown = (content: string) => {
    const lines = content.split('\n');

    return (
      <div className="space-y-2 text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return null;
          }
          if (trimmed === '---') {
            return <hr key={idx} className="my-2.5 border-indigo-100/80 dark:border-indigo-900/50" />;
          }

          // Heading 2 or 3 (## or ###)
          if (trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
            const headingText = trimmed.replace(/^#{2,3}\s*/, '');
            return (
              <div
                key={idx}
                className="pt-2.5 pb-1 font-black text-slate-900 dark:text-white text-xs md:text-sm border-b border-indigo-100/80 dark:border-indigo-900/40 flex items-center gap-1.5"
              >
                {renderInlineContent(headingText)}
              </div>
            );
          }

          // Bullet point
          if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
            const bulletText = trimmed.replace(/^[-•*]\s*/, '');
            return (
              <div key={idx} className="flex items-start gap-2 pl-2 py-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  {renderInlineContent(bulletText)}
                </div>
              </div>
            );
          }

          // Regular paragraph or numbered item
          return (
            <p key={idx} className="py-0.5">
              {renderInlineContent(trimmed)}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <Card className="h-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-sm transition-shadow rounded-2xl overflow-hidden flex flex-col">
      <div className="p-5 pb-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center space-x-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">Study Recommendations</h3>
        </div>

        {isAuthorized && studentId && (
          <Button
            size="sm"
            variant="outline"
            disabled={isGenerating}
            onClick={() => generateAi(studentId)}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-xl gap-1.5 cursor-pointer shadow-xs transition-all px-3 py-1.5"
            title="Generate personalized AI recommendation via OpenAI"
          >
            {isGenerating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            )}
            <span>{aiRecommendation ? 'Regenerate AI Advice' : 'Generate AI Advice'}</span>
          </Button>
        )}
      </div>

      <div className="p-5 pt-4 space-y-4 flex-1">
        {/* OpenAI Personalized Recommendation Card */}
        {cleanAiText && (
          <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-purple-50/50 to-white dark:from-indigo-950/60 dark:via-purple-950/30 dark:to-slate-900 border border-indigo-200/80 dark:border-indigo-800/60 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-indigo-100 dark:border-indigo-900/50 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-indigo-600 text-white shadow-xs">
                <Sparkles className="h-3 w-3" /> AI Personalized Roadmap
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100/60 dark:bg-indigo-900/40 px-2.5 py-0.5 rounded-md">
                  Subject Tailored
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Powered by OpenAI</span>
              </div>
            </div>
            
            {renderFormattedMarkdown(cleanAiText)}
          </div>
        )}

        {/* Existing System Rule-Based Recommendations */}
        <div>
          {systemRecommendations.length > 0 && cleanAiText && (
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">
              Core Focus Areas
            </p>
          )}

          {systemRecommendations.length === 0 && !cleanAiText ? (
            Number(prediction?.finalScore || 0) < 40 ? (
              <div className="text-center py-8 px-4 bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 rounded-xl">
                <AlertTriangle className="h-8 w-8 text-rose-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-rose-900 dark:text-rose-200">Critical Academic Alert</p>
                <p className="text-xs text-rose-700 dark:text-rose-400 mt-0.5">
                  Low engagement or 0% score recorded. Immediate academic counseling and participation catch-up required.
                </p>
              </div>
            ) : (
              <div className="text-center py-8 px-4 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 rounded-xl">
                <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">Great job!</p>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                  Keep up the consistent performance. No critical interventions needed at this time.
                </p>
              </div>
            )
          ) : (
            <ul className="space-y-2.5">
              {systemRecommendations.map((rec, idx) => {
                const details = getRecommendationDetails(rec);
                return (
                  <li
                    key={idx}
                    className="flex items-start bg-amber-50/70 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200/80 dark:border-amber-900/40 text-slate-800 dark:text-slate-200"
                  >
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
      </div>
    </Card>
  );
};
