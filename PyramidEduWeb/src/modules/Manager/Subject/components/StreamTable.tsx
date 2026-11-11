"use client";

import { Edit3, Ban, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StreamItem } from "../types";
import { BatchItem } from "../../Batches/services/batch.service";

interface StreamTableProps {
  streams: StreamItem[];
  batches: BatchItem[];
  onToggleActive: (streamId: string) => void;
  onEdit: (stream: StreamItem) => void;
}

export function StreamTable({ streams, batches, onToggleActive, onEdit }: StreamTableProps) {
  return (
    <Card className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border bg-muted/40 px-5 py-4">
        <h2 className="text-base font-semibold text-foreground">Stream List</h2>
        <p className="text-sm text-muted-foreground">
          All configured streams available for subject assignment.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-semibold">#</th>
              <th className="px-5 py-3 font-semibold">Stream Name</th>
              <th className="px-5 py-3 font-semibold">Batches</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {streams.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-10 text-center text-sm text-slate-500"
                >
                  No streams found. Click &quot;Add Stream&quot; to create one.
                </td>
              </tr>
            )}

            {streams.map((stream, index) => (
              <tr
                key={stream.id}
                className="border-t border-border transition hover:bg-muted/40"
              >
                <td className="px-5 py-4 text-muted-foreground text-xs font-mono">
                  {index + 1}
                </td>
                <td className="px-5 py-4 font-medium text-foreground">
                  {stream.name}
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-1">
                    {stream.batchIds && stream.batchIds.length > 0 ? (
                      stream.batchIds.map((batchId) => {
                        const batch = batches.find((b) => b.id === batchId);
                        return batch ? (
                          <span
                            key={batchId}
                            className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                          >
                            {batch.batchName}
                          </span>
                        ) : null;
                      })
                    ) : (
                      <span className="text-xs text-muted-foreground italic">None</span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                      stream.isActive !== false
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-400"
                        : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-400"
                    }`}
                  >
                    {stream.isActive !== false ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 rounded-lg border-border bg-background text-foreground hover:bg-muted"
                      onClick={() => onEdit(stream)}
                    >
                      <Edit3 className="mr-1 h-3.5 w-3.5" /> Edit
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className={`h-8 rounded-lg border transition ${
                        stream.isActive !== false
                          ? "border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 dark:border-rose-900/50 dark:hover:bg-rose-950/40 dark:text-rose-400"
                          : "border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 dark:border-emerald-900/50 dark:hover:bg-emerald-950/40 dark:text-emerald-400"
                      }`}
                      onClick={() => onToggleActive(stream.id)}
                    >
                      {stream.isActive !== false ? (
                        <>
                          <Ban className="mr-1 h-3.5 w-3.5" /> Disable
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-1 h-3.5 w-3.5" /> Enable
                        </>
                      )}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
