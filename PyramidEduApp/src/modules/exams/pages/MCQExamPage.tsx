import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { ArrowLeft, ArrowRight, Check } from "lucide-react-native";
import { useAuth } from "../../auth";
import { useExamStore } from "../store/examStore";
import { useExamTimer, useMCQExam, useExamSubmission } from "../hooks";
import {
  ExamTimer,
  QuestionNavigator,
  MCQOptionItem,
  ImageQuestionViewer,
  SubmissionConfirmationModal,
} from "../components";
import { useAppTheme } from "../../../hooks/useAppTheme";

export function MCQExamPage() {
  const { accessToken } = useAuth();
  const { colors } = useAppTheme();
  const { currentExam, questions, setActiveView: setView } = useExamStore();

  const {
    currentIdx,
    currentQuestion,
    totalQuestions,
    answers,
    setAnswer,
    handleNext,
    handlePrev,
    selectQuestion,
    unansweredQuestions,
  } = useMCQExam();

  const { submitMCQ, submissionState } = useExamSubmission();

  const handleAutoSubmit = () => {
    if (accessToken) {
      submitMCQ(accessToken);
    }
  };

  const { remainingTime, formattedTime } = useExamTimer(handleAutoSubmit);
  const [confirmVisible, setConfirmVisible] = useState(false);

  if (!currentExam) return null;

  if (!currentQuestion) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: "center", alignItems: "center", padding: 24 }]}>
        <Text style={{ fontSize: 18, fontWeight: "700", color: colors.textPrimary, marginBottom: 8 }}>
          No Questions Found
        </Text>
        <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: "center", marginBottom: 24 }}>
          This exam currently has no multiple-choice questions configured.
        </Text>
        <TouchableOpacity
          style={{ backgroundColor: colors.primary, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 }}
          onPress={() => setView("list")}
        >
          <Text style={{ color: colors.surface, fontWeight: "700" }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Parse options safely
  let parsedOptions: any[] = [];
  if (currentQuestion.options) {
    parsedOptions =
      typeof currentQuestion.options === "string"
        ? JSON.parse(currentQuestion.options)
        : currentQuestion.options;
  }

  const handleManualSubmit = () => {
    setConfirmVisible(true);
  };

  const handleConfirmSubmit = () => {
    if (accessToken) {
      submitMCQ(accessToken);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Info */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.titleCol}>
          <Text style={[styles.examTitle, { color: colors.textPrimary }]} numberOfLines={1}>
            {currentExam.examTitle}
          </Text>
          <Text style={[styles.examSubject, { color: colors.textSecondary }]}>
            {currentExam.subject?.subjectName || "Subject"}
          </Text>
        </View>
        <ExamTimer remainingSeconds={remainingTime} formattedTime={formattedTime} />
      </View>

      {/* Progress & Navigator */}
      <View style={[styles.navSection, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.progressRow}>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            Question <Text style={[styles.boldText, { color: colors.textPrimary }]}>{currentIdx + 1}</Text> of{" "}
            <Text style={[styles.boldText, { color: colors.textPrimary }]}>{totalQuestions}</Text>
          </Text>
          <Text style={[styles.marksText, { color: colors.primary }]}>{currentQuestion.marks} Mark(s)</Text>
        </View>
        <QuestionNavigator
          total={totalQuestions}
          currentIdx={currentIdx}
          answers={answers}
          questions={questions}
          onSelect={selectQuestion}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Question Text / Diagram */}
        <View style={styles.questionContainer}>
          {currentQuestion.imageUrl && (
            <ImageQuestionViewer imageUrl={currentQuestion.imageUrl} />
          )}
          {currentQuestion.questionText && (
            <Text style={[styles.questionText, { color: colors.textPrimary }]}>{currentQuestion.questionText}</Text>
          )}
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {parsedOptions.map((opt: any) => {
            const isSelected = answers[currentQuestion.id] === opt.id;
            return (
              <MCQOptionItem
                key={opt.id}
                label={opt.id}
                text={opt.text}
                isSelected={isSelected}
                onPress={() => setAnswer(currentQuestion.id, opt.id)}
              />
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Nav Bar */}
      <View style={[styles.bottomNav, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.navBtn, { backgroundColor: colors.background, borderColor: colors.border }, currentIdx === 0 && styles.disabledBtn]}
          onPress={handlePrev}
          disabled={currentIdx === 0}
        >
          <ArrowLeft size={20} color={currentIdx === 0 ? colors.textTertiary : colors.textPrimary} />
          <Text style={[styles.navBtnText, { color: colors.textPrimary }, currentIdx === 0 && { color: colors.textTertiary }]}>Previous</Text>
        </TouchableOpacity>

        {currentIdx === totalQuestions - 1 ? (
          <TouchableOpacity 
            style={[styles.navBtn, styles.submitBtn, { backgroundColor: colors.primary, borderColor: colors.primary }]} 
            onPress={handleManualSubmit}
            disabled={submissionState === "submitting"}
          >
            {submissionState === "submitting" ? (
              <>
                <Text style={[styles.submitBtnText, { color: colors.surface }]}>Submitting...</Text>
                <ActivityIndicator color={colors.surface} size="small" style={{ marginLeft: 8 }} />
              </>
            ) : (
              <>
                <Text style={[styles.submitBtnText, { color: colors.surface }]}>Submit Exam</Text>
                <Check size={18} color={colors.surface} />
              </>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.navBtn, { backgroundColor: colors.background, borderColor: colors.border }]} onPress={handleNext}>
            <Text style={[styles.navBtnText, { color: colors.textPrimary }]}>Next</Text>
            <ArrowRight size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        )}
      </View>

      <SubmissionConfirmationModal
        visible={confirmVisible}
        unansweredCount={unansweredQuestions.length}
        isSubmitting={submissionState === "submitting"}
        onClose={() => setConfirmVisible(false)}
        onConfirm={handleConfirmSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  titleCol: {
    flex: 1,
    marginRight: 12,
  },
  examTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  examSubject: {
    fontSize: 12,
    fontWeight: "600",
  },
  navSection: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  progressText: {
    fontSize: 13,
  },
  boldText: {
    fontWeight: "800",
  },
  marksText: {
    fontSize: 12,
    fontWeight: "700",
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  questionContainer: {
    marginBottom: 16,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
  },
  navBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    gap: 8,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  navBtnText: {
    fontSize: 14,
    fontWeight: "700",
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
