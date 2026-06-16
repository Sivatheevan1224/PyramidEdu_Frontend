import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  Wallet,
  BrainCircuit,
  QrCode,
  TrendingUp,
  BookOpen,
  Sparkles,
  Award,
} from "lucide-react-native";
import { styles } from "../styles/dashboardStyles";
import TopBar from "../../../components/TopBar";
import BottomTabNavigator from "../../../components/BottomTabNavigator";
import { useAuth } from "../../auth";
import { MOBILE_API_BASE_URL } from "../../../api/config";
import { useAppTheme } from "../../../hooks/useAppTheme";

export default function DashboardScreen() {
  const router = useRouter();
  const { student, accessToken } = useAuth();
  const [upcomingExams, setUpcomingExams] = useState<any[]>([]);
  const [loadingExams, setLoadingExams] = useState(false);
  const { colors } = useAppTheme();

  useEffect(() => {
    if (!accessToken) return;
    const fetchExams = async () => {
      try {
        setLoadingExams(true);
        const baseUrl = MOBILE_API_BASE_URL.replace("/mobile", "");
        const response = await fetch(`${baseUrl}/exams/my-upcoming`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const json = await response.json();
        if (json.success && Array.isArray(json.data)) {
          setUpcomingExams(json.data);
        }
      } catch (err) {
        console.error("Error fetching upcoming exams:", err);
      } finally {
        setLoadingExams(false);
      }
    };
    fetchExams();
  }, [accessToken]);

  const studentName = student?.fullName || "Student";
  const attendance = student?.student?.attendancePercentage !== undefined ? `${student.student.attendancePercentage}%` : "0%";
  const performance = student?.student?.performanceStatus || "GOOD";
  const rewardPoints = student?.student?.rewardPoints || 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["bottom", "left", "right"]}>
      <TopBar />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        
        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.quickActionsScroll}
            scrollEventThrottle={16}
          >
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => router.push("/fees" as any)}>
              <View style={[styles.actionButtonIcon, { backgroundColor: colors.primarySurface }]}>
                <Wallet size={24} color={colors.primary} strokeWidth={2} />
              </View>
              <Text style={[styles.actionButtonText, { color: colors.textPrimary }]}>Pay Fees</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => router.push("/chatbot" as any)}>
              <View style={[styles.actionButtonIcon, { backgroundColor: colors.primarySurface }]}>
                <BrainCircuit size={24} color={colors.primary} strokeWidth={2} />
              </View>
              <Text style={[styles.actionButtonText, { color: colors.textPrimary }]}>Ask AI</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => router.push("/performance" as any)}>
              <View style={[styles.actionButtonIcon, { backgroundColor: colors.primarySurface }]}>
                <TrendingUp size={24} color={colors.primary} strokeWidth={2} />
              </View>
              <Text style={[styles.actionButtonText, { color: colors.textPrimary }]}>Performance</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => router.push("/recommendations" as any)}>
              <View style={[styles.actionButtonIcon, { backgroundColor: colors.primarySurface }]}>
                <Sparkles size={24} color={colors.primary} strokeWidth={2} />
              </View>
              <Text style={[styles.actionButtonText, { color: colors.textPrimary }]}>Tips</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Attendance & Points Statistics */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Your Statistics</Text>
          <View style={[styles.card, styles.attendanceCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.attendanceInfo}>
              <Text style={[styles.attendanceLabel, { color: colors.textSecondary }]}>Attendance Percentage</Text>
              <Text style={[styles.attendanceValue, { color: colors.textPrimary }]}>{attendance}</Text>
              <Text style={[styles.attendanceStatus, { color: colors.primary }]}>Reward Points: {rewardPoints} Pts</Text>
            </View>
            <View style={[styles.attendanceCircle, { backgroundColor: colors.primarySurface, borderColor: colors.primary }]}>
              <Text style={[styles.attendancePercentage, { color: colors.primary }]}>{attendance}</Text>
            </View>
          </View>
        </View>

        {/* Upcoming Exams Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Upcoming Exams</Text>
          {loadingExams ? (
            <ActivityIndicator color={colors.primary} style={{ marginVertical: 12 }} />
          ) : upcomingExams.length === 0 ? (
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={{ color: colors.textSecondary, textAlign: "center" }}>No upcoming exams scheduled</Text>
            </View>
          ) : (
            upcomingExams.map((exam) => (
              <TouchableOpacity
                key={exam.id}
                style={[styles.card, styles.nextClassCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => router.push("/exams" as any)}
              >
                <View style={styles.nextClassInfo}>
                  <Text style={[styles.nextClassLabel, { color: colors.textSecondary }]}>Exam: {exam.examType}</Text>
                  <Text style={[styles.nextClassSubject, { color: colors.textPrimary }]}>{exam.examTitle}</Text>
                  <Text style={[styles.nextClassTime, { color: colors.textTertiary }]}>
                    Date: {new Date(exam.examDate).toLocaleDateString()} • {exam.duration} mins
                  </Text>
                </View>
                <View style={[styles.nextClassIcon, { backgroundColor: colors.primarySurface }]}>
                  <Award size={24} color={colors.primary} strokeWidth={2} />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* AI Insight Card */}
        <View style={styles.section}>
          <View style={[styles.card, styles.aiInsightCard, { backgroundColor: colors.primarySurface, borderColor: colors.primary }]}>
            <View style={styles.aiInsightHeader}>
              <Sparkles size={20} color={colors.primary} strokeWidth={2} />
              <Text style={[styles.aiInsightTitle, { color: colors.textPrimary }]}>AI Recommendation</Text>
            </View>
            <Text style={[styles.aiInsightText, { color: colors.textSecondary }]}>
              Your current academic performance is classified as <Text style={{ fontWeight: "700", color: colors.textPrimary }}>{performance}</Text>.
              Based on your attendance ({attendance}), you can optimize your results by reviewing study guides in the Learning tab.
            </Text>
            <TouchableOpacity style={[styles.aiInsightButton, { backgroundColor: colors.primary }]} onPress={() => router.push("/materials" as any)}>
              <Text style={[styles.aiInsightButtonText, { color: colors.surface }]}>Browse Materials</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <BottomTabNavigator active="home" />
    </SafeAreaView>
  );
}
