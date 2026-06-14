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
import { Colors } from "../../../constants/colors";
import { useAuth } from "../../auth";
import { MOBILE_API_BASE_URL } from "../../../api/config";

export default function DashboardScreen() {
  const router = useRouter();
  const { student, accessToken } = useAuth();
  const [upcomingExams, setUpcomingExams] = useState<any[]>([]);
  const [loadingExams, setLoadingExams] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    const fetchExams = async () => {
      try {
        setLoadingExams(true);
        // Upcoming exams endpoint is at /api/v1/exams/my-upcoming
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
    <SafeAreaView style={styles.container}>
      <TopBar />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingTitle}>Hi, {studentName} 👋</Text>
          <Text style={styles.greetingSubtitle}>
            Index Number: {student?.student?.indexNumber || "Pending"}
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.quickActionsTitle}>Quick Access</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.quickActionsScroll}
            scrollEventThrottle={16}
          >
            <TouchableOpacity style={styles.actionButton} onPress={() => router.push("/fees" as any)}>
              <View style={styles.actionButtonIcon}>
                <Wallet size={24} color={Colors.primary} strokeWidth={2} />
              </View>
              <Text style={styles.actionButtonText}>Pay Fees</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => router.push("/chatbot" as any)}>
              <View style={styles.actionButtonIcon}>
                <BrainCircuit size={24} color={Colors.primary} strokeWidth={2} />
              </View>
              <Text style={styles.actionButtonText}>Ask AI</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => router.push("/performance" as any)}>
              <View style={styles.actionButtonIcon}>
                <TrendingUp size={24} color={Colors.primary} strokeWidth={2} />
              </View>
              <Text style={styles.actionButtonText}>Performance</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => router.push("/recommendations" as any)}>
              <View style={styles.actionButtonIcon}>
                <Sparkles size={24} color={Colors.primary} strokeWidth={2} />
              </View>
              <Text style={styles.actionButtonText}>Tips</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Attendance & Points Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Statistics</Text>
          <View style={[styles.card, styles.attendanceCard]}>
            <View style={styles.attendanceInfo}>
              <Text style={styles.attendanceLabel}>Attendance Percentage</Text>
              <Text style={styles.attendanceValue}>{attendance}</Text>
              <Text style={styles.attendanceStatus}>Reward Points: {rewardPoints} Pts</Text>
            </View>
            <View style={styles.attendanceCircle}>
              <Text style={styles.attendancePercentage}>{attendance}</Text>
            </View>
          </View>
        </View>

        {/* Upcoming Exams Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Exams</Text>
          {loadingExams ? (
            <ActivityIndicator color={Colors.primary} style={{ marginVertical: 12 }} />
          ) : upcomingExams.length === 0 ? (
            <View style={styles.card}>
              <Text style={styles.greetingSubtitle}>No upcoming exams scheduled</Text>
            </View>
          ) : (
            upcomingExams.map((exam) => (
              <TouchableOpacity
                key={exam.id}
                style={[styles.card, styles.nextClassCard]}
                onPress={() => router.push("/exams" as any)}
              >
                <View style={styles.nextClassInfo}>
                  <Text style={styles.nextClassLabel}>Exam: {exam.examType}</Text>
                  <Text style={styles.nextClassSubject}>{exam.examTitle}</Text>
                  <Text style={styles.nextClassTime}>
                    Date: {new Date(exam.examDate).toLocaleDateString()} • {exam.duration} mins
                  </Text>
                </View>
                <View style={styles.nextClassIcon}>
                  <Award size={24} color={Colors.primary} strokeWidth={2} />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* AI Insight Card */}
        <View style={styles.section}>
          <View style={[styles.card, styles.aiInsightCard]}>
            <View style={styles.aiInsightHeader}>
              <Sparkles size={20} color={Colors.primary} strokeWidth={2} />
              <Text style={styles.aiInsightTitle}>AI Recommendation</Text>
            </View>
            <Text style={styles.aiInsightText}>
              Your current academic performance is classified as <Text style={{ fontWeight: "700" }}>{performance}</Text>.
              Based on your attendance ({attendance}), you can optimize your results by reviewing study guides in the Learning tab.
            </Text>
            <TouchableOpacity style={styles.aiInsightButton} onPress={() => router.push("/materials" as any)}>
              <Text style={styles.aiInsightButtonText}>Browse Materials</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <BottomTabNavigator active="home" />
    </SafeAreaView>
  );
}
