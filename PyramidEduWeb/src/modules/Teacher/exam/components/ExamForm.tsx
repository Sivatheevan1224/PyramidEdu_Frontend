import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CreateExamPayload } from '../services/exam.api';
import api from '@/lib/api';
import { toast } from 'sonner';

interface ExamFormProps {
  onNext: (payload: Partial<CreateExamPayload>) => void;
}

export const ExamForm: React.FC<ExamFormProps> = ({ onNext }) => {
  const [formData, setFormData] = useState<Partial<CreateExamPayload>>({
    examType: 'QUIZ',
    totalMarks: 100,
  });

  const [subjects, setSubjects] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [teacherName, setTeacherName] = useState<string>('');
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true);

  useEffect(() => {
    // Fetch subjects and batches for the teacher
    const fetchMetadata = async () => {
      try {
        setIsLoadingProfile(true);
        const [profileRes, batchRes] = await Promise.all([
          api.get('/teachers/me').catch((e) => {
            console.error('Error fetching teacher profile', e);
            return { data: { data: null } };
          }),
          api.get('/batches').catch((e) => {
            console.error('Error fetching batches', e);
            return { data: { data: [] } };
          })
        ]);

        const teacher = profileRes.data?.data;
        const tempSubjects: any[] = [];

        if (teacher) {
          setTeacherName(teacher.user?.fullName || '');
          if (teacher.primarySubject) {
            tempSubjects.push(teacher.primarySubject);
          }
          if (Array.isArray(teacher.subjectAllocations)) {
            teacher.subjectAllocations.forEach((alloc: any) => {
              if (alloc.status === 'ACTIVE' && alloc.subject) {
                // Deduplicate by subject ID
                if (!tempSubjects.some(s => s.id === alloc.subject.id)) {
                  tempSubjects.push(alloc.subject);
                }
              }
            });
          }
        }

        const batchesData = batchRes.data?.data;
        const finalBatches = Array.isArray(batchesData) ? batchesData : Array.isArray(batchRes.data) ? batchRes.data : [];
        
        setSubjects(tempSubjects);
        setBatches(finalBatches);

        // Auto-select the first subject if available
        if (tempSubjects.length > 0) {
          setFormData(prev => ({ ...prev, subjectId: prev.subjectId || tempSubjects[0].id }));
        }
      } catch (err) {
        console.error('Failed to load subjects/batches', err);
      } finally {
        setIsLoadingProfile(false);
      }
    };
    fetchMetadata();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (!formData.examTitle || !formData.subjectId || !formData.examDate) {
      toast.error('Please fill out required fields');
      return;
    }
    // format dates appropriately before passing
    onNext({
      ...formData,
      totalMarks: Number(formData.totalMarks),
      duration: formData.duration ? Number(formData.duration) : undefined,
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Step 1: Basic Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Exam Title *</label>
          <input
            type="text"
            name="examTitle"
            required
            className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700"
            placeholder="e.g. Midterm Physics Exam"
            value={formData.examTitle || ''}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Subject *</label>
          {isLoadingProfile ? (
            <div className="animate-pulse h-11 w-full bg-slate-100 dark:bg-slate-800 rounded-lg" />
          ) : subjects.length === 0 ? (
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-lg p-3 text-amber-700 dark:text-amber-300 text-xs font-semibold">
              ⚠️ No subject assigned. Contact Admin.
            </div>
          ) : subjects.length === 1 ? (
            <input
              type="text"
              readOnly
              disabled
              className="w-full rounded-lg border border-slate-200 p-3 text-sm bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-slate-500 font-semibold cursor-not-allowed"
              value={subjects[0].subjectName || subjects[0].name}
            />
          ) : (
            <select
              name="subjectId"
              required
              className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-200"
              value={formData.subjectId || ''}
              onChange={handleChange}
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.subjectName || s.name}</option>
              ))}
            </select>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Batch (Optional)</label>
          <select
            name="batchId"
            className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700"
            value={formData.batchId || ''}
            onChange={handleChange}
          >
            <option value="">All Batches</option>
            {batches.map(b => (
              <option key={b.id} value={b.id}>{b.batchName || b.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Exam Type *</label>
          <select
            name="examType"
            className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700"
            value={formData.examType}
            onChange={handleChange}
          >
            <option value="QUIZ">Quiz</option>
            <option value="ASSIGNMENT">Assignment</option>
            <option value="MIDTERM">Midterm</option>
            <option value="FINAL">Final</option>
            <option value="MOCK">Mock Exam</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Total Marks *</label>
          <input
            type="number"
            name="totalMarks"
            required
            min="1"
            className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700"
            value={formData.totalMarks}
            onChange={handleChange}
          />
        </div>
      </div>

      <hr className="border-slate-100 dark:border-slate-800" />

      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Step 2: Schedule & Timing</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Exam Date *</label>
          <input
            type="date"
            name="examDate"
            required
            className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700"
            value={formData.examDate || ''}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Start Time</label>
          <input
            type="datetime-local"
            name="startTime"
            className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700"
            value={formData.startTime || ''}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Duration (Minutes)</label>
          <input
            type="number"
            name="duration"
            min="1"
            className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700"
            value={formData.duration || ''}
            onChange={handleChange}
            placeholder="e.g. 60"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleNext} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          Continue to Questions
        </Button>
      </div>
    </div>
  );
};
