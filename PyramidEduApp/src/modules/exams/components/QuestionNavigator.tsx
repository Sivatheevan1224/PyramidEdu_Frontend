import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { Colors } from "../../../constants/colors";

interface QuestionNavigatorProps {
  total: number;
  currentIdx: number;
  answers: Record<string, string>;
  questions: any[];
  onSelect: (idx: number) => void;
}

export function QuestionNavigator({
  total,
  currentIdx,
  answers,
  questions,
  onSelect,
}: QuestionNavigatorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Review Questions</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.grid}
      >
        {questions.map((q, idx) => {
          const isCurrent = idx === currentIdx;
          const isAnswered = !!answers[q.id];

          let boxStyle = styles.unansweredBox;
          let textStyle = styles.unansweredText;

          if (isAnswered) {
            boxStyle = styles.answeredBox;
            textStyle = styles.answeredText;
          }

          if (isCurrent) {
            boxStyle = styles.currentBox;
            textStyle = styles.currentText;
          }

          return (
            <TouchableOpacity
              key={q.id}
              style={[styles.box, boxStyle]}
              onPress={() => onSelect(idx)}
            >
              <Text style={[styles.text, textStyle]}>{idx + 1}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  title: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: "row",
    gap: 8,
    paddingRight: 16,
  },
  box: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  text: {
    fontSize: 14,
    fontWeight: "700",
  },
  unansweredBox: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  unansweredText: {
    color: Colors.textPrimary,
  },
  answeredBox: {
    backgroundColor: "#dcfce7",
    borderColor: "#86efac",
  },
  answeredText: {
    color: "#166534",
  },
  currentBox: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  currentText: {
    color: "#ffffff",
  },
});
