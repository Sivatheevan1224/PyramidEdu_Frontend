"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookPlus, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  StreamItem,
  SubjectFormValues,
  SubjectItem,
  TeacherOption,
} from "../types";

interface AddSubjectModalProps {
  isOpen: boolean;
  streams: StreamItem[];
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
  teachers,
  isSaving = false,
  initialValues,
  onClose,
  onSave,
}: AddSubjectModalProps) {
  const [formValues, setFormValues] = useState<SubjectFormValues>(EMPTY_FORM);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (initialValues) {
      setFormValues({
        name: initialValues.name,
        streamIds: initialValues.streamIds,
        feePerMonth: initialValues.feePerMonth,
        isActive: initialValues.isActive,
        // teacher assignment handled via Teacher management
      });
      return;
    }

    setFormValues(EMPTY_FORM);
  }, [isOpen, initialValues]);

  const toggleStream = (streamId: number) => {
    setFormValues((previous) => {
      const exists = previous.streamIds.includes(streamId);
      return {
        ...previous,
        streamIds: exists
          ? previous.streamIds.filter((id) => id !== streamId)
          : [...previous.streamIds, streamId],
      };
    });
  };

  const handleSave = async () => {
    const trimmed = formValues.name.trim();
    if (
      !trimmed ||
      formValues.streamIds.length === 0 ||
      formValues.feePerMonth <= 0
    ) {
    }
    if (
      !trimmed ||
      formValues.streamIds.length === 0 ||
      formValues.feePerMonth <= 0
    ) {
      return;
    }

    const success = await onSave(
      { ...formValues, name: trimmed },
      initialValues?.id,
    );

    if (success) {
      onClose();
    }
  };

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
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Add subject modal"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                  <BookPlus className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    {initialValues ? "Edit Subject" : "Add Subject"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Assign streams, fee, and active status.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-5 px-5 py-5">
              <div className="space-y-2">
                <Label
                  htmlFor="subjectName"
                  className="text-sm font-medium text-slate-700"
                >
                  Subject Name
                </Label>
                <Input
                  id="subjectName"
                  value={formValues.name}
                  onChange={(event) =>
                    setFormValues((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Chemistry"
                  className="h-10 rounded-xl border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                  Available Streams
                </Label>
                <div className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2">
                  {streams.map((stream) => (
                    <label
                      key={stream.id}
                      className="flex cursor-pointer items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-slate-300"
                    >
                      <input
                        type="checkbox"
                        checked={formValues.streamIds.includes(stream.id)}
                        onChange={() => toggleStream(stream.id)}
                        className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                      />
                      <span>{stream.name}</span>
                    </label>
                  ))}
                </div>
                {formValues.streamIds.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formValues.streamIds.map((streamId) => {
                      const stream = streams.find(
                        (item) => item.id === streamId,
                      );
                      if (!stream) {
                        return null;
                      }

                      return (
                        <Badge
                          key={stream.id}
                          variant="secondary"
                          className="rounded-full px-2.5 py-1 text-xs"
                        >
                          {stream.name}
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Teacher assignment moved to Teacher management per new design */}

                <div className="space-y-2">
                  <Label
                    htmlFor="monthlyFee"
                    className="text-sm font-medium text-slate-700"
                  >
                    Fee Per Month
                  </Label>
                  <Input
                    id="monthlyFee"
                    type="number"
                    min={0}
                    value={formValues.feePerMonth}
                    onChange={(event) =>
                      setFormValues((previous) => ({
                        ...previous,
                        feePerMonth: Number(event.target.value),
                      }))
                    }
                    placeholder="2600"
                    className="h-10 rounded-xl border-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Active Status
                  </Label>
                  <button
                    type="button"
                    onClick={() =>
                      setFormValues((previous) => ({
                        ...previous,
                        isActive: !previous.isActive,
                      }))
                    }
                    className={`flex h-10 w-full items-center justify-between rounded-xl border px-3 text-sm font-medium transition ${
                      formValues.isActive
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-slate-100 text-slate-600"
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

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-4">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
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
