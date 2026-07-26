import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SubjectAttendance } from "../types/attendance.types";
import { useAppTheme } from "../../../hooks/useAppTheme";

interface SubjectAttendanceCardProps {
  item: SubjectAttendance;
}

export const SubjectAttendanceCard: React.FC<SubjectAttendanceCardProps> = ({ item }) => {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
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
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
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
