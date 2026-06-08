/**
 * Centralized contact information for PyramidEdu.
 * Used by both the Contact Us section and the Footer to stay in sync.
 */

export const INSTITUTE_INFO = {
  name: "Pyramid Education Center",
  shortDescription: "Smart institute management with AI-powered student performance insights.",
  director: "S. Kajeepan",
  phone: "0774857896",
  email: "pyramideducation06@gmail.com",
  location: "Kopay South, Jaffna",
  fullAddress: "Pyramid Education Center, Kopay South, Jaffna, Sri Lanka.",
  mapUrl: process.env.NEXT_PUBLIC_MAP_EMBED_URL || "",
  streetViewUrl: process.env.NEXT_PUBLIC_STREET_VIEW_URL || "",
} as const;
