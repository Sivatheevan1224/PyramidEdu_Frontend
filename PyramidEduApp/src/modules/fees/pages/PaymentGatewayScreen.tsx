import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAppTheme } from "../../../hooks/useAppTheme";
import PaymentGatewayForm from "../components/PaymentGatewayForm";
import { useFeePayment } from "../hooks/useFeePayment";
import { CardDetails } from "../types/fee.types";

export default function PaymentGatewayScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const { amount } = useLocalSearchParams();
  const paymentAmount = amount ? Number(amount) : 0;

  const { isProcessing, error, validationErrors, processPayment } = useFeePayment(paymentAmount);
  
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    name: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handlePayment = () => {
    processPayment(cardDetails);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top", "left", "right", "bottom"]}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Secure Checkout</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Order Summary */}
          <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total Amount to Pay</Text>
            <Text style={[styles.summaryAmount, { color: colors.primary }]}>Rs. {paymentAmount.toLocaleString()}.00</Text>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* Form */}
          <PaymentGatewayForm
            isProcessing={isProcessing}
            validationErrors={validationErrors}
            onDetailsChange={setCardDetails}
          />

        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
          <TouchableOpacity
            style={[styles.payButton, { backgroundColor: isProcessing ? colors.textTertiary : colors.primary }]}
            onPress={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.payButtonText}>Pay Rs. {paymentAmount.toLocaleString()}.00</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1,
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 16, fontWeight: "700" },
  scrollContent: { padding: 20 },
  summaryCard: {
    padding: 20, borderRadius: 16, borderWidth: 1,
    alignItems: "center", marginBottom: 24,
  },
  summaryLabel: { fontSize: 13, marginBottom: 4 },
  summaryAmount: { fontSize: 32, fontWeight: "800" },
  errorText: { color: "#ef4444", fontSize: 13, textAlign: "center", marginBottom: 16 },
  footer: { padding: 20, borderTopWidth: 1 },
  payButton: { paddingVertical: 16, borderRadius: 12, alignItems: "center" },
  payButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
