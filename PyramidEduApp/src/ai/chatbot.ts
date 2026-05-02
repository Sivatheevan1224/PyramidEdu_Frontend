export function chatbotReply(message: string) {
  const normalizedMessage = message.trim().toLowerCase();

  if (normalizedMessage.includes("attendance")) {
    return "Your attendance is available in the Attendance section.";
  }

  return "I can help with timetable, fees, materials, and recommendations.";
}