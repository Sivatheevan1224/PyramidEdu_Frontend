import React from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../../../components/TopBar";
import BottomTabNavigator from "../../../components/BottomTabNavigator";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { useFeeHistory } from "../hooks/useFeeHistory";
import OutstandingBalanceCard from "../components/OutstandingBalanceCard";
import PaymentHistoryList from "../components/PaymentHistoryList";

export default function FeesScreen() {
  const { colors } = useAppTheme();
  const { data, loading } = useFeeHistory();

  const totalFeeAmount = data?.totalFeeAmount || 0;
  const paymentStatus = data?.paymentStatus || "PENDING";
  const transactions = data?.history || [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["bottom", "left", "right"]}>
      <TopBar />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Outstanding Balance */}
          <View style={styles.section}>
            <OutstandingBalanceCard totalFeeAmount={totalFeeAmount} paymentStatus={paymentStatus} />
          </View>

          {/* History */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Payment History</Text>
            <PaymentHistoryList transactions={transactions} />
          </View>
        </ScrollView>
      )}

      <BottomTabNavigator active="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { padding: 16, paddingBottom: 100 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 14, fontWeight: "700", marginBottom: 12 },
});
