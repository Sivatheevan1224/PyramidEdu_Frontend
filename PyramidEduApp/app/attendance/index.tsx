import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarChart3 } from "lucide-react-native";
import TopBar from "../../src/components/TopBar";
import BottomTabNavigator from "../../src/components/BottomTabNavigator";
import { useAppTheme } from "../../src/hooks/useAppTheme";

export default function AttendanceScreen() {
  const { colors } = useAppTheme();

  const attendanceData = [
    { date: "Mon", status: "present", percentage: 95 },
    { date: "Tue", status: "present", percentage: 92 },
    { date: "Wed", status: "absent", percentage: 85 },
    { date: "Thu", status: "present", percentage: 88 },
    { date: "Fri", status: "present", percentage: 91 },
  ];

  const subjectAttendance = [
    { subject: "Mathematics", percentage: 92 },
    { subject: "Physics", percentage: 68 },
    { subject: "Chemistry", percentage: 85 },
    { subject: "English", percentage: 94 },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["bottom", "left", "right"]}>
      <TopBar />

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
            <Text style={[styles.percentage, { color: colors.primary }]}>87%</Text>
            <Text style={[styles.status, { color: colors.textSecondary }]}>✓ You're above the 75% standard</Text>
          </View>
        </View>

        {/* Weekly Attendance */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>This Week</Text>
          <View style={styles.weekContainer}>
            {attendanceData.map((day, index) => (
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
          {subjectAttendance.map((item, index) => (
            <View key={index} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.subjectHeader}>
                <Text style={[styles.subjectName, { color: colors.textPrimary }]}>{item.subject}</Text>
                <Text style={[styles.subjectPercentage, { color: colors.primary }]}>{item.percentage}%</Text>
              </View>
              <View style={[styles.progressBar, { backgroundColor: colors.surfaceAlt }]}>
                <View
                  style={[
                    styles.progressFill,
                    { backgroundColor: colors.primary, width: `${item.percentage}%` },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      <BottomTabNavigator active="attendance" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
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
  subjectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  subjectName: {
    fontSize: 13,
    fontWeight: "600",
  },
  subjectPercentage: {
    fontSize: 13,
    fontWeight: "700",
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
});
