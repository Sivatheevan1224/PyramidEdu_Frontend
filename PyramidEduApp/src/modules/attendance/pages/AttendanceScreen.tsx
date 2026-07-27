import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarChart3, ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";
import BottomTabNavigator from "../../../components/BottomTabNavigator";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { useAuth } from "../../auth";
import { useAttendance } from "../hooks/useAttendance";
import { SubjectAttendanceCard } from "../components/SubjectAttendanceCard";

export const AttendanceScreen: React.FC = () => {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { accessToken, student } = useAuth();

  const {
    weeklyData,
    subjectData,
    overallPercentage,
  } = useAttendance(accessToken, student);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top", "bottom", "left", "right"]}>
      {/* Header */}
      <View style={[styles.topHeader, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Attendance</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Overall Attendance */}
        <View style={styles.section}>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.header}>
              <BarChart3 size={24} color={colors.primary} strokeWidth={2} />
              <Text style={[styles.title, { color: colors.textPrimary }]}>Overall Attendance</Text>
            </View>
            <Text style={[styles.percentage, { color: colors.primary }]}>{overallPercentage.toFixed(0)}%</Text>
            <Text style={[styles.status, { color: colors.textSecondary }]}>
              {overallPercentage >= 75 ? "✓ You're above the 75% standard" : "⚠ Below the 75% standard"}
            </Text>
          </View>
        </View>

        {/* Weekly Attendance */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>This Week</Text>
          <View style={styles.weekContainer}>
            {weeklyData.map((day, index) => (
              <View key={index} style={styles.dayBox}>
                <View
                  style={[
                    styles.dayCircle,
                    { borderColor: colors.border },
                    day.status === "present"
                      ? { backgroundColor: colors.primarySurface, borderColor: colors.primary }
                      : { backgroundColor: "#FEE2E2", borderColor: colors.error },
                  ]}
                >
                  <Text style={[styles.dayBoxDate, { color: colors.textPrimary }]}>{day.date}</Text>
                </View>
                <Text style={[styles.dayBoxStatus, { color: day.status === "present" ? colors.primary : colors.error }]}>
                  {day.status === "present" ? "✓" : "✗"}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Subject-wise Attendance */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>By Subject</Text>
          {subjectData.map((item, index) => (
            <SubjectAttendanceCard key={index} item={item} />
          ))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      <BottomTabNavigator active="attendance" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  scrollContent: {
    paddingBottom: 100,
    paddingTop: 16,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
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
  percentage: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 4,
  },
  status: {
    fontSize: 13,
    fontWeight: "500",
  },
  weekContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  dayBox: {
    alignItems: "center",
  },
  dayCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 2,
  },
  dayBoxDate: {
    fontSize: 12,
    fontWeight: "700",
  },
  dayBoxStatus: {
    fontSize: 14,
    fontWeight: "700",
  },
});
