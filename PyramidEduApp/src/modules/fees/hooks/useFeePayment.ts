import { useState } from 'react';
import { useRouter } from 'expo-router';
import { feeService } from '../services/api';
import { validateCardDetails } from '../validation/payment.validation';
import { CardDetails } from '../types/fee.types';
import { FEE_CONSTANTS } from '../constants/fee.constants';
import { useFeeStore } from '../store/fee.store';

export const useFeePayment = (paymentAmount: number) => {
  const router = useRouter();
  const { updatePaymentStatus } = useFeeStore();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof CardDetails, string>>>({});

  const processPayment = async (cardDetails: CardDetails) => {
    // 1. Validate form completely before hitting backend
    const validation = validateCardDetails(cardDetails);
    setValidationErrors(validation.errors);

    if (!validation.isValid) {
      setError(FEE_CONSTANTS.MESSAGES.VALIDATION_ERROR);
      return;
    }

    // 2. Begin simulated payment
    setError(null);
    setIsProcessing(true);

    try {
      // Simulate network/bank processing delay
      await new Promise(resolve => setTimeout(resolve, FEE_CONSTANTS.PROCESSING_DELAY_MS));
      
      const response = await feeService.processPayment(paymentAmount, FEE_CONSTANTS.PAYMENT_METHODS.CARD);
      
      if (response.success) {
        // Update global store
        updatePaymentStatus(paymentAmount);
        
        // Route to success screen
        router.replace({
          pathname: "/fees/success",
          params: { transactionId: response.data.id, amount: paymentAmount }
        });
      } else {
        throw new Error("Payment failed on backend");
      }
    } catch (err) {
      setError(FEE_CONSTANTS.MESSAGES.PAYMENT_FAILED);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    error,
    validationErrors,
    processPayment,
  };
};
