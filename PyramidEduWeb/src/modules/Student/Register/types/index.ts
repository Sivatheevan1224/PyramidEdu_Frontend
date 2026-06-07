// All types for the Student Registration module

export type TeacherOption = {
  id: string;
  name: string;
  qualification: string;
};

export type CourseOption = {
  id: string;
  name: string;
  monthlyFee: number;
  description: string;
  streamNames?: string[];
  teachers: TeacherOption[];
};

export type StreamOption = {
  id: string;
  name: string;
  courses: CourseOption[];
};

export type RegisterFormValues = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  alExamBatch: string;
  gender: string;
  phone: string;
  address: string;
  school: string;
  email: string;
  password: string;
  confirmPassword: string;
  nic: string;
  parentName: string;
  parentRelation: string;
  parentEmail: string;
  parentPhone: string;
  selectedStreamId: string;
  selectedCourseIds: string[];
  selectedTeacherIds: Record<string, string>; // subjectId -> teacherId
};

export type TeacherApiItem = {
  id: string | number;
  name?: string;
  qualification?: string;
  firstName?: string;
  lastName?: string;
  specialization?: string;
  isActive?: boolean;
  user?: {
    fullName?: string;
    isActive?: boolean;
  };
};

export type InitiateRegistrationPayload = Omit<RegisterFormValues, 'confirmPassword'>;

export type VerifyOtpPayload = {
  email: string;
  otpCode: string;
};

export type RegisterSuccessState = {
  status: 'physical_pending' | null;
  regNumber: string;
};
