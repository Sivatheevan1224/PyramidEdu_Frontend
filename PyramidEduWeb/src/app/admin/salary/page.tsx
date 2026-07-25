"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Wallet, PieChart, Users, Calendar, Receipt } from "lucide-react";
import { useSalaryManagement } from "@/modules/salary/hooks/useSalaryManagement";
import { SalaryOverviewCards } from "@/modules/salary/components/SalaryOverviewCards";
import { SalaryAnalyticsSection } from "@/modules/salary/components/SalaryAnalyticsSection";
import { EmployeeSalaryTable } from "@/modules/salary/components/EmployeeSalaryTable";
import { MonthlyPayrollSection } from "@/modules/salary/components/MonthlyPayrollSection";
import { AllowanceDeductionManagement } from "@/modules/salary/components/AllowanceDeductionManagement";
import { EmployeeSalaryDetailsModal } from "@/modules/salary/components/EmployeeSalaryDetailsModal";
import { EditSalaryModal } from "@/modules/salary/components/EditSalaryModal";
import { ProcessPaymentModal } from "@/modules/salary/components/ProcessPaymentModal";
import { PayslipModal } from "@/modules/salary/components/PayslipModal";

export default function AdminSalaryPage() {
  const {
    loadingStats,
    loadingAnalytics,
    loadingEmployees,
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
  } = useSalaryManagement();

  const [activeTab, setActiveTab] = useState<"overview" | "employees" | "payroll" | "rules">("overview");

  return (
    <div className="w-full max-w-full min-w-0 space-y-6 pb-12 overflow-x-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Wallet className="w-6 h-6 text-primary" /> Salary Management
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Centralized dashboard for staff payroll management, salary revisions, allowances, deductions, and payslips.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshAll}
            className="text-xs gap-1.5 cursor-pointer"
            disabled={loadingStats || loadingEmployees}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingStats ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* KPI Overview Cards always visible at top */}
      <SalaryOverviewCards stats={stats} loading={loadingStats} />

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-border gap-4 overflow-x-auto text-xs font-semibold w-full max-w-full min-w-0">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === "overview"
              ? "border-primary text-primary font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <PieChart className="w-3.5 h-3.5" /> Financial Analytics
        </button>

        <button
          onClick={() => setActiveTab("employees")}
          className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === "employees"
              ? "border-primary text-primary font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="w-3.5 h-3.5" /> Employee Salaries
        </button>

        <button
          onClick={() => setActiveTab("payroll")}
          className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === "payroll"
              ? "border-primary text-primary font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" /> Monthly Payroll Execution
        </button>

        <button
          onClick={() => setActiveTab("rules")}
          className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === "rules"
              ? "border-primary text-primary font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Receipt className="w-3.5 h-3.5" /> Allowances & Deductions
        </button>
      </div>

      {/* Main Content Sub-Views */}
      {activeTab === "overview" && (
        <SalaryAnalyticsSection analytics={analytics} loading={loadingAnalytics} />
      )}

      {activeTab === "employees" && (
        <EmployeeSalaryTable
          data={employeeData}
          filters={employeeFilters}
          onFilterChange={(newFilters) => setEmployeeFilters((prev) => ({ ...prev, ...newFilters }))}
          onResetFilters={() => setEmployeeFilters({ search: "", role: "ALL", status: "ALL", page: 1, limit: 10 })}
          onViewDetails={handleOpenDetails}
          onEditSalary={handleOpenEditSalary}
          onProcessPayment={handleOpenProcessPayment}
          onViewPayslip={handleOpenPayslip}
          loading={loadingEmployees}
        />
      )}

      {activeTab === "payroll" && (
        <MonthlyPayrollSection stats={stats} onGeneratePayroll={handleGeneratePayroll} />
      )}

      {activeTab === "rules" && (
        <AllowanceDeductionManagement allowances={allowances} deductions={deductions} onRefresh={refreshAll} />
      )}

      {/* Modals */}
      <EmployeeSalaryDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        employee={selectedEmployee}
      />

      <EditSalaryModal
        isOpen={isEditSalaryOpen}
        onClose={() => setIsEditSalaryOpen(false)}
        employee={selectedEmployee}
        onSave={handleUpdateBasicSalary}
      />

      <ProcessPaymentModal
        isOpen={isProcessPaymentOpen}
        onClose={() => setIsProcessPaymentOpen(false)}
        employee={selectedEmployee}
        onProcess={handleProcessPayment}
      />

      <PayslipModal
        isOpen={isPayslipOpen}
        onClose={() => setIsPayslipOpen(false)}
        payslip={payslipData}
        loading={loadingPayslip}
      />
    </div>
  );
}
