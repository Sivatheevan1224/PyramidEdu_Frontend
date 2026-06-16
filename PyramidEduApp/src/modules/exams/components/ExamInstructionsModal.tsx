import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { Clock, Award, ShieldAlert } from "lucide-react-native";
import { Exam } from "../types";
import { useAppTheme } from "../../../hooks/useAppTheme";

interface ExamInstructionsModalProps {
  visible: boolean;
  exam: Exam | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function ExamInstructionsModal({
  visible,
  exam,
  onClose,
  onConfirm,
}: ExamInstructionsModalProps) {
  const { colors } = useAppTheme();
  if (!exam) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
          <Text style={[styles.title, { color: colors.primary }]}>Exam Instructions</Text>
          <Text style={[styles.examTitle, { color: colors.textPrimary }]}>{exam.examTitle}</Text>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            <View style={styles.metaRow}>
              <View style={[styles.metaBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Clock size={20} color={colors.primary} />
                <Text style={[styles.metaVal, { color: colors.textPrimary }]}>{exam.duration} mins</Text>
                <Text style={[styles.metaLbl, { color: colors.textSecondary }]}>Duration</Text>
              </View>

              <View style={[styles.metaBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Award size={20} color={colors.primary} />
                <Text style={[styles.metaVal, { color: colors.textPrimary }]}>{exam.totalMarks} Pts</Text>
                <Text style={[styles.metaLbl, { color: colors.textSecondary }]}>Total Marks</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Rules & Regulations</Text>
              
              <View style={styles.bulletRow}>
                <ShieldAlert size={16} color="#e11d48" style={styles.bulletIcon} />
                <Text style={[styles.bulletText, { color: colors.textSecondary }]}>
                  Once you tap "Start Exam", the timer will begin and cannot be paused.
                </Text>
              </View>

              <View style={styles.bulletRow}>
                <ShieldAlert size={16} color="#e11d48" style={styles.bulletIcon} />
                <Text style={[styles.bulletText, { color: colors.textSecondary }]}>
                  Navigating away from the screen or closing the app will NOT pause the timer.
                </Text>
              </View>

              {exam.examType === "MCQ" ? (
                <>
                  <View style={styles.bulletRow}>
                    <ShieldAlert size={16} color={colors.primary} style={styles.bulletIcon} />
                    <Text style={[styles.bulletText, { color: colors.textSecondary }]}>
                      Your responses will be autosaved locally.
                    </Text>
                  </View>
                  <View style={styles.bulletRow}>
                    <ShieldAlert size={16} color={colors.primary} style={styles.bulletIcon} />
                    <Text style={[styles.bulletText, { color: colors.textSecondary }]}>
                      The exam will submit automatically when the timer reaches zero.
                    </Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.bulletRow}>
                    <ShieldAlert size={16} color={colors.primary} style={styles.bulletIcon} />
                    <Text style={[styles.bulletText, { color: colors.textSecondary }]}>
                      Write your answers clearly on sheets of paper.
                    </Text>
                  </View>
                  <View style={styles.bulletRow}>
                    <ShieldAlert size={16} color={colors.primary} style={styles.bulletIcon} />
                    <Text style={[styles.bulletText, { color: colors.textSecondary }]}>
                      Use an external scanner app (e.g. Adobe Scan, CamScanner) to produce a PDF file.
                    </Text>
                  </View>
                  <View style={styles.bulletRow}>
                    <ShieldAlert size={16} color={colors.primary} style={styles.bulletIcon} />
                    <Text style={[styles.bulletText, { color: colors.textSecondary }]}>
                      Upload the generated PDF file here before submitting. Max size is 20MB.
                    </Text>
                  </View>
                </>
              )}
            </View>
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity style={[styles.cancelBtn, { backgroundColor: colors.surfaceAlt }]} onPress={onClose}>
              <Text style={[styles.cancelBtnText, { color: colors.textPrimary }]}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: colors.primary }]} onPress={onConfirm}>
              <Text style={[styles.confirmBtnText, { color: colors.surface }]}>Start Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "85%",
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  examTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 20,
  },
  scroll: {
    marginBottom: 24,
  },
  metaRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
  },
  metaBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  metaVal: {
    fontSize: 16,
    fontWeight: "800",
    marginTop: 8,
    marginBottom: 2,
  },
  metaLbl: {
    fontSize: 11,
    fontWeight: "600",
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  bulletIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: "700",
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmBtnText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
