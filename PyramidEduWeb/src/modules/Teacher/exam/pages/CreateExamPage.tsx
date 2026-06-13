"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { ExamForm, MCQBuilder, MCQQuestionPayload, QuestionList, AssignmentUploader, ExamPreviewModal } from '../components';
import { useExams } from '../hooks/useExams';
import { addExamQuestion } from '../services/exam.api';

export function CreateExamPage() {
  const router = useRouter();
  const { createExam, isLoading } = useExams();
  
  const [step, setStep] = useState(1);
  const [examData, setExamData] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [showMCQBuilder, setShowMCQBuilder] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleBasicInfoSubmit = (data: any) => {
    setExamData(data);
    setStep(2);
  };

  const handleAddQuestion = (q: MCQQuestionPayload) => {
    setQuestions([...questions, { ...q, order: questions.length + 1 }]);
    setShowMCQBuilder(false);
  };

  const handleRemoveQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handlePublish = async () => {
    const toastId = toast.loading('Publishing exam...');
    try {
      // 1. Create the base exam
      const newExam = await createExam(examData);
      
      // 2. Add all questions sequentially (or Promise.all)
      for (const q of questions) {
        await addExamQuestion(newExam.id, q);
      }

      toast.success('Exam published successfully!', { id: toastId });
      router.push('/teacher/exams');
    } catch (error: any) {
      console.error(error);
      const errMsg = error?.response?.data?.message || 'Failed to publish exam';
      toast.error(errMsg, { id: toastId });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => step === 2 ? setStep(1) : router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {step === 1 ? 'Create New Exam' : 'Build Questions'}
          </h1>
          <p className="text-sm text-slate-500">
            {step === 1 ? 'Step 1 of 2: Basic details and schedule' : `Step 2 of 2: ${examData?.examTitle}`}
          </p>
        </div>
      </div>

      {step === 1 && (
        <ExamForm onNext={handleBasicInfoSubmit} />
      )}

      {step === 2 && examData && (
        <div className="space-y-8">
          {examData.examType === 'ASSIGNMENT' ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Upload Assignment Instructions</h3>
              <AssignmentUploader onUploadSuccess={(url) => {
                alert('Upload logic mocked. URL: ' + url);
              }} />
            </div>
          ) : (
            <>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Exam Questions</h3>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowMCQBuilder(true)}
                    disabled={showMCQBuilder}
                  >
                    + Add MCQ
                  </Button>
                </div>

                <QuestionList questions={questions} onRemove={handleRemoveQuestion} />
              </div>

              {showMCQBuilder && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <MCQBuilder 
                    onSave={handleAddQuestion} 
                    onCancel={() => setShowMCQBuilder(false)} 
                  />
                </div>
              )}
            </>
          )}

          <div className="flex justify-end pt-6 border-t border-slate-200 dark:border-slate-800 gap-4">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => setShowPreview(true)}
              disabled={isLoading || (examData.examType !== 'ASSIGNMENT' && questions.length === 0)}
            >
              {isLoading ? 'Processing...' : 'Preview & Publish'}
            </Button>
          </div>
        </div>
      )}

      {showPreview && (
        <ExamPreviewModal 
          examData={examData} 
          questions={questions} 
          onPublish={handlePublish} 
          onClose={() => setShowPreview(false)} 
        />
      )}
    </div>
  );
}
export default CreateExamPage;
