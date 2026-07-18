import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Sparkles, ArrowRight, BookOpen, Award, CheckCircle, Calendar, FileText, GraduationCap } from "lucide-react-native";
import { useRouter } from "expo-router";
import TopBar from "../../../components/TopBar";
import BottomTabNavigator from "../../../components/BottomTabNavigator";
import { useAuth } from "../../auth";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { MOBILE_API_BASE_URL } from "../../../api/config";

export default function RecommendationsScreen() {
  const router = useRouter();
  const { colors, isDark } = useAppTheme();
  const { student, accessToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dbRecommendations, setDbRecommendations] = useState<string[]>([]);

  useEffect(() => {
    async function fetchRecommendations() {
      if (!accessToken || !student?.student?.id) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    }
    fetchRecommendations();
  }, [accessToken, student?.student?.id]);

  const mapRecommendation = (recText: string, index: number) => {
    const textLower = recText.toLowerCase();
    let subject = "General";
    let title = recText;
    let description = "Personalized learning tip based on your performance profile.";
    let icon = <BookOpen size={20} color={colors.primary} />;

    if (textLower.includes("attendance")) {
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["bottom", "left", "right"]}>
      <TopBar />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
          
          {loading ? (
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
            recommendations.map((rec) => (
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
            ))
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
});
