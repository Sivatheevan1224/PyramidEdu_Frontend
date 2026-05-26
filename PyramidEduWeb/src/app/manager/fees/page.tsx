"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  CreditCard, CircleDollarSign, Check, X, Search, Filter, 
  Calendar, FileText, CheckCircle2, ShieldAlert, Sparkles, Loader2 
} from "lucide-react";
import { toast } from "sonner";

// Initial high-quality mock payments listing
const INITIAL_PAYMENTS = [
  {
    id: "PAY-9041",
    studentName: "Arulnathan Sivatheevan",
    indexNumber: "UWU/CST/22/083",
    stream: "Physical Science",
    course: "Combined Mathematics",
    amount: 4000, // Admission Rs. 1500 + Class fee Rs. 2500
    method: "BANK_TRANSFER", // Physical
    referenceNo: "Slip_Ref_77402",
    date: "2026-05-25",
    status: "PENDING", // Pending manager approval
    slipImage: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "PAY-9042",
    studentName: "Sathananthan Makinthan",
    indexNumber: "UWU/CST/22/087",
    stream: "Commerce",
    course: "Accounting",
    amount: 3500, // Admission 1500 + 2000
    method: "CARD", // Online
    referenceNo: "ch_3M4t7fK8xZ",
    date: "2026-05-25",
    status: "PAID", // Auto approved
    slipImage: null
  },
  {
    id: "PAY-9043",
    studentName: "Yoganathan Pukaliny",
    indexNumber: "UWU/CST/22/097",
    stream: "Biological Science",
    course: "Biology",
    amount: 3900, // Admission 1500 + 2400
    method: "CARD", // Online
    referenceNo: "ch_3M4u5rP9mY",
    date: "2026-05-24",
    status: "PAID",
    slipImage: null
  },
  {
    id: "PAY-9044",
    studentName: "Kantharuban Kowsika",
    indexNumber: "UWU/CST/22/108",
    stream: "Technology",
    course: "Information & Communication Technology (ICT)",
    amount: 3800, // Admission 1500 + 2300
    method: "BANK_TRANSFER", // Physical
    referenceNo: "Slip_Ref_28941",
    date: "2026-05-24",
    status: "PENDING",
    slipImage: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "PAY-9045",
    studentName: "Kavindi Jayawardena",
    indexNumber: "PE-PHY-5821",
    stream: "Physical Science",
    course: "Physics",
    amount: 3700, // Admission 1500 + 2200
    method: "CASH", // Physical Counter
    referenceNo: "Counter_Cash_40",
    date: "2026-05-23",
    status: "PENDING",
    slipImage: null
  },
  {
    id: "PAY-9046",
    studentName: "Nimshi Warnasuriya",
    indexNumber: "PE-BIO-1925",
    stream: "Biological Science",
    course: "Chemistry",
    amount: 3700, // Admission 1500 + 2200
    method: "CARD", // Online
    referenceNo: "ch_3M4x9tT3qL",
    date: "2026-05-22",
    status: "PAID",
    slipImage: null
  }
];

export default function ManagerFeesPage() {
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL | PAID | PENDING
  const [selectedPayment, setSelectedPayment] = useState<typeof INITIAL_PAYMENTS[0] | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  // Statistics calculation
  const totalCollected = payments
    .filter(p => p.status === "PAID")
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingApprovalsCount = payments.filter(p => p.status === "PENDING").length;
  
  const onlinePaymentsCount = payments.filter(p => p.method === "CARD").length;
  const successOnlineCount = payments.filter(p => p.method === "CARD" && p.status === "PAID").length;
  const successRate = onlinePaymentsCount > 0 ? Math.round((successOnlineCount / onlinePaymentsCount) * 100) : 100;

  // Filter payments based on search and filters
  const filteredPayments = payments.filter(p => {
    const matchesSearch = 
      p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.indexNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.course.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Approve payment trigger
  const handleApprovePayment = async (paymentId: string) => {
    setApprovingId(paymentId);
    
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setPayments(prev => 
      prev.map(p => p.id === paymentId ? { ...p, status: "PAID" } : p)
    );
    
    setApprovingId(null);
    setSelectedPayment(null);
    toast.success(`Payment verified and student portal activated!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold font-lexend">Fees & Registration Approvals</h2>
        <p className="text-xs text-muted-foreground">
          View all online student fees and review pending physical bank transfers & cash payments.
        </p>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Total Collected */}
        <Card className="p-5 flex items-center justify-between border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Total Paid Fees</span>
            <h3 className="text-xl font-black font-lexend text-primary">Rs. {totalCollected.toLocaleString()}.00</h3>
          </div>
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <CircleDollarSign className="h-5 w-5" />
          </div>
        </Card>

        {/* Pending Approvals */}
        <Card className="p-5 flex items-center justify-between border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Pending Approvals</span>
            <h3 className="text-xl font-black font-lexend text-amber-500">{pendingApprovalsCount} Payments</h3>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <ShieldAlert className="h-5 w-5 animate-pulse" />
          </div>
        </Card>

        {/* Online Success Rate */}
        <Card className="p-5 flex items-center justify-between border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Online Success Rate</span>
            <h3 className="text-xl font-black font-lexend text-emerald-500">{successRate}% Success</h3>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Sparkles className="h-5 w-5" />
          </div>
        </Card>

        {/* Active Registrations */}
        <Card className="p-5 flex items-center justify-between border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Total Payments Logged</span>
            <h3 className="text-xl font-black font-lexend text-foreground">{payments.length} Registered</h3>
          </div>
          <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-foreground flex items-center justify-center">
            <CreditCard className="h-5 w-5" />
          </div>
        </Card>
      </div>

      {/* Main List and Table */}
      <Card className="p-5 border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
        
        {/* Table Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-4">
          
          {/* Search bar */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search student, course, ID..." 
              className="pl-9 h-10 border-slate-200 dark:border-slate-800"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Segment Tabs */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0 hidden md:block" />
            
            <div className="flex bg-muted p-1 rounded-lg">
              <button 
                onClick={() => setStatusFilter("ALL")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  statusFilter === "ALL" 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All Payments
              </button>
              <button 
                onClick={() => setStatusFilter("PENDING")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  statusFilter === "PENDING" 
                    ? "bg-amber-500 text-white shadow-sm" 
                    : "text-muted-foreground hover:text-amber-500"
                }`}
              >
                Pending ({pendingApprovalsCount})
              </button>
              <button 
                onClick={() => setStatusFilter("PAID")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  statusFilter === "PAID" 
                    ? "bg-emerald-500 text-white shadow-sm" 
                    : "text-muted-foreground hover:text-emerald-500"
                }`}
              >
                Approved
              </button>
            </div>
          </div>
        </div>

        {/* Payments Table list */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/80 text-left text-xs uppercase text-muted-foreground font-extrabold">
                <th className="pb-3">Transaction</th>
                <th className="pb-3">Student / Index</th>
                <th className="pb-3">Course / Stream</th>
                <th className="pb-3 text-right">Fee Paid</th>
                <th className="pb-3 text-center">Method</th>
                <th className="pb-3 text-center">Status</th>
                <th className="pb-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-muted-foreground">
                    No transactions match your search filter criteria.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-slate-100 dark:border-slate-800/80 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                    
                    {/* Transaction ID */}
                    <td className="py-4 font-mono font-bold text-foreground">
                      {payment.id}
                      <span className="block text-[9px] text-muted-foreground font-normal mt-0.5">{payment.date}</span>
                    </td>

                    {/* Student Name */}
                    <td className="py-4">
                      <span className="font-bold text-foreground block">{payment.studentName}</span>
                      <span className="text-[10px] font-mono text-muted-foreground uppercase">{payment.indexNumber}</span>
                    </td>

                    {/* Subject Course */}
                    <td className="py-4">
                      <span className="font-semibold text-foreground block leading-tight">{payment.course}</span>
                      <span className="text-[10px] text-muted-foreground mt-0.5 block">{payment.stream}</span>
                    </td>

                    {/* Fee Amount */}
                    <td className="py-4 text-right font-extrabold text-foreground">
                      Rs. {payment.amount.toLocaleString()}.00
                    </td>

                    {/* Payment Method */}
                    <td className="py-4 text-center">
                      <Badge variant="outline" className={`font-bold capitalize ${
                        payment.method === "CARD" 
                          ? "border-primary/20 text-primary bg-primary/5" 
                          : payment.method === "BANK_TRANSFER" 
                            ? "border-purple-200 text-purple-600 dark:text-purple-400 bg-purple-500/5" 
                            : "border-slate-200 text-slate-600 dark:text-slate-400"
                      }`}>
                        {payment.method === "CARD" ? "Online Card" : payment.method === "BANK_TRANSFER" ? "Bank Slip" : "Cash Counter"}
                      </Badge>
                    </td>

                    {/* Status badge */}
                    <td className="py-4 text-center">
                      {payment.status === "PAID" ? (
                        <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white font-bold gap-1">
                          <Check className="h-3 w-3" /> Approved
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/10 font-bold border border-amber-500/20 animate-pulse">
                          Pending Approval
                        </Badge>
                      )}
                    </td>

                    {/* Verification / View Details Action */}
                    <td className="py-4 text-center">
                      {payment.status === "PENDING" ? (
                        <div className="flex items-center justify-center gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => setSelectedPayment(payment)}
                            className="bg-primary hover:bg-primary/95 text-white font-semibold text-xs h-8 cursor-pointer"
                          >
                            Review Slip
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            disabled={approvingId === payment.id}
                            onClick={() => handleApprovePayment(payment.id)}
                            className="h-8 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 cursor-pointer"
                          >
                            {approvingId === payment.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              "Quick Appr."
                            )}
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => setSelectedPayment(payment)}
                          className="text-xs h-8 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          View Info
                        </Button>
                      )}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Payment Detail & Bank Slip Reviewer Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300">
          <div className="glass w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-white/20 text-foreground animate-float-fast max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="text-base font-bold font-lexend">Review Registration Payment</h3>
              </div>
              <button 
                onClick={() => setSelectedPayment(null)}
                className="text-muted-foreground hover:text-foreground p-1"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Student & Payment info */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-slate-950/40 p-4 border border-white/10 rounded-xl">
                <div>
                  <span className="text-muted-foreground block text-[9px] uppercase font-bold">Student Name</span>
                  <span className="text-sm font-bold text-foreground">{selectedPayment.studentName}</span>
                  <span className="block text-[10px] text-muted-foreground font-mono mt-1 uppercase">{selectedPayment.indexNumber}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[9px] uppercase font-bold">Transaction Reference</span>
                  <span className="font-mono text-foreground font-semibold text-xs block">{selectedPayment.referenceNo ?? "N/A"}</span>
                  <span className="text-[10px] text-muted-foreground font-bold mt-1 inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {selectedPayment.date}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Course Selection</h4>
                <div className="flex justify-between items-center border border-white/10 p-3 rounded-lg bg-slate-950/20">
                  <div>
                    <span className="font-bold text-foreground block">{selectedPayment.course}</span>
                    <span className="text-[10px] text-muted-foreground">{selectedPayment.stream}</span>
                  </div>
                  <span className="font-extrabold text-primary text-sm">Rs. {selectedPayment.amount.toLocaleString()}.00</span>
                </div>
              </div>

              {/* Show Bank Deposit Slip if available */}
              {selectedPayment.method === "BANK_TRANSFER" && selectedPayment.slipImage && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Uploaded Bank Deposit Slip</h4>
                  <div className="relative border border-white/10 rounded-xl overflow-hidden aspect-[4/3] bg-slate-900 flex items-center justify-center">
                    <img 
                      src={selectedPayment.slipImage} 
                      alt="Bank Deposit Slip Receipt"
                      className="object-cover w-full h-full opacity-80"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent flex items-end p-3">
                      <div className="text-left leading-tight text-white">
                        <span className="text-[9px] uppercase font-bold text-primary">Bank Receipt Details</span>
                        <p className="text-[10px] opacity-90 mt-0.5">Reference: {selectedPayment.referenceNo}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Display cash counter notification */}
              {selectedPayment.method === "CASH" && (
                <div className="flex items-start gap-3 border border-amber-500/10 bg-amber-500/5 p-4 rounded-xl text-amber-500">
                  <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <span className="font-bold text-xs block">Cash Payment counter verification</span>
                    <span className="text-[10px] leading-relaxed block mt-0.5">
                      This student indicated they will pay cash directly at the counter. Please confirm you have physically received Rs. {selectedPayment.amount.toLocaleString()}.00 in cash before approving this request.
                    </span>
                  </div>
                </div>
              )}

              {/* Display card payment metadata */}
              {selectedPayment.method === "CARD" && (
                <div className="flex items-start gap-3 border border-emerald-500/10 bg-emerald-500/5 p-4 rounded-xl text-emerald-500">
                  <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-xs block">Stripe Online Gateway Auto-Approved</span>
                    <span className="text-[10px] leading-relaxed block mt-0.5">
                      This transaction was securely validated by Stripe Card clearance. The student's portal was automatically unlocked with active enrollment.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setSelectedPayment(null)}
                className="h-10 text-xs font-bold border-white/10 hover:bg-white/5 cursor-pointer"
              >
                Close
              </Button>
              {selectedPayment.status === "PENDING" && (
                <Button 
                  onClick={() => handleApprovePayment(selectedPayment.id)}
                  disabled={approvingId === selectedPayment.id}
                  className="h-10 text-xs font-bold bg-primary hover:bg-primary/95 text-white gap-1.5 cursor-pointer shadow-glow"
                >
                  {approvingId === selectedPayment.id ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Approve Payment
                    </>
                  )}
                </Button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
