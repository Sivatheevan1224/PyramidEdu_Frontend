export interface FeeTransaction {
  id: string;
  date: string;
  amount: number;
  status: string;
  note: string;
}

export interface FeeHistoryResponse {
  totalFeeAmount: number;
  paymentStatus: string;
  history: FeeTransaction[];
}

export interface ProcessPaymentResponse {
  success: boolean;
  data: {
    id: string;
    studentId: string;
    amount: number;
    paymentStatus: string;
  };
}

export interface CardDetails {
  name: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}
