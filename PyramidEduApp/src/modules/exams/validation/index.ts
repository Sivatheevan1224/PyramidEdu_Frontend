import { MAX_ESSAY_FILE_SIZE } from "../constants";

export function validateEssayPDF(
  fileSize: number,
  fileName: string
): { isValid: boolean; error: string | null } {
  if (!fileName.toLowerCase().endsWith(".pdf")) {
    return {
      isValid: false,
      error: "Only PDF documents are allowed.",
    };
  }

  if (fileSize > MAX_ESSAY_FILE_SIZE) {
    return {
      isValid: false,
      error: "File size exceeds the 20MB limit.",
    };
  }

  return {
    isValid: true,
    error: null,
  };
}
