import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Check, X, BookOpen, Clock, Flame } from "lucide-react-native";
import { useAuth } from "../../auth";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { practiceMcqService, MCQHistoryDetail } from "../services/practiceMcq.service";

export function MCQHistoryDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { accessToken } = useAuth();
  const { colors, theme } = useAppTheme();
  const [detail, setDetail] = useState<MCQHistoryDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!accessToken || !id) return;
      try {
        setLoading(true);
        const data = await practiceMcqService.getHistoryDetail(accessToken, id as string);
        setDetail(data);
      } catch (error) {
        console.error("Error fetching MCQ practice details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [accessToken, id]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <ArrowLeft size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Quiz Review</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : !detail ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.textPrimary }]}>
            Failed to load quiz details.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Summary Card */}
          <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.summaryTitle, { color: colors.textPrimary }]}>
              {detail.quizTitle}
            </Text>
            <Text style={[styles.summaryDate, { color: colors.textSecondary }]}>
              Completed on {formatDate(detail.submittedAt)}
            </Text>

            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={[styles.statValue, { color: detail.score >= 5 ? "#10B981" : "#EF4444" }]}>
                  {detail.score}/10
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Score</Text>
              </View>

              <View style={styles.stat}>
                <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                  {detail.percentage}%
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Accuracy</Text>
              </View>

              <View style={styles.stat}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                  <Clock size={16} color={colors.textSecondary} style={{ marginRight: 4 }} />
                  <Text style={[styles.statValueCompact, { color: colors.textPrimary }]}>
                    {detail.timeTaken}s
                  </Text>
                </View>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Duration</Text>
              </View>

              {detail.rewardPointsEarned > 0 && (
                <View style={[styles.pointsBadge, { backgroundColor: "#FFFBEB", borderColor: "#F59E0B" }]}>
                  <Flame size={16} color="#F59E0B" fill="#F59E0B" />
                  <Text style={styles.pointsBadgeText}>+{detail.rewardPointsEarned} Pts</Text>
                </View>
              )}
            </View>
          </View>

          {/* Question List */}
          <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>Questions Review</Text>

          {detail.questions.map((q, idx) => {
            return (
              <View
                key={q.questionId}
                style={[
                  styles.questionCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                {/* Question Text */}
                <View style={styles.questionHeader}>
                  <Text style={[styles.questionNumber, { color: colors.primary }]}>
                    Question {idx + 1}
                  </Text>
                  <View
                    style={[
                      styles.correctIndicator,
                      {
                        backgroundColor: q.isCorrect ? "#D1FAE5" : "#FEE2E2",
                      },
                    ]}
                  >
                    <Text style={[styles.correctIndicatorText, { color: q.isCorrect ? "#065F46" : "#991B1B" }]}>
                      {q.isCorrect ? "Correct" : "Incorrect"}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.questionText, { color: colors.textPrimary }]}>
                  {q.questionText}
                </Text>

                {/* Options List */}
                <View style={styles.optionsList}>
                  {q.options.map((opt: any, optIdx: number) => {
                    let label = ["A", "B", "C", "D"][optIdx] || String(optIdx + 1);
                    let text = "";
                    let value = "";

                    if (typeof opt === "string") {
                      text = opt;
                      value = opt;
                    } else if (opt && typeof opt === "object") {
                      label = opt.label || label;
                      text = opt.text || "";
                      value = opt.text || opt.label || "";
                    }

                    const normCorrect = (q.correctAnswer || '').trim().toLowerCase();
                    const normSelected = (q.selectedAnswer || '').trim().toLowerCase();
                    const normVal = value.trim().toLowerCase();
                    const normLabel = label.trim().toLowerCase();
                    const normText = text.trim().toLowerCase();

                    const isCorrectOption = normCorrect !== '' && (normVal === normCorrect || normLabel === normCorrect || normText === normCorrect);
                    const isSelectedOption = normSelected !== '' && (normVal === normSelected || normLabel === normSelected || normText === normSelected);

                    let optionBg = colors.surface;
                    let optionBorder = colors.border;
                    let badgeIcon = null;

                    if (isCorrectOption) {
                      optionBg = theme === "DARK" ? "#122E21" : "#E6F4EA";
                      optionBorder = "#137333";
                      badgeIcon = <Check size={14} color="#137333" />;
                    } else if (isSelectedOption && !isCorrectOption) {
                      optionBg = theme === "DARK" ? "#2A1616" : "#FCE8E6";
                      optionBorder = "#C5221F";
                      badgeIcon = <X size={14} color="#C5221F" />;
                    }

                    return (
                      <View
                        key={value}
                        style={[
                          styles.optionItem,
                          {
                            backgroundColor: optionBg,
                            borderColor: optionBorder,
                          },
                        ]}
                      >
                        <View style={[styles.optionLabelContainer, { backgroundColor: theme === "DARK" ? "#374151" : "#F3F4F6" }]}>
                          <Text style={[styles.optionLabelText, { color: theme === "DARK" ? "#E5E7EB" : "#374151" }]}>
                            {label}
                          </Text>
                        </View>
                        <Text style={[styles.optionText, { color: colors.textPrimary, flex: 1 }]}>
                          {text}
                        </Text>
                        {badgeIcon}
                      </View>
                    );
                  })}
                </View>

                {/* Explanation Card */}
                {q.explanation && (
                  <View style={[styles.explanationBox, { backgroundColor: colors.background }]}>
                    <View style={styles.explanationHeader}>
                      <BookOpen size={16} color={colors.primary} />
                      <Text style={[styles.explanationTitle, { color: colors.primary }]}>
                        Explanation
                      </Text>
                    </View>
                    <Text style={[styles.explanationText, { color: colors.textSecondary }]}>
                      {q.explanation}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    fontWeight: "600",
  },
  scrollContent: {
    padding: 16,
  },
  summaryCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  summaryDate: {
    fontSize: 12,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stat: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
  },
  statValueCompact: {
    fontSize: 16,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  pointsBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  pointsBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#F59E0B",
    marginLeft: 4,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  questionCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: "700",
  },
  correctIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  correctIndicatorText: {
    fontSize: 11,
    fontWeight: "700",
  },
  questionText: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
    marginBottom: 16,
  },
  optionsList: {
    marginBottom: 12,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1.5,
  },
  optionLabelContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  optionLabelText: {
    fontSize: 12,
    fontWeight: "700",
  },
  optionText: {
    fontSize: 14,
    fontWeight: "500",
  },
  explanationBox: {
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  explanationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  explanationTitle: {
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 6,
  },
  explanationText: {
    fontSize: 12,
    lineHeight: 18,
  },
});
