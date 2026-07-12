import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CreditCard, ShieldAlert, Sparkles, Search, Filter } from "lucide-react";
import { useFees } from "../hooks/useFees";
import { fetchStudentPaymentHistory } from "../services/api";
import { toast } from "sonner";
import FeeManagementTable from "../components/FeeManagementTable";
import PaymentHistoryModal from "../components/PaymentHistoryModal";

export default function FeeManagementPage() {
  const { data: students, loading, handleToggleMonthlyFeeStatus, filters } = useFees();
  
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [studentHistory, setStudentHistory] = useState<any>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil((students?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = students?.slice(startIndex, startIndex + itemsPerPage) || [];

  // Statistics calculation
  const totalStudents = students?.length || 0;
  const paidStudentsCount = students?.filter(s => s.monthlyFeeStatus === "PAID").length || 0;
  const unpaidStudentsCount = totalStudents - paidStudentsCount;

  const handleViewHistory = async (studentId: string) => {
    setSelectedStudent(studentId);
    setHistoryLoading(true);
    try {
      const history = await fetchStudentPaymentHistory(studentId);
      setStudentHistory(history);
    } catch (error) {
      toast.error("Failed to load payment history");
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold font-sans">Fee Management</h2>
        <p className="text-xs text-muted-foreground">
          View and manage student fee payments and histories.
        </p>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Total Students */}
        <Card className="p-5 flex items-center justify-between border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Total Students</span>
            <h3 className="text-xl font-black font-sans text-primary">{totalStudents}</h3>
          </div>
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <CreditCard className="h-5 w-5" />
          </div>
        </Card>

        {/* Paid Students */}
        <Card className="p-5 flex items-center justify-between border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Paid Students</span>
            <h3 className="text-xl font-black font-sans text-emerald-500">{paidStudentsCount}</h3>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Sparkles className="h-5 w-5" />
          </div>
        </Card>

        {/* Unpaid Students */}
        <Card className="p-5 flex items-center justify-between border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Unpaid Students</span>
            <h3 className="text-xl font-black font-sans text-amber-500">{unpaidStudentsCount}</h3>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <ShieldAlert className="h-5 w-5 animate-pulse" />
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
              placeholder="Search by name or index..." 
              className="pl-9 h-10 border-slate-200 dark:border-slate-800"
              value={filters.search}
              onChange={e => {
                filters.setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Filter Segment Tabs */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0 hidden md:block" />
            
            <div className="flex bg-muted p-1 rounded-lg">
              <button 
                onClick={() => { filters.setStatus("ALL"); setCurrentPage(1); }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  filters.status === "ALL" 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All
              </button>
              <button 
                onClick={() => { filters.setStatus("PAID"); setCurrentPage(1); }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  filters.status === "PAID" 
                    ? "bg-emerald-500 text-white shadow-sm" 
                    : "text-muted-foreground hover:text-emerald-500"
                }`}
              >
                Paid
              </button>
              <button 
                onClick={() => { filters.setStatus("UNPAID"); setCurrentPage(1); }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  filters.status === "UNPAID" 
                    ? "bg-amber-500 text-white shadow-sm" 
                    : "text-muted-foreground hover:text-amber-500"
                }`}
              >
                Unpaid
              </button>
            </div>
            
            <div className="flex bg-muted p-1 rounded-lg ml-2">
              <button 
                onClick={() => { filters.setMethod("ALL"); setCurrentPage(1); }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  filters.method === "ALL" 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All Methods
              </button>
              <button 
                onClick={() => { filters.setMethod("ONLINE"); setCurrentPage(1); }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  filters.method === "ONLINE" 
                    ? "bg-primary text-white shadow-sm" 
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                Online
              </button>
              <button 
                onClick={() => { filters.setMethod("CASH"); setCurrentPage(1); }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  filters.method === "CASH" 
                    ? "bg-amber-600 text-white shadow-sm" 
                    : "text-muted-foreground hover:text-amber-600"
                }`}
              >
                Cash Counter
              </button>
            </div>
          </div>
        </div>

        {/* Payments Table list */}
        <div className="overflow-x-auto">
          <FeeManagementTable 
            loading={loading}
            paginatedStudents={paginatedStudents}
            totalStudents={totalStudents}
            startIndex={startIndex}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onToggleMonthlyFee={handleToggleMonthlyFeeStatus}
            onViewHistory={handleViewHistory}
          />
        </div>
      </Card>

      {/* Payment History Modal */}
      <PaymentHistoryModal 
        studentHistory={studentHistory}
        historyLoading={historyLoading}
        onClose={() => { setSelectedStudent(null); setStudentHistory(null); }}
      />
    </div>
  );
}
