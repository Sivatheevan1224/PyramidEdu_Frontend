export interface AnnouncementSender {
  fullName: string;
  role: string;
}

export interface AnnouncementBatch {
  id: string;
  batchName: string;
}

export interface AnnouncementSubject {
  id: string;
  subjectName: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  publishDate: string;
  expiryDate?: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  attachmentUrl?: string | null;
  sender?: AnnouncementSender;
  batches?: AnnouncementBatch[];
  subjects?: AnnouncementSubject[];
}
