"use client";

import { useState, useEffect, useCallback } from "react";
import {
  SalaryOverviewStats,
  SalaryAnalyticsData,
  EmployeeSalaryItem,
  EmployeeSalaryFilters,
  AllowanceItem,
  DeductionItem,
  PayslipData,
} from "../types/salary.types";
import { SalaryService } from "../services/salary.service";

export function useSalaryManagement() {
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingAllowances, setLoadingAllowances] = useState(true);
  const [loadingDeductions, setLoadingDeductions] = useState(true);

  const [stats, setStats] = useState<SalaryOverviewStats | null>(null);
  const [analytics, setAnalytics] = useState<SalaryAnalyticsData | null>(null);
  const [allowances, setAllowances] = useState<AllowanceItem[]>([]);
  const [deductions, setDeductions] = useState<DeductionItem[]>([]);

  // Employee Table State
  const [employeeFilters, setEmployeeFilters] = useState<EmployeeSalaryFilters>({
    search: "",
    role: "ALL",
    status: "ALL",
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const q = new URLSearchParams(window.location.search).get("search");
      if (q) {
        setEmployeeFilters((prev) => ({ ...prev, search: q, page: 1 }));
      }
    }
  }, []);

  const [employeeData, setEmployeeData] = useState<{
    items: EmployeeSalaryItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>({
    items: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  // Modal States
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeSalaryItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditSalaryOpen, setIsEditSalaryOpen] = useState(false);
  const [isProcessPaymentOpen, setIsProcessPaymentOpen] = useState(false);
  const [isPayslipOpen, setIsPayslipOpen] = useState(false);
  const [payslipData, setPayslipData] = useState<PayslipData | null>(null);
  const [loadingPayslip, setLoadingPayslip] = useState(false);

  // Fetch Dashboard Stats
  const fetchOverview = useCallback(async () => {
    try {
      setLoadingStats(true);
      const res = await SalaryService.getDashboardOverview();
      setStats(res);
    } catch (err) {
      console.error("Failed to load salary stats:", err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Fetch Analytics
  const fetchAnalytics = useCallback(async () => {
    try {
      setLoadingAnalytics(true);
      const res = await SalaryService.getAnalytics();
      setAnalytics(res);
    } catch (err) {
      console.error("Failed to load salary analytics:", err);
    } finally {
      setLoadingAnalytics(false);
    }
  }, []);

  // Fetch Employee Salary Table Data
  const fetchEmployees = useCallback(async () => {
    try {
      setLoadingEmployees(true);
      const res = await SalaryService.getEmployees(employeeFilters);
      setEmployeeData(res);
    } catch (err) {
      console.error("Failed to load employee salary table:", err);
    } finally {
      setLoadingEmployees(false);
    }
  }, [employeeFilters]);

  // Fetch Allowances and Deductions
  const fetchAllowancesAndDeductions = useCallback(async () => {
    try {
      setLoadingAllowances(true);
      setLoadingDeductions(true);
      const [allowRes, deductRes] = await Promise.all([
        SalaryService.getAllowances(),
        SalaryService.getDeductions(),
      ]);
      setAllowances(allowRes);
      setDeductions(deductRes);
    } catch (err) {
      console.error("Failed to load allowances/deductions:", err);
    } finally {
      setLoadingAllowances(false);
      setLoadingDeductions(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
    fetchAnalytics();
    fetchAllowancesAndDeductions();
  }, [fetchOverview, fetchAnalytics, fetchAllowancesAndDeductions]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const refreshAll = () => {
    fetchOverview();
    fetchAnalytics();
    fetchEmployees();
    fetchAllowancesAndDeductions();
  };

  const handleOpenDetails = (employee: EmployeeSalaryItem) => {
    setSelectedEmployee(employee);
    setIsDetailsOpen(true);
  };

  const handleOpenEditSalary = (employee: EmployeeSalaryItem) => {
    setSelectedEmployee(employee);
    setIsEditSalaryOpen(true);
  };

  const handleOpenProcessPayment = (employee: EmployeeSalaryItem) => {
    setSelectedEmployee(employee);
    setIsProcessPaymentOpen(true);
  };

  const handleOpenPayslip = async (employee: EmployeeSalaryItem) => {
    setSelectedEmployee(employee);
    setIsPayslipOpen(true);
    try {
      setLoadingPayslip(true);
      const data = await SalaryService.getPayslip(employee.employeeId);
      setPayslipData(data);
    } catch (err) {
      console.error("Failed to load payslip:", err);
    } finally {
      setLoadingPayslip(false);
    }
  };

  const handleUpdateBasicSalary = async (newSalary: number, reason?: string) => {
    if (!selectedEmployee) return;
    try {
      await SalaryService.updateBasicSalary(selectedEmployee.employeeId, {
        role: selectedEmployee.employeeRole,
        newSalary,
        reason,
      });
      setIsEditSalaryOpen(false);
      refreshAll();
    } catch (err) {
      console.error("Failed to update basic salary:", err);
    }
  };

  const handleProcessPayment = async (amount: number, method: string, ref?: string) => {
    if (!selectedEmployee) return;
    try {
      await SalaryService.processPayment(selectedEmployee.employeeId, {
        amount,
        paymentMethod: method,
        referenceNumber: ref,
      });
      setIsProcessPaymentOpen(false);
      refreshAll();
    } catch (err) {
      console.error("Failed to process payment:", err);
    }
  };

  const handleGeneratePayroll = async () => {
    try {
      await SalaryService.generateMonthlyPayroll();
      refreshAll();
    } catch (err) {
      console.error("Failed to generate payroll:", err);
    }
  };

  return {
    loadingStats,
    loadingAnalytics,
    loadingEmployees,
    loadingAllowances,
    loadingDeductions,
    loadingPayslip,
    stats,
    analytics,
    employeeData,
    employeeFilters,
    setEmployeeFilters,
    allowances,
    deductions,
    selectedEmployee,
    isDetailsOpen,
    setIsDetailsOpen,
    isEditSalaryOpen,
    setIsEditSalaryOpen,
    isProcessPaymentOpen,
    setIsProcessPaymentOpen,
    isPayslipOpen,
    setIsPayslipOpen,
    payslipData,
    handleOpenDetails,
    handleOpenEditSalary,
    handleOpenProcessPayment,
    handleOpenPayslip,
    handleUpdateBasicSalary,
    handleProcessPayment,
    handleGeneratePayroll,
    refreshAll,
  };
}
