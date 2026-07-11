import { CardDetails } from "../types/fee.types";

export interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof CardDetails, string>>;
}

export const validateCardDetails = (details: CardDetails): ValidationResult => {
  const errors: Partial<Record<keyof CardDetails, string>> = {};

  // Validate Name
  if (!details.name || details.name.trim().length < 3) {
    errors.name = "Name on card must be at least 3 characters long.";
  }

  // Validate Card Number (16 digits minimum, spaces allowed but ignored in count)
  const rawCardNumber = details.cardNumber.replace(/\D/g, "");
  if (rawCardNumber.length < 16) {
    errors.cardNumber = "Card number must be 16 digits.";
  }

  // Validate Expiry (MM/YY)
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(details.expiry)) {
    errors.expiry = "Invalid expiry date format (MM/YY).";
  } else {
    // Optional: check if card is actually expired
    const [month, year] = details.expiry.split('/');
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = parseInt(now.getFullYear().toString().slice(2, 4), 10);
    const expMonth = parseInt(month, 10);
    const expYear = parseInt(year, 10);

    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      errors.expiry = "Card has expired.";
    }
  }

  // Validate CVV (3 or 4 digits)
  if (!/^\d{3,4}$/.test(details.cvv)) {
    errors.cvv = "CVV must be 3 or 4 digits.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
