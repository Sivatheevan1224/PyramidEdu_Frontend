import { api } from "@/lib/api";

export interface BatchItem {
  id: string;
  batchName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const batchService = {
  getBatches: async (activeOnly?: boolean): Promise<BatchItem[]> => {
    const res = await api.get<{ success: boolean; data: BatchItem[] }>(
      "/batches",
      {
        params: { activeOnly },
      }
    );
    return res.data.data;
  },

  createBatch: async (
    batchName: string,
    isActive: boolean = true
  ): Promise<BatchItem> => {
    const res = await api.post<{ success: boolean; data: BatchItem }>(
      "/batches",
      { batchName, isActive }
    );
    return res.data.data;
  },

  updateBatch: async (
    id: string,
    batchName: string,
    isActive: boolean
  ): Promise<BatchItem> => {
    const res = await api.put<{ success: boolean; data: BatchItem }>(
      `/batches/${id}`,
      { batchName, isActive }
    );
    return res.data.data;
  },

  toggleBatchActive: async (
    id: string,
    isActive: boolean
  ): Promise<BatchItem> => {
    const res = await api.patch<{ success: boolean; data: BatchItem }>(
      `/batches/${id}/toggle-status`,
      { isActive }
    );
    return res.data.data;
  },
};
