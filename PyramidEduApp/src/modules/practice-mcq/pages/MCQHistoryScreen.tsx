import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, Clock, Award, ChevronRight, Flame } from "lucide-react-native";
import { useAuth } from "../../auth";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { practiceMcqService, MCQHistoryItem } from "../services/practiceMcq.service";

export function MCQHistoryScreen() {
  const router = useRouter();
  const { accessToken } = useAuth();
  const { colors } = useAppTheme();
  const [history, setHistory] = useState<MCQHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async (showLoadingIndicator = true) => {
    if (!accessToken) return;
    try {
      if (showLoadingIndicator) setLoading(true);
      const data = await practiceMcqService.getHistory(accessToken);
      setHistory(data);
    } catch (error) {
      console.error("Error fetching MCQ practice history:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [accessToken]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory(false);
  };

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

  const renderItem = ({ item }: { item: MCQHistoryItem }) => {
    const isPassing = item.score >= 5;
    return (
      <TouchableOpacity
        onPress={() => router.push(`/practice-mcq/history-detail?id=${item.id}` as any)}
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <View>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
              {item.quizTitle}
            </Text>
            <Text style={[styles.cardDate, { color: colors.textSecondary }]}>
              {formatDate(item.submittedAt)}
            </Text>
          </View>
          <ChevronRight size={20} color={colors.textSecondary} />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: isPassing ? "#10B981" : "#EF4444" }]}>
              {item.score}/10
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Score</Text>
          </View>

          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>
              {item.percentage}%
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Accuracy</Text>
          </View>

          <View style={styles.stat}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Clock size={14} color={colors.textSecondary} style={{ marginRight: 4 }} />
              <Text style={[styles.statValueCompact, { color: colors.textPrimary }]}>
                {item.timeTaken}s
              </Text>
            </View>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Duration</Text>
          </View>

          {item.rewardPointsEarned > 0 && (
            <View style={[styles.pointsBadge, { backgroundColor: "#FFFBEB", borderColor: "#F59E0B" }]}>
              <Flame size={14} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.pointsBadgeText}>+{item.rewardPointsEarned} Pts</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
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
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Practice History</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Award size={64} color={colors.textSecondary} style={{ marginBottom: 16 }} />
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No History Yet</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            You haven't completed any daily practice quizzes yet.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.emptyButton, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.emptyButtonText}>Start Practice Now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          onRefresh={onRefresh}
          refreshing={refreshing}
          showsVerticalScrollIndicator={false}
        />
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
  listContent: {
    padding: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 12,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stat: {
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "800",
  },
  statValueCompact: {
    fontSize: 14,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  pointsBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  pointsBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#F59E0B",
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
