
export const GENDER_OPTIONS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
] as const;

export const RELATION_OPTIONS = [
  { value: "father", label: "Father" },
  { value: "mother", label: "Mother" },
  { value: "guardian", label: "Legal Guardian" },
  { value: "other", label: "Other" },
] as const;

export const REGISTER_STEPS = [
  "Common Details",
  "Academic & Course",
  "Login Credentials",
  "OTP Verification",
] as const;

export const MAX_SUBJECTS = 3;
export const MIN_SUBJECTS = 1;
