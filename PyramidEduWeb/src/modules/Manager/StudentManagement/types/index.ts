export interface ApprovedStudent {
  id: string;
  studentName: string;
  indexNumber: string | null;
  email: string;
  stream: string;
  qrCode: string | null;
  monthlyFeeStatus: "PAID" | "UNPAID" | "PARTIAL" | "OVERDUE";
  isActive: boolean;
}

export interface StudentFormData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  school: string;
  dateOfBirth: string;
  gender: string;
  parentName: string;
  parentPhone: string;
  parentOccupation: string;
  streamId: string;
  subjects: { subjectId: string; teacherId: string }[];
}
