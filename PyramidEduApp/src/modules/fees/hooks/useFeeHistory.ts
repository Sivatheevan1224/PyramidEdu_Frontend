import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useFeeStore } from '../store/fee.store';

export const useFeeHistory = () => {
  const { data, loading, error, fetchFeeData } = useFeeStore();

  useFocusEffect(
    useCallback(() => {
      fetchFeeData();
    }, [])
  );

  return {
    data,
    loading,
    error,
    refresh: fetchFeeData,
  };
};
