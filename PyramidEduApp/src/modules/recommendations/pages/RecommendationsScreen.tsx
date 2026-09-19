import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Sparkles, ArrowRight, BookOpen, Award, CheckCircle, Calendar, FileText, GraduationCap, ArrowLeft, ExternalLink, Play } from "lucide-react-native";
import { useRouter } from "expo-router";
import BottomTabNavigator from "../../../components/BottomTabNavigator";
import { useAuth } from "../../auth";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { MOBILE_API_BASE_URL } from "../../../api/config";

export default function RecommendationsScreen() {
  const router = useRouter();
  const { colors, isDark } = useAppTheme();
  const { student, accessToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dbRecommendations, setDbRecommendations] = useState<string[]>([]);

  const fetchRecommendations = async () => {
    if (!accessToken || !student?.student?.id) {
      return;
    }
    try {
      const baseUrl = MOBILE_API_BASE_URL.replace("/mobile", "");
      const response = await fetch(`${baseUrl}/performance/student/${student.student.id}/history`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const json = await response.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        // Sort descending by date to get latest first
        const sorted = json.data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const latest = sorted[0];
        if (Array.isArray(latest.recommendations)) {
          // Deduplicate backend recommendations on frontend side as well
          const uniqueRecs = Array.from(new Set(latest.recommendations)) as string[];
          setDbRecommendations(uniqueRecs);
        }
      }
    } catch (err) {
      console.error("Error loading recommendations:", err);
    }
  };

  useEffect(() => {
    async function loadInitial() {
      setLoading(true);
      await fetchRecommendations();
      setLoading(false);
    }
    loadInitial();
  }, [accessToken, student?.student?.id]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRecommendations();
    setRefreshing(false);
  };

  const mapRecommendation = (recText: string, index: number) => {
    const textLower = recText.toLowerCase();
    let subject = "General";
    let title = recText;
    let description = "Personalized learning tip based on your performance profile.";
    let icon = <BookOpen size={20} color={colors.primary} />;

    if (textLower.includes("ai strategy") || textLower.includes("ai recommendation")) {
      subject = "AI Personalized Strategy";
      title = "AI Study Recommendation";
      description = recText.replace(/^(?:💡\s*)?(?:AI Strategy:|AI Recommendation:)\s*/i, "").trim();
      icon = <Sparkles size={20} color={colors.primary} />;
    } else if (textLower.includes("attendance")) {
      subject = "Attendance";
      title = "Improve Class Attendance";
      description = "Your attendance percentage is below the threshold. Consistent attendance is critical to staying on track.";
      icon = <Calendar size={20} color={colors.primary} />;
    } else if (textLower.includes("mcq")) {
      subject = "MCQ Exams";
      title = "Practice MCQ Questions";
      description = "MCQ metrics show room for improvement. Use materials in the portal to practice mock questions.";
      icon = <Award size={20} color={colors.primary} />;
    } else if (textLower.includes("essay")) {
      subject = "Essay Exams";
      title = "Practice for Essay Exams";
      description = "Focus on structuring your essay answers, practicing writing within timelines, and submitting draft assignments.";
      icon = <FileText size={20} color={colors.primary} />;
    } else if (textLower.includes("manual") || textLower.includes("physical")) {
      subject = "Manual Exams";
      title = "Prepare for Physical Exams";
      description = "Review practical guides and make sure you participate fully in practical laboratory sessions or classroom exercises.";
      icon = <GraduationCap size={20} color={colors.primary} />;
    }

    return {
      id: String(index),
      subject,
      title,
      description,
      icon,
    };
  };

  const handleNavigation = (title: string) => {
    const textLower = title.toLowerCase();
    if (textLower.includes("attendance")) {
      router.push("/attendance-history" as any);
    } else if (textLower.includes("mcq")) {
      router.push("/practice-mcq" as any);
    } else if (textLower.includes("essay") || textLower.includes("physical") || textLower.includes("manual")) {
      router.push("/materials" as any);
    }
  };

  const rawMapped = dbRecommendations.map((rec, index) => mapRecommendation(rec, index));
  // Filter out any recommendations that map to the same title and exclude any General fallback recommendations
  const recommendations = rawMapped.filter((item, index, self) =>
    item.subject !== "General" && self.findIndex(t => t.title === item.title) === index
  );

  const aiRec = recommendations.find((r) => r.subject === "AI Personalized Strategy");
  const standardRecs = recommendations.filter((r) => r.subject !== "AI Personalized Strategy");

  const renderAiDescription = (description: string) => {
    const lines = description.split('\n');

    const parseLine = (lineText: string, lineKey: string) => {
      const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
      const parts: React.ReactNode[] = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = linkRegex.exec(lineText)) !== null) {
        if (match.index > lastIndex) {
          const preText = lineText.substring(lastIndex, match.index).replace(/\*\*/g, '');
          if (preText) {
            parts.push(
              <Text key={`txt-${lastIndex}`} style={{ color: colors.textSecondary, fontSize: 13, lineHeight: 18 }}>
                {preText}
              </Text>
            );
          }
        }

        const label = match[1];
        const url = match[2];
        const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');

        parts.push(
          <TouchableOpacity
            key={`btn-${match.index}`}
            onPress={() => Linking.openURL(url)}
            activeOpacity={0.7}
            style={[
              styles.mobileLinkButton,
              isYoutube
                ? { backgroundColor: isDark ? '#3B1214' : '#FEE2E2', borderColor: '#F87171' }
                : { backgroundColor: colors.primarySurface, borderColor: colors.primary },
            ]}
          >
            {isYoutube ? (
              <Play size={12} color="#EF4444" fill="#EF4444" />
            ) : (
              <BookOpen size={12} color={colors.primary} />
            )}
            <Text
              style={[
                styles.mobileLinkText,
                { color: isYoutube ? '#DC2626' : colors.primary },
              ]}
              numberOfLines={1}
            >
              {label}
            </Text>
            <ExternalLink size={10} color={isYoutube ? '#DC2626' : colors.primary} />
          </TouchableOpacity>
        );
        lastIndex = linkRegex.lastIndex;
      }

      if (lastIndex < lineText.length) {
        const postText = lineText.substring(lastIndex).replace(/\*\*/g, '');
        if (postText) {
          parts.push(
            <Text key={`txt-${lastIndex}`} style={{ color: colors.textSecondary, fontSize: 13, lineHeight: 18 }}>
              {postText}
            </Text>
          );
        }
      }

      return parts.length > 0 ? parts : (
        <Text style={{ color: colors.textSecondary, fontSize: 13, lineHeight: 18 }}>
          {lineText.replace(/\*\*/g, '')}
        </Text>
      );
    };

    return (
      <View style={{ marginTop: 8, gap: 4 }}>
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return null;
          if (trimmed === '---') {
            return <View key={idx} style={[styles.aiDivider, { backgroundColor: colors.border }]} />;
          }

          if (trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
            const headerText = trimmed.replace(/^#{2,3}\s*/, '');
            return (
              <Text
                key={idx}
                style={[styles.aiSectionHeader, { color: colors.textPrimary }]}
              >
                {headerText}
              </Text>
            );
          }

          if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
            const bulletText = trimmed.replace(/^[-•*]\s*/, '');
            return (
              <View key={idx} style={styles.aiBulletRow}>
                <View style={[styles.aiBulletDot, { backgroundColor: colors.primary }]} />
                <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                  {parseLine(bulletText, `b-${idx}`)}
                </View>
              </View>
            );
          }

          return (
            <View key={idx} style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: 2 }}>
              {parseLine(trimmed, `p-${idx}`)}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top", "bottom", "left", "right"]}>
      <View style={[styles.topHeader, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.topHeaderTitle, { color: colors.textPrimary }]} numberOfLines={1}>
          Recommendations
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Recommendation Header */}
        <View style={[styles.headerCard, { backgroundColor: colors.primarySurface, borderColor: colors.primary }]}>
          <Sparkles size={24} color={colors.primary} />
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Recommendations</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Custom study tips and revision guidelines tailored specifically for your learning profile.
          </Text>
        </View>

        {/* List */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>For You Today</Text>
          
          {loading && !refreshing ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 24 }} />
          ) : recommendations.length === 0 ? (
            <View style={[styles.emptyContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <CheckCircle size={48} color="#10B981" style={{ marginBottom: 12 }} />
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>Looking Good!</Text>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No critical performance risk flags were detected. Keep up the excellent work!
              </Text>
            </View>
          ) : (
            <View>
              {/* Featured AI Personalized Roadmap Card */}
              {aiRec && (
                <View style={[styles.aiCard, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
                  <View style={styles.aiCardHeader}>
                    <View style={[styles.recTypeIcon, { backgroundColor: colors.primarySurface }]}>
                      <Sparkles size={20} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.recSubject, { color: colors.primary }]}>AI Personalized Strategy</Text>
                      <Text style={[styles.recTitle, { color: colors.textPrimary }]}>Academic Diagnostic & Study Plan</Text>
                    </View>
                  </View>

                  {renderAiDescription(aiRec.description)}
                </View>
              )}

              {/* Standard rule-based items */}
              {standardRecs.length > 0 && (
                <View style={{ marginTop: aiRec ? 12 : 0 }}>
                  {aiRec && (
                    <Text style={[styles.subSectionTitle, { color: colors.textSecondary }]}>
                      Core Focus Areas
                    </Text>
                  )}
                  {standardRecs.map((rec) => (
                    <TouchableOpacity
                      key={rec.id}
                      style={[styles.recCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                      onPress={() => handleNavigation(rec.title)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.recTypeIcon, { backgroundColor: colors.primarySurface }]}>
                        {rec.icon}
                      </View>
                      <View style={styles.recInfo}>
                        <Text style={[styles.recSubject, { color: colors.primary }]}>{rec.subject}</Text>
                        <Text style={[styles.recTitle, { color: colors.textPrimary }]}>{rec.title}</Text>
                        <Text style={[styles.recDesc, { color: colors.textSecondary }]}>{rec.description}</Text>
                      </View>
                      <View style={styles.actionButton}>
                        <ArrowRight size={18} color={colors.primary} />
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <BottomTabNavigator active="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  topHeaderTitle: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  headerCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  headerSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  recCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  recTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  recInfo: {
    flex: 1,
    marginRight: 8,
  },
  recSubject: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  recTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  recDesc: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
  },
  actionButton: {
    alignSelf: "center",
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
  aiCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  aiCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  aiSectionHeader: {
    fontSize: 13,
    fontWeight: "800",
    marginTop: 10,
    marginBottom: 4,
  },
  aiBulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 2,
    paddingLeft: 4,
  },
  aiBulletDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: 7,
    marginRight: 8,
  },
  aiDivider: {
    height: 1,
    marginVertical: 8,
  },
  mobileLinkButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 4,
    marginRight: 6,
    gap: 6,
  },
  mobileLinkText: {
    fontSize: 12,
    fontWeight: "700",
    maxWidth: 220,
  },
  subSectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
});
