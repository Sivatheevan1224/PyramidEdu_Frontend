import React, { useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../auth";
import { useExamStore } from "../store/examStore";
import { Exam } from "../types";
import { ExamService } from "../services/api";
import { useExamStatus } from "../hooks";
import { ExamCard, ExamInstructionsModal, EmptyExamState } from "../components";
import { Colors } from "../../../constants/colors";

export function ExamListPage() {
  const { accessToken } = useAuth();
  const {
    setCurrentExam,
    setQuestions,
    setView,
    loadDraftFromStorage,
  } = useExamStore();

  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");

  const [selectedInstructionExam, setSelectedInstructionExam] = useState<Exam | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { getStatus } = useExamStatus();

  const loadExams = async (showSpinner = true) => {
    if (!accessToken) return;
    if (showSpinner) setLoading(true);
    try {
      const data = await ExamService.getAvailableExams(accessToken);
      setExams(data);
    } catch (err) {
      console.error("Error loading available exams:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadExams();
  }, [accessToken]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadExams(false);
  };

  const handleStartAttempt = (exam: Exam) => {
    setSelectedInstructionExam(exam);
    setModalVisible(true);
  };

  const handleInstructionsConfirm = async () => {
    if (!selectedInstructionExam || !accessToken) return;
    setModalVisible(false);

    try {
      setLoading(true);
      const questionsData = await ExamService.startExam(selectedInstructionExam.id, accessToken);
      
      // Load store data
      setCurrentExam(selectedInstructionExam);
      setQuestions(questionsData);

      // Check if draft exists locally for this exam
      await loadDraftFromStorage(selectedInstructionExam.id);

      // Navigate to correct page
      if (selectedInstructionExam.examType === "MCQ") {
        setView("mcq");
      } else {
        setView("essay");
      }
    } catch (err) {
      console.error("Failed to start exam:", err);
    } finally {
      setLoading(false);
      setSelectedInstructionExam(null);
    }
  };

  // Filter exams based on status
  const categorizedExams = exams.map((exam) => {
    const calculated = getStatus(exam);
    return { exam, status: calculated.status };
  });

  const activeExams = categorizedExams.filter(
    (item) => item.status === "UPCOMING" || item.status === "ONGOING" || item.status === "LATE"
  );

  const completedExams = categorizedExams.filter(
    (item) => item.status === "COMPLETED"
  );

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "active" && styles.activeTabButton]}
          onPress={() => setActiveTab("active")}
        >
          <Text style={[styles.tabText, activeTab === "active" && styles.activeTabText]}>
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
        <ActivityIndicator color={Colors.primary} size="large" style={styles.spinner} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[Colors.primary]} />
          }
        >
          {activeTab === "active" ? (
            activeExams.length === 0 ? (
              <EmptyExamState message="No ongoing or upcoming exams." />
            ) : (
              activeExams.map(({ exam, status }) => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  status={status}
                  onStart={handleStartAttempt}
                />
              ))
            )
          ) : completedExams.length === 0 ? (
            <EmptyExamState message="No completed exams found." />
          ) : (
            completedExams.map(({ exam, status }) => (
              <ExamCard
                key={exam.id}
                exam={exam}
                status={status}
                onStart={handleStartAttempt}
              />
            ))
          )}
        </ScrollView>
      )}

      <ExamInstructionsModal
        visible={modalVisible}
        exam={selectedInstructionExam}
        onClose={() => setModalVisible(false)}
        onConfirm={handleInstructionsConfirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
  },
  activeTabButton: {
    borderBottomWidth: 3,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "700",
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: "800",
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  spinner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
