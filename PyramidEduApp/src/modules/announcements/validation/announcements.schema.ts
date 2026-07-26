import { z } from 'zod';

export const AnnouncementSenderSchema = z.object({
  fullName: z.string(),
  role: z.string(),
});

export const AnnouncementBatchSchema = z.object({
  id: z.string().uuid(),
  batchName: z.string(),
});

export const AnnouncementSubjectSchema = z.object({
  id: z.string().uuid(),
  subjectName: z.string(),
});

export const AnnouncementSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  content: z.string(),
  publishDate: z.string(),
  expiryDate: z.string().nullable().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  attachmentUrl: z.string().nullable().optional(),
  sender: AnnouncementSenderSchema.optional(),
  batches: z.array(AnnouncementBatchSchema).optional(),
  subjects: z.array(AnnouncementSubjectSchema).optional(),
});
