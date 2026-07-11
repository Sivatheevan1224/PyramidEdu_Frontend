import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Wallet, ShieldAlert, ChevronRight } from "lucide-react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { FEE_CONSTANTS } from "../constants/fee.constants";

interface OutstandingBalanceCardProps {
  totalFeeAmount: number;
  paymentStatus: string;
}

export default function OutstandingBalanceCard({ totalFeeAmount, paymentStatus }: OutstandingBalanceCardProps) {
  const { colors } = useAppTheme();
  const router = useRouter();

  const isPaid = paymentStatus === FEE_CONSTANTS.STATUS.PAID || paymentStatus === FEE_CONSTANTS.STATUS.COMPLETED;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.header}>
        <Wallet size={24} color={colors.primary} />
        <Text style={[styles.title, { color: colors.textPrimary }]}>Outstanding Balance</Text>
      </View>
      <Text style={[styles.amount, { color: colors.primary }]}>Rs. {totalFeeAmount.toLocaleString()}.00</Text>
      
      <View style={styles.statusRow}>
        {isPaid ? (
          <>
            <Feather name="check-circle" size={16} color={colors.primary} />
            <Text style={[styles.statusText, { color: colors.primary }]}>Fully Paid</Text>
          </>
        ) : (
          <>
            <ShieldAlert size={16} color={colors.warning} />
            <Text style={[styles.statusText, { color: colors.warning }]}>Payment Pending</Text>
          </>
        )}
      </View>

      {!isPaid && (
        <TouchableOpacity 
          style={[styles.payButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push({ pathname: "/fees/payment", params: { amount: totalFeeAmount } })}
        >
          <Text style={styles.payButtonText}>Pay Now</Text>
          <ChevronRight size={16} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1, borderRadius: 12, padding: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, shadowRadius: 2, elevation: 2,
  },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 8 },
  title: { fontSize: 14, fontWeight: "700" },
  amount: { fontSize: 32, fontWeight: "700", marginBottom: 8 },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 },
  statusText: { fontSize: 13, fontWeight: "600" },
  payButton: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: 12, borderRadius: 8, gap: 8, marginTop: 8
  },
  payButtonText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
});
