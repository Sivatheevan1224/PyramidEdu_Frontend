import { toast } from "sonner";
import { MIN_SUBJECTS, MAX_SUBJECTS } from "../constants";
import type { RegisterFormValues } from "../types";

export function validateStep1(values: RegisterFormValues): boolean {
  const required = [
    values.firstName,
    values.lastName,
    values.dateOfBirth,
    values.alExamBatch,
    values.gender,
    values.phone,
    values.address,
    values.parentName,
    values.parentRelation,
    values.parentEmail,
    values.parentPhone,
    values.school,
  ];
  if (required.some((v) => !v)) {
    toast.error("Please fill in all required common details.");
    return false;
  }

  // Validate Age (16+)
  const dob = new Date(values.dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  if (age < 16) {
    toast.error("Student must be at least 16 years old to join.");
    return false;
  }

  // Validate Phone format (exactly 10 digits)
  if (!/^\d{10}$/.test(values.phone)) {
    toast.error("Student phone number must be exactly 10 digits.");
    return false;
  }

  if (values.parentPhone && !/^\d{10}$/.test(values.parentPhone)) {
    toast.error("Parent phone number must be exactly 10 digits.");
    return false;
  }

  return true;
}

export function validateStep2(values: RegisterFormValues): boolean {
  if (!values.selectedStreamId) {
    toast.error("Please select an academic stream.");
    return false;
  }
  if (values.selectedCourseIds.length < MIN_SUBJECTS) {
    toast.error(`Please select at least ${MIN_SUBJECTS} subject.`);
    return false;
  }
  if (values.selectedCourseIds.length > MAX_SUBJECTS) {
    toast.error(`Please select no more than ${MAX_SUBJECTS} subjects.`);
    return false;
  }
  if (values.selectedCourseIds.some((id) => !values.selectedTeacherIds[id])) {
    toast.error("Please select a teacher for each selected subject.");
    return false;
  }
  return true;
}

export function validateStep3(values: RegisterFormValues): boolean {
  if (!values.email || !values.password || !values.confirmPassword) {
    toast.error("Please fill in all login credential fields.");
    return false;
  }
  if (!values.email.includes("@")) {
    toast.error("Please enter a valid email address.");
    return false;
  }
  if (values.password.length < 8) {
    toast.error("Password must be at least 8 characters.");
    return false;
  }
  if (values.password !== values.confirmPassword) {
    toast.error("Passwords do not match.");
    return false;
  }
  return true;
}
