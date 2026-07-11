import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, BackHandler } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CheckCircle2, Copy, FileText, ChevronRight } from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAppTheme } from "../../../hooks/useAppTheme";

export default function PaymentSuccessScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const { transactionId, amount } = useLocalSearchParams();

  // Prevent going back to the payment gateway
  useEffect(() => {
    const onBackPress = () => {
      router.replace("/fees");
      return true;
    };
    BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  }, [router]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        
        {/* Success Animation Area */}
        <View style={styles.iconContainer}>
          <View style={[styles.iconBg, { backgroundColor: "rgba(16, 185, 129, 0.1)" }]}>
            <CheckCircle2 size={80} color="#10b981" />
          </View>
        </View>

        <Text style={[styles.title, { color: colors.textPrimary }]}>Payment Successful!</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Your monthly fee has been processed and your account is now up to date.
        </Text>

        {/* Receipt Card */}
        <View style={[styles.receiptCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.receiptHeader}>
            <FileText size={18} color={colors.primary} />
            <Text style={[styles.receiptTitle, { color: colors.textPrimary }]}>Payment Receipt</Text>
          </View>
          
          <View style={[styles.divider, { borderBottomColor: colors.border }]} />
          
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Amount Paid</Text>
            <Text style={[styles.value, { color: colors.textPrimary, fontWeight: "700" }]}>
              Rs. {Number(amount).toLocaleString()}.00
            </Text>
          </View>
          
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Date & Time</Text>
            <Text style={[styles.value, { color: colors.textPrimary }]}>
              {new Date().toLocaleString()}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Transaction ID</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Text style={[styles.value, { color: colors.textPrimary, fontFamily: "monospace" }]}>
                {transactionId}
              </Text>
              <Copy size={14} color={colors.primary} />
            </View>
          </View>
          
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Payment Method</Text>
            <Text style={[styles.value, { color: colors.textPrimary }]}>Online Card</Text>
          </View>
        </View>

      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.doneButton, { backgroundColor: colors.primary }]}
          onPress={() => router.replace("/fees")}
        >
          <Text style={styles.doneButtonText}>Back to Fees Dashboard</Text>
          <ChevronRight size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 24, justifyContent: "center", alignItems: "center" },
  iconContainer: { marginBottom: 24 },
  iconBg: { width: 120, height: 120, borderRadius: 60, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 8, textAlign: "center" },
  subtitle: { fontSize: 14, textAlign: "center", marginBottom: 32, paddingHorizontal: 20 },
  receiptCard: { width: "100%", borderWidth: 1, borderRadius: 16, padding: 20 },
  receiptHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 },
  receiptTitle: { fontSize: 16, fontWeight: "700" },
  divider: { borderBottomWidth: 1, borderStyle: "dashed", marginBottom: 16 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  label: { fontSize: 13 },
  value: { fontSize: 13, fontWeight: "500" },
  footer: { padding: 24 },
  doneButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 16, borderRadius: 12, gap: 8 },
  doneButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
