export interface WeeklyAttendanceDay {
  date: string;
  status: "present" | "absent";
  percentage: number;
}

export interface SubjectAttendance {
  subject: string;
  percentage: number;
}
