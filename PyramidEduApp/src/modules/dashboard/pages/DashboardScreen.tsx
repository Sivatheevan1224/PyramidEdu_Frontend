import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, DimensionValue } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LineChart } from "react-native-chart-kit";
import { useRouter } from "expo-router";
import {
  Wallet,
  BrainCircuit,
  QrCode,
  TrendingUp,
  BookOpen,
  Sparkles,
  Award,
  Calendar,
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
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([]);
  const [loadingExams, setLoadingExams] = useState(false);
  const [performanceHistory, setPerformanceHistory] = useState<any[]>([]);
  const [loadingPerformance, setLoadingPerformance] = useState(false);
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
    const fetchClasses = async () => {
      try {
        const response = await fetch(`${MOBILE_API_BASE_URL}/exams/my-classes`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const json = await response.json();
        if (json.success && Array.isArray(json.data)) {
          setUpcomingClasses(json.data);
        }
      } catch (err) {
        console.error("Error fetching upcoming classes:", err);
      }
    };
    const fetchPerformance = async () => {
      try {
        setLoadingPerformance(true);
        const baseUrl = MOBILE_API_BASE_URL.replace("/mobile", "");
        if (student?.student?.id) {
          const response = await fetch(`${baseUrl}/performance/student/${student.student.id}/history`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const json = await response.json();
          if (json.success && Array.isArray(json.data)) {
            // Sort ascending by date for the graph
            const sortedData = json.data.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            setPerformanceHistory(sortedData);
          }
        }
      } catch (err) {
        console.error("Error fetching performance history:", err);
      } finally {
        setLoadingPerformance(false);
      }
    };

    fetchExams();
    fetchClasses();
    fetchPerformance();
  }, [accessToken, student?.student?.id]);

  const studentName = student?.fullName || "Student";
  const attendance: DimensionValue = student?.student?.attendancePercentage !== undefined ? `${student.student.attendancePercentage}%` : "0%";
  const performance = student?.student?.performanceStatus || "GOOD";
  const rewardPoints = student?.student?.rewardPoints || 0;

  const upcomingEvents = [
    ...upcomingExams.map((exam) => ({
      id: `exam-${exam.id}`,
      type: "EXAM",
      title: exam.examTitle,
      subtitle: `Exam • ${exam.examType}`,
      date: new Date(exam.examDate),
      timeLabel: `${exam.duration || 0} mins`,
      icon: <Award size={22} color={colors.primary} strokeWidth={2} />,
      iconBg: colors.primarySurface,
      onPress: () => router.push("/exams" as any)
    })),
    ...upcomingClasses.map((cls) => ({
      id: `class-${cls.id}`,
      type: "CLASS",
      title: cls.subject?.subjectName || "Subject Class",
      subtitle: `Class • ${cls.teacher?.user?.fullName || "Teacher"}`,
      date: new Date(cls.sessionDate),
      timeLabel: cls.sessionTime,
      icon: <BookOpen size={22} color="#10B981" strokeWidth={2} />,
      iconBg: "#EBFDF5",
      onPress: () => router.push("/timetable" as any)
    }))
  ].sort((a, b) => a.date.getTime() - b.date.getTime());

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
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
            <TouchableOpacity style={{ flex: 1, height: 90, borderRadius: 12, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, justifyContent: "center", alignItems: "center" }} onPress={() => router.push("/fees" as any)}>
              <View style={{ backgroundColor: colors.primarySurface, padding: 8, borderRadius: 20, marginBottom: 6 }}>
                <Wallet size={22} color={colors.primary} strokeWidth={2} />
              </View>
              <Text style={[styles.actionButtonText, { color: colors.textPrimary, fontWeight: "600", fontSize: 12 }]}>Pay Fees</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ flex: 1, height: 90, borderRadius: 12, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, justifyContent: "center", alignItems: "center" }} onPress={() => router.push("/performance" as any)}>
              <View style={{ backgroundColor: colors.primarySurface, padding: 8, borderRadius: 20, marginBottom: 6 }}>
                <TrendingUp size={22} color={colors.primary} strokeWidth={2} />
              </View>
              <Text style={[styles.actionButtonText, { color: colors.textPrimary, fontWeight: "600", fontSize: 12 }]}>Performance</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ flex: 1, height: 90, borderRadius: 12, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, justifyContent: "center", alignItems: "center" }} onPress={() => router.push("/show-marks" as any)}>
              <View style={{ backgroundColor: colors.primarySurface, padding: 8, borderRadius: 20, marginBottom: 6 }}>
                <Award size={22} color={colors.primary} strokeWidth={2} />
              </View>
              <Text style={[styles.actionButtonText, { color: colors.textPrimary, fontWeight: "600", fontSize: 12 }]}>Show Marks</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Attendance & Points Statistics */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Your Overview</Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            {/* Attendance Card */}
            <View style={[styles.card, { flex: 1.2, backgroundColor: colors.surface, borderColor: colors.border, padding: 16, borderRadius: 16, borderWidth: 1, minHeight: 120, justifyContent: "space-between", marginBottom: 0 }]}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <View style={{ flex: 1, marginRight: 4 }}>
                  <Text style={{ fontSize: 10, fontWeight: "700", color: colors.textSecondary, letterSpacing: 0.5 }}>ATTENDANCE</Text>
                  <Text style={{ fontSize: 24, fontWeight: "800", color: colors.textPrimary, marginTop: 4 }}>{attendance}</Text>
                </View>
                <View style={{ backgroundColor: colors.primarySurface, padding: 6, borderRadius: 10 }}>
                  <Calendar size={16} color={colors.primary} />
                </View>
              </View>
              <View style={{ marginTop: 8 }}>
                {/* Progress bar */}
                <View style={{ width: "100%", height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: "hidden" }}>
                  <View style={{ width: attendance, height: "100%", backgroundColor: colors.primary, borderRadius: 3 }} />
                </View>
                <Text style={{ fontSize: 10, color: colors.textTertiary, marginTop: 4 }}>Requires min 75%</Text>
              </View>
            </View>

            {/* Reward Points Card */}
            <View style={[styles.card, { flex: 1, backgroundColor: colors.surface, borderColor: colors.border, padding: 16, borderRadius: 16, borderWidth: 1, minHeight: 120, justifyContent: "space-between", marginBottom: 0 }]}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <View style={{ flex: 1, marginRight: 4 }}>
                  <Text style={{ fontSize: 10, fontWeight: "700", color: colors.textSecondary, letterSpacing: 0.5 }}>REWARDS</Text>
                  <Text style={{ fontSize: 24, fontWeight: "800", color: colors.textPrimary, marginTop: 4 }}>{rewardPoints}</Text>
                </View>
                <View style={{ backgroundColor: "#FEF3C7", padding: 6, borderRadius: 10 }}>
                  <Award size={16} color="#D97706" />
                </View>
              </View>
              <View>
                <Text style={{ fontSize: 11, fontWeight: "700", color: "#D97706" }}>Points Balance</Text>
                <Text style={{ fontSize: 9, color: colors.textTertiary, marginTop: 2 }}>Scan QRs to earn</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Performance Chart Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Academic Progress</Text>
          {loadingPerformance ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : performanceHistory.length > 0 ? (
            <View style={{ marginTop: 8, alignItems: "center", backgroundColor: colors.surface, borderRadius: 12, padding: 8, borderColor: colors.border, borderWidth: 1 }}>
              <LineChart
                data={{
                  labels: performanceHistory.slice(-5).map(p => new Date(p.createdAt).toLocaleDateString(undefined, { month: 'short' })),
                  datasets: [{ data: performanceHistory.slice(-5).map(p => Number(p.finalScore)) }]
                }}
                width={Dimensions.get("window").width - 56}
                height={220}
                yAxisSuffix="%"
                fromZero={true}
                segments={4}
                chartConfig={{
                  backgroundColor: colors.surface,
                  backgroundGradientFrom: colors.surface,
                  backgroundGradientTo: colors.surface,
                  decimalPlaces: 1,
                  color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // primary blue
                  labelColor: (opacity = 1) => colors.textSecondary,
                  style: { borderRadius: 16 },
                  propsForDots: { r: "5", strokeWidth: "2", stroke: colors.surface },
                  propsForLabels: { fontSize: 10 }
                }}
                bezier
                style={{ marginVertical: 8, borderRadius: 16 }}
              />
            </View>
          ) : (
            <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <TrendingUp size={32} color={colors.textSecondary} style={{ marginBottom: 8 }} />
              <Text style={[styles.emptyCardText, { color: colors.textSecondary }]}>No performance data available yet.</Text>
            </View>
          )}
        </View>

        {/* Upcoming Events Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Upcoming Schedule & Events</Text>
          {loadingExams ? (
            <ActivityIndicator color={colors.primary} style={{ marginVertical: 12 }} />
          ) : upcomingEvents.length === 0 ? (
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={{ color: colors.textSecondary, textAlign: "center" }}>No upcoming events scheduled</Text>
            </View>
          ) : (
            upcomingEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={[styles.card, styles.nextClassCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={event.onPress}
              >
                <View style={styles.nextClassInfo}>
                  <Text style={[styles.nextClassLabel, { color: colors.textSecondary }]}>{event.subtitle}</Text>
                  <Text style={[styles.nextClassSubject, { color: colors.textPrimary }]}>{event.title}</Text>
                  <Text style={[styles.nextClassTime, { color: colors.textTertiary }]}>
                    Date: {event.date.toLocaleDateString()} • {event.timeLabel}
                  </Text>
                </View>
                <View style={[styles.nextClassIcon, { backgroundColor: event.iconBg }]}>
                  {event.icon}
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
              <Text style={[styles.aiInsightTitle, { color: colors.textPrimary }]}>Recommendation</Text>
            </View>
            <Text style={[styles.aiInsightText, { color: colors.textSecondary }]}>
              Your current academic performance is classified as <Text style={{ fontWeight: "700", color: colors.textPrimary }}>{performance}</Text>.
              Based on your attendance ({attendance}), you can optimize your results by reviewing study guides in the Learning tab.
            </Text>
            <TouchableOpacity style={[styles.aiInsightButton, { backgroundColor: colors.primary }]} onPress={() => router.push("/recommendations" as any)}>
              <Text style={[styles.aiInsightButtonText, { color: colors.surface }]}>View Recommendations</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <BottomTabNavigator active="home" />
    </SafeAreaView>
  );
}
