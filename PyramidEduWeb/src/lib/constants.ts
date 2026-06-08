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
  mapUrl: process.env.NEXT_PUBLIC_MAP_EMBED_URL || "https://www.google.com/maps/embed/v1/place?key=REDACTED_GOOGLE_API_KEY&q=9.693380,80.057175&zoom=17",
  streetViewUrl: process.env.NEXT_PUBLIC_STREET_VIEW_URL || "https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=9.693380,80.057175",
} as const;
