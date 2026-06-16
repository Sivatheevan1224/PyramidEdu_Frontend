"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Save, Loader2, Plus, Trash2, GripVertical,
  CheckCircle, Pencil, X, Upload, Image as ImageIcon, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  fetchExamById, updateExam, addExamQuestion,
  deleteExamQuestion, updateExamQuestion, uploadExamFile,
} from '../services/exam.api';
import { MCQBuilder, MCQQuestionPayload, PDFExamUploader } from '../components';
import api from '@/lib/api';

interface MCQOption {
  id: string;
  text: string;
}

interface InlineQuestionEditorProps {
  question: any;
  onSave: (updated: any) => void;
  onCancel: () => void;
}

const InlineQuestionEditor: React.FC<InlineQuestionEditorProps> = ({ question, onSave, onCancel }) => {
  const [questionType, setQuestionType] = useState<'TEXT' | 'IMAGE'>(question.questionType || 'TEXT');
  const [questionText, setQuestionText] = useState(question.questionText || '');
  const [uploadedImageUrl, setUploadedImageUrl] = useState(question.imageUrl || '');
  const [explanation, setExplanation] = useState(question.explanation || '');
  const [marks, setMarks] = useState<number>(question.marks || 1);
  const [options, setOptions] = useState<MCQOption[]>(
    Array.isArray(question.options) ? question.options : []
  );
  const [correctAnswer, setCorrectAnswer] = useState<string>(question.correctAnswer || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateOptionText = (id: string, text: string) =>
    setOptions(options.map((o) => (o.id === id ? { ...o, text } : o)));

  const addOption = () => {
    if (options.length < 6)
      setOptions([...options, { id: `opt${Date.now()}`, text: '' }]);
  };

  const removeOption = (id: string) => {
    if (options.length <= 2) return;
    setOptions(options.filter((o) => o.id !== id));
    if (correctAnswer === id) setCorrectAnswer('');
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

  const handleSave = async () => {
    const isQuestionValid = questionType === 'TEXT'
      ? questionText.trim().length > 0
      : uploadedImageUrl.trim().length > 0;

    if (!isQuestionValid) {
      if (questionType === 'TEXT') {
        toast.error('Please enter the question text.');
      } else {
        toast.error('Please upload an image.');
      }
      return;
    }

    if (options.length < 2) {
      toast.error('Question must have at least 2 options.');
      return;
    }

    const hasEmptyOption = options.some(o => o.text.trim().length === 0);
    if (hasEmptyOption) {
      const emptyIdx = options.findIndex(o => o.text.trim().length === 0);
      const letter = String.fromCharCode(65 + emptyIdx);
      toast.error(`Option ${letter} cannot be empty.`);
      return;
    }

    if (!correctAnswer) {
      toast.error('Please select the correct answer.');
      return;
    }

    if (!marks || marks <= 0) {
      toast.error('Marks must be a positive number.');
      return;
    }

    setIsSaving(true);
    onSave({
      questionType,
      questionText: questionType === 'TEXT' ? questionText : undefined,
      imageUrl: questionType === 'IMAGE' ? uploadedImageUrl : undefined,
      options,
      correctAnswer,
      marks,
      explanation: explanation.trim() || undefined
    });
  };

  return (
    <div className="border border-indigo-200 dark:border-indigo-800 rounded-xl p-5 bg-indigo-50/30 dark:bg-indigo-500/5 space-y-4">
      {/* Question Type Selection */}
      <div className="flex gap-4">
        <button
          type="button"
          className={`flex-1 py-2 rounded-lg border text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
            questionType === 'TEXT'
              ? 'border-indigo-650 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-bold'
              : 'border-slate-205 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
          onClick={() => setQuestionType('TEXT')}
        >
          <span>Text-Based</span>
        </button>
        <button
          type="button"
          className={`flex-1 py-2 rounded-lg border text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
            questionType === 'IMAGE'
              ? 'border-indigo-650 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-bold'
              : 'border-slate-205 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
          onClick={() => setQuestionType('IMAGE')}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Image-Based</span>
        </button>
      </div>

      {/* Question Input */}
      {questionType === 'TEXT' ? (
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Question Text *</label>
          <textarea
            rows={2}
            className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700 resize-none"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />
        </div>
      ) : (
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Question Image *</label>
          <div 
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 text-center bg-white dark:bg-slate-900 hover:bg-slate-50 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[120px] relative"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/jpeg, image/png, image/webp"
              onChange={handleImageFileChange}
            />
            {uploadedImageUrl ? (
              <div className="space-y-2">
                <img src={uploadedImageUrl} alt="Question" className="max-h-24 object-contain rounded border border-slate-200" />
                <p className="text-[10px] text-indigo-500 font-semibold">Click or drag new image to replace</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5">
                <Upload className="w-4 h-4 text-slate-400" />
                <p className="text-xs font-semibold text-slate-600">Drag image here or click</p>
                <p className="text-[10px] text-slate-400">Supports JPEG, PNG, WEBP (Max 3MB)</p>
              </div>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 flex items-center justify-center rounded-lg font-bold text-xs text-indigo-600 dark:text-indigo-400">
                Uploading...
              </div>
            )}
          </div>
          {uploadError && (
            <p className="text-[10px] text-rose-500 font-semibold flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3" /> {uploadError}
            </p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Options — click circle to set correct answer *
          </label>
          <span className="text-xs text-slate-405">{options.length}/6</span>
        </div>
        {options.map((opt, idx) => {
          const isCorrect = correctAnswer === opt.id;
          return (
            <div
              key={opt.id}
              className={`flex items-center gap-2 p-2.5 rounded-lg border transition-all ${
                isCorrect
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
              }`}
            >
              <button
                type="button"
                onClick={() => setCorrectAnswer(opt.id)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                  isCorrect ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300 dark:border-slate-600'
                }`}
              >
                {isCorrect && <CheckCircle className="w-3 h-3 text-white" />}
              </button>
              <span className="text-xs font-bold text-slate-400 w-4">{String.fromCharCode(65 + idx)}</span>
              <input
                type="text"
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm p-0 text-slate-800 dark:text-slate-200 outline-none"
                value={opt.text}
                onChange={(e) => updateOptionText(opt.id, e.target.value)}
                placeholder={`Option ${String.fromCharCode(65 + idx)}`}
              />
              <button
                type="button"
                disabled={options.length <= 2}
                onClick={() => removeOption(opt.id)}
                className="text-slate-305 hover:text-rose-500 disabled:opacity-30 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
        {options.length < 6 && (
          <button
            type="button"
            onClick={addOption}
            className="w-full py-2 border border-dashed border-indigo-300 dark:border-indigo-700 rounded-lg text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors flex items-center justify-center gap-1 font-semibold cursor-pointer"
          >
            <Plus className="w-3 h-3" /> Add option
          </button>
        )}
      </div>

      {/* Explanation editing */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Explanation (Optional)</label>
        <textarea
          rows={1.5}
          className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700 resize-none"
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Explain the answer to students..."
        />
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-505">Marks:</label>
          <input
            type="number"
            min="1"
            className="w-20 rounded-lg border border-slate-200 p-2 text-sm text-center focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700 font-semibold"
            value={marks}
            onChange={(e) => setMarks(Number(e.target.value))}
          />
        </div>
        {!correctAnswer && (
          <p className="text-xs text-rose-500 flex items-center gap-1 font-semibold">
            Select a correct answer to save
          </p>
        )}
        <div className="flex gap-2 ml-auto">
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={isSaving || isUploading} className="cursor-pointer">Cancel</Button>
          <Button
            size="sm"
            disabled={isSaving || isUploading}
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-3 h-3 mr-1" />Save</>}
          </Button>
        </div>
      </div>
    </div>
  );
};

export function EditExamPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [showMCQBuilder, setShowMCQBuilder] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    examTitle: '',
    examType: 'MCQ' as 'MCQ' | 'ESSAY',
    subjectId: '',
    batchId: '',
    examDate: '',
    startTime: '',
    duration: '',
    totalMarks: 100,
    pdfUrl: '',
  });

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [exam, profileRes, batchRes] = await Promise.all([
          fetchExamById(examId),
          api.get('/teachers/me').catch(() => ({ data: { data: null } })),
          api.get('/batches').catch(() => ({ data: { data: [] } })),
        ]);

        setFormData({
          examTitle: exam.examTitle || '',
          examType: (exam.examType || 'MCQ') as 'MCQ' | 'ESSAY',
          subjectId: exam.subjectId || '',
          batchId: exam.batchId || '',
          examDate: exam.examDate ? exam.examDate.slice(0, 10) : '',
          startTime: exam.startTime ? exam.startTime.slice(0, 16) : '',
          duration: exam.duration?.toString() || '',
          totalMarks: exam.totalMarks || 100,
          pdfUrl: exam.pdfUrl || '',
        });
        setQuestions(exam.questions || []);

        const teacher = profileRes.data?.data;
        const tempSubjects: any[] = [];
        if (teacher) {
          if (teacher.primarySubject) tempSubjects.push(teacher.primarySubject);
          if (Array.isArray(teacher.subjectAllocations)) {
            teacher.subjectAllocations.forEach((alloc: any) => {
              if (alloc.status === 'ACTIVE' && alloc.subject) {
                if (!tempSubjects.some((s) => s.id === alloc.subject.id))
                  tempSubjects.push(alloc.subject);
              }
            });
          }
        }
        if (tempSubjects.length === 0 && exam.subject)
          tempSubjects.push({ id: exam.subjectId, subjectName: exam.subject.subjectName });
        setSubjects(tempSubjects);

        const batchData = batchRes.data?.data;
        setBatches(Array.isArray(batchData) ? batchData : []);
      } catch {
        toast.error('Failed to load exam data');
        router.push(`/teacher/exams/${examId}`);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [examId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    if (!formData.examTitle.trim()) { toast.error('Exam title is required'); return; }
    if (!formData.examDate) { toast.error('Exam date is required'); return; }
    const toastId = toast.loading('Saving changes...');
    setIsSaving(true);
    try {
      await updateExam(examId, {
        examTitle: formData.examTitle,
        examType: formData.examType,
        subjectId: formData.subjectId,
        batchId: formData.batchId || undefined,
        examDate: formData.examDate,
        startTime: formData.startTime || undefined,
        duration: formData.duration ? Number(formData.duration) : undefined,
        totalMarks: Number(formData.totalMarks),
        pdfUrl: formData.pdfUrl || undefined,
      });
      toast.success('Exam updated successfully!', { id: toastId });
      router.push(`/teacher/exams/${examId}`);
      router.refresh();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save changes', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddQuestion = async (payload: MCQQuestionPayload) => {
    const toastId = toast.loading('Adding question...');
    try {
      const newQ = await addExamQuestion(examId, { ...payload, order: questions.length + 1 });
      setQuestions((prev) => [...prev, newQ]);
      setShowMCQBuilder(false);
      toast.success('Question added!', { id: toastId });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to add question', { id: toastId });
    }
  };

  const handleUpdateQuestion = async (questionId: string, payload: any) => {
    const toastId = toast.loading('Saving question...');
    try {
      const updated = await updateExamQuestion(examId, questionId, payload);
      setQuestions((prev) => prev.map((q) => (q.id === questionId ? { ...q, ...updated } : q)));
      setEditingQuestionId(null);
      toast.success('Question updated!', { id: toastId });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update question', { id: toastId });
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    setDeletingQuestionId(questionId);
    const toastId = toast.loading('Removing question...');
    try {
      await deleteExamQuestion(examId, questionId);
      setQuestions((prev) => prev.filter((q) => q.id !== questionId));
      toast.success('Question removed', { id: toastId });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete question', { id: toastId });
    } finally {
      setDeletingQuestionId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push(`/teacher/exams/${examId}`)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Edit Exam</h1>
          <p className="text-sm text-slate-500">Modify exam details, schedule, and questions</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Exam Title <span className="text-rose-500">*</span>
            </label>
            <input type="text" name="examTitle"
              className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700"
              value={formData.examTitle} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Subject</label>
            {subjects.length === 1 ? (
              <input type="text" readOnly disabled
                className="w-full rounded-lg border border-slate-200 p-3 text-sm bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-slate-500 font-semibold cursor-not-allowed"
                value={subjects[0].subjectName || subjects[0].name} />
            ) : (
              <select name="subjectId"
                className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700"
                value={formData.subjectId} onChange={handleChange}>
                {subjects.map((s) => <option key={s.id} value={s.id}>{s.subjectName || s.name}</option>)}
              </select>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Batch</label>
            <select name="batchId"
              className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700"
              value={formData.batchId} onChange={handleChange}>
              <option value="">All Batches</option>
              {batches.map((b) => <option key={b.id} value={b.id}>{b.batchName || b.name}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Exam Type</label>
            <select name="examType"
              className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700"
              value={formData.examType} onChange={handleChange}>
              <option value="MCQ">MCQ</option>
              <option value="ESSAY">Essay</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Total Marks <span className="text-rose-500">*</span>
            </label>
            <input type="number" name="totalMarks" min="1"
              className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700"
              value={formData.totalMarks} onChange={handleChange} />
          </div>
        </div>

        <hr className="border-slate-100 dark:border-slate-800" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Schedule &amp; Timing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Exam Date <span className="text-rose-500">*</span>
            </label>
            <input type="date" name="examDate"
              className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700"
              value={formData.examDate} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Start Time</label>
            <input type="datetime-local" name="startTime"
              className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700"
              value={formData.startTime} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Duration (Minutes)</label>
            <input type="number" name="duration" min="1" placeholder="e.g. 60"
              className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700"
              value={formData.duration} onChange={handleChange} />
          </div>
        </div>
      </div>

      {formData.examType === 'ESSAY' ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">PDF Questionnaire</h3>
          <p className="text-xs text-slate-400 mt-0.5">Upload or replace the essay question paper PDF.</p>
          
          {formData.pdfUrl ? (
            <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-red-500 font-bold text-xs bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30 px-2 py-0.5 rounded">PDF</span>
                <a href={formData.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold text-sm truncate max-w-[350px] sm:max-w-[500px]">
                  {formData.pdfUrl.split('/').pop()}
                </a>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, pdfUrl: '' }))}
                className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50 cursor-pointer font-bold shrink-0"
              >
                Remove &amp; Upload New
              </Button>
            </div>
          ) : (
            <PDFExamUploader 
              onUploadSuccess={(url) => {
                setFormData(prev => ({ ...prev, pdfUrl: url }));
                toast.success('Questionnaire PDF uploaded successfully!');
              }} 
            />
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Questions
                <span className="ml-2 text-sm font-normal text-slate-400">({questions.length})</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Question changes are saved immediately</p>
            </div>
            <Button
              variant="outline"
              onClick={() => { setShowMCQBuilder(true); setEditingQuestionId(null); }}
              disabled={showMCQBuilder}
              className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:border-indigo-800 dark:hover:bg-indigo-500/10"
            >
              <Plus className="w-4 h-4 mr-2" />Add MCQ
            </Button>
          </div>

          {showMCQBuilder && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <MCQBuilder
                onSave={handleAddQuestion}
                onCancel={() => setShowMCQBuilder(false)}
              />
            </div>
          )}

          {questions.length === 0 && !showMCQBuilder ? (
            <div className="text-center p-8 border border-dashed rounded-xl border-slate-300 dark:border-slate-700 text-slate-505">
              No questions yet. Click <strong>Add MCQ</strong> to get started.
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((q, idx) => (
                <div key={q.id}>
                  {editingQuestionId !== q.id ? (
                    <div className="flex gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 group">
                      <div className="pt-1 text-slate-305 dark:text-slate-600">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      <div className="flex-1 space-y-2 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div className="space-y-2 flex-1">
                            <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm leading-snug">
                              Q{idx + 1}. {q.questionType === 'IMAGE' ? <span className="text-xs text-indigo-500 uppercase tracking-wider block font-bold">[Image-Based Question]</span> : null}
                              {q.questionText}
                            </p>
                            {q.questionType === 'IMAGE' && q.imageUrl && (
                              <img src={q.imageUrl} alt={`Question ${idx + 1}`} className="max-h-32 object-contain rounded-lg border border-slate-200" />
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400 px-2 py-1 rounded">
                              {q.marks} marks
                            </span>
                            <button
                              onClick={() => { setEditingQuestionId(q.id); setShowMCQBuilder(false); }}
                              className="text-slate-400 hover:text-indigo-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
                              title="Edit question"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(q.id)}
                              disabled={deletingQuestionId === q.id}
                              className="text-slate-400 hover:text-rose-500 transition-colors disabled:opacity-40 p-1"
                              title="Delete question"
                            >
                              {deletingQuestionId === q.id
                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                : <Trash2 className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {Array.isArray(q.options) && (
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {q.options.map((opt: any, oIdx: number) => {
                              const isCorrect = q.correctAnswer === opt.id;
                              return (
                                <div key={opt.id}
                                  className={`text-xs p-2 rounded border flex items-center gap-2 ${
                                    isCorrect
                                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 font-medium'
                                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                                  }`}>
                                  {isCorrect && <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />}
                                  <span className="font-bold text-slate-400 shrink-0">{String.fromCharCode(65 + oIdx)}.</span>
                                  {opt.text}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {q.explanation && (
                          <div className="mt-2 p-2.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-lg text-xs">
                            <p className="text-amber-800 dark:text-amber-300"><span className="font-bold">Explanation:</span> {q.explanation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="animate-in fade-in duration-200">
                      <div className="flex items-center gap-2 mb-2 px-1">
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400 px-2 py-0.5 rounded">
                          Editing Q{idx + 1}
                        </span>
                      </div>
                      <InlineQuestionEditor
                        question={q}
                        onSave={(payload) => handleUpdateQuestion(q.id, payload)}
                        onCancel={() => setEditingQuestionId(null)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end gap-4 border-t border-slate-200 dark:border-slate-800 pt-6">
        <Button variant="outline" onClick={() => router.push(`/teacher/exams/${examId}`)} disabled={isSaving}>
          Cancel
        </Button>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleSave} disabled={isSaving}>
          {isSaving
            ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
            : <><Save className="w-4 h-4 mr-2" />Save Changes</>}
        </Button>
      </div>
    </div>
  );
}
export default EditExamPage;
