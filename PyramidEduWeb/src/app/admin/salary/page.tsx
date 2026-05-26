import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { Wallet, CheckCircle, Clock, DollarSign } from "lucide-react";

const approvals = [
  { staff: "A. Sivatheevan", role: "Manager", amount: "Rs. 150,000", status: "Pending" },
  { staff: "F. Malik", role: "Teacher", amount: "Rs. 120,000", status: "Pending" },
  { staff: "K. Kowsika", role: "Support", amount: "Rs. 90,000", status: "Approved" },
];

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Salary Management</h2>
        <p className="text-sm text-muted-foreground">Review staff payouts and approvals.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Payroll" value="Rs. 760k" icon={Wallet} accent="primary" />
        <StatCard label="Approved" value="22" icon={CheckCircle} accent="accent" />
        <StatCard label="Pending" value="6" icon={Clock} accent="warning" />
        <StatCard label="Next Run" value="May 30" icon={DollarSign} accent="secondary" />
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Staff</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Role</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {approvals.map((row) => (
              <tr key={row.staff} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-foreground">{row.staff}</td>
                <td className="px-4 py-3 text-foreground">{row.role}</td>
                <td className="px-4 py-3 text-foreground">{row.amount}</td>
                <td className="px-4 py-3 text-foreground">{row.status}</td>
                <td className="px-4 py-3 text-right">
                  <Button size="sm" variant="outline">Approve</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
