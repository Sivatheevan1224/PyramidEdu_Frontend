export interface SalaryOverviewStats {
  totalMonthlySalaryExpense: number;
  totalSalariesPaid: number;
  totalPendingSalaries: number;
  totalOverdueSalaries: number;
  totalTeacherSalaries: number;
  totalManagerSalaries: number;
  totalSupportStaffSalaries: number;
  totalAllowances: number;
  totalDeductions: number;
  currentMonthPayroll: number;
  previousMonthPayroll: number;
  todaySalaryPayments: number;
  numberPaidEmployees: number;
  numberUnpaidEmployees: number;
  numberActiveEmployees: number;
}

export interface SalaryAnalyticsData {
  monthlySalaryExpenseTrend: { month: string; expense: number }[];
  salaryExpenseByRole: { role: string; amount: number }[];
  paidVsPendingDistribution: { status: string; count: number; amount: number }[];
  salaryExpenseByDepartment: { department: string; amount: number }[];
  monthlyAllowanceTrend: { month: string; amount: number }[];
  monthlyDeductionTrend: { month: string; amount: number }[];
  netSalaryTrend: { month: string; netSalary: number }[];
  payrollCompletionProgress: {
    totalGenerated: number;
    totalPaid: number;
    completionPercentage: number;
  };
  salaryPaymentMethodDistribution: { method: string; count: number; amount: number }[];
}

export interface EmployeeSalaryItem {
  employeeId: string;
  userId?: string | null;
  employeeName: string;
  email: string;
  phone: string;
  nic: string;
  employeeRole: 'TEACHER' | 'MANAGER' | 'SUPPORT_STAFF';
  department: string;
  position: string;
  staffCode: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  grossSalary: number;
  netSalary: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: 'PENDING' | 'PROCESSING' | 'PAID' | 'PARTIALLY_PAID' | 'OVERDUE' | 'FAILED' | 'CANCELLED';
  paymentMethod?: string | null;
  paymentDate?: string | null;
  referenceNumber?: string | null;
  processedBy?: string | null;
  joiningDate?: string | null;
  isActive: boolean;
  recordId?: string | null;
  primarySubject?: string;
}

export interface EmployeeSalaryFilters {
  search?: string;
  role?: string;
  department?: string;
  status?: string;
  paymentMethod?: string;
  salaryMonth?: string;
  activeOnly?: boolean;
  page?: number;
  limit?: number;
}

export interface AllowanceItem {
  id: string;
  title: string;
  type: string;
  amount: number;
  percentage?: number | null;
  targetRole?: string | null;
  employeeId?: string | null;
  isRecurring: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface DeductionItem {
  id: string;
  title: string;
  type: string;
  amount: number;
  percentage?: number | null;
  targetRole?: string | null;
  employeeId?: string | null;
  isRecurring: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface PayslipData {
  instituteName: string;
  payslipId: string;
  employeeName: string;
  staffCode: string;
  employeeRole: string;
  department: string;
  salaryMonth: string;
  basicSalary: number;
  totalAllowances: number;
  totalDeductions: number;
  grossSalary: number;
  netSalary: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  paymentDate: string;
  referenceNumber: string;
  allowanceBreakdown: { title: string; amount: number }[];
  deductionBreakdown: { title: string; amount: number }[];
  generatedDate: string;
}
