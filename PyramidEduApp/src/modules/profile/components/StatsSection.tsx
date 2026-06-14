import React from "react";
import { View, Text } from "react-native";
import { styles } from "../pages/styles";

interface StatsSectionProps {
  attendancePercentage?: number;
  rewardPoints?: number;
}

export default function StatsSection({ attendancePercentage = 0, rewardPoints = 0 }: StatsSectionProps) {
  return (
    <View style={styles.statsContainer}>
      <View style={styles.statBox}>
        <Text style={styles.statValue}>{attendancePercentage}%</Text>
        <Text style={styles.statLabel}>Attendance</Text>
      </View>
      <View style={styles.statBox}>
        <Text style={styles.statValue}>{rewardPoints}</Text>
        <Text style={styles.statLabel}>Reward Points</Text>
      </View>
      <View style={styles.statBox}>
        <Text style={styles.statValue}>Active</Text>
        <Text style={styles.statLabel}>Status</Text>
      </View>
    </View>
  );
}
