// Validation rules for Notes Module
import { z } from "zod";

export const noteUploadSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subjectId: z.string().uuid("Invalid subject ID"),
  batchId: z.string().uuid("Invalid batch ID"),
  description: z.string().optional(),
});
