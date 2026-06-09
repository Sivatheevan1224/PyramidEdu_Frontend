import React from "react";
import { View, Text } from "react-native";
import { styles } from "../pages/styles";

export default function StatsSection() {
  return (
    <View style={styles.statsContainer}>
      <View style={styles.statBox}>
        <Text style={styles.statValue}>87%</Text>
        <Text style={styles.statLabel}>Attendance</Text>
      </View>
      <View style={styles.statBox}>
        <Text style={styles.statValue}>92</Text>
        <Text style={styles.statLabel}>Avg Grade</Text>
      </View>
      <View style={styles.statBox}>
        <Text style={styles.statValue}>5</Text>
        <Text style={styles.statLabel}>Certificates</Text>
      </View>
    </View>
  );
}
