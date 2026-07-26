import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import BottomTabNavigator from "../../../components/BottomTabNavigator";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { useFeeHistory } from "../hooks/useFeeHistory";
import OutstandingBalanceCard from "../components/OutstandingBalanceCard";
import PaymentHistoryList from "../components/PaymentHistoryList";

export default function FeesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.status === "cancelled") {
      Toast.show({
        type: "error",
        text1: "Payment Cancelled",
        text2: "Your transaction was cancelled.",
      });
      router.setParams({ status: undefined });
    } else if (params.status === "failed") {
      Toast.show({
        type: "error",
        text1: "Payment Failed",
        text2: (params.error as string) || "An error occurred during payment.",
      });
      router.setParams({ status: undefined, error: undefined });
    }
  }, [params.status, params.error]);
  const { colors } = useAppTheme();
  const { data, loading, refresh } = useFeeHistory();
  const [refreshing, setRefreshing] = useState(false);

  const totalFeeAmount = data?.totalFeeAmount || 0;
  const paymentStatus = data?.paymentStatus || "PENDING";
  const transactions = data?.history || [];

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refresh();
    } catch (err) {
      console.error("Error refreshing fees data:", err);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top", "bottom", "left", "right"]}>
      {/* Custom Top Header */}
      <View style={[styles.topHeader, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Fees & Payments</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading && !refreshing ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
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
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    height: 56,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
});
