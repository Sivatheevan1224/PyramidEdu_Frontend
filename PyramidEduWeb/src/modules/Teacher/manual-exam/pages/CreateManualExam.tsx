import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { manualExamApi } from '../services/manual-exam.api';
import api from '@/lib/api';
import { toast } from 'sonner';

interface Batch {
  id: string;
  batchName: string;
}

export const CreateManualExam: React.FC = () => {
  const router = useRouter();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    examTitle: '',
    batchId: '',
    totalMarks: 100,
    examDate: '',
    duration: 120,
  });

  useEffect(() => {
    // Fetch batches assigned to the teacher
    const fetchBatches = async () => {
      try {
        const response = await api.get('/batches');
        if (response.data?.data) {
          setBatches(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching batches:', error);
      }
    };
    fetchBatches();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalMarks' || name === 'duration' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.batchId) {
      toast.error('Please select a batch');
      return;
    }
    
    try {
      setLoading(true);
      await manualExamApi.createManualExam(formData);
      toast.success('Manual exam created successfully!');
      router.push('/teacher/manual-exams');
    } catch (error: any) {
      console.error('Error creating exam:', error);
      toast.error(error.response?.data?.message || 'Failed to create manual exam');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Manual Exam</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Add a new physical exam for entering marks</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="examTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Exam Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="examTitle"
                name="examTitle"
                required
                value={formData.examTitle}
                onChange={handleChange}
                className="block w-full rounded-xl border-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:focus:ring-blue-500 transition-all"
                placeholder="e.g. Mid Term Physical Exam 2026"
              />
            </div>

            <div>
              <label htmlFor="batchId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Batch <span className="text-red-500">*</span>
              </label>
              <select
                id="batchId"
                name="batchId"
                required
                value={formData.batchId}
                onChange={handleChange}
                className="block w-full rounded-xl border-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:focus:ring-blue-500 transition-all"
              >
                <option value="">Select a batch</option>
                {batches.map((batch) => (
                  <option key={batch.id} value={batch.id}>
                    {batch.batchName}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="totalMarks" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Total Marks <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="totalMarks"
                  name="totalMarks"
                  min="1"
                  required
                  value={formData.totalMarks}
                  onChange={handleChange}
                  className="block w-full rounded-xl border-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:focus:ring-blue-500 transition-all"
                />
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  min="1"
                  value={formData.duration}
                  onChange={handleChange}
                  className="block w-full rounded-xl border-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="examDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Exam Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="examDate"
                name="examDate"
                required
                value={formData.examDate}
                onChange={handleChange}
                className="block w-full rounded-xl border-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2.5 mr-3 text-sm font-medium text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Save className="h-5 w-5 mr-2" />
              )}
              {loading ? 'Creating...' : 'Create Exam'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
