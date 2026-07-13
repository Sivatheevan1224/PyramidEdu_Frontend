import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Search, Award, Calendar, CheckCircle, Clock } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/modules/auth";
import { ExamService } from "../../src/modules/exams/services/api";
import { Exam } from "../../src/modules/exams/types";
import { useAppTheme } from "../../src/hooks/useAppTheme";
import TopBar from "../../src/components/TopBar";

export default function ShowMarksScreen() {
  const router = useRouter();
  const { accessToken } = useAuth();
  const { colors } = useAppTheme();
  
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadMarks() {
      if (!accessToken) return;
      try {
        setLoading(true);
        const data = await ExamService.getAvailableExams(accessToken);
        setExams(data);
      } catch (err) {
        console.error("Error fetching exams for marks:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMarks();
  }, [accessToken]);

  // Filter exams that have submissions (results)
  const examResults = exams.filter(
    (exam) => exam.submissions && exam.submissions.length > 0
  );

  // Sort by date (descending - latest first)
  const sortedResults = examResults.sort(
    (a, b) => new Date(b.examDate).getTime() - new Date(a.examDate).getTime()
  );

  // Filter by search query
  const filteredResults = sortedResults.filter((item) =>
    item.examTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["bottom", "left", "right"]}>
      <TopBar />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Exam Results & Marks</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            placeholder="Search exams by title..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: colors.textPrimary }]}
          />
        </View>
      </View>

      {/* Results Content */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading results...</Text>
        </View>
      ) : filteredResults.length === 0 ? (
        <View style={styles.center}>
          <Award size={48} color={colors.textSecondary} style={{ marginBottom: 16 }} />
          <Text style={[styles.emptyText, { color: colors.textPrimary }]}>
            {searchQuery ? "No matching exam results found." : "No exam results available."}
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {filteredResults.map((item) => {
            const submission = item.submissions?.[0];
            const score = submission?.totalScore;
            const isPending = submission?.status === "PENDING_MANUAL";

            return (
              <View
                key={item.id}
                style={[styles.resultCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: colors.primarySurface }]}>
                    <Award size={20} color={colors.primary} />
                  </View>
                  <View style={styles.examInfo}>
                    <Text style={[styles.examTitle, { color: colors.textPrimary }]} numberOfLines={2}>
                      {item.examTitle}
                    </Text>
                    <View style={styles.dateRow}>
                      <Calendar size={14} color={colors.textSecondary} />
                      <Text style={[styles.examDate, { color: colors.textSecondary }]}>
                        {new Date(item.examDate).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Score Section */}
                <View style={[styles.scoreContainer, { backgroundColor: colors.background }]}>
                  <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>Obtained Marks</Text>
                  {isPending ? (
                    <View style={styles.statusRow}>
                      <Clock size={16} color="#F59E0B" />
                      <Text style={[styles.pendingText, { color: "#F59E0B" }]}>Pending Grading</Text>
                    </View>
                  ) : (
                    <View style={styles.statusRow}>
                      <CheckCircle size={16} color="#10B981" />
                      <Text style={[styles.scoreValue, { color: colors.primary }]}>
                        {score !== null ? score : 0} <Text style={{ color: colors.textSecondary, fontSize: 14 }}>/ {item.totalMarks}</Text>
                      </Text>
                    </View>
                  )}
                </View>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 8,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  resultCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  examInfo: {
    flex: 1,
    gap: 4,
  },
  examTitle: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 22,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  examDate: {
    fontSize: 12,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 8,
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pendingText: {
    fontSize: 14,
    fontWeight: "600",
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: "700",
  },
});
