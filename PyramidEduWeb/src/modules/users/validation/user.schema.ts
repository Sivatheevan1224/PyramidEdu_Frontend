/**
 * User Validation Schema - Zod validation rules
 */

import { z } from 'zod';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Base field schemas
const baseFieldsSchema = {
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .regex(emailRegex, 'Invalid email format'),

  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .regex(phoneRegex, 'Phone number must be at least 10 digits'),

  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(
      passwordRegex,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),

  confirmPassword: z.string().min(1, 'Please confirm your password'),

};

// ==================== MANAGER SCHEMA ====================
export const addManagerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name must be at most 100 characters')
      .regex(/^[a-zA-Z\s-]+$/, 'Full name can only contain letters, spaces, and hyphens'),

    department: z
      .string()
      .min(2, 'Department must be at least 2 characters')
      .max(50, 'Department must be at most 50 characters'),

    ...baseFieldsSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type AddManagerInput = z.infer<typeof addManagerSchema>;

// ==================== TEACHER SCHEMA ====================
export const addTeacherSchema = z
  .object({
    firstName: z
      .string()
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name must be at most 50 characters')
      .regex(/^[a-zA-Z\s-]+$/, 'First name can only contain letters, spaces, and hyphens'),

    lastName: z
      .string()
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name must be at most 50 characters')
      .regex(/^[a-zA-Z\s-]+$/, 'Last name can only contain letters, spaces, and hyphens'),

    nicNumber: z
      .string()
      .min(10, 'NIC number must be at least 10 characters')
      .max(20, 'NIC number must be at most 20 characters'),

    gender: z.enum(['MALE', 'FEMALE', 'OTHER']),

    address: z
      .string()
      .min(5, 'Address must be at least 5 characters')
      .max(200, 'Address must be at most 200 characters'),

    subject: z
      .string()
      .min(2, 'Subject specialization is required')
      .max(50, 'Subject must be at most 50 characters'),

    salary: z
      .number()
      .min(0, 'Salary must be a positive number')
      .optional(),

    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address')
      .regex(emailRegex, 'Invalid email format'),

    phoneNumber: z
      .string()
      .min(1, 'Phone number is required')
      .regex(phoneRegex, 'Phone number must be at least 10 digits'),
  });

export type AddTeacherInput = z.infer<typeof addTeacherSchema>;

// ==================== SUPPORT STAFF SCHEMA ====================
export const addSupportStaffSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name must be at most 100 characters')
      .regex(/^[a-zA-Z\s-]+$/, 'Full name can only contain letters, spaces, and hyphens'),

    roleType: z
      .string()
      .min(2, 'Role type is required')
      .max(50, 'Role type must be at most 50 characters'),

    salary: z
      .number()
      .min(0, 'Salary must be a positive number')
      .optional(),

    ...baseFieldsSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type AddSupportStaffInput = z.infer<typeof addSupportStaffSchema>;

// ==================== STUDENT SCHEMA ====================
export const addStudentSchema = z
  .object({
    firstName: z
      .string()
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name must be at most 50 characters')
      .regex(/^[a-zA-Z\s-]+$/, 'First name can only contain letters, spaces, and hyphens'),

    lastName: z
      .string()
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name must be at most 50 characters')
      .regex(/^[a-zA-Z\s-]+$/, 'Last name can only contain letters, spaces, and hyphens'),

    indexNumber: z
      .string()
      .min(1, 'Index number is required')
      .max(50, 'Index number must be at most 50 characters'),

    parentName: z
      .string()
      .min(2, 'Parent name must be at least 2 characters')
      .max(100, 'Parent name must be at most 100 characters')
      .regex(/^[a-zA-Z\s-]+$/, 'Parent name can only contain letters, spaces, and hyphens'),

    parentPhone: z
      .string()
      .min(1, 'Parent phone is required')
      .regex(phoneRegex, 'Parent phone must be at least 10 digits'),

    address: z
      .string()
      .min(5, 'Address must be at least 5 characters')
      .max(200, 'Address must be at most 200 characters'),

    ...baseFieldsSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type AddStudentInput = z.infer<typeof addStudentSchema>;

// ==================== GENERIC SCHEMAS ====================
export const createUserSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be at most 50 characters')
    .regex(/^[a-zA-Z\s-]+$/, 'First name can only contain letters, spaces, and hyphens'),

  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be at most 50 characters')
    .regex(/^[a-zA-Z\s-]+$/, 'Last name can only contain letters, spaces, and hyphens'),

  email: z
    .string()
    .email('Please enter a valid email address')
    .regex(emailRegex, 'Invalid email format'),

  phoneNumber: z
    .string()
    .regex(phoneRegex, 'Phone number must be at least 10 digits'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      passwordRegex,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),

  confirmPassword: z.string(),

  role: z.enum(['MANAGER', 'TEACHER', 'STUDENT', 'SUPPORT_STAFF']),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const updateUserSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be at most 50 characters')
    .regex(/^[a-zA-Z\s-]+$/, 'First name can only contain letters, spaces, and hyphens')
    .optional(),

  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be at most 50 characters')
    .regex(/^[a-zA-Z\s-]+$/, 'Last name can only contain letters, spaces, and hyphens')
    .optional(),

  email: z
    .string()
    .email('Please enter a valid email address')
    .regex(emailRegex, 'Invalid email format')
    .optional(),

  phoneNumber: z
    .string()
    .regex(phoneRegex, 'Phone number must be at least 10 digits')
    .optional(),

  role: z.enum(['MANAGER', 'TEACHER', 'STUDENT', 'SUPPORT_STAFF']).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
