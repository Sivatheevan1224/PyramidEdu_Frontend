export interface DashboardOverviewStats {
  totalRevenue: number;
  totalAmountCollected: number;
  totalOutstandingAmount: number;
  totalPendingPayments: number;
  totalVerifiedPayments: number;
  totalRejectedPayments: number;
  totalRefundedPayments: number;
  totalStudentsPendingFees: number;
  totalStudentsOverdueFees: number;
  monthlyRevenue: number;
  todayCollections: number;
}

export interface MonthlyRevenueTrendItem {
  month: string;
  revenue: number;
}

export interface DailyCollectionTrendItem {
  date: string;
  amount: number;
}

export interface PaymentStatusDistributionItem {
  status: string;
  count: number;
  amount: number;
}

export interface PaymentMethodDistributionItem {
  method: string;
  count: number;
  amount: number;
}

export interface FeeCollectionProgressData {
  totalGenerated: number;
  totalCollected: number;
  totalOutstanding: number;
  collectionPercentage: number;
}

export interface MonthlyOutstandingItem {
  month: string;
  outstanding: number;
}

export interface RevenueBySubjectItem {
  subjectName: string;
  subjectCode: string;
  revenue: number;
}

export interface RevenueByBatchItem {
  batchName: string;
  revenue: number;
}

export interface AnalyticsData {
  monthlyRevenueTrend: MonthlyRevenueTrendItem[];
  dailyCollectionTrend: DailyCollectionTrendItem[];
  paymentStatusDistribution: PaymentStatusDistributionItem[];
  paymentMethodDistribution: PaymentMethodDistributionItem[];
  feeCollectionProgress: FeeCollectionProgressData;
  monthlyOutstandingAmount: MonthlyOutstandingItem[];
  revenueBySubject: RevenueBySubjectItem[];
  revenueByBatch: RevenueByBatchItem[];
}

export interface PaymentItem {
  id: string;
  studentId: string;
  studentName: string;
  indexNumber: string;
  email: string;
  subject: string;
  batch: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'REFUNDED';
  invoiceNumber: string;
  paymentDate: string;
  verifiedBy: string;
  verifiedAt: string | null;
  feeMonth: string | null;
}

export interface RecentPaymentItem {
  id: string;
  studentName: string;
  indexNumber: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  invoiceNumber: string;
  paymentDate: string;
}

export interface UpcomingDueItem {
  feeId: string;
  studentName: string;
  indexNumber: string;
  amountDue: number;
  monthYear: string;
  dueDate: string;
  status: string;
}

export interface OverdueStudentItem {
  studentId: string;
  studentName: string;
  indexNumber: string;
  batch: string;
  amountDue: number;
  monthYear: string;
  dueDate: string;
}

export interface FeeOverviewData {
  totalFeesGenerated: number;
  totalFeesCollected: number;
  outstandingFees: number;
  overdueFees: number;
  paidFeesCount: number;
  unpaidFeesCount: number;
  partialPaymentsCount: number;
  overdueFeesCount: number;
  recentPayments: RecentPaymentItem[];
  upcomingDuePayments: UpcomingDueItem[];
  overdueStudents: OverdueStudentItem[];
}

export interface StudentSummaryItem {
  studentId: string;
  userId: string;
  studentName: string;
  indexNumber: string;
  email: string;
  batchName: string;
  totalFee: number;
  totalPaid: number;
  remainingBalance: number;
  paymentStatus: 'PAID' | 'UNPAID' | 'PARTIAL' | 'OVERDUE';
  lastPaymentDate: string | null;
  dueDate: string | null;
}

export interface PaymentDetailsData {
  studentInfo: {
    id: string;
    name: string;
    indexNumber: string;
    email: string;
    phone: string;
    batch: string;
    stream: string;
    profileImage?: string | null;
  };
  feeInfo: {
    id: string | null;
    monthYear: string;
    totalAmount: number;
    paidAmount: number;
    outstanding: number;
    status: string;
    dueDate: string | null;
  };
  paymentInfo: {
    id: string;
    amount: number;
    paymentMethod: string;
    paymentStatus: string;
    invoiceNumber: string;
    paymentDate: string;
  };
  verificationInfo: {
    verifiedBy: string | null;
    verifiedAt: string | null;
  };
  paymentHistory: {
    id: string;
    amount: number;
    paymentMethod: string;
    paymentStatus: string;
    invoiceNumber: string;
    paymentDate: string;
  }[];
}

export interface PaymentFiltersState {
  search: string;
  paymentStatus: string;
  paymentMethod: string;
  subjectId: string;
  batchId: string;
  startDate: string;
  endDate: string;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface StudentSummaryFiltersState {
  search: string;
  batchId: string;
  subjectId: string;
  status: string;
  page: number;
  limit: number;
}
