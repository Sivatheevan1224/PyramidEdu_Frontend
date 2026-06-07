"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, FolderPlus, FolderEdit } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddStreamModalProps {
  isOpen: boolean;
  editingStream?: { id: string; name: string; batchIds: string[] } | null;
  batches: { id: string; batchName: string }[];
  onClose: () => void;
  onSave: (streamName: string, batchIds: string[], editingId?: string) => Promise<boolean>;
}

export function AddStreamModal({
  isOpen,
  editingStream,
  batches,
  onClose,
  onSave,
}: AddStreamModalProps) {
  const [streamName, setStreamName] = useState("");
  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setStreamName(editingStream?.name ?? "");
      setSelectedBatches(editingStream?.batchIds ?? []);
    }
  }, [isOpen, editingStream]);

  const handleSave = async () => {
    const name = streamName.trim();
    if (!name) return;

    const success = await onSave(name, selectedBatches, editingStream?.id);
    if (success) {
      onClose();
    }
  };

  const isEditing = Boolean(editingStream);

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
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label={isEditing ? "Edit stream modal" : "Add stream modal"}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                  {isEditing ? (
                    <FolderEdit className="h-4 w-4" />
                  ) : (
                    <FolderPlus className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    {isEditing ? "Edit Stream" : "Add Stream"}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {isEditing
                      ? "Update the stream name."
                      : "Create a new stream for subjects."}
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

            <div className="space-y-3 px-5 py-5">
              <Label
                htmlFor="streamName"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Stream Name
              </Label>
              <Input
                id="streamName"
                value={streamName}
                onChange={(event) => setStreamName(event.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                placeholder="Physical Science Stream"
                className="h-10 rounded-xl border-border bg-background text-foreground"
              />
              
              <Label
                htmlFor="batches"
                className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-4 block"
              >
                Assign Batches
              </Label>
              <div className="grid gap-2 rounded-xl border border-border bg-muted/30 p-3 sm:grid-cols-2 max-h-48 overflow-y-auto">
                {batches.map((batch) => (
                  <label
                    key={batch.id}
                    className="flex cursor-pointer items-center gap-2 rounded-lg bg-card dark:bg-slate-900 border border-border px-3 py-2 text-sm text-slate-700 dark:text-slate-300 transition hover:border-slate-300 dark:hover:border-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBatches.includes(batch.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBatches((prev) => [...prev, batch.id]);
                        } else {
                          setSelectedBatches((prev) => prev.filter((id) => id !== batch.id));
                        }
                      }}
                      className="h-4 w-4 rounded border-slate-300 dark:border-slate-750 text-cyan-600 focus:ring-cyan-500 bg-background"
                    />
                    <span>{batch.batchName}</span>
                  </label>
                ))}
                {batches.length === 0 && (
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    No batches available. Add a batch first.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-border bg-background text-foreground"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700"
                onClick={handleSave}
                disabled={!streamName.trim()}
              >
                {isEditing ? "Save Changes" : "Add Stream"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
