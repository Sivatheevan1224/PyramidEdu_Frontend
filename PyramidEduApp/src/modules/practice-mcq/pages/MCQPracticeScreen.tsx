import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Flame, Sparkles, Award } from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { useAuth } from "../../auth";
import SecondaryTopBar from "../../../components/SecondaryTopBar";
import BottomTabNavigator from "../../../components/BottomTabNavigator";
import {
  practiceMcqService,
  TodayStatusResponse,
  GenerateQuizResponse,
  SubmitQuizResponse,
} from "../services/practiceMcq.service";
import { MCQPlayView } from "../components/MCQPlayView";
import { MCQResultView } from "../components/MCQResultView";

export default function MCQPracticeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors } = useAppTheme();
  const { accessToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [viewState, setViewState] = useState<"WELCOME" | "PLAY" | "RESULT">("WELCOME");
  const [status, setStatus] = useState<TodayStatusResponse | null>(null);
  const [quizData, setQuizData] = useState<GenerateQuizResponse | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitQuizResponse | null>(null);
  const [quizStartedAt, setQuizStartedAt] = useState<string>("");

  const fetchStatus = async () => {
    if (!accessToken) return;
    try {
      setLoading(true);
      const data = await practiceMcqService.getTodayStatus(accessToken);
      setStatus(data);
      if (data.completedToday && data.todayResult && params.showResult === "true") {
        setSubmitResult(data.todayResult);
        setViewState("RESULT");
      }
    } catch (err: any) {
      console.error("Error fetching today status:", err);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err.message || "Failed to load streak and status.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [accessToken]);

  const handleStartQuiz = async () => {
    if (!accessToken) return;
    try {
      setGenerating(true);
      const quiz = await practiceMcqService.generateQuiz(accessToken);
      setQuizData(quiz);
      setQuizStartedAt(new Date().toISOString());
      setViewState("PLAY");
    } catch (err: any) {
      Toast.show({
        type: "info",
        text1: "Daily MCQ Practice",
        text2: err.message || "Failed to generate practice quiz.",
      });
      // Refresh status in case they already completed it today
      fetchStatus();
    } finally {
      setGenerating(false);
    }
  };

  const handleQuizSubmit = async (
    answers: Array<{ questionId: string; selectedAnswer: string }>
  ) => {
    if (!accessToken || !quizData) return;
    try {
      setSubmitting(true);
      const result = await practiceMcqService.submitQuiz(accessToken, {
        quizId: quizData.quizId,
        startedAt: quizStartedAt,
        answers,
      });
      setSubmitResult(result);
      setViewState("RESULT");
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Submission Error",
        text2: err.message || "Failed to submit practice quiz answers.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (viewState === "PLAY" && quizData) {
      if (submitting) {
        return (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} style={{ marginBottom: 12 }} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Submitting your answers...</Text>
          </View>
        );
      }
      return (
        <MCQPlayView
          questions={quizData.questions}
          onSubmit={handleQuizSubmit}
          onCancel={() => setViewState("WELCOME")}
        />
      );
    }

    if (viewState === "RESULT" && submitResult) {
      return (
        <MCQResultView
          result={submitResult}
          onFinish={() => {
            router.push("/dashboard" as any);
          }}
        />
      );
    }

    // Default: WELCOME / Today's Status
    const isCompleted = status?.completedToday;

    return (
      <View style={styles.welcomeContainer}>
        {/* Streak & Rewards Header */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Flame size={24} color="#EF4444" fill="#EF4444" />
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>
              {status?.dailyStreak || 0} Days
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Current Streak</Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Sparkles size={24} color="#FFD700" fill="#FFD700" />
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>
              {status?.rewardPoints || 0} Pts
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Reward Points</Text>
          </View>
        </View>

        {/* Action card */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primarySurface }]}>
            <Award size={36} color={colors.primary} />
          </View>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
            Daily Practice MCQ
          </Text>
          <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
            Generate a personalized 10-question MCQ quiz matching your current performance level:{" "}
            <Text style={{ fontWeight: "700", color: colors.primary }}>
              {status?.performanceStatus.replace("_", " ")}
            </Text>
          </Text>

          {isCompleted ? (
            <View style={styles.completedNotice}>
              <Text style={styles.completedNoticeText}>
                You have already completed today's practice quiz. Please come back tomorrow.
              </Text>
              {status?.todayResult && (
                <TouchableOpacity
                  onPress={() => {
                    setSubmitResult(status.todayResult!);
                    setViewState("RESULT");
                  }}
                  style={[styles.viewResultButton, { backgroundColor: colors.primary }]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.viewResultButtonText}>View Today's Result</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleStartQuiz}
              disabled={generating}
              style={[styles.startButton, { backgroundColor: colors.primary }]}
              activeOpacity={0.8}
            >
              {generating ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.startButtonText}>Start Today's Quiz</Text>
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => router.push("/practice-mcq/history" as any)}
            style={[styles.historyButton, { borderColor: colors.primary }]}
            activeOpacity={0.8}
          >
            <Text style={[styles.historyButtonText, { color: colors.primary }]}>View Practice History</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["bottom", "left", "right"]}>
      <SecondaryTopBar 
        title="MCQ Practice" 
        rightType={viewState === "WELCOME" ? "history" : "none"} 
      />

      <View style={styles.content}>
        {renderContent()}
      </View>

      {viewState === "WELCOME" && <BottomTabNavigator active="home" />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
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
    fontSize: 20,
    fontWeight: "700",
  },
  content: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: "600",
  },
  welcomeContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
    textTransform: "uppercase",
  },
  card: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },
  cardSubtitle: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  startButton: {
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  startButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  completedNotice: {
    backgroundColor: "#FCE8E6",
    borderColor: "#EF4444",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    width: "100%",
  },
  completedNoticeText: {
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 12,
  },
  viewResultButton: {
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  viewResultButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },
  historyHeaderButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
    marginRight: 4,
  },
  historyHeaderButtonText: {
    fontSize: 12,
    fontWeight: "700",
  },
  historyButton: {
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 12,
  },
  historyButtonText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
