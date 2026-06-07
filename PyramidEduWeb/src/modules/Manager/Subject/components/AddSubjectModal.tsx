"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookPlus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  StreamItem,
  SubjectFormValues,
  SubjectItem,
  TeacherOption,
} from "../types";
import { BatchItem } from "../../Batches/services/batch.service";

interface AddSubjectModalProps {
  isOpen: boolean;
  streams: StreamItem[];
  batches: BatchItem[];
  teachers: TeacherOption[];
  isSaving?: boolean;
  initialValues?: SubjectItem | null;
  onClose: () => void;
  onSave: (values: SubjectFormValues, editingId?: string) => Promise<boolean>;
}

const EMPTY_FORM: SubjectFormValues = {
  name: "",
  streamIds: [],
  feePerMonth: 0,
  isActive: true,
};

export function AddSubjectModal({
  isOpen,
  streams,
  batches,
  teachers,
  isSaving = false,
  initialValues,
  onClose,
  onSave,
}: AddSubjectModalProps) {
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [formValues, setFormValues] = useState<SubjectFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<{
    name?: string;
    streams?: string;
    feePerMonth?: string;
  }>({});

  useEffect(() => {
    if (!isOpen) return;

    if (initialValues) {
      setFormValues({
        name: initialValues.name,
        streamIds: initialValues.streamIds ?? [],
        feePerMonth: initialValues.feePerMonth,
        isActive: initialValues.isActive,
      });
      return;
    }

    setFormValues(EMPTY_FORM);
  }, [isOpen, initialValues]);

  const toggleStream = (streamId: string) => {
    setFormValues((prev) => {
      const already = prev.streamIds.includes(streamId);
      return {
        ...prev,
        streamIds: already
          ? prev.streamIds.filter((id) => id !== streamId)
          : [...prev.streamIds, streamId],
      };
    });
  };

  const handleSave = async () => {
    const trimmed = formValues.name.trim();
    const nextErrors: { name?: string; streams?: string; feePerMonth?: string } = {};

    if (!trimmed) nextErrors.name = "Subject name is required.";
    if (formValues.streamIds.length === 0)
      nextErrors.streams = "Select at least one stream.";
    if (formValues.feePerMonth <= 0)
      nextErrors.feePerMonth = "Enter a valid monthly fee.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const success = await onSave({ ...formValues, name: trimmed }, initialValues?.id);

    if (success) {
      onClose();
      setErrors({});
    }
  };

  const filteredStreams = streams.filter(
    (s) => s.id && s.name && (!selectedBatch || s.batchIds?.includes(selectedBatch))
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Add subject modal"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400">
                  <BookPlus className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    {initialValues ? "Edit Subject" : "Add Subject"}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    A subject can belong to multiple streams.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-muted hover:text-slate-800 dark:hover:text-foreground"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-5 px-5 py-5">
              {/* Subject Name */}
              <div className="space-y-2">
                <Label htmlFor="subjectName" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Subject Name
                </Label>
                <Input
                  id="subjectName"
                  value={formValues.name}
                  onChange={(e) => setFormValues((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Chemistry"
                  className="h-10 rounded-xl border-border bg-background text-foreground"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Batch filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Filter by Batch (optional)
                </Label>
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="w-full h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">All Batches</option>
                  {batches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.batchName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stream checkboxes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Select Streams
                    <span className="ml-2 text-xs text-muted-foreground font-normal">(select all that apply)</span>
                  </Label>
                  {formValues.streamIds.length > 0 && (
                    <span className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">
                      {formValues.streamIds.length} selected
                    </span>
                  )}
                </div>

                <div className="grid gap-2 rounded-xl border border-border bg-muted/30 p-3 sm:grid-cols-2 max-h-48 overflow-y-auto">
                  {filteredStreams.length === 0 ? (
                    <p className="col-span-2 text-sm text-slate-500 dark:text-slate-400 text-center py-2">
                      No streams available.{selectedBatch ? " Try removing the batch filter." : " Add a stream first."}
                    </p>
                  ) : (
                    filteredStreams.map((stream) => {
                      const isChecked = formValues.streamIds.includes(stream.id);
                      return (
                        <label
                          key={stream.id}
                          className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition select-none ${
                            isChecked
                              ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/20 text-cyan-700 dark:text-cyan-300"
                              : "bg-card dark:bg-slate-900 border-border text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleStream(stream.id)}
                            className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 accent-cyan-600"
                          />
                          <span className="flex-1">{stream.name}</span>
                          {isChecked && (
                            <span className="ml-auto text-cyan-500 dark:text-cyan-400 text-xs">✓</span>
                          )}
                        </label>
                      );
                    })
                  )}
                </div>
                {errors.streams && (
                  <p className="text-sm text-red-600">{errors.streams}</p>
                )}
              </div>

              {/* Fee + Status */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="monthlyFee" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Fee Per Month
                  </Label>
                  <Input
                    id="monthlyFee"
                    type="number"
                    min={0}
                    value={formValues.feePerMonth}
                    onChange={(e) =>
                      setFormValues((prev) => ({ ...prev, feePerMonth: Number(e.target.value) }))
                    }
                    placeholder="2600"
                    className="h-10 rounded-xl border-border bg-background text-foreground"
                  />
                  {errors.feePerMonth && (
                    <p className="mt-1 text-sm text-red-600">{errors.feePerMonth}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Active Status
                  </Label>
                  <button
                    type="button"
                    onClick={() => setFormValues((prev) => ({ ...prev, isActive: !prev.isActive }))}
                    className={`flex h-10 w-full items-center justify-between rounded-xl border px-3 text-sm font-medium transition ${
                      formValues.isActive
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-400"
                        : "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                    }`}
                  >
                    <span>{formValues.isActive ? "Active" : "Inactive"}</span>
                    <span className="text-xs uppercase tracking-wide">
                      {formValues.isActive ? "On" : "Off"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-border bg-background text-foreground"
                onClick={onClose}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="rounded-xl bg-cyan-600 hover:bg-cyan-700"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
