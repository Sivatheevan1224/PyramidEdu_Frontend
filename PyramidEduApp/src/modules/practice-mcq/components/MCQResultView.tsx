import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Sparkles, Trophy, Flame, Clock, Check, X } from "lucide-react-native";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { SubmitQuizResponse } from "../services/practiceMcq.service";

interface MCQResultViewProps {
  result: SubmitQuizResponse;
  onFinish: () => void;
}

export const MCQResultView: React.FC<MCQResultViewProps> = ({ result, onFinish }) => {
  const { colors } = useAppTheme();
  const router = useRouter();

  const getPerformanceMessage = (score: number) => {
    if (score === 10) return { title: "Perfect Score!", subtitle: "You are absolutely killing it!" };
    if (score >= 8) return { title: "Great Job!", subtitle: "Excellent effort today!" };
    if (score >= 6) return { title: "Good Attempt!", subtitle: "Keep practicing to improve!" };
    return { title: "Keep Learning!", subtitle: "Review the correct answers and try again tomorrow." };
  };

  const getCelebrationMessage = (score: number, points: number) => {
    if (points === 5) return "🏆 Perfect Score! +5 Reward Points Earned";
    if (points >= 2) return `🎉 Excellent Work! +${points} Reward Points Earned`;
    if (points === 1) return "🎉 Great Job! +1 Reward Point Earned";
    return "Keep practicing to earn reward points.";
  };

  const msg = getPerformanceMessage(result.score);
  const formattedTime = `${Math.floor(result.timeTaken / 60)}m ${result.timeTaken % 60}s`;

  return (
    <View style={styles.outerContainer}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Trophy */}
        <View style={styles.header}>
          <View style={[styles.trophyContainer, { backgroundColor: colors.primarySurface }]}>
            <Trophy size={48} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{msg.title}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{msg.subtitle}</Text>
        </View>

        {/* Reward Points Card */}
        <View
          style={[
            styles.rewardCard,
            result.rewardPointsEarned > 0
              ? { backgroundColor: "#E6F4EA", borderColor: "#10B981", borderWidth: 1.5 }
              : { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 },
          ]}
        >
          {result.rewardPointsEarned > 0 ? (
            <Sparkles size={28} color="#10B981" />
          ) : (
            <Check size={28} color={colors.textSecondary} />
          )}
          <View style={styles.rewardTextContainer}>
            <Text style={[styles.rewardTitle, { color: result.rewardPointsEarned > 0 ? "#10B981" : colors.textPrimary }]}>
              {getCelebrationMessage(result.score, result.rewardPointsEarned)}
            </Text>
            <Text style={[styles.rewardPoints, { color: colors.textSecondary }]}>
              Total Balance: <Text style={{ color: colors.primary, fontWeight: "900" }}>{result.totalRewardPoints} pts</Text>
            </Text>
          </View>
        </View>

        {/* Streak Info */}
        <View style={[styles.streakCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Flame size={32} color="#EF4444" fill="#EF4444" />
          <View style={styles.streakInfo}>
            <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>Current Streak</Text>
            <Text style={[styles.streakCount, { color: colors.textPrimary }]}>{result.dailyStreak} Days</Text>
            {result.isMilestone && (
              <View style={styles.milestoneBadge}>
                <Text style={styles.milestoneText}>🔥 {result.dailyStreak} Days Milestone Met!</Text>
              </View>
            )}
          </View>
        </View>

        {/* Score Grid */}
        <View style={styles.grid}>
          <View style={[styles.gridItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Your Score</Text>
            <Text style={[styles.gridValue, { color: colors.primary }]}>{result.score}/10</Text>
          </View>

          <View style={[styles.gridItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Percentage</Text>
            <Text style={[styles.gridValue, { color: colors.primary }]}>{result.percentage.toFixed(0)}%</Text>
          </View>

          <View style={[styles.gridItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.row}>
              <Check size={16} color="#10B981" style={{ marginRight: 4 }} />
              <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Correct</Text>
            </View>
            <Text style={[styles.gridValue, { color: "#10B981" }]}>{result.correctAnswers}</Text>
          </View>

          <View style={[styles.gridItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.row}>
              <X size={16} color="#EF4444" style={{ marginRight: 4 }} />
              <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Wrong</Text>
            </View>
            <Text style={[styles.gridValue, { color: "#EF4444" }]}>{result.wrongAnswers}</Text>
          </View>

          <View style={[styles.gridItem, styles.fullWidth, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.row}>
              <Clock size={16} color={colors.textSecondary} style={{ marginRight: 6 }} />
              <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Time Taken</Text>
            </View>
            <Text style={[styles.gridValue, { color: colors.textPrimary }]}>{formattedTime}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          {result.resultId && (
            <TouchableOpacity
              onPress={() => router.push(`/practice-mcq/history-detail?id=${result.resultId}` as any)}
              style={[styles.viewAnswersButton, { backgroundColor: colors.primary }]}
              activeOpacity={0.8}
            >
              <Text style={styles.viewAnswersButtonText}>View Answers</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    width: "100%",
  },
  container: {
    padding: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  trophyContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  rewardCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    width: "100%",
    marginBottom: 20,
    gap: 12,
  },
  rewardTextContainer: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  rewardPoints: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 2,
  },
  streakCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    width: "100%",
    marginBottom: 24,
    gap: 16,
  },
  streakInfo: {
    flex: 1,
  },
  streakLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  streakCount: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 2,
  },
  milestoneBadge: {
    backgroundColor: "#FF9F0A",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 6,
  },
  milestoneText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "700",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    width: "100%",
    marginBottom: 32,
  },
  gridItem: {
    flex: 1,
    minWidth: "45%",
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    gap: 4,
  },
  fullWidth: {
    minWidth: "100%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  gridLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  gridValue: {
    fontSize: 18,
    fontWeight: "800",
  },
  actionButtonsContainer: {
    width: "100%",
    gap: 12,
  },
  viewAnswersButton: {
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  viewAnswersButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  finishButton: {
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    borderWidth: 1.5,
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
