import { BASE_API_URL } from "../../../api/config";

export const fetchMyAttendance = async (accessToken: string) => {
  const response = await fetch(`${BASE_API_URL}/attendance/student/my-attendance`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const json = await response.json();
  if (json.success && json.data) {
    return json.data;
  }
  throw new Error(json.message || "Failed to load attendance details");
};
