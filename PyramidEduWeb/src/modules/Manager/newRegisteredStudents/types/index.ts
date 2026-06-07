export interface RegisteredStudent {
  id: string;
  studentName: string;
  email: string;
  stream: string;
  totalFeeAmount: number;
  paymentStatus: "PENDING" | "PARTIAL" | "PAID";
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  registeredDate: string;
}

export interface StudentDetails {
  id: string;
  indexNumber: string | null;
  dateOfBirth: string | null;
  address: string | null;
  phone: string | null;
  gender: string | null;
  nic: string | null;
  batch: string | null;
  approvalStatus: string;
  paymentStatus: string;
  totalFeeAmount: number;
  createdAt: string;
  user: {
    fullName: string;
    email: string;
    isActive: boolean;
  };
  parent: {
    parentName: string;
    email: string | null;
    phone: string | null;
    relation: string | null;
  } | null;
  stream: {
    streamName: string;
  } | null;
  enrollments: {
    subject: {
      subjectName: string;
      feeAmount: number;
    };
    teacher: {
      user: {
        fullName: string;
      };
    } | null;
  }[];
}
