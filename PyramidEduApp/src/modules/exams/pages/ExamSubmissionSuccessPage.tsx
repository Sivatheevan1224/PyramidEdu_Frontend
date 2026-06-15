import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CheckCircle, ArrowRight } from "lucide-react-native";
import { useExamStore } from "../store/examStore";
import { Colors } from "../../../constants/colors";

export function ExamSubmissionSuccessPage() {
  const { currentExam, resetStore, setView } = useExamStore();

  const handleReturn = () => {
    resetStore();
    setView("list");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <CheckCircle size={48} color="#22c55e" />
        </View>
        <Text style={styles.title}>Exam Submitted!</Text>
        <Text style={styles.desc}>
          Your answers for <Text style={styles.bold}>{currentExam?.examTitle || "the exam"}</Text> have
          been uploaded and submitted successfully.
        </Text>

        <Text style={styles.info}>
          Grades and feedback will be visible in the Completed tab once calculations / grading is processed.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleReturn}>
          <Text style={styles.buttonText}>Return to Exams</Text>
          <ArrowRight size={18} color="#ffffff" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
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
    backgroundColor: "#f0fdf4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  desc: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
  },
  bold: {
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  info: {
    fontSize: 12,
    color: Colors.textTertiary,
    textAlign: "center",
    lineHeight: 16,
    marginBottom: 24,
    backgroundColor: Colors.secondaryLight,
    padding: 12,
    borderRadius: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: "100%",
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
});
