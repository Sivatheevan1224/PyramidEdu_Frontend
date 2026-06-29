import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Wallet, ShieldAlert } from "lucide-react-native";
import { Feather } from "@expo/vector-icons";
import TopBar from "../../../components/TopBar";
import BottomTabNavigator from "../../../components/BottomTabNavigator";
import { useAuth } from "../../auth";
import { useAppTheme } from "../../../hooks/useAppTheme";

export default function FeesScreen() {
  const { student } = useAuth();
  const { colors } = useAppTheme();

  const totalFeeAmount = student?.student?.totalFeeAmount || 0;
  const paymentStatus = student?.student?.paymentStatus || "PENDING";

  const transactions = [
    { id: "INV-9021", date: "June 05, 2026", amount: 12000, status: "PAID", note: "Term Registration Fee" },
    { id: "INV-8743", date: "May 10, 2026", amount: 5000, status: "PAID", note: "Lab Facility Access" },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["bottom", "left", "right"]}>
      <TopBar />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Outstanding Balance */}
        <View style={styles.section}>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.header}>
              <Wallet size={24} color={colors.primary} />
              <Text style={[styles.title, { color: colors.textPrimary }]}>Outstanding Balance</Text>
            </View>
            <Text style={[styles.amount, { color: colors.primary }]}>Rs. {totalFeeAmount.toLocaleString()}.00</Text>
            <View style={styles.statusRow}>
              {paymentStatus === "PAID" ? (
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
          </View>
        </View>

        {/* History */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Payment History</Text>
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
        </View>
      </ScrollView>

      <BottomTabNavigator active="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
  },
  amount: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
  },
  transactionCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  tHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  tInvoice: {
    fontSize: 13,
    fontWeight: "700",
  },
  tDate: {
    fontSize: 11,
  },
  tAmount: {
    fontSize: 14,
    fontWeight: "700",
  },
  tNote: {
    fontSize: 12,
  },
});
