import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { manualExamApi, ManualExam, StudentForManualExam } from '../services/manual-exam.api';

export const EnterMarks: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const examId = params.id as string;
  
  const [exam, setExam] = useState<ManualExam | null>(null);
  const [students, setStudents] = useState<StudentForManualExam[]>([]);
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [attendance, setAttendance] = useState<Record<string, boolean>>({}); // true = absent, false = present
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (examId) {
      fetchExamAndStudents();
    }
  }, [examId]);

  const fetchExamAndStudents = async () => {
    try {
      setLoading(true);
      const [examData, studentsData] = await Promise.all([
        manualExamApi.getManualExamById(examId),
        manualExamApi.getStudentsForManualExam(examId),
      ]);
      
      setExam(examData);
      setStudents(studentsData);
      
      // Initialize marks and attendance state
      const initialMarks: Record<string, string> = {};
      const initialAttendance: Record<string, boolean> = {};
      studentsData.forEach(student => {
        initialMarks[student.id] = student.marksObtained !== null ? String(student.marksObtained) : '';
        initialAttendance[student.id] = student.isAbsent || false;
      });
      setMarks(initialMarks);
      setAttendance(initialAttendance);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load exam details');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleMarkChange = (studentId: string, value: string) => {
    if (attendance[studentId]) return; // Cannot edit if absent
    // Only allow numbers or empty string
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      if (value !== '' && exam && Number(value) > exam.totalMarks) {
        return; // Don't allow values greater than total marks
      }
      setMarks(prev => ({ ...prev, [studentId]: value }));
    }
  };

  const toggleAttendance = (studentId: string) => {
    setAttendance(prev => {
      const isNowAbsent = !prev[studentId];
      if (isNowAbsent) {
        // Clear marks if marked absent
        setMarks(m => ({ ...m, [studentId]: '' }));
      }
      return { ...prev, [studentId]: isNowAbsent };
    });
  };

  const handleSaveMarks = async () => {
    if (!exam) return;
    
    // Prepare payload
    const payload = {
      marks: students.map(student => {
        const studentId = student.id;
        const isAbsent = attendance[studentId];
        const markVal = marks[studentId];
        return {
          studentId,
          isAbsent,
          marksObtained: isAbsent ? undefined : (markVal !== '' ? Number(markVal) : undefined)
        };
      }).filter(m => m.isAbsent || m.marksObtained !== undefined)
    };
    
    if (payload.marks.length === 0) {
      return alert('Please enter at least one mark before saving.');
    }
    
    try {
      setSaving(true);
      await manualExamApi.saveMarks(examId, payload);
      alert('Marks saved successfully!');
      router.back();
    } catch (error: any) {
      console.error('Error saving marks:', error);
      alert(error.response?.data?.message || 'Failed to save marks');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Enter Marks</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {exam?.examTitle} • {exam?.batch.batchName}
            </p>
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-lg text-sm font-medium border border-blue-100 dark:border-blue-800">
          Total Marks: {exam?.totalMarks}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Student Name
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Index / Reg No
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Attendance
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Marks Obtained
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    No students found in this batch.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">{student.fullName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {student.indexNumber || student.nic || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleAttendance(student.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                          !attendance[student.id] ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        title={!attendance[student.id] ? 'Present' : 'Absent'}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            !attendance[student.id] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <span className={`ml-3 text-sm font-medium ${!attendance[student.id] ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {!attendance[student.id] ? 'Present' : 'Absent'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative max-w-[150px]">
                        <input
                          type="text"
                          value={attendance[student.id] ? '' : marks[student.id]}
                          onChange={(e) => handleMarkChange(student.id, e.target.value)}
                          disabled={attendance[student.id]}
                          className={`block w-full rounded-lg border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                            attendance[student.id] 
                              ? 'bg-gray-100 ring-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:ring-gray-700' 
                              : marks[student.id] !== '' && Number(marks[student.id]) > (exam?.totalMarks || 0) 
                                ? 'ring-red-300 focus:ring-red-500' 
                                : 'ring-gray-300 focus:ring-blue-600'
                          } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-white dark:ring-gray-600 transition-all`}
                          placeholder={attendance[student.id] ? 'Absent' : `/ ${exam?.totalMarks}`}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {students.length > 0 && (
          <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex justify-end">
            <button
              onClick={handleSaveMarks}
              disabled={saving}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Save className="h-5 w-5 mr-2" />
              )}
              {saving ? 'Saving Marks...' : 'Save All Marks'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
