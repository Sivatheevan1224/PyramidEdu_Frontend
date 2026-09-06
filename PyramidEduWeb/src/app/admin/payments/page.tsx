"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, CreditCard, PieChart, Receipt, Users, Award } from "lucide-react";
import { usePaymentOverview } from "@/modules/payments/hooks/usePaymentOverview";
import { DashboardOverviewCards } from "@/modules/payments/components/DashboardOverviewCards";
import { PaymentAnalyticsSection } from "@/modules/payments/components/PaymentAnalyticsSection";
import { PaymentManagementTable } from "@/modules/payments/components/PaymentManagementTable";
import { FeeOverviewSection } from "@/modules/payments/components/FeeOverviewSection";
import { StudentPaymentSummaryTable } from "@/modules/payments/components/StudentPaymentSummaryTable";
import { PaymentDetailsModal } from "@/modules/payments/components/PaymentDetailsModal";
import { StudentPerformanceList } from "@/modules/performance/components/StudentPerformanceList";

export default function AdminPaymentsPage() {
  const {
    loadingStats,
    loadingAnalytics,
    loadingPayments,
    loadingFeeOverview,
    loadingStudentSummaries,
    stats,
    analytics,
    feeOverview,
    subjects,
    batches,

    paymentFilters,
    setPaymentFilters,
    paymentsData,
    resetPaymentFilters,

    studentFilters,
    setStudentFilters,
    studentSummariesData,
    resetStudentFilters,

    selectedPaymentId,
    paymentDetails,
    loadingModal,
    openPaymentDetails,
    closePaymentDetails,
    handleUpdateStatus,
    refreshAll,
  } = usePaymentOverview();

  const [activeTab, setActiveTab] = useState<"overview" | "transactions" | "fees" | "students" | "freecards">("overview");

  return (
    <div className="w-full max-w-full min-w-0 space-y-6 pb-12 overflow-x-hidden">

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-primary" /> Payment Overview
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Central dashboard for real-time institute payment analytics, fee tracking, collections, and verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshAll}
            className="text-xs gap-1.5"
            disabled={loadingStats || loadingPayments}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingStats ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Overview Cards always visible at top */}
      <DashboardOverviewCards stats={stats} loading={loadingStats} />

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-border space-x-4 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "overview"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <PieChart className="w-3.5 h-3.5" /> Financial Analytics
        </button>

        <button
          onClick={() => setActiveTab("transactions")}
          className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "transactions"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" /> Payment Transactions
        </button>

        <button
          onClick={() => setActiveTab("fees")}
          className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "fees"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Receipt className="w-3.5 h-3.5" /> Fee Overview
        </button>

        <button
          onClick={() => setActiveTab("students")}
          className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "students"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="w-3.5 h-3.5" /> Student Payment Summaries
        </button>

        <button
          onClick={() => setActiveTab("freecards")}
          className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "freecards"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Award className="w-3.5 h-3.5 text-amber-500" /> Free Card & Scholarship Management
        </button>
      </div>

      {/* Main Content Area Based on Active Tab */}
      {activeTab === "overview" && (
        <PaymentAnalyticsSection analytics={analytics} loading={loadingAnalytics} />
      )}

      {activeTab === "transactions" && (
        <PaymentManagementTable
          data={paymentsData}
          filters={paymentFilters}
          onFilterChange={(newFilters) => setPaymentFilters((prev) => ({ ...prev, ...newFilters }))}
          onResetFilters={resetPaymentFilters}
          onViewDetails={openPaymentDetails}
          onUpdateStatus={handleUpdateStatus}
          subjects={subjects}
          batches={batches}
          loading={loadingPayments}
        />
      )}

      {activeTab === "fees" && (
        <FeeOverviewSection
          data={feeOverview}
          loading={loadingFeeOverview}
          onViewPayment={openPaymentDetails}
        />
      )}

      {activeTab === "students" && (
        <StudentPaymentSummaryTable
          data={studentSummariesData}
          filters={studentFilters}
          onFilterChange={(newFilters) => setStudentFilters((prev) => ({ ...prev, ...newFilters }))}
          onResetFilters={resetStudentFilters}
          onViewDetails={openPaymentDetails}
          subjects={subjects}
          batches={batches}
          loading={loadingStudentSummaries}
        />
      )}

      {activeTab === "freecards" && (
        <StudentPerformanceList onSelectStudent={() => {}} />
      )}

      {/* Payment Details Modal */}
      <PaymentDetailsModal
        isOpen={Boolean(selectedPaymentId)}
        onClose={closePaymentDetails}
        details={paymentDetails}
        loading={loadingModal}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
