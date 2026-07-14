import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { CreditCard, Lock } from "lucide-react-native";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { CardDetails } from "../../types/fee.types";

interface PaymentGatewayFormProps {
  isProcessing: boolean;
  validationErrors: Partial<Record<keyof CardDetails, string>>;
  onDetailsChange: (details: CardDetails) => void;
}

export default function PaymentGatewayForm({ isProcessing, validationErrors, onDetailsChange }: PaymentGatewayFormProps) {
  const { colors } = useAppTheme();
  
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const updateParent = (n: string, c: string, e: string, v: string) => {
    onDetailsChange({ name: n, cardNumber: c, expiry: e, cvv: v });
  };

  const handleNameChange = (val: string) => {
    setName(val);
    updateParent(val, cardNumber, expiry, cvv);
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    const match = cleaned.match(/.{1,4}/g);
    const formatted = match ? match.join(" ") : cleaned;
    setCardNumber(formatted);
    updateParent(name, formatted, expiry, cvv);
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    let formatted = cleaned;
    if (cleaned.length >= 3) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    setExpiry(formatted);
    updateParent(name, cardNumber, formatted, cvv);
  };

  const handleCvvChange = (val: string) => {
    setCvv(val);
    updateParent(name, cardNumber, expiry, val);
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.secureHeader}>
        <Lock size={14} color="#10b981" />
        <Text style={styles.secureText}>256-bit Encrypted Payment</Text>
      </View>

      <View style={[styles.inputGroup, { backgroundColor: colors.surface, borderColor: validationErrors.name ? '#ef4444' : colors.border }]}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Name on Card</Text>
        <TextInput
          style={[styles.input, { color: colors.textPrimary }]}
          placeholder="JOHN DOE"
          placeholderTextColor={colors.textTertiary}
          value={name}
          onChangeText={handleNameChange}
          editable={!isProcessing}
          autoCapitalize="characters"
        />
        {validationErrors.name && <Text style={styles.fieldError}>{validationErrors.name}</Text>}
      </View>

      <View style={[styles.inputGroup, { backgroundColor: colors.surface, borderColor: validationErrors.cardNumber ? '#ef4444' : colors.border }]}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Card Number</Text>
        <View style={styles.inputWithIcon}>
          <CreditCard size={20} color={colors.textSecondary} style={{ marginRight: 8 }} />
          <TextInput
            style={[styles.input, { flex: 1, color: colors.textPrimary }]}
            placeholder="0000 0000 0000 0000"
            placeholderTextColor={colors.textTertiary}
            value={cardNumber}
            onChangeText={formatCardNumber}
            keyboardType="number-pad"
            maxLength={19}
            editable={!isProcessing}
          />
        </View>
        {validationErrors.cardNumber && <Text style={styles.fieldError}>{validationErrors.cardNumber}</Text>}
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.halfInput, { backgroundColor: colors.surface, borderColor: validationErrors.expiry ? '#ef4444' : colors.border }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Expiry (MM/YY)</Text>
          <TextInput
            style={[styles.input, { color: colors.textPrimary }]}
            placeholder="MM/YY"
            placeholderTextColor={colors.textTertiary}
            value={expiry}
            onChangeText={formatExpiry}
            keyboardType="number-pad"
            maxLength={5}
            editable={!isProcessing}
          />
          {validationErrors.expiry && <Text style={styles.fieldError}>{validationErrors.expiry}</Text>}
        </View>
        <View style={[styles.inputGroup, styles.halfInput, { backgroundColor: colors.surface, borderColor: validationErrors.cvv ? '#ef4444' : colors.border }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>CVV</Text>
          <TextInput
            style={[styles.input, { color: colors.textPrimary }]}
            placeholder="123"
            placeholderTextColor={colors.textTertiary}
            value={cvv}
            onChangeText={handleCvvChange}
            keyboardType="number-pad"
            maxLength={4}
            secureTextEntry
            editable={!isProcessing}
          />
          {validationErrors.cvv && <Text style={styles.fieldError}>{validationErrors.cvv}</Text>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: { gap: 16 },
  secureHeader: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 8 },
  secureText: { color: "#10b981", fontSize: 12, fontWeight: "600" },
  inputGroup: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10 },
  label: { fontSize: 11, fontWeight: "600", marginBottom: 4, textTransform: "uppercase" },
  input: { fontSize: 15, fontWeight: "500", padding: 0 },
  inputWithIcon: { flexDirection: "row", alignItems: "center" },
  row: { flexDirection: "row", gap: 16 },
  halfInput: { flex: 1 },
  fieldError: { color: "#ef4444", fontSize: 10, marginTop: 4 },
});
