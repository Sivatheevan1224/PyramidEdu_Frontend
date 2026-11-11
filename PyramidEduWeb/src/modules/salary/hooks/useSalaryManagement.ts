"use client";

import { useState, useEffect, useCallback } from "react";
import {
  SalaryOverviewStats,
  SalaryAnalyticsData,
  EmployeeSalaryItem,
  EmployeeSalaryFilters,
  PayslipData,
} from "../types/salary.types";
import { SalaryService } from "../services/salary.service";

export function useSalaryManagement() {
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingPayslip, setLoadingPayslip] = useState(false);

  const [stats, setStats] = useState<SalaryOverviewStats | null>(null);
  const [analytics, setAnalytics] = useState<SalaryAnalyticsData | null>(null);

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

  // Modals state
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeSalaryItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditSalaryOpen, setIsEditSalaryOpen] = useState(false);
  const [isProcessPaymentOpen, setIsProcessPaymentOpen] = useState(false);
  const [isPayslipOpen, setIsPayslipOpen] = useState(false);
  const [payslipData, setPayslipData] = useState<PayslipData | null>(null);

  // Fetch KPI Stats
  const fetchOverview = useCallback(async () => {
    try {
      setLoadingStats(true);
      const data = await SalaryService.getDashboardOverview();
      setStats(data);
    } catch (err) {
      console.error("Failed to load salary overview stats:", err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Fetch Analytics
  const fetchAnalytics = useCallback(async () => {
    try {
      setLoadingAnalytics(true);
      const data = await SalaryService.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error("Failed to load salary analytics:", err);
    } finally {
      setLoadingAnalytics(false);
    }
  }, []);

  // Fetch Employees
  const fetchEmployees = useCallback(async () => {
    try {
      setLoadingEmployees(true);
      const data = await SalaryService.getEmployees(employeeFilters);
      setEmployeeData(data);
    } catch (err) {
      console.error("Failed to load employee salary table:", err);
    } finally {
      setLoadingEmployees(false);
    }
  }, [employeeFilters]);

  useEffect(() => {
    fetchOverview();
    fetchAnalytics();
  }, [fetchOverview, fetchAnalytics]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const refreshAll = () => {
    fetchOverview();
    fetchAnalytics();
    fetchEmployees();
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
      console.error("Failed to fetch payslip:", err);
    } finally {
      setLoadingPayslip(false);
    }
  };

  const handleUpdateBasicSalary = async (employeeId: string, role: string, newSalary: number, reason?: string) => {
    try {
      await SalaryService.updateBasicSalary(employeeId, {
        role,
        newSalary,
        reason,
      });
      setIsEditSalaryOpen(false);
      refreshAll();
    } catch (err) {
      console.error("Failed to update salary:", err);
    }
  };

  const handleProcessPayment = async (
    recordId: string,
    payload: {
      amount: number;
      paymentMethod?: string;
      referenceNumber?: string;
      notes?: string;
    }
  ) => {
    try {
      await SalaryService.processPayment(recordId, payload);
      setIsProcessPaymentOpen(false);
      refreshAll();
    } catch (err) {
      console.error("Failed to process payment:", err);
    }
  };

  const handleGeneratePayroll = async (month?: string) => {
    try {
      await SalaryService.generateMonthlyPayroll(month);
      refreshAll();
    } catch (err) {
      console.error("Failed to generate payroll:", err);
    }
  };

  return {
    loadingStats,
    loadingAnalytics,
    loadingEmployees,
    loadingPayslip,
    stats,
    analytics,
    employeeData,
    employeeFilters,
    setEmployeeFilters,
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
