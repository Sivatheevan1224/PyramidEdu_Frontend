export interface StudentSummary {
  studentId: string;
  studentName: string;
  indexNumber: string;
  mostRecentStatus: string;
  last7Days: string[];
}

export interface SubjectInfo {
  subjectName: string;
  teacherName: string;
}

export interface StudentInfo {
  studentName: string;
  indexNumber: string;
  subjects: SubjectInfo[];
}

export interface AttendanceRecord {
  id: string;
  date: string;
  time: string;
  subject: string;
  teacher: string;
  status: string;
  method: string;
}
