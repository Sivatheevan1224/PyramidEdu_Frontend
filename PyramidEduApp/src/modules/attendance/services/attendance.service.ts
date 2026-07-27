import client from "../../../api/client";

export const fetchMyAttendance = async () => {
  const response = await client.get("/attendance/student/my-attendance");
  if (response.data && response.data.success && response.data.data) {
    return response.data.data;
  }
  throw new Error(response.data?.message || "Failed to load attendance details");
};
