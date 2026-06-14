import React, { useState, useRef } from 'react';
import { Plus, Minus, CheckCircle, AlertCircle, Upload, FileImage, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadExamFile } from '../services/exam.api';
import { toast } from 'sonner';

export interface MCQOption {
  id: string;
  text: string;
}

export interface MCQQuestionPayload {
  questionType: 'TEXT' | 'IMAGE';
  questionText?: string;
  imageUrl?: string;
  options: MCQOption[];
  correctAnswer: string;
  marks: number;
  explanation?: string;
}

interface MCQBuilderProps {
  onSave: (payload: MCQQuestionPayload) => void;
  onCancel: () => void;
}

export const MCQBuilder: React.FC<MCQBuilderProps> = ({ onSave, onCancel }) => {
  const [questionType, setQuestionType] = useState<'TEXT' | 'IMAGE'>('TEXT');
  const [questionText, setQuestionText] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [explanation, setExplanation] = useState('');
  const [marks, setMarks] = useState<number>(1);
  const [options, setOptions] = useState<MCQOption[]>([
    { id: 'opt1', text: '' },
    { id: 'opt2', text: '' },
  ]);
  const [correctAnswer, setCorrectAnswer] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadImage(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadImage(e.dataTransfer.files[0]);
    }
  };

  const uploadImage = async (file: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setUploadError('Allowed image types are: JPEG, PNG, WEBP.');
      return;
    }
    if (file.size > 7 * 1024 * 1024) {
      setUploadError('Image size cannot exceed 7MB.');
      return;
    }

    setUploadError('');
    setIsUploading(true);
    try {
      const publicUrl = await uploadExamFile(file, 'question-images');
      setUploadedImageUrl(publicUrl);
    } catch (err: any) {
      console.error(err);
      setUploadError(err.response?.data?.message || err.message || 'Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    const isQuestionValid = questionType === 'TEXT' 
      ? questionText.trim().length > 0 
      : uploadedImageUrl.trim().length > 0;

    if (!isQuestionValid) {
      if (questionType === 'TEXT') {
        toast.error('Please enter the question text.');
      } else {
        toast.error('Please upload an image for the question.');
      }
      return;
    }

    if (options.length < 2) {
      toast.error('Question must have at least 2 options.');
      return;
    }

    const hasEmptyOption = options.some(opt => opt.text.trim().length === 0);
    if (hasEmptyOption) {
      const emptyIdx = options.findIndex(opt => opt.text.trim().length === 0);
      const letter = String.fromCharCode(65 + emptyIdx);
      toast.error(`Option ${letter} cannot be empty.`);
      return;
    }

    if (!correctAnswer) {
      toast.error('Please select the correct answer option.');
      return;
    }

    if (!marks || marks <= 0) {
      toast.error('Marks must be a positive number.');
      return;
    }

    onSave({
      questionType,
      questionText: questionType === 'TEXT' ? questionText : undefined,
      imageUrl: questionType === 'IMAGE' ? uploadedImageUrl : undefined,
      options,
      correctAnswer,
      marks,
      explanation: explanation.trim() || undefined,
    });
  };

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-6 bg-white dark:bg-slate-900 shadow-sm space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Build Multiple Choice Question</h3>
        
        {/* Question Type Selection */}
        <div className="flex gap-4 mb-6">
          <button
            type="button"
            className={`flex-1 py-3 px-4 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              questionType === 'TEXT'
                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
            onClick={() => setQuestionType('TEXT')}
          >
            <span>Text-Based Question</span>
          </button>
          <button
            type="button"
            className={`flex-1 py-3 px-4 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              questionType === 'IMAGE'
                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
            onClick={() => setQuestionType('IMAGE')}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Image-Based Question</span>
          </button>
        </div>

        {/* Question Input */}
        {questionType === 'TEXT' ? (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Question Text *</label>
            <textarea
              className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-medium"
              rows={3}
              placeholder="Enter your question here..."
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
            />
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 font-bold">Upload Question Image *</label>
            
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[160px]"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/jpeg, image/png, image/webp"
                onChange={handleImageFileChange}
              />
              
              {uploadedImageUrl ? (
                <div className="space-y-3">
                  <img src={uploadedImageUrl} alt="Uploaded question" className="max-h-32 object-contain rounded-lg shadow-sm border border-slate-200 dark:border-slate-800" />
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">Click or drag new image to replace</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Upload className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Drag & Drop Image Here</h4>
                  <p className="text-xs text-slate-500">Supports JPEG, PNG, WEBP (Max size: 3MB)</p>
                </div>
              )}
              
              {isUploading && (
                <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 flex items-center justify-center rounded-xl font-semibold text-sm text-indigo-600 dark:text-indigo-400 animate-pulse">
                  Uploading Image to Supabase...
                </div>
              )}
            </div>
            
            {uploadError && (
              <p className="text-xs text-rose-500 font-semibold flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" /> {uploadError}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Options Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Options (Select the correct answer) *</label>
          <span className="text-xs text-slate-505 font-semibold">{options.length}/6 Options</span>
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
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm p-0 text-slate-800 dark:text-slate-200 outline-none font-medium text-slate-700 dark:text-slate-300"
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeOption(option.id)}
                  disabled={options.length <= 2}
                  className="text-slate-400 hover:text-rose-500 disabled:opacity-30 p-2 cursor-pointer"
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
            className="w-full border-dashed text-indigo-600 dark:text-indigo-400 font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Option
          </Button>
        )}
      </div>

      {/* Explanation */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Explanation (Optional)</label>
        <textarea
          className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-100"
          rows={2}
          placeholder="Explain the answer to students after they submit..."
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
        />
      </div>

      {/* Footer Settings */}
      <div className="flex items-center gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-505">Marks for this question</label>
          <input
            type="number"
            min="1"
            className="w-24 rounded-lg border border-slate-200 p-2 text-sm text-center focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-semibold"
            value={marks}
            onChange={(e) => setMarks(Number(e.target.value))}
          />
        </div>

        <div className="flex-1 flex justify-end gap-3 mt-4">
          <Button variant="ghost" onClick={onCancel} className="cursor-pointer">Cancel</Button>
          <Button 
            onClick={handleSave} 
            disabled={isUploading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer"
          >
            Save MCQ Question
          </Button>
        </div>
      </div>
      
      {!correctAnswer && options.length > 0 && (
        <p className="text-xs text-rose-500 flex items-center justify-end gap-1 mt-2 font-semibold">
          <AlertCircle className="w-3 h-3" /> Please select a correct answer to save
        </p>
      )}
    </div>
  );
};
