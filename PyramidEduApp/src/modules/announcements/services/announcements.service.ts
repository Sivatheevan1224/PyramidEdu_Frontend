import client from "../../../api/client";
import { Announcement } from "../types/announcements.types";

export const fetchReceivedAnnouncements = async (): Promise<Announcement[]> => {
  const response = await client.get("/announcements/received?limit=100");
  if (response.data && response.data.success && response.data.data && Array.isArray(response.data.data.data)) {
    return response.data.data.data;
  }
  throw new Error(response.data?.message || "Failed to load announcements feed");
};

export const fetchAnnouncementDetails = async (id: string): Promise<Announcement> => {
  const response = await client.get(`/announcements/${id}`);
  if (response.data && response.data.success && response.data.data) {
    return response.data.data;
  }
  throw new Error(response.data?.message || "Failed to load announcement details");
};
