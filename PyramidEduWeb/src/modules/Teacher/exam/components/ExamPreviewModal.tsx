import React from 'react';
import { Button } from '@/components/ui/button';
import { CreateExamPayload } from '../services';

interface ExamPreviewModalProps {
  examData: Partial<CreateExamPayload>;
  questions: any[];
  onPublish: () => void;
  onClose: () => void;
}

export const ExamPreviewModal: React.FC<ExamPreviewModalProps> = ({ examData, questions, onPublish, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-10">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Exam Preview</h2>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>

        <div className="p-6 space-y-8">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{examData.examTitle}</h3>
            <div className="mt-2 text-sm text-slate-500 space-y-1">
              <p>Type: <span className="font-semibold text-slate-700 dark:text-slate-300">{examData.examType}</span></p>
              <p>Date: <span className="font-semibold text-slate-700 dark:text-slate-300">{examData.examDate}</span></p>
              <p>Total Marks: <span className="font-semibold text-slate-700 dark:text-slate-300">{examData.totalMarks}</span></p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Questions ({questions.length})</h4>
            {questions.map((q, idx) => (
              <div key={idx} className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex justify-between">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{idx + 1}. {q.questionText}</p>
                  <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{q.marks} marks</span>
                </div>
                {q.questionType === 'MCQ' && q.options && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {q.options.map((opt: any, optIdx: number) => {
                      const isCorrect = opt.id === q.correctAnswer;
                      return (
                        <div 
                          key={opt.id} 
                          className={`p-2 rounded border text-sm ${isCorrect ? 'bg-emerald-50 border-emerald-500 font-bold' : 'bg-slate-50 border-slate-200'} dark:bg-slate-800 dark:border-slate-700`}
                        >
                          {String.fromCharCode(65 + optIdx)}. {opt.text}
                          {isCorrect && <span className="text-emerald-600 ml-2">(Correct Answer)</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-4 sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-10">
          <Button variant="outline" onClick={onClose}>Edit Again</Button>
          <Button onClick={onPublish} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Publish Exam Now
          </Button>
        </div>
      </div>
    </div>
  );
};
