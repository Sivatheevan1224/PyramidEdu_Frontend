import { WeeklyAttendanceDay, SubjectAttendance } from "../types/attendance.types";

export const DEFAULT_WEEKLY_ATTENDANCE: WeeklyAttendanceDay[] = [
  { date: "Mon", status: "present", percentage: 95 },
  { date: "Tue", status: "present", percentage: 92 },
  { date: "Wed", status: "absent", percentage: 85 },
  { date: "Thu", status: "present", percentage: 88 },
  { date: "Fri", status: "present", percentage: 91 },
];

export const DEFAULT_SUBJECT_ATTENDANCE: SubjectAttendance[] = [
  { subject: "Mathematics", percentage: 92 },
  { subject: "Physics", percentage: 68 },
  { subject: "Chemistry", percentage: 85 },
  { subject: "English", percentage: 94 },
];
