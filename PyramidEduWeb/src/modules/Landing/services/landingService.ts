import api from "@/lib/api";
import emailjs from "@emailjs/browser";
import {
  fetchBatches as apiFetchBatches,
  fetchStreams as apiFetchStreams,
  fetchSubjects as apiFetchSubjects,
  fetchTeachersForSubject as apiFetchTeachersForSubject,
} from "@/modules/Student/Register/services/registerApi";

// Re-export register API methods used by the TeachersSection
export const fetchBatches = apiFetchBatches;
export const fetchStreams = apiFetchStreams;
export const fetchSubjects = apiFetchSubjects;
export const fetchTeachersForSubject = apiFetchTeachersForSubject;

// EmailJS constants
export const EMAILJS_SERVICE_ID = "service_y6q77rp";
export const EMAILJS_TEMPLATE_ID = "template_9hp1lcg";
export const EMAILJS_PUBLIC_KEY = "6HRNkeja1FYzkws4k";
export const INSTITUTE_EMAIL = "pyramideducation06@gmail.com";

export interface ContactMessagePayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  formattedMessage: string;
}

export async function sendContactMessage(payload: ContactMessagePayload) {
  return emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    {
      name: payload.name,
      mail: payload.email,
      email: payload.email,
      subject: payload.subject,
      message: payload.formattedMessage,
      raw_message: payload.message,
      reply_to: payload.email,
      to_email: INSTITUTE_EMAIL,
      email_title: `New contact message from ${payload.name}`,
      email_summary: payload.formattedMessage,
      formatted_message: payload.formattedMessage,
    },
    {
      publicKey: EMAILJS_PUBLIC_KEY,
    }
  );
}
