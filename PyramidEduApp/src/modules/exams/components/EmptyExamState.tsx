import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { BookOpen } from "lucide-react-native";
import { Colors } from "../../../constants/colors";

interface EmptyExamStateProps {
  message?: string;
}

export function EmptyExamState({ message = "No exams scheduled" }: EmptyExamStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <BookOpen size={32} color={Colors.textTertiary} />
      </View>
      <Text style={styles.title}>All Clear!</Text>
      <Text style={styles.desc}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.secondaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  desc: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
