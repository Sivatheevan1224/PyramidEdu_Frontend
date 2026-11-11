import { toast } from "sonner";
import { MIN_SUBJECTS, MAX_SUBJECTS } from "../constants";
import type { RegisterFormValues } from "../types";

export const isValidSriLankanNIC = (nic?: string): boolean => {
  if (!nic || !nic.trim()) return true; // Optional, but if provided must be valid format
  const cleaned = nic.trim();
  return /^[0-9]{9}[VvXx]$/.test(cleaned) || /^[0-9]{12}$/.test(cleaned);
};

export const isValidSLPhone = (num?: string): boolean => {
  if (!num) return false;
  const sanitized = num.replace(/[\s()-]/g, '');
  return /^(?:0|(?:\+?94|0094))[0-9]{9}$/.test(sanitized);
};

export const isValidEmail = (email?: string): boolean => {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export function getStep1Errors(values: RegisterFormValues): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!values.firstName?.trim()) {
    errors.firstName = "First name is required.";
  }

  if (!values.lastName?.trim()) {
    errors.lastName = "Last name is required.";
  }

  if (!values.dateOfBirth) {
    errors.dateOfBirth = "Date of birth is required.";
  } else {
    const dob = new Date(values.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    if (age < 16) {
      errors.dateOfBirth = "Student must be at least 16 years old to join.";
    }
  }

  if (!values.batchId && !values.alExamBatch) {
    errors.batchId = "Please select an A/L Exam Batch.";
  }

  if (values.nic && values.nic.trim()) {
    if (!isValidSriLankanNIC(values.nic)) {
      errors.nic = "Invalid Sri Lankan NIC. Use 9 digits + V/X (e.g., 991234567V) or 12 digits (e.g., 200412345678).";
    }
  }

  if (!values.school?.trim()) {
    errors.school = "School is required.";
  }

  if (!values.gender) {
    errors.gender = "Please select a gender.";
  }

  if (!values.phone?.trim()) {
    errors.phone = "Phone number is required.";
  } else if (!isValidSLPhone(values.phone)) {
    errors.phone = "Enter a valid Sri Lankan phone number (e.g., 07XXXXXXXX or +947XXXXXXXX).";
  }

  if (!values.address?.trim()) {
    errors.address = "Residential address is required.";
  }

  if (!values.parentName?.trim()) {
    errors.parentName = "Guardian full name is required.";
  }

  if (!values.parentRelation) {
    errors.parentRelation = "Please select guardian relation.";
  }

  if (!values.parentEmail?.trim()) {
    errors.parentEmail = "Guardian email is required.";
  } else if (!isValidEmail(values.parentEmail)) {
    errors.parentEmail = "Please enter a valid email address.";
  }

  if (!values.parentPhone?.trim()) {
    errors.parentPhone = "Guardian phone is required.";
  } else if (!isValidSLPhone(values.parentPhone)) {
    errors.parentPhone = "Enter a valid Sri Lankan phone number (e.g., 07XXXXXXXX or +947XXXXXXXX).";
  }

  return errors;
}

export function validateStep1(values: RegisterFormValues): boolean {
  const errors = getStep1Errors(values);
  const errorKeys = Object.keys(errors);
  if (errorKeys.length > 0) {
    toast.error(errors[errorKeys[0]]);
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

export function getStep3Errors(values: RegisterFormValues): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!values.email?.trim()) {
    errors.email = "Email address is required.";
  } else if (!isValidEmail(values.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Confirm password is required.";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

export function validateStep3(values: RegisterFormValues): boolean {
  const errors = getStep3Errors(values);
  const errorKeys = Object.keys(errors);
  if (errorKeys.length > 0) {
    toast.error(errors[errorKeys[0]]);
    return false;
  }
  return true;
}
