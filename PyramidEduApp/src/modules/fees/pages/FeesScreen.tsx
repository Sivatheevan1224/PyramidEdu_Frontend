import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Wallet, ShieldAlert, CheckCircle } from "lucide-react-native";
import TopBar from "../../../components/TopBar";
import BottomTabNavigator from "../../../components/BottomTabNavigator";
import { Colors } from "../../../constants/colors";
import { useAuth } from "../../auth";

export default function FeesScreen() {
  const { student } = useAuth();

  const totalFeeAmount = student?.student?.totalFeeAmount || 0;
  const paymentStatus = student?.student?.paymentStatus || "PENDING";

  const transactions = [
    { id: "INV-9021", date: "June 05, 2026", amount: 12000, status: "PAID", note: "Term Registration Fee" },
    { id: "INV-8743", date: "May 10, 2026", amount: 5000, status: "PAID", note: "Lab Facility Access" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <TopBar />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Outstanding Balance */}
        <View style={styles.section}>
          <View style={styles.card}>
            <View style={styles.header}>
              <Wallet size={24} color={Colors.primary} />
              <Text style={styles.title}>Outstanding Balance</Text>
            </View>
            <Text style={styles.amount}>Rs. {totalFeeAmount.toLocaleString()}.00</Text>
            <View style={styles.statusRow}>
              {paymentStatus === "PAID" ? (
                <>
                  <CheckCircle size={16} color={Colors.primary} />
                  <Text style={[styles.statusText, { color: Colors.primary }]}>Fully Paid</Text>
                </>
              ) : (
                <>
                  <ShieldAlert size={16} color={Colors.warning} />
                  <Text style={[styles.statusText, { color: Colors.warning }]}>Payment Pending</Text>
                </>
              )}
            </View>
          </View>
        </View>

        {/* History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment History</Text>
          {transactions.map((t) => (
            <View key={t.id} style={styles.transactionCard}>
              <View style={styles.tHeader}>
                <View>
                  <Text style={styles.tInvoice}>{t.id}</Text>
                  <Text style={styles.tDate}>{t.date}</Text>
                </View>
                <Text style={styles.tAmount}>Rs. {t.amount.toLocaleString()}.00</Text>
              </View>
              <Text style={styles.tNote}>{t.note}</Text>
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
    backgroundColor: Colors.background,
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
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
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
    color: Colors.textPrimary,
  },
  amount: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.primary,
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
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
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
    color: Colors.textPrimary,
  },
  tDate: {
    fontSize: 11,
    color: Colors.textTertiary,
  },
  tAmount: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.primary,
  },
  tNote: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
