import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Clock, BookOpen, Calendar, Award } from "lucide-react-native";
import { Exam, ExamStatus } from "../types";
import { ExamStatusBadge } from "./ExamStatusBadge";
import { Colors } from "../../../constants/colors";

interface ExamCardProps {
  exam: Exam;
  status: ExamStatus;
  onStart: (exam: Exam) => void;
}

export function ExamCard({ exam, status, onStart }: ExamCardProps) {
  const isStartable = status === "ONGOING" || status === "LATE";
  const formattedDate = new Date(exam.examDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.subjectContainer}>
          <BookOpen size={14} color={Colors.primary} style={styles.iconMargin} />
          <Text style={styles.subjectText}>
            {exam.subject?.subjectName || "General Subject"}
          </Text>
        </View>
        <ExamStatusBadge status={status} />
      </View>

      <Text style={styles.title}>{exam.examTitle}</Text>

      <View style={styles.metaGrid}>
        <View style={styles.metaItem}>
          <Calendar size={14} color={Colors.textSecondary} style={styles.iconMargin} />
          <Text style={styles.metaText}>{formattedDate}</Text>
        </View>

        <View style={styles.metaItem}>
          <Clock size={14} color={Colors.textSecondary} style={styles.iconMargin} />
          <Text style={styles.metaText}>{exam.duration} Mins</Text>
        </View>

        <View style={styles.metaItem}>
          <Award size={14} color={Colors.textSecondary} style={styles.iconMargin} />
          <Text style={styles.metaText}>{exam.totalMarks} Marks</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.typeText}>{exam.examType} EXAM</Text>
        {isStartable ? (
          <TouchableOpacity
            style={[styles.startButton, status === "LATE" && styles.lateButton]}
            onPress={() => onStart(exam)}
          >
            <Text style={styles.startButtonText}>
              {status === "LATE" ? "Start Late" : "Start Exam"}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.disabledButton}>
            <Text style={styles.disabledButtonText}>
              {status === "UPCOMING" ? "Not Started" : "Submitted"}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  subjectContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primarySurface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  subjectText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.primary,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  metaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  iconMargin: {
    marginRight: 6,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  typeText: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.textTertiary,
    letterSpacing: 1,
  },
  startButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  lateButton: {
    backgroundColor: "#ea580c",
  },
  startButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  disabledButton: {
    backgroundColor: Colors.secondaryLight,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  disabledButtonText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: "700",
  },
});
