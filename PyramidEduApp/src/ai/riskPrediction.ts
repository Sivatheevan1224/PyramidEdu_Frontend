export function predictRisk(attendanceRate: number) {
  if (attendanceRate >= 0.9) return "low";
  if (attendanceRate >= 0.75) return "medium";
  return "high";
}