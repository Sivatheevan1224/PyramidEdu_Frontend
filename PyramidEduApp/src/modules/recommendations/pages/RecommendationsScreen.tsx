import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Sparkles, ArrowRight, BookOpen, Award } from "lucide-react-native";
import { useRouter } from "expo-router";
import TopBar from "../../../components/TopBar";
import BottomTabNavigator from "../../../components/BottomTabNavigator";
import { Colors } from "../../../constants/colors";
import { useAuth } from "../../auth";

export default function RecommendationsScreen() {
  const router = useRouter();
  const { student } = useAuth();

  // Derive weak subject recommendations
  const recommendations = [
    {
      id: "1",
      title: "Review Electromagnetism Concept Video",
      description: "Based on low test scores in Physics, revision of unit 4 is highly recommended.",
      type: "STUDY",
      subject: "Physics",
    },
    {
      id: "2",
      title: "Take Mathematics Practice Quiz",
      description: "Reinforce trigonometry ahead of the upcoming Term 2 exams.",
      type: "QUIZ",
      subject: "Mathematics",
    },
    {
      id: "3",
      title: "Complete Organic Chemistry Guide",
      description: "Recommended reading to improve assessment marks.",
      type: "STUDY",
      subject: "Chemistry",
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <TopBar />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Recommendation Header */}
        <View style={styles.headerCard}>
          <Sparkles size={24} color={Colors.primary} />
          <Text style={styles.headerTitle}>AI Recommendations</Text>
          <Text style={styles.headerSubtitle}>
            Custom study tips and revision guidelines tailored specifically for your learning profile.
          </Text>
        </View>

        {/* List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>For You Today</Text>
          {recommendations.map((rec) => (
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
          ))}
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
    marginBottom: 4,
  },
  recDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  actionButton: {
    alignSelf: "center",
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
});
