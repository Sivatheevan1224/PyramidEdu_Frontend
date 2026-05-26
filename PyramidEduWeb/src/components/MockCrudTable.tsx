"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export interface CrudColumn {
  key: string;
  label: string;
}

interface ChartConfig {
  title: string;
  xKey: string;
  yKey: string;
  data: Array<Record<string, string | number>>;
}

interface MockCrudTableProps {
  title: string;
  description: string;
  columns: CrudColumn[];
  initialRows: Array<Record<string, string>>;
  chart?: ChartConfig;
}

export const MockCrudTable = ({
  title,
  description,
  columns,
  initialRows,
  chart,
}: MockCrudTableProps) => {
  const [rows, setRows] = useState(initialRows);
  const [isOpen, setIsOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formState, setFormState] = useState<Record<string, string>>({});

  const emptyState = useMemo(() => {
    const base: Record<string, string> = {};
    columns.forEach((col) => {
      base[col.key] = "";
    });
    return base;
  }, [columns]);

  const openCreate = () => {
    setFormState({ ...emptyState });
    setEditingIndex(null);
    setIsOpen(true);
  };

  const openEdit = (index: number) => {
    setFormState({ ...rows[index] });
    setEditingIndex(index);
    setIsOpen(true);
  };

  const handleSave = () => {
    if (editingIndex === null) {
      setRows((prev) => [...prev, { ...formState }]);
    } else {
      setRows((prev) =>
        prev.map((row, idx) => (idx === editingIndex ? { ...formState } : row))
      );
    }
    setIsOpen(false);
  };

  const handleDelete = (index: number) => {
    setRows((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button onClick={openCreate}>Add New</Button>
      </div>

      {chart && (
        <Card className="p-4">
          <p className="text-sm font-semibold mb-2">{chart.title}</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey={chart.xKey} stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid hsl(var(--border))",
                }}
              />
              <Line
                type="monotone"
                dataKey={chart.yKey}
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-border last:border-0">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-foreground">
                    {row[col.key]}
                  </td>
                ))}
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(rowIndex)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(rowIndex)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {editingIndex === null ? "Add" : "Edit"} {title}
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {columns.map((col) => (
                <label key={col.key} className="text-sm font-medium text-foreground">
                  {col.label}
                  <input
                    value={formState[col.key] || ""}
                    onChange={(e) =>
                      setFormState((prev) => ({ ...prev, [col.key]: e.target.value }))
                    }
                    className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </label>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
