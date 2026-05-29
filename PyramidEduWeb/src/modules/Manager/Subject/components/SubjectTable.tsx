"use client";

import { Edit3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { StreamItem, SubjectItem } from "../types";

interface SubjectTableProps {
  subjects: SubjectItem[];
  streams: StreamItem[];
  onToggleActive: (subjectId: string) => void;
  onEdit: (subjectId: string) => void;
}

function formatCurrency(value: number) {
  return `Rs. ${new Intl.NumberFormat("en-LK").format(value)}`;
}

export function SubjectTable({
  subjects,
  streams,
  onToggleActive,
  onEdit,
}: SubjectTableProps) {
  const streamMap = new Map(streams.map((stream) => [stream.id, stream.name]));

  return (
    <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-900">Subject List</h2>
        <p className="text-sm text-slate-500">
          All configured subjects with stream mapping and status controls.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3 font-semibold">Subject Name</th>
              <th className="px-5 py-3 font-semibold">Streams</th>
              <th className="px-5 py-3 font-semibold">Fee Per Month</th>
              <th className="px-5 py-3 font-semibold">Active</th>
              <th className="px-5 py-3 font-semibold">Edit</th>
            </tr>
          </thead>
          <tbody>
            {subjects.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-10 text-center text-sm text-slate-500"
                >
                  No subjects found for your search.
                </td>
              </tr>
            )}

            {subjects.map((subject) => (
              <tr
                key={subject.id}
                className="border-t border-slate-100 transition hover:bg-slate-50/70"
              >
                <td className="px-5 py-4 font-medium text-slate-900">
                  {subject.name}
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    {subject.streamIds.map((streamId) => {
                      const streamName = streamMap.get(streamId);
                      if (!streamName) {
                        return null;
                      }

                      return (
                        <Badge
                          key={streamId}
                          variant="secondary"
                          className="rounded-full px-2.5 py-0.5 text-xs"
                        >
                          {streamName}
                        </Badge>
                      );
                    })}
                  </div>
                </td>
                <td className="px-5 py-4 text-slate-700">
                  {formatCurrency(subject.feePerMonth)}
                </td>
                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => onToggleActive(subject.id)}
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${
                      subject.isActive
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-slate-100 text-slate-500"
                    }`}
                  >
                    {subject.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-5 py-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-lg border-slate-200"
                    onClick={() => onEdit(subject.id)}
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
