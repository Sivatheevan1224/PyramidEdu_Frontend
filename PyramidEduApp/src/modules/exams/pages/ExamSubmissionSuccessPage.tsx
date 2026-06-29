import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ArrowRight } from "lucide-react-native";
import { Feather } from "@expo/vector-icons";
import { useExamStore } from "../store/examStore";
import { useAppTheme } from "../../../hooks/useAppTheme";

export function ExamSubmissionSuccessPage() {
  const { currentExam, resetStore, setActiveView: setView } = useExamStore();
  const { colors } = useAppTheme();

  const handleReturn = () => {
    resetStore();
    setView("list");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primarySurface }]}>
          <Feather name="check-circle" size={48} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Exam Submitted!</Text>
        <Text style={[styles.desc, { color: colors.textSecondary }]}>
          Your answers for <Text style={[styles.bold, { color: colors.textPrimary }]}>{currentExam?.examTitle || "the exam"}</Text> have
          been uploaded and submitted successfully.
        </Text>

        <Text style={[styles.info, { color: colors.textTertiary, backgroundColor: colors.surfaceAlt }]}>
          Grades and feedback will be visible in the Completed tab once calculations / grading is processed.
        </Text>

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleReturn}>
          <Text style={[styles.buttonText, { color: colors.surface }]}>Return to Exams</Text>
          <ArrowRight size={18} color={colors.surface} style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 12,
  },
  desc: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
  },
  bold: {
    fontWeight: "700",
  },
  info: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
    marginBottom: 24,
    padding: 12,
    borderRadius: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: "100%",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
