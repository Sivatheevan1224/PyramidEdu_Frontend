import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarChart3, TrendingUp, Sparkles, Star } from "lucide-react-native";
import TopBar from "../../../components/TopBar";
import BottomTabNavigator from "../../../components/BottomTabNavigator";
import { Colors } from "../../../constants/colors";
import { useAuth } from "../../auth";
import { MOBILE_API_BASE_URL } from "../../../api/config";

export default function PerformanceScreen() {
  const { student, accessToken } = useAuth();
  const [performanceHistory, setPerformanceHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const attendance = student?.student?.attendancePercentage !== undefined ? `${student.student.attendancePercentage}%` : "0%";
  const performance = student?.student?.performanceStatus || "GOOD";
  const trend = student?.student?.trendStatus || "STABLE";
  const rewardPoints = student?.student?.rewardPoints || 0;

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        setLoading(true);
        const baseUrl = MOBILE_API_BASE_URL.replace("/mobile", "");
        if (student?.student?.id) {
          const response = await fetch(`${baseUrl}/performance/student/${student.student.id}/history`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const json = await response.json();
          if (json.success && Array.isArray(json.data)) {
            // Sort descending by date to get latest first
            const sortedData = json.data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setPerformanceHistory(sortedData);
          }
        }
      } catch (err) {
        console.error("Error fetching performance history:", err);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken && student?.student?.id) {
      fetchPerformance();
    }
  }, [accessToken, student?.student?.id]);

  const latestPrediction = performanceHistory.length > 0 ? performanceHistory[0] : null;

  const getProgressColor = (score: number) => {
    if (score >= 80) return Colors.excellent;
    if (score >= 60) return Colors.good;
    if (score >= 40) return Colors.average;
    return Colors.atRisk;
  };

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
              Current academic trend is <Text style={{ fontWeight: "700" }}>{latestPrediction?.trendStatus || trend}</Text>.
              {latestPrediction?.recommendedActions 
                ? ` ${latestPrediction.recommendedActions}`
                : performance === "AT_RISK"
                  ? " Warnings triggered: Your average indicates some concept gaps. We advise utilizing study materials weekly."
                  : " Keep up the excellent work! You are projected to maintain top decile placement in the final term."}
            </Text>
            <View style={styles.pointsBadge}>
              <Star size={16} color={Colors.primary} style={{ marginRight: 6 }} />
              <Text style={styles.pointsText}>Reward points: {rewardPoints} Points</Text>
            </View>
          </View>
        </View>

        {/* Category Breakdown (Latest) */}
        {latestPrediction && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category Breakdown</Text>
            <View style={styles.breakdownCard}>
              <View style={styles.breakdownItem}>
                <View style={styles.breakdownHeader}>
                  <Text style={styles.breakdownLabel}>Attendance</Text>
                  <Text style={styles.breakdownValue}>{Number(latestPrediction.attendanceScore).toFixed(1)}%</Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${Number(latestPrediction.attendanceScore)}%`, backgroundColor: getProgressColor(Number(latestPrediction.attendanceScore)) }]} />
                </View>
              </View>

              <View style={styles.breakdownItem}>
                <View style={styles.breakdownHeader}>
                  <Text style={styles.breakdownLabel}>Online MCQ Exams</Text>
                  <Text style={styles.breakdownValue}>{Number(latestPrediction.mcqScore).toFixed(1)}%</Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${Number(latestPrediction.mcqScore)}%`, backgroundColor: getProgressColor(Number(latestPrediction.mcqScore)) }]} />
                </View>
              </View>

              <View style={styles.breakdownItem}>
                <View style={styles.breakdownHeader}>
                  <Text style={styles.breakdownLabel}>Online Essay Exams</Text>
                  <Text style={styles.breakdownValue}>{Number(latestPrediction.essayScore).toFixed(1)}%</Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${Number(latestPrediction.essayScore)}%`, backgroundColor: getProgressColor(Number(latestPrediction.essayScore)) }]} />
                </View>
              </View>

              <View style={styles.breakdownItem}>
                <View style={styles.breakdownHeader}>
                  <Text style={styles.breakdownLabel}>Physical/Manual Exams</Text>
                  <Text style={styles.breakdownValue}>{Number(latestPrediction.manualExamScore).toFixed(1)}%</Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${Number(latestPrediction.manualExamScore)}%`, backgroundColor: getProgressColor(Number(latestPrediction.manualExamScore)) }]} />
                </View>
              </View>

              {(latestPrediction.missedExamCount > 0 || latestPrediction.absentManualExamCount > 0) && (
                <View style={styles.exclusionsContainer}>
                  <Text style={styles.exclusionsTitle}>Exclusions:</Text>
                  {latestPrediction.missedExamCount > 0 && (
                    <Text style={styles.exclusionText}>• {latestPrediction.missedExamCount} online exam(s) missed</Text>
                  )}
                  {latestPrediction.absentManualExamCount > 0 && (
                    <Text style={styles.exclusionText}>• Absent for {latestPrediction.absentManualExamCount} physical exam(s)</Text>
                  )}
                </View>
              )}
            </View>
          </View>
        )}

        {/* History Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calculated History</Text>
          {loading ? (
             <ActivityIndicator size="small" color={Colors.primary} style={{ marginTop: 20 }} />
          ) : performanceHistory.length > 0 ? (
            performanceHistory.map((item, idx) => (
              <View key={item.id || idx} style={styles.subjectCard}>
                <View style={styles.subjectHeader}>
                  <Text style={styles.subjectName}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                  <Text style={styles.subjectScore}>{Number(item.finalScore).toFixed(1)}%</Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${item.finalScore}%` }]} />
                </View>
                <Text style={styles.subjectStatus}>Trend: {item.trendStatus}</Text>
              </View>
            ))
          ) : (
            <Text style={{ color: Colors.textSecondary, marginTop: 10 }}>No performance history calculations yet.</Text>
          )}
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
  breakdownCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
  },
  breakdownItem: {
    marginBottom: 16,
  },
  breakdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  breakdownLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  breakdownValue: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  exclusionsContainer: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  exclusionsTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  exclusionText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
    marginLeft: 8,
  },
});
