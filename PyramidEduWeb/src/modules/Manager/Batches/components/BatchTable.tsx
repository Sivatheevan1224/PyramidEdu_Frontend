import { Edit3 } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BatchItem } from "../services/batch.service";

interface BatchTableProps {
  batches: BatchItem[];
  onToggleActive: (batchId: string) => void;
  onEdit: (batchId: string) => void;
}

export function BatchTable({
  batches,
  onToggleActive,
  onEdit,
}: BatchTableProps) {
  return (
    <Card className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border bg-muted/40 px-5 py-4">
        <h2 className="text-base font-semibold text-foreground">Batch List</h2>
        <p className="text-sm text-muted-foreground">
          Manage system batches (e.g. 2024 AL, 2025 AL).
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-semibold">Batch Name</th>
              <th className="px-5 py-3 font-semibold">Created Date</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {batches.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-10 text-center text-sm text-slate-500"
                >
                  No batches found.
                </td>
              </tr>
            )}

            {batches.map((batch) => (
              <tr
                key={batch.id}
                className="border-t border-border transition hover:bg-muted/40"
              >
                <td className="px-5 py-4 font-medium text-foreground">
                  {batch.batchName}
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {format(new Date(batch.createdAt), "MMM d, yyyy")}
                </td>
                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => onToggleActive(batch.id)}
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${
                      batch.isActive
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-400"
                        : "border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                    }`}
                  >
                    {batch.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-5 py-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-lg border-border bg-background text-foreground"
                    onClick={() => onEdit(batch.id)}
                  >
                    <Edit3 className="mr-1 h-3.5 w-3.5" /> Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
