import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react-native";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { PracticeQuizQuestion } from "../services/practiceMcq.service";

const { width } = Dimensions.get("window");

interface MCQPlayViewProps {
  questions: PracticeQuizQuestion[];
  onSubmit: (answers: Array<{ questionId: string; selectedAnswer: string }>) => void;
  onCancel: () => void;
}

export const MCQPlayView: React.FC<MCQPlayViewProps> = ({
  questions,
  onSubmit,
  onCancel,
}) => {
  const { colors } = useAppTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  const handleSelectOption = (label: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: label,
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    const answersArray = questions.map((q) => ({
      questionId: q.id,
      selectedAnswer: selectedAnswers[q.id] || "",
    }));
    onSubmit(answersArray);
  };

  const progress = (currentIndex + 1) / totalQuestions;
  const currentSelection = selectedAnswers[currentQuestion.id];

  return (
    <View style={styles.container}>
      {/* Top Progress Header */}
      <View style={styles.progressHeader}>
        <View style={styles.progressInfo}>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            Question {currentIndex + 1} of {totalQuestions}
          </Text>
          <Text style={[styles.remainingText, { color: colors.primary }]}>
            {totalQuestions - Object.keys(selectedAnswers).length} remaining
          </Text>
        </View>
        <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progress * 100}%`, backgroundColor: colors.primary },
            ]}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Question Card */}
        <View style={[styles.questionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.questionText, { color: colors.textPrimary }]}>
            {currentQuestion.questionText}
          </Text>
        </View>

        {/* Options List */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((opt: any, index: number) => {
            let label = ["A", "B", "C", "D"][index] || String(index + 1);
            let text = "";
            let value = "";

            if (typeof opt === "string") {
              text = opt;
              value = opt;
            } else if (opt && typeof opt === "object") {
              label = opt.label || label;
              text = opt.text || "";
              value = opt.text || opt.label || "";
            }

            const isSelected = currentSelection === value;
            return (
              <TouchableOpacity
                key={value}
                onPress={() => handleSelectOption(value)}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: isSelected ? colors.primarySurface : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.optionLabelContainer,
                    {
                      backgroundColor: isSelected ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.optionLabelText,
                      { color: isSelected ? "#FFF" : colors.textPrimary },
                    ]}
                  >
                    {label}
                  </Text>
                </View>
                <Text style={[styles.optionText, { color: colors.textPrimary }]}>
                  {text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Navigation Controls */}
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          onPress={handlePrevious}
          disabled={currentIndex === 0}
          style={[
            styles.controlButton,
            styles.prevButton,
            {
              borderColor: colors.border,
              opacity: currentIndex === 0 ? 0.4 : 1,
            },
          ]}
        >
          <ArrowLeft size={18} color={colors.textPrimary} />
          <Text style={[styles.controlButtonText, { color: colors.textPrimary, marginLeft: 8 }]}>
            Previous
          </Text>
        </TouchableOpacity>

        {currentIndex === totalQuestions - 1 ? (
          <TouchableOpacity
            onPress={handleSubmit}
            style={[styles.controlButton, styles.submitButton, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.submitButtonText}>Submit Quiz</Text>
            <CheckCircle size={18} color="#FFF" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleNext}
            style={[styles.controlButton, styles.nextButton, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.nextButtonText}>Next</Text>
            <ArrowRight size={18} color="#FFF" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
  },
  remainingText: {
    fontSize: 12,
    fontWeight: "700",
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    width: "100%",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  questionCard: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  questionText: {
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 26,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  optionLabelContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  optionLabelText: {
    fontSize: 14,
    fontWeight: "700",
  },
  optionText: {
    fontSize: 15,
    fontWeight: "500",
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  controlButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 20,
  },
  prevButton: {
    borderWidth: 1,
    flex: 1.1,
    marginRight: 12,
  },
  nextButton: {
    flex: 1.1,
  },
  submitButton: {
    flex: 1.3,
  },
  controlButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
  nextButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
