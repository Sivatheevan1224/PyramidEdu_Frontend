import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../../constants/colors";

interface UploadProgressIndicatorProps {
  progress: number;
  status: string;
}

export function UploadProgressIndicator({ progress, status }: UploadProgressIndicatorProps) {
  const percent = Math.round(progress * 100);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={Colors.primary} style={styles.spinner} />
      <View style={styles.barWrapper}>
        <View style={styles.textRow}>
          <Text style={styles.statusText}>{status}</Text>
          <Text style={styles.percentText}>{percent}%</Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.progress, { width: `${percent}%` }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primarySurface,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
  },
  spinner: {
    marginRight: 12,
  },
  barWrapper: {
    flex: 1,
  },
  textRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.primary,
  },
  percentText: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.primary,
  },
  track: {
    height: 6,
    backgroundColor: "rgba(37, 99, 235, 0.15)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
});
