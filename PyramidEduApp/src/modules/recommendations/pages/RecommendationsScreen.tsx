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
import { Sparkles, ArrowRight, BookOpen, Award, CheckCircle } from "lucide-react-native";
import { useRouter } from "expo-router";
import TopBar from "../../../components/TopBar";
import BottomTabNavigator from "../../../components/BottomTabNavigator";
import { Colors } from "../../../constants/colors";
import { useAuth } from "../../auth";
import { MOBILE_API_BASE_URL } from "../../../api/config";

export default function RecommendationsScreen() {
  const router = useRouter();
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
            setDbRecommendations(latest.recommendations);
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
    let type = "STUDY";

    if (textLower.includes("attendance")) {
      subject = "Attendance";
      title = "Improve Class Attendance";
      description = "Your attendance percentage is below the threshold. Consistent attendance is critical to staying on track.";
      type = "STUDY";
    } else if (textLower.includes("mcq")) {
      subject = "MCQ Exams";
      title = "Practice MCQ Questions";
      description = "MCQ metrics show room for improvement. Use materials in the portal to practice mock questions.";
      type = "QUIZ";
    } else if (textLower.includes("essay")) {
      subject = "Essay Exams";
      title = "Practice Essay Writing";
      description = "Focus on structuring your essay answers, practicing writing within timelines, and submitting draft assignments.";
      type = "STUDY";
    } else if (textLower.includes("manual") || textLower.includes("physical")) {
      subject = "Manual Exams";
      title = "Prepare for Physical Exams";
      description = "Review practical guides and make sure you participate fully in practical laboratory sessions or classroom exercises.";
      type = "STUDY";
    } else if (textLower.includes("revision") || textLower.includes("declining")) {
      subject = "Academic Trend";
      title = "Attend Revision Sessions";
      description = "We detected a declining trend in your latest performance. Joining group revisions or tutorial sessions is advised.";
      type = "STUDY";
    }

    return {
      id: String(index),
      subject,
      title,
      description,
      type,
    };
  };

  const recommendations = dbRecommendations.map((rec, index) => mapRecommendation(rec, index));

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <TopBar />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Recommendation Header */}
        <View style={styles.headerCard}>
          <Sparkles size={24} color={Colors.primary} />
          <Text style={styles.headerTitle}>Recommendations</Text>
          <Text style={styles.headerSubtitle}>
            Custom study tips and revision guidelines tailored specifically for your learning profile.
          </Text>
        </View>

        {/* List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>For You Today</Text>
          
          {loading ? (
            <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 24 }} />
          ) : recommendations.length === 0 ? (
            <View style={styles.emptyContainer}>
              <CheckCircle size={48} color="#10B981" style={{ marginBottom: 12 }} />
              <Text style={styles.emptyTitle}>Looking Good!</Text>
              <Text style={styles.emptyText}>
                No critical performance risk flags were detected. Keep up the excellent work!
              </Text>
            </View>
          ) : (
            recommendations.map((rec) => (
              <View key={rec.id} style={styles.recCard}>
                <View style={styles.recTypeIcon}>
                  {rec.type === "QUIZ" ? (
                    <Award size={20} color={Colors.primary} />
                  ) : (
                    <BookOpen size={20} color={Colors.primary} />
                  )}
                </View>
                <View style={styles.recInfo}>
                  <Text style={styles.recSubject}>{rec.subject}</Text>
                  <Text style={styles.recTitle}>{rec.title}</Text>
                  <Text style={styles.recDesc}>{rec.description}</Text>
                </View>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => router.push((rec.type === "QUIZ" ? "/exams" : "/materials") as any)}
                >
                  <ArrowRight size={18} color={Colors.primary} />
                </TouchableOpacity>
              </View>
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
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  headerCard: {
    backgroundColor: Colors.primarySurface,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  recCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  recTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primarySurface,
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
    color: Colors.primary,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  recTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  recDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
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
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 18,
  },
});
