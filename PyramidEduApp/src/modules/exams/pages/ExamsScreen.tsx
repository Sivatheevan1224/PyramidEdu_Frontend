import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, BookOpen, Clock, CheckCircle } from "lucide-react-native";
import { useRouter } from "expo-router";
import TopBar from "../../../components/TopBar";
import BottomTabNavigator from "../../../components/BottomTabNavigator";
import { Colors } from "../../../constants/colors";
import { useAuth } from "../../auth";
import { MOBILE_API_BASE_URL } from "../../../api/config";

interface Exam {
  id: string;
  examTitle: string;
  examType: string;
  examDate: string;
  totalMarks: number;
  duration: number;
  subject?: { subjectName: string };
}

interface Question {
  id: string;
  questionText: string;
  questionType: "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER";
  options: any; // array or null
}

export default function ExamsScreen() {
  const router = useRouter();
  const { accessToken } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed">("upcoming");

  // Quiz Taking Mode States
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    fetchExams();
  }, [accessToken, activeTab]);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const baseUrl = MOBILE_API_BASE_URL.replace("/mobile", "");
      // Fetch upcoming/active exams
      const response = await fetch(`${baseUrl}/exams/my-upcoming`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const json = await response.json();
      if (json.success && Array.isArray(json.data)) {
        setExams(json.data);
      }
    } catch (err) {
      console.error("Error fetching exams:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = async (exam: Exam) => {
    setSelectedExam(exam);
    setLoadingQuestions(true);
    setAnswers({});
    try {
      const baseUrl = MOBILE_API_BASE_URL.replace("/mobile", "");
      const response = await fetch(`${baseUrl}/exams/${exam.id}/questions`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const json = await response.json();
      if (json.success && Array.isArray(json.data)) {
        setQuestions(json.data);
      } else {
        Alert.alert("Error", "Could not fetch exam questions.");
        setSelectedExam(null);
      }
    } catch (err) {
      console.error("Error fetching questions:", err);
      Alert.alert("Error", "Could not fetch exam questions.");
      setSelectedExam(null);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleAnswerSelect = (questionId: string, answerText: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerText,
    }));
  };

  const handleSubmitExam = async () => {
    if (Object.keys(answers).length < questions.length) {
      Alert.alert("Warning", "Please answer all questions before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const baseUrl = MOBILE_API_BASE_URL.replace("/mobile", "");
      const response = await fetch(`${baseUrl}/exams/${selectedExam?.id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ answers }),
      });
      const json = await response.json();
      if (json.success) {
        Alert.alert("Success", "Exam submitted successfully! Points & grades will be calculated.");
        setSelectedExam(null);
        fetchExams();
      } else {
        Alert.alert("Error", json.message || "Failed to submit exam.");
      }
    } catch (err) {
      console.error("Error submitting exam:", err);
      Alert.alert("Error", "Submission failed. Please check connection.");
    } finally {
      setSubmitting(false);
    }
  };

  if (selectedExam) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.examHeader}>
          <TouchableOpacity onPress={() => setSelectedExam(null)} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.examHeaderTitle} numberOfLines={1}>{selectedExam.examTitle}</Text>
        </View>

        {loadingQuestions ? (
          <ActivityIndicator color={Colors.primary} size="large" style={{ flex: 1 }} />
        ) : (
          <KeyboardAvoidingViewWrapper>
            <ScrollView contentContainerStyle={styles.questionsContent} showsVerticalScrollIndicator={false}>
              {questions.map((q, idx) => {
                // Parse options
                let parsedOptions: any[] = [];
                if (q.options) {
                  parsedOptions = typeof q.options === "string" ? JSON.parse(q.options) : q.options;
                }

                return (
                  <View key={q.id} style={styles.questionCard}>
                    <Text style={styles.questionNumber}>Question {idx + 1}</Text>
                    <Text style={styles.questionText}>{q.questionText}</Text>

                    {q.questionType === "MCQ" && (
                      <View style={styles.optionsContainer}>
                        {parsedOptions.map((opt: any) => {
                          const isSelected = answers[q.id] === opt.id || answers[q.id] === opt.text;
                          return (
                            <TouchableOpacity
                              key={opt.id}
                              style={[styles.optionButton, isSelected && styles.selectedOption]}
                              onPress={() => handleAnswerSelect(q.id, opt.id || opt.text)}
                            >
                              <Text style={[styles.optionText, isSelected && styles.selectedOptionText]}>
                                {opt.text}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    )}

                    {q.questionType === "TRUE_FALSE" && (
                      <View style={styles.tfContainer}>
                        {["TRUE", "FALSE"].map((val) => {
                          const isSelected = answers[q.id] === val;
                          return (
                            <TouchableOpacity
                              key={val}
                              style={[styles.tfButton, isSelected && styles.selectedTf]}
                              onPress={() => handleAnswerSelect(q.id, val)}
                            >
                              <Text style={[styles.optionText, isSelected && styles.selectedOptionText]}>
                                {val}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    )}

                    {q.questionType === "SHORT_ANSWER" && (
                      <TextInput
                        style={styles.textInput}
                        placeholder="Type your answer here..."
                        placeholderTextColor={Colors.textTertiary}
                        value={answers[q.id] || ""}
                        onChangeText={(text) => handleAnswerSelect(q.id, text)}
                      />
                    )}
                  </View>
                );
              })}

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmitExam}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Submit Answers</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingViewWrapper>
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TopBar />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "upcoming" && styles.activeTabButton]}
          onPress={() => setActiveTab("upcoming")}
        >
          <Text style={[styles.tabText, activeTab === "upcoming" && styles.activeTabText]}>
            Active / Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "completed" && styles.activeTabButton]}
          onPress={() => setActiveTab("completed")}
        >
          <Text style={[styles.tabText, activeTab === "completed" && styles.activeTabText]}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.primary} size="large" style={{ flex: 1 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {exams.length === 0 ? (
            <View style={styles.emptyContainer}>
              <BookOpen size={48} color={Colors.textTertiary} strokeWidth={1} />
              <Text style={styles.emptyText}>No exams found</Text>
            </View>
          ) : (
            exams.map((exam) => (
              <View key={exam.id} style={styles.examCard}>
                <View style={styles.examInfo}>
                  <Text style={styles.examTypeTag}>{exam.examType}</Text>
                  <Text style={styles.examTitle}>{exam.examTitle}</Text>
                  <View style={styles.detailsRow}>
                    <Clock size={16} color={Colors.textSecondary} style={{ marginRight: 4 }} />
                    <Text style={styles.detailsText}>{exam.duration} mins • {exam.totalMarks} Marks</Text>
                  </View>
                </View>
                {activeTab === "upcoming" ? (
                  <TouchableOpacity style={styles.startExamButton} onPress={() => handleStartExam(exam)}>
                    <Text style={styles.startExamButtonText}>Start</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.completedBadge}>
                    <CheckCircle size={18} color={Colors.primary} style={{ marginRight: 4 }} />
                    <Text style={styles.completedText}>Completed</Text>
                  </View>
                )}
              </View>
            ))
          )}
        </ScrollView>
      )}

      <BottomTabNavigator active="exams" />
    </SafeAreaView>
  );
}

// Inline KeyboardAvoidingView helper to prevent warnings on different devices
function KeyboardAvoidingViewWrapper({ children }: { children: React.ReactNode }) {
  return <View style={{ flex: 1 }}>{children}</View>;
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
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: "700",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textTertiary,
  },
  examCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  examInfo: {
    flex: 1,
    marginRight: 12,
  },
  examTypeTag: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.primary,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  examTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailsText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  startExamButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  startExamButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  completedText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "600",
  },
  // Quiz Mode Styles
  examHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  backButton: {
    marginRight: 12,
  },
  examHeaderTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
    flex: 1,
  },
  questionsContent: {
    padding: 16,
    paddingBottom: 40,
  },
  questionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 16,
  },
  questionNumber: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 4,
  },
  questionText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textPrimary,
    lineHeight: 22,
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 8,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: Colors.background,
  },
  selectedOption: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySurface,
  },
  optionText: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  selectedOptionText: {
    color: Colors.primary,
    fontWeight: "600",
  },
  tfContainer: {
    flexDirection: "row",
    gap: 12,
  },
  tfButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  selectedTf: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySurface,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: Colors.textPrimary,
    backgroundColor: Colors.background,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
