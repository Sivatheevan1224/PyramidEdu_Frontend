import React, { useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../auth";
import { useExamStore } from "../store/examStore";
import { Exam } from "../types";
import { ExamService } from "../services/api";
import { useExamStatus } from "../hooks";
import { ExamCard, ExamInstructionsModal, EmptyExamState } from "../components";
import { useAppTheme } from "../../../hooks/useAppTheme";

export function ExamListPage() {
  const { accessToken } = useAuth();
  const { colors } = useAppTheme();
  const {
    setCurrentExam,
    setQuestions,
    setActiveView: setView,
    loadDraftFromStorage,
    viewResult,
  } = useExamStore();

  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "late" | "uncompleted" | "completed">("active");

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
    (item) => item.status === "UPCOMING" || item.status === "ONGOING"
  );

  const lateExams = categorizedExams.filter(
    (item) => item.status === "LATE"
  );

  const completedExams = categorizedExams.filter(
    (item) => item.status === "COMPLETED"
  );

  const uncompletedExams = categorizedExams.filter(
    (item) => item.status === "UNCOMPLETED"
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Tabs */}
      <View style={[styles.tabContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "active" && { borderBottomWidth: 3, borderBottomColor: colors.primary }]}
          onPress={() => setActiveTab("active")}
        >
          <Text style={[styles.tabText, { color: colors.textSecondary }, activeTab === "active" && { color: colors.primary, fontWeight: "800" }]}>
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "late" && { borderBottomWidth: 3, borderBottomColor: colors.primary }]}
          onPress={() => setActiveTab("late")}
        >
          <Text style={[styles.tabText, { color: colors.textSecondary }, activeTab === "late" && { color: colors.primary, fontWeight: "800" }]}>
            Late
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "completed" && { borderBottomWidth: 3, borderBottomColor: colors.primary }]}
          onPress={() => setActiveTab("completed")}
        >
          <Text style={[styles.tabText, { color: colors.textSecondary }, activeTab === "completed" && { color: colors.primary, fontWeight: "800" }]}>
            Completed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "uncompleted" && { borderBottomWidth: 3, borderBottomColor: colors.primary }]}
          onPress={() => setActiveTab("uncompleted")}
        >
          <Text style={[styles.tabText, { color: colors.textSecondary }, activeTab === "uncompleted" && { color: colors.primary, fontWeight: "800" }]}>
            Uncompleted
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} size="large" style={styles.spinner} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[colors.primary]} />
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
          ) : activeTab === "late" ? (
            lateExams.length === 0 ? (
              <EmptyExamState message="No late exams." />
            ) : (
              lateExams.map(({ exam, status }) => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  status={status}
                  onStart={handleStartAttempt}
                />
              ))
            )
          ) : activeTab === "completed" ? (
            completedExams.length === 0 ? (
              <EmptyExamState message="No completed exams found." />
            ) : (
              completedExams.map(({ exam, status }) => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  status={status}
                  onStart={(exam: Exam) => {
                    viewResult(exam.id);
                  }}
                />
              ))
            )
          ) : uncompletedExams.length === 0 ? (
            <EmptyExamState message="No uncompleted exams." />
          ) : (
            uncompletedExams.map(({ exam, status }) => (
              <ExamCard
                key={exam.id}
                exam={exam}
                status={status}
                onStart={() => {
                  // Do nothing since they cannot enter the exam
                }}
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
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "700",
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
