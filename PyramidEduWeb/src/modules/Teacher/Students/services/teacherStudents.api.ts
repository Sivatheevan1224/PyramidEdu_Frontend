import api from '@/lib/api';

export interface TeacherStudent {
  id: string;
  fullName: string;
  email: string;
  profileImage?: string;
  indexNumber?: string;
  phone?: string;
  batch: string;
  attendancePercentage: number;
  isActive: boolean;
  subjects: string[];
}

export interface TeacherStudentDetails {
  student: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    profileImage?: string;
    indexNumber?: string;
    gender?: string;
    address?: string;
    school?: string;
    dateOfBirth?: string;
    batch: string;
    stream: string;
    enrollmentStatus: string;
    isActive: boolean;
    enrollments: Array<{
      subjectName: string;
      subjectCode: string;
      teacherName: string;
      feeAmount: number;
      status: string;
    }>;
    parent: {
      name: string;
      relation: string;
      phone: string;
      email: string;
    } | null;
  };
  attendanceSummary: {
    present: number;
    absent: number;
    late: number;
    excused: number;
    total: number;
  };
  academicPerformance: Array<{
    id: string;
    title: string;
    type: string;
    marks: number;
    grade?: string;
    feedback?: string;
    recordedAt: string;
    teacherName: string;
  }>;
}

export const fetchMyStudents = async (params: { page: number; limit: number; search?: string }) => {
  const { data } = await api.get('/teachers/me/students', { params });
  return data;
};

export const fetchMyStudentDetails = async (studentId: string): Promise<TeacherStudentDetails> => {
  const { data } = await api.get(`/teachers/me/students/${studentId}`);
  return data.data;
};
