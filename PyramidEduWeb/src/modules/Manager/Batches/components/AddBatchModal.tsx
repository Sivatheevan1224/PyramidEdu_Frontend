import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BatchItem } from "../services/batch.service";

interface AddBatchModalProps {
  isOpen: boolean;
  isSaving: boolean;
  initialValues: BatchItem | null;
  onClose: () => void;
  onSave: (
    batchName: string,
    isActive: boolean,
    editingId?: string
  ) => Promise<boolean>;
}

export function AddBatchModal({
  isOpen,
  isSaving,
  initialValues,
  onClose,
  onSave,
}: AddBatchModalProps) {
  const [batchName, setBatchName] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (isOpen) {
      if (initialValues) {
        setBatchName(initialValues.batchName);
        setIsActive(initialValues.isActive);
      } else {
        setBatchName("");
        setIsActive(true);
      }
    }
  }, [isOpen, initialValues]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchName.trim()) return;

    const success = await onSave(batchName, isActive, initialValues?.id);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            {initialValues ? "Edit Batch" : "Add Batch"}
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="batchName">Batch Name</Label>
            <Input
              id="batchName"
              placeholder="e.g. 2024 AL"
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
              disabled={isSaving}
              required
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 p-3">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium text-foreground">
                Active Status
              </Label>
              <p className="text-xs text-muted-foreground">
                Only active batches appear in selection lists.
              </p>
            </div>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => setIsActive((prev) => !prev)}
              className={`flex h-9 w-20 items-center justify-center rounded-full border text-xs font-semibold uppercase tracking-wide transition ${
                isActive
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-400"
                  : "border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </button>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving || !batchName.trim()}>
              {isSaving ? "Saving..." : initialValues ? "Save Changes" : "Create Batch"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
