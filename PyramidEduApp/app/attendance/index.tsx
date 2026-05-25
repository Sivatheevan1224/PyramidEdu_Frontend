import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarChart3, Calendar } from "lucide-react-native";
import TopBar from "../../src/components/TopBar";
import BottomTabNavigator from "../../src/components/BottomTabNavigator";
import { Colors } from "../../src/constants/colors";

export default function AttendanceScreen() {
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
    <SafeAreaView style={styles.container}>
      <TopBar />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Overall Attendance */}
        <View style={styles.section}>
          <View style={styles.card}>
            <View style={styles.header}>
              <BarChart3 size={24} color={Colors.primary} strokeWidth={2} />
              <Text style={styles.title}>Overall Attendance</Text>
            </View>
            <Text style={styles.percentage}>87%</Text>
            <Text style={styles.status}>✓ You're above the 75% standard</Text>
          </View>
        </View>

        {/* Weekly Attendance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <View style={styles.weekContainer}>
            {attendanceData.map((day, index) => (
              <View key={index} style={styles.dayBox}>
                <View
                  style={[
                    styles.dayCircle,
                    day.status === "present"
                      ? styles.presentDay
                      : styles.absentDay,
                  ]}
                >
                  <Text style={styles.dayBoxDate}>{day.date}</Text>
                </View>
                <Text style={styles.dayBoxStatus}>
                  {day.status === "present" ? "✓" : "✗"}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Subject-wise Attendance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>By Subject</Text>
          {subjectAttendance.map((item, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.subjectHeader}>
                <Text style={styles.subjectName}>{item.subject}</Text>
                <Text style={styles.subjectPercentage}>{item.percentage}%</Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${item.percentage}%` },
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
    backgroundColor: Colors.background,
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
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
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
    color: Colors.textPrimary,
  },
  percentage: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 4,
  },
  status: {
    fontSize: 13,
    color: Colors.textSecondary,
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
  presentDay: {
    backgroundColor: Colors.primarySurface,
    borderColor: Colors.primary,
  },
  absentDay: {
    backgroundColor: "#FEE2E2",
    borderColor: Colors.danger,
  },
  dayBoxDate: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textPrimary,
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
    color: Colors.textPrimary,
  },
  subjectPercentage: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.primary,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.secondaryLight,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
});
