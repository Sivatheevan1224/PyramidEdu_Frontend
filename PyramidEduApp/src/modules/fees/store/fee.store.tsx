import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FeeHistoryResponse } from '../types/fee.types';
import { feeService } from '../services/api';

interface FeeStoreContextType {
  data: FeeHistoryResponse | null;
  loading: boolean;
  error: string | null;
  fetchFeeData: () => Promise<void>;
  updatePaymentStatus: (amountPaid: number) => void;
}

const FeeStoreContext = createContext<FeeStoreContextType | undefined>(undefined);

export const FeeStoreProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<FeeHistoryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeeData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await feeService.getFeeHistory();
      setData(res.data);
    } catch (err) {
      setError("Failed to fetch fee data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = (amountPaid: number) => {
    if (data) {
      setData({
        ...data,
        totalFeeAmount: Math.max(0, data.totalFeeAmount - amountPaid),
        paymentStatus: "PAID",
      });
    }
  };

  return (
    <FeeStoreContext.Provider value={{ data, loading, error, fetchFeeData, updatePaymentStatus }}>
      {children}
    </FeeStoreContext.Provider>
  );
};

export const useFeeStore = () => {
  const context = useContext(FeeStoreContext);
  if (context === undefined) {
    throw new Error('useFeeStore must be used within a FeeStoreProvider');
  }
  return context;
};
