import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { FeeTransaction } from "../types/fee.types";
import { FEE_CONSTANTS } from "../constants/fee.constants";

interface PaymentHistoryListProps {
  transactions: FeeTransaction[];
}

export default function PaymentHistoryList({ transactions }: PaymentHistoryListProps) {
  const { colors } = useAppTheme();

  if (transactions.length === 0) {
    return (
      <View style={[styles.emptyCard, { borderColor: colors.border }]}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          {FEE_CONSTANTS.MESSAGES.NO_HISTORY}
        </Text>
      </View>
    );
  }

  return (
    <>
      {transactions.map((t) => (
        <View key={t.id} style={[styles.transactionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.tHeader}>
            <View>
              <Text style={[styles.tInvoice, { color: colors.textPrimary }]}>{t.id}</Text>
              <Text style={[styles.tDate, { color: colors.textTertiary }]}>{t.date}</Text>
            </View>
            <Text style={[styles.tAmount, { color: colors.primary }]}>Rs. {t.amount.toLocaleString()}.00</Text>
          </View>
          <Text style={[styles.tNote, { color: colors.textSecondary }]}>{t.note}</Text>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  emptyCard: { borderWidth: 1, borderStyle: 'dashed', borderRadius: 12, padding: 30, alignItems: 'center' },
  emptyText: { fontSize: 13 },
  transactionCard: { borderWidth: 1, borderRadius: 12, padding: 16, marginBottom: 10 },
  tHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  tInvoice: { fontSize: 13, fontWeight: "700" },
  tDate: { fontSize: 11 },
  tAmount: { fontSize: 14, fontWeight: "700" },
  tNote: { fontSize: 12 },
});
