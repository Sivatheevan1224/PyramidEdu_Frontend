"use client";

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { PaymentService } from '../services/payment.service';
import {
  DashboardOverviewStats,
  AnalyticsData,
  PaymentItem,
  FeeOverviewData,
  StudentSummaryItem,
  PaymentDetailsData,
  PaymentFiltersState,
  StudentSummaryFiltersState,
} from '../types/payment.types';

export function usePaymentOverview() {
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [loadingFeeOverview, setLoadingFeeOverview] = useState(true);
  const [loadingStudentSummaries, setLoadingStudentSummaries] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [stats, setStats] = useState<DashboardOverviewStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [feeOverview, setFeeOverview] = useState<FeeOverviewData | null>(null);

  // Filter options
  const [subjects, setSubjects] = useState<{ id: string; subjectName: string; subjectCode: string }[]>([]);
  const [batches, setBatches] = useState<{ id: string; batchName: string }[]>([]);

  // Payment Table State
  const [paymentFilters, setPaymentFilters] = useState<PaymentFiltersState>({
    search: '',
    paymentStatus: 'ALL',
    paymentMethod: 'ALL',
    subjectId: 'ALL',
    batchId: 'ALL',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 10,
    sortBy: 'paymentDate',
    sortOrder: 'desc',
  });

  const [paymentsData, setPaymentsData] = useState<{
    items: PaymentItem[];
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

  // Student Summaries Table State
  const [studentFilters, setStudentFilters] = useState<StudentSummaryFiltersState>({
    search: '',
    batchId: 'ALL',
    subjectId: 'ALL',
    status: 'ALL',
    page: 1,
    limit: 10,
  });

  const [studentSummariesData, setStudentSummariesData] = useState<{
    items: StudentSummaryItem[];
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

  // Modal State
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetailsData | null>(null);
  const [loadingModal, setLoadingModal] = useState(false);

  // Load Dropdown Options
  useEffect(() => {
    async function loadOptions() {
      try {
        const [subs, bts] = await Promise.all([
          PaymentService.getSubjects().catch(() => []),
          PaymentService.getBatches().catch(() => []),
        ]);
        setSubjects(subs);
        setBatches(bts);
      } catch (err) {
        console.error('Failed to load filter options', err);
      }
    }
    loadOptions();
  }, []);

  // Fetch Dashboard Stats & Overview
  const fetchOverviewStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const data = await PaymentService.getDashboardOverview();
      setStats(data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to load dashboard overview stats.');
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Fetch Analytics
  const fetchAnalytics = useCallback(async () => {
    setLoadingAnalytics(true);
    try {
      const data = await PaymentService.getAnalytics();
      setAnalytics(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingAnalytics(false);
    }
  }, []);

  // Fetch Payments Table
  const fetchPayments = useCallback(async () => {
    setLoadingPayments(true);
    try {
      const data = await PaymentService.getPayments(paymentFilters);
      setPaymentsData(data);
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to fetch payments data.');
    } finally {
      setLoadingPayments(false);
    }
  }, [paymentFilters]);

  // Fetch Fee Overview
  const fetchFeeOverview = useCallback(async () => {
    setLoadingFeeOverview(true);
    try {
      const data = await PaymentService.getFeeOverview();
      setFeeOverview(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingFeeOverview(false);
    }
  }, []);

  // Fetch Student Summaries
  const fetchStudentSummaries = useCallback(async () => {
    setLoadingStudentSummaries(true);
    try {
      const data = await PaymentService.getStudentSummaries(studentFilters);
      setStudentSummariesData(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingStudentSummaries(false);
    }
  }, [studentFilters]);

  // Initial Load & Triggers
  useEffect(() => {
    fetchOverviewStats();
    fetchAnalytics();
    fetchFeeOverview();
  }, [fetchOverviewStats, fetchAnalytics, fetchFeeOverview]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  useEffect(() => {
    fetchStudentSummaries();
  }, [fetchStudentSummaries]);

  // Open Payment Details Modal
  const openPaymentDetails = useCallback(async (paymentId: string) => {
    setSelectedPaymentId(paymentId);
    setLoadingModal(true);
    try {
      const details = await PaymentService.getPaymentDetails(paymentId);
      setPaymentDetails(details);
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to load payment details.');
      setSelectedPaymentId(null);
    } finally {
      setLoadingModal(false);
    }
  }, []);

  const closePaymentDetails = useCallback(() => {
    setSelectedPaymentId(null);
    setPaymentDetails(null);
  }, []);

  // Action: Update Payment Verification Status
  const handleUpdateStatus = useCallback(async (id: string, newStatus: string) => {
    try {
      await PaymentService.updatePaymentStatus(id, newStatus);
      toast.success(`Payment status updated to ${newStatus}`);
      fetchPayments();
      fetchOverviewStats();
      fetchFeeOverview();
      fetchAnalytics();
      fetchStudentSummaries();
      if (selectedPaymentId === id) {
        openPaymentDetails(id);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update payment status.');
    }
  }, [fetchPayments, fetchOverviewStats, fetchFeeOverview, fetchAnalytics, fetchStudentSummaries, selectedPaymentId, openPaymentDetails]);

  // Reset Filters
  const resetPaymentFilters = useCallback(() => {
    setPaymentFilters({
      search: '',
      paymentStatus: 'ALL',
      paymentMethod: 'ALL',
      subjectId: 'ALL',
      batchId: 'ALL',
      startDate: '',
      endDate: '',
      page: 1,
      limit: 10,
      sortBy: 'paymentDate',
      sortOrder: 'desc',
    });
  }, []);

  const resetStudentFilters = useCallback(() => {
    setStudentFilters({
      search: '',
      batchId: 'ALL',
      subjectId: 'ALL',
      status: 'ALL',
      page: 1,
      limit: 10,
    });
  }, []);

  return {
    // Loading states
    loadingStats,
    loadingAnalytics,
    loadingPayments,
    loadingFeeOverview,
    loadingStudentSummaries,
    error,

    // Core Data
    stats,
    analytics,
    feeOverview,
    subjects,
    batches,

    // Payments Table State & Handlers
    paymentFilters,
    setPaymentFilters,
    paymentsData,
    resetPaymentFilters,

    // Student Summaries State & Handlers
    studentFilters,
    setStudentFilters,
    studentSummariesData,
    resetStudentFilters,

    // Modal State & Actions
    selectedPaymentId,
    paymentDetails,
    loadingModal,
    openPaymentDetails,
    closePaymentDetails,
    handleUpdateStatus,

    // Manual Refresh All
    refreshAll: () => {
      fetchOverviewStats();
      fetchAnalytics();
      fetchPayments();
      fetchFeeOverview();
      fetchStudentSummaries();
    },
  };
}
