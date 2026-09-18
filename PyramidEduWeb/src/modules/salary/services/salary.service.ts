import api from "@/lib/api";
import {
  SalaryOverviewStats,
  SalaryAnalyticsData,
  EmployeeSalaryItem,
  EmployeeSalaryFilters,
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

  static async getPayslip(recordId: string): Promise<PayslipData> {
    const response = await api.get(`/salary/records/${recordId}/payslip`);
    return response.data.data;
  }
}
