import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarChart3, TrendingUp, Sparkles, Star } from "lucide-react-native";
import TopBar from "../../../components/TopBar";
import BottomTabNavigator from "../../../components/BottomTabNavigator";
import { Colors } from "../../../constants/colors";
import { useAuth } from "../../auth";

export default function PerformanceScreen() {
  const { student } = useAuth();

  const attendance = student?.student?.attendancePercentage !== undefined ? `${student.student.attendancePercentage}%` : "0%";
  const performance = student?.student?.performanceStatus || "GOOD";
  const trend = student?.student?.trendStatus || "STABLE";
  const rewardPoints = student?.student?.rewardPoints || 0;

  // Static performance distributions compatible with the schema
  const subjectAverages = [
    { subject: "Mathematics", score: 88, status: "Excellent" },
    { subject: "Physics", score: 68, status: "Needs Improvement" },
    { subject: "Chemistry", score: 79, status: "Good" },
    { subject: "English", score: 85, status: "Good" },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <TopBar />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Core Metrics Grid */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <BarChart3 size={20} color={Colors.primary} />
            <Text style={styles.metricLabel}>Attendance</Text>
            <Text style={styles.metricValue}>{attendance}</Text>
          </View>
          <View style={styles.metricCard}>
            <TrendingUp size={20} color={Colors.primary} />
            <Text style={styles.metricLabel}>Performance Level</Text>
            <Text style={styles.metricValue}>{performance}</Text>
          </View>
        </View>

        {/* AI Prediction Section */}
        <View style={styles.section}>
          <View style={styles.aiPredictionCard}>
            <View style={styles.aiHeader}>
              <Sparkles size={20} color={Colors.primary} />
              <Text style={styles.aiTitle}>AI Performance Prediction</Text>
            </View>
            <Text style={styles.aiText}>
              Current academic trend is <Text style={{ fontWeight: "700" }}>{trend}</Text>.
              {performance === "AT_RISK"
                ? " Warnings triggered: Your average indicates some concept gaps. We advise utilizing study materials weekly."
                : " Keep up the excellent work! You are projected to maintain top decile placement in the final term."}
            </Text>
            <View style={styles.pointsBadge}>
              <Star size={16} color={Colors.primary} style={{ marginRight: 6 }} />
              <Text style={styles.pointsText}>Reward points: {rewardPoints} Points</Text>
            </View>
          </View>
        </View>

        {/* Subject wise Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assessment Performance</Text>
          {subjectAverages.map((item, idx) => (
            <View key={idx} style={styles.subjectCard}>
              <View style={styles.subjectHeader}>
                <Text style={styles.subjectName}>{item.subject}</Text>
                <Text style={styles.subjectScore}>{item.score}%</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${item.score}%` }]} />
              </View>
              <Text style={styles.subjectStatus}>{item.status}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      <BottomTabNavigator active="profile" />
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
  metricsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    gap: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
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
  aiPredictionCard: {
    backgroundColor: Colors.primarySurface,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  aiTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  aiText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  pointsBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pointsText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  subjectCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 12,
  },
  subjectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  subjectName: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  subjectScore: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.primary,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.secondaryLight,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  subjectStatus: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
});
