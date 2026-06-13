import React, { useState } from 'react';
import { Plus, Minus, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface MCQOption {
  id: string;
  text: string;
}

export interface MCQQuestionPayload {
  questionType: 'MCQ';
  questionText: string;
  options: MCQOption[];
  correctAnswer: string;
  marks: number;
}

interface MCQBuilderProps {
  onSave: (payload: MCQQuestionPayload) => void;
  onCancel: () => void;
}

export const MCQBuilder: React.FC<MCQBuilderProps> = ({ onSave, onCancel }) => {
  const [questionText, setQuestionText] = useState('');
  const [marks, setMarks] = useState<number>(1);
  const [options, setOptions] = useState<MCQOption[]>([
    { id: 'opt1', text: '' },
    { id: 'opt2', text: '' },
  ]);
  const [correctAnswer, setCorrectAnswer] = useState<string>('');

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, { id: `opt${Date.now()}`, text: '' }]);
    }
  };

  const removeOption = (idToRemove: string) => {
    if (options.length > 2) {
      setOptions(options.filter(opt => opt.id !== idToRemove));
      if (correctAnswer === idToRemove) {
        setCorrectAnswer(''); // Reset if correct answer was removed
      }
    }
  };

  const updateOptionText = (id: string, text: string) => {
    setOptions(options.map(opt => (opt.id === id ? { ...opt, text } : opt)));
  };

  const isFormValid = () => {
    return (
      questionText.trim().length > 0 &&
      options.length >= 2 &&
      options.every(opt => opt.text.trim().length > 0) &&
      correctAnswer !== '' &&
      marks > 0
    );
  };

  const handleSave = () => {
    if (!isFormValid()) return;
    onSave({
      questionType: 'MCQ',
      questionText,
      options,
      correctAnswer,
      marks,
    });
  };

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-6 bg-white dark:bg-slate-900 shadow-sm space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Build Multiple Choice Question</h3>
        
        {/* Question Text */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Question Text</label>
          <textarea
            className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700"
            rows={3}
            placeholder="Enter your question here..."
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />
        </div>
      </div>

      {/* Options Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Options (Select the correct answer)</label>
          <span className="text-xs text-slate-505">{options.length}/6 Options</span>
        </div>

        <div className="space-y-3">
          {options.map((option, index) => {
            const isCorrect = correctAnswer === option.id;
            const letterLabel = String.fromCharCode(65 + index); // A, B, C...

            return (
              <div 
                key={option.id} 
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  isCorrect 
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' 
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'
                }`}
              >
                {/* Radio Selector */}
                <div 
                  className="flex items-center justify-center cursor-pointer"
                  onClick={() => setCorrectAnswer(option.id)}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isCorrect ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'
                  }`}>
                    {isCorrect && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                </div>

                <div className="font-bold text-slate-400 w-4 text-center">{letterLabel}</div>

                <input
                  type="text"
                  placeholder={`Option ${letterLabel}`}
                  value={option.text}
                  onChange={(e) => updateOptionText(option.id, e.target.value)}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm p-0 text-slate-800 dark:text-slate-200"
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeOption(option.id)}
                  disabled={options.length <= 2}
                  className="text-slate-400 hover:text-rose-500 disabled:opacity-30 p-2"
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </div>

        {options.length < 6 && (
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={addOption}
            className="w-full border-dashed text-indigo-600 dark:text-indigo-400"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Option
          </Button>
        )}
      </div>

      {/* Footer Settings */}
      <div className="flex items-center gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-505">Marks for this question</label>
          <input
            type="number"
            min="1"
            className="w-24 rounded-lg border border-slate-200 p-2 text-sm text-center focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700"
            value={marks}
            onChange={(e) => setMarks(Number(e.target.value))}
          />
        </div>

        <div className="flex-1 flex justify-end gap-3 mt-4">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button 
            onClick={handleSave} 
            disabled={!isFormValid()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Save MCQ Question
          </Button>
        </div>
      </div>
      
      {!correctAnswer && options.length > 0 && (
        <p className="text-xs text-rose-500 flex items-center justify-end gap-1 mt-2">
          <AlertCircle className="w-3 h-3" /> Please select a correct answer to save
        </p>
      )}
    </div>
  );
};
