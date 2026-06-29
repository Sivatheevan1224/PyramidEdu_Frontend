import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { Feather } from "@expo/vector-icons";
import { useExamStore } from "../store/examStore";
import { ExamService } from "../services/api";
import { useAuth } from "../../auth";
import { useAppTheme } from "../../../hooks/useAppTheme";

export function ResultPage() {
  const { activeResultExamId, setActiveView } = useExamStore();
  const { accessToken } = useAuth();
  const { colors } = useAppTheme();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resultData, setResultData] = useState<any>(null);

  useEffect(() => {
    async function loadResult() {
      if (!activeResultExamId || !accessToken) return;
      try {
        setLoading(true);
        setError(null);
        const data = await ExamService.getExamResult(activeResultExamId, accessToken);
        setResultData(data);
      } catch (err: any) {
        setError(err.message || "Failed to load result.");
      } finally {
        setLoading(false);
      }
    }
    loadResult();
  }, [activeResultExamId, accessToken]);

  const handleBack = () => {
    setActiveView("list");
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading Result...</Text>
      </View>
    );
  }

  if (error || !resultData) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>{error || "Failed to load."}</Text>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={handleBack}>
          <Text style={{ color: colors.textPrimary, fontWeight: "600" }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { exam, submission, result } = resultData;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]} numberOfLines={1}>
          {exam?.examTitle} Result
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.summaryTitle, { color: colors.textSecondary }]}>Overall Score</Text>
          {exam?.examType === "ESSAY" ? (
            <Text style={[styles.scoreText, { color: colors.primary }]}>
              {result?.marks || 0} / {exam.totalMarks}
            </Text>
          ) : (
            <View style={styles.scoreRow}>
              <Text style={[styles.scoreText, { color: colors.primary }]}>
                {submission?.totalScore || 0} / {exam?.totalMarks}
              </Text>
              <View style={[styles.badge, { backgroundColor: colors.primarySurface }]}>
                <Text style={[styles.badgeText, { color: colors.primary }]}>{result?.marks || 0}%</Text>
              </View>
            </View>
          )}
          {result?.grade && (
            <Text style={[styles.gradeText, { color: colors.textPrimary }]}>Grade: {result.grade}</Text>
          )}
          {result?.feedback && (
            <Text style={[styles.feedbackText, { color: colors.textSecondary }]}>Feedback: {result.feedback}</Text>
          )}
        </View>

        {exam?.examType === "MCQ" && exam?.questions && submission?.answers && (
          <View style={styles.questionsContainer}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Detailed Review</Text>
            {exam.questions.map((question: any, index: number) => {
              const answer = submission.answers.find((a: any) => a.questionId === question.id);
              const isCorrect = answer?.isCorrect;
              return (
                <View key={question.id} style={[styles.questionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <View style={styles.questionHeader}>
                    <Text style={[styles.questionNum, { color: colors.textPrimary }]}>Q{index + 1}</Text>
                    {isCorrect ? (
                      <Feather name="check-circle" size={20} color={colors.success || "#10b981"} />
                    ) : (
                      <Feather name="x-circle" size={20} color={colors.error || "#ef4444"} />
                    )}
                  </View>
                  <Text style={[styles.questionText, { color: colors.textPrimary }]}>{question.questionText}</Text>
                  
                  <View style={styles.answerBlock}>
                    <Text style={[styles.answerLabel, { color: colors.textSecondary }]}>Your Answer:</Text>
                    <Text style={[styles.answerText, { color: isCorrect ? (colors.success || "#10b981") : (colors.error || "#ef4444") }]}>
                      {answer?.answer || "No answer provided"}
                    </Text>
                  </View>
                  
                  {!isCorrect && (
                    <View style={styles.answerBlock}>
                      <Text style={[styles.answerLabel, { color: colors.textSecondary }]}>Correct Answer:</Text>
                      <Text style={[styles.answerText, { color: colors.success || "#10b981" }]}>
                        {question.correctAnswer || "Not available"}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  loadingText: { marginTop: 12, fontSize: 16, fontWeight: "500" },
  errorText: { fontSize: 16, marginBottom: 20, textAlign: "center" },
  backBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, borderWidth: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, borderBottomWidth: 1 },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: "700", flex: 1, textAlign: "center", marginHorizontal: 16 },
  scroll: { padding: 16, paddingBottom: 40 },
  summaryCard: { padding: 20, borderRadius: 16, borderWidth: 1, alignItems: "center", marginBottom: 24 },
  summaryTitle: { fontSize: 14, fontWeight: "600", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
  scoreRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  scoreText: { fontSize: 48, fontWeight: "800" },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 16, fontWeight: "700" },
  gradeText: { fontSize: 18, fontWeight: "600", marginTop: 12 },
  feedbackText: { fontSize: 14, marginTop: 8, textAlign: "center", fontStyle: "italic" },
  questionsContainer: { gap: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  questionCard: { padding: 16, borderRadius: 12, borderWidth: 1 },
  questionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  questionNum: { fontSize: 16, fontWeight: "700" },
  questionText: { fontSize: 15, lineHeight: 22, marginBottom: 16 },
  answerBlock: { marginTop: 8, backgroundColor: "rgba(0,0,0,0.02)", padding: 12, borderRadius: 8 },
  answerLabel: { fontSize: 12, fontWeight: "600", marginBottom: 4 },
  answerText: { fontSize: 14, fontWeight: "700" },
});
