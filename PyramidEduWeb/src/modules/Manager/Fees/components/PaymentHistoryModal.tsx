import { FileText, X, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PaymentHistoryModalProps {
  studentHistory: any;
  historyLoading: boolean;
  onClose: () => void;
}

export default function PaymentHistoryModal({ studentHistory, historyLoading, onClose }: PaymentHistoryModalProps) {
  if (!studentHistory && !historyLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white dark:bg-slate-950 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 text-foreground animate-in zoom-in-95 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/10 shrink-0">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold font-sans">Payment History</h3>
            </div>
            {studentHistory && (
              <p className="text-sm text-muted-foreground">
                {studentHistory.studentName} ({studentHistory.indexNumber})
              </p>
            )}
          </div>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50 dark:bg-slate-900/50">
          {historyLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading payment records...</p>
            </div>
          ) : !studentHistory || studentHistory.history.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-muted-foreground">No payment history found for this student.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10 shadow-sm bg-white dark:bg-slate-900">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-white/10">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Payment Date</th>
                    <th className="px-6 py-4 font-semibold">Month</th>
                    <th className="px-6 py-4 font-semibold text-right">Amount</th>
                    <th className="px-6 py-4 font-semibold text-center">Method</th>
                    <th className="px-6 py-4 font-semibold text-center">Status</th>
                    <th className="px-6 py-4 font-semibold">Transaction ID</th>
                    <th className="px-6 py-4 font-semibold">Receipt No</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                  {studentHistory.history.map((record: any, idx: number) => {
                    const mDate = new Date(record.monthYear);
                    const monthLabel = mDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                    const pDate = new Date(record.paymentDate).toLocaleDateString();

                    return (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-foreground whitespace-nowrap">{pDate}</td>
                        <td className="px-6 py-4 font-medium text-primary whitespace-nowrap">{monthLabel}</td>
                        <td className="px-6 py-4 text-right font-extrabold text-foreground whitespace-nowrap">Rs. {record.amount.toLocaleString()}.00</td>
                        <td className="px-6 py-4 text-center">
                          <Badge variant="outline" className={`font-bold capitalize text-[10px] ${
                            record.method === "CARD" 
                              ? "border-primary/20 text-primary bg-primary/5" 
                              : "border-amber-200 text-amber-600 bg-amber-500/5"
                          }`}>
                            {record.method === "CARD" ? "Online" : "Cash Counter"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            record.status === 'COMPLETED' || record.status === 'PAID' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                            'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{record.transactionId}</td>
                        <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{record.receiptNumber || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-white/10 shrink-0 flex justify-end bg-white dark:bg-slate-950 rounded-b-2xl">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="px-6 cursor-pointer"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
