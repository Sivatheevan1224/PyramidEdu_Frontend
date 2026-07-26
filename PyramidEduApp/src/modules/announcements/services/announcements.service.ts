import { BASE_API_URL } from "../../../api/config";
import { Announcement } from "../types/announcements.types";

export const fetchReceivedAnnouncements = async (accessToken: string): Promise<Announcement[]> => {
  const response = await fetch(`${BASE_API_URL}/announcements/received?limit=100`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const json = await response.json();
  if (json.success && json.data && Array.isArray(json.data.data)) {
    return json.data.data;
  }
  throw new Error(json.message || "Failed to load announcements feed");
};

export const fetchAnnouncementDetails = async (accessToken: string, id: string): Promise<Announcement> => {
  const response = await fetch(`${BASE_API_URL}/announcements/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const json = await response.json();
  if (json.success && json.data) {
    return json.data;
  }
  throw new Error(json.message || "Failed to load announcement details");
};
