export interface AttendanceRecord {
  id: string;
  date: string;
  time: string;
  subject: string;
  teacher: string;
  status: "PRESENT" | "ABSENT";
  method: string;
}
