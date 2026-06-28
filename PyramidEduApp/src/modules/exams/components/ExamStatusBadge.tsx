import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ExamStatus } from "../types";

interface ExamStatusBadgeProps {
  status: ExamStatus;
}

export function ExamStatusBadge({ status }: ExamStatusBadgeProps) {
  const badgeStyles = getBadgeStyles(status);

  return (
    <View style={[styles.badge, badgeStyles.container]}>
      <Text style={[styles.text, badgeStyles.text]}>
        {status}
      </Text>
    </View>
  );
}

function getBadgeStyles(status: ExamStatus) {
  switch (status) {
    case "UPCOMING":
      return {
        container: { backgroundColor: "#e0f2fe", borderColor: "#38bdf8" },
        text: { color: "#0369a1" },
      };
    case "ONGOING":
      return {
        container: { backgroundColor: "#dcfce7", borderColor: "#4ade80" },
        text: { color: "#15803d" },
      };
    case "LATE":
      return {
        container: { backgroundColor: "#ffedd5", borderColor: "#fb923c" },
        text: { color: "#c2410c" },
      };
    case "COMPLETED":
      return {
        container: { backgroundColor: "#f1f5f9", borderColor: "#cbd5e1" },
        text: { color: "#475569" },
      };
    case "UNCOMPLETED":
      return {
        container: { backgroundColor: "#fee2e2", borderColor: "#f87171" },
        text: { color: "#b91c1c" },
      };
    default:
      return {
        container: { backgroundColor: "#f1f5f9", borderColor: "#cbd5e1" },
        text: { color: "#475569" },
      };
  }
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
