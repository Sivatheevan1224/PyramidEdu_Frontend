import React from 'react';
import { Trash2, GripVertical } from 'lucide-react';

interface QuestionListProps {
  questions: any[];
  onRemove: (idx: number) => void;
}

export const QuestionList: React.FC<QuestionListProps> = ({ questions, onRemove }) => {
  if (questions.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-xl border-slate-300 dark:border-slate-700 text-slate-500">
        No questions added yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((q, idx) => (
        <div 
          key={idx} 
          className="flex gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
        >
          <div className="cursor-grab pt-1 text-slate-400">
            <GripVertical className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-start">
              <h4 className="font-bold text-slate-800 dark:text-slate-100">
                Q{idx + 1}. {q.questionText}
              </h4>
              <div className="flex items-center gap-3">
                {q.difficultyLevel && (
                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded tracking-wider
                    ${q.difficultyLevel === 'EASY' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : ''}
                    ${q.difficultyLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : ''}
                    ${q.difficultyLevel === 'HARD' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : ''}
                  `}>
                    {q.difficultyLevel}
                  </span>
                )}
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400 px-2 py-1 rounded">
                  {q.marks} marks
                </span>
                <button 
                  onClick={() => onRemove(idx)}
                  className="text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {q.questionType === 'MCQ' && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {q.options.map((opt: any, optIdx: number) => (
                  <div 
                    key={opt.id} 
                    className={`p-2 rounded border text-sm flex items-center gap-2 ${opt.id === q.correctAnswer ? 'bg-emerald-50 border-emerald-500 font-bold dark:bg-emerald-500/10' : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700'}`}
                  >
                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    {opt.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
