"use client";

import React, { useState, useEffect } from "react";
import { api, getApiBaseUrl, getAccessToken } from "@/lib/api";
import { Card } from "@/components/ui/card";
import {
  CreditCard,
  TrendingUp,
  AlertCircle,
  Download,
  Printer,
  ChevronLeft,
  Search,
  RefreshCw,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

export default function ManagerFinancialReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [summary, setSummary] = useState<any>(null);
  const [payments, setPayments] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchInvoice, setSearchInvoice] = useState<string>("");

  const fetchFinancialData = async () => {
    setLoading(true);
    try {
      const params = {
        month: selectedMonth,
        year: selectedYear,
      };

      const [summaryRes, paymentsRes] = await Promise.all([
        api.get("/analytics/dashboard", { params }),
        api.get("/analytics/payments", { params }),
      ]);

      if (summaryRes.data.success) setSummary(summaryRes.data.data);
      if (paymentsRes.data.success) setPayments(paymentsRes.data.data);
    } catch (error) {
      console.error("Failed to load financial reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, [selectedMonth, selectedYear]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    window.open(`${getApiBaseUrl()}/analytics/export/csv?type=payments&token=${getAccessToken() || ""}`, "_blank");
  };

  const totalCollected = Number(summary?.totalPayments || 0);
  const totalPending = Number(summary?.pendingPayments || 0);
  const grossExpected = totalCollected + totalPending;
  const collectionRate = grossExpected > 0 ? ((totalCollected / grossExpected) * 100).toFixed(1) : "100.0";

  const outstandingInvoices = payments?.outstandingInvoices || [];
  const filteredInvoices = outstandingInvoices.filter(
    (i: any) =>
      i.studentName.toLowerCase().includes(searchInvoice.toLowerCase()) ||
      i.indexNumber.toLowerCase().includes(searchInvoice.toLowerCase())
  );

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto min-h-screen">
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-financial, #printable-financial * {
            visibility: visible;
          }
          #printable-financial {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/manager/reports"
              className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Reports Hub
            </Link>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Financial & Revenue Reports</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Track gross billings, verified fee payments, outstanding dues, and cashflow trends.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold hover:bg-muted text-foreground transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-all shadow-md"
          >
            <Printer className="w-3.5 h-3.5" /> Print Sheet (PDF)
          </button>
        </div>
      </div>

      {/* Filters (No-Print) */}
      <Card className="p-4 border-border bg-card shadow-xs flex flex-wrap items-center gap-4 no-print rounded-2xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Report Period:</span>
        </div>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:ring-2 focus:ring-emerald-500/20"
        >
          {monthNames.map((name, index) => (
            <option key={index + 1} value={index + 1}>
              {name}
            </option>
          ))}
        </select>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:ring-2 focus:ring-emerald-500/20"
        >
          {[2025, 2026, 2027].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <button
          onClick={fetchFinancialData}
          className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline"
        >
          <RefreshCw className="w-3 h-3" /> Reload Financials
        </button>
      </Card>

      {/* Main Printable Content */}
      <div id="printable-financial" className="space-y-6">
        {/* KPI Summaries Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border-border bg-card shadow-xs rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-semibold uppercase">Verified Revenue</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-emerald-600">
              {loading ? "..." : `LKR ${totalCollected.toLocaleString()}`}
            </p>
            <span className="text-[11px] text-muted-foreground block mt-1">Confirmed student fee payments</span>
          </Card>

          <Card className="p-5 border-border bg-card shadow-xs rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-semibold uppercase">Pending Invoices</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-amber-600">
              {loading ? "..." : `LKR ${totalPending.toLocaleString()}`}
            </p>
            <span className="text-[11px] text-muted-foreground block mt-1">Unpaid or partially settled</span>
          </Card>

          <Card className="p-5 border-border bg-card shadow-xs rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-semibold uppercase">Gross Expected</span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-foreground">
              {loading ? "..." : `LKR ${grossExpected.toLocaleString()}`}
            </p>
            <span className="text-[11px] text-muted-foreground block mt-1">Total projected month billing</span>
          </Card>

          <Card className="p-5 border-border bg-card shadow-xs rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-semibold uppercase">Collection Efficiency</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-purple-600">
              {loading ? "..." : `${collectionRate}%`}
            </p>
            <span className="text-[11px] text-muted-foreground block mt-1">Collected vs gross expected</span>
          </Card>
        </div>

        {/* Collection Trends Chart */}
        <Card className="p-5 border-border bg-card shadow-xs rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-foreground">Monthly Fee Collection Trend</h3>
              <p className="text-xs text-muted-foreground">Historical fee intake over previous recorded months</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              LKR Payments Verified
            </span>
          </div>

          <div className="h-72">
            {loading ? (
              <div className="h-full bg-muted/20 animate-pulse rounded-xl"></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={payments?.collectionTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="income" name="Income (LKR)" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Outstanding Invoices Table */}
        <Card className="p-5 border-border bg-card shadow-xs rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-base font-bold text-foreground">Outstanding Fee Balances</h3>
              <p className="text-xs text-muted-foreground">Students with unsettled balance payments</p>
            </div>
            <div className="relative no-print w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by student or index..."
                value={searchInvoice}
                onChange={(e) => setSearchInvoice(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-border bg-background text-xs text-foreground outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-muted/40 text-muted-foreground border-b border-border font-bold">
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Index Number</th>
                  <th className="px-4 py-3 text-right">Balance Due</th>
                  <th className="px-4 py-3 text-right">Due Date</th>
                  <th className="px-4 py-3 text-center">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-muted-foreground">
                      Loading fee balances...
                    </td>
                  </tr>
                ) : filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-muted-foreground">
                      No outstanding fee invoices found. All payments are up to date.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv: any, idx: number) => (
                    <tr key={idx} className="hover:bg-muted/10">
                      <td className="px-4 py-3 font-semibold text-foreground">{inv.studentName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{inv.indexNumber}</td>
                      <td className="px-4 py-3 text-right font-black text-red-600">
                        LKR {Number(inv.amountDue).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground">
                        {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                          {inv.status || "PENDING"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
