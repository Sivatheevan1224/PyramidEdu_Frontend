import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../auth";
import { Exam } from "../types";
import { ExamService } from "../services/api";
import { useExamStatus } from "../hooks";
import { ExamCard, EmptyExamState } from "../components";
import { useAppTheme } from "../../../hooks/useAppTheme";

export function ExamHistoryPage() {
  const { accessToken } = useAuth();
  const { colors } = useAppTheme();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(false);
  const { getStatus } = useExamStatus();

  useEffect(() => {
    const loadHistory = async () => {
      if (!accessToken) return;
      setLoading(true);
      try {
        const data = await ExamService.getAvailableExams(accessToken);
        setExams(data);
      } catch (err) {
        console.error("Error loading exam history:", err);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, [accessToken]);

  const completedExams = exams
    .map((exam) => ({ exam, status: getStatus(exam).status }))
    .filter((item) => item.status === "COMPLETED");

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Exam History</Text>
      {loading ? (
        <ActivityIndicator color={colors.primary} size="large" style={styles.spinner} />
      ) : completedExams.length === 0 ? (
        <EmptyExamState message="No completed exams in your history." />
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {completedExams.map(({ exam, status }) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              status={status}
              onStart={() => {}}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 16,
  },
  scroll: {
    paddingBottom: 40,
  },
  spinner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
