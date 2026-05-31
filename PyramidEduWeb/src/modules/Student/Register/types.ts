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
  email: string;
  password: string;
  confirmPassword: string;
  indexNumber: string;
  parentName: string;
  parentRelation: string;
  parentEmail: string;
  parentPhone: string;
  selectedStreamId: string;
  selectedCourseIds: string[];
  selectedTeacherIds: Record<string, string>;
  paymentMethod: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  cardName: string;
  receiptAccepted: boolean;
};

