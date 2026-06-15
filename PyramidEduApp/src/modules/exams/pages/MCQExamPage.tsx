import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
import { Colors } from "../../../constants/colors";

export function MCQExamPage() {
  const { accessToken } = useAuth();
  const { currentExam, questions, setView } = useExamStore();

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
      <View style={[styles.container, { justifyContent: "center", alignItems: "center", padding: 24 }]}>
        <Text style={{ fontSize: 18, fontWeight: "700", color: Colors.textPrimary, marginBottom: 8 }}>
          No Questions Found
        </Text>
        <Text style={{ fontSize: 14, color: Colors.textSecondary, textAlign: "center", marginBottom: 24 }}>
          This exam currently has no multiple-choice questions configured.
        </Text>
        <TouchableOpacity
          style={{ backgroundColor: Colors.primary, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 }}
          onPress={() => setView("list")}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>Go Back</Text>
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
    setConfirmVisible(false);
    if (accessToken) {
      submitMCQ(accessToken);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Info */}
      <View style={styles.header}>
        <View style={styles.titleCol}>
          <Text style={styles.examTitle} numberOfLines={1}>
            {currentExam.examTitle}
          </Text>
          <Text style={styles.examSubject}>
            {currentExam.subject?.subjectName || "Subject"}
          </Text>
        </View>
        <ExamTimer remainingSeconds={remainingTime} formattedTime={formattedTime} />
      </View>

      {/* Progress & Navigator */}
      <View style={styles.navSection}>
        <View style={styles.progressRow}>
          <Text style={styles.progressText}>
            Question <Text style={styles.boldText}>{currentIdx + 1}</Text> of{" "}
            <Text style={styles.boldText}>{totalQuestions}</Text>
          </Text>
          <Text style={styles.marksText}>{currentQuestion.marks} Mark(s)</Text>
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
            <Text style={styles.questionText}>{currentQuestion.questionText}</Text>
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
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navBtn, currentIdx === 0 && styles.disabledBtn]}
          onPress={handlePrev}
          disabled={currentIdx === 0}
        >
          <ArrowLeft size={20} color={currentIdx === 0 ? Colors.textTertiary : Colors.textPrimary} />
          <Text style={[styles.navBtnText, currentIdx === 0 && styles.disabledText]}>Previous</Text>
        </TouchableOpacity>

        {currentIdx === totalQuestions - 1 ? (
          <TouchableOpacity style={[styles.navBtn, styles.submitBtn]} onPress={handleManualSubmit}>
            <Text style={styles.submitBtnText}>Submit Exam</Text>
            <Check size={18} color="#ffffff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.navBtn} onPress={handleNext}>
            <Text style={styles.navBtnText}>Next</Text>
            <ArrowRight size={20} color={Colors.textPrimary} />
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
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  titleCol: {
    flex: 1,
    marginRight: 12,
  },
  examTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  examSubject: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  navSection: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  progressText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  boldText: {
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  marksText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.primary,
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
    color: Colors.textPrimary,
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
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  navBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
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
    color: Colors.textPrimary,
  },
  disabledText: {
    color: Colors.textTertiary,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  submitBtnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
});
