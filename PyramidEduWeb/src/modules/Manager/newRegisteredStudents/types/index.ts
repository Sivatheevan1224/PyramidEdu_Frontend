export interface RegisteredStudent {
  id: string;
  studentName: string;
  indexNumber: string | null;
  email: string;
  stream: string;
  qrCode: string | null;
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
  school: string | null;
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
  fees: {
    id: string;
    monthYear: string;
    total: number;
    paid: number;
    status: string;
    payments: {
      id: string;
      amount: number;
      paymentDate: string;
      paymentStatus: string;
      paymentMethod: string;
    }[];
  }[];
  enrollmentHistories: {
    id: string;
    previousStream: string | null;
    previousSubjects: any;
    previousMonthlyFee: number;
    newStream: string | null;
    newSubjects: any;
    newMonthlyFee: number;
    effectiveDate: string;
    changedAt: string;
    changedBy: {
      fullName: string;
    };
  }[];
}
