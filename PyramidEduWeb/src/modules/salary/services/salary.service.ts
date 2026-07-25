import api from "@/lib/api";
import {
  SalaryOverviewStats,
  SalaryAnalyticsData,
  EmployeeSalaryItem,
  EmployeeSalaryFilters,
  AllowanceItem,
  DeductionItem,
  PayslipData,
} from "../types/salary.types";

export class SalaryService {
  static async getDashboardOverview(): Promise<SalaryOverviewStats> {
    const response = await api.get("/salary/dashboard-overview");
    return response.data.data;
  }

  static async getAnalytics(): Promise<SalaryAnalyticsData> {
    const response = await api.get("/salary/analytics");
    return response.data.data;
  }

  static async getEmployees(filters: EmployeeSalaryFilters): Promise<{
    items: EmployeeSalaryItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const response = await api.get("/salary/employees", { params: filters });
    return response.data.data;
  }

  static async generateMonthlyPayroll(salaryMonth?: string): Promise<any> {
    const response = await api.post("/salary/payrolls/generate", { salaryMonth });
    return response.data.data;
  }

  static async processPayment(
    recordId: string,
    payload: {
      amount: number;
      paymentMethod?: string;
      paymentDate?: string;
      referenceNumber?: string;
      bankReference?: string;
      notes?: string;
    }
  ): Promise<any> {
    const response = await api.patch(`/salary/records/${recordId}/process`, payload);
    return response.data.data;
  }

  static async updateBasicSalary(
    employeeId: string,
    payload: {
      role: string;
      newSalary: number;
      effectiveDate?: string;
      reason?: string;
    }
  ): Promise<any> {
    const response = await api.patch(`/salary/employees/${employeeId}/basic-salary`, payload);
    return response.data.data;
  }

  static async getAllowances(): Promise<AllowanceItem[]> {
    const response = await api.get("/salary/allowances");
    return response.data.data;
  }

  static async createAllowance(payload: {
    title: string;
    type?: string;
    amount?: number;
    percentage?: number;
    targetRole?: string;
    isRecurring?: boolean;
  }): Promise<AllowanceItem> {
    const response = await api.post("/salary/allowances", payload);
    return response.data.data;
  }

  static async deleteAllowance(id: string): Promise<void> {
    await api.delete(`/salary/allowances/${id}`);
  }

  static async getDeductions(): Promise<DeductionItem[]> {
    const response = await api.get("/salary/deductions");
    return response.data.data;
  }

  static async createDeduction(payload: {
    title: string;
    type?: string;
    amount?: number;
    percentage?: number;
    targetRole?: string;
    isRecurring?: boolean;
  }): Promise<DeductionItem> {
    const response = await api.post("/salary/deductions", payload);
    return response.data.data;
  }

  static async deleteDeduction(id: string): Promise<void> {
    await api.delete(`/salary/deductions/${id}`);
  }

  static async getPayslip(recordId: string): Promise<PayslipData> {
    const response = await api.get(`/salary/records/${recordId}/payslip`);
    return response.data.data;
  }
}
