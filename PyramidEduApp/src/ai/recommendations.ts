export function generateRecommendations(attendanceRate: number) {
  if (attendanceRate < 0.75) {
    return ["Review missed classes", "Book a mentor session"];
  }

  return ["Keep up the current pace", "Try the optional practice set"];
}