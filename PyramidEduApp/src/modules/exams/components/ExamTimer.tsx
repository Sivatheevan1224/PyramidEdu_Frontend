import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Clock } from "lucide-react-native";

interface ExamTimerProps {
  remainingSeconds: number;
  formattedTime: string;
}

export function ExamTimer({ remainingSeconds, formattedTime }: ExamTimerProps) {
  const isTimeLow = remainingSeconds <= 60; // 1 minute warning
  const isTimeCritical = remainingSeconds <= 10;

  let timerColor = "#0f172a";
  let backgroundColor = "#f8fafc";
  let borderColor = "#cbd5e1";

  if (isTimeCritical) {
    timerColor = "#b91c1c";
    backgroundColor = "#fee2e2";
    borderColor = "#f87171";
  } else if (isTimeLow) {
    timerColor = "#ea580c";
    backgroundColor = "#ffedd5";
    borderColor = "#fb923c";
  }

  return (
    <View style={[styles.container, { backgroundColor, borderColor }]}>
      <Clock size={16} color={timerColor} style={styles.icon} />
      <Text style={[styles.text, { color: timerColor }]}>
        Time Remaining: <Text style={styles.timeBold}>{formattedTime}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
  },
  timeBold: {
    fontWeight: "800",
  },
});
