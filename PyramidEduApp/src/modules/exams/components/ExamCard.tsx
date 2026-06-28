import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Clock, BookOpen, Calendar, Award } from "lucide-react-native";
import { Exam, ExamStatus } from "../types";
import { ExamStatusBadge } from "./ExamStatusBadge";
import { useAppTheme } from "../../../hooks/useAppTheme";

interface ExamCardProps {
  exam: Exam;
  status: ExamStatus;
  onStart: (exam: Exam) => void;
}

export function ExamCard({ exam, status, onStart }: ExamCardProps) {
  const { colors } = useAppTheme();

  const formattedDate = new Date(exam.examDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const [countdown, setCountdown] = React.useState<string | null>(null);
  const [isReadyToStart, setIsReadyToStart] = React.useState(false);
  const isStartable = status === "ONGOING" || status === "LATE" || isReadyToStart;

  React.useEffect(() => {
    if ((status === "UPCOMING" || status === "LATE") && exam.startTime) {
      const start = new Date(exam.startTime).getTime();
      const durationMins = exam.duration || 0;
      const lateMins = exam.lateExamAvailableTime || 0;
      
      const end = start + durationMins * 60 * 1000;
      const lateEnd = end + lateMins * 60 * 1000;
      
      const updateCountdown = () => {
        const now = Date.now();
        
        if (status === "UPCOMING") {
          const diff = start - now;
          if (diff <= 0) {
            setIsReadyToStart(true);
            setCountdown("Starting soon...");
          } else {
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((diff % (1000 * 60)) / 1000);
            
            if (hours > 24) {
              const days = Math.floor(hours / 24);
              setCountdown(`In ${days} day${days > 1 ? 's' : ''}`);
            } else if (hours > 0) {
              setCountdown(`In ${hours}h ${mins}m`);
            } else {
              setCountdown(`In ${mins}m ${secs}s`);
            }
          }
        } else if (status === "LATE") {
          const diff = lateEnd - now;
          if (diff <= 0) {
            setCountdown("Expired");
          } else {
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((diff % (1000 * 60)) / 1000);
            
            if (hours > 24) {
              const days = Math.floor(hours / 24);
              setCountdown(`${days}d left`);
            } else if (hours > 0) {
              setCountdown(`${hours}h ${mins}m left`);
            } else {
              setCountdown(`${mins}m ${secs}s left`);
            }
          }
        }
      };
      
      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    }
    setCountdown(null);
  }, [status, exam.startTime, exam.duration, exam.lateExamAvailableTime]);

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View style={[styles.subjectContainer, { backgroundColor: colors.primarySurface }]}>
          <BookOpen size={14} color={colors.primary} style={styles.iconMargin} />
          <Text style={[styles.subjectText, { color: colors.primary }]}>
            {exam.subject?.subjectName || "General Subject"}
          </Text>
        </View>
        <ExamStatusBadge status={status} />
      </View>

      <Text style={[styles.title, { color: colors.textPrimary }]}>{exam.examTitle}</Text>

      <View style={[styles.metaGrid, { borderBottomColor: colors.border }]}>
        <View style={styles.metaItem}>
          <Calendar size={14} color={colors.textSecondary} style={styles.iconMargin} />
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>{formattedDate}</Text>
        </View>

        <View style={styles.metaItem}>
          <Clock size={14} color={colors.textSecondary} style={styles.iconMargin} />
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>{exam.duration} Mins</Text>
        </View>

        <View style={styles.metaItem}>
          <Award size={14} color={colors.textSecondary} style={styles.iconMargin} />
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>{exam.totalMarks} Marks</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.typeText, { color: colors.textTertiary }]}>{exam.examType} EXAM</Text>
        {isStartable ? (
          <View style={{ alignItems: "flex-end" }}>
            <TouchableOpacity
              style={[styles.startButton, { backgroundColor: colors.primary }, status === "LATE" && { backgroundColor: "#ea580c" }]}
              onPress={() => onStart(exam)}
            >
              <Text style={[styles.startButtonText, { color: colors.surface }]}>
                {status === "LATE" ? "Start Late" : "Start Exam"}
              </Text>
            </TouchableOpacity>
            {status === "LATE" && countdown && countdown !== "Expired" && (
              <Text style={{ color: "#ea580c", fontSize: 11, fontWeight: "600", marginTop: 4 }}>
                {countdown}
              </Text>
            )}
          </View>
        ) : (
          <View style={[styles.disabledButton, { backgroundColor: colors.surfaceAlt }]}>
            <Text style={[styles.disabledButtonText, { color: colors.textSecondary }]}>
              {status === "UPCOMING" ? (countdown || "Not Started") : status === "UNCOMPLETED" ? "Missed" : "Submitted"}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  subjectText: {
    fontSize: 12,
    fontWeight: "700",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
  },
  metaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    paddingBottom: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 13,
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
    letterSpacing: 1,
  },
  startButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: "700",
  },
  disabledButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  disabledButtonText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
