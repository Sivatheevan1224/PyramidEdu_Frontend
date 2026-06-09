export interface StudentSummary {
  studentId: string;
  studentName: string;
  indexNumber: string;
  mostRecentStatus: string;
  last7Days: string[];
}

export interface AttendanceRecord {
  id: string;
  date: string;
  time: string;
  subject: string;
  status: string;
  method: string;
}
