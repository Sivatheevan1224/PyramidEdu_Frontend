import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Search, Calendar, FileText, CheckCircle, CircleX, AlertCircle } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../auth";
import { MOBILE_API_BASE_URL } from "../../../api/config";
import BottomTabNavigator from "../../../components/BottomTabNavigator";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { AttendanceRecord } from "../types";

export default function AttendanceHistoryScreen() {
  const router = useRouter();
  const { colors, isDark } = useAppTheme();
  const { student, accessToken } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PRESENT" | "ABSENT">("ALL");

  const fetchAttendance = async (isRefresh = false) => {
    if (!accessToken) {
      setLoading(false);
      return;
    }
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const baseUrl = MOBILE_API_BASE_URL.replace("/mobile", "");
      const response = await fetch(`${baseUrl}/attendance/student/my-attendance`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const json = await response.json();
      if (json.success && json.data && Array.isArray(json.data.attendances)) {
        setRecords(json.data.attendances);
      }
    } catch (err) {
      console.error("Error loading attendance history:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [accessToken]);

  const handleRefresh = () => {
    fetchAttendance(true);
  };

  const overallPercentage = student?.student?.attendancePercentage !== undefined 
    ? Number(student.student.attendancePercentage) 
    : 0;

  const filteredRecords = records.filter((rec) => {
    const matchesSearch = 
      rec.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.teacher.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || rec.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PRESENT":
        return {
          bg: isDark ? "rgba(16, 185, 129, 0.15)" : "#E6F4EA",
          text: "#10B981",
          icon: <CheckCircle size={16} color="#10B981" />,
        };
      case "ABSENT":
        return {
          bg: isDark ? "rgba(239, 68, 68, 0.15)" : "#FCE8E6",
          text: "#EF4444",
          icon: <CircleX size={16} color="#EF4444" />,
        };
      default:
        return {
          bg: isDark ? "rgba(107, 114, 128, 0.15)" : "#F3F4F6",
          text: "#6B7280",
          icon: <AlertCircle size={16} color="#6B7280" />,
        };
    }
  };

  const statusOptions: Array<"ALL" | "PRESENT" | "ABSENT"> = [
    "ALL", "PRESENT", "ABSENT"
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top", "bottom", "left", "right"]}>

      <View style={[styles.topHeader, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Attendance History</Text>
        <View style={{ width: 24 }} />
      </View>

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
        {/* Overall Percentage Summary Card */}
        <View style={styles.summaryCardWrapper}>
          <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Overall Attendance</Text>
              <Text style={[styles.summaryValue, { color: colors.primary }]}>{overallPercentage.toFixed(1)}%</Text>
              <Text style={[styles.summarySubtitle, { color: overallPercentage >= 75 ? "#10B981" : "#EF4444" }]}>
                {overallPercentage >= 75 ? "✓ Good Standing" : "⚠ Below 75% Requirement"}
              </Text>
            </View>
            <View style={[styles.percentageCircle, { borderColor: colors.primary }]}>
              <Text style={[styles.circleText, { color: colors.primary }]}>
                {overallPercentage >= 75 ? "Pass" : "Risk"}
              </Text>
            </View>
          </View>
        </View>

        {/* Filter Section */}
        <View style={styles.filterSection}>
          <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Search size={18} color={colors.textTertiary} />
            <TextInput
              placeholder="Search by Subject or Teacher..."
              placeholderTextColor={colors.textTertiary}
              style={[styles.searchInput, { color: colors.textPrimary }]}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
            {statusOptions.map((opt) => {
              const isActive = statusFilter === opt;
              return (
                <TouchableOpacity
                  key={opt}
                  onPress={() => setStatusFilter(opt)}
                  style={[
                    styles.chip,
                    isActive 
                      ? { backgroundColor: colors.primary } 
                      : { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }
                  ]}
                >
                  <Text style={[styles.chipText, { color: isActive ? "#FFF" : colors.textSecondary }]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Attendance List */}
        <View style={styles.listSection}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
          ) : filteredRecords.length === 0 ? (
            <View style={styles.emptyContainer}>
              <FileText size={48} color={colors.textTertiary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No records found matching filters.</Text>
            </View>
          ) : (
            filteredRecords.map((item) => {
              const statusStyle = getStatusStyle(item.status);
              return (
                <View key={item.id} style={[styles.recordCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <View style={styles.recordLeft}>
                    <Text style={[styles.recordSubject, { color: colors.textPrimary }]}>{item.subject}</Text>
                    <Text style={[styles.recordTeacher, { color: colors.textSecondary }]}>{item.teacher}</Text>
                    <View style={styles.dateRow}>
                      <Calendar size={14} color={colors.textTertiary} />
                      <Text style={[styles.recordDate, { color: colors.textTertiary }]}>
                        {item.date} • {item.time}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                    {statusStyle.icon}
                    <Text style={[styles.statusText, { color: statusStyle.text }]}>
                      {item.status}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      <BottomTabNavigator active="attendance" />
    </SafeAreaView>
  );
}

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
    paddingBottom: 120,
  },
  summaryCardWrapper: {
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  summaryCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 4,
  },
  summarySubtitle: {
    fontSize: 13,
    fontWeight: "600",
  },
  percentageCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  circleText: {
    fontSize: 14,
    fontWeight: "700",
  },
  filterSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: "100%",
  },
  chipsContainer: {
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "700",
  },
  listSection: {
    paddingHorizontal: 16,
    gap: 12,
  },
  recordCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  recordLeft: {
    flex: 1,
    gap: 4,
  },
  recordSubject: {
    fontSize: 15,
    fontWeight: "700",
  },
  recordTeacher: {
    fontSize: 13,
    fontWeight: "500",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  recordDate: {
    fontSize: 12,
    fontWeight: "500",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
