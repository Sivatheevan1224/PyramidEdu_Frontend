"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { BatchItem, batchService } from "./services/batch.service";
import { BatchTable } from "./components/BatchTable";
import { AddBatchModal } from "./components/AddBatchModal";

export default function BatchManagement() {
  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<BatchItem | null>(null);

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    setIsLoading(true);
    try {
      const data = await batchService.getBatches();
      setBatches(data);
    } catch (error: any) {
      console.error("Failed to load batches", error);
      toast.error(error?.response?.data?.message ?? "Failed to load batches");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBatch = async (
    batchName: string,
    isActive: boolean,
    editingId?: string
  ) => {
    setIsSaving(true);
    try {
      if (editingId) {
        const updated = await batchService.updateBatch(editingId, batchName, isActive);
        setBatches((prev) =>
          prev.map((b) => (b.id === editingId ? updated : b))
        );
        toast.success("Batch updated successfully");
      } else {
        const created = await batchService.createBatch(batchName, isActive);
        setBatches((prev) => [created, ...prev]);
        toast.success("Batch created successfully");
      }
      return true;
    } catch (error: any) {
      console.error("Failed to save batch", error);
      toast.error(error?.response?.data?.message ?? "Failed to save batch");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (id: string) => {
    const current = batches.find((b) => b.id === id);
    if (!current) return;

    const nextState = !current.isActive;

    // Optimistic UI update
    setBatches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: nextState } : b))
    );

    try {
      const updated = await batchService.toggleBatchActive(id, nextState);
      setBatches((prev) =>
        prev.map((b) => (b.id === id ? updated : b))
      );
    } catch (error: any) {
      // Revert optimistic update
      setBatches((prev) =>
        prev.map((b) => (b.id === id ? { ...b, isActive: current.isActive } : b))
      );
      toast.error(error?.response?.data?.message ?? "Failed to update status");
    }
  };

  const handleEdit = (id: string) => {
    const target = batches.find((b) => b.id === id);
    if (target) {
      setEditingBatch(target);
      setIsAddModalOpen(true);
    }
  };

  const handleOpenAdd = () => {
    setEditingBatch(null);
    setIsAddModalOpen(true);
  };

  return (
    <div className="space-y-5 p-4 sm:p-6 lg:p-8">
      <Card className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-foreground">Batches</h1>
          <p className="text-sm text-muted-foreground">Manage batches</p>
        </div>
        <Button
          onClick={handleOpenAdd}
          className="h-9 rounded-xl bg-cyan-600 px-4 text-sm font-semibold hover:bg-cyan-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Batch
        </Button>
      </Card>

      {isLoading ? (
        <Card className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground shadow-sm">
          Loading batches...
        </Card>
      ) : (
        <BatchTable
          batches={batches}
          onToggleActive={handleToggleActive}
          onEdit={handleEdit}
        />
      )}

      <AddBatchModal
        isOpen={isAddModalOpen}
        isSaving={isSaving}
        initialValues={editingBatch}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveBatch}
      />
    </div>
  );
}
